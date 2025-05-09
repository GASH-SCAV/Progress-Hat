import dotenv from "dotenv";
dotenv.config();
import fetch from "node-fetch";

const getTasksForProject = async (projectId) => {
  const response = await fetch(
    `https://app.asana.com/api/1.0/projects/${projectId}/tasks?opt_fields=name,completed,custom_fields`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.ASANA_TOKEN}`
      }
    }
  );

  if (!response.ok) {
    throw new Error(`Error fetching tasks: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data;
};

const extractPoints = (task) => {
  const pointsField = task.custom_fields.find(
    (field) => field.name === "Points"
  );
  return pointsField ? pointsField.number_value : null;
};

const getTasksWithPoints = async (projectId) => {
  const tasks = await getTasksForProject(projectId);
  return tasks.map((task) => ({
    name: task.name,
    completed: task.completed,
    points: extractPoints(task)
  }));
};

export async function getProgress() {
  const projectId = process.env.PROJECT_ID;
  const tasks = await getTasksWithPoints(projectId);
  const completedTasks = tasks.filter((task) => task.completed);
  const totalPointsAvailableForCompletedItems = completedTasks.reduce(
    (acc, task) => {
      if (task.points) {
        return acc + task.points;
      }
      return acc;
    },
    0
  );
  const totalPointsAvailable = tasks.reduce((acc, task) => {
    if (task.points) {
      return acc + task.points;
    }
    return acc;
  }, 0);
  return {
    completedItems: completedTasks.length,
    totalPointsAvailable,
    totalPointsAvailableForCompletedItems,
    percentagePointsEarned: (
      (totalPointsAvailableForCompletedItems / totalPointsAvailable) *
      100
    ).toFixed(18)
  };
}

getProgress().then(console.log);

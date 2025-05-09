// Fetch progress data and populate the page
const expectedReturn = 0.15;

fetch("/.json")
  .then((response) => response.json())
  .then((data) => {
    window.data = data;
    const progressDiv = document.getElementById("progress");
    progressDiv.innerHTML = `
        <div class="button">Announce Progress 🔊</div>
        <div class="bullet"><div class="title">Completed Items</div><div class="value">${
          data.completedItems
        }</div></div>
        <div class="bullet"><div class="title">Total Points Available</div><div class="value">${
          data.totalPointsAvailable
        }</div></div>
        <div class="bullet"><div class="title">Total Possible Points Earned</div><div class="value">${
          data.totalPointsAvailableForCompletedItems
        }</div></div>
        <div class="bullet"><div class="title">Total Likely Points Earned</div><div class="value">${
          parseFloat(data.totalPointsAvailableForCompletedItems) *
          expectedReturn
        }</div></div>
        <div class="bullet"><div class="title">Total Possible Percentage Earned</div><div class="value">${
          data.percentagePointsEarned
        }%</div></div>
      `;
    document.querySelector(".button").addEventListener("click", () => {
      var msg = new SpeechSynthesisUtterance();
      const {
        completedItems,
        totalPointsAvailableForCompletedItems,
        percentagePointsEarned
      } = window.data;
      msg.text = `The National Bearonautics and Salmon Administration has completed ${completedItems} items worth ${totalPointsAvailableForCompletedItems} points, which is ${percentagePointsEarned}% of the available points. At this rate, they are expected to lose the Hunt.`;
      window.speechSynthesis.speak(msg);
    });
  })
  .catch((error) => {
    console.error("Error fetching progress data:", error);
  });

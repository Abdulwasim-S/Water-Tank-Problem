//Chart initial state
let inputChart = null;
let outputChart = null;
//Calculate event
document
  .getElementById("btn")
  .addEventListener("click", () => calculate(false));

//Calculate Event Function
function calculate(inital) {
  try {
    document.getElementById("warning").innerHTML = "";

    //Getting input values
    const inputArray =
      inital ||
      document.getElementById("input-field").value.split(",").map(Number);

    //Check to prevent invalid inputs
    if (inputArray.includes(undefined || NaN)) {
      return (document.getElementById("warning").innerHTML =
        "Invalid input - Enter number");
    }
    //Getting output
    const waterLevels = calculateWaterUnits(inputArray);

    //Chart generation
    if (inputChart != null) {
      //Destory input chart canvas if already in use
      inputChart.destroy();
    }
    generateChart("input-chart", inputArray, waterLevels);
    if (outputChart != null) {
      //Destory input chart canvas if already in use
      outputChart.destroy();
    }
    generateChart("output-chart", inputArray, waterLevels);

    //Total water units update
    document.getElementById("total-units").innerHTML = waterLevels.reduce(
      (a, b) => a + b
    );
  } catch (error) {
    console.log(error);
  }
}

//Function to calculate the units of water stored in-between the blocks
function calculateWaterUnits(blocks) {
  let n = blocks.length;
  let leftMax = new Array(n).fill(0);
  let rightMax = new Array(n).fill(0);

  //Left and Right maximum heighted blocks finding
  leftMax[0] = blocks[0];
  for (let i = 1; i < n; i++) {
    leftMax[i] = Math.max(leftMax[i - 1], blocks[i]);
  }

  rightMax[n - 1] = blocks[n - 1];
  for (let i = n - 2; i >= 0; i--) {
    rightMax[i] = Math.max(rightMax[i + 1], blocks[i]);
  }

  //To calculate water stored in between the blocks
  let waterUnitsInBlocks = [];
  for (let i = 0; i < n; i++) {
    waterUnitsInBlocks.push(Math.min(leftMax[i], rightMax[i]) - blocks[i]);
  }
  return waterUnitsInBlocks;
}

//Function to create chart with respect to the input blocks
function generateChart(elementID, blocks, waterUnit) {
  // setup
  const labelValues = new Array(blocks.length).fill("");
  const blockOpacity = elementID === "input-chart" ? 0.5 : 0;
  const data = {
    labels: labelValues,
    datasets: [
      {
        label: elementID === "input-chart" ? "Block" : "",
        data: blocks,
        backgroundColor: `rgba(250, 250, 0, ${blockOpacity})`,
        borderColor: "rgba(0, 0, 0, 1)",
        categoryPercentage: 1.0,
        barPercentage: 1.0,
      },
      {
        label: "Water",
        data: waterUnit,
        backgroundColor: "rgba(0, 125, 250, 0.5)",
        borderColor: "rgba(0, 0, 0, 1)",
        categoryPercentage: 1,
        barPercentage: 1.0,
      },
    ],
  };

  // config
  const config = {
    type: "bar",
    data,
    options: {
      scales: {
        x: {
          stacked: true,
          beginAtZero: true,
          grid: {
            color: "black",
          },
        },
        y: {
          stacked: true,
          beginAtZero: true,
          grid: {
            color: "black",
          },
        },
      },
    },
  };

  // render init block
  myChart = new Chart(
    document.getElementById(elementID).getContext("2d"),
    config
  );
  //Updating wheather the respective canvas in use or not
  elementID === "input-chart"
    ? (inputChart = myChart)
    : (outputChart = myChart);
}
//For inital loading
let initalValue = [0, 4, 0, 0, 0, 6, 0, 6, 4, 0];
calculate(initalValue);

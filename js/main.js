const MINTEMP = 35;
const MAXTEMP = 99;
let isSimulationRunning = false;

let inputContainer = document.querySelector(".input-container");
inputContainer.addEventListener("click", changeTemp);
let setTempInput = inputContainer.firstElementChild.nextElementSibling;
let minus = inputContainer.firstElementChild;
let plus = inputContainer.lastElementChild;

function changeTemp(e) {
  let temp = +setTempInput.value.substring(0, setTempInput.value.indexOf(' '));
  let unit = ' ' + setTempInput.value.substring(setTempInput.value.indexOf(' ') + 1); // The unit for the temperature
  if(e.target == minus && temp > MINTEMP) {
    temp--;
    setTempInput.value = temp + unit;
  } else if(e.target == plus && temp < MAXTEMP) {
    temp++;
    setTempInput.value = temp + unit;
  }
  if(temp == MINTEMP){
    minus.disabled = true;
  }
  else if(temp == MAXTEMP){
    plus.disabled = true;
  } 
  else{
    plus.disabled = false;
    minus.disabled = false;
  }
  updateTempChangeDirection(); // Immediately update the current temperature UI
}

updateClock(); // Run this on load so the user sees the date/time immediately without having to wait the first second for it to update.
setInterval(updateClock, 1000);
function updateClock() {
  if(isSimulationRunning == false){
    let date = new Date();
    document.getElementsByClassName("datetimeDisplay")[0].innerHTML =
    date.toLocaleDateString([], { month: '2-digit', day: 'numeric', year: 'numeric', hour: "numeric", minute: "2-digit" });
  }
}

let simStartDate = new Date(Date.UTC(2022, 11, 1, 5, 0, 0));
let simStepCount = 0;
let simDate = new Date(Date.UTC(2022, 11, 1, 5, 0, 0));
let simDateOptions = { month: '2-digit', day: 'numeric', year: 'numeric', hour: "numeric", minute: "2-digit" };
let simStartButton = document.getElementById("simStart");
let drunkToday = document.getElementsByClassName("drunkToday")[0];
let dailyGoal = document.getElementsByClassName("goalVol")[0];
let batteryLevel = document.getElementsByClassName("battery-level")[0];
let meter = document.getElementsByClassName("waterQuantity")[0];
let checkmark = document.getElementsByClassName("checkmark")[0];
let currentTemp = document.getElementsByClassName("currentTemp")[0];
let tempChangeDirection = document.getElementsByClassName("tempChangeDirection")[0];
let bluetoothIcon = document.getElementsByClassName("bluetoothIcon")[0];
let currentlyCharging = false;
let simulation;
let heatAndCoolInterval = setInterval(heatAndCool, 4000);

function startSimulation(){
  if (isSimulationRunning == false){
    isSimulationRunning = true;
    simStartButton.innerHTML = "Simulation Running";
    simStartButton.disabled = true;
    simDate = simStartDate;
    simStepCount = 0;
    drunkToday.innerHTML = 0;
    meter.value = 0;
    heatCoolIntervalSpeed = 40;
    batteryLevel.style.height = '55%';
    plus.style.pointerEvents = "none";
    minus.style.pointerEvents = "none";
    clearInterval(heatAndCoolInterval);
    heatAndCoolInterval = setInterval(heatAndCool, 80);
    document.getElementsByClassName("datetimeDisplay")[0].innerHTML = simStartDate.toLocaleDateString('en-US', simDateOptions);
    simulation = setInterval(simulationStep, 20);
  }
}

function heatAndCool() {
  let currTemp = +currentTemp.innerHTML;
  let setTemp = +setTempInput.value.substring(0, setTempInput.value.indexOf(' '));
  if(setTemp < currTemp){
    currentTemp.innerHTML--;
  }else if(setTemp > currTemp){
    currentTemp.innerHTML++;
  }
  updateTempChangeDirection();
}

updateTempChangeDirection();
function updateTempChangeDirection(){
  let currTemp = +currentTemp.innerHTML;
  let setTemp = +setTempInput.value.substring(0, setTempInput.value.indexOf(' '));
  if(setTemp < currTemp){
    tempChangeDirection.innerHTML = "&#8681;"; // down arrow
    tempChangeDirection.style.color = "blue";
  }else if(setTemp > currTemp){
    tempChangeDirection.innerHTML = "&#8679;"; // up arrow
    tempChangeDirection.style.color = "red";
  }
  // always check for equality after the currentTemp changes for an immediate update in the UI
  if(+setTempInput.value.substring(0, setTempInput.value.indexOf(' ')) == +currentTemp.innerHTML){
    tempChangeDirection.innerHTML = "";
  }
}

function addMinutes(date, minutes) {
  simDate = new Date(date.getTime() + minutes * 60000);
  document.getElementsByClassName("datetimeDisplay")[0].innerHTML = simDate.toLocaleDateString('en-US', simDateOptions);
}

function setTemp(temp) {
  let unit = ' ' + setTempInput.value.substring(setTempInput.value.indexOf(' ') + 1); // The unit for the temperature
  if(temp >= MINTEMP && temp <= MAXTEMP) {
    setTempInput.value = temp + unit;
  }
  if(temp == MINTEMP){
    minus.disabled = true;
  }
  else if(temp == MAXTEMP){
    plus.disabled = true;
  } 
  else{
    plus.disabled = false;
    minus.disabled = false;
  }
  updateTempChangeDirection(); // Immediately update the current temperature UI
}

function adjustBatteryPercentage(){
  if (simStepCount % 20 == 0){
      let batteryHeight = +batteryLevel.style.height.replace("%", "");
      let newHeight = batteryHeight;
      if(currentlyCharging == true && batteryHeight < 100){
        newHeight = newHeight + 2;
        batteryLevel.style.height = newHeight + '%';
      }else if(currentlyCharging == false && batteryHeight > 0){
        newHeight--;
        batteryLevel.style.height = newHeight + '%';
      }
      if(newHeight <= 20){
        batteryLevel.classList.add("alert");
        batteryLevel.classList.remove("warn");
      }else if(newHeight <= 40){
        batteryLevel.classList.add("warn");
        batteryLevel.classList.remove("alert");
      }else{
        batteryLevel.classList.remove("warn");
        batteryLevel.classList.remove("alert");
      }
    }
}

// Contains the data needed for the simulation.
// Format: simStep: [setTemperature, waterToAddToMeter, isCharging, connectedToBluetooth]
let simulationData = {
  0: [45, 0, false],
  400: [65, 1000, false, false],
  600: [45, -500, false, true],
  800: [40, -200, true, false],
  950: [45, -300, true, false],
  1150: [63, 400, true, true],
  1300: [59, 600, true, false],
};

function simulationStep(){
  if(simStepCount == 1440){
    console.log("Simulation finished!");
    updateClock();
    checkmark.style.display = "none";
    drunkToday.innerHTML = 500;
    batteryLevel.style.height = '55%';
    isSimulationRunning = false;
    simStartButton.disabled = false;
    setTemp(45);
    clearInterval(heatAndCoolInterval);
    heatAndCoolInterval = setInterval(heatAndCool, 4000);
    plus.style.pointerEvents = "auto";
    minus.style.pointerEvents = "auto";
    bluetoothIcon.style.color = "black";
    simStartButton.innerHTML = "Start 24hr Simulation";
    clearInterval(simulation);
  }else{
    //console.log("Simulation Step " + simStepCount);
    addMinutes(simDate, 1);
    adjustBatteryPercentage();
    let simDataAtStep = simulationData[simStepCount]
    if(simDataAtStep){
      currentlyCharging = simDataAtStep[2];
      setTemp(simDataAtStep[0]);
      meter.value = +meter.value + simDataAtStep[1];
      if (simDataAtStep[1] < 0){ // Implying water was drunk from the bottle
        drunkToday.innerHTML = +drunkToday.innerHTML - simDataAtStep[1];
        if (+drunkToday.innerHTML >= +dailyGoal.innerHTML){
          checkmark.style.display = "inline";
        }
        else{
          checkmark.style.display = "none";
        }
      }
      if (simDataAtStep[3] == true){
        bluetoothIcon.style.color = "blue";
      }else{
        bluetoothIcon.style.color = "black";
      }
    }
    simStepCount++;
  }
}
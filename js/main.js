let minTemp = 35;
let maxTemp = 99;
let isSimulationRunning = false;

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
let dailyGoalInput = document.getElementsByName("dailyGoalInput")[0];
let volUnitsInput = document.getElementsByName("volUnitsInput")[0];
let tempUnitsInput = document.getElementsByName("tempUnitsInput")[0];
let militaryTimeInput = document.getElementsByName("militaryTimeInput")[0];
let themeColorInput = document.getElementsByName("themeColorInput")[0];
let tempUnitSet = tempUnitsInput.value;
let inputContainer = document.querySelector(".input-container");
let setTempInput = inputContainer.firstElementChild.nextElementSibling;
let minus = inputContainer.firstElementChild;
let plus = inputContainer.lastElementChild;

inputContainer.addEventListener("click", changeTemp);
function changeTemp(e) {
  let temp = +setTempInput.value.substring(0, setTempInput.value.indexOf(' '));
  let unit = ' ' + tempUnitSet; // The unit for the temperature
  if(e.target == minus && temp > minTemp) {
    temp--;
    setTempInput.value = temp + unit;
  } else if(e.target == plus && temp < maxTemp) {
    temp++;
    setTempInput.value = temp + unit;
  }
  if(temp == minTemp){
    minus.disabled = true;
  }
  else if(temp == maxTemp){
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
    document.getElementsByClassName("datetimeDisplay")[0].innerHTML = date.toLocaleDateString([], simDateOptions);
  }
}

function startSimulation(){
  if (isSimulationRunning == false){
    isSimulationRunning = true;
    simStartButton.innerHTML = "Simulation Running";
    simStartButton.style.backgroundColor = "grey";
    simStartButton.disabled = true;
    simDate = simStartDate;
    simStepCount = 0;
    drunkToday.innerHTML = 0;
    meter.value = 0;
    heatCoolIntervalSpeed = 40;
    batteryLevel.style.height = '55%';
    plus.style.pointerEvents = "none";
    minus.style.pointerEvents = "none";
    settingsGrid.style.zIndex = "-1"; // Hide the settings page
    settingsIcon.style.visibility = "visible";
    homeIcon.style.visibility = "hidden";
    settingsButton.style.pointerEvents = "none";
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
    tempChangeDirection.style.visibility = "visible";
  }else if(setTemp > currTemp){
    tempChangeDirection.innerHTML = "&#8679;"; // up arrow
    tempChangeDirection.style.color = "red";
    tempChangeDirection.style.visibility = "visible";
  }
  // always check for equality after the currentTemp changes for an immediate update in the UI
  if(+setTempInput.value.substring(0, setTempInput.value.indexOf(' ')) == +currentTemp.innerHTML){
    tempChangeDirection.style.visibility = "hidden";
  }
}

function addMinutes(date, minutes) {
  simDate = new Date(date.getTime() + minutes * 60000);
  document.getElementsByClassName("datetimeDisplay")[0].innerHTML = simDate.toLocaleDateString('en-US', simDateOptions);
}

function setTemp(temp) {
  let unit = ' ' + setTempInput.value.substring(setTempInput.value.indexOf(' ') + 1); // The unit for the temperature
  if(temp >= minTemp && temp <= maxTemp) {
    setTempInput.value = temp + unit;
  }
  if(temp == minTemp){
    minus.disabled = true;
  }
  else if(temp == maxTemp){
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

function stopSimulation(){
  console.log("Simulation finished!");
    updateClock();
    checkmark.style.display = "none";
    drunkToday.innerHTML = 500;
    batteryLevel.style.height = '55%';
    isSimulationRunning = false;
    simStartButton.disabled = false;
    simStartButton.style.backgroundColor = "#66A182";
    setTemp(45);
    clearInterval(heatAndCoolInterval);
    heatAndCoolInterval = setInterval(heatAndCool, 4000);
    plus.style.pointerEvents = "auto";
    minus.style.pointerEvents = "auto";
    settingsButton.style.pointerEvents = "auto";
    bluetoothIcon.style.color = "black";
    simStartButton.innerHTML = "Start 24hr Simulation";
    clearInterval(simulation);
}

function checkGoalStatus(){
  if (+drunkToday.innerHTML >= +dailyGoal.innerHTML){
    checkmark.style.display = "inline";
  }
  else{
    checkmark.style.display = "none";
  }
}

function simulationStep(){
  if(simStepCount == 1440){
    stopSimulation();
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
        checkGoalStatus();
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

// Settings page
let settingsButton = document.querySelector(".settingsButton");
let settingsIcon = document.querySelector(".fa-gear");
let homeIcon = document.querySelector(".fa-home");
let settingsGrid = document.querySelector(".settings-grid-container");
let mainGrid = document.querySelector(".grid-container");

settingsButton.addEventListener("click", toggleSettingsPage);

function toggleSettingsPage(){
  if(settingsGrid.style.zIndex < 1){
    settingsGrid.style.zIndex = "1"; // Reveal the settings page
    settingsIcon.style.visibility = "hidden";
    homeIcon.style.visibility = "visible";
  }
  else{
    settingsGrid.style.zIndex = "-1"; // Hide the settings page
    settingsIcon.style.visibility = "visible";
    homeIcon.style.visibility = "hidden";
  }
}

dailyGoalInput.addEventListener('change', (event) => {
  dailyGoal.innerHTML = dailyGoalInput.value;
  checkGoalStatus();
});

volUnitsInput.addEventListener('change', (event) => {
  let volUnitElements = document.getElementsByClassName("volUnit");
  for (let i = 0; i < volUnitElements.length; i++) {
    volUnitElements[i].innerHTML = volUnitsInput.value;
  }
});

function celsiusToF(celsius) 
{
  let cTemp = celsius;
  return Math.floor(cTemp * 9 / 5 + 32);
}

function fToCelsius(fahrenheit) 
{
  let fTemp = fahrenheit;
  return Math.floor((fTemp - 32) * 5 / 9);
} 

tempUnitsInput.addEventListener('change', (event) => {
  let tempUnitElements = document.getElementsByClassName("tempUnit");
  for (let i = 0; i < tempUnitElements.length; i++) {
    tempUnitElements[i].innerHTML = tempUnitsInput.value;
  }
  tempUnitSet = tempUnitsInput.value;
  let currTemp2 = +setTempInput.value.substring(0, setTempInput.value.indexOf(' ')); 
  let newTemp;
  if(tempUnitsInput.options[tempUnitsInput.selectedIndex].text == "Fahrenheit"){ // temp is changing to fahrenheit
    newTemp = celsiusToF(currTemp2);
    minTemp = 35;
    maxTemp = 99;
    currentTemp.innerHTML = celsiusToF(+currentTemp.innerHTML)
  }else{ // temp is changing to celsius
    newTemp = fToCelsius(currTemp2);
    minTemp = 2;
    maxTemp = 37;
    currentTemp.innerHTML = fToCelsius(+currentTemp.innerHTML);
  }
  setTempInput.value = newTemp + ' ' + tempUnitSet;
});

militaryTimeInput.addEventListener('change', (event) => {
  if(!militaryTimeInput.checked){ // turning military time on
    simDateOptions = { month: '2-digit', day: 'numeric', year: 'numeric', hour: "numeric", minute: "2-digit" };
  }else{ // turning military time off
    simDateOptions = { month: '2-digit', day: 'numeric', year: 'numeric', hour: "numeric", minute: "2-digit", hour12: false };
  }
  updateClock();
});

themeColorInput.addEventListener('change', (event) => {
  settingsGrid.style.backgroundColor = themeColorInput.value;
  mainGrid.style.backgroundColor = themeColorInput.value;
});
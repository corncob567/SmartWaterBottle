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
let simStepCount = 0
let simDate = new Date(Date.UTC(2022, 11, 1, 5, 0, 0));
let simDateOptions = { month: '2-digit', day: 'numeric', year: 'numeric', hour: "numeric", minute: "2-digit" };
let simStartButton = document.getElementById("simStart");
let simulation

function startSimulation(){
  if (isSimulationRunning == false){
    isSimulationRunning = true;
    simStartButton.innerHTML = "Simulation Running";
    simStartButton.disabled = true;
    simDate = simStartDate;
    simStepCount = 0;
    document.getElementsByClassName("datetimeDisplay")[0].innerHTML = simStartDate.toLocaleDateString('en-US', simDateOptions);
    simulation = setInterval(simulationStep, 10);
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
}

function simulationStep(){
  if(simStepCount == 1440){
    console.log("Simulation finished!");
    updateClock();
    isSimulationRunning = false
    simStartButton.disabled = false;
    simStartButton.innerHTML = "Start 24hr Simulation";
    clearInterval(simulation);
  }else{
    //console.log("Simulation Step " + simStepCount);
    addMinutes(simDate, 1);
    if(simStepCount == 1300){
      setTemp(39);
    }
    simStepCount++;
  }
}
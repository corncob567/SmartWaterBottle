const MINTEMP = 35;
const MAXTEMP = 99;
let isSimulationRunning = false;

let inputContainer = document.querySelector(".input-container");
inputContainer.addEventListener("click", changeTemp);
let input = inputContainer.firstElementChild.nextElementSibling;
let minus = inputContainer.firstElementChild;
let plus = inputContainer.lastElementChild;

function changeTemp(e) {
  let temp = +input.value.substring(0, input.value.indexOf(' '));
  let unit = ' ' + input.value.substring(input.value.indexOf(' ') + 1); // The unit for the temperature
  if(e.target == minus && temp > MINTEMP) {
    temp--;
    input.value = temp + unit;
  } else if(e.target == plus && temp < MAXTEMP) {
    temp++;
    input.value = temp + unit;
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

updateClock() // Run this on load so the user sees the date/time immediately without having to wait the first second for it to update.
setInterval(updateClock, 1000);
function updateClock() {
  if(isSimulationRunning == false){
    let date = new Date();
    document.getElementsByClassName("datetimeDisplay")[0].innerHTML =
    date.toLocaleDateString([], { month: '2-digit', day: 'numeric', year: 'numeric', hour: "numeric", minute: "2-digit" });
  }
}

function startSimulation(){
  if (isSimulationRunning == false){
    isSimulationRunning = true
    let simStartButton = document.getElementById("simStart");
    simStartButton.innerHTML = "Simulation Running"
    simStartButton.disabled = 'true';
    let simStartDate = new Date(Date.UTC(2022, 11, 1, 5, 0, 0));
    let options = { month: '2-digit', day: 'numeric', year: 'numeric', hour: "numeric", minute: "2-digit" };
    document.getElementsByClassName("datetimeDisplay")[0].innerHTML = simStartDate.toLocaleDateString('en-US', options);
    let simulation = setInterval(simulationStep, 1000);
  }
}

function simulationStep(){
  console.log("Simulation Step");
  let drawer = document.getElementById("waterTemp");
  drawer.value = Number(drawer.value) + 1;
  changeTemp('1', drawer.value)
}
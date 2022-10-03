const MINTEMP = 35;
const MAXTEMP = 100;

(function(){
  let inputContainer = document.querySelector(".input-container");
  let input = inputContainer.firstElementChild.nextElementSibling;
  let minus = inputContainer.firstElementChild;
  let plus = inputContainer.lastElementChild;

  function changeTemp(e) {
      if(e.target == minus && input.value > MINTEMP) {
          input.value--;
      } else if(e.target == plus && input.value < MAXTEMP) {
          input.value++;
      }
      if(input.value == MINTEMP){
        minus.disabled = true;
      }
      else if(input.value == MAXTEMP){
        plus.disabled = true;
      }
      else{
        plus.disabled = false;
        minus.disabled = false;
      }
  }

  inputContainer.addEventListener("click", changeTemp);
})();

document.getElementById("fridgeTemp1").addEventListener("input", registerChangeTemp);
document.getElementById("fridgeTemp1").boxId = 1
function registerChangeTemp(evt) {
  let boxId = evt.currentTarget.boxId
  changeTemp(boxId, this.value);
}

function changeTemp(boxId, newTemp){
  document.getElementById("box" + boxId).innerHTML = "Box " + boxId + ": " + newTemp + "F";
}

// document.getElementById("addImageButton").addEventListener("click", addImage);
// function addImage(){
//     console.log("Henlo");
//     const img = document.createElement("img");
//     img.src = "https://picsum.photos/200/301";
//     img.height = 100;
//     img.width = 100;
//     document.body.appendChild(img);
// }

setInterval(updateClock, 1000);
function updateClock() {
  let d = new Date();
  document.getElementById("clock").innerHTML=
  d.toLocaleTimeString();
}

let isSimulationRunning = false
function startSimulation(){
  if (isSimulationRunning == false){
    isSimulationRunning = true
    let simStartButton = document.getElementById("simStart");
    simStartButton.innerHTML = "Simulation Running"
    setInterval(simulationStep, 1000)
  }
}

function simulationStep(){
  console.log("Simulation Step");
  let drawer = document.getElementById("fridgeTemp1");
  drawer.value = Number(drawer.value) + 1;
  changeTemp('1', drawer.value)
}
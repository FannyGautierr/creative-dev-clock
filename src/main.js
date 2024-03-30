import Scenario from "./js/scenarios/Scenario"
console.log('Hello World!')


const scene = new Scenario()
const newYorkClock = new Scenario('canvasIdNewYork', -5);
const londonClock = new Scenario('canvasIdLondon', 0);
const tokyoClock = new Scenario('canvasIdTokyo', 9);
function updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
  
    document.getElementById('hours-tens').textContent = hours[0];
    document.getElementById('hours-ones').textContent = hours[1];
    document.getElementById('minutes-tens').textContent = minutes[0];
    document.getElementById('minutes-ones').textContent = minutes[1];
    document.getElementById('seconds-tens').textContent = seconds[0];
    document.getElementById('seconds-ones').textContent = seconds[1];
  }
  
  setInterval(updateClock, 1000);
// scene.update(); 


// const scene2 = new Scenario('canvas-scene-2')
// console.log(scene)
// scene.start()
// scene2.start()
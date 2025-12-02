let secret = "";
let guessed = [];
let mistakes = 0;

const inputWord = document.getElementById("inputWord");
const startBtn = document.getElementById("startBtn");
const wordContainer = document.getElementById("word");
const lettersContainer = document.getElementById("letters");
const canvas = document.getElementById("hangman");
const ctx = canvas.getContext("2d");

// --- Sonidos ---
const s_correct = new Audio('https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg');
const s_wrong = new Audio('https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg');
const s_win = new Audio('https://actions.google.com/sounds/v1/cartoon/metal_twang.ogg');
const s_lose = new Audio('https://actions.google.com/sounds/v1/cartoon/concussive_hit_guitar_boing.ogg');

function animateResult(type) {
  document.body.style.transition = '0.3s';
  document.body.style.background = type === 'win' ? 'linear-gradient(135deg,#00ff99,#00aaff)' : 'linear-gradient(135deg,#ff4e4e,#660000)';
  setTimeout(()=>{
    document.body.style.background = 'linear-gradient(135deg, #3a7bd5, #00d2ff)';
  },700);
}

function normalize(str){ 
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase(); 
}

function resetGame() {
  guessed = [];
  mistakes = 0;
  ctx.clearRect(0,0,300,300);
  lettersContainer.innerHTML = "";
  wordContainer.textContent = "";
}

startBtn.onclick = () => {
  secret = normalize(inputWord.value.trim());
  if(secret === "") return alert("Debe ingresar una palabra");

  resetGame();
  inputWord.value="";
  createButtons();
  updateWord();
};

function draw() {
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#fff";
  if (mistakes === 1) { ctx.moveTo(20,280); ctx.lineTo(280,280); }
  if (mistakes === 2) { ctx.moveTo(50,280); ctx.lineTo(50,50); }
  if (mistakes === 3) { ctx.moveTo(50,50); ctx.lineTo(200,50); }
  if (mistakes === 4) { ctx.moveTo(200,50); ctx.lineTo(200,100); }
  if (mistakes === 5) { ctx.beginPath(); ctx.arc(200,130,30,0,Math.PI*2); }
  if (mistakes === 6) { ctx.moveTo(200,160); ctx.lineTo(200,220); }
  if (mistakes === 7) { ctx.moveTo(200,180); ctx.lineTo(170,200); }
  if (mistakes === 8) { ctx.moveTo(200,180); ctx.lineTo(230,200); }
  if (mistakes === 9) { ctx.moveTo(200,220); ctx.lineTo(170,250); }
  if (mistakes === 10) { ctx.moveTo(200,220); ctx.lineTo(230,250); }
  ctx.stroke();
}

function updateWord() {
  wordContainer.textContent = secret.split("").map(l => guessed.includes(l) ? l : "_").join(" ");
}

function createButtons() {
  for (let i = 65; i <= 90; i++) {
    const btn = document.createElement("button");
    btn.textContent = String.fromCharCode(i);
    btn.onclick = () => handleGuess(btn.textContent, btn);
    lettersContainer.appendChild(btn);
  }
}

function handleGuess(letter, btn){
  btn.disabled = true;
  letter = normalize(letter);

  if(secret.includes(letter)){
    guessed.push(letter);
    s_correct.play();
    updateWord();

    if(!wordContainer.textContent.includes("_")){
      s_win.play();
      animateResult('win');
      alert("¡Ganaste! Puedes ingresar otra palabra.");
    }
  } else {
    mistakes++;
    s_wrong.play();
    draw();
    if(mistakes===10){
      s_lose.play();
      animateResult('lose');
      alert("Perdiste. La palabra era: " + secret);
    }
  }
}
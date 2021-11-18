
/*
Features:
Random Answer Order
Timer
Hints
More points for faster time
*/

let currentQuestion = -1; // question the user is on
let score = 0; // number of correct answers
let maxtime = 10
let timeleft = -1; // amout of time left in seconds
let hints = 2; // number of hints left
let timer;
let answerKey = ["","","",""];

// most known flags https://www.sporcle.com/games/g/worldflags/results
// flag gallery https://en.wikipedia.org/wiki/Gallery_of_sovereign_state_flags
let questions = [
  {
	"question": "What country's flag is this?",
	"a": "Canada",
	"b": "United States",
	"c": "Austria",
	"d": "Peru",
	"image":"quizimages/q1-1.jpg",
  "hint": "The leaf is a Maple, a tree used to make Syrup."
  },
  {
	"question": "What country's flag is this?",
	"a": "United States",
	"b": "United Kingdom",
	"c": "Malaysia",
	"d": "Liberia",
	"image":"quizimages/q1-2.jpg",
  "hint": "Each star represents one of the 50 major subdivisions."
  },
  {
	"question": "What country's flag is this?",
	"a": "Japan",
	"b": "South Korea",
	"c": "Bangladesh",
	"d": "Taiwan",
	"image":"quizimages/q1-3.jpg",
  "hint": "The Land of the Rising Sun."
  },
  {
	"question": "What country's flag is this?",
	"a": "United Kingdom",
	"b": "United States",
	"c": "England",
	"d": "Australia",
	"image":"quizimages/q1-4.jpg",
  "hint": "Encompasses Great Britain and Northern Ireland."
  },
  {
	"question": "What country's flag is this?",
	"a": "South Korea",
	"b": "North Korea",
	"c": "Japan",
	"d": "Taiwan",
	"image":"quizimages/q1-5.jpg",
  "hint": "Democratic part of a Country split in two."
  },
  {
	"question": "What country's flag is this?",
	"a": "Brazil",
	"b": "Portugal",
	"c": "Argentina",
	"d": "Venezuela",
	"image":"quizimages/q1-6.jpg",
  "hint": "The Portuguese speaking part of South America."
  },
  {
	"question": "What country's flag is this?",
	"a": "France",
	"b": "Netherlands",
	"c": "Russia",
	"d": "Italy",
	"image":"quizimages/q1-7.jpg",
  "hint": "Le Drapeau Tricolore."
  },
  {
	"question": "What country's flag is this?",
	"a": "Germany",
	"b": "Belgium",
	"c": "France",
	"d": "Spain",
	"image":"quizimages/q1-8.jpg",
  "hint": "Die Bundesflagge."
  },
  {
	"question": "What country's flag is this?",
	"a": "China",
	"b": "Taiwan",
	"c": "Russia",
	"d": "Vietnam",
	"image":"quizimages/q1-9.jpg",
  "hint": "The largest country in the world by population."
  },
  {
	"question": "What country's flag is this?",
	"a": "Israel",
	"b": "Palestine",
	"c": "Greece",
	"d": "Argentina",
	"image":"quizimages/q1-10.jpg",
  "hint": "The Star of David is a symbol of the state religion."
  }
];

// load the service worker in sw.js
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}

function loadQuestion() {

  // change question
  currentQuestion++;
  document.getElementById('questioncount').innerHTML = "Question " + (currentQuestion + 1) + " / " + questions.length;
  
  // start timer
  startTimer();

  // load the image
  let img = document.getElementById("image");
  img.src = questions[currentQuestion].image;
  img.style.maxWidth = "60vw";
  img.style.maxHeight = "50vh";
  
  // randomize answers
  answerKey = ["","","",""];
  
  for (let i = 97; i < 101; i++) {
    while(true) {   
      let rand = Math.floor(Math.random() * 4);
      if (answerKey[rand] == "") {
        answerKey[rand] = String.fromCharCode(i);
        break;
      } // if
    } // while
  } // for

  // load the question and answers
  document.getElementById("question").innerHTML = questions[currentQuestion].question;
  for (let i = 0; i < 4; i++) {
    eval('document.getElementById("' + String.fromCharCode(97 + i) + '").innerHTML = "' + String.fromCharCode(65 + i) + '. " + questions[currentQuestion].' + answerKey[i] + ';');
  }
  
} // loadQuestion
 
 
function markIt(ans) {

  let message = "";
  let heading = "";
  let colour = "";
  let newPoints = 0;
  
  // check answer directly with question
  if (answerKey[ans] == 'a') {
    
    // add to score
    newPoints = (timeleft * 500 / maxtime + 500);
    score += newPoints;
    
    // display score 
    document.getElementById("score").innerHTML = "Score: " + score;
    
    heading = 'Correct!';
    message = "+" + newPoints + " points<br>Your score is " + score;
    colour = "green";
    
  } else {
    
    heading = 'Incorrect &#128549;';
    message = "+0 points<br>Your score is " + score;
    colour = "#ED1B24";
    
  } // else
    
  // stop timer
  clearInterval(timer);
  timeleft = -1;

  // move to the next question
  
  if (currentQuestion + 1 >= questions.length) {
    
    // create final message
    message = "Your final score is " + score + '<br>';
    
    if (score > questions.length * 750) {
      message += "<br>You're a flag Genius!<br>";
    } else if (score > questions.length * 500) {
      message += "<br>You know your flags!<br>";
    } else if (score > questions.length * 250) {
      message += "<br>Play again to improve your flag knowledge!<br>";
    } else {
      message += "<br>Go learn your flags!<br>";
    }
    
    message += "<br>Thanks for playing!";
    
  }
  
  // show the lightbox
  showLightbox(heading, message, colour);

} // markIt

function showLightbox(heading, message, colour) {
  
  document.getElementById("lightbox").style.display = "block";
  document.getElementById("heading").innerHTML = heading;
  document.getElementById("message").innerHTML = message;
  
  if (colour != "") {
    document.getElementById("heading").style.backgroundColor = colour;
  }
  
} // showLightbox

function closeLightbox() {
  if (currentQuestion < questions.length - 1) {
    document.getElementById("lightbox").style.display = "none";
    if (timeleft <= 0) {
      loadQuestion();
    }
  } else {
    showLightbox("Play again?", "<span onclick='reloadPage();'>Yes!</span>", "purple");
  }
} // closeLightbox

function startTimer() {
  timeleft = maxtime;
  document.getElementById("countdown").innerHTML = Math.ceil(timeleft) + "s left";
  timer = setInterval( function(){
    timeleft = Math.round(100 * (timeleft - 0.1)) / 100;
    document.getElementById("countdown").innerHTML = Math.ceil(timeleft) + "s left";
    document.getElementById("timebar").style.width = (timeleft / maxtime * 100) + "vw";
    if (timeleft <= 0) {
      clearInterval(timer);
      showLightbox("Time up", "+0 points<br>Your score is " + score, "#ED1B24");
    }
  }, 100);
} // startTimer

function showHint() {
  
  let message = "";
  
  if (hints > 0) {
    message = questions[currentQuestion].hint;
    hints--;
  } else {
    message = "No hints remaining"
  }
  
  showLightbox("Hint:", message, "purple");
  
} // showHint

function reloadPage() {
  window.location.reload();
}

window.onbeforeunload = function(event) {
  return 'Confirm Reload';
};
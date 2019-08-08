// let SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
// let SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
// let SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

// let colors = [ 'aqua' , 'azure' , 'beige', 'bisque', 'black', 'blue', 'brown', 'chocolate', 'coral' ];
// let grammar = '#JSGF V1.0; grammar colors; public <color> = ' + colors.join(' | ') + ' ;'

// let recognition = new SpeechRecognition();
// let speechRecognitionList = new SpeechGrammarList();
// speechRecognitionList.addFromString(grammar, 1);

// recognition.grammars = speechRecognitionList;
// //recognition.continuous = false;
// recognition.lang = 'en-US';
// recognition.interimResults = false;
// recognition.maxAlternatives = 1;

// let diagnostic = document.querySelector('.output');
// let bg = document.querySelector('html');
// let hints = document.querySelector('.hints');
// console.log(hints)

// let colorHTML= '';
// colors.forEach((color, index) => {
//   console.log(color, index);
//   colorHTML += '<span style="background-color:' + color + ';"> ' + color + ' </span>';
// });
// console.log(hints)
// hints.innerHTML = 'Tap/click then say a color to change the background color of the app. Try ' + colorHTML + '.';

// document.body.onclick = () => {
//   recognition.start();
//   console.log('Ready to receive a color command.');
// }
// recognition.onresult = (event) => {
//   let last = event.results.length - 1;
//   let color = event.results[last][0].transcript;
//   diagnostic.textContent = 'Result received: ' + color + '.';
//   bg.style.backgroundColor = color;
//   console.log('Confidence: ' + event.results[0][0].confidence);
// }
// recognition.onspeechend = () => {
//   recognition.stop();
// }
// recognition.onnomatch = (event) => {
//   diagnostic.textContent = 'I didnt recognise that color.';
// }
// recognition.onerror = (event) => {
//   diagnostic.textContent = 'Error occurred in recognition: ' + event.error;
// }

// Speech to Text
let synth = window.speechSynthesis;

let inputForm = document.querySelector("form");
let inputTxt = document.querySelector(".txt");
let voiceSelect = document.querySelector("select");

let pitch = document.querySelector("#pitch");
let pitchValue = document.querySelector(".pitch-value");
let rate = document.querySelector("#rate");
let rateValue = document.querySelector(".rate-value");

let voices = [];

function populateVoiceList() {
  voices = synth
    .getVoices()
    .sort(function(a, b) {
      const aname = a.name.toUpperCase(),
        bname = b.name.toUpperCase();
      if (aname < bname) return -1;
      else if (aname == bname) return 0;
      else return +1;
    })
    .filter(voice => {
      console.log(voice);
      if (voice.lang.indexOf("en-") > -1) {
        return voice;
      }
    });
  console.log(voices);
  var selectedIndex =
    voiceSelect.selectedIndex < 0 ? 0 : voiceSelect.selectedIndex;
  voiceSelect.innerHTML = "";
  for (i = 0; i < voices.length; i++) {
    var option = document.createElement("option");
    option.textContent = voices[i].name + " (" + voices[i].lang + ")";

    if (voices[i].default) {
      option.textContent += " -- DEFAULT";
    }

    option.setAttribute("data-lang", voices[i].lang);
    option.setAttribute("data-name", voices[i].name);
    voiceSelect.appendChild(option);
  }
  voiceSelect.selectedIndex = selectedIndex;
}

populateVoiceList();
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}

function speak() {
  if (synth.speaking) {
    console.error("speechSynthesis.speaking");
    return;
  }
  if (inputTxt.value !== "") {
    var utterThis = new SpeechSynthesisUtterance(inputTxt.value);
    utterThis.onend = function(event) {
      console.log("SpeechSynthesisUtterance.onend");
    };
    utterThis.onerror = function(event) {
      console.error("SpeechSynthesisUtterance.onerror");
    };
    var selectedOption = voiceSelect.selectedOptions[0].getAttribute(
      "data-name"
    );
    for (i = 0; i < voices.length; i++) {
      if (voices[i].name === selectedOption) {
        utterThis.voice = voices[i];
      }
    }
    utterThis.pitch = pitch.value;
    utterThis.rate = rate.value;
    synth.speak(utterThis);
  }
}

inputForm.onsubmit = function(e) {
  e.preventDefault();
  speak();
  inputTxt.blur();
};

pitch.onchange = function() {
  pitchValue.textContent = pitch.value;
};

rate.onchange = function() {
  rateValue.textContent = rate.value;
};

voiceSelect.onchange = function() {
  speak();
};

// Audiop Oscilloscope
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var analyser = audioCtx.createAnalyser();

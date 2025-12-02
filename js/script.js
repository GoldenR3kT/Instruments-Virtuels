import Oscillator from './Oscillator.js';

window.onload = init;
let ctx = new AudioContext();
let osc1, osc2;
let knobFrequency1, knobVolume1, selectWaveType1;
let knobFrequency2, knobVolume2, selectWaveType2;

function init() {
    buildSynthetizer();

    defineListeners();
}

function defineListeners() {
    document.getElementById('startButton').addEventListener('click', startSound);
    document.getElementById('stopButton').addEventListener('click', stopSound);

    // ############
    // Oscillateur 1
    // ############
    knobFrequency1 = document.querySelector('#freqKnob1');
    knobFrequency1.oninput = () => {
         resumeContext();
        setFrequencyOsc(osc1, knobFrequency1.value);
    }

    knobVolume1 = document.querySelector('#volumeKnob1');
    knobVolume1.oninput = () => {
        resumeContext();
        setVolumeOsc(osc1, knobVolume1.value);
    }

    // Pour les formes d'onde
    selectWaveType1 = document.querySelector('#waveformKnob1');
    selectWaveType1.oninput = () => {
         resumeContext();
        setWaveTypeOsc(osc1, selectWaveType1.value);
    }

    // Pour l'octave
    let octaveKnob1 = document.querySelector('#octaveKnob1');
    octaveKnob1.oninput = () => {
        resumeContext();
        setOctaveOsc(osc1, parseInt(octaveKnob1.value));
    }

    // ############
    // Oscillateur 2
    // ############
    knobFrequency2 = document.querySelector('#freqKnob2');
    knobFrequency2.oninput = () => {
         resumeContext();
        setFrequencyOsc(osc2, knobFrequency2.value);
    }

    knobVolume2 = document.querySelector('#volumeKnob2');
    knobVolume2.oninput = () => {
        resumeContext();
        setVolumeOsc(osc2, knobVolume2.value);
    }

    // Pour les formes d'onde
    selectWaveType2 = document.querySelector('#waveformKnob2');
    selectWaveType2.oninput = () => {
         resumeContext();
        setWaveTypeOsc(osc2, selectWaveType2.value);
    }

    // Pour l'octave
    let octaveKnob2 = document.querySelector('#octaveKnob2');
    octaveKnob2.oninput = () => {
        resumeContext();
        setOctaveOsc(osc2, parseInt(octaveKnob2.value));
    }

    // piano keyboard
    let keyboard = document.querySelector('#kbd');
    // écoute des événements de touche enfoncée
    keyboard.onchange = (event) => {
        resumeContext();
        console.log(event.note);
        let indexKey = event.note[1]; // Récupère l'index de la touche
        let keyDownUp = event.note[0]; // 1 = touche enfoncée, 0 = touche relachée
        osc1.playKeyboardNote(indexKey, keyDownUp);
        osc2.playKeyboardNote(indexKey, keyDownUp);

    };
}

function resumeContext() {
    // Certains navigateurs demandent une interaction utilisateur pour démarrer le contexte audio
    if (ctx.state === 'suspended') {
        ctx.resume();
    }
}

function buildSynthetizer() {
    // Souvent 1ère étape on construit le graphe audio, puis ensuite on le demarre
    // un simple oscillateur + un gain

    osc1 = new Oscillator(ctx);
    // on le connecte à la sortie audio par défaut
    osc1.connect(ctx.destination);

    // On connecte l'oscillateur au gain, puis le gain à la sortie audio

    // On configure l'oscillateur
    osc1.setWaveType(0); // sine
    osc1.setFrequency(440, ctx.currentTime); // La4
    osc1.setVolume(0.1, ctx.currentTime); // volume initial à 0
   

    osc1.start(); // on démarre l'oscillateur immédiatement

    osc2 = new Oscillator(ctx);
    // on le connecte à la sortie audio par défaut
    osc2.connect(ctx.destination);

    // On connecte l'oscillateur au gain, puis le gain à la sortie audio

    // On configure l'oscillateur
    osc2.setWaveType(0); // sine
    osc2.setFrequency(440, ctx.currentTime); // La4
    osc2.setVolume(0.1, ctx.currentTime); // volume initial à 0
   

    osc2.start(); // on démarre l'oscillateur immédiatement
}

function startSound() {
    // si l'oscillateur a déjà démarré, on ne le redémarre pas
    // mais on peut rétablir le gain
    osc1.setVolume(1, 0);
    osc2.setVolume(1, 0);
}

// Fonction pour arrêter le son
function stopSound() {
    //osc.stop();
    // au lieu de l'arrêter on peut réduire le gain à 0
    osc1.setVolume(0, 0);
    osc2.setVolume(0, 0);
}

// Controle du premier oscillateur
// Fonction pour changer la fréquence de l'oscillateur
function setFrequencyOsc(osc, value) {
    // on modifie la fréquence de l'oscillateur, mais avec un setValue lisse le changement
    osc.setFrequency(value, ctx.currentTime);
}

// Fonction pour changer le type d'onde de l'oscillateur
function setWaveTypeOsc(osc, type) {
    osc.setWaveType(type);
}

// Fonction pour changer le volume
function setVolumeOsc(osc, value) {
    // on va changer le gain mais en le lissant progressivement
    osc.setVolume(value, ctx.currentTime);
}

// Fonction pour changer l'octave
function setOctaveOsc(osc, octave) {
    osc.setOctave(octave, ctx.currentTime);
}


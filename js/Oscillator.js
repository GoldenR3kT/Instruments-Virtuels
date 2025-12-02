export default class Oscillator {
    // classe oscillator pour gérer un oscillateur associé à un gain de sortie
    constructor(ctx, type = 'sine', frequency = 440) {
        this.osc = ctx.createOscillator();
        this.gain = ctx.createGain();

        this.osc.connect(this.gain);
        this.gain.connect(ctx.destination);

        this.osc.type = type;
        this.osc.frequency.value = frequency;
        this.gain.gain.value = 0;

        this.octave = 0; // octave offset
    }

    start() {
        this.osc.start();
    }

    setFrequency(value, time) {
        this.osc.frequency.setValueAtTime(value, time);
    }

    setWaveType(type) {
        let wavetypes = ['sine', 'square', 'sawtooth', 'triangle'];
        if (type < 0 || type >= wavetypes.length) {
            console.warn('Invalid wave type index, defaulting to sine');
            type = 0;
        }
        this.osc.type = wavetypes[type];
    }

    setVolume(value, time) {
        this.gain.gain.setValueAtTime(value, time);
    }

    setDetune(value, time) {
        this.osc.detune.setValueAtTime(value, time);
    }

    setOctave(octave, time) {
        // octave is an integer, 0 means no change, positive values double frequency, negative halve it
        // min value = -3, max value = +3
        // check bounds
        this.octave = octave;
        if (octave < -3) this.octave = -3;
        if (octave > 3) this.octave = 3;
        let factor = Math.pow(2, this.octave);
        let newFreq = this.osc.frequency.value * factor;
        this.setFrequency(newFreq, time);
    }

    playKeyboardNote(index, keyDownUp) {
        // index is the key (0 = C3), keyDownUp is 1 for keydown, 0 for keyup
        // if keyDownUp  = 1 play the note, else stop it
        // Compute frequency taking into account this.octave
        let baseFreq = 130.81 * Math.pow(2, index / 12); // C3 = 130.81 Hz
        let freq = baseFreq * Math.pow(2, this.octave);
        if (keyDownUp === 1) {
            this.setFrequency(freq, 0);
            this.setVolume(1, 0);
        } else {
            this.setVolume(0, 0);
        }
    }
    connect(destination) {
        this.gain.disconnect();
        this.gain.connect(destination);
    }
}
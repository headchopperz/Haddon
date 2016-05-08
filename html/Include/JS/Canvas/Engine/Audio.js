var AudioController = function () {
    this.constructor();
    
    this.context = new (window.AudioContext || window.webkitAudioContext)();
    this.oscillator = this.context.createOscillator();
    this.gain = this.context.createGain();
}

AudioController.prototype = Object.create(Controller.prototype);
AudioController.prototype.constructor = Controller;

var gAudio = new AudioController;
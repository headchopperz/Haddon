var ModuleController = function () {
    this.Events = {
        onLoop: [],
        GameReset: []
    };


    return {
        Events: this.Events,
        find: this.find,
        trigger: this.trigger,
        add: this.add
    }

}

ModuleController.prototype.trigger = function (EventType, Parameters) {
    for (var i = 0; i < this.Events[EventType].length; i++) {
        var e = this.Events[EventType][i];
        
        var fn = e.Function;
        
        if (typeof fn === "function") {
            fn.apply(e.Context, [Parameters]);
        }
    }
}

var Module = new ModuleController;

document.addEventListener('DOMContentLoaded', function () {
    Module.Events.onLoop.push({
        Context: window,
        Function: mainLoop
    });
    Module.Events.onLoop.push({
        Context: window,
        Function: drawIntroDots
    });
});



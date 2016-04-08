/**
 * This block of code is a requestAnimationFrame fallback, for older browsers
 * If i recall correctly i got it from stackoverflow years ago...
 * Its probably not even needed as this is probably now supported in most browsers
 */
var requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
})();


var lastTime = 0;

var FPS = [];


/**
 * This is the program loop, but it isnt named that as i want to split the loop up
 * into the various parts
 * Ultimately this is the main entrance point of the application and wll hold the main code
 * @returns {bool}
 */
function main() {
    var now = Date.now();
    var dt = now - lastTime; //Time since last loop

    /**
     * If the time between since last loop is so great, then the jump it could cause
     * may actually break everything, so we skip that loop until the users computer
     * can handle the stress of... whatever they are dealing with
     */
    if (dt < 1000) {
        Scene.sync();

        drawTimeline(dt);
        drawButtons(dt);
        showFPS(dt);
    }

    lastTime = now;

    /**
     * rerun the function when the computer can render the animation frame
     */
    requestAnimFrame(main);
}

function showFPS(dt) {
    FPS.push(Math.round(1000 / dt));

    var total = 0;

    FPS.forEach(function (e) {
        total += e;
    });

    if (FPS.length > Math.round(1000 / dt)) { //the seconds average... about
        FPS.shift();
    }

    if (Key.isKeyPressed(KeyCode.D, false)) {

        Scene.context.font = "16px Georgia";
        Scene.context.textAlign = 'left';
        Scene.context.fillStyle = "white";
        Scene.context.fillText("FPS: " + Math.round(total / FPS.length), 25, 25);
    }
}

/**
 * So if you are reading the code, up until this point, nothing has happened.
 * Its just us declaring functions, variables etc
 *
 * This bit of code here is responsible for "Starting" everything, and it runs when the document has finished loading
 *
 * This block of code is also what runs main() for the first time
 */
document.addEventListener('DOMContentLoaded', function() {
    Scene.updateViewport();
    window.addEventListener('resize', function (e) {
        Scene.updateViewport();
    }, true);

    window.addEventListener("keydown", function (e) {
        Key.onKeyPressed(e);
        e.preventDefault(); //stops the browser from doing what it was meant to do
    });

    window.addEventListener("keyup", function (e) {
        Key.onKeyUp(e);
    });

    Scene.canvas.addEventListener("mousedown", function (e) {
        Mouse.press(e);
    });

    Scene.canvas.addEventListener("mouseup", function (e) {
        Mouse.release(e);
    });

    Scene.canvas.addEventListener("mousemove", function (e) {
        Mouse.move(e);
    });
    
    loadJSON("/Include/Data/Buttons.json", function(obj) {
        obj.forEach(function (e) {
            Buttons.push(new Button(e.Data.Description, e));
        });

        findButton('intrCont').Data.Fill.On = true;
        findButton('intrSub').Data.Text.Value = "My name is Michael Haddon";    
    });
    
    loadJSON("/Include/Data/TimelineElements.json", function(obj) {
        obj.forEach(function (e) {
            TimelineElements.push(new TimelineElement(e));
        });

        Scene.updateViewport();        
    });

    /**
     * and now... after all that, we actually start everything
     */
    setTimeout(main, 150);
});

function loadJSON(URL, Func) {
    var request = new XMLHttpRequest();
    request.open('GET', URL, true);

    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        // Success!
        var obj = JSON.parse(request.responseText);
        
        Func(obj);
      } else {
        // We reached our target server, but it returned an error

      }
    };

    request.onerror = function() {
      // There was a connection error of some sort
    };

    request.send();
}
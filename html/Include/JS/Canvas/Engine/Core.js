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


/**
 * This is the program loop, but it isnt named that as i want to split the loop up
 * into the various parts
 * Ultimately this is the main entrance point of the application and wll hold the main code
 * @returns {bool}
 */
function main() {
    var now = Date.now();
    var dt = now - Scene.Data.Timers.lastGameLoop; //Time since last loop

    /**
     * If the time between since last loop is so great, then the jump it could cause
     * may actually break everything, so we skip that loop until the users computer
     * can handle the stress of... whatever they are dealing with
     */
    if (dt < 1000) {
        Scene.sync(dt);
        Scene.Data.CacheID.Positional = now;
        
        
        Module.trigger('onLoop', [dt]);
        Container.renderAll(dt);
        Entity.renderAll(dt);
    }

    Scene.Data.Timers.lastGameLoop = now;

    /**
     * rerun the function when the computer can render the animation frame
     */
    requestAnimFrame(main);
}

/**
 * So if you are reading the code, up until this point, nothing has happened.
 * Its just us declaring functions, variables etc
 *
 * This bit of code here is responsible for "Starting" everything, and it runs when the document has finished loading
 *
 * This block of code is also what runs main() for the first time
 */
document.addEventListener('DOMContentLoaded', function () {
    Scene.updateViewport();
    window.addEventListener('resize', function (e) {
        Scene.onResize();
    }, true);

    window.addEventListener("keydown", function (e) {
        Key.onKeyPressed(e);
        //e.preventDefault(); //stops the browser from doing what it was meant to do
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

    gameLoad();

    /**
     * and now... after all that, we actually start everything
     */
    setTimeout(main, 150);
});

/**
 * This is a native way to just do an AJAX request for a JSON file. It may need
 * to be extended upon for further browser support.
 *
 * @param {String} URL
 * @param {Function} Func
 * @returns {undefined}
 */
function loadJSON(URL, Func) {
    var request = new XMLHttpRequest();
    request.open('GET', URL, true);

    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            // Success!
            var obj = JSON.parse(request.responseText);

            Func(obj);
        } else {
            // We reached our target server, but it returned an error

        }
    };

    request.onerror = function () {
        // There was a connection error of some sort
    };

    request.send();
}
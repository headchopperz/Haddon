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

var image = new Image();
image.src = '/Include/Images/Hackathon.jpg';


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

        var Coords = findButton('intrCont').getCoords();



        Scene.context.globalAlpha = 0.75;
        Scene.context.beginPath();
        Scene.context.arc(Coords.X + (Coords.Width / 2), Coords.Y + Coords.Height, 7, 0, Math.PI);
        Scene.context.fillStyle = "grey";
        Scene.context.fill();
        Scene.context.stroke();
        Scene.context.closePath();
        Scene.context.globalAlpha = 1;

        var sinnum = 0;
        
        var size = 250;
        var X = Coords.X + (Coords.Width / 2) - (size / 2);
        var Y = Coords.Y + Coords.Height + 50;
        
        Scene.context.globalAlpha = 0.15;
        Scene.context.beginPath();
        Scene.context.arc(X + (size / 2), Y + (size / 2), size / 2, 0, Math.PI * 2, true);
        Scene.context.rect(X - (size * 1.5), Y, size * 2, size);
        Scene.context.fillStyle = "black";
        Scene.context.fill();
        Scene.context.closePath();
        Scene.context.globalAlpha = 1;
        
        var size = 250;
        var X = Coords.X + (Coords.Width / 2) - (size / 2);
        var Y = Coords.Y + Coords.Height + 300;
        
        Scene.context.globalAlpha = 0.15;
        Scene.context.beginPath();
        Scene.context.arc(X + (size / 2), Y + (size / 2), size / 2, 0, Math.PI * 2, true);
        Scene.context.rect(X + (size / 2), Y, size * 2, size);
        Scene.context.fillStyle = "black";
        Scene.context.fill();
        Scene.context.closePath();
        Scene.context.globalAlpha = 1;

        for (var i = 1; i < 50; i++) {

            var X = Coords.X + (Coords.Width / 2);
            var Y = Coords.Y + Coords.Height + (21.5 * i);

            if (i > 2) {
                X += Math.sin(sinnum += 0.27) * 125;
            }


            Scene.context.globalAlpha = 0.75;
            Scene.context.beginPath();
            Scene.context.arc(X, Y, 4, 0, 2 * Math.PI);
            Scene.context.fillStyle = "grey";
            Scene.context.fill();
            Scene.context.stroke();
            Scene.context.closePath();
            Scene.context.globalAlpha = 1;
        }

        var size = 150;
        var X = Coords.X + (Coords.Width / 2) - (size / 2);
        var Y = Coords.Y + Coords.Height + 100;
        Scene.context.save();
        Scene.context.beginPath();
        Scene.context.arc(X + (size / 2), Y + (size / 2), size / 2, 0, Math.PI * 2, true);
        Scene.context.fillStyle = "black";
        Scene.context.fill();
        Scene.context.closePath();
        Scene.context.clip();
        

        Scene.context.drawImage(image, X, Y, size, size);

        Scene.context.beginPath();
        Scene.context.arc(X, Y, size / 2, 0, Math.PI * 2, true);
        Scene.context.clip();
        Scene.context.closePath();
        
        
        Scene.context.restore();

        drawButtons(dt);
    }

    lastTime = now;

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
$(document).ready(function () {
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

    $.ajax({
        type: "GET",
        url: "/Include/Data/Buttons.json"
    }).success(function (obj) {
        //var obj = $.parseJSON(html);

        obj.forEach(function (e) {
            Buttons.push(new Button(e.Data.Description, e));
        });

        findButton('intrCont').Data.Fill.On = true;
        findButton('intrSub').Data.Text.Value = "My name is Michael Haddon";

    });

    /**
     * and now... after all that, we actually start everything
     */
    setTimeout(main, 150);
});
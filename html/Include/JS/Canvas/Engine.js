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

        drawIntroDots(dt);
        drawContainers(dt);
        showFPS(dt);
    }

    lastTime = now;

    /**
     * rerun the function when the computer can render the animation frame
     */
    requestAnimFrame(main);
}

function drawIntroDots(dt) {
    var Coords = findContainer('containerTitle').getCoords();

    Scene.context.globalAlpha = 0.75;
    Scene.context.beginPath();
    Scene.context.arc(Coords.X + (Coords.Width / 2), Coords.Y + Coords.Height, 7, 0, Math.PI);
    Scene.context.fillStyle = "grey";
    Scene.context.fill();
    Scene.context.stroke();
    Scene.context.closePath();
    Scene.context.globalAlpha = 1;

    for (var i = 1; i < 3; i++) {
        var X = Coords.X + (Coords.Width / 2);
        var Y = Coords.Y + Coords.Height + (21.5 * i)

        Scene.context.globalAlpha = 0.75;
        Scene.context.beginPath();
        Scene.context.arc(X, Y, 4, 0, 2 * Math.PI);
        Scene.context.fillStyle = "grey";
        Scene.context.fill();
        Scene.context.stroke();
        Scene.context.closePath();
        Scene.context.globalAlpha = 1;
    }
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
document.addEventListener('DOMContentLoaded', function () {
    Scene.updateViewport();
    window.addEventListener('resize', function (e) {
        Scene.updateViewport();
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

    loadJSON("/Include/Data/Containers.json", function (obj) {
        obj.forEach(function (e) {
            if (e.Type === "TextBox") {
                Containers.push(new TextBox(e.Data.Description, e));
            } else {
                Containers.push(new Container(e.Data.Description, e));
            }
        });

        findContainer('containerTitle').Data.Fill.On = true;
        findContainer('textTitleDescription').Data.Text.Value = "My name is Michael Haddon";
    });

    loadJSON("/Include/Data/TimelineElements.json", function (obj) {
        var Coords = findContainer('containerTitle').getCoords();

        obj.forEach(function (e, i) {
            loadTimelineElement(Coords, e, i);
            //TimelineElements.push(new TimelineElement(e));
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

function loadTimelineElement(Coords, data, OffsetID) {

    var TimelineName = 'Timeline-' + OffsetID;

    var Element = {
        X: 0,
        Height: 250,
        Width: 500,
    }
    Element.X = (OffsetID % 2 === 1) ? Element.Width / 2 : -Element.Width / 2;


    Containers.push(new Container(TimelineName + '-Container', {
        Data: {
            Position: {
                X: Element.X,
                Y: Coords.Height + 50 + (Element.Height * OffsetID),
                Width: Element.Width,
                Height: Element.Height,
                CenterOffset: "X",
                Centered: "X",
                Parent: "containerTitle"
            }
        }
    }));

    Containers.push(new FancySpankyCircleThing(TimelineName + '-FSCT', {
        Data: {
            Position: {
                X: ((OffsetID % 2 === 1) ? 0 : Element.Width),
                Y: Element.Height / 2,
                Width: 250,
                Height: 250,
                Centered: true,
                Direction: (OffsetID % 2 === 1) ? 'Left' : 'Right',
                Parent: TimelineName + '-Container'
            },
            Fill: {
                On: true,
                Opacity: 0.15
            },
            Hover: {
                On: true,
                Opacity: 0.25,
                ChangeCursor: false
            }
        }
    }));

    Containers.push(new TextBox(TimelineName + '-Title', {
        Data: {
            Position: {
                X: 25,
                Y: 0,
                Width: Element.Width - 50,
                Height: 24,
                Parent: TimelineName + '-Container'
            },
            Text: {
                On: true,
                Size: 24,
                Font: "Roboto,Georgia",
                Center: false,
                Align: (OffsetID % 2 === 1) ? "right" : "left",
                Value: data.Data.Title
            }
        }
    }));

    var SphereOffset = 125 + 5;
    var xv = (OffsetID % 2 === 1) ? SphereOffset : 0;

    Containers.push(new TextBox(TimelineName + '-Description', {
        Data: {
            Position: {
                X: 20 + xv,
                Y: 30,
                Width: Element.Width - 40 - SphereOffset,
                Height: Element.Height - 60,
                Parent: TimelineName + '-Container'
            },
            Text: {
                On: true,
                Size: 14,
                Font: "Roboto,Georgia",
                Center: false,
                Align: "left",
                Value: data.Data.Description
            },
            WrapText: {
                On: true
            }
        }
    }));

    Containers.push(new TextBox(TimelineName + '-Date', {
        Data: {
            Position: {
                X: 20 + xv,
                Y: Element.Height - 5,
                Width: 10,
                Height: 20,
                Parent: TimelineName + '-Container'
            },
            Text: {
                On: true,
                Size: 12,
                Font: "Roboto,Georgia",
                Center: false,
                Align: "left",
                Value: data.Data.Date,
                Opacity: 0.65
            }
        }
    }));

    Containers.push(new PictureBox(TimelineName + '-Picture', {
        Data: {
            Position: {
                X: ((OffsetID % 2 === 1) ? 0 : Element.Width),
                Y: Element.Height / 2,
                Width: 200,
                Height: 200,
                Centered: true,
                Parent: TimelineName + '-Container'
            },
            Image: {
                On: true,
                Sources: data.Data.Images
            }
        }
    }));

    if (typeof data.Data.Buttons !== 'undefined') {
        for (var i = 0; i < data.Data.Buttons.length; i++) {
            var e = data.Data.Buttons[i];
            var btnName = TimelineName + '-Button-' + i;

            Containers.push(new TextBox(btnName, {
                Data: {
                    Position: {
                        X: ((OffsetID % 2 === 1) ? Element.Width - (40 * (i + 1)) : (40 * i)),
                        Y: Element.Height,
                        Width: 40,
                        Height: 40,
                        Centered: false,
                        Parent: TimelineName + '-Container'
                    },
                    Text: {
                        On: true,
                        Value: e.Name,
                        Font: 'Roboto,Georgia',
                        Size: 12,
                        Colour: 'white',
                        LetterSpacing: true
                    },
                    Hover: {
                        On: true
                    },
                    Fill: {
                        On: true,
                        Colour: 'rgb(50,50,50)',
                        Hover: 'rgb(0,0,0)',
                        Pressed: 'rgb(0,0,0)',
                        Opacity: 0.25
                    }
                },
                Events: {
                    onRelease: [
                        {
                            Function: "OpenURL",
                            Parameters: [
                                e.URL
                            ]
                        }
                    ]
                }
            }));
        }
    }
}
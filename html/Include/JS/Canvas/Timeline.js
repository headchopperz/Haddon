var LoadedImages = [];
var TimelineElement = function (settings) {

    this.Data = {
        "Title": "",
        "Images": [],
        "Buttons": [],
        "Date": "",
        "Description": "",
        "CurrentImage": 0,
        "ImageTimer": 0
    };

    this.constructor = function (settings) {
        /**
         * I need to recode this function, i just cant think at the moment
         */
        for (var greaterPropertyName in settings) {
            if (greaterPropertyName === 'Data') {
                for (var majorPropertyName in settings[greaterPropertyName]) {

                    var majorProperty = settings[greaterPropertyName][majorPropertyName];

                    if (typeof majorProperty === 'object') {
                        for (var minorPropertyName in majorProperty) {
                            var minorProperty = majorProperty[minorPropertyName];

                            this.Data[majorPropertyName][minorPropertyName] = minorProperty;
                        }
                    } else {
                        this.Data[majorPropertyName] = majorProperty;
                    }

                }
            }
        }
    }

    this.getCoords = function (OffsetID) {
        var Coords = findButton('intrCont').getCoords();

        var Size = Scene.TimelineElementHeight;
        var X = Coords.X + (Coords.Width / 2) - (Size / 2);
        var Y = Coords.Y + Coords.Height + 50 + (Size * OffsetID);

        return {
            X: X,
            Y: Y,
            Size: Size,
            Visible: true
        }
    }

    this.draw = function (dt, OffsetID) {
        var drawBackground = function (X, Y, Size, OffsetID, dt) {
            var Arc = {
                X: X + (Size / 2),
                Y: Y + (Size / 2),
                Radius: Size / 2
            };

            var Box = {
                X: (OffsetID % 2 === 1) ? X + (Size * 0.5) : X - (Size * 1.5),
                Y: Y,
                Width: Size * 2,
                Height: Size
            }

            var opacity = 0.15;


            if (((Mouse.X < Box.X + (Size * 2)) &&
                    (Mouse.X > Box.X) &&
                    (Mouse.Y < Y + Size) &&
                    (Mouse.Y > Y)) ||
                    (Math.sqrt(Math.pow(Mouse.X - Arc.X, 2) + Math.pow(Mouse.Y - Arc.Y, 2)) < Arc.Radius)) {
                var opacity = 0.25;
            }

            Scene.context.globalAlpha = opacity;
            Scene.context.beginPath();
            Scene.context.arc(Arc.X, Arc.Y, Arc.Radius, 0, Math.PI * 2, true);
            Scene.context.rect(Box.X, Box.Y, Box.Width, Box.Height);
            Scene.context.fillStyle = "black";
            Scene.context.fill();
            Scene.context.closePath();
            Scene.context.globalAlpha = 1;
        }

        var renderImages = function (X, Y, Size, dt) {

            if (this.Data.Images.length) {

                var now = Date.now();

                if (this.Data.ImageTimer + 5000 < now) {

                    if (++this.Data.CurrentImage >= this.Data.Images.length) {
                        this.Data.CurrentImage = 0;
                    }

                    this.Data.ImageTimer = now;
                }

                var cImage = this.Data.Images[this.Data.CurrentImage];

                var ImageName = window.btoa(cImage);
                if (typeof LoadedImages[ImageName] === 'undefined') {
                    LoadedImages[ImageName] = new Image();
                    LoadedImages[ImageName].src = cImage;
                } else if (LoadedImages[ImageName].complete) {
                    var imageSize = 200;
                    Y += (Size - imageSize) / 2;
                    X += (Size - imageSize) / 2;

                    Scene.context.save();
                    Scene.context.beginPath();
                    Scene.context.arc(X + (imageSize / 2), Y + (imageSize / 2), imageSize / 2, 0, Math.PI * 2, true);
                    Scene.context.fillStyle = "black";
                    Scene.context.fill();
                    Scene.context.closePath();
                    Scene.context.clip();


                    Scene.context.drawImage(LoadedImages[ImageName], X, Y, imageSize, imageSize);

                    Scene.context.beginPath();
                    Scene.context.arc(X, Y, imageSize / 2, 0, Math.PI * 2, true);
                    Scene.context.clip();
                    Scene.context.closePath();


                    Scene.context.restore();
                }
            }
        }

        var drawText = function (X, Y, Size, OffsetID, dt) {
            var Title = {
                X: (OffsetID % 2 === 1) ? X + (Size * 2.5) - 25 : X - (Size * 1.5) + 25,
                Y: Y,
                Align: (OffsetID % 2 === 1) ? "right" : "left",
                Size: 24
            };


            Scene.context.font = Title.Size + "px Roboto,Georgia";
            Scene.context.globalAlpha = 1;
            Scene.context.fillStyle = "white";
            Scene.context.textAlign = Title.Align;
            Scene.context.fillText(this.Data.Title, Title.X, Title.Y);
            Scene.context.globalAlpha = 1;

            var Description = {
                X: (OffsetID % 2 === 1) ? X + (Size) : X - (Size * 1.5),
                Y: Y + 16,
                Size: 14,
                LineGap: 6,
                Padding: 15
            };

            var DescriptionText = splitText(this.Data.Description, Description.Size, Size * 2.2);

            for (var i = 0; i < DescriptionText.length; i++) {
                Scene.context.font = Description.Size + "px Roboto,Georgia";
                Scene.context.globalAlpha = 1;
                Scene.context.fillStyle = "white";
                Scene.context.textAlign = 'left';
                Scene.context.fillText(DescriptionText[i], Description.X + Description.Padding, Description.Y + Description.Padding + (i * (Description.Size + Description.LineGap)));
                Scene.context.globalAlpha = 1;
            }

            var DateText = {
                X: (OffsetID % 2 === 1) ? X + (Size) + 15 : X - (Size * 1.5) + 15,
                Y: Y + Size - 5,
                Size: 12
            }

            Scene.context.font = DateText.Size + "px Roboto,Georgia";
            Scene.context.globalAlpha = 0.65;
            Scene.context.fillStyle = "white";
            Scene.context.textAlign = 'left';
            Scene.context.fillText(this.Data.Date, DateText.X, DateText.Y);
            Scene.context.globalAlpha = 1;
        }

        var drawDots = function (X, Y, Size, OffsetID, dt) {
            for (var nY = -Size; nY < Size; nY += 22) {

                var tY = Y + (Size / 2) + nY;

                var sphereEdge = Math.sqrt(Math.pow(Size / 2, 2) - Math.pow(Math.abs(nY), 2));

                if (OffsetID % 2 === 1) {
                    sphereEdge = -sphereEdge;
                }

                var tX = X + (Size / 2) + sphereEdge;

                //X += size - nY;


                Scene.context.globalAlpha = 0.75;
                Scene.context.beginPath();
                Scene.context.arc(tX, tY, 4, 0, 2 * Math.PI);
                Scene.context.fillStyle = "grey";
                Scene.context.fill();
                Scene.context.stroke();
                Scene.context.closePath();
                Scene.context.globalAlpha = 1;
            }
        }

        var positionButtons = function (X, Y, Size, OffsetID, dt) {
            var ButtonOffset = {
                X: (OffsetID % 2 === 1) ? X + (Size * 2.5) - 40 : X - (Size * 1.5),
                Y: Y + Size
            }

            for (var i = 0; i < this.Data.Buttons.length; i++) {
                var e = this.Data.Buttons[i];
                var btnName = 'btnTimeline-' + OffsetID + "/" + i + '-' + e.Name;
                var tmpbtn = findButton(btnName);
                var btnSize = 40;

                if (tmpbtn === false) {
                    tmpbtn = Buttons[Buttons.push(new Button(btnName, {
                        Data: {
                            Position: {
                                X: 0,
                                Y: 0,
                                Width: btnSize,
                                Height: btnSize,
                                Centered: false
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
                    })) - 1];
                }

                if (OffsetID % 2 === 1) {
                    tmpbtn.Data.Position.X = ButtonOffset.X - (i * btnSize);
                } else {
                    tmpbtn.Data.Position.X = ButtonOffset.X + (i * btnSize);
                }
                tmpbtn.Data.Position.Y = ButtonOffset.Y;
            }
        }

        var Coords = this.getCoords(OffsetID);

        if (Coords) {

            drawBackground.call(this, Coords.X, Coords.Y, Coords.Size, OffsetID, dt);
            renderImages.call(this, Coords.X, Coords.Y, Coords.Size, OffsetID, dt);
            drawDots.call(this, Coords.X, Coords.Y, Coords.Size, OffsetID, dt);
            drawText.call(this, Coords.X, Coords.Y, Coords.Size, OffsetID, dt);
            positionButtons.call(this, Coords.X, Coords.Y, Coords.Size, OffsetID, dt);

        }
    }

    this.constructor(settings);

    return {
        Data: this.Data,
        load: constructor,
        draw: this.draw,
        getCoords: this.getCoords
    };
}

if (typeof TimelineElements === "undefined") {
    var TimelineElements = new Array();
} else {

}

/**
 * This function draws the buttons to the screen
 * @param {int} dt - ms since last load
 * @returns {null}
 */
function drawTimeline(dt) {
    var Coords = findButton('intrCont').getCoords();

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


    TimelineElements.forEach(function (e, i) {
        e.draw(dt, i);
    });
}

function splitText(Text, Size, MaxLength) {
    var Texta = Text.split(/\r?\n/g);
    for (var i = 0; i < Texta.length; i++) {
        Texta[i] = Texta[i].trim();
        var e = Texta[i];
        if (Scene.context.measureText(e).width > MaxLength) {
            var splitCharacter = Math.floor(e.length * (MaxLength / Scene.context.measureText(e).width));

            var ClosestSpace = getClosestSpace(e, splitCharacter);
            if (splitCharacter - ClosestSpace < 13) {
                splitCharacter = ClosestSpace;
            }


            Texta.splice(i + 1, 0, e.substr(splitCharacter));
            Texta[i] = e.substr(0, splitCharacter);

        }
        Texta[i] = Texta[i].trim();
    }
    return Texta;
}

function getClosestSpace(Text, index) {
    var ClosestSpace = -1000;

    for (var i = index; i >= 0; i--) {
        if (Text.charAt(i) === " ") {
            ClosestSpace = i;
            break;
        }
    }

    return ClosestSpace;
}
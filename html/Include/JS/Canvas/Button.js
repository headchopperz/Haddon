var Button = function (name, settings) {

    this.Data = {
        Description: "None",
        Position: {
            X: 0,
            Y: 0,
            Width: 0,
            Height: 0,
            Parent: null,
            Centered: true,
            CenterOffset: false
        },
        Status: {
            Visible: true,
            Pressed: false
        },
        Fill: {
            On: false,
            Colour: "black",
            Pressed: "black",
            Opacity: 1
        },
        Outline: {
            On: false,
            Colour: "white",
            Pressed: "white",
            Opacity: 1
        },
        Text: {
            On: false,
            Center: true,
            Colour: "white",
            Pressed: "white",
            Outline: false,
            Value: "...",
            LetterSpacing: false,
            Font: "VT323,Georgia",
            Size: 16,
            Opacity: 1
        },
        TextBox: {
            On: false,
            Value: "",
            _oldValue: "",
            forceInt: false,
            forcePositive: false,
            maxLength: 21
        }
    };

    this.Events = {
        onChanged: [],
        onClick: [],
        onRelease: [],
        onLeave: []
    }

    this.constructor = function (name, settings) {
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

        this.Data.Description = name;
    }

    /**
     * When the textbox info has changed
     * This function operates behind the scenes
     * @type function
     * @returns {null}
     */
    this._onChanged = function () {
        this.Data.TextBox._oldValue = this.Data.TextBox.Value;

        if (this.Events.onChanged.length > 0) {
            for (var i = 0; i < this.Events.onChanged.length; i++) {
                var e = this.Events.onChanged[i];

                var fn = window[e];
                if (typeof fn === "function") {
                    fn.apply(null, [this]);
                }
            }
        }
    }

    /**
     * When the button has been clicked
     * This function operates behind the scenes, it modifies the pressed value
     * @type function
     * @returns {null}
     */
    this._onClick = function () {
        this.Data.Status.Pressed = true;
        if (this.Data.TextBox.On) {
            Scene.SelectedButton = this;
        }

        if (this.Events.onClick.length > 0) {
            for (var i = 0; i < this.Events.onClick.length; i++) {
                var e = this.Events.onClick[i];

                var fn = window[e];
                if (typeof fn === "function") {
                    fn.apply(null, [this]);
                }
            }
        }
    }

    /**
     * When the cursor of the mouse has been released, after clicking
     * This function operates behind the scenes, it modifies the pressed value
     * @type function
     * @returns {null}
     */
    this._onRelease = function () {
        this._onLeave();

        if (this.Events.onRelease.length > 0) {
            for (var i = 0; i < this.Events.onRelease.length; i++) {
                var e = this.Events.onRelease[i];

                var fn = window[e];
                if (typeof fn === "function") {
                    fn.apply(null, [this]);
                }
            }
        }
    }

    /**
     * When the cursor leaves the button
     * This function operates behind the scenes, it modifies the pressed value
     * @type function
     * @returns {null}
     */
    this._onLeave = function () {
        this.Data.Status.Pressed = false;
    }

    this.getCoords = function () {
        var offset = Scene.Viewport;

        if (typeof this.Data.Position.Parent === 'string') {
            var Parent = findButton(this.Data.Position.Parent);
            
            offset = ((Parent !== null) && (Parent.getCoords())) ? Parent.getCoords() : Scene.Viewport;
        }

        if ((offset.Visible) && (this.Data.Status.Visible)) {
            var X = this.Data.Position.X + offset.X;
            var Y = this.Data.Position.Y + offset.Y;

            if (this.Data.Position.CenterOffset) {
                X += offset.Width / 2;
                Y += offset.Height / 2;
            }

            if (this.Data.Position.Centered) {
                X -= (this.Data.Position.Width / 2);
                Y -= (this.Data.Position.Height / 2);
            }

            return {
                X: X,
                Y: Y,
                Width: this.Data.Position.Width,
                Height: this.Data.Position.Height,
                Visible: this.Data.Status.Visible
            }
        }
        return false;
    }

    this.draw = function (dt) {
        var drawBackground = function (X, Y, dt) {
            Scene.context.beginPath();
            Scene.context.rect(X, Y, this.Data.Position.Width, this.Data.Position.Height);

            if (this.Data.Fill.On) {
                if (this.Data.Fill.Colour !== null) {
                    Scene.context.globalAlpha = this.Data.Fill.Opacity;
                    Scene.context.fillStyle = (this.Data.Status.Pressed) ? this.Data.Fill.Pressed : this.Data.Fill.Colour;
                    Scene.context.fill();
                    Scene.context.globalAlpha = 1;
                }
                //there will be an else here for sprites
            }

            if (this.Data.Outline.On) {
                Scene.context.globalAlpha = this.Data.Outline.Opacity;
                Scene.context.strokeStyle = (this.Data.Status.Pressed) ? this.Data.Outline.Pressed : this.Data.Outline.Colour;
                Scene.context.stroke();
                Scene.context.globalAlpha = 1;
            }

            Scene.context.closePath();
        }

        var drawText = function (X, Y, dt) {
            if (this.Data.Text.On) {
                X += (this.Data.Position.Width / 2);
                Y += (this.Data.Position.Height / 2) + (this.Data.Text.Size / 4);

                Scene.context.font = this.Data.Text.Size + "px " + this.Data.Text.Font;
                Scene.context.globalAlpha = this.Data.Text.Opacity;

                if (this.Data.Text.Center) {
                    Scene.context.textAlign = 'center';
                } else {
                    Scene.context.textAlign = 'left';
                }

                var textValue = this.Data.Text.Value;
                if (this.Data.TextBox.On) {
                    textValue += this.Data.TextBox.Value;
                }
                if (this === Scene.SelectedButton) {
                    textValue += "_";
                }

                if (this.Data.Text.LetterSpacing) {
                    textValue = textValue.split("").join(String.fromCharCode(8202));
                }

                Scene.context.fillStyle = (this.Data.Status.Pressed) ? this.Data.Text.Pressed : this.Data.Text.Colour;
                Scene.context.fillText(textValue, X, Y);
                Scene.context.globalAlpha = 1;
            }
        }
        if (this.getCoords()) {
            var X = this.getCoords().X;
            var Y = this.getCoords().Y;

            if (this.Data.Status.Pressed) {
                //make sure this button still has focus
            }

            drawBackground.call(this, X, Y, dt);
            drawText.call(this, X, Y, dt);

        }
    }

    this.constructor(name, settings);

    return {
        Data: this.Data,
        Events: this.Events,
        load: constructor,
        _onChanged: this._onChanged,
        draw: this.draw,
        getCoords: this.getCoords
    };
}

if (typeof Buttons === "undefined") {
    var Buttons = new Array();
} else {

}

Buttons.push(new Button('intrCont', {
    Data: {
        Position: {
            X: 0,
            Y: -200,
            Width: 400,
            Height: 150,
            CenterOffset: true,
            Centered: true
        },
        Fill: {
            On: false,
            Opacity: 0.5
        }
    }
}));

Buttons.push(new Button('intrTitle', {
    Data: {
        Position: {
            X: 0,
            Y: -30,
            Width: 400,
            Height: 110,
            CenterOffset: true,
            Centered: true,
            Parent: 'intrCont'
        },
        Text: {
            On: true,
            Value: 'Hello World',
            Size: 62,
            Colour: 'white'
        }
    }
}));

Buttons.push(new Button('intrSub', {
    Data: {
        Position: {
            X: 0,
            Y: 20,
            Width: 400,
            Height: 100,
            CenterOffset: true,
            Centered: true,
            Parent: 'intrCont'
        },
        Text: {
            On: true,
            Value: 'loading...',
            Font: 'Roboto,Georgia',
            Size: 16,
            Colour: 'white',
            LetterSpacing: true
        }
    }
}));

/**
 * This function draws the buttons to the screen
 * @param {int} dt - ms since last load
 * @returns {null}
 */
function drawButtons(dt) {
    Buttons.forEach(function (e) {
        e.draw();
    });
}

function findButton(name) {
    var foundElement = false;
    Buttons.forEach(function (e) {
        if (name === e.Data.Description) {
            foundElement = e;
            return;
        }
    });

    return foundElement;
}
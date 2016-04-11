var TextBox = function (name, settings) {
    this.constructor(name, settings);
    this.import({
        Data: {
            Text: {
                On: false,
                Center: true,
                Colour: "white",
                Pressed: "white",
                Outline: false,
                Value: "...",
                Padding: 15,
                LetterSpacing: false,
                Font: "VT323,Georgia",
                Align: "middle",
                Size: 16,
                LineGap: 6,
                Opacity: 1
            },
            WrapText: {
                On: false,
                Value: "",
                UnwrappedText: "",
                SpaceDistance: 14
            },
            TextBox: {
                On: false,
                Value: "",
                _oldValue: "",
                forceInt: false,
                forcePositive: false,
                maxLength: 21
            }
        }
    });
    this.import(settings);

    this.RenderQueue.add("drawText");

    this.Events.onClick.push({
        Function: "selectTextBox",
        Parameters: [
            this
        ]
    });
}

TextBox.prototype = Object.create(Container.prototype);
TextBox.prototype.constructor = Container;

/**
 * This function turns a string of text into an array of strings which are wordwrapped
 * to each line.
 * 
 * The wordwrapping is calculated from the elements width, height and text information
 * 
 * If no wordwrapping occurs, then it will return an array with a single element,
 * which is the text passed into it.
 * 
 * The result of the wordwrapping does get cached, so it should not constantly recalculate
 * the result. The cache will automatically be overwritten if you change the elements text.
 * 
 * This function will also split sentances into new lines when \r\n and \n appear in the 
 * string. However it requires wordwrapping to be enabled to work.
 * 
 * The wordwrapping is done to the nearest previous space in accordance to 
 * this.getClosestSpace and this.Data.WrapText.SpaceDistance, however, if there
 * is no space near enough, then it will split a word in half.
 * 
 * Another feature of this function is that each line gets trimmed, meaning that 
 * excess spaces are ignored when passed through this function.
 * 
 * @returns {Array}
 */
TextBox.prototype.wrapText = function () {
    if ((this.Data.WrapText.On) && (this.Data.Text.Value !== this.Data.WrapText.UnwrappedText)) {
        var Text = this.Data.Text.Value.split(/\r?\n/g);

        for (var i = 0; i < Text.length; i++) {
            Text[i] = Text[i].trim();
            var e = Text[i];
            
            Scene.context.font = this.Data.Text.Size + "px " + this.Data.Text.Font;
            if (Scene.context.measureText(e).width > this.Data.Position.Width) {
                var splitCharacter = Math.floor(e.length * (this.Data.Position.Width / Scene.context.measureText(e).width));

                var ClosestSpace = this.getClosestSpace(e, splitCharacter);
                if (splitCharacter - ClosestSpace < this.Data.WrapText.SpaceDistance) {
                    splitCharacter = ClosestSpace;
                }


                Text.splice(i + 1, 0, e.substr(splitCharacter));
                Text[i] = e.substr(0, splitCharacter);

            }
            Text[i] = Text[i].trim();
        }
        
        this.Data.WrapText.Value = Text;

        this.Data.WrapText.UnwrappedText = this.Data.Text.Value;
    }
    return (this.Data.WrapText.On) ? this.Data.WrapText.Value : [this.Data.Text.Value.trim()];
}

/**
 * This function finds the closest space before the nth character in the string
 * where n = index.
 * 
 * @param {String} Text
 * @param {Integer} index
 * @returns {Integer}
 */
TextBox.prototype.getClosestSpace = function (Text, index) {
    var ClosestSpace = -1000;

    for (var i = index; i >= 0; i--) {
        if (Text.charAt(i) === " ") {
            ClosestSpace = i;
            break;
        }
    }

    return ClosestSpace;

}

/**
 * When the textbox info has changed
 * This function operates behind the scenes
 * @type function
 * @returns {null}
 */
TextBox.prototype._onChanged = function () {
    this.Data.TextBox._oldValue = this.Data.TextBox.Value;

    if (this.Events.onChanged.length > 0) {
        for (var i = 0; i < this.Events.onChanged.length; i++) {
            var e = this.Events.onChanged[i];

            var fn = window[e.Function];
            if (typeof fn === "function") {
                fn.apply(this, [e.Parameters]);
            }
        }
    }
}

/**
 * 
 * @param {Integer} X
 * @param {Integer} Y
 * @param {Integer} dt
 * @returns {undefined}
 */
TextBox.prototype.drawText = function (X, Y, dt) {
    if (this.Data.Text.On) {

        var arrText = this.wrapText();

        for (var i = 0; i < arrText.length; i++) {
            var Text = {
                Value: arrText[i],
                X: X,
                Y: Y + (i * (this.Data.Text.Size + this.Data.Text.LineGap))
            };

            Scene.context.font = this.Data.Text.Size + "px " + this.Data.Text.Font;
            Scene.context.globalAlpha = this.Data.Text.Opacity;
            
            if (this.Data.Text.Center) {
                Scene.context.textAlign = 'center';
                Text.X += (this.Data.Position.Width / 2);
                Text.Y += (this.Data.Position.Height / 2) + (this.Data.Text.Size / 4);
            } else if (this.Data.Text.Align === 'right') {
                Scene.context.textAlign = this.Data.Text.Align;
                Text.X += (this.Data.Position.Width);
            } else {
                Scene.context.textAlign = this.Data.Text.Align;
            }

            if (this.Data.TextBox.On) {
                Text.Value += this.Data.TextBox.Value;
            }
            if (this === Scene.SelectedButton) {
                Text.Value += "_";
            }

            if (this.Data.Text.LetterSpacing) {
                Text.Value = Text.Value.split("").join(String.fromCharCode(8202));
            }

            Scene.context.fillStyle = (this.Data.Status.Pressed) ? this.Data.Text.Pressed : this.Data.Text.Colour;
            Scene.context.fillText(Text.Value, Text.X, Text.Y);
            Scene.context.globalAlpha = 1;
        }
    }
}

TextBox.prototype.selectTextBox = function (target) {
    if (this.Data.TextBox.On) {
        Scene.SelectedButton = target;
    }
}
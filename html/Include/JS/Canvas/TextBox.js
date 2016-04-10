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

TextBox.prototype.wrapText = function () {
    if (this.Data.Text.Value !== this.Data.WrapText.UnwrappedText) {
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
    return (this.Data.WrapText.On) ? this.Data.WrapText.Value : [this.Data.Text.Value];
}

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
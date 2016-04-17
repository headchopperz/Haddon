/**
 * This class is responsible for handling container elements with text 
 * 
 * Text drawing is suprisingly computational heavy, and some things may need to
 * be done to speed this up
 * 
 * 1. WebGL rendering
 * 2. Caching the rendering of text to an image, then rendering the image
 * 
 * @param {String} name
 * @param {String} settings
 * @returns {TextBox}
 */
var TextBox = function (name, settings) {
    this.constructor(name, settings);
    this.import({
        Data: {
            /**
             * This class controls the basic text element
             */
            Text: {
                On: false,
                /**
                 * Is the text centered?
                 * This will override the align setting
                 */
                Center: true,
                /**
                 * What colour is the text
                 */
                Colour: "white",
                /**
                 * What colour is the text if this element is clicked on
                 */
                Pressed: "white",
                /**
                 * Does the text have an outline?
                 */
                Outline: false,
                /**
                 * What does the text say?
                 */
                Value: "...",
                /**
                 * What is the texts padding, from the outside of the container
                 */
                Padding: 15,
                /**
                 * Is there a space between the letters? Unfortunantely i cannot
                 * define this space in px or em, but it is either true or false
                 * 
                 * i f   t h e r e   i s   s p a c i n g <- it will be like that if true 
                 * 
                 */
                LetterSpacing: false,
                /**
                 * What is the font?
                 * You can list multiple fonts here, seperate them with a ,
                 * It will prefer the first font it encounters, but if it has not
                 * loaded that font, it will fallback to the next font.
                 */
                Font: "VT323,Georgia",
                /**
                 * What is the alignment of the text, you can set this to
                 * left, middle or right
                 */
                Align: "middle",
                /**
                 * What is the size of the text in px
                 */
                Size: 16,
                /**
                 * What is the gap between multiple lines of this text?
                 * This goes well with wraptext
                 */
                LineGap: 6,
                /**
                 * What is the opacity of the text.
                 */
                Opacity: 1
            },
            /**
             * Do we want to wrap this text to fit the container it is in?
             */
            WrapText: {
                On: false,
                /**
                 * The below three variables are used to cache the result so we 
                 * do not have to constantly rewrap the text
                 */
                Value: "",
                UnwrappedText: "",
                currentCacheID: 0,
                /**
                 * The wrapping is done to the closest space, to try to not split
                 * words in half.
                 * The SpaceDistance is the amount of distance that the wrapper will
                 * look back to find the last space.
                 * If no space exists in range, then it will split the word in half.
                 * If you set this to 0, it will always split a word in half.
                 */
                SpaceDistance: 14
            },
            /**
             * The below is a class for an editable version of the text container
             * The textbox feature is currently not fully implemented
             */
            TextBox: {
                On: false,
                /**
                 * What is the value of the textbox
                 */
                Value: "",
                _oldValue: "",
                /**
                 * Should inputs be forced to be an integer? Making the user unable
                 * to enter non-number symbols (negative is allowed if it is at the start)
                 */
                forceInt: false,
                /**
                 * Should inputs be forced to be number AND positive numbers
                 */
                forcePositive: false,
                /**
                 * Whats the max length that the user can input
                 */
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
    if ((this.Data.WrapText.On) && ((this.Data.Text.Value !== this.Data.WrapText.UnwrappedText) || (this.Data.WrapText.currentCacheID !== Scene.resizeCachedID))) {
        var Text = this.Data.Text.Value.split(/\r?\n/g);
        var Coords = this.getCoords();

        for (var i = 0; i < Text.length; i++) {
            Text[i] = Text[i].trim();
            var e = Text[i];
            
            Scene.context.font = this.Data.Text.Size + "px " + this.Data.Text.Font;
            if (Scene.context.measureText(e).width > Coords.Width) {
                var splitCharacter = Math.floor(e.length * (Coords.Width / Scene.context.measureText(e).width));

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
        this.Data.WrapText.currentCacheID = Scene.resizeCachedID;
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
 * This method draws the text to the screen, it is added to the RenderQueue in
 * Container
 * 
 * 
 * @param {Integer} X
 * @param {Integer} Y
 * @param {Integer} dt
 * @returns {undefined}
 */
TextBox.prototype.drawText = function (X, Y, dt) {
    if (this.Data.Text.On) {
        var Coords = this.getCoords();

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
                Text.X += (Coords.Width / 2);
                Text.Y += (Coords.Height / 2) + (this.Data.Text.Size / 4);
            } else if (this.Data.Text.Align === 'right') {
                Scene.context.textAlign = this.Data.Text.Align;
                Text.X += (Coords.Width);
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

/**
 * This method is for editable TextBox elements, but is not fully supported as 
 * the site does not have any editable TextBox elements.
 * 
 * It is meant to record that the element is currently being selected, for future
 * keyboard inputs.
 * 
 * @param {type} target
 * @returns {undefined}
 */
TextBox.prototype.selectTextBox = function (target) {
    if (this.Data.TextBox.On) {
        Scene.SelectedButton = target;
    }
}
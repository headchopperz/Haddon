/**
 * This class is responsible for handling ContainerElement elements with text 
 * 
 * Text drawing is suprisingly computational heavy, and some things may need to
 * be done to speed this up
 * 
 * 1. WebGL rendering
 * 2. Caching the rendering of text to an image, then rendering the image
 * 
 * @param {String} name
 * @param {String} settings
 * @returns {ContainerElement_TextBox}
 */
var ContainerElement_TextBox = function (name, settings) {
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
                 * What is the texts padding, from the outside of the ContainerElement
                 */
                Padding: 15,
                PaddingTop: 0,
                PaddingLeft: 0,
                PaddingRight: 0,
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
                 * left, center or right
                 */
                Align: "center",
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
             * Do we want to wrap this text to fit the ContainerElement it is in?
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
             * The below is a class for an editable version of the text ContainerElement
             * The ContainerElement_TextBox feature is currently not fully implemented
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

    this.Events.onRelease.push({
        Function: "selectTextBox",
        Parameters: [
            this
        ]
    });
}

ContainerElement_TextBox.prototype = Object.create(ContainerElement.prototype);
ContainerElement_TextBox.prototype.constructor = ContainerElement;

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
ContainerElement_TextBox.prototype.wrapText = function () {
    if ((this.Data.WrapText.On) && ((this.Data.Text.Value !== this.Data.WrapText.UnwrappedText) || (this.Data.WrapText.currentCacheID !== Scene.resizeCachedID))) {
        var Text = this.Data.Text.Value.toString().split(/\r?\n/g);
        var Coords = this.getCoords();

        for (var i = 0; i < Text.length; i++) {
            Text[i] = Text[i].trim();
            var e = Text[i];
            
            var textSize = Scene.getTextSize(e, this.Data.Text.Size + "px " + this.Data.Text.Font);
            
            if (textSize > Coords.Width) {
                var splitCharacter = Math.floor(e.length * (Coords.Width / textSize));

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
    return (this.Data.WrapText.On) ? this.Data.WrapText.Value : [this.Data.Text.Value.toString().trim()];
}

/**
 * This function finds the closest space before the nth character in the string
 * where n = index.
 * 
 * @param {String} Text
 * @param {Integer} index
 * @returns {Integer}
 */
ContainerElement_TextBox.prototype.getClosestSpace = function (Text, index) {
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
 * When the ContainerElement_TextBox info has changed
 * This function operates behind the scenes
 * @type function
 * @returns {null}
 */
ContainerElement_TextBox.prototype._onChanged = function () {
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
 * ContainerElement
 * 
 * 
 * @param {Integer} X
 * @param {Integer} Y
 * @param {Integer} dt
 * @returns {undefined}
 */
ContainerElement_TextBox.prototype.drawText = function (X, Y, dt) {
    if (this.Data.Text.On) {
        var Coords = this.getCoords();

        var arrText = this.wrapText();

        for (var i = 0; i < arrText.length; i++) {
            var Text = {
                Value: arrText[i],
                X: X,
                Y: Y + (i * (this.Data.Text.Size + this.Data.Text.LineGap))
            };

            if (this.Data.Text.Center) {
                Text.X += (Coords.Width / 2);
                Text.Y += (Coords.Height / 2) + (this.Data.Text.Size / 4);
            } else {
                Text.Y += this.Data.Text.Padding + this.Data.Text.PaddingTop;
            }

            if (this.Data.Text.Align === 'right') {
                Text.X += (Coords.Width) - this.Data.Text.Padding + this.Data.Text.PaddingRight;
            } else if (this.Data.Text.Align === 'left') {
                Text.X = X + this.Data.Text.Padding + this.Data.Text.PaddingLeft;
            }

            if (this.Data.TextBox.On) {
                Text.Value += this.Data.TextBox.Value;
            }
            if (this.Data.Description === Scene.Data.Info.SelectedTextBox) {
                Text.Value += (Math.round((new Date().getTime() / 1000) / 0.5) % 2) ? "_" : " ";
            }

            if (this.Data.Text.LetterSpacing) {
                Text.Value = Text.Value.split("").join(String.fromCharCode(8202));
            }


            Scene.drawText(Text.X, Text.Y, Text.Value,
                    ({
                        Opacity: this.Data.Text.Opacity,
                        Align: this.Data.Text.Align,
                        Colour: (this.Data.Status.Pressed) ? this.Data.Text.Pressed : this.Data.Text.Colour,
                        Font: this.Data.Text.Size + "px " + this.Data.Text.Font
                    }));
        }
    }
}

/**
 * This method is for editable TextBox elements
 * 
 * It is meant to record that the element is currently being selected, for future
 * keyboard inputs.
 * 
 * @param {type} target
 * @returns {undefined}
 */
var selectTextBox = function (target) {
    if (target.Data.TextBox.On) {
        Scene.Data.Info.SelectedTextBox = target.Data.Description;
    }
}
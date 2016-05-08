/**
 * This class holds and contains the events of the Keyboard, the main purpose
 * of this class is to find out whether or not a particular key is currently
 * being pressed.
 *
 * Key.isKeyPressed(keyCode, getIndex)
 */
var Key = new (function (settings) {
    this.keyArray = new Array();

    /**
     * Is a key currently being pressed?
     *
     * Use the KeyCode class to easily destinguish the keys.
     *
     * If the key is found to be pressed, then getIndex will define what is returned
     * false means it will always return a boolean on whether or not the key is pressed
     * true means it will return the index in keyArray that this key is located
     * be warned, that if you set it to true, then if the index is 0, then 0 == false (so do ===)
     *
     * EG:
     *
     * Key.isKeyPressed(keyCode.SPACE, true);
     *
     * @param {Number} keyCode
     * @param {Boolean} getIndex
     * @returns {Number|Boolean}
     */
    this.isKeyPressed = function (keyCode, getIndex) {
        var keyIndex = false;
        for (var i = 0; i < this.keyArray.length; i++) {
            if (this.keyArray[i] === keyCode) {
                keyIndex = i;
                break;
            }
        }
        return keyIndex !== false ? (getIndex ? keyIndex : true) : false; //because 0 may be considered as false
    }

    /**
     * This method is called when the user presses down a key when the element has focus
     * @param {Object} e
     * @returns {undefined}
     */
    this.onKeyPressed = function (e) {
        /**
         * If the key has not already been pressed, then we add it to our list of keys that the user is pressing
         */
        if (!this.isKeyPressed(e.keyCode, false)) {
            this.keyArray.push(e.keyCode);
        }

        this.writeText(e);
        Container.registerKeyPress(e.keyCode);
    }

    this.writeText = function (e) {
        var SelectedTextBox = Container.find(Scene.Data.Info.SelectedTextBox);
        if (SelectedTextBox) {
            SelectedTextBox.Data.TextBox.Value = String(SelectedTextBox.Data.TextBox.Value);

            if ((e.keyCode == KeyCode.ENTER) || (e.keyCode == KeyCode.ESCAPE)) { //If the user pressed enter of escape, we can assume they want to stop editing this textbox
                Scene.Data.Info.SelectedTextBox = null;
            } else if ((e.keyCode == KeyCode.BACKSPACE) && (SelectedTextBox.Data.TextBox.Value.length > 0)) { //if the user did backspace, then we can assume they want to remove stuff
                SelectedTextBox.Data.TextBox.Value = SelectedTextBox.Data.TextBox.Value.substring(0, SelectedTextBox.Data.TextBox.Value.length - 1);
            } else if ((String.fromCharCode(e.keyCode)) && (SelectedTextBox.Data.TextBox.Value.length < SelectedTextBox.Data.TextBox.maxLength)) { //otherwise we add this key to the textbox, if its valid
                if ((!this.isKeyPressed(KeyCode.SHIFT)) && (e.keyCode >= 65) && (e.keyCode <= 90)) {
                    SelectedTextBox.Data.TextBox.Value += String.fromCharCode(e.keyCode + 32);
                } else if ((e.keyCode >= 32) && (e.keyCode <= 126)) {
                    SelectedTextBox.Data.TextBox.Value += String.fromCharCode(e.keyCode);
                }
            }

            /**
             * We run the event that tells us the element has also changed its text, i dont actually use this
             * i was planning on doing something with it on the highscores, but i changed my mind
             */
            if (SelectedTextBox.Data.TextBox._oldValue !== SelectedTextBox.Data.TextBox.Value) {
                SelectedTextBox._onChanged();
            }
            e.preventDefault();
        }
    }


    /**
     * This method is called when the user releases a key when the element has focus
     * @param {Object} e
     * @returns {undefined}
     */
    this.onKeyUp = function (e) {
        /**
         * If the user releases their key, then we must remove it from our list of keys they are holding down
         */

        var keyIndex = this.isKeyPressed(e.keyCode, true);
        if (keyIndex !== false) {
            this.keyArray.splice(keyIndex, 1);
        }
        
        Container.registerKeyRelease(e.keyCode);
    }

    return {
        isKeyPressed: this.isKeyPressed,
        onKeyPressed: this.onKeyPressed,
        onKeyUp: this.onKeyUp,
        keyArray: this.keyArray,
        writeText: this.writeText
    };
});
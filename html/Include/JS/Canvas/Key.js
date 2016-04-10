var Key = new (function (settings) {
    this.keyArray = new Array();

    this.isKeyPressed = function(keyCode, getIndex) {
        var keyIndex = false;
        for (var i = 0; i < this.keyArray.length; i++) {
            if (this.keyArray[i] === keyCode) {
                keyIndex = i;
                break;
            }
        }
        return keyIndex !== false ? (getIndex ? keyIndex : true) : false; //because 0 may be considered as false
    }
    
    this.onKeyPressed = function(e) {
        /**
         * If the key has not already been pressed, then we add it to our list of keys that the user is pressing
         */
        if (!this.isKeyPressed(e.keyCode, false)) {
            this.keyArray.push(e.keyCode);
        }
        
        /**
         * If the user is selecting a textbox while pressing this key, then we add whatever this key is to that textbox field.
         * There is a problem though with what you do when the person does something funny, like pressing a key that is a modifier rather than a letter
         * im not sure how to fix that
         * but something like shift would put funny \000 and stuff in the system and will break the highscores,
         * would have to google
         */
        
        
        if (Scene.SelectedButton !== null) {
            Scene.SelectedButton.TextBox.Value = String(Scene.SelectedButton.TextBox.Value);
            if ((e.keyCode == KEY.ENTER) || (e.keyCode == KEY.ESCAPE)) { //If the user pressed enter of escape, we can assume they want to stop editing this textbox
                Scene.SelectedButton = null;
            } else if ((e.keyCode == KEY.BACKSPACE) && (Scene.SelectedButton.TextBox.Value.length > 0)) { //if the user did backspace, then we can assume they want to remove stuff
                Scene.SelectedButton.TextBox.Value = Scene.SelectedButton.TextBox.Value.substring(0, Scene.SelectedButton.TextBox.Value.length - 1);
            } else if ((String.fromCharCode(e.keyCode)) && (Scene.SelectedButton.TextBox.Value.length < Scene.SelectedButton.TextBox.maxLength)) { //otherwise we add this key to the textbox, if its valid
                Scene.SelectedButton.TextBox.Value += String.fromCharCode(e.keyCode);
            }

            /**
             * We run the event that tells us the element has also changed its text, i dont actually use this
             * i was planning on doing something with it on the highscores, but i changed my mind
             */
        
            if ((Scene.SelectedButton !== null) && (Scene.SelectedButton.TextBox._oldValue !== Scene.SelectedButton.TextBox.Value))
                Scene.SelectedButton._onChanged();
        }
    }
    
    this.onKeyUp = function(e) {
        /**
         * If the user releases their key, then we must remove it from our list of keys they are holding down
         */
        
        var keyIndex = this.isKeyPressed(e.keyCode, true);
        if (keyIndex !== false) {
            this.keyArray.splice(keyIndex, 1);
        }    
    }

    return {
        isKeyPressed: this.isKeyPressed,
        onKeyPressed: this.onKeyPressed,
        onKeyUp: this.onKeyUp,
        keyArray: this.keyArray,
    };
});
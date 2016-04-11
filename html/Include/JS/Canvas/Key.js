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
    
    /**
     * This method is called when the user presses down a key when the element has focus
     * @param {Object} e
     * @returns {undefined}
     */
    this.onKeyPressed = function(e) {
        /**
         * If the key has not already been pressed, then we add it to our list of keys that the user is pressing
         */
        if (!this.isKeyPressed(e.keyCode, false)) {
            this.keyArray.push(e.keyCode);
        }
    }
    
    
    /**
     * This method is called when the user releases a key when the element has focus
     * @param {Object} e
     * @returns {undefined}
     */
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
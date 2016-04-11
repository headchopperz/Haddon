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
/**
 * This class is responsible for handling the mouse and its various events.
 */
var Mouse = new (function (settings) {
    this.X = 0;
    this.Y = 0;
    this.Down = false;

    this.isDown = function () {
        return this.Down;
    }

    /**
     * This method is called when the mouse is pressed down.
     * The purpose of this method is to find and trigger any relevent callbacks
     * that should be called when the mouse is clicked
     * An example would be clicking on a button, the relevent button needs to be
     * updated
     * 
     * @param {type} en
     * @returns {undefined}
     */
    this.press = function (en) {
        this.Down = true;
        
        Container.registerMouseDown();
    }


    /**
     * This method is called when the mouse is released.
     * The purpose of this method is to find and trigger any relevent callbacks
     * that should be called when the mouse is released
     * An example would be releaseing your mouse from a button, the relevent 
     * button needs to be updated
     * 
     * @param {type} en
     * @returns {undefined}
     */
    this.release = function (en) {
        this.Down = false;


        Container.registerMouseRelease();
    }

    /**
     * This method is called when the mouse is moved.
     * The purpose of this method is to find and trigger any relevent callbacks
     * that should be called when the mouse is moved
     * An example would be when you hover an element on the page, the element 
     * may need to update to show that it is actionable.
     * 
     * @param {type} en
     * @returns {undefined}
     */
    this.move = function (en) {
        this.X = Math.round(en.pageX - Scene.getOffset().left, 10);
        this.Y = Math.round(en.pageY - Scene.getOffset().top, 10);

        Container.registerMouseMove();
    }

    return {
        X: this.X,
        Y: this.Y,
        isDown: this.isDown,
        press: this.press,
        release: this.release,
        move: this.move
    }
});
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

        /**
         * I really wish ecmascript would make a good foreach loop...
         * I had to move this from a foreach to a for because it was messing
         * with the "this" variable
         */
        for (var i = 0; i < Containers.length; i++) {
            var e = Containers[i];
            
            if ((!e.Data.Status.Pressed) && e.isHovered(this)) {
                e._onClick();
            }
        }
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


        for (var i = 0; i < Containers.length; i++) {
            var e = Containers[i];
            if ((e.Data.Status.Pressed) && e.isHovered(this)) {
                e._onRelease();
            }
        }
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

        var HoveredElementsAm = 0;

        for (var i = 0; i < Containers.length; i++) {
            var e = Containers[i];
            
            if ((e.Data.Hover.On) && e.isHovered(this)) {
                e._onHover();
                if ((!e.Data.Status.Pressed) && this.Down) {
                    e._onClick();
                }
                if (e.Data.Hover.On && e.Data.Hover.ChangeCursor) {
                    HoveredElementsAm++;
                }
            } else {
                e._onLeave();
            }
        }

        /**
         * Did we encounter any elements that require the mouse cursor to change
         * its pointer?
         * If so then we want to change for the entire page... (its the only way
         * that i could find). However, since we turn it back just as fast, it
         * seems fluid.
         */
        if (HoveredElementsAm > 0) {
            Scene.canvas.style.cursor = 'pointer';
        } else {
            Scene.canvas.style.cursor = '';
        }
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
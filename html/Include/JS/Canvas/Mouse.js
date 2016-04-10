var Mouse = new (function (settings) {
    this.X = 0;
    this.Y = 0;
    this.Down = false;

    this.isDown = function () {
        return this.Down;
    }

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

    this.release = function (e) {
        this.Down = false;


        for (var i = 0; i < Containers.length; i++) {
            var e = Containers[i];
            if ((e.Data.Status.Pressed) && e.isHovered(this)) {
                e._onRelease();
            }
        }
    }

    this.move = function (e) {
        this.X = Math.round(e.pageX - Scene.getOffset().left, 10);
        this.Y = Math.round(e.pageY - Scene.getOffset().top, 10);

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
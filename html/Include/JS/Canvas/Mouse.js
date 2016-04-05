var Mouse = new (function (settings) {
    this.X = 0;
    this.Y = 0;
    var Down = false;
    
    this.isDown = function() {
        return Down;
    }
    
    this.press = function(e) {
        Down = true;
        
        Buttons.forEach(function (e) {
            var Coords = e.getCoords();
            if ((Coords) && (!e.Data.Status.Pressed)) {
                var X = Coords.X;
                var Y = Coords.Y;

                if ((this.X < X + Coords.Width) &&
                        (this.X > X) &&
                        (this.Y < Y + Coords.Height) &&
                        (this.Y > Y)) {
                    e._onClick();
                }
            }
        }); 
    }
    
    this.release = function(e) {
        Down = false;
        
        Buttons.forEach(function (e) {
            var Coords = e.getCoords();
            if ((Coords) && (e.Data.Status.Pressed)) {
                var X = Coords.X;
                var Y = Coords.Y;

                if ((this.X < X + Coords.Width) &&
                        (this.X > X) &&
                        (this.Y < Y + Coords.Height) &&
                        (this.Y > Y)) {
                    e._onRelease();
                }
            }
        });        
    }
    
    this.move = function(e) {
        this.X = Math.round(e.pageX - $('#scene').offset().left, 10);
        this.Y = Math.round(e.pageY - $('#scene').offset().top, 10);
        
        
        Buttons.forEach(function (e) {
            var Coords = e.getCoords();
            if ((Coords) && (!e.Data.Status.Pressed)) {
                var X = Coords.X;
                var Y = Coords.Y;

                if ((this.X < X + Coords.Width) &&
                        (this.X > X) &&
                        (this.Y < Y + Coords.Height) &&
                        (this.Y > Y)) {
                    e._onClick();
                }
            }
        }); 
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
var FancySpankyCircleThing = function (name, settings) {
    this.constructor(name, settings);

    this.import({
        Data: {
            Position: {
                Direction: "Left"
            },
            Status: {
                SpinnyThing: 0
            },
            Dots: {
                On: false,
                GapBetweenDots: 22,
                Animate: true,
                AnimateID: 0,
                AnimateSpeed: 1
            }
        }
    });

    this.import(settings);

    this.RenderQueue.add("drawPicture");
}

FancySpankyCircleThing.prototype = Object.create(Container.prototype);
FancySpankyCircleThing.prototype.constructor = Container;

FancySpankyCircleThing.prototype.calcPosInfo = function (X, Y) {
    var Size = (this.Data.Position.Width + this.Data.Position.Height) / 2;
    var Arc = {
        X: X + (Size / 2),
        Y: Y + (Size / 2),
        Radius: Size / 2
    };

    var Box = {
        X: (this.Data.Position.Direction === 'Left') ? X + (Size * 0.5) : X - (Size * 1.5),
        Y: Y,
        Width: Size * 2,
        Height: Size
    }

    return {
        Size: Size,
        Arc: Arc,
        Box: Box
    }
}

FancySpankyCircleThing.prototype.drawBackground = function (X, Y, dt) {
    var Pos = this.calcPosInfo(X, Y);

    Scene.context.globalAlpha = (this.Data.Status.Hovered) ? this.Data.Hover.Opacity : this.Data.Fill.Opacity;
    Scene.context.beginPath();
    Scene.context.arc(Pos.Arc.X, Pos.Arc.Y, Pos.Arc.Radius, 0, Math.PI * 2, true);
    //Scene.context.rect(Pos.Box.X, Pos.Box.Y, Pos.Box.Width, Pos.Box.Height);
    Scene.context.fillStyle = "black";
    Scene.context.fill();
    Scene.context.closePath();
    Scene.context.globalAlpha = 1;

    Scene.context.globalAlpha = (this.Data.Status.Hovered) ? this.Data.Hover.Opacity : this.Data.Fill.Opacity;
    Scene.context.beginPath();
    Scene.context.rect(Pos.Box.X, Pos.Box.Y, Pos.Box.Width, Pos.Box.Height);
    Scene.context.fillStyle = "black";
    Scene.context.fill();
    Scene.context.closePath();
    Scene.context.globalAlpha = 1;

    Scene.context.globalAlpha = 0.05;
    Scene.context.beginPath();

    this.Data.Status.SpinnyThing += (this.Data.Position.Direction === 'Left') ? (dt * 0.0005) : -(dt * 0.0005);
    Scene.context.arc(Pos.Arc.X, Pos.Arc.Y, Pos.Arc.Radius - 5, this.Data.Status.SpinnyThing, Math.PI + this.Data.Status.SpinnyThing, true);
    //Scene.context.rect(Pos.Box.X, Pos.Box.Y, Pos.Box.Width, Pos.Box.Height);
    Scene.context.fillStyle = "white";
    Scene.context.fill();
    Scene.context.closePath();
    Scene.context.globalAlpha = 1;

    if (this.Data.Dots.On) {

        var dotAmount = Math.floor(this.Data.Position.Height / this.Data.Dots.GapBetweenDots);

        this.Data.Dots.AnimateID += (dt * 0.001) * this.Data.Dots.AnimateSpeed

        if (this.Data.Dots.AnimateID > dotAmount + 1) {
            this.Data.Dots.AnimateID = 0;
        }

        for (var i = 0; i <= dotAmount; i++) {
            var dotYOffset = (i - (dotAmount / 2)) * this.Data.Dots.GapBetweenDots;

            var dot = {
                X: Pos.Arc.X,
                Y: Pos.Arc.Y + dotYOffset
            }

            var sphereEdgeX = Math.sqrt(Math.pow(Pos.Size / 2, 2) - Math.pow(Math.abs(dotYOffset), 2));

            if (this.Data.Position.Direction === 'Left') {
                sphereEdgeX = -sphereEdgeX;
            }
            
            
            var opacity = 0.25;
            
            if (Math.abs(i - this.Data.Dots.AnimateID) <= 1) {
                var difference = 1 - Math.abs(i - this.Data.Dots.AnimateID);
                
                opacity += difference * 0.75;
            } else if ((i === 0) && (this.Data.Dots.AnimateID > dotAmount)) {
                var difference = 1 - Math.abs((dotAmount + 1) - this.Data.Dots.AnimateID);
                
                opacity += difference * 0.75;
            }

            dot.X += sphereEdgeX;

            Scene.context.globalAlpha = opacity;
            Scene.context.beginPath();
            Scene.context.arc(dot.X, dot.Y, 4, 0, 2 * Math.PI);
            Scene.context.fillStyle = "grey";
            Scene.context.fill();
            Scene.context.stroke();
            Scene.context.closePath();
            Scene.context.globalAlpha = 1;
        }
    }
}

FancySpankyCircleThing.prototype.isHovered = function (_Mouse) {
    var Coords = this.getCoords();
    var Pos = this.calcPosInfo(Coords.X, Coords.Y);

    return ((Coords) && (((_Mouse.X < Pos.Box.X + (Pos.Size * 2)) &&
            (_Mouse.X > Pos.Box.X) &&
            (_Mouse.Y < Pos.Box.Y + Pos.Size) &&
            (_Mouse.Y > Pos.Box.Y)) ||
            (Math.sqrt(Math.pow(_Mouse.X - Pos.Arc.X, 2) + Math.pow(_Mouse.Y - Pos.Arc.Y, 2)) < Pos.Arc.Radius)));
}
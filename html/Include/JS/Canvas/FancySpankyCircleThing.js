var FancySpankyCircleThing = function (name, settings) {
    this.constructor(name, settings);

    this.import({
        Data: {
            Position: {
                Direction: "Left"
            },
            Status: {
                SpinnyThing: 0
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

    for (var nY = -Pos.Size; nY < Pos.Size; nY += 22) {

        var tY = Y + (Pos.Size / 2) + nY;


        var sphereEdge = Math.sqrt(Math.pow(Pos.Size / 2, 2) - Math.pow(Math.abs(nY), 2));

        if (this.Data.Position.Direction === 'Left') {
            sphereEdge = -sphereEdge;
        }

        var tX = X + (Pos.Size / 2) + sphereEdge;

        Scene.context.globalAlpha = 0.75;
        Scene.context.beginPath();
        Scene.context.arc(tX, tY, 4, 0, 2 * Math.PI);
        Scene.context.fillStyle = "grey";
        Scene.context.fill();
        Scene.context.stroke();
        Scene.context.closePath();
        Scene.context.globalAlpha = 1;
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
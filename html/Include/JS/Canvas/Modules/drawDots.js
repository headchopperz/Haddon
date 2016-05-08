
function drawIntroDots(dt) {
    var Coords = Container.find('containerTitle').getCoords();

    Scene.context.globalAlpha = 0.75;
    Scene.context.beginPath();
    Scene.context.arc(Coords.X + (Coords.Width / 2), Coords.Y + Coords.Height, 7, 0, Math.PI);
    Scene.context.fillStyle = "grey";
    Scene.context.fill();
    Scene.context.stroke();
    Scene.context.closePath();
    Scene.context.globalAlpha = 1;

    for (var i = 1; i < 3; i++) {
        var X = Coords.X + (Coords.Width / 2);
        var Y = Coords.Y + Coords.Height + (21.5 * i)

        Scene.context.globalAlpha = 0.75;
        Scene.context.beginPath();
        Scene.context.arc(X, Y, 4, 0, 2 * Math.PI);
        Scene.context.fillStyle = "grey";
        Scene.context.fill();
        Scene.context.stroke();
        Scene.context.closePath();
        Scene.context.globalAlpha = 1;
    }
}
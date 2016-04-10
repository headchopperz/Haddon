var LoadedImages = [];

var PictureBox = function (name, settings) {
    this.constructor(name, settings);

    this.import({
        Data: {
            Image: {
                On: false,
                Delay: 5000,
                Timer: 0,
                CurrentID: 0,
                Sources: []
            }
        }
    });

    this.import(settings);

    this.RenderQueue.add("drawPicture");
}

PictureBox.prototype = Object.create(Container.prototype);
PictureBox.prototype.constructor = Container;

PictureBox.prototype.drawPicture = function (X, Y, dt) {
    //console.log(this.Data.Image.Sources);
    if (this.Data.Image.Sources.length) {
        var now = Date.now();

        if (this.Data.Image.Timer + this.Data.Image.Delay < now) {

            if (++this.Data.Image.CurrentID >= this.Data.Image.Sources.length) {
                this.Data.Image.CurrentID = 0;
            }

            this.Data.Image.Timer = now;
        }

        var currentImage = this.Data.Image.Sources[this.Data.Image.CurrentID];

        var ImageName = window.btoa(currentImage);
        if (typeof LoadedImages[ImageName] === 'undefined') {
            LoadedImages[ImageName] = new Image();
            LoadedImages[ImageName].src = currentImage;
        } else if (LoadedImages[ImageName].complete) {
            var Size = (this.Data.Position.Width + this.Data.Position.Height) / 2;

            Scene.context.save();
            Scene.context.beginPath();
            Scene.context.arc(X + (Size / 2), Y + (Size / 2), Size / 2, 0, Math.PI * 2, true);
            Scene.context.fillStyle = "black";
            Scene.context.fill();
            Scene.context.closePath();
            Scene.context.clip();


            Scene.context.drawImage(LoadedImages[ImageName], X, Y, Size, Size);

            Scene.context.beginPath();
            Scene.context.arc(X, Y, Size / 2, 0, Math.PI * 2, true);
            Scene.context.clip();
            Scene.context.closePath();


            Scene.context.restore();
        }
    }
}
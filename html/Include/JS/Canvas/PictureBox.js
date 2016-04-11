/**
 * This array holds all the loaded Images in one place
 * An image is stored into this array according to the base64 version of its URL
 * If you do LoadedImages.length, it will return 0, even if its fulled of Images
 * 
 * @type Array
 */
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
                NextID: 0,
                FadeInAm: 0,
                Sources: []
            }
        }
    });

    this.import(settings);

    this.RenderQueue.add("drawPictures");
}

PictureBox.prototype = Object.create(Container.prototype);
PictureBox.prototype.constructor = Container;

PictureBox.prototype.drawPicture = function (X, Y, dt, ImageURL, Opacity) {
    var ImageName = window.btoa(ImageURL);
    if (typeof LoadedImages[ImageName] === 'undefined') {
        LoadedImages[ImageName] = new Image();
        LoadedImages[ImageName].src = ImageURL;
    } else if (LoadedImages[ImageName].complete) {
        var Size = (this.Data.Position.Width + this.Data.Position.Height) / 2;

        Scene.context.globalAlpha = Opacity;
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

PictureBox.prototype.drawPictures = function (X, Y, dt) {
    if (this.Data.Image.Sources.length) {
        var now = Date.now();
        
        var currentImage = this.Data.Image.Sources[this.Data.Image.CurrentID];
        this.drawPicture(X, Y, dt, currentImage, 1);

        if ((this.Data.Image.Sources.length > 1) && (this.Data.Image.Timer + this.Data.Image.Delay < now)) {
            
            this.Data.Image.NextID = this.Data.Image.CurrentID + 1;
            if (this.Data.Image.NextID >= this.Data.Image.Sources.length) {
                this.Data.Image.NextID = 0;
            }
            
            if (this.Data.Image.NextID !== this.Data.Image.CurrentID) {
                var nextImage = this.Data.Image.Sources[this.Data.Image.NextID];
                
                this.drawPicture(X, Y, dt, nextImage, this.Data.Image.FadeInAm);
                
                this.Data.Image.FadeInAm += (dt * 0.001);
                
                if (this.Data.Image.FadeInAm >= 1) {
                    this.Data.Image.Timer = now;
                    this.Data.Image.FadeInAm = 0;
                    this.Data.Image.CurrentID = this.Data.Image.NextID;
                }
            }
        }
    }
}

PictureBox.prototype.isHovered = function (_Mouse) {
    var Coords = this.getCoords();
    var Size = (this.Data.Position.Width + this.Data.Position.Height) / 2;

    return ((Coords) && (Math.sqrt(Math.pow(_Mouse.X - (Coords.X + (Size / 2)), 2) + Math.pow(_Mouse.Y - (Coords.Y + (Size / 2)), 2)) < Size / 2));
}
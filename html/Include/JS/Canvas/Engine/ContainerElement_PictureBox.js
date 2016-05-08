/**
 * This function is a child of ContainerElement, it handles the loading and rendering of
 * images.
 * It can also work as a slideshow for multiple images.
 * 
 * @param {String} name
 * @param {Object} settings
 * @returns {ContainerElement_PictureBox}
 */
var ContainerElement_PictureBox = function (name, settings) {
    this.constructor(name, settings);

    this.import({
        Data: {
            Image: {
                /**
                 * Whether or not we do anything with this class.
                 */
                On: false,
                /**
                 * What is the delay between swapping to the next image in the list
                 */
                Delay: 5000,
                /**
                 * When was the last image swapped out
                 */
                Timer: 0,
                /**
                 * What is the current image ID we are in?
                 * This ID is referencing the Sources array
                 */
                CurrentID: 0,
                /**
                 * What is the next ID that we need to load?
                 * This is a seperate variable because we use it when fading in
                 * the next image.
                 */
                NextID: 0,
                /**
                 * This is used to find out where currently the fade in animation is
                 */
                FadeInAm: 0,
                /**
                 * Should we force the image into a circle shape, cropping out the corners
                 */
                Circle: false,
                /**
                 * This array lists all the various image sources. If theres only one image
                 * then there will only be one array element here.
                 * If there are multiple elements, then we will loop through them incrementally.
                 */
                Sources: []
            }
        }
    });

    this.import(settings);

    this.RenderQueue.add("drawPictures");
}

ContainerElement_PictureBox.prototype = Object.create(ContainerElement.prototype);
ContainerElement_PictureBox.prototype.constructor = ContainerElement;

/**
 * This method draws the loaded picture onto the screen.
 * 
 * The X,Y coordinates are where absolutely this image will be drawn too
 * The Width/Height is defined in this.Data.Position
 * 
 * ImageURL is the URL of the image (base64 strings may work?)
 * 
 * Opacity is a number from 0-1 that defines the opacity of the image.
 *   
 * @param {Number} X
 * @param {Number} Y
 * @param {Number} dt
 * @param {String} ImageURL
 * @param {Number} Opacity
 * @returns {undefined}
 */
ContainerElement_PictureBox.prototype.drawPicture = function (X, Y, dt, ImageURL, Opacity) {
    /**
     * If the image has not been loaded yet, then nothing will appear.
     */
    if (this.Data.Image.Circle) {
        Scene.drawImageRound(X, Y, this.Data.Position.Width, this.Data.Position.Height, ImageURL, Opacity);
    } else {
        Scene.drawImage(X, Y, this.Data.Position.Width, this.Data.Position.Height, ImageURL, Opacity);
    }
}

/**
 * This function finds out which images should be drawn and what opacity they should be
 * It also decides if we should start loading in the next image, or so on.
 * 
 * The actual drawing of the images is done by drawPicture, but drawPictures defines which
 * image specifically drawPicture should draw.
 * 
 * @param {Number} X
 * @param {Number} Y
 * @param {Number} dt
 * @returns {undefined}
 */
ContainerElement_PictureBox.prototype.drawPictures = function (X, Y, dt) {
    /**
     * If there are no image sources... then theres nothing we can draw...
     */
    if ((this.Data.Image.On) && (this.Data.Image.Sources.length)) {
        var now = Date.now();

        /**
         * We want to draw the currently loaded image, that part is simple.
         */
        var currentImage = this.Data.Image.Sources[this.Data.Image.CurrentID];
        this.drawPicture(X, Y, dt, currentImage, 1);

        /**
         * Now we want to find out if we should start loading in the next image,
         * what image the next image should be, how far it is loaded in, and
         * actually draw it
         * 
         * So first we need to find out if there is actually more than 1 image source
         * and if enough time has elapsed for the next image loading to be warrented.
         */
        if ((this.Data.Image.Sources.length > 1) && (this.Data.Image.Timer + this.Data.Image.Delay < now)) {

            /**
             * What is the ID of the next image?
             */
            this.Data.Image.NextID = this.Data.Image.CurrentID + 1;
            if (this.Data.Image.NextID >= this.Data.Image.Sources.length) {
                this.Data.Image.NextID = 0;
            }

            /**
             * We want to make sure that the next image is actually a different image
             */
            if (this.Data.Image.NextID !== this.Data.Image.CurrentID) {

                /**
                 * Now we want to draw this new image in accordance to how much it has already
                 * faded in.
                 */
                var nextImage = this.Data.Image.Sources[this.Data.Image.NextID];
                this.drawPicture(X, Y, dt, nextImage, this.Data.Image.FadeInAm);

                /**
                 * Now we increase the current fade in amount
                 */
                this.Data.Image.FadeInAm += (dt * 0.001);

                /**
                 * If the fade in amount exceeds 1, then it is fully loaded in, and so we can
                 * reset the system.
                 */
                if (this.Data.Image.FadeInAm >= 1) {
                    this.Data.Image.Timer = now;
                    this.Data.Image.FadeInAm = 0;
                    this.Data.Image.CurrentID = this.Data.Image.NextID;
                }
            }
        }
    }
}

/**
 * Is this element currently being hovered over?
 * This has to be a special verison because images an be spherical.
 * 
 * @param {type} _Mouse
 * @returns {Boolean}
 */
ContainerElement_PictureBox.prototype.isHovered = function (_Mouse) {
    var Coords = this.getCoords();

    var returnVar = false;


    if (this.Data.Image.Circle) {
        var Size = (this.Data.Position.Width + this.Data.Position.Height) / 2;

        returnVar = ((Coords.Visible) && (Math.sqrt(Math.pow(_Mouse.X - (Coords.X + (Size / 2)), 2) + Math.pow(_Mouse.Y - (Coords.Y + (Size / 2)), 2)) < Size / 2));
    } else {
        returnVar = ((Coords.Visible) && ((_Mouse.X < Coords.X + Coords.Width) &&
                (_Mouse.X > Coords.X) &&
                (_Mouse.Y < Coords.Y + Coords.Height) &&
                (_Mouse.Y > Coords.Y)));
    }

    return returnVar;
}
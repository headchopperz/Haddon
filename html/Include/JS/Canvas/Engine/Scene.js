/**
 * This class is responsible for handling and controlling the pages canvas scene
 *
 */
var SceneController = function () {

    /**
     * The viewport is the current region of the canvas that the site occupies
     * because the viewport happens to be the whole canvas, it is streched
     * to fit it all.
     * However, in theory changing this will change all the elements inside the
     * canvas, if you want to create a border or such
     */
    this.Viewport = {
        X: 0,
        Y: 0,
        Width: 1200,
        Height: 500,
        Visible: true,
        MinWidth: 1200,
        MaxWidth: 1200
    };

    this.Data = {
        Timers: {
            delayedResize: 0,
            lastGameLoop: 0
        },
        CacheID: {
            Positional: 0,
            Resize: 0
        },
        Info: {
            selectedTextBox: null,
            WebGL: false
        },
        WebGL: {
            On: false,
            squareVerticesBuffer: null,
            mvMatrix: null,
            shaderProgram: null,
            vertexPositionAttribute: null,
            perspectiveMatrix: null
        },
        FPS: []
    }


    this.canvas = document.getElementById("scene");
    this.context = this.canvas.getContext("2d");

    /**
     * This array holds all the loaded Images in one place
     * An image is stored into this array according to the base64 version of its URL
     * If you do LoadedImages.length, it will return 0, even if its fulled of Images
     * 
     * @type Array
     */
    this.LoadedImages = new Array();

    return {
        Viewport: this.Viewport,
        Data: this.Data,
        canvas: this.canvas,
        context: this.context,
        getFPS: this.getFPS,
        recordFPS: this.recordFPS,
        drawRect: this.drawRect,
        drawLine: this.drawLine,
        drawText: this.drawText,
        drawImage: this.drawImage,
        drawImageRound: this.drawImageRound,
        isImageLoaded: this.isImageLoaded,
        LoadedImages: this.LoadedImages,
        getTextSize: this.getTextSize,
        currentFrustrum: this.currentFrustrum,
        delayedResize: this.delayedResize,
        getOffset: this.getOffset,
        onResize: this.onResize,
        sync: this.sync,
        updateViewport: this.updateViewport
    }
}

SceneController.prototype.drawImageRound = function (X, Y, Width, Height, ImageURL, Opacity) {
    /**
     * First we need to find out if we have already loaded this image on this page before
     * we Base64 the URL of the image to create a uniform naming system with basic characters
     */
    var loadedImage = this.isImageLoaded(ImageURL);

    if (loadedImage) {
        if (this.Data.WebGL.On) {

        } else {
            var Size = (Width + Height) / 2;

            this.context.globalAlpha = Opacity;
            this.context.save();
            this.context.beginPath();
            this.context.arc(X + (Size / 2), Y + (Size / 2), Size / 2, 0, Math.PI * 2, true);
            this.context.fillStyle = "black";
            this.context.fill();
            this.context.closePath();
            this.context.clip();
            
            this.context.globalCompositeOperation = 'lighten';
            this.context.drawImage(loadedImage, X, Y, Size, Size);

            this.context.beginPath();
            this.context.arc(X, Y, Size / 2, 0, Math.PI * 2, true);
            this.context.clip();
            this.context.closePath();


            this.context.restore();
            this.context.globalAlpha = 1;
        }
    }
}

SceneController.prototype.drawImage = function (X, Y, Width, Height, ImageURL, Opacity) {
    /**
     * First we need to find out if we have already loaded this image on this page before
     * we Base64 the URL of the image to create a uniform naming system with basic characters
     */

    var loadedImage = this.isImageLoaded(ImageURL);

    if (loadedImage) {
        if (this.Data.WebGL.On) {

        } else {
            this.context.globalAlpha = Opacity;
            this.context.drawImage(loadedImage, X, Y, Width, Height);
            this.context.globalAlpha = 1;
        }
    }


}

SceneController.prototype.isImageLoaded = function (ImageURL) {
    var ImageName = window.btoa(ImageURL);
    if (typeof this.LoadedImages[ImageName] === 'undefined') {
        /**
         * If the Image has not been loaded, then we need to spend our time loading it in the background
         */
        this.LoadedImages[ImageName] = new Image();
        this.LoadedImages[ImageName].src = ImageURL;
    } else if (this.LoadedImages[ImageName].complete) {
        return this.LoadedImages[ImageName];
    }
    return false;
}

SceneController.prototype.drawLine = function (X, Y, TargetX, TargetY, LineInfo) {
    var Line = {
        Colour: LineInfo,
        Opacity: 1,
        Width: 1
    }
    if ((typeof LineInfo === "object") && (LineInfo !== null)) {
        Line.Colour = LineInfo.Colour || "black";
        Line.Opacity = (!isNaN(LineInfo.Opacity)) ? LineInfo.Opacity : 1;
        Line.Width = LineInfo.Width || 1;
    }

    if (this.Data.WebGL.On) {

    } else {
        this.context.beginPath();

        this.context.globalAlpha = Line.Opacity;
        this.context.fillStyle = Line.Colour;
        this.context.moveTo(X, Y);
        this.context.lineTo(TargetX, TargetY);

        this.context.lineWidth = Line.Width;
        this.context.strokeStyle = Line.Colour;
        this.context.stroke();
        this.context.globalAlpha = 1;
    }
}

SceneController.prototype.drawRect = function (X, Y, Width, Height, FillInfo, OutlineInfo) {
    var Fill = {
        Colour: FillInfo,
        Opacity: 1
    }
    var Outline = {
        Colour: OutlineInfo,
        Opacity: 1
    }
    if ((typeof FillInfo === "object") && (FillInfo !== null)) {
        Fill.Colour = FillInfo.Colour || "black";
        Fill.Opacity = FillInfo.Opacity || 1;
    }
    if ((typeof OutlineInfo === "object") && (OutlineInfo !== null)) {
        Outline.Colour = OutlineInfo.Colour || "black";
        Outline.Opacity = OutlineInfo.Opacity || 1;
    }

    if (this.Data.WebGL.On) {

    } else {
        this.context.beginPath();
        this.context.rect(X, Y, Width, Height);

        if (Fill.Colour !== null) {
            this.context.globalAlpha = Fill.Opacity;
            this.context.fillStyle = Fill.Colour;
            this.context.fill();
            this.context.globalAlpha = 1;
        }

        if (Outline.Colour !== null) {
            this.context.globalAlpha = Outline.Opacity;
            this.context.strokeStyle = Outline.Colour;
            this.context.lineWidth = 1;
            this.context.stroke();
            this.context.globalAlpha = 1;
        }

        this.context.closePath();
    }
}

SceneController.prototype.getTextSize = function (Text, Font) {
    this.context.font = Font;

    return this.context.measureText(Text).width;
}

SceneController.prototype.drawText = function (X, Y, Text, FontInfo) {
    var Font = {
        Font: FontInfo,
        Colour: "white",
        Opacity: 1,
        Align: "left"
    }
    if ((typeof FontInfo === "object") && (FontInfo !== null)) {
        Font.Font = FontInfo.Font || 1;
        Font.Align = FontInfo.Align || "left";
        Font.Colour = FontInfo.Colour || "white";
        Font.Opacity = FontInfo.Opacity || 1;
    }

    if (this.Data.WebGL.On) {

    } else {
        this.context.globalAlpha = Font.Opacity;
        this.context.font = Font.Font;
        this.context.textAlign = Font.Align;
        this.context.fillStyle = Font.Colour;
        this.context.fillText(Text, X, Y);
        this.context.globalAlpha = 1;
    }
}

SceneController.prototype.getFPS = function() {
    var total = 0;

    this.Data.FPS.forEach(function (e) {
        total += e;
    });
    return Math.round(total / this.Data.FPS.length);
}

SceneController.prototype.recordFPS = function (dt) {
    /**
     * First we need to record the current FPS  in order to average out
     * all the recent records
     *
     * The reason why it needs to be averaged is that it fluctuates too much to
     * even be read.
     *
     * This code will attempt to average it to whatever the last second was.
     * So the more frames the user has, the more frames it will reference when
     * averaging.
     */
    this.Data.FPS.push(Math.round(1000 / dt));

    if (this.Data.FPS.length > Math.round(1000 / dt)) { //the seconds average... about
        this.Data.FPS.shift();
    }
}

/**
 * On each loop this clears the canvas so we can redraw everything.
 * This is why the draw function should do as little processing as possible
 * @returns {undefined}
 */
SceneController.prototype.sync = function (dt) {
    this.recordFPS(dt);

    if (this.Data.WebGL.On) {

    } else {
        this.context.clearRect(0, 0, this.Viewport.Width, this.Viewport.Height);
    }
}



/**
 * The purpose of this function is to retrieve the current page offset,
 * this is incase we embed the canvas inside a div or another html element.
 *
 * @returns {this.getOffset.SceneAnonym$0}
 */
SceneController.prototype.getOffset = function () {
    var rect = this.canvas.getBoundingClientRect();
    /**
     * Firefox uses document.documentElement.scrollLeft
     * When everyone else uses document.body.scrollLeft
     */
    return {
        left: rect.left + (document.body.scrollLeft || document.documentElement.scrollLeft),
        top: rect.top + (document.body.scrollTop || document.documentElement.scrollTop)
    };
}

/**
 * When browsers resize, they send A LOT of resize event updates, and if too
 * many events are fired, then it is easy to overload the system and completely
 * freeze the browser.
 *
 * So to fix this, we need to create a system that updates the Scene less frequently
 * This method will be called after 300ms have passed since the last screen resize
 *
 * If the screen is constantly resizing, then this function will not run, as it
 * will wait until the user stops being a ******
 *
 * @returns {undefined}
 */
SceneController.prototype.delayedResize = function () {
    this.Data.Timers.delayedResize = null;
    this.updateViewport();
}

/**
 * What region can the user currently see?
 * @returns {undefined}
 */
SceneController.prototype.currentFrustrum = function () {
    return {
        X: (document.body.scrollLeft || document.documentElement.scrollLeft),
        Y: (document.body.scrollTop || document.documentElement.scrollTop),
        Width: (window.innerWidth || document.documentElement.clientWidth),
        Height: (window.innerHeight || document.documentElement.clientHeight)
    }
}

/**
 * This method is called every time the browser resizes. Try to avoid putting
 * heavy computational code in here. As browsers will fire this method A LOT.
 *
 * @returns {undefined}
 */
SceneController.prototype.onResize = function () {

    /**
     * In order to make this.delayedResize work, we need to clear the currentTimeout
     * (its not necessary, but it can cause bugs otherwise), then otherride the
     * timeout with a new callback. This should ensure that this.delayedResize
     * is only called every ~300ms at max.
     */
    if (this.Data.Timers.delayedResize !== null) {
        window.clearTimeout(this.Data.Timers.delayedResize);
    }

    this.Data.Timers.delayedResize = window.setTimeout(this.delayedResize.bind(this), 300);
}

/**
 * This method updates the current viewport, this includes resizing the
 * viewport to encapsulate the entire screen.
 * This method also resizes the page, in order for scrollbars to work with
 * the canvas element.
 * It also (will) sorts out mobile resizing
 * @returns {undefined}
 */
SceneController.prototype.updateViewport = function () {
    this.Viewport.Width = window.innerWidth - 25;

    if (this.Viewport.Width > this.Viewport.MaxWidth) {
        this.Viewport.Width = this.Viewport.MaxWidth;
    } else if (this.Viewport.Width < this.Viewport.MinWidth) {
        this.Viewport.Width = this.Viewport.MinWidth;
    }


    this.Viewport.Height = this.Viewport.Width / 2.4;

    /**
     * Because we need to know the exact results now, and not next loop,
     * we want to invalidate all positioning cache.
     */
    this.Data.CacheID.Positional = 0;
    this.resizeCachedID = Date.now();

    if (this.Viewport.Height > window.innerHeight) {
        this.Viewport.Height = window.innerHeight;
        this.Viewport.Width = this.Viewport.Height * 2.4;
    }

    this.context.canvas.width = this.Viewport.Width;
    this.context.canvas.height = this.Viewport.Height;

}

var Scene = new SceneController;
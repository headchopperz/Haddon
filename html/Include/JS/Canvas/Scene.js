/**
 * This class is responsible for handling and controlling the pages canvas scene
 *
 */
var Scene = new (function (settings) {
    this.canvas = document.getElementById("scene");
    this.context = this.canvas.getContext("2d");

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
        Width: 1800,
        Height: 500,
        Visible: true,
        MobileWidth: 1030,
        MinWidth: 660
    };

    this.delayedResizeTimeout = null;
    this.isMobile = false;
    this.cachedID = 0;

    /**
     * On each loop this clears the canvas so we can redraw everything.
     * This is why the draw function should do as little processing as possible
     * @returns {undefined}
     */
    this.sync = function () {
        this.context.clearRect(0, 0, this.Viewport.Width, this.Viewport.Height)
    }

    /**
     * The purpose of this function is to retrieve the current page offset,
     * this is incase we embed the canvas inside a div or another html element.
     *
     * @returns {Scene.getOffset.SceneAnonym$0}
     */
    this.getOffset = function () {
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
    this.delayedResize = function () {
        this.delayedResizeTimeout = null;
        this.updateViewport();
    }

    /**
     * What region can the user currently see?
     * @returns {undefined}
     */
    this.currentFrustrum = function () {
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
    this.onResize = function () {

        /**
         * In order to make this.delayedResize work, we need to clear the currentTimeout
         * (its not necessary, but it can cause bugs otherwise), then otherride the
         * timeout with a new callback. This should ensure that this.delayedResize
         * is only called every ~300ms at max.
         */
        if (this.delayedResizeTimeout !== null) {
            window.clearTimeout(this.delayedResizeTimeout);
        }

        this.delayedResizeTimeout = window.setTimeout(this.delayedResize.bind(this), 300);
    }

    /**
     * This method updates the current viewport, this includes resizing the
     * viewport to encapsulate the entire screen.
     * This method also resizes the page, in order for scrollbars to work with
     * the canvas element.
     * It also (will) sorts out mobile resizing
     * @returns {undefined}
     */
    this.updateViewport = function () {
        this.Viewport.Width = document.documentElement.clientWidth;
        this.Viewport.Height = document.documentElement.clientHeight;

        var highestPoint = 0;
        
        /**
         * Because we need to know the exact results now, and not next loop,
         * we want to invalidate all positioning cache.
         */
        this.cachedID = 0;

        /**
         * Find the Y of the bottom-most element, so we know how large the 
         * page should be, in order to show everything.
         */
        for (var i = 0; i < Containers.length; i++) {
            var e = Containers[i];
            var Coords = e.getCoords();

            if (Coords.Y + Coords.Height > highestPoint) {
                highestPoint = Coords.Y + Coords.Height
            }
        }

        if (highestPoint > 0) { //If theres actually any elements on the page
            
            /**
             * Make sure the viewport doesnt need resizing
             */
            if (highestPoint > this.currentFrustrum().Height) {
                this.Viewport.Height = highestPoint;
            }

            /**
             * Make sure the X does not need resizing
             */
            if (this.Viewport.Width < this.Viewport.MinWidth) {
                document.body.style.overflowX = 'auto';
                this.Viewport.Width = this.Viewport.MinWidth;
            } else {
                document.body.style.overflowX = 'hidden';
            }
        }

        Scene.context.canvas.width = this.Viewport.Width;
        Scene.context.canvas.height = this.Viewport.Height;
    }

    return {
        canvas: this.canvas,
        context: this.context,
        Viewport: this.Viewport,
        onResize: this.onResize,
        delayedResize: this.delayedResize,
        cachedID: this.cachedID,
        currentFrustrum: this.currentFrustrum,
        sync: this.sync,
        updateViewport: this.updateViewport,
        getOffset: this.getOffset
    };
});
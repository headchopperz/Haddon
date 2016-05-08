Scene.updateViewport = function () {
    this.Viewport.Width = document.documentElement.clientWidth;
    this.Viewport.Height = document.documentElement.clientHeight;

    var highestPoint = 0;

    /**
     * Because we need to know the exact results now, and not next loop,
     * we want to invalidate all positioning cache.
     */
    this.cachedID = 0;

    this.resizeCachedID = Date.now();

    /**
     * Find the Y of the bottom-most element, so we know how large the 
     * page should be, in order to show everything.
     */
    for (var i = 0; i < Container.Elements.length; i++) {
        var e = Container.Elements[i];
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
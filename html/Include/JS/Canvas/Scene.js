var Scene = new (function (settings) {
    this.canvas = document.getElementById("scene");
    this.context = this.canvas.getContext("2d");

    this.Viewport = {
        X: 0,
        Y: 0,
        Width: 1200,
        Height: 500,
        Visible: true
    };

    this.Mouse = {
        X: 0,
        Y: 0,
        Down: false
    };

    this.TimelineElementHeight = 255;

    this.SelectedButton = null;

    this.sync = function () {
        this.context.clearRect(0, 0, this.Viewport.Width, this.Viewport.Height)
    }

    this.getOffset = function () {
        var rect = this.canvas.getBoundingClientRect();
        return {
            left: rect.left + (document.body.scrollLeft || document.documentElement.scrollLeft),
            top: rect.top + (document.body.scrollTop || document.documentElement.scrollTop)
        };
    }

    this.updateViewport = function () {
        this.Viewport.Width = document.documentElement.clientWidth;
        this.Viewport.Height = document.documentElement.clientHeight;
        
        var highestPoint = 0;
        
        for (var i = 0; i < Containers.length; i++) {
            var e = Containers[i];
            var Coords = e.getCoords();
            
            if (Coords.Y + Coords.Height > highestPoint) {
                highestPoint = Coords.Y + Coords.Height
            }
        }

        if (highestPoint > 0) {
            if (this.Viewport.Height < highestPoint) {
                this.Viewport.Height = highestPoint;
            }

            if (this.Viewport.Width < 1030) {
                document.body.style.overflowX = 'auto';
                this.Viewport.Width = 1030;
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
        SelectedButton: this.SelectedButton,
        TimelineElementHeight: this.TimelineElementHeight,
        sync: this.sync,
        updateViewport: this.updateViewport,
        getOffset: this.getOffset
    };
});
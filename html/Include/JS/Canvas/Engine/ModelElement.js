var ModelElement = function (name, settings) {
    this.Data = {
        Description: "None",
        AnimationSpeed: 25,
        Tile_Size: 5,
        Frames: []
    }


    this.loadObject(name, settings);

    return {
        Data: this.Data,
        draw: this.draw,
        getHeight: this.getHeight,
        getWidth: this.getWidth
    }
}

ModelElement.prototype.import = function (settings) {
    /**
     * I need to recode this function, i just cant think at the moment
     */
    for (var greaterPropertyName in settings) {
        /**
         * We dont want to overide variables that should be protected
         */
        if ((greaterPropertyName === 'Data')) {
            mergeDeep(this[greaterPropertyName], settings[greaterPropertyName]);
        }
    }
}

ModelElement.prototype.loadObject = function (name, settings) {
    this.import(settings);

    this.Data.Description = name;
}

ModelElement.prototype.draw = function (X, Y, FrameID) {
    for (var frameY = 0; frameY < this.Data.Frames[FrameID].length; frameY++) {
        for (var frameX = 0; frameX < this.Data.Frames[FrameID][frameY].length; frameX++) {
            var e = this.Data.Frames[FrameID][frameY][frameX];
            if (e !== null) {
                Scene.drawRect(X + (frameX * this.Data.Tile_Size), Y + (frameY * this.Data.Tile_Size), this.Data.Tile_Size, this.Data.Tile_Size,
                        ({
                            Opacity: 1,
                            Colour: e
                        }), null);
            }
        }
    }
}

ModelElement.prototype.getWidth = function () {
    return this.Data.Frames[0][0].length * this.Data.Tile_Size;
}

ModelElement.prototype.getHeight = function () {
    return this.Data.Frames[0].length * this.Data.Tile_Size;
}
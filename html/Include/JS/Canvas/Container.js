var Container = function (name, settings) {
    this.Data = {
        Description: "None",
        Position: {
            X: 0,
            Y: 0,
            Width: 0,
            Height: 0,
            Parent: null,
            Centered: false,
            CenterOffset: false
        },
        Status: {
            Visible: true,
            Pressed: false,
            Hovered: false
        },
        Hover: {
            On: false,
            ChangeCursor: true,
            Colour: "black",
            Opacity: 1
        },
        Fill: {
            On: false,
            Colour: "black",
            Pressed: "black",
            Opacity: 1
        },
        Outline: {
            On: false,
            Colour: "white",
            Pressed: "white",
            Opacity: 1
        }
    };

    this.Events = {
        onChanged: [],
        onClick: [],
        onRelease: [],
        onLeave: [],
        onHover: []
    };

    this.RenderQueue = {
        Items: [
            "drawBackground"
        ],
        add: function (Item) {
            if (this.Items.indexOf(Item) === -1) {
                this.Items.push(Item);
            }
        },
        remove: function (Item) {
            var ItemIndex = this.Items.indexOf(Item);
            if (ItemIndex !== -1) {
                this.Items.splice(ItemIndex, 1);
            }
        }
    };

    this.returnArray = {
        Items: {
            draw: this.draw,
            getCoords: this.getCoords,
            getData: this.getData,
            getEvents: this.getEvents,
            RenderQueue: this.RenderQueue,
            Data: this.Data,
            drawBackground: this.drawBackground,
            Events: this.Events,
            //_onChanged: this._onChanged,
            _onRelease: this._onRelease,
            _onClick: this._onClick,
            _onLeave: this._onLeave,
            _onHover: this._onHover,
            isHovered: this.isHovered

        },
        add: function (Name, Function) {
            if (typeof this.Items[Name] === 'undefined') {
                this.Items[Name] = Function;
            }
        },
        remove: function (Name) {
            if (typeof this.Items[Name] !== 'undefined') {
                delete this.Items[Name];
            }
        }
    };

    this.loadObject(name, settings);

    return this.returnArray.Items;
}

Container.prototype.import = function (settings) {
    /**
     * I need to recode this function, i just cant think at the moment
     */
    for (var greaterPropertyName in settings) {
        if ((greaterPropertyName === 'Data') || (greaterPropertyName === 'Events')) {

            mergeDeep(this[greaterPropertyName], settings[greaterPropertyName]);
        }
    }
}

Container.prototype.loadObject = function (name, settings) {
    this.import(settings);

    this.Data.Description = name;
}

/**
 * When the textbox info has changed
 * This function operates behind the scenes
 * @type function
 * @returns {null}
 */
Container.prototype._onChanged = function () {
    this.Data.TextBox._oldValue = this.Data.TextBox.Value;

    if (this.Events.onChanged.length > 0) {
        for (var i = 0; i < this.Events.onChanged.length; i++) {
            var e = this.Events.onChanged[i];

            var fn = window[e.Function];
            if (typeof fn === "function") {
                fn.apply(this, [e.Parameters]);
            }
        }
    }
}


/**
 * When the button has been hovered over by the mouse
 * This function operates behind the scenes
 * @type function
 * @returns {null}
 */
Container.prototype._onHover = function () {
    this.Data.Status.Hovered = true;

    if (this.Events.onHover.length > 0) {
        for (var i = 0; i < this.Events.onHover.length; i++) {
            var e = this.Events.onHover[i];

            var fn = window[e.Function];
            if (typeof fn === "function") {
                fn.apply(this, [e.Parameters]);
            }
        }
    }
}

/**
 * When the button has been clicked
 * This function operates behind the scenes, it modifies the pressed value
 * @type function
 * @returns {null}
 */
Container.prototype._onClick = function () {
    this.Data.Status.Pressed = true;

    if (this.Events.onClick.length > 0) {
        for (var i = 0; i < this.Events.onClick.length; i++) {
            var e = this.Events.onClick[i];

            var fn = window[e.Function];
            if (typeof fn === "function") {
                fn.apply(this, [e.Parameters]);
            }
        }
    }
}


/**
 * When the cursor of the mouse has been released, after clicking
 * This function operates behind the scenes, it modifies the pressed value
 * @type function
 * @returns {null}
 */
Container.prototype._onRelease = function () {
    this._onLeave();

    if (this.Events.onRelease.length > 0) {
        for (var i = 0; i < this.Events.onRelease.length; i++) {
            var e = this.Events.onRelease[i];

            var fn = window[e.Function];
            if (typeof fn === "function") {
                fn.apply(this, [e.Parameters]);
            }
        }
    }
}

/**
 * When the cursor leaves the button
 * This function operates behind the scenes, it modifies the pressed value
 * @type function
 * @returns {null}
 */
Container.prototype._onLeave = function () {
    this.Data.Status.Pressed = false;
    this.Data.Status.Hovered = false;
}

Container.prototype.getCoords = function () {
    var offset = Scene.Viewport;

    //offset.Height = $(window).height();

    if (typeof this.Data.Position.Parent === 'string') {
        var Parent = findContainer(this.Data.Position.Parent);

        offset = ((Parent !== null) && (Parent.getCoords())) ? Parent.getCoords() : offset;
    }

    if ((offset.Visible) && (this.Data.Status.Visible)) {
        var X = this.Data.Position.X + offset.X;
        var Y = this.Data.Position.Y + offset.Y;

        if ((this.Data.Position.CenterOffset === true) || (this.Data.Position.CenterOffset === "X")) {
            X += offset.Width / 2;
        }
        if ((this.Data.Position.CenterOffset === true) || (this.Data.Position.CenterOffset === "Y")) {
            Y += offset.Height / 2;
        }

        if ((this.Data.Position.Centered === true) || (this.Data.Position.Centered === "X")) {
            X -= (this.Data.Position.Width / 2);
        }
        if ((this.Data.Position.Centered === true) || (this.Data.Position.Centered === "Y")) {
            Y -= (this.Data.Position.Height / 2);
        }

        return {
            X: X,
            Y: Y,
            Width: this.Data.Position.Width,
            Height: this.Data.Position.Height,
            Visible: this.Data.Status.Visible
        }
    }
    return false;
}

Container.prototype.drawBackground = function (X, Y, dt) {
    Scene.context.beginPath();
    Scene.context.rect(X, Y, this.Data.Position.Width, this.Data.Position.Height);

    if (this.Data.Fill.On) {
        if (this.Data.Fill.Colour !== null) {
            Scene.context.globalAlpha = this.Data.Fill.Opacity;
            Scene.context.fillStyle = (this.Data.Status.Pressed) ? this.Data.Fill.Pressed : (this.Data.Status.Hovered && this.Data.Hover.On) ? this.Data.Hover.Colour : this.Data.Fill.Colour;
            Scene.context.fill();
            Scene.context.globalAlpha = 1;
        }
        //there will be an else here for sprites
    }

    if (this.Data.Outline.On) {
        Scene.context.globalAlpha = this.Data.Outline.Opacity;
        Scene.context.strokeStyle = (this.Data.Status.Pressed) ? this.Data.Outline.Pressed : this.Data.Outline.Colour;
        Scene.context.stroke();
        Scene.context.globalAlpha = 1;
    }

    Scene.context.closePath();
}

Container.prototype.draw = function (dt) {
    var Coords = this.getCoords();
    if (Coords) {
        for (var i = 0; i < this.RenderQueue.Items.length; i++) {
            var e = this.RenderQueue.Items[i];
            if (typeof this[e] === 'function') {
                this[e].apply(this, [Coords.X, Coords.Y, dt]);
            }
        }
        //this.drawBackground(Coords.X, Coords.Y, dt);
        //this.drawText(Coords.X, Coords.Y, dt);
    }
}

Container.prototype.getEvents = function () {
    return this.Events;
}

Container.prototype.getData = function () {
    return this.Data;
}

Container.prototype.isHovered = function (_Mouse) {
    var Coords = this.getCoords();
    return ((Coords) && ((_Mouse.X < Coords.X + Coords.Width) &&
                            (_Mouse.X > Coords.X) &&
                            (_Mouse.Y < Coords.Y + Coords.Height) &&
                            (_Mouse.Y > Coords.Y)));
}

if (typeof Containers === "undefined") {
    var Containers = new Array();
} else {

}

/**
 * This function draws the buttons to the screen
 * @param {int} dt - ms since last load
 * @returns {null}
 */
function drawContainers(dt) {
    Containers.forEach(function (e) {
        e.draw();
    });
}

function findContainer(name) {
    for (var i = 0; i < Containers.length; i++) {
        var e = Containers[i];
        if (name === e.Data.Description) {
            return e;
        }
    }
    return false;
}
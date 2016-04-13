/**
 * Container is the parent class for all the other page elements
 * 
 * Container controls the majority of events, sets up the renderqueue and defines
 * the base data variables
 * 
 * 
 * 
 * @param {String} name
 * @param {Object} settings
 * @returns {Container.returnArray.Items}
 */

var Container = function (name, settings) {
    /**
     * This variable is responsible for holding all the data relevent to this object
     * The classes that extend this class will add/modify these values and not
     * all of them will be used at a time
     */
    this.Data = {
        /**
         * How shall we identify this container, keep this unique if you want to 
         * find it in future, the findContainer function references this
         */
        Description: "None",
        /**
         * Where is this button on the page? 
         * These values may not actually be the absolute coordinates of this item
         * but it could be the relative coordinates to another container, or
         * even to the center of the page.
         * If you want the absolute values, you need to call this.getCoords()
         */
        Position: {
            X: 0,
            Y: 0,
            Width: 0,
            Height: 0,
            /**
             * Should the absolute positioning of this element be cached?
             * The cache lasts from the start of a loop for the entirety of that one loop
             * So if this element is changed in that loop, you will have to wait a whole
             * loop for it to be redrawn differently.
             * The benefit is that it does a lot less processing.
             */
            CacheAbsolute: true,
            /**
             * At the start of each loop a random number is generated, this number is
             * used to find out which cached variables should be invalidated.
             */
            currentCacheID: 0,
            /**
             * To define the parent, you need to pass the description of the parent here
             * (so a string)
             * This container will be positioned relatively to the parent, and
             * if the parent is hidden, then this container will be hidden
             */
            Parent: null,
            /**
             * By default the positioning of the element is done from the top left corner,
             * if this is set to true, then the element will be positioned relatively to
             * the center of the element
             * 
             * If you only want to center it according to one axis you can define that by
             * settings this value to "x" or "y", true centers it by both
             */
            Centered: false,
            /**
             * Do you want to center this element to the center of its parent?
             * If so, put a true here.
             * If you have no parent then the center of the page will be used.
             * 
             * If you only want to center it according to one axis you can define that by
             * settings this value to "x" or "y", true centers it by both
             */
            CenterOffset: false,
            /**
             * On mobiles should be position this element in a different place?
             */
            Mobile: {
                On: false,
                Y: 0,
                X: 0
            }
        },
        /**
         * The status of the element, is it currently visible, is it currently pressed,
         * is it currently hovered over? 
         * That sort of stuff
         */
        Status: {
            Visible: true,
            Pressed: false,
            Hovered: false
        },
        /**
         * If the element is hovered over, should we do anything about it?
         * This class defines how we should react if its hovered over
         */
        Hover: {
            On: false,
            ChangeCursor: true,
            Colour: "black",
            Opacity: 1
        },
        /**
         * Do we want to give the element a background colour?
         */
        Fill: {
            On: false,
            Colour: "black",
            Pressed: "black",
            Opacity: 1
        },
        /**
         * Do we want to give the element an outline?
         */
        Outline: {
            On: false,
            Colour: "white",
            Pressed: "white",
            Opacity: 1
        }
    };

    this.AbsolutePosition = null;

    /**
     * This class holds all the events that we can assign to an element.
     * The events are stored in arrays as you can assign multiple functions to
     * happen per event.
     * 
     * The syntax for an event is such:
     *     {
     *         Function: "FunctionNameAsString",
     *         Parameters: [
     *             "eachParameterInOrder",
     *             "TheyCanBeAnything"
     *         ]
     *     }
     *     
     * The function needs to be a child of window[]
     */
    this.Events = {
        onChanged: [],
        onClick: [],
        onRelease: [],
        onLeave: [],
        onHover: []
    };

    /**
     * The RenderQueue lists the various functions that are used to render this element
     * Each of these render functions are ran every loop, so they should try
     * to avoid large processing
     * 
     * The names of the functions are stored in the Items array, and the order is
     * the order in which they will operate, so the later ones will display ontop
     * the previous ones
     * 
     * The functions in the render queue need to be a child of this[]
     */
    this.RenderQueue = {
        /**
         * The functions in the current render queue
         */
        Items: [
            "drawBackground"
        ],
        /**
         * This method adds a function to the renderQueue, the reason to use
         * this function is that it will avoid duplication.
         * 
         * @param {string} Item
         * @returns {undefined}
         */
        add: function (Item) {
            if (this.Items.indexOf(Item) === -1) {
                this.Items.push(Item);
            }
        },
        /**
         * This method will remove a function from the renderQueue
         * @param {string} Item
         * @returns {undefined}
         */
        remove: function (Item) {
            var ItemIndex = this.Items.indexOf(Item);
            if (ItemIndex !== -1) {
                this.Items.splice(ItemIndex, 1);
            }
        }
    };

    /**
     * This class holds the various return information from the container
     * The reason this is seperated is that we can append new return information to this
     * This is so the children can append whichever return data they need
     */
    this.returnArray = {
        Items: {
            draw: this.draw,
            getCoords: this.getCoords,
            getData: this.getData,
            getEvents: this.getEvents,
            RenderQueue: this.RenderQueue,
            resetCache: this.resetCache,
            withinFrustrum: this.withinFrustrum,
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

    /**
     * We load the inserted settings into the current class
     */
    this.loadObject(name, settings);

    return this.returnArray.Items;
}

/**
 * This function is responsible for importing an object of data into this class
 * It uses a deepmerge in order to achieve this.
 * 
 * 
 * @param {Object} settings
 * @returns {undefined}
 */
Container.prototype.import = function (settings) {
    /**
     * I need to recode this function, i just cant think at the moment
     */
    for (var greaterPropertyName in settings) {
        /**
         * We dont want to overide variables that should be protected
         */
        if ((greaterPropertyName === 'Data') || (greaterPropertyName === 'Events')) {
            mergeDeep(this[greaterPropertyName], settings[greaterPropertyName]);
        }
    }
}

/**
 * This class will load a current object into the system, it will also ensure that
 * the Description contains the correct name. This is so we can find this object
 * in future.
 * 
 * @param {String} name
 * @param {Object} settings
 * @returns {undefined}
 */
Container.prototype.loadObject = function (name, settings) {
    this.import(settings);

    this.Data.Description = name;
}

/**
 * Is this element actually within the users frustrum? 
 * If it is not, then dont display it, huge waste of processing.
 * 
 * @returns {Boolean}
 */
Container.prototype.withinFrustrum = function (Coords) {
    if ((typeof Coords === "undefined") || (Coords === null)) {
        Coords = this.getCoords();
    }

    var currentFrustrum = Scene.currentFrustrum();

    /**
     * Are the X axis corners within the users frusturm?
     * @type Boolean
     */
    var xWithinFrustrum = ((Coords.X < currentFrustrum.X + currentFrustrum.Width) &&
            (Coords.X + Coords.Width > currentFrustrum.X));

    /**
     * Are the Y axis corners within the users frusturm?
     * @type Boolean
     */
    var yWithinFrustrum = ((Coords.Y < currentFrustrum.Y + currentFrustrum.Height) &&
            (Coords.Y + Coords.Height > currentFrustrum.Y));

    /**
     * If the object exceeds the size of the frustrum, then it will say its not inside the frustrum
     * so we need to check to see if it exceeds the frustrums size
     * @type Boolean
     */
    var xLargerThanFrustrum = ((Coords.X < currentFrustrum.X) && (Coords.X + Coords.Width > currentFrustrum.X + currentFrustrum.Width));
    var yLargerThanFrustrum = ((Coords.Y < currentFrustrum.Y) && (Coords.Y + Coords.Height > currentFrustrum.Y + currentFrustrum.Height));

    /**
     * This should find out for us whether or not the object is within the users frustrum.
     * 
     * @type Boolean
     */
    var isWithinFrustrum = (((xWithinFrustrum || (xLargerThanFrustrum && yWithinFrustrum)) && (yWithinFrustrum || (yLargerThanFrustrum && xWithinFrustrum))) || (xLargerThanFrustrum && yLargerThanFrustrum));


    return isWithinFrustrum;
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

/**
 * Get the current containers absolute coordinates from the top left of the canvas.
 * 
 * @returns {Container.prototype.getCoords.ContainerAnonym$3|Boolean}
 */
Container.prototype.getCoords = function () {
    /**
     * This function can actually take a while to process, because it can start scanning parents
     * then parents of parents etc
     * 
     * So we cache the result for the current loop. This cache can be disabled by setting
     * this.Data.Position.CacheAbsolute to false
     * 
     * If it has not been currently cached this loop, then we must regenerate its positional
     * information
     */
    if ((this.Data.Position.CacheAbsolute) &&
            ((typeof this.AbsolutePosition === "undefined") || (this.AbsolutePosition === null) || (this.Data.Position.currentCacheID !== Scene.cachedID))) {
        
        /**
         * First we need to figure out where on this page this element is relative to (What parent it has)
         * If it has no parent, then its relative directly to the canvas.
         */
        var offset = Scene.Viewport;

        if (typeof this.Data.Position.Parent === 'string') {
            var Parent = findContainer(this.Data.Position.Parent);

            offset = ((Parent !== null) && (Parent.getCoords())) ? Parent.getCoords() : offset;
        }

        /**
         * If the parent is visible and the current element is visible...
         */
        if ((offset.Visible) && (this.Data.Status.Visible)) {
            /**
             * We position the element relative to the parents position,
             * we also take into account any mobile positional information here too
             */
            var X = (((this.Data.Position.Mobile.On) && (Scene.Viewport.Width < Scene.Viewport.MobileWidth)) ? this.Data.Position.Mobile.X : this.Data.Position.X) + offset.X;
            var Y = (((this.Data.Position.Mobile.On) && (Scene.Viewport.Width < Scene.Viewport.MobileWidth)) ? this.Data.Position.Mobile.Y : this.Data.Position.Y) + offset.Y;

            /**
             * If the element has the CenterOffset attribute, then it is positioned in the center of its
             * parent.
             * You can position it according to X/Y and X and Y independantly.
             */
            if ((this.Data.Position.CenterOffset === true) || (this.Data.Position.CenterOffset === "X")) {
                X += offset.Width / 2;
            }
            if ((this.Data.Position.CenterOffset === true) || (this.Data.Position.CenterOffset === "Y")) {
                Y += offset.Height / 2;
            }

            /**
             * If the element has the Centered attribute, then it is automatically realigned so the given coordinates
             * are the center, rather than the top left.
             */
            if ((this.Data.Position.Centered === true) || (this.Data.Position.Centered === "X")) {
                X -= (this.Data.Position.Width / 2);
            }
            if ((this.Data.Position.Centered === true) || (this.Data.Position.Centered === "Y")) {
                Y -= (this.Data.Position.Height / 2);
            }

            /*
             * We cache the result
             */
            this.AbsolutePosition = {
                X: X,
                Y: Y,
                Width: this.Data.Position.Width,
                Height: this.Data.Position.Height,
                Visible: this.Data.Status.Visible
            }
        } else {
            /**
             * If it is not visible then we bluntly return false, because we dont care about hidden stuff
             */
            this.AbsolutePosition = false;
        }
        /**
         * Update the current cache ID, for cache invalidation
         */
        this.Data.Position.currentCacheID = Scene.cachedID;
    }
    return this.AbsolutePosition;
}

/**
 * Draw the containers background and outline, this is the most basic renderqueue item
 * 
 * 
 * @param {Integer} X
 * @param {Integer} Y
 * @param {Integer} dt
 * @returns {undefined}
 */
Container.prototype.drawBackground = function (X, Y, dt) {
    if ((this.Data.Fill.On) || (this.Data.Outline.On)) {
        Scene.context.beginPath();
        Scene.context.rect(X, Y, this.Data.Position.Width, this.Data.Position.Height);

        /**
         * If the container has a background colour
         */
        if ((this.Data.Fill.On) && (this.Data.Fill.Colour !== null)) {
            Scene.context.globalAlpha = this.Data.Fill.Opacity;
            Scene.context.fillStyle = (this.Data.Status.Pressed) ? this.Data.Fill.Pressed : (this.Data.Status.Hovered && this.Data.Hover.On) ? this.Data.Hover.Colour : this.Data.Fill.Colour;
            Scene.context.fill();
            Scene.context.globalAlpha = 1;
        }

        /**
         * If the container has an outline
         */
        if (this.Data.Outline.On) {
            Scene.context.globalAlpha = this.Data.Outline.Opacity;
            Scene.context.strokeStyle = (this.Data.Status.Pressed) ? this.Data.Outline.Pressed : this.Data.Outline.Colour;
            Scene.context.stroke();
            Scene.context.globalAlpha = 1;
        }

        Scene.context.closePath();
    }
}

/**
 * This function is responsible for all the containers drawing.
 * Child classes should not modify this class, but instead modify the renderqueue
 * 
 * 
 * @param {Integer} dt
 * @returns {undefined}
 */
Container.prototype.draw = function (dt) {
    var Coords = this.getCoords();
    if ((Coords) && (this.withinFrustrum(Coords))) {
        for (var i = 0; i < this.RenderQueue.Items.length; i++) {
            var e = this.RenderQueue.Items[i];
            if (typeof this[e] === 'function') {
                this[e].apply(this, [Coords.X, Coords.Y, dt]);
            }
        }
    }
}

Container.prototype.getEvents = function () {
    return this.Events;
}

Container.prototype.getData = function () {
    return this.Data;
}

/**
 * This removes any cached data
 * @returns {undefined}
 */
Container.prototype.resetCache = function () {
    this.AbsolutePosition = null;
}

/**
 * Is this element currently being hovered over?
 * 
 * @param {Object} _Mouse
 * @returns {Container.prototype.isHovered.Coords|Container.getCoords|Boolean}
 */
Container.prototype.isHovered = function (_Mouse) {
    var Coords = this.getCoords();
    return ((Coords) && ((_Mouse.X < Coords.X + Coords.Width) &&
            (_Mouse.X > Coords.X) &&
            (_Mouse.Y < Coords.Y + Coords.Height) &&
            (_Mouse.Y > Coords.Y)));
}

/**
 * Containers is responsible for storing all the information regarding the
 * containers in one easy to reference place.
 * This is so we can loop over the items when we need to reference all of them.
 * @type Array
 */
var Containers = new Array();

/**
 * This function draws the buttons to the screen
 * @param {int} dt - ms since last load
 * @returns {null}
 */
function drawContainers(dt) {
    Containers.forEach(function (e) {
        e.draw(dt);
    });
}

/**
 * This function will find a container with a particular description.
 * This is referenced and used when finding parent classes.
 * 
 * @param {String} name
 * @returns {findContainer.e|Boolean}
 */
function findContainer(name) {
    for (var i = 0; i < Containers.length; i++) {
        var e = Containers[i];
        if (name === e.Data.Description) {
            return e;
        }
    }
    return false;
}
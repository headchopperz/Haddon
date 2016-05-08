/**
 * ContainerElement is the parent class for all the other page elements
 *
 * ContainerElement controls the majority of events, sets up the renderqueue and defines
 * the base data variables
 *
 *
 *
 * @param {String} name
 * @param {Object} settings
 * @returns {ContainerElement.returnArray.Items}
 */

var ContainerElement = function (name, settings) {
    /**
     * This variable is responsible for holding all the data relevent to this object
     * The classes that extend this class will add/modify these values and not
     * all of them will be used at a time
     */
    this.Data = {
        /**
         * How shall we identify this ContainerElement, keep this unique if you want to
         * find it in future, the Container.find function references this
         */
        Description: "None",
        /**
         * Where is this button on the page?
         * These values may not actually be the absolute coordinates of this item
         * but it could be the relative coordinates to another ContainerElement, or
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
            CachePositioning: true,
            /**
             * At the start of each loop a random number is generated, this number is
             * used to find out which cached variables should be invalidated.
             */
            currentCacheID: 0,
            /**
             * To define the parent, you need to pass the description of the parent here
             * (so a string)
             * This ContainerElement will be positioned relatively to the parent, and
             * if the parent is hidden, then this ContainerElement will be hidden
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
             * This elements responsiveness to the page being resized.
             */
            Responsive: {
                /**
                 * Does this element actually do anything at all? This will
                 * override all of the queries individually
                 */
                On: false,
                /**
                 * The Queries are a list of all the responsive positional information 
                 * of this ContainerElement.
                 * 
                 * The order of the queries is important, later queries will override
                 * previous ones.
                 * 
                 * The syntax is as follows:
                 * (If an element is not entered, than it resorts to the ContainerElements default
                 * value)
                 * {
                 *    X: 0, //The new X coordinate
                 *    Y: 0, //The new Y coordinate
                 *    Width: 0, //The new Width
                 *    Height: 0, //The new Height
                 *    maxWidth: 0, //The maximum page width for this query to be considered valid
                 *    maxHeight: 0, //The maximum page height for this query to be considered valid
                 *    minWidth:0, //The minimum page width for this query to be considered valid
                 *    minHeight:0, //The minimum page height for this query to be considered valid
                 *    CenterOffset:false, //new CenterOffset
                 *    Centered: false //new Centered
                 * }
                 * 
                 */
                Queries: []
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

    this.AbsolutePosition = {
        X: 0,
        Y: 0,
        Width: 0,
        Height: 0,
        Visible: false,
        Parent: {}
    };

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
        onHover: [],
        onKeyRelease: [],
        onKeyPress: []
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
     * This class holds the various return information from the ContainerElement
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
            getWidth: this.getWidth,
            getHeight: this.getHeight,
            getParent: this.getParent,
            parseResponsiveQueries: this.parseResponsiveQueries,
            convertPositionalString: this.convertPositionalString,
            getX: this.getX,
            getY: this.getY,
            getCache: this.getCache,
            calculatePosition: this.calculatePosition,
            getVisible: this.getVisible,
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
ContainerElement.prototype.import = function (settings) {
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
ContainerElement.prototype.loadObject = function (name, settings) {
    this.import(settings);

    this.Data.Description = name;
}

/**
 * Is this element actually within the users frustrum?
 * If it is not, then dont display it, huge waste of processing.
 *
 * @returns {Boolean}
 */
ContainerElement.prototype.withinFrustrum = function (Coords) {
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
ContainerElement.prototype._onHover = function () {
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
ContainerElement.prototype._onClick = function () {
    this.Data.Status.Pressed = true;

    if (this.Events.onClick.length > 0) {
        for (var i = 0; i < this.Events.onClick.length; i++) {
            var e = this.Events.onClick[i];

            var fn = window[e.Function];
            if (typeof fn === "function") {
                fn.apply(this, e.Parameters);
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
ContainerElement.prototype._onRelease = function () {
    this._onLeave();

    if (this.Events.onRelease.length > 0) {
        for (var i = 0; i < this.Events.onRelease.length; i++) {
            var e = this.Events.onRelease[i];

            var fn = window[e.Function];
            if (typeof fn === "function") {
                fn.apply(this, e.Parameters);
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
ContainerElement.prototype._onLeave = function () {
    this.Data.Status.Pressed = false;
    this.Data.Status.Hovered = false;
}

/**
 * Retrieves the absolute positional information of the parents element.
 * If the element has no parent, then the parent is the Scene.
 *
 * @returns {Scene.Viewport|ContainerElement.getCoords()}
 */
ContainerElement.prototype.getParent = function () {
    var returnVar = Scene.Viewport;

    if (typeof this.Data.Position.Parent === 'string') {
        var Parent = Container.find(this.Data.Position.Parent);

        returnVar = ((Parent !== null) && (Parent !== false) && (Parent.getCoords())) ? Parent.getCoords() : returnVar;
    }

    return returnVar;
}

/**
 * This method parses all of the Responsive Queries that this ContainerElement has
 * It returns a class with all the updated relative positional information.
 * 
 * @param {Scene.Viewport|ContainerElement.getCoords()} Parent
 * @returns {ContainerElement.prototype.parseResponsiveQueries.returnVar}
 */
ContainerElement.prototype.parseResponsiveQueries = function (Parent) {
    /**
     * Retrieve the current relative positional information
     * @type {object}
     */
    var returnVar = {
        X: this.Data.Position.X,
        Y: this.Data.Position.Y,
        Width: this.Data.Position.Width,
        Height: this.Data.Position.Height,
        CenterOffset: this.Data.Position.CenterOffset,
        Centered: this.Data.Position.Centered
    }

    /**
     * If this element supports responsiveness, and it has responsive queries...
     */
    if ((this.Data.Position.Responsive.On) && (this.Data.Position.Responsive.Queries.length)) {

        /**
         * Make sure we know the parents positional information
         */
        if ((typeof Parent === "undefined") || (Parent === null)) {
            Parent = this.getParent();
        }

        for (var i = 0; i < this.Data.Position.Responsive.Queries.length; i++) {
            var e = this.Data.Position.Responsive.Queries[i];

            /**
             * If this responsive query is active
             */
            if (e.On) {

                /**
                 * If the pages width DOES NOT exceed the responsive queries max width
                 * 
                 * Percentages need to be converted to pixels so we can do the calculations
                 */
                var validMaxWidth = true;
                if (typeof e.maxWidth !== 'undefined') {
                    var maxWidth = this.convertPositionalString(e.maxWidth, Parent.Width);
                    validMaxWidth = (Scene.Viewport.Width < maxWidth);
                }

                /**
                 * If the pages height DOES NOT exceed the responsive queries max height
                 * 
                 * Percentages need to be converted to pixels so we can do the calculations
                 */
                var validMaxHeight = true;
                if (typeof e.maxHeight !== 'undefined') {
                    var maxHeight = this.convertPositionalString(e.maxHeight, Parent.Height);
                    validMaxHeight = (Scene.Viewport.Height < maxHeight);
                }

                /**
                 * If the pages height DOES exceed the responsive queries min height
                 * 
                 * Percentages need to be converted to pixels so we can do the calculations
                 */
                var validMinHeight = true;
                if (typeof e.minHeight !== 'undefined') {
                    var minHeight = this.convertPositionalString(e.minHeight, Parent.Height);
                    validMinHeight = (Scene.Viewport.Height > minHeight);
                }

                /**
                 * If the pages width DOES exceed the responsive queries min width
                 * 
                 * Percentages need to be converted to pixels so we can do the calculations
                 */
                var validMinWidth = true;
                if (typeof e.minWidth !== 'undefined') {
                    var minWidth = this.convertPositionalString(e.minWidth, Parent.Width);
                    validMinWidth = (Scene.Viewport.Height > minWidth);
                }

                /**
                 * If all of these queries are valid, then we make any changes that this
                 * query has listed
                 */
                if (validMaxWidth && validMaxHeight && validMinHeight && validMinWidth) {
                    mergeDeep(returnVar, e);
                }
            }
        }
    }


    return returnVar;
}

/**
 * Calculates and returns the absolute width of this ContainerElement in pixels.
 *
 * @param {Scene.Viewport|ContainerElement.getCoords()} Parent
 * @returns {Number}
 */
ContainerElement.prototype.getWidth = function (Parent, ResponsiveSize) {
    var returnVar = this.Data.Position.Width;

    /**
     * Make sure we know the parents positional information
     */
    if ((typeof Parent === "undefined") || (Parent === null)) {
        Parent = this.getParent();
    }

    /**
     * Make sure we know this updated responsive info
     */
    if ((typeof ResponsiveSize === "undefined") || (ResponsiveSize === null)) {
        ResponsiveSize = this.parseResponsiveQueries(Parent);
    }

    /**
     * Update the width to the new responsive width
     */
    returnVar = ResponsiveSize.Width;


    /**
     * If the element is a string than we need to parse it to a Number
     */
    if (typeof returnVar === "string") {
        returnVar = this.convertPositionalString(returnVar, Parent.Width);
    }

    /**
     * If we got here, and we dont have a number, then something has gone wrong.
     * Probably someone wrote the wrong positional information in this.Data.Position.Width
     */
    if (typeof returnVar !== "number") {
        throw new Error("Failure to read element width for ContainerElement: \"" + this.Data.Description + "\"");
    }

    return returnVar;
}


/**
 * Calculates and returns the absolute height of this ContainerElement in pixels.
 *
 * @param {Scene.Viewport|ContainerElement.getCoords()} Parent
 * @returns {Number}
 */
ContainerElement.prototype.getHeight = function (Parent, ResponsiveSize) {
    var returnVar = this.Data.Position.Height;

    /**
     * Make sure we know the parents positional information
     */
    if ((typeof Parent === "undefined") || (Parent === null)) {
        Parent = this.getParent();
    }

    /**
     * Make sure we know this updated responsive info
     */
    if ((typeof ResponsiveSize === "undefined") || (ResponsiveSize === null)) {
        ResponsiveSize = this.parseResponsiveQueries(Parent);
    }

    /**
     * Update the width to the new responsive height
     */
    returnVar = ResponsiveSize.Height;

    /**
     * If the element is a string than we need to parse it to a Number
     */
    if (typeof returnVar === "string") {
        returnVar = this.convertPositionalString(returnVar, Parent.Height);
    }

    /**
     * If we got here, and we dont have a number, then something has gone wrong.
     * Probably someone wrote the wrong positional information in this.Data.Position.Height
     */
    if (typeof returnVar !== "number") {
        throw new Error("Failure to read element height for ContainerElement: \"" + this.Data.Description + "\"");
    }

    return returnVar;
}

/**
 * Calculates and returns the absolute X of this ContainerElement in pixels.
 *
 * @param {Scene.Viewport|ContainerElement.getCoords()} Parent
 * @param {Number} Width
 * @returns {Number}
 */
ContainerElement.prototype.getX = function (Parent, ResponsiveSize, Width) {
    /**
     * When we calculate the current X, we want to take into account the different
     * size information for small monitors
     * @type Number
     */
    var returnVar = this.Data.Position.X;

    /**
     * Make sure we know the parents positional information
     */
    if ((typeof Parent === "undefined") || (Parent === null)) {
        Parent = this.getParent();
    }

    /**
     * Make sure we know this updated responsive info
     */
    if ((typeof ResponsiveSize === "undefined") || (ResponsiveSize === null)) {
        ResponsiveSize = this.parseResponsiveQueries(Parent);
    }

    /**
     * Update the width to the new responsive X
     */
    returnVar = ResponsiveSize.X;

    /**
     * If the element is a string than we need to parse it to a Number
     */
    if (typeof returnVar === "string") {
        returnVar = this.convertPositionalString(returnVar, Parent.Width);
    }

    /**
     * If we got here, and we dont have a number, then something has gone wrong.
     * Probably someone wrote the wrong positional information in this.Data.Position.Height
     */
    if (typeof returnVar !== "number") {
        throw new Error("Failure to read element X for ContainerElement: \"" + this.Data.Description + "\"");
    }

    /**
     * We want to simply add this position to the parents absolute X.
     * This is because this element is relative to its parent.
     */
    returnVar += Parent.X;


    /**
     * If the element has the CenterOffset attribute, then it is positioned in the center of its
     * parent.
     * You can position it according to X/Y and X and Y independantly.
     */
    if ((ResponsiveSize.CenterOffset === true) || (ResponsiveSize.CenterOffset === "X")) {
        returnVar += Parent.Width / 2;
    }

    /**
     * If the element has the Centered attribute, then it is automatically realigned so the given coordinates
     * are the center, rather than the top left.
     * You can position it according to X/Y and X and Y independantly.
     */
    if ((ResponsiveSize.Centered === true) || (ResponsiveSize.Centered === "X")) {
        if ((typeof Width === "undefined") || (Width === null)) {
            Width = this.getWidth(Parent);
        }

        returnVar -= (Width / 2);
    }

    return returnVar;
}


/**
 * Calculates and returns the absolute Y of this ContainerElement in pixels.
 *
 * @param {Scene.Viewport|ContainerElement.getCoords()} Parent
 * @param {Number} Height
 * @returns {Number}
 */
ContainerElement.prototype.getY = function (Parent, ResponsiveSize, Height) {
    /**
     * When we calculate the current Y, we want to take into account the different
     * size information for small monitors
     * @type Number
     */
    var returnVar = this.Data.Position.Y;

    /**
     * Make sure we know the parents positional information
     */
    if ((typeof Parent === "undefined") || (Parent === null)) {
        Parent = this.getParent();
    }

    /**
     * Make sure we know this updated responsive info
     */
    if ((typeof ResponsiveSize === "undefined") || (ResponsiveSize === null)) {
        ResponsiveSize = this.parseResponsiveQueries(Parent);
    }

    /**
     * Update the width to the new responsive Y
     */
    returnVar = ResponsiveSize.Y;

    /**
     * If the element is a string than we need to parse it to a Number
     */
    if (typeof returnVar === "string") {
        returnVar = this.convertPositionalString(returnVar, Parent.Height);
    }

    /**
     * If we got here, and we dont have a number, then something has gone wrong.
     * Probably someone wrote the wrong positional information in this.Data.Position.Height
     */
    if (typeof returnVar !== "number") {
        throw new Error("Failure to read element Y for ContainerElement: \"" + this.Data.Description + "\"");
    }

    /**
     * We want to simply add this position to the parents absolute Y.
     * This is because this element is relative to its parent.
     */
    returnVar += Parent.Y;

    /**
     * If the element has the CenterOffset attribute, then it is positioned in the center of its
     * parent.
     * You can position it according to X/Y and X and Y independantly.
     */
    if ((ResponsiveSize.CenterOffset === true) || (ResponsiveSize.CenterOffset === "Y")) {
        returnVar += Parent.Height / 2;
    }

    /**
     * If the element has the Centered attribute, then it is automatically realigned so the given coordinates
     * are the center, rather than the top left.
     * You can position it according to X/Y and X and Y independantly.
     */
    if ((ResponsiveSize.Centered === true) || (ResponsiveSize.Centered === "Y")) {
        if ((typeof Height === "undefined") || (Height === null)) {
            Height = this.getHeight(Parent);
        }

        returnVar -= (Height / 2);
    }

    return returnVar;
}

/**
 * This method finds out if the current element is visible.
 * It will also check its parent to make sure its parent is visible too.
 *
 * @param {ContainerElement.getCoords()|Scene} Parent
 * @returns {Boolean}
 */
ContainerElement.prototype.getVisible = function (Parent) {
    var returnVar = this.Data.Status.Visible;

    /**
     * We only need to check the parent if this current element is visible
     */
    if (returnVar) {
        /**
         * Make sure we know the parents positional information
         */
        if ((typeof Parent === "undefined") || (Parent === null)) {
            Parent = this.getParent();
        }

        returnVar = Parent.Visible;
    }

    return returnVar;
}

/**
 * This function converts a positional string to a hard number.
 * 
 * For example, if "100px" is passed through, 100 will be returned
 * if "5%" is passed  through, then 5% of the parents width/height will be returned as a Number
 * if "5%+100px" is passed through, then 5% of the parents width/height and 100px will be returned, as a number.
 * 
 * 
 * @param {String} PositionalValue
 * @param {Number} ParentSizeModifier
 * @returns {Number}
 */
ContainerElement.prototype.convertPositionalString = function (PositionalValue, ParentSizeModifier) {
    var returnVar = PositionalValue;

    if (typeof returnVar === 'string') {
        if (!isNaN(returnVar)) {
            /**
             * If this string is just a number, then we just want to convert it
             * to a number.
             */
            returnVar = parseInt(returnVar, 10);
        } else if (returnVar.match(/^([0-9]+)px$/g)) {
            /**
             * If this string is a number followed by px, than we just want to strip
             * the px away.
             *
             * for example: "100px" = 100
             */
            returnVar = parseInt(returnVar.match(/^([0-9]+)px$/g)[0], 10);
        } else if (returnVar.match(/^([0-9]+)\%$/g)) {
            /**
             * If this string is a number followed by a %, then it is a percentage.
             * We convert this number into a decimal so we can play with it.
             *
             * for example: "50%" = 50 = 0.50
             *
             * We then times this number by the parents size modifier to figure the
             * position of this element.
             */
            var percent = parseInt(returnVar.match(/^([0-9]+)\%$/g)[0], 10) / 100;

            returnVar = parseInt(ParentSizeModifier * percent, 10);
        } else if (returnVar.match(/^([0-9]+)(\%|px)(\-|\+)([0-9]+)(\%|px)$/g)) {
            /**
             * This is an advanced string, it works similar to the above two,
             * it allows for very simple calculations. 
             * It will allow you to do stuff like this:
             * 100%-50px
             * 50px-100%
             * 100%+50px
             * 50px+100%
             */

            var re = /^([0-9]+)(\%|px)(\-|\+)([0-9]+)(\%|px)$/gi;
            var regexinfo = re.exec(returnVar);

            /**
             * Currently we only support two numbers to be played with, there is probably
             * a better method to do this, with a loop. However, i can only imagine
             * ever using two numbers.
             */

            /**
             * First we figure out what the first number is
             */
            var num1 = parseInt(regexinfo[1], 10);
            if (regexinfo[2] === '%') {
                var percent = parseInt(num1, 10) / 100;
                num1 = parseInt(ParentSizeModifier * percent, 10);
            }

            /**
             * Then we figure out what the second number is
             */
            var num2 = parseInt(regexinfo[4], 10);
            if (regexinfo[5] === '%') {
                var percent = parseInt(num1, 10) / 100;
                num2 = parseInt(ParentSizeModifier * percent, 10);
            }

            /**
             * Now we simply do the arithmetic with these numbers.
             */
            if (regexinfo[3] === '+') {
                returnVar = num1 + num2;
            } else {
                returnVar = num1 - num2;
            }
        }
    }

    return returnVar;
}

/**
 * Returns the absolute positioning information of this ContainerElement that is
 * stored in cache.
 *
 * If the cache is invalid, then this method will return false.
 *
 * @returns {Boolean|ContainerElement.AbsolutePosition}
 */
ContainerElement.prototype.getCache = function () {
    var returnVar = ((this.Data.Position.CachePositioning) &&
            (typeof this.AbsolutePosition !== "undefined") && (this.AbsolutePosition !== null) && (this.Data.Position.currentCacheID === Scene.Data.CacheID.Positional));

    return (returnVar ? this.AbsolutePosition : false);
}

/**
 * This calculates the current absolute position of the ContainerElement.
 *
 * This method saves the calculations to a cache, and the cache should be referenced
 * with this.getCache(), this method should only be called if this.getCache() returns false
 * (meaning the cache is invalid).
 *
 * @returns {ContainerElement.AbsolutePosition}
 */
ContainerElement.prototype.calculatePosition = function () {
    /**
     * Calculate the various positional information.
     * These methods share similar reference variables (IE the current parents position).
     * It is not required to pass through these common variables, but it will save
     * them from having to figure it out themselves.
     */
    var Parent = this.getParent();
    var ResponsiveSize = this.parseResponsiveQueries(Parent);
    var Visible = this.getVisible(Parent, ResponsiveSize);
    var Width = this.getWidth(Parent, ResponsiveSize);
    var Height = this.getHeight(Parent, ResponsiveSize);
    var X = this.getX(Parent, ResponsiveSize, Width);
    var Y = this.getY(Parent, ResponsiveSize, Height);

    /**
     * We save the data to a cache class stored in this.
     */
    this.AbsolutePosition = {
        Parent: Parent,
        Visible: Visible,
        Width: Width,
        Height: Height,
        X: X,
        Y: Y
    }

    /**
     * Update the currentCacheID's so future getCache requests should return true
     */
    this.Data.Position.currentCacheID = Scene.Data.CacheID.Positional;

    /**
     * Return the relevent positional information
     */
    return this.AbsolutePosition;
}

/**
 * Get the current ContainerElements absolute coordinates from the top left of the canvas.
 *
 * @returns {ContainerElement.AbsolutePosition}
 */
ContainerElement.prototype.getCoords = function () {
    /**
     * If this information has been stored in a cache then we just want to simply
     * restore the information from the cache.
     *
     * Otherwise, we want to generate this information and save it to the cache.
     */
    var returnVar = this.getCache();
    if (!returnVar) {
        returnVar = this.calculatePosition();
    }

    return returnVar;
}

/**
 * Draw the ContainerElements background and outline, this is the most basic renderqueue item
 *
 *
 * @param {Integer} X
 * @param {Integer} Y
 * @param {Integer} dt
 * @returns {undefined}
 */
ContainerElement.prototype.drawBackground = function (X, Y, dt) {
    if ((this.Data.Fill.On) || (this.Data.Outline.On)) {

        Scene.drawRect(X, Y, this.Data.Position.Width, this.Data.Position.Height,
                ((this.Data.Fill.On) ? {
                    Opacity: this.Data.Fill.Opacity,
                    Colour: (this.Data.Status.Pressed) ? this.Data.Fill.Pressed : (this.Data.Status.Hovered && this.Data.Hover.On) ? this.Data.Hover.Colour : this.Data.Fill.Colour
                } : null),
                ((this.Data.Outline.On) ? {
                    Opacity: this.Data.Outline.Opacity,
                    Colour: (this.Data.Status.Pressed) ? this.Data.Outline.Pressed : this.Data.Outline.Colour
                } : null));
    }
}

/**
 * This function is responsible for all the ContainerElements drawing.
 * Child classes should not modify this class, but instead modify the renderqueue
 *
 *
 * @param {Integer} dt
 * @returns {undefined}
 */
ContainerElement.prototype.draw = function (dt) {
    var Coords = this.getCoords();
    if ((Coords.Visible) && (this.withinFrustrum(Coords))) {
        for (var i = 0; i < this.RenderQueue.Items.length; i++) {
            var e = this.RenderQueue.Items[i];
            if (typeof this[e] === 'function') {
                this[e].apply(this, [Coords.X, Coords.Y, dt]);
            }
        }
    }
}

ContainerElement.prototype.getEvents = function () {
    return this.Events;
}

ContainerElement.prototype.getData = function () {
    return this.Data;
}

/**
 * This removes any cached data
 * @returns {undefined}
 */
ContainerElement.prototype.resetCache = function () {
    this.AbsolutePosition = null;
}

/**
 * Is this element currently being hovered over?
 *
 * @param {Object} _Mouse
 * @returns {ContainerElement.prototype.isHovered.Coords|ContainerElement.getCoords|Boolean}
 */
ContainerElement.prototype.isHovered = function (_Mouse) {
    var Coords = this.getCoords();
    return ((Coords.Visible) && ((_Mouse.X < Coords.X + Coords.Width) &&
            (_Mouse.X > Coords.X) &&
            (_Mouse.Y < Coords.Y + Coords.Height) &&
            (_Mouse.Y > Coords.Y)));
}
var AI_Group = {
    None: 0,
    Player: 1,
    Ships: 2,
    Boulder: 3,
    Bullet: 4
}

var AI_State = {
    Locked: 0,
    Alive: 1,
    Dead: 2
}

var EntityElement = function (name, settings) {
    this.Data = {
        Description: "None",
        Position: {
            X: 0,
            Y: 0,
            Z: 0,
            old_X: 0,
            old_Y: 0,
            Parent: null
        },
        Model: {
            Name: "",
            FrameID: 0,
            LastUpdate: 0
        },
        Physics: {
            On: false,
            Collision: false,
            MaxSpeed: 1,
            Drag: 0.10,
            Hardness: 0,
            Thrust: 0.33,
            Velocity: {
                X: 0,
                Y: 0
            }
        },
        AI: {
            State: AI_State.Alive,
            Group: AI_Group.None,
            Protected: false,
            Health: 100
        },
        Audio: {
            ctx: null,
            osc: null,
            gain: null
        },
        BehaviourInfo: {
        }
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
        onDeath: [],
        onKill: [],
        onAnimationEnd: []
    };

    this.Behaviours = [
    ];

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
     * This class holds the various return information from the entity
     * The reason this is seperated is that we can append new return information to this
     * This is so the children can append whichever return data they need
     */
    this.returnArray = {
        Items: {
            import: this.import,
            loadObject: this.loadObject,
            RenderQueue: this.RenderQueue,
            Data: this.Data,
            Events: this.Events,
            getModel: this.getModel,
            draw: this.draw,
            updatePosition: this.updatePosition,
            drawModel: this.drawModel,
            doesCollideWith: this.doesCollideWith,
            handleCollision: this.handleCollision,
            checkCollisions: this.checkCollisions,
            kill: this.kill,
            handleBehaviours: this.handleBehaviours,
            _onAnimationEnd: this._onAnimationEnd,
            Behaviours: this.Behaviours,
            _onKill: this._onKill,
            _onDeath: this._onDeath
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
EntityElement.prototype.import = function (settings) {
    /**
     * I need to recode this function, i just cant think at the moment
     */
    for (var greaterPropertyName in settings) {
        /**
         * We dont want to overide variables that should be protected
         */
        if ((greaterPropertyName === 'Data') || (greaterPropertyName === 'Events') || (greaterPropertyName === 'Behaviours')) {
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
EntityElement.prototype.loadObject = function (name, settings) {
    this.import(settings);

    this.Data.Description = name;
}

EntityElement.prototype.getModel = function () {
    return Model.find(this.Data.Model.Name);
}

EntityElement.prototype.drawModel = function () {
    var now = Date.now();

    var eModel = this.getModel();

    eModel.draw(this.Data.Position.X, this.Data.Position.Y, this.Data.Model.FrameID);

    if (this.Data.Model.LastUpdate + eModel.Data.AnimationSpeed < now) {
        if (++this.Data.Model.FrameID >= eModel.Data.Frames.length) {
            this.Data.Model.FrameID = 0;
            this._onAnimationEnd();
        }


        this.Data.Model.LastUpdate = now;
    }
}

EntityElement.prototype.draw = function (dt) {
    if (this.Data.AI.State === AI_State.Alive) {
        this.drawModel(dt);
    }
}

EntityElement.prototype.handleCollision = function (thatEntity) {
    if (this.Data.Physics.Hardness < thatEntity.Data.Physics.Hardness) {
        this.kill();
        thatEntity._onKill();
    } else {
        thatEntity.kill();
        this._onKill();
    }
}

EntityElement.prototype.doesCollideWith = function (thatEntity) {
    var xDistance = this.Data.Position.X - thatEntity.Data.Position.X;
    var yDistance = this.Data.Position.Y - thatEntity.Data.Position.Y;
    var Distance = Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));

    /*
     * If the other object is not within 100 pixels, then we do not bother checking for collisions
     */
    if (Distance < 100) {
        var thisModel = this.getModel();
        var thatModel = thatEntity.getModel();

        /**
         * Now before we do pixel perfect collisions, lets make sure it collides roughly
         */

        if ((this.Data.Position.X < thatEntity.Data.Position.X + thatModel.getWidth()) &&
                (this.Data.Position.X + thisModel.getWidth() > thatEntity.Data.Position.X) &&
                (this.Data.Position.Y < thatEntity.Data.Position.Y + thatModel.getHeight()) &&
                (this.Data.Position.Y + thisModel.getHeight() > thatEntity.Data.Position.Y)) {

            for (var thisFrameY = 0; thisFrameY < thisModel.Data.Frames[this.Data.Model.FrameID].length; thisFrameY++) {
                for (var thisFrameX = 0; thisFrameX < thisModel.Data.Frames[this.Data.Model.FrameID][thisFrameY].length; thisFrameX++) {

                    var thisFrameBlock = {
                        X: this.Data.Position.X + (thisFrameX * thisModel.Data.Tile_Size),
                        Y: this.Data.Position.Y + (thisFrameY * thisModel.Data.Tile_Size),
                        Size: thisModel.Data.Tile_Size,
                        Value: thisModel.Data.Frames[this.Data.Model.FrameID][thisFrameY][thisFrameX]
                    }

                    if (thisFrameBlock.Value !== null) {

                        for (var thatFrameY = 0; thatFrameY < thatModel.Data.Frames[thatEntity.Data.Model.FrameID].length; thatFrameY++) {
                            for (var thatFrameX = 0; thatFrameX < thatModel.Data.Frames[thatEntity.Data.Model.FrameID][thatFrameY].length; thatFrameX++) {

                                var thatFrameBlock = {
                                    X: thatEntity.Data.Position.X + (thatFrameX * thatModel.Data.Tile_Size),
                                    Y: thatEntity.Data.Position.Y + (thatFrameY * thatModel.Data.Tile_Size),
                                    Size: thatModel.Data.Tile_Size,
                                    Value: thatModel.Data.Frames[thatEntity.Data.Model.FrameID][thatFrameY][thatFrameX]
                                }

                                if (thatFrameBlock.Value !== null) {

                                    if ((thisFrameBlock.X < thatFrameBlock.X + thatFrameBlock.Size) &&
                                            (thisFrameBlock.X + thisFrameBlock.Size > thatFrameBlock.X) &&
                                            (thisFrameBlock.Y < thatFrameBlock.Y + thatFrameBlock.Size) &&
                                            (thisFrameBlock.Y + thisFrameBlock.Size > thatFrameBlock.Y)) {
                                        return true;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    return false;
}

EntityElement.prototype.kill = function (dt) {
    var returnVar = false;
    if (this.Data.Description === "Player") {
        showGameOver();
        returnVar = true;
    } else {
        this._onDeath();
        returnVar = Entity.removeElement(this);
    }
    return returnVar;
}

EntityElement.prototype.updatePosition = function (dt) {
    if (((this.Data.AI.State === AI_State.Alive) && (this.Data.Physics.Velocity.Y !== 0) || (this.Data.Physics.Velocity.X !== 0))) {

        this.Data.Physics.Velocity.X = this.Data.Physics.Velocity.X.min(-this.Data.Physics.MaxSpeed).max(this.Data.Physics.MaxSpeed);
        this.Data.Physics.Velocity.Y = this.Data.Physics.Velocity.Y.min(-this.Data.Physics.MaxSpeed).max(this.Data.Physics.MaxSpeed);

        this.Data.Position.X += this.Data.Physics.Velocity.X * dt;
        this.Data.Position.Y += this.Data.Physics.Velocity.Y * dt;

        if (this.Data.Description === "Player") {
            var eModel = Model.find(this.Data.Model.Name);
            if (this.Data.Position.Y > Scene.Viewport.Height - eModel.getHeight()) {
                this.Data.Position.Y = Scene.Viewport.Height - eModel.getHeight();
                this.Data.Physics.Velocity.Y = 0;
            } else if (this.Data.Position.Y < 0) {
                this.Data.Position.Y = 0;
                this.Data.Physics.Velocity.Y = 0;
            }
            if (this.Data.Position.X > Scene.Viewport.Width - eModel.getWidth()) {
                this.Data.Position.X = Scene.Viewport.Width - eModel.getWidth();
                this.Data.Physics.Velocity.X = 0;
            } else if (this.Data.Position.X < 0) {
                this.Data.Physics.Velocity.X = 0;
                this.Data.Position.X = 0;
            }
        } else {
            if ((this.Data.Position.Y > Scene.Viewport.Height) ||
                    (this.Data.Position.Y + this.getModel().getHeight() < 0) ||
                    (this.Data.Position.X > Scene.Viewport.Width) ||
                    (this.Data.Position.X + this.getModel().getWidth() < 0)) {
                this.kill(false);
            }
        }

        var DragWeight = (this.Data.Physics.Drag * dt);

        if ((this.Data.Physics.Velocity.X < DragWeight) && (this.Data.Physics.Velocity.X > -DragWeight)) {
            this.Data.Physics.Velocity.X = 0;
        } else {
            this.Data.Physics.Velocity.X -= ((this.Data.Physics.Velocity.X < 0) ? -DragWeight : DragWeight);
        }

        if ((this.Data.Physics.Velocity.Y < DragWeight) && (this.Data.Physics.Velocity.Y > -DragWeight)) {
            this.Data.Physics.Velocity.Y = 0;
        } else {
            this.Data.Physics.Velocity.Y -= ((this.Data.Physics.Velocity.Y < 0) ? -DragWeight : DragWeight);
        }
    }
}

EntityElement.prototype.handleBehaviours = function (dt) {
    for (var i = 0; i < this.Behaviours.length; i++) {
        var e = this.Behaviours[i];

        var fn = window[e];
        if (typeof fn === "function") {
            fn.apply(this, [dt]);
        }
    }
}

EntityElement.prototype._onKill = function () {
    if (this.Events.onKill.length > 0) {
        for (var i = 0; i < this.Events.onKill.length; i++) {
            var e = this.Events.onKill[i];

            var fn = window[e.Function];
            if (typeof fn === "function") {
                fn.apply(this, [e.Parameters]);
            }
        }
    }
}

EntityElement.prototype._onDeath = function () {
    if (this.Events.onDeath.length > 0) {
        for (var i = 0; i < this.Events.onDeath.length; i++) {
            var e = this.Events.onDeath[i];

            var fn = window[e.Function];
            if (typeof fn === "function") {
                fn.apply(this, [e.Parameters]);
            }
        }
    }
}

EntityElement.prototype._onAnimationEnd = function () {
    if (this.Events.onAnimationEnd.length > 0) {
        for (var i = 0; i < this.Events.onAnimationEnd.length; i++) {
            var e = this.Events.onAnimationEnd[i];

            var fn = window[e.Function];
            if (typeof fn === "function") {
                fn.apply(this, [e.Parameters]);
            }
        }
    }
}

EntityElement.prototype.checkCollisions = function (dt) {
    for (var i = 0; i < Entity.Elements.length; i++) {
        var e = Entity.Elements[i];
        if ((e !== this) &&
                (typeof e !== "undefined") &&
                (e.Data.AI.Group !== this.Data.AI.Group) &&
                (e.Data.AI.State === AI_State.Alive) &&
                (this.Data.AI.State === AI_State.Alive) &&
                (e.Data.Physics.Collision) &&
                (this.Data.Physics.Collision)) {

            if (this.doesCollideWith(e)) {
                this.handleCollision(e);
                return;
            }
        }
    }
}
var EntityController = function () {
    this.constructor();

    this.Data = {
        lastCollissionCheck: 0,
        collisionCheckDelay: 0
    };


    return {
        Elements: this.Elements,
        Data: this.Data,
        find: this.find,
        add: this.add,
        removeElement: this.removeElement,
        killNonProtected: this.killNonProtected,
        checkCollisions: this.checkCollisions,
        renderAll: this.renderAll
    }
}

EntityController.prototype = Object.create(Controller.prototype);
EntityController.prototype.constructor = Controller;

EntityController.prototype.renderAll = function (dt) {
    
    this.Elements.forEach(function (e) {
    //for (var i = 0; i < this.Elements.length; i++) {
    //    var e = this.Elements[i];

        var Parent = Container.find(e.Data.Position.Parent);
        if (Parent) {
            var ParentCoords = Parent.getCoords();

            if ((ParentCoords.Visible) && (Parent.withinFrustrum(ParentCoords))) {
                e.checkCollisions(dt);
                e.handleBehaviours(dt);
                e.updatePosition(dt);
                e.draw(dt);
            }
        }
    //}
    });

    /*
     this.checkCollisions(dt);
     
     this.Elements.forEach(function (e) {
     e.handleBehaviours(dt);
     });
     this.Elements.forEach(function (e) {
     e.updatePosition(dt);
     });
     this.Elements.forEach(function (e) {
     e.draw(dt);
     });
     */
}

EntityController.prototype.checkCollisions = function (dt) {
    /*
     for (var i2 = 0; i2 < this.Elements.length; i2++) {
     var e2 = this.Elements[i2];
     
     if ((i1 !== i2) &&
     (typeof e1 !== "undefined") &&
     (typeof e2 !== "undefined") &&
     (e1.Data.AI.Group !== e2.Data.AI.Group) &&
     (e1.Data.AI.State === AI_State.Alive) &&
     (e2.Data.AI.State === AI_State.Alive) &&
     (e1.Data.Physics.Collision) &&
     (e2.Data.Physics.Collision)) {
     if (e1.doesCollideWith(e2)) {
     e1.handleCollision(e2);
     return;
     }
     }
     }
     */


    /*
     var now = Date.now();
     if (this.Data.lastCollissionCheck + this.Data.collisionCheckDelay < now) {
     for (var i1 = 0; i1 < this.Elements.length; i1++) {
     var e1 = this.Elements[i1];
     
     
     for (var i2 = 0; i2 < this.Elements.length; i2++) {
     var e2 = this.Elements[i2];
     
     if ((i1 !== i2) &&
     (typeof e1 !== "undefined") &&
     (typeof e2 !== "undefined") &&
     (e1.Data.AI.Group !== e2.Data.AI.Group) &&
     (e1.Data.AI.State === AI_State.Alive) &&
     (e2.Data.AI.State === AI_State.Alive) &&
     (e1.Data.Physics.Collision) &&
     (e2.Data.Physics.Collision)) {
     if (e1.doesCollideWith(e2)) {
     e1.handleCollision(e2);
     return;
     }
     }
     }
     }
     this.Data.lastCollissionCheck = now;
     }
     */
}

var Entity = new EntityController;
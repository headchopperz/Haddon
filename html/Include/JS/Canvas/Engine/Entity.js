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
        renderAll: this.renderAll
    }
}

EntityController.prototype = Object.create(Controller.prototype);
EntityController.prototype.constructor = Controller;

EntityController.prototype.renderAll = function (dt) {
    
    this.Elements.forEach(function (e) {
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
    });
}

var Entity = new EntityController;
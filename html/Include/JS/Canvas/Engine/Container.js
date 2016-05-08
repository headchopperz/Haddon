var ContainerController = function () {
    this.constructor();

    return {
        Elements: this.Elements,
        Data: this.Data,
        find: this.find,
        renderAll: this.renderAll,
        add: this.add,
        registerKeyPress: this.registerKeyPress,
        registerKeyRelease: this.registerKeyRelease,
        registerMouseDown: this.registerMouseDown,
        registerMouseRelease: this.registerMouseRelease,
        registerMouseMove: this.registerMouseMove
    }

}

ContainerController.prototype = Object.create(Controller.prototype);
ContainerController.prototype.constructor = Controller;

ContainerController.prototype.renderAll = function (dt) {
    this.Elements.forEach(function (e) {
        e.draw(dt);
    });
}

ContainerController.prototype.registerKeyRelease = function (keyCode) {
    if (Scene.Data.Info.SelectedTextBox === null) {
        for (var i = 0; i < this.Elements.length; i++) {
            var ContainerElement = this.Elements[i];

            if ((ContainerElement.Events.onKeyRelease.length > 0) && (ContainerElement.getCoords().Visible)) {
                for (var b = 0; b < ContainerElement.Events.onKeyRelease.length; b++) {
                    if (ContainerElement.Events.onKeyRelease[b].KeyCode == keyCode) {
                        var fn = window[ContainerElement.Events.onKeyRelease[b].Function];
                        if (typeof fn === "function") {
                            fn.apply(this, ContainerElement.Events.onKeyRelease[b].Parameters);
                        }
                    }
                }
            }
        }
    }
}

ContainerController.prototype.registerKeyPress = function (keyCode) {
    if (Scene.Data.Info.SelectedTextBox === null) {
        for (var i = 0; i < this.Elements.length; i++) {
            var ContainerElement = this.Elements[i];

            if ((ContainerElement.Events.onKeyPress.length > 0) && (ContainerElement.getCoords().Visible)) {
                for (var b = 0; b < ContainerElement.Events.onKeyPress.length; b++) {
                    if (ContainerElement.Events.onKeyPress[b].KeyCode == keyCode) {
                        var fn = window[ContainerElement.Events.onKeyPress[b].Function];
                        if (typeof fn === "function") {
                            fn.apply(this, ContainerElement.Events.onKeyPress[b].Parameters);
                        }
                    }
                }
            }
        }
    }
}

ContainerController.prototype.registerMouseDown = function () {
    var ContainerElementsAffected = 0;
    for (var i = 0; i < this.Elements.length; i++) {
        var e = this.Elements[i];

        if ((!e.Data.Status.Pressed) && e.isHovered(Mouse)) {
            e._onClick();

            if (e.Data.Description === Scene.Data.Info.SelectedTextBox) {
                ContainerElementsAffected++;
            }
        }
    }

    if (ContainerElementsAffected === 0) {
        Scene.Data.Info.SelectedTextBox = null;
    }
}

ContainerController.prototype.registerMouseRelease = function () {
    var ContainerElementsAffected = 0;
    for (var i = 0; i < this.Elements.length; i++) {
        var e = this.Elements[i];
        if ((e.Data.Status.Pressed) && e.isHovered(Mouse)) {
            e._onRelease();

            if (e.Data.Description === Scene.Data.Info.SelectedTextBox) {
                ContainerElementsAffected++;
            }
        }
    }

    if (ContainerElementsAffected === 0) {
        Scene.Data.Info.SelectedTextBox = null;
    }
}

ContainerController.prototype.registerMouseMove = function () {
    var HoveredElementsAm = 0;

    for (var i = 0; i < this.Elements.length; i++) {
        var e = this.Elements[i];

        if ((e.Data.Hover.On) && e.isHovered(Mouse)) {
            e._onHover();
            if ((!e.Data.Status.Pressed) && Mouse.Down) {
                e._onClick();
            }
            if (e.Data.Hover.On && e.Data.Hover.ChangeCursor) {
                HoveredElementsAm++;
            }
        } else {
            e._onLeave();
        }
    }

    /**
     * Did we encounter any elements that require the mouse cursor to change
     * its pointer?
     * If so then we want to change for the entire page... (its the only way
     * that i could find). However, since we turn it back just as fast, it
     * seems fluid.
     */
    if (HoveredElementsAm > 0) {
        Scene.canvas.style.cursor = 'pointer';
    } else {
        Scene.canvas.style.cursor = '';
    }
}

var Container = new ContainerController;
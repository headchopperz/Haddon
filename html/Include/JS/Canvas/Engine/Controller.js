var Controller = function () {
    this.Elements = new Array();
    this.Data = {};
    
    return {
        Elements: this.Elements,
        Data: this.Data,
        add: this.add,
        find: this.find,
        removeElement: this.removeElement,
        killNonProtected: this.killNonProtected,
        killAll: this.killAll
    }
}

Controller.prototype.add = function (ChildElement) {
    this.Elements.push(ChildElement);
}

Controller.prototype.find = function (name) {
    for (var i = 0; i < this.Elements.length; i++) {
        var e = this.Elements[i];
        if (name === e.Data.Description) {
            return e;
        }
    }
    return false;
}

Controller.prototype.removeElement = function (ChildElement) {
    for (var i = 0; i < this.Elements.length; i++) {
        var e = this.Elements[i];
        if (ChildElement === e) {
            this.Elements.splice(i, 1);
            return true;
        }
    }
    return false;
}

Controller.prototype.killNonProtected = function () {
    for (var i = 0; i < this.Elements.length; i++) {
        var e = this.Elements[i];
        if ((e.Data.AI.Protected === false) && (e.kill())) {
            i--;
        }
    }
}

Controller.prototype.killAll = function () {
    this.Element = new Array();
}
var ModelController = function() {
    this.Elements = new Array();
    
    this.Data = {};
    
    return {
        find: this.find,
        Elements: this.Elements,
        Data: this.Data,
        renderAll: this.renderAll,
        add: this.add
    }
}

ModelController.prototype.find = function(name) {
    for (var i = 0; i < this.Elements.length; i++) {
        var e = this.Elements[i];
        if (name === e.Data.Description) {
            return e;
        }
    }
    return false;    
}

ModelController.prototype.renderAll = function (dt) {
    this.Elements.forEach(function (e) {
        e.draw(dt);
    });
}

ModelController.prototype.add = function (ModelElement) {
    this.Elements.push(ModelElement);
}

var Model = new ModelController;
var cBehaviour_SpaceShipMove = function (dt) {
    if (this.Data.AI.State === AI_State.Alive) {

        if (typeof this.Data.BehaviourInfo.SpaceShipSpawnPosition === "undefined") {
            this.Data.BehaviourInfo.SpaceShipSpawnPosition = 0;
            this.Data.BehaviourInfo.SpaceShipMoveSpeed = 0.002;
        }

        this.Data.BehaviourInfo.SpaceShipSpawnPosition += this.Data.BehaviourInfo.SpaceShipMoveSpeed * dt;

        var a = ((Scene.Viewport.Height - this.getModel().getHeight())) / 2;
        this.Data.Position.Y = a + (Math.sin(this.Data.BehaviourInfo.SpaceShipSpawnPosition) * a);



        this.Data.Physics.Velocity.X = 0.01 * dt;
    }
};
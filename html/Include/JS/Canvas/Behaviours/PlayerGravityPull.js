var cBehaviour_PlayerGravityPull = function (dt) {
    if (this.Data.AI.State === AI_State.Alive) {
        this.Data.Physics.Velocity.X  -= (0.0018 * (this.Data.Position.X / Scene.Viewport.Width) * dt).max(1);
    }
};
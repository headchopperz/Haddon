var cBehaviour_BoulderMove = function (dt) {
    if (this.Data.AI.State === AI_State.Alive) {
        this.Data.Physics.Velocity.X = -0.15 + (-1 * Game.getDifficultyModifier());
    }
};
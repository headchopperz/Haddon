var cEvent_KillSelf = function (dt) {
    if (this.Data.AI.State === AI_State.Alive) {
        this.kill(dt);
    }
};
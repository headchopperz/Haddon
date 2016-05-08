var cEvent_GainScore = function (Amount) {
    if (this.Data.AI.State === AI_State.Alive) {
        Game.addScoreModifier(Amount);
    }
};
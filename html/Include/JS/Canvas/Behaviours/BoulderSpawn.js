var cBehaviour_BoulderSpawn = function (dt) {
    if (this.Data.AI.State === AI_State.Locked) {
        var now = Date.now();

        if (typeof this.Data.BehaviourInfo.BoulderSpawnTimer === "undefined") {
            this.Data.BehaviourInfo.BoulderSpawnTimer = 0;
            this.Data.BehaviourInfo.BoulderSpawnTimerOffset = 0;
        }

        if (this.Data.BehaviourInfo.BoulderSpawnTimer + this.Data.BehaviourInfo.BoulderSpawnTimerOffset < now) {
            var newBoulder = new EntityElement('LameBoulder', {
                Data: this.Data,
                Events: this.Events,
                Behaviours: this.Behaviours
            });

            newBoulder.import({
                Data: {
                    Position: {
                        X: Scene.Viewport.Width,
                        Y: Math.random() * (Scene.Viewport.Height - newBoulder.getModel().getHeight())
                    },
                    AI: {
                        State: AI_State.Alive,
                        Protected: false
                    }
                }
            });

            Entity.add(newBoulder);

            this.Data.BehaviourInfo.BoulderSpawnTimer = now;
            if ((Math.random() > 0.7) || (Game.Data.Age < 8500)) {
                this.Data.BehaviourInfo.BoulderSpawnTimerOffset = ((1400 * (1 - Game.getDifficultyModifier()) * (0.5 + 0.5 * Math.random()))).max(1400).min(105);
            } else {
                this.Data.BehaviourInfo.BoulderSpawnTimerOffset = ((400 * (1 - Game.getDifficultyModifier()) * (0.5 + 0.5 * Math.random()))).max(1400).min(105);                
            }
            
        }
    }
};
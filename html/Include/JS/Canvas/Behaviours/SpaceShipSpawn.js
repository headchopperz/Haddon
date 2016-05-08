var cBehaviour_SpaceShipSpawn = function (dt) {
    if (this.Data.AI.State === AI_State.Locked) {
        var now = Date.now();

        if (typeof this.Data.BehaviourInfo.SpaceShipLastSpawnTime === "undefined") {
            this.Data.BehaviourInfo.SpaceShipLastSpawnTime = now;
            this.Data.BehaviourInfo.SpaceShipCurrentSpawnAmount = 0;
            this.Data.BehaviourInfo.SpaceShipSpawnPosition = 0;
            this.Data.BehaviourInfo.SpaceShipMoveSpeed = 0.002;
        }

        if ((this.Data.BehaviourInfo.SpaceShipCurrentSpawnAmount === 0) && (this.Data.BehaviourInfo.SpaceShipLastSpawnTime + (5000 * (1 - Game.getDifficultyModifier())) < now)) {
            this.Data.BehaviourInfo.SpaceShipCurrentSpawnAmount = 1;
            this.Data.BehaviourInfo.SpaceShipSpawnPosition = Math.random() * 360;
            this.Data.BehaviourInfo.SpaceShipLastSpawnTime = now;
            this.Data.BehaviourInfo.SpaceShipMoveSpeed = (Math.random() * 0.003).min(0.001);
            
            var eBullet = Entity.find('EarthSpaceShipBullet');
            for (var i = 0; i < Entity.Elements.length; i++) {
                var e = Entity.Elements[i];
                if ((typeof e !== "undefined") && 
                        ((e.Data.AI.Group === AI_Group.Boulder) && 
                        (e.Data.Position.X < (Scene.Viewport.Width / 2.5)) ||
                        (e.Data.AI.Group === AI_Group.Player) && 
                        (e.Data.Position.X < (Scene.Viewport.Width / 12))) && 
                        (e.Data.AI.State === AI_State.Alive)) {

                    var newBullet = new EntityElement('LameEarthSpaceShipBullet', {
                        Data: eBullet.Data,
                        Events: eBullet.Events,
                        Behaviours: eBullet.Behaviours
                    })

                    newBullet.import({
                        Data: {
                            Position: {
                                X: 0,
                                Y: e.Data.Position.Y + (Math.random() * e.getModel().getHeight())
                            },
                            AI: {
                                State: AI_State.Alive,
                                Protected: false
                            },
                            Physics: {
                                Velocity: {
                                    X: (2 * Game.getDifficultyModifier()).max(2).min(0.25)
                                }
                            }
                        }
                    });

                    Entity.add(newBullet);
                }

            }
        }


        if ((this.Data.BehaviourInfo.SpaceShipCurrentSpawnAmount > 0) && (this.Data.BehaviourInfo.SpaceShipLastSpawnTime + 150 < now)) {
            var newBoulder = new EntityElement('LameSpaceShip', {
                Data: this.Data,
                Events: this.Events,
                Behaviours: this.Behaviours
            })

            newBoulder.import({
                Data: {
                    Position: {
                        X: 0
                    },
                    AI: {
                        State: AI_State.Alive,
                        Protected: false
                    }
                }
            });

            Entity.add(newBoulder);
            
            cBehaviour_SpaceShipMove.apply(newBoulder, [1]);

            if (++this.Data.BehaviourInfo.SpaceShipCurrentSpawnAmount > Math.round(5 * Game.getDifficultyModifier()).min(1)) {
                this.Data.BehaviourInfo.SpaceShipCurrentSpawnAmount = 0;
            }

            this.Data.BehaviourInfo.SpaceShipLastSpawnTime = now;
        }
    }
};
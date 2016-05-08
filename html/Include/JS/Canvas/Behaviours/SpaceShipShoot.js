var cBehaviour_SpaceShipShoot = function (dt) {
    if (this.Data.AI.State === AI_State.Alive) {
        var now = Date.now();

        if (typeof this.Data.BehaviourInfo.SpaceShipLastBulletTime === "undefined") {
            this.Data.BehaviourInfo.SpaceShipLastBulletTime = now;
            this.Data.BehaviourInfo.SpaceShipNextBulletTime = Math.random() * 500;
        }


        if (this.Data.BehaviourInfo.SpaceShipLastBulletTime + this.Data.BehaviourInfo.SpaceShipNextBulletTime < now) {
            var eBullet = Entity.find('EarthSpaceShipBullet');

            var newBullet = new EntityElement('LameEarthSpaceShipBullet', {
                Data: eBullet.Data,
                Events: eBullet.Events,
                Behaviours: eBullet.Behaviours
            })

            newBullet.import({
                Data: {
                    Position: {
                        X: this.Data.Position.X,
                        Y: this.Data.Position.Y + (this.getModel().getHeight() / 2)
                    },
                    AI: {
                        State: AI_State.Alive,
                        Protected: false
                    },
                    Physics: {
                        Velocity: {
                            X: (1 * Game.getDifficultyModifier()).max(1).min(0.25)
                        }
                    }
                }
            });

            Entity.add(newBullet);

            this.Data.BehaviourInfo.SpaceShipNextBulletTime = 500 + (Math.random() * 7000);
            this.Data.BehaviourInfo.SpaceShipLastBulletTime = now;
        }
    }
};
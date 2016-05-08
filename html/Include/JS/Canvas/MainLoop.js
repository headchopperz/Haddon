/**
 * This function is the part of the code where i deal with the player in particular
 *
 * @param {Number} dt
 * @returns {undefined}
 */
function mainLoop(dt) {
    if (Key.isKeyPressed(KeyCode.F, false)) {
        Scene.drawText(25, 25, "FPS: " + Scene.getFPS(),
                ({
                    Opacity: 1,
                    Align: "left",
                    Colour: "white",
                    Font: "16px Georgia"
                }));
    }
}
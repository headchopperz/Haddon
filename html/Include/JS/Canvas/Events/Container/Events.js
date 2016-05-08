/**
 * This function plays the game, because the game is ALWAYS loaded from a fresh state,
 * (The browser refreshes before each replay... cheating i know)
 * I dont need to do a lot of setting up or dismanteling of old props
 */
function playGame(e) {
    Game.Data.inMenu = false; //take off our stabalisers

    Game.reset();
    Game.Data.GameStart = Date.now(); //this is needed so we know the users score

    /**
     * Hide the various button stuff for the homepage.
     * 
     */
    Container.find('containerMenu').Data.Status.Visible = false;
    Container.find('containerHighscores').Data.Status.Visible = false;
    Container.find('containerTitle').Data.Status.Visible = false;
    Container.find('containerGame').Data.Status.Visible = true;
    Container.find('containerGameOver').Data.Status.Visible = false;
}

/**
 * This function plays the game, because the game is ALWAYS loaded from a fresh state,
 * (The browser refreshes before each replay... cheating i know)
 * I dont need to do a lot of setting up or dismanteling of old props
 */
function showHighscores(e) {
    Game.Data.inMenu = true; //take off our stabalisers

    if (window.localStorage) {
        loadHighscores(JSON.parse(window.localStorage.getItem('aeHighscores')));
    }

    /**
     * Hide the various button stuff for the homepage.
     * 
     */
    Container.find('containerMenu').Data.Status.Visible = false;
    Container.find('containerTitle').Data.Status.Visible = true;
    Container.find('containerHighscores').Data.Status.Visible = true;
    Container.find('containerGame').Data.Status.Visible = false;
    Container.find('containerGameOver').Data.Status.Visible = false;
}

function loadHighscores(obj) {

    var textHighscoresList = Container.find('textHighscoresList');

    obj.sort(compareScore);

    var HighscoresList = [];
    
    for (var i = 0; i < obj.length; i++) {
        var e = obj[i];
        
        var TextParts = [
            (i + 1) + ". ",
            e.Name,
            "",
            " (" + e.Score + ")"
        ]
        
        var font = textHighscoresList.Data.Text.Size + "px " + textHighscoresList.Data.Text.Font;
        
        var width = Scene.getTextSize(TextParts.join(''), font);
        var maxWidth = textHighscoresList.Data.Position.Width;
        
        var spaceAM = Math.floor((maxWidth - width) / Scene.getTextSize(' ', font));
        

        for (var n = 0; n < spaceAM; n++) {
            TextParts[2] += " ";
        }

        HighscoresList.push(TextParts.join(''));
    }

    textHighscoresList.Data.Text.Value = HighscoresList.join('\r\n');
}

/**
 * This function plays the game, because the game is ALWAYS loaded from a fresh state,
 * (The browser refreshes before each replay... cheating i know)
 * I dont need to do a lot of setting up or dismanteling of old props
 */
function openMainMenu(e) {
    Game.Data.inMenu = true; //take off our stabalisers

    /**
     * Hide the various button stuff for the homepage.
     * 
     */
    Container.find('containerMenu').Data.Status.Visible = true;
    Container.find('containerTitle').Data.Status.Visible = true;
    Container.find('containerHighscores').Data.Status.Visible = false;
    Container.find('containerGame').Data.Status.Visible = false;
    Container.find('containerGameOver').Data.Status.Visible = false;
}



function showGameOver(e) {
    Game.Data.inMenu = true; //take off our stabalisers


    Container.find('textGOScore').Data.Text.Value = "Score: " + Game.getScore();

    /**
     * Hide the various button stuff for the homepage.
     * 
     */
    Container.find('containerTitle').Data.Status.Visible = true;
    Container.find('containerGameOver').Data.Status.Visible = true;
    Container.find('containerHighscores').Data.Status.Visible = false;
    Container.find('containerGame').Data.Status.Visible = false;
    Container.find('containerMenu').Data.Status.Visible = false;
}

function saveScore(e) {
    if (window.localStorage) {
        var Highscores = JSON.parse(window.localStorage.getItem('aeHighscores'));

        var Name = Container.find('textGOEnterName').Data.TextBox.Value;

        if (Name.length === 0) {
            Name = "Guest";
        }

        Highscores.push({
            Name: Name,
            Score: Game.getScore()
        });

        Highscores.sort(compareScore);

        if (Highscores.length >= 10) {
            Highscores.splice(10, Highscores.length - 9);
        }

        window.localStorage.setItem('aeHighscores', JSON.stringify(Highscores));
    }
}
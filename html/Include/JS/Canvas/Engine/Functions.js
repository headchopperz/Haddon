/**
 * This function simply opens a URL in a new tab,
 * There may need to be a fallback if the browser tries to open this in a new
 * window, as AV programs and browsers will see this potentially as a popup?
 * 
 * @param {String} URL
 * @returns {undefined}
 */
function OpenURL(URL) {
    window.open(URL, '_blank');
}

/**
 * This function compares two highscore elements and sorts them descendingly
 * @param {Highscore Class} a
 * @param {Highscore Class} b
 * @returns {Number}
 */
function compareScore(a, b) {
    if (a.Score > b.Score)
        return -1;
    if (a.Score < b.Score)
        return 1;
    return 0;
}
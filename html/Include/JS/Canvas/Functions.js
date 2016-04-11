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
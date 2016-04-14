//http://stackoverflow.com/a/24408672

if (document.all && !window.atob && !!window.HTMLCanvasElemen) {
    var error_div = [
        "<h2 style='text-align:center; color:white;'>",
            "Sorry, we do not currently support this browser.<br/>",
            "Please upgrade to a more modern browser such as:<br/>",
            "<a href='https://www.google.com/chrome/browser/'>Google Chrome</a>,<br/>",
            "<a href='https://www.mozilla.org/'>Mozilla Firefox</a>,<br/>",
            "<a href='https://www.microsoft.com/en-us/windows/microsoft-edge'>Microsoft Edge</a>,<br/>",
            "<a href='http://midori-browser.org/'>Midori</a> or<br/>",
            "<a href='https://www.opera.com/download'>Opera</a><br/><br/>",
            "Thankyou.<br/>",
            "- Michael Haddon",
        "</h2>"
    ].join('\n');
    
    $('body').empty().html(error_div);
    
    throw new Error("This is not an error. This is just to abort javascript");
    asdf();
}

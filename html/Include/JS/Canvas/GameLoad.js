function gameLoad() {
    /**
     * Load all the additional containers for the page.
     *
     * @param {type} obj
     * @returns {undefined}
     */
    loadJSON("/Include/Data/Containers.json", function (obj) {
        obj.forEach(function (e) {
            if (e.Type === "TextBox") {
                Container.add(new ContainerElement_TextBox(e.Data.Description, e));
            } else if (e.Type === "PictureBox") {
                Container.add(new ContainerElement_PictureBox(e.Data.Description, e));
            } else {
                Container.add(new ContainerElement(e.Data.Description, e));
            }
        });
        
        Container.find('containerTitle').Data.Fill.On = true;
        Container.find('textTitleDescription').Data.Text.Value = "My name is Michael Haddon";
    });

    loadJSON("/Include/Data/Models.json", function (obj) {
        obj.forEach(function (e) {
            Model.add(new ModelElement(e.Data.Description, e));
        });
    });

    loadJSON("/Include/Data/Entities.json", function (obj) {
        obj.forEach(function (e) {
            Entity.add(new EntityElement(e.Data.Description, e));
        });
    });

    loadJSON("/Include/Data/Audio.json", function (obj) {
        obj.forEach(function (e) {
            gAudio.add(new AudioElement(e.Data.Description, e));
        });
    });

    loadJSON("/Include/Data/Highscores.json", function (obj) {
        if (window.localStorage) {
            if (!window.localStorage.getItem('aeHighscores')) {
                window.localStorage.setItem('aeHighscores', JSON.stringify(obj));
            }
        } else {
            loadHighscores(obj);
        }
    });

    /**
     * Load all the timeline information and create Containers to hold all of it
     *
     * @param {type} obj
     * @returns {undefined}
     */
    loadJSON("/Include/Data/TimelineElements.json", function (obj) {
        var Coords = Container.find('containerTitle').getCoords();

        obj.forEach(function (e, i) {
            loadTimelineElement(Coords, e, i);
        });

        Scene.updateViewport();
    });
}


/**
 * This function adds a new timeline element to the page.
 * This information is usually loaded from TimelineElements.json under /Include/Data/
 *
 * This function has three requirements.
 * 1. Coords - The Coords of the parent element that we will base these elements off
 *             Most of the positioning will be calculated live from the parent, however
 *             We still need this to find out the height of the parent, so we can
 *             make sure we actually position it below the parent
 *
 * 2. Data   - The Timeline elements actual data. This includes Images, Text, all sorts
 *
 * 3. OffsetID - The Timeline Elements ID. This stops timeline elements from overlapping
 *               As we can ensure they are positioned below all the other elements.
 *               We also use it with modulus to find out which direction this element will
 *               face.
 *
 *
 * This function will create a series of Containers, it is within these where the
 * information is stored and manipulated.
 *
 * @param {Object} Coords
 * @param {Object} data
 * @param {Number} OffsetID
 * @returns {undefined}
 */
function loadTimelineElement(Coords, data, OffsetID) {

    var TimelineName = 'Timeline-' + OffsetID;

    var Element = {
        X: 0,
        Height: 250,
        Width: 500,
    }
    Element.X = (OffsetID % 2 === 1) ? Element.Width / 2 : -Element.Width / 2;


    Container.add(new ContainerElement(TimelineName + '-Container', {
        Data: {
            Position: {
                X: Element.X,
                Y: (Coords.Y + Coords.Height) + 50 + (Element.Height * OffsetID),
                Width: Element.Width,
                Height: Element.Height,
                CenterOffset: "X",
                Centered: "X",
                Responsive: {
                    On: true,
                    Queries: [
                        {
                            On: true,
                            maxWidth: 1030,
                            X: (OffsetID % 2 === 1) ? 50 : -50,
                            Y: (Coords.Y + Coords.Height) + 50 + ((Element.Height + 70) * OffsetID)
                        }, {
                            On: true,
                            maxWidth: 700,
                            Width: "100%",
                            Height: (Element.Height * 2),
                            X: 0,
                            Y: (Coords.Y + Coords.Height) + 50 + (((Element.Height * 2) + 70) * OffsetID)
                        }
                    ]
                }
            }
        }
    }));

    Container.add(new ContainerElement_FancyBackground(TimelineName + '-FSCT', {
        Data: {
            Position: {
                X: 0,
                Y: 0,
                Width: "100%",
                Height: "100%",
                Direction: (OffsetID % 2 === 1) ? 'Left' : 'Right',
                Parent: TimelineName + '-Container'
            },
            Fill: {
                On: true,
                Opacity: 0.15
            },
            Hover: {
                On: true,
                Opacity: 0.25,
                ChangeCursor: false
            },
            Dots: {
                On: true
            }
        }
    }));

    Container.add(new ContainerElement_TextBox(TimelineName + '-Title', {
        Data: {
            Position: {
                X: 25,
                Y: 0,
                Width: "100%-50px",
                Height: 24,
                Parent: TimelineName + '-Container'
            },
            Text: {
                On: true,
                Size: 24,
                Font: "Roboto,Georgia",
                Center: false,
                Padding: 0,
                Align: (OffsetID % 2 === 1) ? "right" : "left",
                Value: data.Data.Title
            }
        }
    }));

    var SphereOffset = 125 + 5;
    var xv = (OffsetID % 2 === 1) ? SphereOffset : 0;

    Container.add(new ContainerElement_TextBox(TimelineName + '-Description', {
        Data: {
            Position: {
                X: 20 + xv,
                Y: 30,
                Width: "100%-" + (40 + SphereOffset) + "px",
                Height: Element.Height - 60,
                Parent: TimelineName + '-Container',
                Responsive: {
                    On: true,
                    Queries: [
                        {
                            On: true,
                            maxWidth: 700,
                            Width: "100%-30px",
                            X: 15
                        }
                    ]
                }
            },
            Text: {
                On: true,
                Size: 14,
                Font: "Roboto,Georgia",
                Center: false,
                Align: "left",
                Padding: 0,
                Value: data.Data.Description
            },
            WrapText: {
                On: true
            }
        }
    }));

    Container.add(new ContainerElement_TextBox(TimelineName + '-Date', {
        Data: {
            Position: {
                X: 20 + xv,
                Y: "100%-5px",
                Width: 10,
                Height: 20,
                Parent: TimelineName + '-Container',
                Responsive: {
                    On: true,
                    Queries: [
                        {
                            On: true,
                            maxWidth: 700,
                            X: 15
                        }
                    ]
                }
            },
            Text: {
                On: true,
                Size: 12,
                Font: "Roboto,Georgia",
                Center: false,
                Align: "left",
                Padding: 0,
                Value: data.Data.Date,
                Opacity: 0.65
            }
        }
    }));

    Container.add(new ContainerElement_PictureBox(TimelineName + '-Picture', {
        Data: {
            Position: {
                X: ((OffsetID % 2 === 1) ? 0 : "100%"),
                Y: Element.Height / 2,
                Width: 200,
                Height: 200,
                Centered: true,
                Parent: TimelineName + '-Container',
                Responsive: {
                    On: true,
                    Queries: [
                        {
                            On: true,
                            maxWidth: 700,
                            Y: "100%-" + (Element.Height / 2 + 15) + "px",
                            X: 0,
                            CenterOffset: "X"

                        }
                    ]
                }
            },
            Image: {
                On: true,
                Circle: true,
                Sources: data.Data.Images
            }
        }
    }));

    /**
     * Does this element have buttons? If so we need the load those too.
     */
    if (typeof data.Data.Buttons !== 'undefined') {
        for (var i = 0; i < data.Data.Buttons.length; i++) {
            var e = data.Data.Buttons[i];
            var btnName = TimelineName + '-Button-' + i;

            Container.add(new ContainerElement_TextBox(btnName, {
                Data: {
                    Position: {
                        X: ((OffsetID % 2 === 1) ? "100%-" + (40 * (i + 1)) + "px" : (40 * i)),
                        Y: "100%",
                        Width: 40,
                        Height: 40,
                        Centered: false,
                        Parent: TimelineName + '-Container',
                        Responsive: {
                            On: true,
                            Queries: [
                                {
                                    On: true,
                                    maxWidth: 700,
                                    X: (40 * i)
                                }
                            ]
                        }
                    },
                    Text: {
                        On: true,
                        Value: e.Name,
                        Font: 'Roboto,Georgia',
                        Size: 12,
                        Colour: 'white',
                        LetterSpacing: true
                    },
                    Hover: {
                        On: true
                    },
                    Fill: {
                        On: true,
                        Colour: 'rgb(50,50,50)',
                        Hover: 'rgb(0,0,0)',
                        Pressed: 'rgb(0,0,0)',
                        Opacity: 0.25
                    }
                },
                Events: {
                    onRelease: [
                        {
                            Function: "OpenURL",
                            Parameters: [
                                e.URL
                            ]
                        }
                    ]
                }
            }));
        }
    }
}
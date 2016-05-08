Container.add(new ContainerElement('containerTitle', {
    Data: {
        Position: {
            X: 0,
            Y: 200,
            Width: 400,
            Height: 150,
            CenterOffset: "X",
            Centered: true,
            Responsive: {
                On: true,
                Queries: [
                    {
                        On: true,
                        maxWidth: 400,
                        Width: "100%"
                    }
                ]
            }
        },
        Fill: {
            On: false,
            Opacity: 0.5
        }
    }
}));

Container.add(new ContainerElement_TextBox('textTitleHelloWorld', {
    Data: {
        Position: {
            X: 0,
            Y: -30,
            Width: 400,
            Height: 15,
            CenterOffset: true,
            Centered: true,
            Parent: "containerTitle"
        },
        Text: {
            On: true,
            Value: 'Hello World',
            Size: 62,
            Colour: 'white'
        }
    }
}));

Container.add(new ContainerElement_TextBox('textTitleDescription', {
    Data: {
        Position: {
            X: 0,
            Y: 20,
            Width: 400,
            Height: 100,
            CenterOffset: true,
            Centered: true,
            Parent: 'containerTitle'
        },
        Text: {
            On: true,
            Value: 'loading...',
            Font: 'Roboto,Georgia',
            Size: 16,
            Colour: 'white',
            LetterSpacing: true
        }
    }
}));
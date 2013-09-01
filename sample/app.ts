///<Reference path="../uifx/Application.ts" />
///<Reference path="Carousel.ts" />
module sample {
    class App extends uifx.Application {
        constructor() {
            super({});
        }

        initialize() {
            this.addComponent('.carousel', Carousel);
            super.initialize();
        }

        getTemplateData() {
        }
    }


    var app = window['sampleApp'] = new App();
    app.initialize();

}
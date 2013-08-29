///<Reference path="../uifx/Application.ts" />
module sample {
    class App extends uifx.Application {
        constructor() {
            super({
                '.kiwi': [{
                    event: 'click',
                    handler: this.onKiwiClick,
                    capture: true
                }]
            });
        }

        onKiwiClick(e: Event): any {
            e.preventDefault();
            document.body.appendChild(document.createTextNode("kiwi "));
            return false;
        }
    }

    var app = window['sampleApp'] = new App();
    app.initialize();

}
///<Reference path="../uifx/Application.ts" />
module sample {
    class App extends uifx.Application {
        constructor() {
            super({
                '.kiwi': [{
                    event: 'mouseMove',
                    handler: this.onKiwiMouseMove
                }]
            });
        }

        onKiwiMouseMove(any: any): any {
            document.write('kiwi ');
        }
    }

    var app = window['sampleApp'] = new App();
    app.initialize();

}
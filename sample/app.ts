///<Reference path="../uifx/Application.ts" />
///<Reference path="../externals/mustache.ts/mustache.ts/mustache.ts" />
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

    class Carousel extends uifx.Component {
        private slide = 0;

        constructor(el: Element) {
            super(el, Mustache.compile('<ul class="carousel-item-list">{{#.}}<li class="carousel-item"><img class="carousel-item-image" src="{{img}}" /><span class="carousel-item-heading">{{heading}}</span></li>{{/.}}</ul>'), {});
        }

        nextSlide() {
        }

        getTemplateData() {
            return [{
                img: 'img1.jpg',
                heading: 'Image heading 1'
            }, {
                img: 'img2.jpg',
                heading: 'Image heading 2'
            }];
        }
    }

    var app = window['sampleApp'] = new App();
    app.initialize();

}
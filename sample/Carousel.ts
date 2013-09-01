///<Reference path="../externals/mustache.ts/mustache.ts/mustache.ts" />
///<Reference path="Carousel.tpl.ts" />
module sample {
    export class Carousel extends uifx.Component {
        private slide = 0;

        private static handlers = {
            '.carousel-item-list': [{
                event: 'click',
                handler: c => c.nextSlide
            }]
        };

        constructor(el: Element) {
            super(el, Mustache.compile(carouselTemplate), Carousel.handlers);
        }

        nextSlide() {
            this.slide = (this.slide + 1) % 5;
            (<HTMLElement>this.el.firstElementChild).style.left = -(this.slide * 100) + '%';
        }

        getTemplateData() {
            return [{
                img: 'img1.jpg',
                heading: 'Image heading 1'
            }, {
                img: 'img2.jpg',
                heading: 'Image heading 2'
            }, {
                img: 'img3.jpg',
                heading: 'Image heading 3'
            }, {
                img: 'img4.jpg',
                heading: 'Image heading 4'
            }, {
                img: 'img5.jpg',
                heading: 'Image heading 5'
            }];
        }
    }
}
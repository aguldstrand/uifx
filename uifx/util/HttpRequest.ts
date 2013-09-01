module uifx.util {
    export class HttpRequest {

        private xhr: any;

        constructor() {
            this.xhr = HttpRequest.getXhr();
        }

        private static getXhr():XMLHttpRequest { /* returns cross-browser XMLHttpRequest, or null if unable */
            try {
                return new XMLHttpRequest();
            } catch (e) { }
            try {
                return new ActiveXObject("Msxml3.XMLHTTP");
            } catch (e) { }
            try {
                return new ActiveXObject("Msxml2.XMLHTTP.6.0");
            } catch (e) { }
            try {
                return new ActiveXObject("Msxml2.XMLHTTP.3.0");
            } catch (e) { }
            try {
                return new ActiveXObject("Msxml2.XMLHTTP");
            } catch (e) { }
            try {
                return new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) { }
            return null;
        }
    }
}
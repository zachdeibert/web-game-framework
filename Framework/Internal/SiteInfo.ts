namespace Framework.Internal {
    import EventDispatcher = Framework.EventDispatcher;

    export class SiteInfo extends EventDispatcher {
        private xmlhttp: XMLHttpRequest;
        public title: string;

        public pull(): void {
            this.xmlhttp.send();
        }

        public constructor() {
            super();
            if ( window.hasOwnProperty("XMLHttpRequest") ) {
                this.xmlhttp = new XMLHttpRequest();
            } else if ( window.hasOwnProperty("ActiveXObject") ) {
                this.xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            } else {
                throw new LoadError("Unable to find XMLHttpRequest class");
            }
            this.xmlhttp.open("GET", "site.json", true);
            this.xmlhttp.addEventListener("readystatechange", () => {
                if ( this.xmlhttp.readyState == 4 ) {
                    if ( this.xmlhttp.status == 200 ) {
                        let json = JSON.parse(this.xmlhttp.responseText);
                        this.title = json.title;
                        this.dispatchEvent(new Event("load"));
                    } else {
                        throw new LoadError("Unable to get site information");
                    }
                }
            });
        }
    }
}

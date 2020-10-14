import { Func } from 'Base';
let func = new Func();

function AppLibrary() {
    let self = {};

    self.makeWebapp = (callback = () => { }) => {
        document.addEventListener('click', event => {
            let anchor = event.target;
            let parentAnchor = event.target.getParents('a');
            let url = anchor.getAttribute('href');//check when a url is about to be open

            if (anchor.nodeName.toLowerCase() != 'a' && !func.isnull(parentAnchor)) {
                anchor = parentAnchor;
            }

            if (func.isnull(url) && !func.isnull(parentAnchor)) {
                anchor = parentAnchor;
            }
            //get the anchor element
            url = anchor.getAttribute('href');
            let target = anchor.getAttribute('target');

            if (target == '_blank') {//check if it is for new page
                window.open(func.prepareUrl(url));
            }
            else if (!func.isnull(url)) {
                event.preventDefault();//block and open inside as webapp
                if (func.prepareUrl(url) != location.href) window.history.pushState('page', 'title', url);
                callback();
            }
        });

        window.onpopstate = callback;
    }

    self.prepareUrl = (url = '') => {
        if (!url.includes(location.origin)) {
            let splitUrl = func.urlSplitter(url);
            if (splitUrl.location == location.origin) {
                url = location.origin + '/' + url;
            }
        }
        else if (!url.includes(location.protocol)) {
            url = location.protocol + '//' + url;
        }

        return url;
    }

    self.ajax = (params = { async: true, data: {}, url: '', method: '', secured: false }) => {
        params.async = params.async || true;
        params.data = params.data || {};
        params.url = params.url || './';
        params.method = params.method || 'POST';
        params.secured = params.secured || false;

        if (params.secured) {
            params.url = 'https://cors-anywhere.herokuapp.com/' + params.url;
        }

        let data = new FormData();
        if (params.data instanceof FormData) {
            data = params.data;
        }
        else {
            for (let i in params.data) {
                data.append(i, params.data[i]);
            }
        }

        return new Promise((resolve, reject) => {
            var request = new XMLHttpRequest();

            request.onreadystatechange = function (event) {
                if (this.readyState == 4 && this.status == 200) {
                    resolve(request.responseText);
                }
            };

            if (func.isset(params.onprogress)) {
                request.upload.onprogress = (event) => {
                    params.onprogress((event.loaded / event.total) * 50);
                }

                request.onprogress = (event) => {
                    params.onprogress((event.loaded / event.total) * 100);
                }
            }

            request.onerror = (error) => {
                reject(error);
            };

            request.open(params.method, params.url, params.async);
            request.send(data);
        });
    }

    return self;
}

export { AppLibrary };
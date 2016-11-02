#!/usr/local/bin/phantomjs

// based on https://gist.github.com/antivanov/3848638
// and Phil's version of netsniffer
// 
//PhantomJS http://phantomjs.org/ based web crawler Anton Ivanov anton.al.ivanov@gmail.com 2012
//UPDATE: This gist has been made into a Node.js module and now can be installed with "npm install js-crawler"
//the Node.js version does not use Phantom.JS, but the API available to the client is similar to the present gist

(function(host) {

    if (!Date.prototype.toISOString) {
        Date.prototype.toISOString = function () {
            function pad(n) { return n < 10 ? '0' + n : n; }
            function ms(n) { return n < 10 ? '00'+ n : n < 100 ? '0' + n : n; }
            return this.getFullYear() + '-' +
                pad(this.getMonth() + 1) + '-' +
                pad(this.getDate()) + 'T' +
                pad(this.getHours()) + ':' +
                pad(this.getMinutes()) + ':' +
                pad(this.getSeconds()) + '.' +
                ms(this.getMilliseconds()) + 'Z';
        };
    }

    function Crawler() {
        this.openedURLs = {};
        this.visitedURLs = {};
        this.domain = '';
        this.protocol = '';
        this.resourceTimeout = 10000;
        this.jitter = 1000;
    }
    
    Crawler.webpage = require('webpage');

    Crawler.prototype.resourceSizes = function(resources) {
        var resourceTotalSize = 0;
        var resourceList = [];

        resources.forEach(function (resource) {
            var request = resource.request,
                startReply = resource.startReply,
                endReply = resource.endReply;

            if (!request || !startReply || !endReply) {
                return;
            }

            resourceTotalSize += startReply.bodySize;
            resourceList.push({
                url:  request.url,
                size: startReply.bodySize,
                time: endReply.time - startReply.time,
                type: endReply.contentType
            });
        });

        // sort the resources by size descending
        resouceList = resourceList.sort(function(a, b) {
            if (a.size > b.size) {
                return -1;
            }
            if (a.size < b.size) {
                return 1;
            }
            return 0;
        });

        return {
            totalResourceSize: resourceTotalSize,
            resourceList: resourceList
        };
    };

    Crawler.prototype.inDomain = function(url) {
        var getDomain = function(url) {
            // http://stackoverflow.com/a/23945027/5729027
            var domain;
            // find & remove protocol (http, ftp, etc.) and get domain
            if (url.indexOf("://") > -1 || url.indexOf('//') === 0) {
                domain = url.split('/')[2];
            }
            // remove port
            domain = domain.split(':')[0];
            return domain;
        };
        if (this.domain === '') {
            this.domain = getDomain(url);
            this.protocol = url.split(':')[0];
            return true;
        }
        if (url.indexOf('/') === 0 && url.indexOf('//') !== 0) {
            return true;
        }
        if (url.indexOf('http') === 0) {
            return (this.domain === getDomain(url));
        }
        return false;
    };

    // number of pages started but not finished
    Crawler.prototype.urlsTodo = function() {
        var self = this;
        return (Object.keys(self.visitedURLs).length - 
                    Object.keys(self.visitedURLs).filter(function (key) {
                        return self.visitedURLs[key];
                    }).length);
    };

    Crawler.prototype.crawl = function (url, depth, onSuccess, onFailure) {
        var self = this;
        if (0 === depth) {
            return;
        }

        // remove the final /
        if (url.slice(-1) === '/') {
            url = url.slice(0, url.length - 1);
        }

        // add a protocol if needed
        if (url.indexOf('//') === 0) {
            url = this.protocol + ':' + url;
        }

        if (url.indexOf('http') !== 0) {
            if (url.indexOf('/') !== 0) {
                // can't deal with relative to current page yet
                return;
            }
            url = self.protocol + '://' + self.domain + url;
        }

        // chop off query params
        if (url.indexOf('?') > -1) {
            url = url.slice(0, url.indexOf('?'));
        }

        // chop off the hash
        if (url.indexOf('#') > -1) {
            url = url.slice(0, url.indexOf('#'));
        }

        // don't need to follow these down
        if (url.indexOf('.js') > -1) {
            return;
        }

        if (self.openedURLs[url] || !self.inDomain(url)) {
            return;
        }

        self.openedURLs[url] = true;
        self.visitedURLs[url] = false;

        var page = Crawler.webpage.create();
        page.settings.resourceTimeout = self.resourceTimeout;
        page.resources = [];

        page.onLoadStarted = function () {
            page.startTime = new Date();
        };

        page.onResourceRequested = function (req) {
            page.resources[req.id] = {
                request: req,
                startReply: null,
                endReply: null
            };
        };

        page.onResourceReceived = function (res) {
            if (res.stage === 'start') {
                page.resources[res.id].startReply = res;
            }
            if (res.stage === 'end') {
                page.resources[res.id].endReply = res;
            }
        };

        // stash all the JS errors
        page.onError = function(msg, trace) {
            var msgStack = ['ERROR: ' + msg];
            if (trace && trace.length) {
                msgStack.push('TRACE:');
                trace.forEach(function(t) {
                    msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function + '")' : ''));
                });
            }
        };

        page.open(url, function (status) {
            if ('fail' === status) { 
                onFailure({
                    url: url, 
                    status: status
                });
            } else {
                var documentHTML = page.evaluate(function () {
                    return document.body && document.body.innerHTML ? document.body.innerHTML : "";
                });

                page.title = page.evaluate(function () {
                    return document.title;
                });

                // get the size of the resources
                var resources = self.resourceSizes(page.resources);

                onSuccess({
                    url: url,
                    status: status,
                    content: documentHTML,
                    resources: resources
                });

                self.crawlURLs(self.getAllURLs(page), depth - 1, onSuccess, onFailure);
            }
            self.visitedURLs[url] = true;

            // are we done?
            if (self.urlsTodo() === 0) {
                phantom.exit(0);
            }
        });
    };

    Crawler.prototype.getAllURLs = function(page) {
        return page.evaluate(function () {
            return Array.prototype.slice.call(document.querySelectorAll("a"), 0)
                .map(function (link) {
                    return link.getAttribute("href");
                });
        });
    };

    Crawler.prototype.crawlURLs = function(urls, depth, onSuccess, onFailure) {
        var self = this;
        urls.filter(function (url) {
            return self.inDomain(url);
        }).forEach(function (url) {
            self.crawl(url, depth, onSuccess, onFailure);
            // slow things down
            setTimeout(function() {
                return true;
            }, Math.random()*self.jitter);
        });
    };

    host.Crawler = Crawler;
})(phantom);

var toMB = function(x) {
    return (x/1024/1024).toFixed(2);
};

var system = require('system');

if (system.args.length !== 3) {
    console.log('Usage: resource-crawler.js <some URL> <tree depth>');
    phantom.exit(1);
}
else {
    var url = system.args[1];
    var depth = system.args[2];
    new phantom.Crawler().crawl(url, depth, 
        function onSuccess(page) {
            var largest = page.resources.resourceList[0].url + ' ' + toMB(page.resources.resourceList[0].size) + 'M';
            console.log(page.url + ' ' + toMB(page.resources.totalResourceSize) + 'M ' + largest);
        }, 
        function onFailure(page) {
            console.log("Could not load page. URL = " +  page.url + " status = " + page.status);
        }
    );
}
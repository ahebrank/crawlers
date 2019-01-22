# Site crawlers

## resource-crawler.js

Crawl a site and check resource sizes.  Useful for e.g., identifying pages with big images.

Requires phantomjs.

### resource-crawler usage

Crawl a site (to interior depth 3)

```
phantomjs resource-crawler.js https://www.ysu.edu 3
```

Sort by largest resources (ascending order)

```
phantomjs resource-crawler.js https://www.ysu.edu 3 | sort -k4
```

Sort by total page weight:
```
phantomjs resource-crawler.js https://www.ysu.edu 3 | sort -k2
```

## old-links.js

Crawl a site and check links for references to an old site.

Requires phantomjs.

### old-links usage

Crawl www.ysu.edu to interior depth 3, checking for references to old-ysu.edu.

```
phantomjs old-links.js https://www.ysu.edu 3 https://old-ysu.edu
```

# Site crawlers

## resource-crawler.js

Crawl a site and check resource sizes.  Useful for e.g., identifying pages with big images.

Requires phantomjs.

### Usage

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


# github-url-detection [![][badge-gzip]][link-bundlephobia]

[badge-gzip]: https://img.shields.io/bundlephobia/minzip/github-url-detection.svg?label=gzipped
[link-bundlephobia]: https://bundlephobia.com/result?p=github-url-detection

> Which GitHub page are you on? Is it an issue? Is it a list? Perfect for your WebExtension or userscript.

Battle-tested by and extracted from the [Refined GitHub](https://github.com/sindresorhus/refined-github) extension.

## Install

```sh
npm install github-url-detection
```

```js
import * as pageDetect from 'github-url-detection';
```

```js
const pageDetect = require('github-url-detection');
```

## Usage

```js
if (pageDetect.isRepo()) {
	alert('You’re looking at a repo!')
}


if (pageDetect.isDiscussionList()) {
	alert('You’re looking at a issues and PRs list!')
}
```

In the source you can see the [full list of detections](https://www.unpkg.com/browse/github-url-detection@latest/esm/index.d.ts) and [their matching URLs.](https://github.com/fregante/github-url-detection/blob/master/source/index.ts)

Most tests are URL-based but a handful of them are DOM-based.

## License

MIT © [Federico Brigante](https://bfred.it)

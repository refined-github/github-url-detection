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
const href = 'https://github.com/fregante/github-url-detection/issues/1';
if (pageDetect.isIssue(new URL(href))) { // Pass the URL as an `URL` object
	alert('The passed URL is of an issue!')
}

if (pageDetect.isRepo()) { // Uses `window.location.href` by default
	alert('You’re looking at a repo!')
}

if (pageDetect.isDiscussionList()) {
	alert('You’re looking at a issues and PRs list!')
}
```

## API

In the source you can see the [full list of detections](https://www.unpkg.com/browse/github-url-detection@latest/esm/index.d.ts) and [their matching URLs.](https://github.com/fregante/github-url-detection/blob/master/source/index.ts)

Most detections are URL-based while others need access to the current `document`. You can determine which ones are URL-based by looking at their signature: URL-based functions have a `url` parameter.

### URL-based detections

By default, URL-based detections use the `location` global if you don't pass a `url` argument.

```js
if (pageDetect.isDiscussionList()) {
	alert('You’re looking at a issues or PRs list!')
}
```

```js
if (pageDetect.isDiscussionList(new URL('https://github.com/fregante/github-url-detection/pulls'))) {
	alert('You’re looking at a issues or PRs list!')
}
```

Notice that the `url` parameter is not a plain string but it has to be a proper `URL` or `location` object.

### Document-based detections

By default, `document`-based detections use the `document` global, which means they can only be used if you have the whole page, you can't just test any random URL string.


```js
if (pageDetect.isOrganizationProfile()) {
	alert('You’re on an organization profile, like https://github.com/babel')
}
```


## License

MIT © [Federico Brigante](https://bfred.it)

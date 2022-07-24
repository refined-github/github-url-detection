# <img width="438" align="right" src="https://user-images.githubusercontent.com/1402241/81425503-01b4d800-9158-11ea-9406-484a1ff37968.png"> github-url-detection

> Which GitHub page are you on? Is it an issue? Is it a list? Perfect for your WebExtension or userscript.

Battle-tested by and extracted from the [Refined GitHub](https://github.com/sindresorhus/refined-github) extension.

- Try the live [demo](https://refined-github.github.io/github-url-detection/)
- See the code and expected URLs for [every detection](https://github.com/refined-github/github-url-detection/blob/main/index.ts)

## Install

```sh
npm install github-url-detection
```

```js
// This package is pure ESM
import * as pageDetect from 'github-url-detection';
```

## Usage

```js
const href = 'https://github.com/refined-github/github-url-detection/issues/1';
if (pageDetect.isIssue(new URL(href))) { // Pass the URL as an `URL` object
	alert('The passed URL is of an issue!')
}

if (pageDetect.isRepo()) { // Uses `window.location.href` by default
	alert('You’re looking at a repo!')
}

if (pageDetect.isIssueOrPRList()) {
	alert('You’re looking at a issues and PRs list!')
}
```

## API

Most detections are URL-based while others need access to the current `document`. You can determine which ones are URL-based by looking at their signature: URL-based functions have a `url` parameter.

### URL-based detections

By default, URL-based detections use the `location` global if you don't pass a `url` argument.

```js
if (pageDetect.isIssueOrPRList()) {
	alert('You’re looking at a issues or PRs list!')
}
```

```js
if (pageDetect.isIssueOrPRList(new URL('https://github.com/refined-github/github-url-detection/pulls'))) {
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

## Related

- [github-reserved-names](https://github.com/Mottie/github-reserved-names) - Get a list, or check if a user or organization name is reserved by GitHub.
- [shorten-repo-url](https://github.com/fregante/shorten-repo-url) - Shorten GitHub links like GitHub shortens Issues and Commit links.

## License

MIT © [Federico Brigante](https://fregante.com)

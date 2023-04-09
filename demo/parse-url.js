export default function parseUrl(url) {
	try {
		return new URL(url, 'https://github.com');
	} catch {
		return false;
	}
}

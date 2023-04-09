export default function parseUrl(url, origin) {
	try {
		return new URL(url, origin);
	} catch {
		return false;
	}
}

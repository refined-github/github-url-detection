export default function parseUrl(url, origin) {
	if (!url) {
		return false;
	}

	try {
		return new URL(url, origin);
	} catch {
		return false;
	}
}

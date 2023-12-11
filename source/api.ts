export const defaults = {
	psetMessage: `Please follow project convention`,
	newCustomMessage:`Please follow project convention`
};

export const storage = {
	async get(): Promise<typeof defaults> {
		return new Promise(resolve => {
			chrome.storage.sync.get(defaults, options => {
				resolve(options as typeof defaults);
			});
		});
	},
	set(object: typeof defaults) {
		chrome.storage.sync.set(object);
	}
};

export function getSessionId(): string {
	const sfCookies = document?.cookie?.match("sid=([^;]*)") || []
	return sfCookies.length > 0 && sfCookies[1] ? sfCookies[1] : ''
}

export async function sf_fetch(url = '/services/data/v40.0/limits/') {
	const res = await fetch(url, { method: "GET", headers: { 'Authorization': 'Bearer ' + getSessionId() } })
	return res.json()
}

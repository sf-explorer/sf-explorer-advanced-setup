import { Connection } from "./force.min";

export const defaults: {
	newCustomMessage:string,
	showLastPSets?: boolean,
	psetMessage: string
}  = {
	psetMessage: `Please follow project convention`,
	newCustomMessage: `Please follow project convention`,
	showLastPSets: false,
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
		chrome.storage.sync.set(object)
	}
};

export function getSessionId(): string {
	const sfCookies = document?.cookie?.match("sid=([^;]*)") || []
	return sfCookies.length > 0 && sfCookies[1] ? sfCookies[1] : ''
}

async function getSession(sfHost: string): Promise<string | undefined> {
	let message = await new Promise<any>(resolve =>
		chrome.runtime.sendMessage({ message: "getSession", sfHost }, resolve)) // eslint-disable-line
	if (message) {
		return message.key
	}
	return
	
}

export async function jsforce(): Promise<Connection> {
	const sessionId = await getSession(window.location.host)
	return new (window as any).jsforce.Connection({
		instanceUrl: window.location.origin,
		accessToken: sessionId,
		version: '60.0',
	}) as any
}

export async function sf_fetch(url = '/services/data/v60.0/limits/') {
	const res = await fetch(url, { method: "GET" })
	return res.json()
}

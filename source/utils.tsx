import stringSimilarity from 'string-similarity-js';

export function toPascalCase(string: string) {
	return `${string}`
		.toLowerCase()
		.replace(new RegExp(/[-_]+/, 'g'), ' ')
		.replace(new RegExp(/[^\w\s]/, 'g'), '')
		.replace(
			new RegExp(/\s+(.)(\w*)/, 'g'),
			(_, $2, $3) => `${$2.toUpperCase() + $3}`
		)
		.replace(new RegExp(/\w/), s => s.toUpperCase());
}

export interface Field {
	DeveloperName: string
}

export function showSimilarFields(name: string, fields: Field[]) {
	const similar = fields.map(field => {
		return {
			...field,
			similarity: stringSimilarity(name, field.DeveloperName)
		}
	}).filter(field => field.similarity > 0.6).sort((a, b) => b.similarity - a.similarity)
	return similar
}

// Helper function to wait for an element to be available
export function waitForElement(selector: () => Element | undefined, timeout = 5000): Promise<Element | undefined> {
	return new Promise((resolve) => {
		const startTime = Date.now()

		const checkElement = () => {
			const element = selector()
			if (element) {
				resolve(element)
				return
			}

			if (Date.now() - startTime > timeout) {
				console.warn('Element not found within timeout')
				resolve(undefined)
				return
			}

			setTimeout(checkElement, 100)
		}

		checkElement()
	})
}


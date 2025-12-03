import React from 'dom-chef';
import index from './index.json'
import { waitForElement } from './utils'

async function addObjectDescription(objectName: string) {
	const data = index.objects as any
	const obj = data[objectName]
	if (obj?.description) {
		// Wait for the Description label span to be available
		const descriptionLabel = await waitForElement(() =>
			Array.from(document.querySelectorAll('span.slds-form-element__label'))
				.find(span => span.textContent?.trim() === 'Description') as HTMLElement | undefined
		) as HTMLElement | undefined

		if (descriptionLabel) {
			// Add the description text after the label
			descriptionLabel.after(
				<div style={{ marginTop: '5px', padding: '10px', backgroundColor: '#f3f3f3', borderRadius: '4px' }}>
					{obj.description}
				</div>
			)
		}
	}
}

async function init(): Promise<void> {
	const pathName = window.location.pathname
	const match = pathName.match(/^\/lightning\/setup\/ObjectManager\/([^\/]+)\/Details\/view$/)
	const objectName = match ? match[1] : null
	
	if (objectName) {
		await addObjectDescription(objectName)
	}
}

void init();

// Listen for URL changes (for SPA navigation)
let lastUrl = location.href;
new MutationObserver(() => {
	const url = location.href;
	if (url !== lastUrl) {
		lastUrl = url;
		void init();
	}
}).observe(document, { subtree: true, childList: true });


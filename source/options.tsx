//import React from 'dom-chef';
import fitTextarea from 'fit-textarea';
import {storage, defaults} from './api';

const rulesConfiguration = document.querySelector<HTMLTextAreaElement>('#rulesConfiguration')!
const errorMessage = document.querySelector('#errorMessage')!

void restoreOptions();
document.addEventListener('input', updateOptions);

/* Native validation tooltips don't seem to work */
function setValidity(text: string | Node = ''): void {
	errorMessage.textContent = ''
	errorMessage.append(text)
}

function updateOptions(): void {
	setValidity()
	saveOptions()
}

function saveOptions(): void {
	//const previewField = document.querySelector<HTMLInputElement>('[name="filesPreview"]:checked')!;

	storage.set({
		psetMessage: defaults.psetMessage,
		rulesConfiguration: rulesConfiguration.value.trim() || defaults.rulesConfiguration,
	})
}

async function restoreOptions(): Promise<void> {
	const items = await storage.get()
	//const previewField = document.querySelector<HTMLInputElement>(`[name="filesPreview"][value="${String(items.filesPreview)}"]`)!;
	rulesConfiguration.value = items.rulesConfiguration
	//previewField.checked = true;

	fitTextarea.watch(rulesConfiguration)
}

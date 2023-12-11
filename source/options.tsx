//import React from 'dom-chef';
import fitTextarea from 'fit-textarea';
import {storage, defaults} from './api';

const newCustomMessage = document.querySelector<HTMLTextAreaElement>('#newCustomMessage')!
const psetMessage = document.querySelector<HTMLTextAreaElement>('#psetMessage')!
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
		psetMessage: psetMessage.value.trim() || defaults.psetMessage,
		newCustomMessage: newCustomMessage.value.trim() || defaults.newCustomMessage,
	})
}

async function restoreOptions(): Promise<void> {
	const items = await storage.get()
	//const previewField = document.querySelector<HTMLInputElement>(`[name="filesPreview"][value="${String(items.filesPreview)}"]`)!;
	psetMessage.value = items.psetMessage
	newCustomMessage.value = items.newCustomMessage
	//previewField.checked = true;

	fitTextarea.watch(psetMessage)
}

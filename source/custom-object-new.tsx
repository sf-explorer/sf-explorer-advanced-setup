import React from 'dom-chef';
import select from 'select-dom';
import { storage } from './api'

function updateUINewObject(settings: any): void {
	const masterLabelInput = select.all("[id='MasterLabel']")
	const descriptionTextArea = select.last("[id='Description']")
	const title = select.all("[id='head_1_ep']")
	title[0]?.after(
		<p className="brandTertiaryBgr first pbSubheader tertiaryPalette" style={{ padding: '10px' }}>{settings.newCustomMessage}</p>
	)
	if (masterLabelInput.length === 1 && masterLabelInput[0]) {
	}

	descriptionTextArea?.setAttribute('placeholder', 'Please provide a description, otherwise you will not be able to promote this metadata!')
}

async function init(): Promise<void> {
	const settings = await storage.get()
	updateUINewObject(settings)
}

void init();


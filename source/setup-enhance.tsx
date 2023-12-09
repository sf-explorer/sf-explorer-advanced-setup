//import React from 'dom-chef';
import select from 'select-dom';
//import elementReady from 'element-ready';

import { storage } from './api';

function updateUI(settings: any): void {
	
	const desc = select.all("[id*=':description']")
	

	console.log("description", desc)
	if (desc.length === 1 && desc[0]) {
		/*desc[0].before(
			<input checked type="checkbox" id="HFT" className="hide-files-toggle" />
		);*/
		var val = desc[0] as any
		val.value = settings.hideRegExp
		/*sf_fetch().then(res=>{
			console.log(res)
			val.value = JSON.stringify(res)
		})*/
		//desc.val("Please follow DA convention for PSet naming!");
	}
	
}

async function init(): Promise<void> {
	const settings = await storage.get();
	updateUI(settings);
}

void init();

import React from 'dom-chef';
import select from 'select-dom';
//import elementReady from 'element-ready';

import { storage } from './api';

function updateUINewPset(settings: any): void {

	const desc = select.all("[id*=':description']")
	const title = select.all("[class='pbHeader']")
	title[0]?.after(
		<p className="pbSubheader brandTertiaryBgr first tertiaryPalette" style={{marginBottom: '10px', padding: '10px'}}>{settings.psetMessage}</p>
	)

	console.log("description", desc)
	if (desc.length === 1 && desc[0]) {
		/*desc[0].before(
			<input checked type="checkbox" id="HFT" className="hide-files-toggle" />
		);*/
		//var val = desc[0] as any
		//val.value = settings.psetMessage
		/*sf_fetch().then(res=>{
			console.log(res)
			val.value = JSON.stringify(res)
		})*/
		//desc.val("Please follow DA convention for PSet naming!");
	}
}

function updateUINewObject(settings: any): void {

	const masterLabelInput = select.all("[id='MasterLabel']")
	const descriptionTextArea = select.all("[id='Description']")
	const title = select.all("[id='head_1_ep']")
	title[0]?.after(
		<p className="brandTertiaryBgr first pbSubheader tertiaryPalette" style={{backgroundColor: 'blue', padding: '10px'}}>{settings.newCustomMessage}</p>
	)
	// id: head_1_ep sub title
	console.log("masterLabel", masterLabelInput)
	if (masterLabelInput.length === 1 && masterLabelInput[0]) {

		//var val = masterLabelInput[0] as any
		//val.value = settings.hideRegExp
		/*sf_fetch().then(res=>{
			console.log(res)
			val.value = JSON.stringify(res)
		})*/
		//desc.val("Please follow DA convention for PSet naming!");
	}

	if (descriptionTextArea.length === 1 && descriptionTextArea[0]) {

		//var val = descriptionTextArea[0] as any
		//val.value = settings.hideRegExp
		/*sf_fetch().then(res=>{
			console.log(res)
			val.value = JSON.stringify(res)
		})*/
		//desc.val("Please follow DA convention for PSet naming!");
	}

}

async function init(): Promise<void> {
	const settings = await storage.get();
	const pathName = window.location.pathname
	if (pathName.startsWith('/01I/')) {
		updateUINewObject(settings);
	} else if (pathName.indexOf('PermissionSet/newPermissionSet') > -1) {
		// /udd/PermissionSet/newPermissionSet.apexp
		updateUINewPset(settings)
	} else if (pathName.indexOf('/NewCustomFieldStageManager') > -1) {
		// https://cunning-moose-rkyt30-dev-ed.trailblaze.my.salesforce.com/p/setup/field/NewCustomFieldStageManager?isdtp=p1
	}



	//updateUINewPset

}

void init();

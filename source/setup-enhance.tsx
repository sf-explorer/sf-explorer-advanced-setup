import React from 'dom-chef';
import select from 'select-dom';
//import elementReady from 'element-ready';

import { jsforce, storage } from './api'

const handleClick = (open: boolean, settings: any) => () => {
	storage.set({
		...settings,
		showLastPSets: open,
	})
}

function updateUINewPset(settings: any): void {
	const lastModified = (
		<div className="header">
			<button className="btn-link" onClick={handleClick(true, settings)}>
				Show Last Modified
			</button>
			<button className="btn-link" onClick={handleClick(false, settings)}>
				Close
			</button>
		</div>
	);

	const desc = select.last("[id*=':description']")
	const title = select.all("[class='pbHeader']")
	desc?.setAttribute('placeholder', 'Please provide a description, otherwise you will not be able to promote this metadata!')

	if (settings.showLastPSets) {
		jsforce().then(conn => conn.query(`Select Name, LastModifiedBy.Name, Description from PermissionSet
		 where IsOwnedByProfile = false and NamespacePrefix = '' 
		order by lastmodifieddate desc limit 10`).then((res: any) => {
			title[0]?.after(
				<div>
					<p
						className="pbSubheader brandTertiaryBgr first tertiaryPalette"
						style={{ marginBottom: '10px', padding: '10px' }}>
						Last Modified Permission Sets
					</p>
					<table>
						<th>Name</th><th>User</th><th>Description</th>{res.records.map((pset: any) => <tr>
							<td>{pset.Name}</td>
							<td>{pset.LastModifiedBy?.Name || ''}</td>
							<td>{pset.Description || ''}</td>
						</tr>)}
					</table>
				</div>
			)
		}).catch((e: any) => {
			console.error(e)
		}))
	}
	title[0]?.after(
		<p className="pbSubheader brandTertiaryBgr first tertiaryPalette" style={{ marginBottom: '10px', padding: '10px' }}>{settings.psetMessage}</p>
	)
	title[0]?.after(lastModified)
}

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
	const pathName = window.location.pathname
	if (pathName.startsWith('/01I/')) {
		updateUINewObject(settings);
	} else if (pathName.indexOf('PermissionSet/newPermissionSet') > -1) {
		// /udd/PermissionSet/newPermissionSet.apexp
		updateUINewPset(settings)
	} else if (pathName.indexOf('/NewCustomFieldStageManager') > -1) {
		// https://cunning-moose-rkyt30-dev-ed.trailblaze.my.salesforce.com/p/setup/field/NewCustomFieldStageManager?isdtp=p1
	}

}

void init();

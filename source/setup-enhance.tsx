import React from 'dom-chef';
import select from 'select-dom';
//import elementReady from 'element-ready';

import { jsforce, storage } from './api'
import stringSimilarity from 'string-similarity-js';

const handleClick = (open: boolean, settings: any) => () => {
	storage.set({
		...settings,
		showLastPSets: open,
	})
}

function toPascalCase(string: string) {
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

const lastModified = (settings: any) => (
	<div className="header">
		<button className="btn-link" onClick={handleClick(true, settings)}>
			Show Last Modified
		</button>
		<button className="btn-link" onClick={handleClick(false, settings)}>
			Close
		</button>
	</div>
)

async function updateUINewPset(settings: any) {


	const desc = select.last("[id*=':description']")
	const title = select.all("[class='pbHeader']")
	desc?.setAttribute('placeholder', 'Please provide a description, otherwise you will not be able to promote this metadata!')

	if (settings.showLastPSets) {
		const conn = await jsforce()
		try {
			const res = await conn.query(`Select Name, LastModifiedBy.Name, Description from PermissionSet
		 where IsOwnedByProfile = false and NamespacePrefix = '' 
		order by lastmodifieddate desc limit 10`)
			title[0]?.after(
				<div>
					<p
						className="pbSubheader brandTertiaryBgr first tertiaryPalette"
						style={{ marginBottom: '10px', padding: '10px' }}>
						Last Modified Permission Sets
					</p>
					<table className="list" style={{ border: 0, borderSpacing: 0, width: '100%' }}>
						<tbody>
							<tr className="headerRow">
								<th scope="col" className="zen-deemphasize">Name</th>
								<th scope="col" className="zen-deemphasize">User</th>
								<th scope="col" className="zen-deemphasize">Description</th>
							</tr>
							{res.records.map((pset: any) => <tr>
								<td>{pset.Name}</td>
								<td>{pset.LastModifiedBy?.Name || ''}</td>
								<td>{pset.Description || ''}</td>
							</tr>)}
						</tbody>
					</table>
				</div>)

		} catch (e) {
			console.error(e)
		}
	}
	title[0]?.after(
		<p className="pbSubheader brandTertiaryBgr first tertiaryPalette" style={{ marginBottom: '10px', padding: '10px' }}>{settings.psetMessage}</p>
	)
	title[0]?.after(lastModified(settings))
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

interface Field {
	DeveloperName: string
}

function showSimilarFields(name: string, fields: Field[]) {
	const similar = fields.map(field => {
		return {
			...field,
			similarity: stringSimilarity(name, field.DeveloperName)
		}
	}).filter(field => field.similarity > 0.6).sort((a, b) => b.similarity - a.similarity)
	return similar

}

async function updateUINewField(settings: any) {
	const masterLabelInput: HTMLInputElement | undefined = select.last("[id='MasterLabel']")
	const apiNameInput: HTMLInputElement | undefined = select.last("[id='DeveloperName']")
	const descriptionTextArea = select.last("[id='Description']")
	const inlineHelpTextTextArea = select.last("[id='InlineHelpText']")

	const stage = select.last("[id='currentStage']")?.getAttribute("value")

	const title = select.all("[class='pbWizardHeader']")
	title[0]?.after(
		<p className="brandTertiaryBgr first pbSubheader tertiaryPalette" style={{ padding: '10px' }}>{settings.newCustomMessage}</p>
	)

	apiNameInput?.setAttribute('placeholder', 'PascalCase and in English')
	descriptionTextArea?.setAttribute('placeholder', 'Please provide a description, otherwise you will not be able to promote this metadata!')

	if (stage === '0') return

	const entityInput = select.last("[id='entity']")
	const entityId = entityInput?.getAttribute('value')
	if (!entityId) return

	const force = await jsforce()
	const res = await force.tooling.query(`SELECT DeveloperName, Label, DataType, Description
		FROM FieldDefinition  where entityDefinition.DurableId = '${entityId}' order by LastModifiedDate desc limit 400 `)

	let data = stage === '1' ? res.records : []

	const fieldAPIName = apiNameInput?.value
	let message = `Here are the last 5 modified Fields on this object (${data.length} fields in total)`
	if (fieldAPIName) {
		const similarFields = showSimilarFields(fieldAPIName, res.records)
		if (similarFields.length > 0) {
			message = `There are ${similarFields.length} similar field(s) on this object. Please double check you are not creating a duplicate`
			data = similarFields
		}
	}

	masterLabelInput?.addEventListener("blur", () => {
		const fieldAPIName = masterLabelInput?.value
		if (fieldAPIName) {
			if (apiNameInput) {
				apiNameInput.value = toPascalCase(fieldAPIName)
			}

			const similarFields = showSimilarFields(fieldAPIName, data)
			if (similarFields.length > 0) {
				inlineHelpTextTextArea?.setAttribute('placeholder',
					'We found ' + similarFields.length + ' fields: ' + similarFields.map(field => field.DeveloperName).join(', '))
			}
		}
	})

	data.length > 0 && title[0]?.after(
		<div>
			<p
				className="pbSubheader brandTertiaryBgr first tertiaryPalette"
				style={{ marginBottom: '10px', padding: '10px' }}>
				{message}
			</p>
			<table className="list" style={{ border: 0, borderSpacing: 0, width: '100%' }} >
				<tbody>
					<tr className="headerRow">
						<th scope="col" className="zen-deemphasize">API Name</th>
						<th scope="col" className="zen-deemphasize">Label</th>
						<th scope="col" className="zen-deemphasize">Type</th>
						<th scope="col" className="zen-deemphasize">Last User</th>
						<th scope="col" className="zen-deemphasize">Description</th>
					</tr>
					{data.slice(0, 5).map((pset: any) => <tr>
						<td>{pset.DeveloperName}</td>
						<td>{pset.Label}</td>
						<td>{pset.DataType}</td>
						<td>{pset.LastModifiedBy?.Name || ''}</td>
						<td>{pset.Description || ''}</td>
					</tr>)}
				</tbody>
			</table>
		</div>
	)
}
async function updateUIExistingField() {
	let params = (new URL(window.location.href)).searchParams
	let entityId = params.get("entityId")
	let variableId = window.location.pathname.replace('/', '')

	const force = await jsforce()
	const res = await force.tooling.query(`SELECT DeveloperName, Label, DataType, Description
		FROM FieldDefinition  where entityDefinition.DurableId = '${entityId}' order by LastModifiedDate desc limit 400 `)
	const resField = await force.tooling.query(`SELECT DeveloperName from CustomField where Id = '${variableId}' limit 1 `)

	const fieldAPIName = resField.records[0]?.DeveloperName
	if (!fieldAPIName) return
	const similarFields = showSimilarFields(fieldAPIName, res.records).filter(field => field.DeveloperName !== fieldAPIName)
	if (similarFields.length > 0) {
		const message = 'We found ' + similarFields.length + ' similar field(s): ' + similarFields.map(field => field.DeveloperName).join(', ')
		const title = select.all("[class='pbHeader']")
		title[0]?.after(
			<p className="brandTertiaryBgr first pbSubheader tertiaryPalette" style={{ padding: '10px' }}>
				{message}
			</p>
		)
	}
}

async function init(): Promise<void> {
	const settings = await storage.get()
	const pathName = window.location.pathname
	if (pathName.startsWith('/01I/')) {
		updateUINewObject(settings)
	} else if (pathName.indexOf('PermissionSet/newPermissionSet') > -1) {
		// /udd/PermissionSet/newPermissionSet.apexp
		updateUINewPset(settings)
	} else if (pathName.indexOf('/NewCustomFieldStageManager') > -1) {
		updateUINewField(settings)
		// https://cunning-moose-rkyt30-dev-ed.trailblaze.my.salesforce.com/p/setup/field/NewCustomFieldStageManager?isdtp=p1
	} else if (pathName.startsWith('/00N')) {
		console.log(pathName)
		updateUIExistingField()
		// https://cunning-moose-rkyt30-dev-ed.trailblaze.my.salesforce.com/p/setup/field/NewCustomFieldStageManager?isdtp=p1
	}

	//https://ndespres-231221-287-demo.my.salesforce.com/00NHo00000S55HR?=null&entityId=01IHo000002VEiu&retURL=%2Fsetup%2FObjectManager%2F01IHo000002VEiu%2FFieldsAndRelationships%2Fview&appLayout=setup&tour=&isdtp=p1&sfdcIFrameOrigin=https://ndespres-231221-287-demo.lightning.force.com&sfdcIFrameHost=web&nonce=6031cd09c88fb2c0aecaf2ffcbc43d8c9f98be5699abeddb6f17e0fa05683d16&ltn_app_id=06mHo000001U4o6IAC&clc=1

}

void init();

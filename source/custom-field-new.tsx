import React from 'dom-chef';
import select from 'select-dom';
import { jsforce, storage } from './api'
import { toPascalCase, showSimilarFields } from './utils'

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
	const res = await force.tooling.query<any>(`SELECT DeveloperName, Label, DataType, Description
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

async function init(): Promise<void> {
	const settings = await storage.get()
	await updateUINewField(settings)
}

void init();

// Listen for URL changes (for wizard navigation)
let lastUrl = location.href;
new MutationObserver(() => {
	const url = location.href;
	if (url !== lastUrl) {
		lastUrl = url;
		void init();
	}
}).observe(document, { subtree: true, childList: true });


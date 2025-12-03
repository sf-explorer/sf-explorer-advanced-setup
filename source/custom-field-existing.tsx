import React from 'dom-chef';
import select from 'select-dom';
import { jsforce } from './api'
import { showSimilarFields } from './utils'

async function updateUIExistingField() {
	let params = (new URL(window.location.href)).searchParams
	let entityId = params.get("entityId")
	let variableId = window.location.pathname.replace('/', '')

	const force = await jsforce()
	const res = await force.tooling.query<any>(`SELECT DeveloperName, Label, DataType, Description
		FROM FieldDefinition  where entityDefinition.DurableId = '${entityId}' order by LastModifiedDate desc limit 400 `)
	const resField = await force.tooling.query<any>(`SELECT DeveloperName from CustomField where Id = '${variableId}' limit 1 `)

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

void updateUIExistingField();


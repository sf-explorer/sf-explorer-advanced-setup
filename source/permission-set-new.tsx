import React from 'dom-chef';
import select from 'select-dom';
import { jsforce, storage } from './api'

const handleClick = (open: boolean, settings: any) => () => {
	storage.set({
		...settings,
		showLastPSets: open,
	})
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

async function init(): Promise<void> {
	const settings = await storage.get()
	await updateUINewPset(settings)
}

void init();


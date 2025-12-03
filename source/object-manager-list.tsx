import select from 'select-dom';
import index from './index.json'
import { waitForElement } from './utils'

let isPopulating = false;

async function populateObjectTableDescriptions() {
	if (isPopulating) {
		console.log('[Object Manager List] Already populating, skipping...')
		return
	}
	
	isPopulating = true
	const data = index.objects as any
	
	try {
		// Wait for table rows to be available (not just the tbody)
		await waitForElement(() => {
			const tbody = document.querySelector('tbody[data-aura-rendered-by]')
			const rows = tbody?.querySelectorAll('tr')
			// Wait until we have at least one row with actual data
			return (rows && rows.length > 0) ? tbody as Element : undefined
		}, 10000) // Increase timeout to 10 seconds for slow loading pages
		
		// Add a small delay to ensure all rows are rendered
		await new Promise(resolve => setTimeout(resolve, 500))
		
		// Select all table rows
		const rows = select.all('tbody[data-aura-rendered-by] tr')
		
		console.log(`[Object Manager List] Found ${rows.length} rows to populate descriptions`)
		
		rows.forEach((row: Element) => {
			// Get the object API name from the second column (td with uiOutputText)
			const apiNameCell = row.querySelector('td:nth-child(2) span.uiOutputText')
			const objectApiName = apiNameCell?.textContent?.trim()
			
			if (!objectApiName) return
			
			// Look up the description from index.json
			const obj = data[objectApiName]
			const description = obj?.description || ''
			
			// Find the 4th column (description column) and populate it
			const descriptionCell = row.querySelector('td:nth-child(4) span.uiOutputText')
			if (descriptionCell && description) {
				descriptionCell.textContent = description
				// Optionally add styling
				descriptionCell.setAttribute('style', 'color: #080707; font-style: italic;')
			}
		})
		
		console.log('[Object Manager List] Object descriptions populated successfully')
	} finally {
		isPopulating = false
	}
}

// Function to add a refresh button
function addRefreshButton() {
	// Find the header or search area where we can add the button
	const headerArea = document.querySelector('div.slds-page-header') || document.querySelector('div.onesetupSetupHeader')
	
	if (!headerArea || document.getElementById('sf-explorer-refresh-btn')) {
		return // Button already exists or no suitable location found
	}
	
	// Create the button
	const button = document.createElement('button')
	button.id = 'sf-explorer-refresh-btn'
	button.textContent = '🔄 Refresh Descriptions'
	button.title = 'Click to reload object descriptions after searching or filtering'
	button.style.cssText = `
		position: fixed;
		bottom: 20px;
		right: 20px;
		z-index: 9999;
		padding: 10px 16px;
		background: #0176d3;
		color: white;
		border: none;
		border-radius: 4px;
		font-size: 14px;
		font-weight: 600;
		cursor: pointer;
		box-shadow: 0 2px 8px rgba(0,0,0,0.2);
		transition: all 0.2s;
	`
	
	// Add hover effect
	button.addEventListener('mouseenter', () => {
		button.style.background = '#014486'
		button.style.transform = 'translateY(-2px)'
		button.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)'
	})
	
	button.addEventListener('mouseleave', () => {
		button.style.background = '#0176d3'
		button.style.transform = 'translateY(0)'
		button.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)'
	})
	
	// Add click handler
	button.addEventListener('click', async () => {
		button.textContent = '⏳ Loading...'
		button.disabled = true
		button.style.opacity = '0.7'
		
		await populateObjectTableDescriptions()
		
		button.textContent = '✓ Descriptions Updated!'
		setTimeout(() => {
			button.textContent = '🔄 Refresh Descriptions'
			button.disabled = false
			button.style.opacity = '1'
		}, 2000)
	})
	
	document.body.appendChild(button)
	console.log('[Object Manager List] Refresh button added')
}

// Initial population
void populateObjectTableDescriptions();

// Add the refresh button
setTimeout(addRefreshButton, 1000)

// Listen for URL changes (for pagination/filtering) - but debounce to avoid excessive calls
let lastUrl = location.href;
let debounceTimer: number | undefined;

new MutationObserver(() => {
	const url = location.href;
	if (url !== lastUrl) {
		lastUrl = url;
		
		// Clear previous timer
		if (debounceTimer) {
			clearTimeout(debounceTimer)
		}
		
		// Debounce: only run after 1 second of no URL changes
		debounceTimer = window.setTimeout(() => {
			void populateObjectTableDescriptions();
		}, 1000)
	}
}).observe(document, { subtree: true, childList: true });


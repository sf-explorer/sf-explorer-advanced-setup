# Salesforce Explorer - Enhanced Setup

[![Chrome Web Store Installs](https://img.shields.io/chrome-web-store/users/bfbpegnljabcaknhmlfejadihhcndmfi)](https://chromewebstore.google.com/detail/salesforce-explorer-enhan/bfbpegnljabcaknhmlfejadihhcndmfi)
[![Chrome Web Store Rating](https://img.shields.io/chrome-web-store/rating/bfbpegnljabcaknhmlfejadihhcndmfi)](https://chromewebstore.google.com/detail/salesforce-explorer-enhan/bfbpegnljabcaknhmlfejadihhcndmfi)
[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE.txt)

A Chrome/Edge extension that enhances your Salesforce setup experience with intelligent checks, best practices enforcement, and metadata insights. Ensure your team follows organizational standards and prevent common mistakes during metadata creation.

**Key Highlight**: Automatically adds official Salesforce object descriptions to Object Manager detail views, providing instant context and documentation for standard objects.

![Salesforce Setup Enhancement](/img/sf-explorer-setup.png)

## 🌟 Features

### Custom Messages & Guidelines
- **Custom Object Creation**: Display configurable messages when creating new custom objects
- **Permission Set Creation**: Show guidelines when creating new permission sets
- **Configurable Messages**: Customize all messages through the options page to match your organization's standards

### Smart Field Management
- **Duplicate Field Prevention**: Automatically detects potential duplicate fields based on similarity matching
- **Similar Field Detection**: Shows similar fields when opening or creating custom fields (60%+ similarity threshold)
- **Auto-conversion to PascalCase**: Automatically converts field API names to PascalCase format
- **Last Modified Fields**: Displays the 5 most recently modified fields on the object
- **Required Metadata**: Enforces description requirements for fields and objects

### Enhanced Metadata Insights
- **Object Descriptions**: Automatically adds official Salesforce object descriptions from the comprehensive object reference library when viewing Object Manager details
- **Last Modified Permission Sets**: View the 10 most recently modified permission sets when creating new ones
- **Field Context**: Shows field type, description, and last modified user information

### Developer Experience
- **Real-time Validation**: Instant feedback on metadata naming and duplicates
- **Smart Placeholders**: Helpful placeholder text guides users to follow best practices
- **SPA Navigation Support**: Works seamlessly with Salesforce Lightning's single-page application navigation

## 📦 Installation

### From Chrome Web Store
1. Visit the [Chrome Web Store](https://chromewebstore.google.com/detail/salesforce-explorer-enhan/bfbpegnljabcaknhmlfejadihhcndmfi)
2. Click "Add to Chrome" / "Add to Edge"
3. Grant necessary permissions when prompted

### From Source
1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/sf-explorer-advanced-setup.git
   cd sf-explorer-advanced-setup
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the extension:
   ```bash
   npm run build
   ```

4. Load in Chrome/Edge:
   - Open `chrome://extensions/` (or `edge://extensions/`)
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `distribution` folder

## 🔧 Development

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Scripts
```bash
# Build for production
npm run build

# Watch mode for development
npm run watch

# Run tests and linter
npm run test

# Create distribution zip
npm run zip
```

### Project Structure
```
sf-explorer-advanced-setup/
├── source/
│   ├── setup-enhance.tsx    # Main content script
│   ├── background.ts         # Service worker
│   ├── options.tsx           # Options page
│   ├── api.ts                # API utilities
│   ├── index.json            # Salesforce object reference
│   └── manifest.json         # Extension manifest
├── distribution/             # Built extension files
├── img/                      # Images and assets
└── package.json              # Dependencies and scripts
```

## ⚙️ Configuration

1. Click the extension icon in your browser
2. Select "Options"
3. Configure custom messages:
   - **New Custom Object Message**: Shown when creating new custom objects
   - **New Permission Set Message**: Shown when creating new permission sets
   - **New Custom Field Message**: Shown when creating new custom fields

Example messages:
- "Remember to follow the naming convention: `ModuleName_Purpose`"
- "All custom objects must have a description for promotion"
- "Check with the Design Authority before creating new objects"

## 🎯 Use Cases

### For Administrators
- Ensure developers follow naming conventions
- Prevent creation of duplicate fields
- Enforce metadata documentation requirements
- Maintain clean, organized metadata

### For Developers
- Discover existing fields before creating new ones
- Auto-format field names to PascalCase
- View recently modified metadata for context
- Get instant feedback on potential duplicates

### For Architects
- Enforce design standards across teams
- Reduce technical debt from duplicate fields
- Ensure metadata quality and documentation
- Maintain consistency across orgs

## 🔒 Permissions

This extension requires the following permissions:
- **storage**: Save user preferences and settings
- **cookies**: Access Salesforce session for API calls
- **host_permissions**: Access Salesforce domains (*.salesforce.com, *.force.com, etc.)

## 🛠️ Technology Stack

- **TypeScript**: Type-safe development
- **React**: UI components via dom-chef
- **Webpack**: Module bundling
- **JSForce**: Salesforce API integration
- **string-similarity-js**: Duplicate detection algorithm

## 📚 Dependencies

### Core
- `@sf-explorer/salesforce-object-reference`: Comprehensive Salesforce object documentation
- `string-similarity-js`: Field similarity matching
- `webext-dynamic-content-scripts`: Dynamic script injection

### UI/UX
- `dom-chef`: React-like JSX for DOM creation
- `select-dom`: Improved DOM selection
- `fit-textarea`: Auto-resizing textareas

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [License.txt](License.txt) file for details.

## 👤 Author

**Nicolas Despres**
- Email: ndespres@gmail.com
- GitHub: [@ndespres](https://github.com/ndespres)

## 🌐 Links

- [Chrome Web Store](https://chromewebstore.google.com/detail/salesforce-explorer-enhan/bfbpegnljabcaknhmlfejadihhcndmfi)
- [Documentation](https://sf-explorer.github.io/documentation/)
- [Report Issues](https://github.com/yourusername/sf-explorer-advanced-setup/issues)

## 🙏 Acknowledgments

- Built for the Salesforce community
- Inspired by the need for better metadata management
- Thanks to all contributors and users

## 📋 Changelog

### Version 0.0.6
- Added standard Salesforce object descriptions from object reference library
- Enhanced object detail view with contextual information
- Improved SPA navigation support
- Updated dependencies

### Earlier Versions
- Duplicate field detection
- Custom message configuration
- Permission set insights
- Field similarity matching
- PascalCase auto-conversion 

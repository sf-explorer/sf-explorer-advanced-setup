const PSetExample = `### For Object/Field pern sets,
Start with the Object Name, and with the CRUD access provided, and anything special goes in the middle. Like this:

* Account - (R/C/E)
* Case - (R)
* Case - Delete Access - No Fields - (R/C/E/D)
* Contact - General Access - (R/E)
* Contact - Sensitive Fields Only - (R)

### For System Permissions
Start each Perm Set with SYS so that their grouped together:
* SYS - Reports
* SYS - Dashboards
* SYS - View Setup

### For App access
Start with APP:
* APP - Sales App
* APP - Service App

### For Tabs:
* TAB - Accounts Tab
* TAB - Tasks Tab

### For Apex Class access:
* APEX - Account LWC Controller
* APEX - Case Invocable Actions`

const JSDocExample = `
Here is an example
\`\`\`js
import { LightningElement, api } from 'lwc';

/**
 * Liste des contrats
 * @author "Nicolas Despres"
 * @see "Onglet Equipement" https://jira.atlassian.net/browse/XCC-71
 * @param contract string 
 */
export default class socle360EquipementDetailContrat extends LightningElement {

    @api
    contract
}
\`\`\`
`

const ApexExample = `
\`\`\`js
/** 
 * BoatDataService exposes utilities to manipulate data related to boat
 * @author "John Doe"
 * @date 25/04/2023
**/
public with sharing class BoatDataService {

    public static final String LENGTH_TYPE = 'Length'; 
    public static final String PRICE_TYPE = 'Price'; 
    public static final String TYPE_TYPE = 'Type'; 

    @AuraEnabled(cacheable=true)
    public static List<Boat__c> getBoats(String boatTypeId) {
        // Without an explicit boatTypeId, the full list is desired
        String query = 'SELECT '
                     + 'Name, Description__c, Geolocation__Latitude__s, '
                     + 'Geolocation__Longitude__s, Picture__c, Contact__r.Name, '
                     + 'BoatType__c, BoatType__r.Name, Length__c, Price__c '
                     + 'FROM Boat__c';
        if (String.isNotBlank(boatTypeId)) {
            query += ' WHERE BoatType__c = :boatTypeId';
        }
        query += ' WITH SECURITY_ENFORCED ';
        return Database.query(query);
    }
}
\`\`\`
`
export const rules = [
    {
        sObject: "EntityDefinition",
        field: "Description",
        relatedFields: ["QualifiedApiName"],
        message: "Description is required",
        tooling: true,
        when: "QualifiedApiName like '%__c' and IsCustomizable = true",
        goodExample: "InsurancePolicy",
        badExample: 'Insurance_Policy',
    },
    {
        sObject: "EntityDefinition",
        field: "qualifiedApiName",
        when: "QualifiedApiName like '%__c' and IsCustomizable = true",
        condition: "IsCustomizable = true",
        regex: "^[A-Z][A-Za-z]*$",
        message: "QualifiedApiName must be PascalCase"
    },
    {
        sObject: "CustomField",
        relatedFields: ["entityDefinition.QualifiedApiName"],
        field: "DeveloperName",
        regex: "^[A-Z][A-Za-z]*$",
        message: "CustomFields must have a description. If you lack imagination, use SF Explorer ChatGPT native integration to generate it!",
        tooling: true,
        goodExample: "PhoneNumber",
        badExample: 'Phone_Number',

    },
    {
        sObject: "CustomField",
        relatedFields: ["entityDefinition.QualifiedApiName"],
        field: "Description",
        tooling: true,
        message: "Custom Fields must have a Description"
    },
    {
        sObject: "Flow",
        field: "Description",
        tooling: true,
        message: "Flow Description is required"
    },
    {
        sObject: "Flow",
        field: "MasterLabel",
        tooling: true,
        message: `**Screen Flow:** <Short Yet Meaningful Description>

        **Autolaunched Flow:**
        - Users or Apps: <Verb(s)><Optional Noun Set>
        - Flow Trigger: <Object Name> Before Handler
        - Scheduled: <Short Process Description>`,
        badExample: `Send reminder – Not enough information; principal words not capitalized`,
        goodExample: `Screen Flow: Reschedule Order Delivery

        Autolaunched Flow:
        - Users or Apps: Add Default Opportunity Team Members
        - Flow Trigger: Case Before Handler
        - Scheduled: Remind Opportunity Owners`
    },
    {
        sObject: "PermissionSet",
        field: "Description",
        relatedFields: ["Name"],
        when: "IsOwnedByProfile = false and NamespacePrefix = null",
        message: "Description is required",
    },
    {
        sObject: "PermissionSet",
        field: "Name",
        when: "IsOwnedByProfile = false and NamespacePrefix = null",
        message: "Name is required",
        goodExample: PSetExample,
    },
    {
        sObject: "LightningComponentResource",
        field: "Source",
        tooling: true,
        relatedFields: ["FilePath"],
        when: "Format = 'js'",
        message: "A JSDoc annotation is required",
        goodExample: JSDocExample,
    },
    {
        sObject: "ApexClass",
        field: "Name",
        when: "NamespacePrefix = null",
        regex: "^[A-Z][A-Za-z]*$",
        message: "An Apex class name must be PascalCase",
        goodExample: 'SBCPT_CustomerAssessmentController',
    },
    {
        sObject: "ApexClass",
        field: "Body",
        computedField: "description",
        when: "NamespacePrefix = null",
        relatedFields: ["Name"],
        message: "An ApexClass must have a Description",
        goodExample: ApexExample,
    },
    {
        sObject: "OmniUiCard",
        field: "Description",
        relatedFields: [
            "Name"
        ],
        message: "Flexcards must have a description",
    },
]

export default rules
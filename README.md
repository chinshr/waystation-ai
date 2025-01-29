# waystation-ai

## Local Setup

1. Start Strapi backend

```
cd backend
npm run develop
cp .env.example .env
```

2. Start NextJS frontend

```
cd frontend
npm start dev
touch .env.local
echo "OPENAI_API_KEY=<your-openai-api-key>" >> .env.local
```


3. Naviate to Strapi

* Navigate to http://localhost:1337/admin
* Strapi ask to create super-admin user, go ahead and create a local super admin
* Import seed data

```
cd backend
npm run strapi import -- --file ../seed-data.tar.gz
```

* Test your API, open a browser tab and open [this URL](http://localhost:1337/api/rfqs?populate[quotes][populate][supplier]=*), you should see an API JSON response for RFQs

```
{
  "data": [
    {
      "id": 9,
      "documentId": "ywo4o0fqk01sxlzqjzbigflk",
      "dueDate": "2025-01-30",
      "requiredAmount": "1000",
      "createdAt": "2025-01-27T23:36:08.441Z",
      "updatedAt": "2025-01-28T19:50:31.762Z",
      "publishedAt": "2025-01-28T19:50:31.769Z",
      "locale": null,
      "title": "Almonds",
      "shipToAddress": "123 Mariposa Dr",
      "quotes": [
        {
          "id": 13,
  ...        
```

4. Navigate to Website

* Website should launch at http://localhost:3000
* Press `Login` on top-right corner
* Follow Don't have an account? `Sign Up` link
* Create a test user
* Login with your test user's credentials
* Navigate to dashboard
* Click the RFQs link on the dahsboards sidebar
* You should see a single RFQ in the list "Almonds"

5. Troubleshooting

Strapi is finicky with entity permissions. If permissions were not correctly seeded, go to 

* Strapi admin >  Settings > Users & Permissions Plugin > Roles
* Go through all objects and the easiest is to permit all operations per entity, and Save


## Extraction

### Example Email

```
Dear [Buyer's Name],

Thank you for reaching out to NutraSource Supply for your almond requirements. We are pleased to provide the requested details as follows:

Product: Almonds

* Price per Pound: $3.50
* Country of Origin: United States (California)
* Certification: USDA Organic, Non-GMO Project Verified, ISO 22000
* Minimum Order Quantity (MOQ): 5000 pounds

We are comitted to providing high-quality almonds that meet international standards. Our almonds are rigorously tested and certified to ensure the best product for our clients.

Please let us know if you have further specifications or questions. We look forward to the possibility of working together and will be happy to discuss any details to meet your needs.

Best regards,
Jane Doe
Sales Manager
Nutra Source Supply
Phone: +1 (555) 123-4567
Email: janedoe@nutrasource.com
Address: 1234 Orchard Lane, Fresno, CA 93722
```


### Chat Prompt

```
INSTRUCTIONS: 
  For the following email:

  {text}

  complete the following steps.

  Extract the following information and and structure your response in a JSON structure with fields to extract the following information

  * supplier contact name
  * supplier contact email
  * supplier contact phone number
  * supplier company name
  * supplier contact headquarter address
  * price per pound
  * country of origin
  * certifications
  * minimum order

  Return a JSON structure.
```

### JSON output

```
{
  "supplierContactName": "Jane Doe",
  "supplierContactEmail": "janedoe@nutrasource.com",
  "supplierContactPhoneNumber": "+1 (555) 123-4567",
  "supplierCompanyName": "NutraSource Supply",
  "supplierContactHeadquarterAddress": "1234 Orchard Lane, Fresno, CA 93722",
  "pricePerPound": 3.50,
  "countryOfOrigin": "United States (California)",
  "certifications": [
    "USDA Organic",
    "Non-GMO Project Verified",
    "ISO 22000"
  ],
  "minimumOrder": 5000
}
```

# apiportal-utils
functionality for zegal api services use

## Installation

**npm**

`npm install apiportal-utils`

## Usage

**node.js**

`const portal = require("apiportal-utils")`

**Example**

basic verification of webhook payload

```
const isValidPayload = portal.verifyWebhookEvent(stringifiedJsonPayload, signatureHeader, secretKey)
if(isValidPayload){
  // work with the payload
}
else{
  // log error for invalid payload from webhook
}
```


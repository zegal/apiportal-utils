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
try{
  const isValidPayload = portal.verifyWebhookEvent(stringifiedJsonPayload, req.headers["X-Dragon-Law-Signature"], secretKey)
  if(isValidPayload){
    // work with the payload
  }
} catch(err){
  // work with portal error
}

```


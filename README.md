# zegal-utils
Functionality for zegal api services use

## Installation

**npm**

`npm install zegal-utils`

## Usage

**node.js**

`const portal = require("zegal-utils")`

**Example**

Basic verification of webhook payload

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


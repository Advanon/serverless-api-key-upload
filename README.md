# serverless-api-key-upload

This plugin uploads API Gateway API key to AWS Parameter Store as a String parameter. 
For the uploaded parameter you can specify
- name
- tags
- description

## Installation
```bash
npm install --save-dev serverless-api-key-upload
```

## Usage
```yaml
plugins:
  - serverless-api-key-upload

custom:
  apiKeyParam: # Every configuration attribute is optional
    tags:
      ANY_TAG_NAME: foo
      ANY_OTHER_TAG: bar
    description: Description for parameter inside AWS Parameters Store
    paramName: Name of the parameter inside AWS Parameters Store
```

### Defaults
If any configuration attribute is not specified, defaults are used.

```yaml
tags:
  ENVIRONMENT: ${self:provider.stage}
description: API key for service ${self:service} on stage ${self:provider.stage}
paramName: /${self:provider.stage}/${self:service}/API_KEY
```

## Limitations
This plugin works only if exactly one apiKey is specified.

Requirements and constraints of parameter names page by AWS: https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-parameter-name-constraints.html

## Contributing
Feedback, bug reports, and pull requests are welcome.

For pull requests, make sure to follow the following guidelines:
* Add tests for each new feature and bug fix.
* Follow the existing code style, enforced by eslint.
* Separate unrelated changes into multiple pull requests.

## License
Apache License 2.0, see [LICENSE](LICENSE.md).

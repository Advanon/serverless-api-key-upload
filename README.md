[![Build Status](https://codebuild.eu-central-1.amazonaws.com/badges?uuid=eyJlbmNyeXB0ZWREYXRhIjoieXFqYm1vVUpYdDZ2Nk0vM1JlY0NkTkhSaUxCOXNzQmx2Z2xwVGd3d2gxQzM0N1MxY0FtQ0VNSDNjYUszVkQ1N0tMcEl0MWZ0NTNXZU04RlNCM1ZrdFh3PSIsIml2UGFyYW1ldGVyU3BlYyI6IndLVFUxMVlRTjgyM2x3T3YiLCJtYXRlcmlhbFNldFNlcmlhbCI6MX0%3D&branch=master)](https://eu-central-1.console.aws.amazon.com/codesuite/codebuild/projects/global-dev-serverless-api-key-upload-tf-pr-build)
# serverless-api-key-upload

This plugin uploads new/changed API Gateway API key to AWS Parameter Store as a SecureString parameter.
If value of API Key is not changed, upload won't be performed.
For the uploaded parameter you can specify
- name
- tags
- description
- kmsKeyId

## Installation
```bash
npm install --save-dev @advanon-ag/serverless-api-key-upload
```

## Usage
```yaml
plugins:
  - serverless-api-key-upload

custom:
  apiKeyParam: # Every configuration attribute is optional
    enabled: true # Default
    tags:
      ANY_TAG_NAME: foo
      ANY_OTHER_TAG: bar
    description: Description for parameter inside AWS Parameters Store
    paramName: Name of the parameter inside AWS Parameters Store
    kmsKeyId: keyId
    tier: Standard | Advanced
```

### Defaults
If any configuration attribute is not specified, defaults are used.

```yaml
tags:
  ENVIRONMENT: ${self:provider.stage}
  PROJECT: ${self:service}-${self:provider.stage}
description: API key for service ${self:service} on stage ${self:provider.stage}
paramName: /${self:provider.stage}/${self:service}/API_KEY
kmsKeyId: # System uses the default key associated with your AWS account.
tier: Standard
```

## Limitations
This plugin works only if exactly one apiKey is specified.

Use of `tier` attribute requires aws-sdk 2.442.0 or higher.

Requirements and constraints of parameter names page by AWS: https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-parameter-name-constraints.html

## Contributing
Feedback, bug reports, and pull requests are welcome.

For pull requests, make sure to follow the following guidelines:
* Add tests for each new feature and bug fix.
* Follow the existing code style, enforced by eslint.
* Separate unrelated changes into multiple pull requests.

## License
Apache License 2.0, see [LICENSE](LICENSE.md).

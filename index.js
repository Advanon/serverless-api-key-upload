const configuration = require('./src/configuration');
const { uploadParam, deleteParam } = require('./src/paramsStore');

const getSsm = (serverless) => {
    const provider = serverless.getProvider('aws');
    const awsCredentials = provider.getCredentials();

    return new provider.sdk.SSM(awsCredentials);
};

const makeUploadHook = (serverless) => {
    const ssm = getSsm(serverless);
    return uploadParam(ssm, serverless.cli)(
        configuration.getApiKey(serverless),
        configuration.getParamName(serverless.service),
        configuration.getDescription(serverless.service),
        configuration.getTags(serverless.service)
    );
};

const makeRemoveHook = (serverless) => {
    const ssm = getSsm(serverless);
    const paramName = configuration.getParamName(serverless.service);
    return deleteParam(ssm)(paramName);
};

class ServerlessApiKeyUploadToParameterStore {

    constructor(serverless, options) {
        this.serverless = serverless;
        this.options = options;

        if (serverless.service.provider.apiKeys && serverless.service.provider.apiKeys.length === 1) {
            this.hooks = this.setupHooks();
        } else {
            this.serverless.cli.log('serverless-api-key-upload works only for one api key');
        }
    }

    setupHooks() {
        return {
            'after:deploy:deploy': () => makeUploadHook(this.serverless),
            'before:remove:remove': () => makeRemoveHook(this.serverless)
        };
    }
}

module.exports = ServerlessApiKeyUploadToParameterStore;

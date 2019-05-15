const configuration = require('./src/configuration');
const { uploadParam, deleteParam } = require('./src/paramsStore');

const getSsm = (serverless) => {
    const provider = serverless.getProvider('aws');
    const awsCredentials = provider.getCredentials();

    return new provider.sdk.SSM(awsCredentials);
};

const makePutParameter = (ssm) => async (params) => ssm.putParameter(params).promise();

const makeAddTagsToResource = (ssm) => async (params) => ssm.addTagsToResource(params).promise();

const makeDeleteParameter = (ssm) => async (params) => ssm.deleteParameter(params).promise();

const makeUploadHook = (serverless) => {
    const ssm = getSsm(serverless);
    const putParameter = makePutParameter(ssm);
    const addTagsToResource = makeAddTagsToResource(ssm);

    return uploadParam(putParameter, addTagsToResource, serverless.cli)(
        configuration.getApiKey(serverless),
        configuration.getParamName(serverless.service),
        configuration.getDescription(serverless.service),
        configuration.getTags(serverless.service)
    );
};

const makeRemoveHook = (serverless) => {
    const ssm = getSsm(serverless);
    const deleteParameter = makeDeleteParameter(ssm);
    const paramName = configuration.getParamName(serverless.service);

    return deleteParam(deleteParameter)(paramName);
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
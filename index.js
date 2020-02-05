const { getTags, getParamName, getDescription, getApiKey, getKmsKeyId, getTier } = require('./src/configuration');
const { uploadParam, deleteParam } = require('./src/paramsStore');

const getSsm = (serverless) => {
    const provider = serverless.getProvider('aws');
    const awsCredentials = provider.getCredentials();
    awsCredentials.region = provider.getRegion();

    return new provider.sdk.SSM(awsCredentials);
};

const makePutParameter = (ssm) => async (params) => ssm.putParameter(params).promise();

const makeGetParameter = (ssm) => async (params) => ssm.getParameter(params).promise();

const makeAddTagsToResource = (ssm) => async (params) => ssm.addTagsToResource(params).promise();

const makeDeleteParameter = (ssm) => async (params) => ssm.deleteParameter(params).promise();

const upload = (serverless) => {
    const ssm = getSsm(serverless);
    const putParameter = makePutParameter(ssm);
    const addTagsToResource = makeAddTagsToResource(ssm);
    const getParameter = makeGetParameter(ssm);

    return uploadParam(putParameter, addTagsToResource, getParameter, serverless.cli)(
        getApiKey(serverless),
        getParamName(serverless.service),
        getDescription(serverless.service),
        getTier(serverless.service),
        getTags(serverless.service),
        getKmsKeyId(serverless.service)
    );
};

const remove = (serverless) => {
    const ssm = getSsm(serverless);
    const deleteParameter = makeDeleteParameter(ssm);
    const paramName = getParamName(serverless.service);

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
            'after:deploy:deploy': () => upload(this.serverless),
            'before:remove:remove': () => remove(this.serverless)
        };
    }
}

module.exports = ServerlessApiKeyUploadToParameterStore;

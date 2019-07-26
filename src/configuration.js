const getApiKeys = (serverless) => {
    const awsInfo = serverless.pluginManager.plugins.find((p) => p.constructor.name === 'AwsInfo');
    return awsInfo.gatheredData.info.apiKeys;
};

const hasConfigProperty = (service, propertyName) => {
    return service.custom &&
        service.custom.apiKeyParam &&
        service.custom.apiKeyParam[propertyName];
};

const getApiKey = (serverless) => {
    return getApiKeys(serverless)[0].value;
};

const getTier = (service) => {
    if (hasConfigProperty(service, 'tier')) {
        return service.custom.apiKeyParam.tier;
    }
};

const getTags = (service) => {
    if (hasConfigProperty(service, 'tags')) {
        return Object.getOwnPropertyNames(service.custom.apiKeyParam.tags).map((key) => {
            return {
                Key: key,
                Value: service.custom.apiKeyParam.tags[key]
            };
        });
    } else {
        return [
            {
                Key: 'ENVIRONMENT',
                Value: getStage(service)
            },
            {
                Key: 'PROJECT',
                Value: `${getService(service)}-${getStage(service)}`
            }
        ];
    }
};

const getDescription = (service) => {
    if (hasConfigProperty(service, 'description')) {
        return service.custom.apiKeyParam.description;
    } else {
        return `API key for service ${getService(service)} on stage ${getStage(service)}`;
    }
};

const getKmsKeyId = (service) => {
    if (hasConfigProperty(service, 'kmsKeyId')) {
        return service.custom.apiKeyParam.kmsKeyId;
    } else {
        return null;
    }
};

const getParamName = (service) => {
    if (hasConfigProperty(service, 'paramName')) {
        return service.custom.apiKeyParam.paramName;
    } else {
        return `/${getStage(service)}/${getService(service)}/API_KEY`;
    }
};

const getStage = (service) => service.provider.stage;

const getService = (service) => service.service;

module.exports = { getTags, getParamName, getDescription, getApiKey, getKmsKeyId, getTier };

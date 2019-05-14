const uploadParam = (ssm, logger) => async (apiKey, paramName, paramDescription, tags) => {
    logger.log(`Uploading API key to parameters store with param key "${paramName}"`);
    const newParameterParams = {
        Name: paramName,
        Type: 'String',
        Value: apiKey,
        Description: paramDescription,
        Overwrite: true
    };

    await ssm.putParameter(newParameterParams).promise();

    if (tags) {
        await ssm.addTagsToResource({
            ResourceId: newParameterParams.Name,
            ResourceType: 'Parameter',
            Tags: tags
        }).promise();
    }
};

const deleteParam = (ssm) => async (paramName) => {
    return ssm.deleteParameter({
        Name: paramName
    }).promise();
};

module.exports = { uploadParam, deleteParam };

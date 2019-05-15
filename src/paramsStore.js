const uploadParam = (putParameter, addTagsToResource, logger) => async (apiKey, paramName, paramDescription, tags) => {
    logger.log(`Uploading API key to parameters store with param key "${paramName}"`);
    const newParameterParams = {
        Name: paramName,
        Type: 'String',
        Value: apiKey,
        Description: paramDescription,
        Overwrite: true
    };

    await putParameter(newParameterParams);

    if (tags) {
        await addTagsToResource({
            ResourceId: newParameterParams.Name,
            ResourceType: 'Parameter',
            Tags: tags
        });
    }
};

const deleteParam = (deleteParameter) => async (paramName) => {
    return deleteParameter({
        Name: paramName
    });
};

module.exports = { uploadParam, deleteParam };

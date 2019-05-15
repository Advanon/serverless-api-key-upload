const uploadParam = (putParameter, addTagsToResource, logger) =>
    async (apiKey, paramName, paramDescription, tags, kmsKeyId) => {
        logger.log(`Uploading API key to parameters store with param key "${paramName}"`);
        const newParameterParams = {
            Name: paramName,
            Type: 'SecureString',
            Value: apiKey,
            Description: paramDescription,
            Overwrite: true
        };

        if (kmsKeyId) {
            newParameterParams.KeyId = kmsKeyId;
        }

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

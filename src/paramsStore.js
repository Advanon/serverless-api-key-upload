const uploadParam = (putParameter, addTagsToResource, getParameter, logger) =>
    async (apiKey, paramName, paramDescription, tier, tags, kmsKeyId) => {
        try {
            const currentParameter = await getParameter({
                Name: paramName,
                WithDecryption: true
            });

            if (currentParameter.Parameter.Value === apiKey) {
                logger.log('No need to update API key parameter');
                return;
            } else {
                logger.log(`Uploading new version of API key to parameters store with param key "${paramName}"`);
            }
        } catch (e) {
            logger.log(`Uploading initial version of API key to parameters store with param key "${paramName}"`);
        }

        const newParameterParams = {
            Name: paramName,
            Type: 'SecureString',
            Value: apiKey,
            Description: paramDescription,
            Overwrite: true,
        };

        if (kmsKeyId) {
            newParameterParams.KeyId = kmsKeyId;
        }

        if (tier) {
            newParameterParams.Tier = tier;
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

const deleteParam = (deleteParameter) => async (Name) => deleteParameter({ Name });

module.exports = { uploadParam, deleteParam };

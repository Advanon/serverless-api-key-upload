const { uploadParam, deleteParam } = require('./paramsStore');
const logger = {
    log: () => {
    }
};

describe('paramsStore', () => {
    describe('deleteParam', () => {
        it('should call delete function', async () => {
            const deleteParamFunc = jest.fn();
            const paramName = 'any';

            await deleteParam(deleteParamFunc)(paramName);
            expect(deleteParamFunc.mock.calls.length).toBe(1);
            expect(deleteParamFunc.mock.calls[0][0]).toStrictEqual({
                Name: paramName
            });
        });
    });

    describe('uploadParam', () => {
        const apiKey = 'anyApiKey';
        const paramName = 'any param Name';
        const paramDescription = 'any param descr';
        const tags = 'any tags';
        const kmsKeyId = 'anyKey';
        const tier = 'any tier';

        describe('on new api parameter with tags without kmsKey', () => {
            const getParamFunc = jest.fn();
            const putParamFunc = jest.fn();
            const addTagsFunc = jest.fn();

            beforeAll(async () => {
                await uploadParam(
                    putParamFunc, addTagsFunc, getParamFunc, logger
                )(apiKey, paramName, paramDescription, tier, tags);
            });

            it('should get parameter', () => {
                expect(getParamFunc.mock.calls.length).toBe(1);
                expect(getParamFunc.mock.calls[0][0]).toStrictEqual({
                    Name: paramName,
                    WithDecryption: true
                });
            });

            it('should upload new parameter without KeyId', () => {
                expect(putParamFunc.mock.calls.length).toBe(1);
                expect(putParamFunc.mock.calls[0][0]).toStrictEqual({
                    Name: paramName,
                    Type: 'SecureString',
                    Value: apiKey,
                    Description: paramDescription,
                    Overwrite: true,
                    Tier: tier
                });
            });

            it('should add tags', () => {
                expect(addTagsFunc.mock.calls.length).toBe(1);
                expect(addTagsFunc.mock.calls[0][0]).toStrictEqual({
                    ResourceId: paramName,
                    ResourceType: 'Parameter',
                    Tags: tags
                });
            });
        });

        describe('on changed api parameter with tags without kmsKey', () => {
            const getParamFunc = jest.fn();
            const putParamFunc = jest.fn();
            const addTagsFunc = jest.fn();
            getParamFunc.mockReturnValueOnce({ Parameter: { Value: 'santa is not real' } });

            beforeAll(async () => {
                await uploadParam(
                    putParamFunc, addTagsFunc, getParamFunc, logger
                )(apiKey, paramName, paramDescription, tier, tags);
            });

            it('should get parameter', () => {
                expect(getParamFunc.mock.calls.length).toBe(1);
                expect(getParamFunc.mock.calls[0][0]).toStrictEqual({
                    Name: paramName,
                    WithDecryption: true
                });
            });

            it('should upload new parameter without KeyId', () => {
                expect(putParamFunc.mock.calls.length).toBe(1);
                expect(putParamFunc.mock.calls[0][0]).toStrictEqual({
                    Name: paramName,
                    Type: 'SecureString',
                    Value: apiKey,
                    Description: paramDescription,
                    Overwrite: true,
                    Tier: tier
                });
            });

            it('should add tags', () => {
                expect(addTagsFunc.mock.calls.length).toBe(1);
                expect(addTagsFunc.mock.calls[0][0]).toStrictEqual({
                    ResourceId: paramName,
                    ResourceType: 'Parameter',
                    Tags: tags
                });
            });
        });

        describe('on new api parameter without tags with kmsKey', () => {
            const getParamFunc = jest.fn();
            const putParamFunc = jest.fn();
            const addTagsFunc = jest.fn();

            beforeAll(async () => {
                await uploadParam(
                    putParamFunc, addTagsFunc, getParamFunc, logger
                )(apiKey, paramName, paramDescription, tier, null, kmsKeyId);
            });

            it('should get parameter', () => {
                expect(getParamFunc.mock.calls.length).toBe(1);
                expect(getParamFunc.mock.calls[0][0]).toStrictEqual({
                    Name: paramName,
                    WithDecryption: true
                });
            });

            it('should upload new parameter with KeyId', () => {
                expect(putParamFunc.mock.calls.length).toBe(1);
                expect(putParamFunc.mock.calls[0][0]).toStrictEqual({
                    Name: paramName,
                    Type: 'SecureString',
                    Value: apiKey,
                    Description: paramDescription,
                    Overwrite: true,
                    KeyId: kmsKeyId,
                    Tier: tier
                });
            });

            it('should not add tags', () => {
                expect(addTagsFunc.mock.calls.length).toBe(0);
            });
        });

        describe('on existing same api parameter with tags without kmsKey', () => {
            const getParamFunc = jest.fn();
            const putParamFunc = jest.fn();
            const addTagsFunc = jest.fn();
            getParamFunc.mockReturnValueOnce({ Parameter: { Value: apiKey } });

            beforeAll(async () => {
                await uploadParam(
                    putParamFunc, addTagsFunc, getParamFunc, logger
                )(apiKey, paramName, paramDescription, tier, tags, kmsKeyId);
            });

            it('should get parameter', () => {
                expect(getParamFunc.mock.calls.length).toBe(1);
                expect(getParamFunc.mock.calls[0][0]).toStrictEqual({
                    Name: paramName,
                    WithDecryption: true
                });
            });

            it('should not upload new parameter', () => {
                expect(putParamFunc.mock.calls.length).toBe(0);
            });

            it('should not add tags', () => {
                expect(addTagsFunc.mock.calls.length).toBe(0);
            });
        });
    });
});

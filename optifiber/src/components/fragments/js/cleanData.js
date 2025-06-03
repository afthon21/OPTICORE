export const cleanData = (obj) => {
    return Object.entries(obj).reduce((acc, [key, value]) => {
        if (value && typeof value === 'object' && !Array.isArray(value)) {
            const cleanedObject = cleanData(value);
            if (Object.keys(cleanedObject).length > 0) {
                acc[key] = cleanedObject;
            }
        } else if (value !== null && value !== '' && value !== undefined) {
            acc[key] = value;
        }
        return acc;
    }, {});
};
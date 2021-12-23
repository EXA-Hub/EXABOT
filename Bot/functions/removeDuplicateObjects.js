function removeDuplicateObjects(objects) {
    return objects.reduce((acc, object) => {
        const hasProduct = !!acc.find((uniqueObject) => (
            uniqueObject === object
        ));
        if (!hasProduct) {
            return [...acc, object]
        }
        return acc;
    }, []);
}

module.exports = removeDuplicateObjects;
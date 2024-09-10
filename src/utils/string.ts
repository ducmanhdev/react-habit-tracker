export const convertToKebabCase = (str: string) => {
    return str
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
        .toLowerCase();
};

export const convertToCapitalCase = (str: string) => {
    return str
        .split(' ')
        .map(word =>
            word.charAt(0).toUpperCase() +
            word.slice(1).toLowerCase()
        )
        .join(' ');
};
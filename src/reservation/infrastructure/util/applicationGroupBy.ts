export const applicationGroupBy = <T extends Record<string, any>, K extends keyof T>(list: T[], key: K | ((element: T) => string | number)): Record<string | number, T[]> => {
    const getKey = key instanceof Function ? key : element => element[key];
    return list.reduce((curr, prev) => {
        const value = getKey(prev);
        curr[value] = (curr[value] || []).concat(prev);
        return curr;
    }, {});
};

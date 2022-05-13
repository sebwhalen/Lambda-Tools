export interface Rule {
    matcher: string | RegExp;
    type?: string;
}

export const rule = (matcher: string | RegExp, type?: string): Rule => {
    if (type === '') {
        throw new Error('Cannot match on an empty string');
    }

    //If the matcher is a regular expression, make sure it only matches the start of the string.
    if (typeof matcher !== 'string') {
        const { source } = matcher;

        if (!source.startsWith('^')) {
            matcher = new RegExp('^' + source);
        }
    }

    return { matcher, type };
};
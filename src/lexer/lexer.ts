import { Rule } from "./rule";
import { token, Token } from "./token";

const getSimpleMatch = (str: string, matcher: string): string | undefined =>
    (str.startsWith(matcher))
        ? matcher
        : undefined;

const getRegexMatch = (str: string, matcher: RegExp): string | undefined => {
    const result = str.match(matcher);

    if (!result) {
        return undefined;
    }

    return result[0];
}

export const getTokenValue = (rules: Rule[], str: string): [Rule, string] => {
    for (const rule of rules) {
        const match = (typeof rule.matcher === 'string')
            ? getSimpleMatch(str, rule.matcher)
            : getRegexMatch(str, rule.matcher)

        if (match) {
            return [rule, match];
        }
    }

    throw new Error('No rules matched.');
}


export function* tokenize(rules: Rule[], str: string): Generator<Token> {
    let position = 0;

    while (str !== '') {
        const [matchedRule, value] = getTokenValue(rules, str);

        if (matchedRule.type) {
            yield token(position, matchedRule.type, value);
        }

        //Update the position.
        position += value.length;

        //Remove the matched value from the string.
        str = str.slice(value.length);
    }
};
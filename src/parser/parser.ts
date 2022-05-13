import { tokenize } from "lexer/lexer"
import { Token } from "lexer/token";
import { application, empty, Expression, identifier, lambda } from "./expressions";
import { rules } from "./rules"
import { tokenTypes } from "./tokenTypes";

const parseBinding = (tokens: Array<Token>): Expression => {
    const argument = tokens.shift();

    if (!argument) {
        throw new Error('Invalid end of code.');
    }

    const { type, position, value } = argument;

    if (type !== tokenTypes.identifier) {
        throw new Error(`Argument at ${position} is not a valid identifier.`);
    }

    const endBind = tokens.shift();

    if (!endBind || endBind.type !== tokenTypes.endBind) {
        throw new Error(`Invalid end of binding expression at ${position}.`)
    }

    return lambda(
        position - 1,
        value,
        parseLambdaFromTokens(tokens)
    );
};


const getNext = (tokens: Array<Token>): Expression => {
    const next = tokens.shift();

    if (!next) {
        return empty;
    }

    const { type, position, value } = next;

    switch (type) {
        case tokenTypes.identifier:
            return identifier(position, value);
        case tokenTypes.startBlock:
            return parseLambdaFromTokens(tokens);
        case tokenTypes.endBlock:
            return empty;
        case tokenTypes.startBind:
            return parseBinding(tokens);
        case tokenTypes.endBind:
            throw new Error(`Invalid end of binding expression at ${position}.`);
    }

    throw new Error(`Unmatched token type ${type}`);
}

const parseLambdaFromTokens = (tokens: Array<Token>): Expression => {
    let result: Expression = empty;

    while (true) {
        const nextExpression = getNext(tokens);

        if (nextExpression === empty) {
            return result;
        }

        result = application(result, nextExpression);
    }

}

export const parseLambda = (code: string): Expression => {
    const tokens = [...tokenize(rules, code)];

    return parseLambdaFromTokens(tokens);
};
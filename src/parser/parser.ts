import { tokenize } from "lexer/lexer"
import { Token } from "lexer/token";
import { application, empty, Expression, identifier, lambda } from "./expressions";
import { rules } from "./rules"
import { tokenTypes } from "./tokenTypes";

const consumeIdentifiers = (tokens: Array<Token>): Expression => {
    const tail = tokens.at(-1);

    if (!tail || tail.type !== 'identifier') {
        return empty;
    }

    const { position, value } = tokens.pop() as Token;

    return application(
        consumeIdentifiers(tokens),
        identifier(position, value)
    );
};

const parseLambdaFromTokens = (tokens: Array<Token>): Expression => {
    let result: Expression = empty;

    while (tokens.length > 0) {
        const token = tokens.pop() as Token;
        const { position, value, type } = token;

        switch (type) {
            case tokenTypes.identifier:
                tokens.push(token)
                result = application(consumeIdentifiers(tokens), result);
                break;
            case tokenTypes.endBlock:
                result = application(parseLambdaFromTokens(tokens), result);
                break;
            case tokenTypes.endBind:
                const arg = tokens.pop();

                if (arg?.type !== tokenTypes.identifier) {
                    throw new Error(`Invalid binding at ${position}.`);
                }

                
                const symbol = tokens.pop();

                if (symbol?.type !== tokenTypes.startBind) {
                    throw new Error(`Invalid binding at ${position}.`);
                }

                result = lambda(arg.position - 1, arg.value, result);
                break;
            case tokenTypes.startBlock:
                return result;
            case tokenTypes.startBind:
                throw new Error(`Unexpected lambda symbol at ${position}.`);
        }
    }

    return result;
}

export const parseLambda = (code: string): Expression => {
    const tokens = [...tokenize(rules, code)];

    return parseLambdaFromTokens(tokens);
};
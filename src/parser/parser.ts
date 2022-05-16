import { tokenize } from "lexer/lexer"
import { Token } from "lexer/token";
import { application, empty, Expression, identifier, lambda } from "./expressions";
import { rules } from "./rules"
import { tokenTypes } from "./tokenTypes";

type Block = (Token | Block)[];

const groupBlocks = (tokens: Token[], depth: number = 0): Block => {
    const results: Block = [];

    while (tokens.length > 0) {
        const head = tokens.shift()!;

        switch (head.type) {
            case tokenTypes.startBlock:
                results.push(groupBlocks(tokens, depth + 1));
                break;
            case tokenTypes.endBlock:
                if (depth === 0) {
                    throw new Error(`Invalid end block at position ${head.position}.  Current chain: ${JSON.stringify(results)}`)
                }
                
                return results;
            default:
                results.push(head);
        }
    }

    return results;
};

interface PartialLambda {
    position: number;
    argument: string;
    body: LambdaSet;
}

type LambdaSet = (Token | PartialLambda | LambdaSet)[]

const groupLambdas = (blocks: Block): LambdaSet => {
    const [head, ...rest] = blocks;

    if(!head) {
        return [];
    }

    if (Array.isArray(head)) {
        return [groupLambdas(head), ...groupLambdas(rest)];
    }

    if (head.type !== tokenTypes.startBind) {
        return [head, ...groupLambdas(rest)];
    }

    const [arg, separator, ...body] = rest;

    if (
        Array.isArray(arg) ||
        arg?.type !== tokenTypes.identifier ||
        Array.isArray(separator) ||
        separator?.type !== tokenTypes.endBind
    ) {
        throw new Error(`Invalid lambda at position ${head.position}.`);
    }

    return [{
        position: head.position,
        argument: arg.value,
        body: groupLambdas(body)
    }];
};

const groupsToExpression = (groups: LambdaSet): Expression =>
    groups.reduce<Expression>((a, b) => {
        if (Array.isArray(b)) {
            return application(a, groupsToExpression(b));
        }

        if ('type' in b) {
            return application(a, identifier(b.position, b.value));
        }

        const { position, argument, body } = b;

        const l = lambda(position, argument, groupsToExpression(body))

        return application(a, l);
    }, empty);

export const parseLambda = (code: string): Expression => {
    const tokens = [...tokenize(rules, code)];

    //Pass one: Group blocks
    const blocks = groupBlocks(tokens);

    //Pass two: Group lambdas
    const grouped = groupLambdas(blocks);

    //Pass three: build applications
    return groupsToExpression(grouped);
};
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
    const results = [];

    while (blocks.length > 0) {
        const head = blocks.shift()!;

        if (Array.isArray(head)) {
            results.push(groupLambdas(head));
            continue;
        }

        if (head.type !== tokenTypes.startBind) {
            results.push(head);
            continue;
        }

        const arg = blocks.shift();
        const separator = blocks.shift();
        

        if (
            Array.isArray(arg) ||
            arg?.type !== tokenTypes.identifier ||
            Array.isArray(separator) ||
            separator?.type !== tokenTypes.endBind
        ) {
            throw new Error(`Invalid lambda at position ${head.position}.`);
        }

        results.push({
            position: head.position,
            argument: arg.value,
            body: groupLambdas(blocks)
        });
    }

    return results;
};

const groupsToExpression = (groups: LambdaSet): Expression =>
    groups.reduce<Expression>((a, b) => {
        if (Array.isArray(b)) {
            return application(a, groupsToExpression(b));
        }

        if ('type' in b) {
            return application(a, identifier(b.value, b.position));
        }

        const { position, argument, body } = b;

        const l = lambda(argument, groupsToExpression(body), position)

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
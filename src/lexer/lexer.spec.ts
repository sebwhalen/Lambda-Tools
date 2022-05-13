import { tokenize } from "./lexer";
import { rule } from "./rule";

//Lexer is tested using lambda calculus syntax rules.
const tokenTypes = {
    startBind: 'startBind',
    endBind: 'endBind',
    startBlock: 'startBlock',
    endBlock: 'endBlock',
    identifier: 'identifier'
};

//Rules for lambda calculus
const rules = [
    rule('L', tokenTypes.startBind),
    rule('.', tokenTypes.endBind),
    rule('(', tokenTypes.startBlock),
    rule(')', tokenTypes.endBlock),
    rule(/\s+/),
    rule(/[a-zA-Z0-9_-]+/, tokenTypes.identifier)
];

const token = (position: number, type: string, value: string) =>
    ({ position, type, value });

describe('tokenize', () => {
    [
        {
            input: '',
            expected: []
        },

        {
            input: '    ',
            expected: []
        },

        {
            input: 'abc LaL.de(f)',
            expected: [
                token(0, tokenTypes.identifier, 'abc'),
                token(4, tokenTypes.startBind, 'L'),
                token(5, tokenTypes.identifier, 'aL'),
                token(7, tokenTypes.endBind, '.'),
                token(8, tokenTypes.identifier, 'de'),
                token(10, tokenTypes.startBlock, '('),
                token(11, tokenTypes.identifier, 'f'),
                token(12, tokenTypes.endBlock, ')')
            ]
        }
    ]
        .forEach(({ input, expected }) => {
            test(`${input} is parsed correctly`, () => {
                expect([...tokenize(rules, input)]).toEqual(expected);
            });
        })
});

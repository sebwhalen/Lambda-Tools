import { application, empty, identifier, lambda } from "./expressions";
import { expressionToString } from "./expressionToString";

describe('expressionToString', () => {
    [
        {
            input: empty,
            expected: ''
        },
        {
            input:
                application(
                    identifier('a'),
                    identifier('b')
                ),
            expected: '(a b)'
        },
        {
            input: 
                application(
                    identifier('a'),
                    lambda(
                        'b', 
                        application(
                            identifier('c'), 
                            identifier('b')
                        )
                    )
                ),
            expected: '(a (λb.(c b)))'
        }
    ].forEach(({ input, expected }) =>
        test(`Expression for '${expected}' parses correctly.`, () =>
            expect(expressionToString(input)).toEqual(expected)
        ));
});
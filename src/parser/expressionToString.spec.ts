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
                    identifier(0, 'a'),
                    identifier(0, 'b')
                ),
            expected: '(a b)'
        },
        {
            input: 
                application(
                    identifier(0, 'a'),
                    lambda(
                        0, 
                        'b', 
                        application(
                            identifier(0, 'c'), 
                            identifier(0, 'b')
                        )
                    )
                ),
            expected: '(a λb.(c b))'
        }
    ].forEach(({ input, expected }) =>
        test(`Expression for '${expected}' parses correctly.`, () =>
            expect(expressionToString(input)).toEqual(expected)
        ));
});
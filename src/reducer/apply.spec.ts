import { application, empty, identifier, lambda } from 'parser/expressions';
import { expressionToString } from 'parser/expressionToString';
import { apply } from './apply';

describe('apply', () => {
    [
        {
            input: empty,
            expected: empty
        },

        {
            input: identifier('b'),
            expected: identifier('b')
        },

        {
            input: lambda(
                'a',
                identifier('a')
            ),
            expected: lambda(
                'a',
                identifier('a')
            )
        },

        {
            input:
                application(
                    identifier('a'),
                    identifier('b')
                ),
            expected:
                application(
                    identifier('a'),
                    identifier('b')
                )
        },

        {
            input:
                application(
                    lambda(
                        'a',
                        identifier('a')
                    ),
                    identifier('b')
                ),
            expected:
                identifier('b')
        },

        {
            input:
                application(
                    application(
                        lambda('a', lambda('b', identifier('a'))),
                        identifier('c')
                    ),
                    identifier('d')
                ),
            expected:
                application(
                    lambda('b', identifier('c')),
                    identifier('d')
                )
        }
    ].forEach(({ input, expected }) =>
        test(`Reduces '${expressionToString(input)}' to '${expressionToString(expected)}'.`, () =>
            expect(apply(input)).toEqual(expected)
        )
    )

    test('Creates a new instance rather than modifying the base instance.', () => {
        const expression = identifier('a');
        expect(apply(expression)).not.toBe(expression);
    });
});
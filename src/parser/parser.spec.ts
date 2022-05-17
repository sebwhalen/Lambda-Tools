import { application, empty, identifier, lambda } from "./expressions";
import { parseLambda } from "./parser";

describe('parseLambda', () => {
    [
        {
            input: '',
            output: empty
        },

        {
            input: 'a',
            output: identifier('a', 0)
        },

        {
            input: 'a b',
            output:
                application(
                    identifier('a', 0),
                    identifier('b', 2)
                )
        },

        {
            input: 'a b c',
            output:
                application(
                    application(
                        identifier('a', 0),
                        identifier('b', 2)
                    ),
                    identifier('c', 4)
                )
        },

        {
            input: 'a (b c)',
            output:
                application(
                    identifier('a', 0),
                    application(
                        identifier('b', 3),
                        identifier('c', 5)
                    )
                )
        },

        {
            input: 'λa.a',
            output:
                lambda(
                    'a',
                    identifier('a', 3),
                    0
                )
        },

        {
            input: 'a (b c) (λa.(d ea))',
            output:
                application(
                    application(
                        identifier('a', 0),
                        application(
                            identifier('b', 3),
                            identifier('c', 5)
                        )
                    ),
                    lambda(
                        'a',
                        application(
                            identifier('d', 13),
                            identifier('ea', 15)
                        ),
                        9
                    )
                )
        },

        {
            input: '(λa.(λb.a)) c',
            output:
                application(
                    lambda(
                        'a',
                        lambda(
                            'b',
                            identifier('a', 8),
                            5
                        ),
                        1
                    ),
                    identifier('c', 12)
                )
        }
    ]
        .forEach(({ input, output }) =>
            test(`'${input} parses correctly`, () => {
                expect(parseLambda(input)).toEqual(output);
            }));

    [
        'λ.',
        'λ  .',
        'λan(alksjd)'
    ].forEach(input =>
        test(`${input} throws exception`, () => {
            expect(() => parseLambda(input)).toThrow();
        }
        ));
});
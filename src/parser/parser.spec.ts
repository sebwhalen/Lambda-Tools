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
            output: identifier(0, 'a')
        },

        {
            input: 'a b',
            output:
                application(
                    identifier(0, 'a'),
                    identifier(2, 'b')
                )
        },

        {
            input: 'a b c',
            output:
                application(
                    application(
                        identifier(0, 'a'),
                        identifier(2, 'b')
                    ),
                    identifier(4, 'c')
                )
        },

        {
            input: 'a (b c)',
            output:
                application(
                    identifier(0, 'a'),
                    application(
                        identifier(3, 'b'),
                        identifier(5, 'c')
                    )
                )
        },

        {
            input: 'λa.a',
            output:
                lambda(
                    0,
                    'a',
                    identifier(3, 'a')
                )
        },

        {
            input: 'a (b c) (λa.(d ea))',
            output:
                application(
                    application(
                        identifier(0, 'a'),
                        application(
                            identifier(3, 'b'),
                            identifier(5, 'c')
                        )
                    ),
                    lambda(
                        9,
                        'a',
                        application(
                            identifier(13, 'd'),
                            identifier(15, 'ea')
                        )
                    )
                )
        }
    ]
        .forEach(({ input, output }) =>
            test(`'${input} parses correctly`, () => {
                expect(parseLambda(input)).toEqual(output);
            }));
});
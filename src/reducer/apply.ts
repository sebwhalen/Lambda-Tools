import { application, Expression, lambda } from 'parser/expressions';

const replace = (argument: string, replacement: Expression, expression: Expression): Expression => {
    switch (expression.type) {
        case 'lambda':
            return (expression.argument === argument)
                ? expression
                : lambda(expression.argument, replace(argument, replacement, expression.expression));

        case 'identifier':
            return (expression.value === argument)
                ? replacement
                : expression;

        case 'application':
            return application(
                replace(argument, replacement, expression.left),
                replace(argument, replacement, expression.right)
            );

        case 'empty':
            return expression;
    }
}

//Used to avoid constant copying while applying expressions.
//TODO Add error detection for stack overflow.
const applyDirectly = (expression: Expression): Expression => {
    switch (expression.type) {
        case 'application':
            if (expression.left.type === 'lambda') {
                return replace(expression.left.argument, expression.right, expression.left.expression);
            }

            return application(
                applyDirectly(expression.left),
                applyDirectly(expression.right)
            );
        default:
            return expression;
    }
}

//This creates a copy of the base expression to avoid clobbering it.
export const apply = (expression: Expression): Expression =>
    applyDirectly(JSON.parse(JSON.stringify(expression)));

import { Expression } from "./expressions";

export const expressionToString = (expression: Expression): string => {
    switch (expression.type) {
        case 'empty':
            return '';
        case 'identifier':
            return expression.value;
        case 'application':
            return `(${expressionToString(expression.left)} ${expressionToString(expression.right)})`
        case 'lambda':
            return `λ${expression.argument}.(${expressionToString(expression.expression)})`;
    }
};
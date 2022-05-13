import { Expression } from "parser/expressions";

export const expressionToString = (expression: Expression): string => {
    switch (expression.type) {
        case 'empty':
            return 'Empty';
        case 'application':
            return `Application((${expressionToString(expression.left)}), (${expressionToString(expression.right)}))`;
        case 'identifier':
            return `Identifier(${expression.value})`;
        case 'lambda':
            return `Lambda(${expression.argument}.(${expressionToString(expression.expression)}))`;
    }
}
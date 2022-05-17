export interface Empty {
    type: 'empty'
}

export const empty: Empty = { type: 'empty' }

export interface Identifier {
    type: 'identifier';
    position: number;
    value: string;
}

export const identifier = (value: string, position: number = 0): Identifier =>
({
    type: 'identifier',
    position,
    value,
});

export interface Application {
    type: 'application';
    left: Expression;
    right: Expression;
}

export const application = (left: Expression, right: Expression): Expression => {
    if(left === empty) {
        return right;
    }

    if(right === empty) {
        return left;
    }

    return {
        type: 'application',
        left,
        right
    };
}

export interface Lambda {
    type: 'lambda';
    position: number;
    argument: string;
    expression: Expression;
}

export const lambda = (argument: string, expression: Expression, position: number = 0): Lambda => {
    if(expression === empty) {
        throw new Error(`Invalid lambda at position ${position}`)
    }

    return {
        type: 'lambda',
        position,
        argument,
        expression
    };
}

export type Expression = Identifier 
    | Application 
    | Lambda 
    | Empty;
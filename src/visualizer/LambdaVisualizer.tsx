import { Expression } from "parser/expressions";
import { parseLambda } from "parser/parser";
import { expressionToString } from "./expressionToString";

interface LambdaVisualizerProps {
    expression: string;
}

export const LambdaVisualizer = ({ expression }: LambdaVisualizerProps) => {
    let parsedExpression: Expression | undefined = undefined;

    try {
        parsedExpression = parseLambda(expression);
    } catch (e) {
        console.log(e);
    }

    return <p>{
        (parsedExpression)
            ? expressionToString(parsedExpression)
            : 'Expression could not be parsed.'
    }</p>;
};
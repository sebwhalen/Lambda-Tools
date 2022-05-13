import { Application, Expression, Identifier, Lambda } from "parser/expressions";
import { parseLambda } from "parser/parser";

interface LambdaVisualizerProps {
    expression: string;
}

const EmptyNode = () =>
    <p>Empty</p>;

const IdentifierNode = ({ value }: Identifier) =>
    <section>
        <p>{value}</p>
    </section>

const ApplicationNode = ({ left, right }: Application) =>
    <section>
        <h1>Application:</h1>
        <section className="node-contents">
            <ExpressionNode {...left} />
            <ExpressionNode {...right} />
        </section>
    </section>;

const LambdaNode = ({ argument, expression }: Lambda) =>
    <section>
        <h1>Lambda ({argument})</h1>
        <section className="node-contents">
            <ExpressionNode {...expression} />
        </section>
    </section>;

const ExpressionNode = (expression: Expression) => {
    switch (expression.type) {
        case 'identifier':
            return <IdentifierNode {...expression} />;
        case 'application':
            return <ApplicationNode {...expression} />;
        case 'lambda':
            return <LambdaNode {...expression} />;
        case 'empty':
            return <EmptyNode />;
        default:
            return <p>Unsupported expression type.</p>;
    }

}

export const LambdaVisualizer = ({ expression }: LambdaVisualizerProps) => {
    let parsedExpression: Expression | undefined = undefined;

    try {
        parsedExpression = parseLambda(expression);
    } catch (e) {
        console.log(e);
    }

    return (parsedExpression)
        ? <ExpressionNode {...parsedExpression} />
        : <p>Expression could not be parsed.</p>;
};
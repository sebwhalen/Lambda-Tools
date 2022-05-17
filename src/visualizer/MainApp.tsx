import { expressionToString } from 'parser/expressionToString';
import { parseLambda } from 'parser/parser';
import { useState } from "react";
import { apply } from 'reducer/apply';
import { ExpressionEditor } from "./ExpressionEditor";
import { LambdaVisualizer } from "./LambdaVisualizer";

export const MainApp = () => {
    const [expression, setExpression] = useState('');

    const applyExpression = () => {
        setExpression(expressionToString(apply(parseLambda(expression))))
    };

    return <section>
        <ExpressionEditor
            expression={expression}
            setExpression={setExpression}
            apply={applyExpression} />

        <LambdaVisualizer expression={expression} />
    </section>
};
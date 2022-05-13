import { useState } from "react";
import { ExpressionEditor } from "./ExpressionEditor";
import { LambdaVisualizer } from "./LambdaVisualizer";

export const MainApp = () => {
    const [expression, setExpression] = useState('');

    return <section>
        <ExpressionEditor
            expression={expression}
            setExpression={setExpression} />

        <LambdaVisualizer expression={expression} />
    </section>
};
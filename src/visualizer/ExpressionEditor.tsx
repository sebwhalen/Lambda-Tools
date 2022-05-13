import { useState } from "react";

interface ExpressionEditorProps {
    expression: string;
    setExpression(expression: string): any;
}

export const ExpressionEditor = ({
    expression,
    setExpression
}: ExpressionEditorProps) =>
    <section className="lambda-editor">
        <p>λ</p>
        <label>
            <span></span>
            <input type='text' value={expression} onChange={(e) => setExpression(e.target.value)} />
        </label>
    </section>;
interface ExpressionEditorProps {
    expression: string;
    setExpression(expression: string): any;
    apply(): void
}

export const ExpressionEditor = ({
    expression,
    setExpression,
    apply
}: ExpressionEditorProps) =>
    <section className="lambda-editor">
        <p>λ</p>
        <label>
            <span></span>
            <input type='text' value={expression} onChange={(e) => setExpression(e.target.value)} />
        </label>

        <button onClick={apply}>Apply</button>
    </section>;
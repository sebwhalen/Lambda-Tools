import { rule } from "lexer/rule";
import { tokenTypes } from "./tokenTypes";

export const rules = [
    rule('L', tokenTypes.startBind),
    rule('.', tokenTypes.endBind),
    rule('(', tokenTypes.startBlock),
    rule(')', tokenTypes.endBlock),
    rule(/\s+/),
    rule(/[a-zA-Z0-9_-]+/, tokenTypes.identifier)
];

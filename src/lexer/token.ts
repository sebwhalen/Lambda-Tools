export interface Token {
    position: number;
    type: string;
    value: string;
}

export const token = (position: number, type: string, value: string) =>
    ({ position, type, value });
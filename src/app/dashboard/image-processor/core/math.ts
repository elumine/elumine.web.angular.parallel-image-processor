export type Color = { r: number, g: number, b: number, a: number };

export function LerpFloat(a: number, b: number, weight: number) {
    return a + (b - a) * weight;
}

export function LerpColors(a: Color, b: Color, weight: number): Color {
    return {
        r: LerpFloat(a.r, b.r, weight),
        g: LerpFloat(a.g, b.g, weight),
        b: LerpFloat(a.b, b.b, weight),
        a: LerpFloat(a.a, b.a, weight),
    };
}
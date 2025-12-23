export type GematriaMethod = 'standard' | 'ordinal' | 'reduced';

const HEBREW_VALUES: Record<string, { standard: number; ordinal: number }> = {
    'א': { standard: 1, ordinal: 1 },
    'ב': { standard: 2, ordinal: 2 },
    'ג': { standard: 3, ordinal: 3 },
    'ד': { standard: 4, ordinal: 4 },
    'ה': { standard: 5, ordinal: 5 },
    'ו': { standard: 6, ordinal: 6 },
    'z': { standard: 7, ordinal: 7 }, // Zain (using z for mapping if needed, but usually strictly Hebrew chars)
    'ז': { standard: 7, ordinal: 7 },
    'ח': { standard: 8, ordinal: 8 },
    'ט': { standard: 9, ordinal: 9 },
    'י': { standard: 10, ordinal: 10 },
    'כ': { standard: 20, ordinal: 11 },
    'ך': { standard: 20, ordinal: 11 }, // Final Kaf
    'l': { standard: 30, ordinal: 12 },
    'ל': { standard: 30, ordinal: 12 },
    'מ': { standard: 40, ordinal: 13 },
    'ם': { standard: 40, ordinal: 13 }, // Final Mem
    'נ': { standard: 50, ordinal: 14 },
    'ן': { standard: 50, ordinal: 14 }, // Final Nun
    'ס': { standard: 60, ordinal: 15 },
    'ע': { standard: 70, ordinal: 16 },
    'פ': { standard: 80, ordinal: 17 },
    'ף': { standard: 80, ordinal: 17 }, // Final Pe
    'צ': { standard: 90, ordinal: 18 },
    'ץ': { standard: 90, ordinal: 18 }, // Final Tsadi
    'q': { standard: 100, ordinal: 19 },
    'ק': { standard: 100, ordinal: 19 },
    'ר': { standard: 200, ordinal: 20 },
    'ש': { standard: 300, ordinal: 21 },
    'ת': { standard: 400, ordinal: 22 },
};

export function calculateGematria(text: string, method: GematriaMethod = 'standard'): number {
    let total = 0;
    const cleanText = text.replace(/[^א-ת]/g, ''); // Keep only Hebrew letters

    for (const char of cleanText) {
        const values = HEBREW_VALUES[char];
        if (values) {
            if (method === 'standard') {
                total += values.standard;
            } else if (method === 'ordinal') {
                total += values.ordinal;
            } else if (method === 'reduced') {
                // Mispar Katan (Small Number)
                let val = values.standard;
                while (val > 9) {
                    val = Math.floor(val / 10) + (val % 10);
                }
                total += val;
            }
        }
    }

    // For reduced method, reduce the final total as well if needed, 
    // though usually Mispar Katan reduces each letter. 
    // Let's stick to the common interpretation: sum of reduced letter values.

    return total;
}

export function getResonantWords(value: number, database: any[]): any[] {
    // Placeholder logic to find words in our DB with same Gematria
    return database.filter(item => {
        if (item.hebreo) {
            return calculateGematria(item.hebreo) === value;
        }
        return false;
    });
}

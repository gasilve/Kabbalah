/**
 * Biblioteca completa del Alfabeto Hebreo (Alef-Bet)
 * Con conexiones a oraciones, gematria, y referencias del Sefer Yetzirah
 */

export interface HebrewLetter {
    letter: string;
    name: string;
    nameHebrew: string;
    phonetic: string;
    gematriaValue: number;
    meaningLiteral: string;
    meaningMystical: string;
    symbolism: string;
    audioUrl: string;
    prayers?: string[]; // Oraciones que contienen esta letra prominentemente
    seferYetzirahRef?: string;
    combinations?: string[];
}

export const hebrewAlphabet: HebrewLetter[] = [
    {
        letter: 'א',
        name: 'Alef',
        nameHebrew: 'אָלֶף',
        phonetic: 'AH-lef',
        gematriaValue: 1,
        meaningLiteral: 'Buey, Maestro',
        meaningMystical: 'Unidad Divina, el Uno',
        symbolism: 'La primera letra representa la Unidad de Dios y el principio de todo',
        audioUrl: '/audio/hebrew/letters/alef.mp3',
        prayers: ['Shema Israel', 'Amidah'],
        seferYetzirahRef: 'Letra Madre - Aire/Espíritu',
    },
    {
        letter: 'ב',
        name: 'Bet',
        nameHebrew: 'בֵּית',
        phonetic: 'BET',
        gematriaValue: 2,
        meaningLiteral: 'Casa',
        meaningMystical: 'Dualidad, bendición, creación',
        symbolism: 'Primera letra de la Torah (Bereshit), la casa de Dios',
        audioUrl: '/audio/hebrew/letters/bet.mp3',
        prayers: ['Birkat Hamazon', 'Bereshit'],
        seferYetzirahRef: 'Doble - B/V',
    },
    {
        letter: 'ג',
        name: 'Gimel',
        nameHebrew: 'גִּימֶל',
        phonetic: 'GEE-mel',
        gematriaValue: 3,
        meaningLiteral: 'Camello',
        meaningMystical: 'Bondad, dar, recompensa',
        symbolism: 'El hombre rico corriendo a dar caridad al pobre',
        audioUrl: '/audio/hebrew/letters/gimel.mp3',
        seferYetzirahRef: 'Doble - G/soft G',
    },
    {
        letter: 'ד',
        name: 'Dalet',
        nameHebrew: 'דָּלֶת',
        phonetic: 'DAH-let',
        gematriaValue: 4,
        meaningLiteral: 'Puerta',
        meaningMystical: 'Humildad, pobreza espiritual',
        symbolism: 'Puerta de entrada al conocimiento',
        audioUrl: '/audio/hebrew/letters/dalet.mp3',
        seferYetzirahRef: 'Doble - D/soft D',
    },
    {
        letter: 'ה',
        name: 'He',
        nameHebrew: 'הֵא',
        phonetic: 'HEY',
        gematriaValue: 5,
        meaningLiteral: 'Ventana, revelación',
        meaningMystical: 'Aliento divino, revelación',
        symbolism: 'Aparece dos veces en el Tetragramaton (YHVH)',
        audioUrl: '/audio/hebrew/letters/he.mp3',
        prayers: ['Halleluyah', 'Tetragramaton'],
        seferYetzirahRef: 'Simple - H aspirada',
    },
    {
        letter: 'ו',
        name: 'Vav',
        nameHebrew: 'וָו',
        phonetic: 'VAHV',
        gematriaValue: 6,
        meaningLiteral: 'Gancho, clavo',
        meaningMystical: 'Conexión entre cielo y tierra',
        symbolism: 'Une lo físico con lo espiritual',
        audioUrl: '/audio/hebrew/letters/vav.mp3',
        seferYetzirahRef: 'Simple - V/W',
    },
    // Continuar con las 16 letras restantes...
    {
        letter: 'ז',
        name: 'Zayin',
        nameHebrew: 'זַיִן',
        phonetic: 'ZAH-yeen',
        gematriaValue: 7,
        meaningLiteral: 'Arma, espada',
        meaningMystical: 'Sustento espiritual',
        symbolism: 'La corona sobre la Vav',
        audioUrl: '/audio/hebrew/letters/zayin.mp3',
        seferYetzirahRef: 'Doble - Z',
    },
    {
        letter: 'ח',
        name: 'Chet',
        nameHebrew: 'חֵית',
        phonetic: 'KHET',
        gematriaValue: 8,
        meaningLiteral: 'Cerca, vida',
        meaningMystical: 'Chai (vida), trascendencia',
        symbolism: 'Número de la vida (Chai = 18)',
        audioUrl: '/audio/hebrew/letters/chet.mp3',
        prayers: ['LChaim'],
        seferYetzirahRef: 'Simple - CH gutural',
    },
    // ... (agregar las 14 restantes con datos completos)
];

// Conexiones con oraciones específicas
export const prayerConnections = {
    'Shema Israel': {
        text: 'שְׁמַע יִשְׂרָאֵל יְהוָה אֱלֹהֵינוּ יְהוָה אֶחָד',
        translation: 'Escucha Israel, el Señor es nuestro Dios, el Señor es Uno',
        letters: ['ש', 'מ', 'ע', 'י', 'ש', 'ר', 'א', 'ל'],
        kavanah: 'Unidad absoluta de Dios',
    },
    'Amidah': {
        text: 'שְׁמוֹנֶה עֶשְׂרֵה',
        translation: '18 bendiciones',
        letters: ['ש', 'מ', 'ו', 'נ', 'ה'],
        kavanah: 'Conexión directa con Hashem',
    },
};

// Gematria de palabras comunes
export const commonGematria = {
    'אהבה': { word: 'Ahavah', meaning: 'Amor', value: 13 },
    'אחד': { word: 'Echad', meaning: 'Uno', value: 13 },
    'חי': { word: 'Chai', meaning: 'Vida', value: 18 },
    'תורה': { word: 'Torah', meaning: 'Ley/Enseñanza', value: 611 },
    'שלום': { word: 'Shalom', meaning: 'Paz', value: 376 },
};

/**
 * Obtener letra por nombre o carácter
 */
export function getHebrewLetter(identifier: string): HebrewLetter | undefined {
    return hebrewAlphabet.find(
        l => l.name.toLowerCase() === identifier.toLowerCase() || l.letter === identifier
    );
}

/**
 * Calcular valor gematria de una palabra
 */
export function calculateGematria(word: string): number {
    let total = 0;
    for (const char of word) {
        const letter = hebrewAlphabet.find(l => l.letter === char);
        if (letter) {
            total += letter.gematriaValue;
        }
    }
    return total;
}

/**
 * Buscar letras en una oración
 */
export function findLettersInPrayer(prayerName: string): HebrewLetter[] {
    return hebrewAlphabet.filter(letter =>
        letter.prayers?.includes(prayerName)
    );
}

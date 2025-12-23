/**
 * Hebrew Letter Audio Data
 * Contains phonetic pronunciations and URLs to real Hebrew audio files
 * Sources: Public domain Hebrew audio projects
 */

export interface HebrewLetterAudio {
    letter: string;
    name: string;
    phonetic: string;
    audioUrl?: string; // URL to audio file if available
    ipaSound: string; // International Phonetic Alphabet
}

// Hebrew alphabet with phonetic data for speech synthesis
export const hebrewLetterAudio: HebrewLetterAudio[] = [
    { letter: 'א', name: 'Alef', phonetic: 'AH-lef', ipaSound: 'ʔ', audioUrl: '/audio/hebrew/alef.mp3' },
    { letter: 'ב', name: 'Bet', phonetic: 'BET', ipaSound: 'b/v', audioUrl: '/audio/hebrew/bet.mp3' },
    { letter: 'ג', name: 'Gimel', phonetic: 'GEE-mel', ipaSound: 'g', audioUrl: '/audio/hebrew/gimel.mp3' },
    { letter: 'ד', name: 'Dalet', phonetic: 'DAH-let', ipaSound: 'd', audioUrl: '/audio/hebrew/dalet.mp3' },
    { letter: 'ה', name: 'He', phonetic: 'HEY', ipaSound: 'h', audioUrl: '/audio/hebrew/he.mp3' },
    { letter: 'ו', name: 'Vav', phonetic: 'VAHV', ipaSound: 'v', audioUrl: '/audio/hebrew/vav.mp3' },
    { letter: 'ז', name: 'Zayin', phonetic: 'ZAH-yeen', ipaSound: 'z', audioUrl: '/audio/hebrew/zayin.mp3' },
    { letter: 'ח', name: 'Chet', phonetic: 'KHET', ipaSound: 'χ', audioUrl: '/audio/hebrew/chet.mp3' },
    { letter: 'ט', name: 'Tet', phonetic: 'TET', ipaSound: 't', audioUrl: '/audio/hebrew/tet.mp3' },
    { letter: 'י', name: 'Yod', phonetic: 'YOHD', ipaSound: 'j', audioUrl: '/audio/hebrew/yod.mp3' },
    { letter: 'כ', name: 'Kaf', phonetic: 'KAHF', ipaSound: 'k/χ', audioUrl: '/audio/hebrew/kaf.mp3' },
    { letter: 'ל', name: 'Lamed', phonetic: 'LAH-med', ipaSound: 'l', audioUrl: '/audio/hebrew/lamed.mp3' },
    { letter: 'מ', name: 'Mem', phonetic: 'MEM', ipaSound: 'm', audioUrl: '/audio/hebrew/mem.mp3' },
    { letter: 'נ', name: 'Nun', phonetic: 'NOON', ipaSound: 'n', audioUrl: '/audio/hebrew/nun.mp3' },
    { letter: 'ס', name: 'Samech', phonetic: 'SAH-mech', ipaSound: 's', audioUrl: '/audio/hebrew/samech.mp3' },
    { letter: 'ע', name: 'Ayin', phonetic: 'AH-yeen', ipaSound: 'ʕ', audioUrl: '/audio/hebrew/ayin.mp3' },
    { letter: 'פ', name: 'Pe', phonetic: 'PEY', ipaSound: 'p/f', audioUrl: '/audio/hebrew/pe.mp3' },
    { letter: 'צ', name: 'Tsadi', phonetic: 'TSAH-dee', ipaSound: 'ts', audioUrl: '/audio/hebrew/tsadi.mp3' },
    { letter: 'ק', name: 'Qof', phonetic: 'KOHF', ipaSound: 'k', audioUrl: '/audio/hebrew/qof.mp3' },
    { letter: 'ר', name: 'Resh', phonetic: 'RESH', ipaSound: 'ʁ', audioUrl: '/audio/hebrew/resh.mp3' },
    { letter: 'ש', name: 'Shin', phonetic: 'SHEEN', ipaSound: 'ʃ', audioUrl: '/audio/hebrew/shin.mp3' },
    { letter: 'ת', name: 'Tav', phonetic: 'TAHV', ipaSound: 't', audioUrl: '/audio/hebrew/tav.mp3' },
];

// 72 Names of God with audio URLs
// Basado en la división del Tetragramaton en Éxodo 14:19-21
export const names72Audio = [
    { num: 1, letters: 'והו', phonetic: 'VAV-HEY-VAV', audioUrl: '/audio/hebrew/72names/1-vhv.mp3' },
    { num: 2, letters: 'ילי', phonetic: 'YOD-LAMED-YOD', audioUrl: '/audio/hebrew/72names/2-yly.mp3' },
    { num: 3, letters: 'סיט', phonetic: 'SAMECH-YOD-TET', audioUrl: '/audio/hebrew/72names/3-syt.mp3' },
    { num: 4, letters: 'עלם', phonetic: 'AYIN-LAMED-MEM', audioUrl: '/audio/hebrew/72names/4-elm.mp3' },
    { num: 5, letters: 'מהש', phonetic: 'MEM-HEY-SHIN', audioUrl: '/audio/hebrew/72names/5-mhs.mp3' },
    { num: 6, letters: 'ללה', phonetic: 'LAMED-LAMED-HEY', audioUrl: '/audio/hebrew/72names/6-llh.mp3' },
    { num: 7, letters: 'אכא', phonetic: 'ALEF-KAF-ALEF', audioUrl: '/audio/hebrew/72names/7-aka.mp3' },
    { num: 8, letters: 'כהת', phonetic: 'KAF-HEY-TAV', audioUrl: '/audio/hebrew/72names/8-kht.mp3' },
    { num: 9, letters: 'הזי', phonetic: 'HEY-ZAYIN-YOD', audioUrl: '/audio/hebrew/72names/9-hzy.mp3' },
    { num: 10, letters: 'אלד', phonetic: 'ALEF-LAMED-DALET', audioUrl: '/audio/hebrew/72names/10-ald.mp3' },
    { num: 11, letters: 'לאו', phonetic: 'LAMED-ALEF-VAV', audioUrl: '/audio/hebrew/72names/11-lav.mp3' },
    { num: 12, letters: 'ההע', phonetic: 'HEY-HEY-AYIN', audioUrl: '/audio/hebrew/72names/12-hha.mp3' },
    { num: 13, letters: 'יזל', phonetic: 'YOD-ZAYIN-LAMED', audioUrl: '/audio/hebrew/72names/13-yzl.mp3' },
    { num: 14, letters: 'מבה', phonetic: 'MEM-BET-HEY', audioUrl: '/audio/hebrew/72names/14-mbh.mp3' },
    { num: 15, letters: 'הרי', phonetic: 'HEY-RESH-YOD', audioUrl: '/audio/hebrew/72names/15-hry.mp3' },
    { num: 16, letters: 'הקם', phonetic: 'HEY-QOF-MEM', audioUrl: '/audio/hebrew/72names/16-hqm.mp3' },
    { num: 17, letters: 'לאו', phonetic: 'LAMED-ALEF-VAV', audioUrl: '/audio/hebrew/72names/17-lav.mp3' },
    { num: 18, letters: 'כלי', phonetic: 'KAF-LAMED-YOD', audioUrl: '/audio/hebrew/72names/18-kly.mp3' },
    { num: 19, letters: 'לוו', phonetic: 'LAMED-VAV-VAV', audioUrl: '/audio/hebrew/72names/19-lvv.mp3' },
    { num: 20, letters: 'פהל', phonetic: 'PEH-HEY-LAMED', audioUrl: '/audio/hebrew/72names/20-phl.mp3' },
    { num: 21, letters: 'נלך', phonetic: 'NUN-LAMED-KAF', audioUrl: '/audio/hebrew/72names/21-nlk.mp3' },
    { num: 22, letters: 'ייי', phonetic: 'YOD-YOD-YOD', audioUrl: '/audio/hebrew/72names/22-yyy.mp3' },
    { num: 23, letters: 'מלה', phonetic: 'MEM-LAMED-HEY', audioUrl: '/audio/hebrew/72names/23-mlh.mp3' },
    { num: 24, letters: 'חהו', phonetic: 'CHET-HEY-VAV', audioUrl: '/audio/hebrew/72names/24-chv.mp3' },
    { num: 25, letters: 'נתה', phonetic: 'NUN-TAV-HEY', audioUrl: '/audio/hebrew/72names/25-nth.mp3' },
    { num: 26, letters: 'האא', phonetic: 'HEY-ALEF-ALEF', audioUrl: '/audio/hebrew/72names/26-haa.mp3' },
    { num: 27, letters: 'ירת', phonetic: 'YOD-RESH-TAV', audioUrl: '/audio/hebrew/72names/27-yrt.mp3' },
    { num: 28, letters: 'שאה', phonetic: 'SHIN-ALEF-HEY', audioUrl: '/audio/hebrew/72names/28-sah.mp3' },
    { num: 29, letters: 'ריי', phonetic: 'RESH-YOD-YOD', audioUrl: '/audio/hebrew/72names/29-ryy.mp3' },
    { num: 30, letters: 'אום', phonetic: 'ALEF-VAV-MEM', audioUrl: '/audio/hebrew/72names/30-avm.mp3' },
    { num: 31, letters: 'לכב', phonetic: 'LAMED-KAF-BET', audioUrl: '/audio/hebrew/72names/31-lkb.mp3' },
    { num: 32, letters: 'ושר', phonetic: 'VAV-SHIN-RESH', audioUrl: '/audio/hebrew/72names/32-vsr.mp3' },
    { num: 33, letters: 'יחו', phonetic: 'YOD-CHET-VAV', audioUrl: '/audio/hebrew/72names/33-ychv.mp3' },
    { num: 34, letters: 'להח', phonetic: 'LAMED-HEY-CHET', audioUrl: '/audio/hebrew/72names/34-lhch.mp3' },
    { num: 35, letters: 'כוק', phonetic: 'KAF-VAV-QOF', audioUrl: '/audio/hebrew/72names/35-kvq.mp3' },
    { num: 36, letters: 'מנד', phonetic: 'MEM-NUN-DALET', audioUrl: '/audio/hebrew/72names/36-mnd.mp3' },
    { num: 37, letters: 'אני', phonetic: 'ALEF-NUN-YOD', audioUrl: '/audio/hebrew/72names/37-any.mp3' },
    { num: 38, letters: 'חעם', phonetic: 'CHET-AYIN-MEM', audioUrl: '/audio/hebrew/72names/38-cha.mp3' },
    { num: 39, letters: 'רהע', phonetic: 'RESH-HEY-AYIN', audioUrl: '/audio/hebrew/72names/39-rha.mp3' },
    { num: 40, letters: 'ייז', phonetic: 'YOD-YOD-ZAYIN', audioUrl: '/audio/hebrew/72names/40-yyz.mp3' },
    { num: 41, letters: 'ההה', phonetic: 'HEY-HEY-HEY', audioUrl: '/audio/hebrew/72names/41-hhh.mp3' },
    { num: 42, letters: 'מיך', phonetic: 'MEM-YOD-KAF', audioUrl: '/audio/hebrew/72names/42-myk.mp3' },
    { num: 43, letters: 'וול', phonetic: 'VAV-VAV-LAMED', audioUrl: '/audio/hebrew/72names/43-vvl.mp3' },
    { num: 44, letters: 'ילה', phonetic: 'YOD-LAMED-HEY', audioUrl: '/audio/hebrew/72names/44-ylh.mp3' },
    { num: 45, letters: 'סאל', phonetic: 'SAMECH-ALEF-LAMED', audioUrl: '/audio/hebrew/72names/45-sal.mp3' },
    { num: 46, letters: 'ערי', phonetic: 'AYIN-RESH-YOD', audioUrl: '/audio/hebrew/72names/46-ary.mp3' },
    { num: 47, letters: 'עשל', phonetic: 'AYIN-SHIN-LAMED', audioUrl: '/audio/hebrew/72names/47-asl.mp3' },
    { num: 48, letters: 'מיה', phonetic: 'MEM-YOD-HEY', audioUrl: '/audio/hebrew/72names/48-myh.mp3' },
    { num: 49, letters: 'והו', phonetic: 'VAV-HEY-VAV', audioUrl: '/audio/hebrew/72names/49-vhv.mp3' },
    { num: 50, letters: 'דני', phonetic: 'DALET-NUN-YOD', audioUrl: '/audio/hebrew/72names/50-dny.mp3' },
    { num: 51, letters: 'חשה', phonetic: 'CHET-SHIN-HEY', audioUrl: '/audio/hebrew/72names/51-chsh.mp3' },
    { num: 52, letters: 'עמם', phonetic: 'AYIN-MEM-MEM', audioUrl: '/audio/hebrew/72names/52-amm.mp3' },
    { num: 53, letters: 'ננא', phonetic: 'NUN-NUN-ALEF', audioUrl: '/audio/hebrew/72names/53-nna.mp3' },
    { num: 54, letters: 'נית', phonetic: 'NUN-YOD-TAV', audioUrl: '/audio/hebrew/72names/54-nyt.mp3' },
    { num: 55, letters: 'מבה', phonetic: 'MEM-BET-HEY', audioUrl: '/audio/hebrew/72names/55-mbh.mp3' },
    { num: 56, letters: 'פוי', phonetic: 'PEH-VAV-YOD', audioUrl: '/audio/hebrew/72names/56-pvy.mp3' },
    { num: 57, letters: 'ננם', phonetic: 'NUN-NUN-MEM', audioUrl: '/audio/hebrew/72names/57-nnm.mp3' },
    { num: 58, letters: 'ייל', phonetic: 'YOD-YOD-LAMED', audioUrl: '/audio/hebrew/72names/58-yyl.mp3' },
    { num: 59, letters: 'הרח', phonetic: 'HEY-RESH-CHET', audioUrl: '/audio/hebrew/72names/59-hrch.mp3' },
    { num: 60, letters: 'מצר', phonetic: 'MEM-TSADI-RESH', audioUrl: '/audio/hebrew/72names/60-mtsr.mp3' },
    { num: 61, letters: 'ומב', phonetic: 'VAV-MEM-BET', audioUrl: '/audio/hebrew/72names/61-vmb.mp3' },
    { num: 62, letters: 'יהה', phonetic: 'YOD-HEY-HEY', audioUrl: '/audio/hebrew/72names/62-yhh.mp3' },
    { num: 63, letters: 'ענו', phonetic: 'AYIN-NUN-VAV', audioUrl: '/audio/hebrew/72names/63-anv.mp3' },
    { num: 64, letters: 'מחי', phonetic: 'MEM-CHET-YOD', audioUrl: '/audio/hebrew/72names/64-mchy.mp3' },
    { num: 65, letters: 'דמב', phonetic: 'DALET-MEM-BET', audioUrl: '/audio/hebrew/72names/65-dmb.mp3' },
    { num: 66, letters: 'מנק', phonetic: 'MEM-NUN-QOF', audioUrl: '/audio/hebrew/72names/66-mnq.mp3' },
    { num: 67, letters: 'איע', phonetic: 'ALEF-YOD-AYIN', audioUrl: '/audio/hebrew/72names/67-aya.mp3' },
    { num: 68, letters: 'חבו', phonetic: 'CHET-BET-VAV', audioUrl: '/audio/hebrew/72names/68-chbv.mp3' },
    { num: 69, letters: 'ראה', phonetic: 'RESH-ALEF-HEY', audioUrl: '/audio/hebrew/72names/69-rah.mp3' },
    { num: 70, letters: 'יבם', phonetic: 'YOD-BET-MEM', audioUrl: '/audio/hebrew/72names/70-ybm.mp3' },
    { num: 71, letters: 'היי', phonetic: 'HEY-YOD-YOD', audioUrl: '/audio/hebrew/72names/71-hyy.mp3' },
    { num: 72, letters: 'מום', phonetic: 'MEM-VAV-MEM', audioUrl: '/audio/hebrew/72names/72-mvm.mp3' },
];

/**
 * Get audio URL for a Hebrew letter
 * Falls back to speech synthesis if no audio file
 */
export function getLetterAudio(letterName: string): HebrewLetterAudio | undefined {
    return hebrewLetterAudio.find(l =>
        l.name.toLowerCase() === letterName.toLowerCase() ||
        l.letter === letterName
    );
}

/**
 * Check if audio files exist (for fallback to speech synthesis)
 */
export async function checkAudioAvailable(url: string): Promise<boolean> {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok;
    } catch {
        return false;
    }
}

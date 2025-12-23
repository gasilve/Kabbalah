export interface JewishDate {
    gy: number; // Gregorian Year
    gm: number; // Gregorian Month
    gd: number; // Gregorian Day
    hy: number; // Hebrew Year
    hm: string; // Hebrew Month
    hd: number; // Hebrew Day
    hebrew: string; // Hebrew date string (in Hebrew)
    events: string[]; // Holidays/Parasha
    issur_melacha?: boolean; // Forbidden work?
}

export async function getJewishDate(): Promise<JewishDate | null> {
    try {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const day = today.getDate();

        // Fetch from Hebcal API
        const response = await fetch(
            `https://www.hebcal.com/converter?cfg=json&gy=${year}&gm=${month}&gd=${day}&g2h=1`
        );

        if (!response.ok) return null;

        const data = await response.json();

        return {
            gy: data.gy,
            gm: data.gm,
            gd: data.gd,
            hy: data.hy,
            hm: data.hm,
            hd: data.hd,
            hebrew: data.hebrew,
            events: data.events || [],
        };
    } catch (error) {
        console.error("Error fetching Jewish date:", error);
        return null;
    }
}

export async function getZmanim(latitude: number, longitude: number): Promise<any> {
    // Placeholder for Zmanim (Prayer times)
    // Would require a more complex API call to Hebcal or similar
    return {};
}

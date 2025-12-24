import { getRequestConfig } from 'next-intl/server';

export const locales = ['es', 'en', 'he'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'es';

export default getRequestConfig(async ({ locale }) => {
    const resolvedLocale = locale ?? defaultLocale;
    return {
        locale: resolvedLocale,
        messages: (await import(`./locales/${resolvedLocale}.json`)).default
    };
});

import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
    // All supported locales
    locales: ['en', 'ja', 'zh', 'ar', 'es', 'fr'],

    // Used when no locale matches
    defaultLocale: 'en'
});

export const config = {
    // Match only internationalized pathnames
    matcher: ['/', '/(ja|en|zh|ar|es|fr)/:path*']
};

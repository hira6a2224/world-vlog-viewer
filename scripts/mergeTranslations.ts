import * as fs from 'fs';
import * as path from 'path';

const messagesDir = path.join(process.cwd(), 'src/messages');
const enPlaces = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'scripts/en_places.json'), 'utf-8'));
const jaPlaces = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'scripts/ja_places.json'), 'utf-8'));

const locales = ['en', 'ja', 'zh', 'ar', 'es', 'fr'];

locales.forEach(locale => {
    const file = path.join(messagesDir, `${locale}.json`);
    const content = JSON.parse(fs.readFileSync(file, 'utf-8'));

    const placesToUse = locale === 'ja' ? jaPlaces : enPlaces;

    content.Index.areas = placesToUse.areas;
    content.Index.countries = placesToUse.countries;
    content.Index.cities = placesToUse.cities;

    fs.writeFileSync(file, JSON.stringify(content, null, 2));
    console.log(`Updated ${locale}.json`);
});

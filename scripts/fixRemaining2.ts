import * as fs from 'fs';
import * as path from 'path';

// Fix countryData.ts
const cdPath = path.join(process.cwd(), 'src/lib/countryData.ts');
let cdContent = fs.readFileSync(cdPath, 'utf-8');
cdContent = cdContent.replace(/{\s*name:\s*'([^']+)',\s*nameJa:\s*'([^']+)',/g, (match, n1) => {
    let cityId = n1.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return `{ id: '${cityId}',`;
});
fs.writeFileSync(cdPath, cdContent);

// Fix LeafletMap.tsx
const lmPath = path.join(process.cwd(), 'src/components/LeafletMap.tsx');
let lmContent = fs.readFileSync(lmPath, 'utf-8');
lmContent = lmContent.replace(/country\.name/g, 't(`countries.${country.code}`)');
lmContent = lmContent.replace(/city\.name/g, 't(`cities.${city.id}`)');
lmContent = lmContent.replace(/city\.nameJa/g, 't(`cities.${city.id}`)');
lmContent = lmContent.replace(/currentLocale\s*===\s*'ja'\s*\?\s*t\(\`cities\.\$\{city\.id\}\`\)\s*:\s*t\(\`cities\.\$\{city\.id\}\`\)/g, 't(`cities.${city.id}`)');
fs.writeFileSync(lmPath, lmContent);

// Fix page.tsx
const pagePath = path.join(process.cwd(), 'src/app/[locale]/page.tsx');
let pageContent = fs.readFileSync(pagePath, 'utf-8');
// Line 286: setSelectedCity({ name: cityName, nameJa: cityName, lat, lng, localKeywords: [] });
pageContent = pageContent.replace(/setSelectedCity\(\{ name: cityName, nameJa: cityName,/g, 'setSelectedCity({ id: cityName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),');
// Line 308: c.cities.some(ci => ci.name === city.name)
pageContent = pageContent.replace(/ci\.name === city\.name/g, 'ci.id === city.id');
// Line 452: key={city.name}
pageContent = pageContent.replace(/key=\{city\.name\}/g, 'key={city.id}');
// Line 666: {currentLocale === 'ja' ? selectedCity.nameJa : selectedCity.name}
pageContent = pageContent.replace(/currentLocale === 'ja' \? selectedCity\.nameJa : selectedCity\.name/g, 't(`cities.${selectedCity.id}`)');
pageContent = pageContent.replace(/selectedCity\.nameJa/g, 't(`cities.${selectedCity.id}`)');
pageContent = pageContent.replace(/selectedCity\.name/g, 't(`cities.${selectedCity.id}`)');

fs.writeFileSync(pagePath, pageContent);

console.log("Fixed more errors");

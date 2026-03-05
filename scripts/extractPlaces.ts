import * as fs from 'fs';
import * as path from 'path';

// Read the original file
const originalFilePath = path.join(process.cwd(), 'src/lib/countryData.ts');
let content = fs.readFileSync(originalFilePath, 'utf-8');

const enDict: any = { areas: {}, countries: {}, cities: {} };
const jaDict: any = { areas: {}, countries: {}, cities: {} };

let updatedContent = content;

// Replace Area names
updatedContent = updatedContent.replace(/id: '([^']+)',\s*name: '([^']+)',\s*nameJa: '([^']+)',/g, (match, id, name, nameJa) => {
    enDict.areas[id] = name;
    jaDict.areas[id] = nameJa;
    return `id: '${id}',`;
});

// Replace Country names
updatedContent = updatedContent.replace(/code: '([^']+)',\s*name: '([^']+)',\s*nameJa: '([^']+)',/g, (match, code, name, nameJa) => {
    enDict.countries[code] = name;
    jaDict.countries[code] = nameJa;
    return `code: '${code}',`;
});

// Replace City names
// City currently has: { name: 'Tokyo', nameJa: '東京', lat: ... }
let cityIdCounter = 0;
updatedContent = updatedContent.replace(/{\s*name:\s*'([^']+)',\s*nameJa:\s*'([^']+)',/g, (match, name, nameJa) => {
    let cityId = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    if (enDict.cities[cityId] && enDict.cities[cityId] !== name) {
        cityId = `${cityId}-${++cityIdCounter}`;
    }
    enDict.cities[cityId] = name;
    jaDict.cities[cityId] = nameJa;
    return `{ id: '${cityId}',`;
});

// Update interfaces
updatedContent = updatedContent.replace(/name: string;\s*nameJa: string;/g, '');
updatedContent = updatedContent.replace(/export interface City {/, 'export interface City {\n    id: string;');

fs.writeFileSync(originalFilePath.replace('.ts', '.updated.ts'), updatedContent);
fs.writeFileSync(path.join(process.cwd(), 'scripts', 'en_places.json'), JSON.stringify(enDict, null, 2));
fs.writeFileSync(path.join(process.cwd(), 'scripts', 'ja_places.json'), JSON.stringify(jaDict, null, 2));

console.log("Extraction complete.");

import * as fs from 'fs';
import * as path from 'path';

// Fix countryData.ts
const cdPath = path.join(process.cwd(), 'src/lib/countryData.ts');
let cdContent = fs.readFileSync(cdPath, 'utf-8');
cdContent = cdContent.replace(/{\s*name:\s*'([^']+)',\s*nameJa:\s*'([^']+)',/g, (match, n1) => {
    let cityId = n1.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return `{ id: '${cityId}',`;
});
// Handle Xi'an specifically
cdContent = cdContent.replace(/{\s*name:\s*'Xi\\'an',\s*nameJa:\s*'西安',/g, `{ id: 'xi-an',`);

fs.writeFileSync(cdPath, cdContent);

// Fix page.tsx
const pagePath = path.join(process.cwd(), 'src/app/[locale]/page.tsx');
let pageContent = fs.readFileSync(pagePath, 'utf-8');

// Line 308: nearestCity.name
pageContent = pageContent.replace(/\$\{nearestCity\.name\}/g, '${t(`cities.${nearestCity.id}`)}');

// Line 452: ci.name === city.name
pageContent = pageContent.replace(/ci\.name === city\.name/g, 'ci.id === city.id');
pageContent = pageContent.replace(/city\.name/g, 'city.id'); // catch-all for remaining `city.name`

fs.writeFileSync(pagePath, pageContent);

console.log("Fixed final reference errors");

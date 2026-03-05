import * as fs from 'fs';
import * as path from 'path';

const cdPath = path.join(process.cwd(), 'src/lib/countryData.ts');
let cdContent = fs.readFileSync(cdPath, 'utf-8');

// Fix interface Area
cdContent = cdContent.replace(/name:\s*string;\s*\/\/.*?\n/g, '');
cdContent = cdContent.replace(/nameJa:\s*string;\s*\/\/.*?\n/g, '');
cdContent = cdContent.replace(/name:\s*string;\s*\n/g, '');
cdContent = cdContent.replace(/nameJa:\s*string;\s*\n/g, '');
// just in case they are side by side without comments
cdContent = cdContent.replace(/name:\s*string;/g, '');
cdContent = cdContent.replace(/nameJa:\s*string;/g, '');

fs.writeFileSync(cdPath, cdContent);

const pagePath = path.join(process.cwd(), 'src/app/[locale]/page.tsx');
let pageContent = fs.readFileSync(pagePath, 'utf-8');

// Fix handleCityClick's `q: city.name`
// We should get the city name from `t("cities." + city.id)` but inside `handleCityClick` it's not a React node, we can just use `t(\`cities.\${city.id}\`)`.
pageContent = pageContent.replace(/q:\s*city\.name,/g, 'q: t(`cities.${city.id}`),');

// Fix setMapClickLocation(cityName);
// If there are other city.name issues:
pageContent = pageContent.replace(/city\.name/g, 't(`cities.${city.id}`)');
pageContent = pageContent.replace(/city\.countryName/g, 't(`countries.${city.countryCode||city.regionCode}`)');

// Fix area.name
pageContent = pageContent.replace(/area\.name/g, 't(`areas.${area.id}`)');
pageContent = pageContent.replace(/area\.nameJa/g, 't(`areas.${area.id}`)'); // We don't have nameJa anymore

// Fix country.name
pageContent = pageContent.replace(/country\.name/g, 't(`countries.${country.code}`)');
pageContent = pageContent.replace(/country\.nameJa/g, 't(`countries.${country.code}`)');

fs.writeFileSync(pagePath, pageContent);

console.log("Fixed interfaces and page.tsx remaining type errors.");

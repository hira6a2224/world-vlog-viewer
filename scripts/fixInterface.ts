import * as fs from 'fs';
import * as path from 'path';

const cdPath = path.join(process.cwd(), 'src/lib/countryData.ts');
let cdContent = fs.readFileSync(cdPath, 'utf-8');

// The regex previously failed to match multi-line interface properties
cdContent = cdContent.replace(/\s*name:\s*string;\s*nameJa:\s*string;/g, '');

// Also fix the stray countryName in getNearestCity returns
cdContent = cdContent.replace(/countryName:\s*best\.country\.name,/g, 'countryCode: best.country.code,');

fs.writeFileSync(cdPath, cdContent);
console.log("Fixed interfaces in countryData.ts");

import * as fs from 'fs';
import * as path from 'path';

// Fix countryData.ts
const cdPath = path.join(process.cwd(), 'src/lib/countryData.ts');
let cdContent = fs.readFileSync(cdPath, 'utf-8');

// Replace countryName with countryCode in getAllCities
cdContent = cdContent.replace(
    /countryName:\s*country\.name,/g,
    'countryCode: country.code,'
);
// Replace countryName in interface
cdContent = cdContent.replace(
    /city:\s*City\s*&\s*{\s*countryName:\s*string;/g,
    'city: City & { countryCode: string;'
);
cdContent = cdContent.replace(
    /Array<City\s*&\s*{\s*countryName:\s*string;/g,
    'Array<City & { countryCode: string;'
);

fs.writeFileSync(cdPath, cdContent);

// Fix page.tsx
const pagePath = path.join(process.cwd(), 'src/app/[locale]/page.tsx');
let pageContent = fs.readFileSync(pagePath, 'utf-8');

// Replace all nameJa combinations with t(`...`) logic
// Note: We'll just replace the dynamic evaluation blocks with t(`type.id`) where type is area, country, city
// The script might be a bit complicated, so let me do it carefully.

// area name display:
pageContent = pageContent.replace(/currentLocale === 'ja' \? area\.nameJa : area\.name/g, 't(`areas.${area.id}`)');
pageContent = pageContent.replace(/currentLocale === 'ja' \? selectedArea\?\.nameJa : selectedArea\?\.name/g, 'selectedArea ? t(`areas.${selectedArea.id}`) : \'\'');

// country name display:
pageContent = pageContent.replace(/currentLocale === 'ja' \? country\.nameJa : country\.name/g, 't(`countries.${country.code}`)');
pageContent = pageContent.replace(/currentLocale === 'ja' \? selectedCountry\.nameJa : selectedCountry\.name/g, 't(`countries.${selectedCountry.code}`)');
pageContent = pageContent.replace(/currentLocale === 'ja' \? country\?\.nameJa : country\?\.name \|\| city\.countryName/g, 'country ? t(`countries.${country.code}`) : t(`countries.${city.regionCode}`)');
pageContent = pageContent.replace(/currentLocale === 'ja' \? country\?\.nameJa : country\?\.name/g, 'country ? t(`countries.${country.code}`) : \'\'');

// city name display:
pageContent = pageContent.replace(/currentLocale === 'ja' \? city\.nameJa : city\.name/g, 't(`cities.${city.id}`)');
pageContent = pageContent.replace(/currentLocale === 'ja' \? city\.name : city\.nameJa/g, 'currentLocale === \'ja\' ? t(`cities.${city.id}`) : t(`cities.${city.id}`)'); // Temporary fix, should ideally just be t(`cities.${city.id}`) but I'll leave both as t for now. Actually, city.name and nameJa are gone!
pageContent = pageContent.replace(/currentLocale === 'ja' \? selectedCity\?\.nameJa : selectedCity\?\.name/g, 'selectedCity ? t(`cities.${selectedCity.id}`) : \'\'');
pageContent = pageContent.replace(/currentLocale === 'ja' \? selectedCity\?\.nameJa \|\| '' : selectedCity\?\.name \|\| ''/g, 'selectedCity ? t(`cities.${selectedCity.id}`) : \'\'');

// Search filtering logic:
// Replace filteredCities logic
const filterLogicBlock = `
  const filteredCities = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return allCities.filter(c => {
      const cityName = t(\`cities.\${c.id}\`).toLowerCase();
      const cnName = t(\`countries.\${c.countryCode || c.regionCode}\`).toLowerCase();
      return cityName.includes(q) || cnName.includes(q);
    }).slice(0, 8);
  }, [searchQuery, allCities, t]);
`;

// Find where filteredCities is
pageContent = pageContent.replace(/const filteredCities = useMemo\(\(\) => {[\s\S]*?}, \[searchQuery, allCities\]\);/, filterLogicBlock.trim());

fs.writeFileSync(pagePath, pageContent);

console.log("Replacements complete.");

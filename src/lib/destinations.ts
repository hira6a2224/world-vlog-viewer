// Curated list of popular walking tour destinations
export interface Destination {
    name: string;
    nameJa: string;
    nameFr: string;
    lat: number;
    lng: number;
    query: string;
    region: 'asia' | 'europe' | 'americas' | 'africa' | 'oceania';
}

export const DESTINATIONS: Destination[] = [
    // Asia
    { name: 'Tokyo, Japan', nameJa: '東京', nameFr: 'Tokyo, Japon', lat: 35.6762, lng: 139.6503, query: 'Tokyo', region: 'asia' },
    { name: 'Kyoto, Japan', nameJa: '京都', nameFr: 'Kyoto, Japon', lat: 35.0116, lng: 135.7681, query: 'Kyoto', region: 'asia' },
    { name: 'Osaka, Japan', nameJa: '大阪', nameFr: 'Osaka, Japon', lat: 34.6937, lng: 135.5023, query: 'Osaka', region: 'asia' },
    { name: 'Seoul, South Korea', nameJa: 'ソウル', nameFr: 'Séoul, Corée du Sud', lat: 37.5665, lng: 126.9780, query: 'Seoul', region: 'asia' },
    { name: 'Bangkok, Thailand', nameJa: 'バンコク', nameFr: 'Bangkok, Thaïlande', lat: 13.7563, lng: 100.5018, query: 'Bangkok', region: 'asia' },
    { name: 'Singapore', nameJa: 'シンガポール', nameFr: 'Singapour', lat: 1.3521, lng: 103.8198, query: 'Singapore', region: 'asia' },
    { name: 'Hong Kong', nameJa: '香港', nameFr: 'Hong Kong', lat: 22.3193, lng: 114.1694, query: 'Hong Kong', region: 'asia' },
    { name: 'Dubai, UAE', nameJa: 'ドバイ', nameFr: 'Dubaï, EAU', lat: 25.2048, lng: 55.2708, query: 'Dubai', region: 'asia' },

    // Europe
    { name: 'Paris, France', nameJa: 'パリ', nameFr: 'Paris, France', lat: 48.8566, lng: 2.3522, query: 'Paris', region: 'europe' },
    { name: 'London, UK', nameJa: 'ロンドン', nameFr: 'Londres, Royaume-Uni', lat: 51.5074, lng: -0.1278, query: 'London', region: 'europe' },
    { name: 'Rome, Italy', nameJa: 'ローマ', nameFr: 'Rome, Italie', lat: 41.9028, lng: 12.4964, query: 'Rome', region: 'europe' },
    { name: 'Barcelona, Spain', nameJa: 'バルセロナ', nameFr: 'Barcelone, Espagne', lat: 41.3874, lng: 2.1686, query: 'Barcelona', region: 'europe' },
    { name: 'Amsterdam, Netherlands', nameJa: 'アムステルダム', nameFr: 'Amsterdam, Pays-Bas', lat: 52.3676, lng: 4.9041, query: 'Amsterdam', region: 'europe' },
    { name: 'Prague, Czech Republic', nameJa: 'プラハ', nameFr: 'Prague, République tchèque', lat: 50.0755, lng: 14.4378, query: 'Prague', region: 'europe' },
    { name: 'Istanbul, Turkey', nameJa: 'イスタンブール', nameFr: 'Istanbul, Turquie', lat: 41.0082, lng: 28.9784, query: 'Istanbul', region: 'europe' },

    // Americas
    { name: 'New York, USA', nameJa: 'ニューヨーク', nameFr: 'New York, États-Unis', lat: 40.7128, lng: -74.0060, query: 'New York City', region: 'americas' },
    { name: 'Los Angeles, USA', nameJa: 'ロサンゼルス', nameFr: 'Los Angeles, États-Unis', lat: 34.0522, lng: -118.2437, query: 'Los Angeles', region: 'americas' },
    { name: 'Rio de Janeiro, Brazil', nameJa: 'リオデジャネイロ', nameFr: 'Rio de Janeiro, Brésil', lat: -22.9068, lng: -43.1729, query: 'Rio de Janeiro', region: 'americas' },
    { name: 'Buenos Aires, Argentina', nameJa: 'ブエノスアイレス', nameFr: 'Buenos Aires, Argentine', lat: -34.6037, lng: -58.3816, query: 'Buenos Aires', region: 'americas' },
    { name: 'Mexico City, Mexico', nameJa: 'メキシコシティ', nameFr: 'Mexico, Mexique', lat: 19.4326, lng: -99.1332, query: 'Mexico City', region: 'americas' },

    // Africa & Oceania
    { name: 'Marrakech, Morocco', nameJa: 'マラケシュ', nameFr: 'Marrakech, Maroc', lat: 31.6295, lng: -7.9811, query: 'Marrakech', region: 'africa' },
    { name: 'Cape Town, South Africa', nameJa: 'ケープタウン', nameFr: 'Le Cap, Afrique du Sud', lat: -33.9249, lng: 18.4241, query: 'Cape Town', region: 'africa' },
    { name: 'Sydney, Australia', nameJa: 'シドニー', nameFr: 'Sydney, Australie', lat: -33.8688, lng: 151.2093, query: 'Sydney', region: 'oceania' },
];

export function getRandomDestination(exclude?: string): Destination {
    const filtered = exclude
        ? DESTINATIONS.filter(d => d.name !== exclude)
        : DESTINATIONS;
    return filtered[Math.floor(Math.random() * filtered.length)];
}

export function searchDestinations(query: string): Destination[] {
    const lowerQuery = query.toLowerCase();
    return DESTINATIONS.filter(d =>
        d.name.toLowerCase().includes(lowerQuery) ||
        d.nameJa.includes(query) ||
        d.nameFr.toLowerCase().includes(lowerQuery) ||
        d.query.toLowerCase().includes(lowerQuery)
    );
}

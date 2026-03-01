// Country data for hierarchical drill-down UI
// Includes local language keywords for improved YouTube search accuracy
// Selection criteria: rich YouTube Vlog content, popular travel destinations, cultural diversity per area

export interface Country {
    code: string;       // ISO country code
           // English name
         // Japanese name
    flag: string;       // Flag emoji
    lat: number;
    lng: number;
    zoom: number;       // Leaflet zoom level when selected
    regionCode: string; // YouTube API regionCode
    cities: City[];
}

export interface City {
    id: string;
    
    lat: number;
    lng: number;
    // Local language search keywords for YouTube
    localKeywords: string[];
}

export interface Area {
    id: string;
    
    icon: string;
    // Center coordinates for map zoom
    lat: number;
    lng: number;
    zoom: number;
    countries: Country[];
}

export const AREAS: Area[] = [
    // ══════════════════════════════════════
    // 東アジア (10 countries)
    // ══════════════════════════════════════
    {
        id: 'east-asia',
        icon: '🏯',
        lat: 35.0,
        lng: 110.0,
        zoom: 4,
        countries: [
            {
                code: 'JP', flag: '🇯🇵',
                lat: 36.2048, lng: 138.2529, zoom: 6, regionCode: 'JP',
                cities: [
                    { id: 'tokyo', lat: 35.6762, lng: 139.6503, localKeywords: ['東京 散歩 vlog', 'Tokyo walking tour 4K'] },
                    { id: 'kyoto', lat: 35.0116, lng: 135.7681, localKeywords: ['京都 散歩 vlog', 'Kyoto walking tour'] },
                    { id: 'osaka', lat: 34.6937, lng: 135.5023, localKeywords: ['大阪 散歩 vlog', 'Osaka walking tour'] },
                    { id: 'hokkaido', lat: 43.2203, lng: 142.8635, localKeywords: ['北海道 vlog', 'Hokkaido travel vlog'] },
                ],
            },
            {
                code: 'KR', flag: '🇰🇷',
                lat: 36.5, lng: 127.8, zoom: 7, regionCode: 'KR',
                cities: [
                    { id: 'seoul', lat: 37.5665, lng: 126.9780, localKeywords: ['서울 산책 브이로그', 'Seoul walking tour 4K'] },
                    { id: 'busan', lat: 35.1796, lng: 129.0756, localKeywords: ['부산 브이로그', 'Busan walking tour'] },
                    { id: 'jeonju', lat: 35.8242, lng: 127.1480, localKeywords: ['전주 한옥마을 vlog', 'Jeonju walking tour'] },
                ],
            },
            {
                code: 'CN', flag: '🇨🇳',
                lat: 35.8617, lng: 104.1954, zoom: 4, regionCode: 'CN',
                cities: [
                    { id: 'beijing', lat: 39.9042, lng: 116.4074, localKeywords: ['北京 漫步 vlog', 'Beijing walking tour 4K'] },
                    { id: 'shanghai', lat: 31.2304, lng: 121.4737, localKeywords: ['上海 散步 vlog', 'Shanghai walking tour'] },
                    { id: 'chengdu', lat: 30.5728, lng: 104.0668, localKeywords: ['成都 散步 vlog', 'Chengdu walking tour'] },
                    { id: 'xi-an', lat: 34.3416, lng: 108.9398, localKeywords: ['西安 漫步 vlog', 'Xi\'an walking tour'] },
                ],
            },
            {
                code: 'TW', flag: '🇹🇼',
                lat: 23.6978, lng: 120.9605, zoom: 7, regionCode: 'TW',
                cities: [
                    { id: 'taipei', lat: 25.0330, lng: 121.5654, localKeywords: ['台北 散步 vlog', 'Taipei walking tour 4K'] },
                    { id: 'tainan', lat: 22.9999, lng: 120.2270, localKeywords: ['台南 散步 vlog', 'Tainan walking tour'] },
                ],
            },
            {
                code: 'HK', flag: '🇭🇰',
                lat: 22.3193, lng: 114.1694, zoom: 10, regionCode: 'HK',
                cities: [
                    { id: 'hong-kong', lat: 22.3193, lng: 114.1694, localKeywords: ['香港 散步 vlog', 'Hong Kong walking tour 4K'] },
                ],
            },
            {
                code: 'MO', flag: '🇲🇴',
                lat: 22.1987, lng: 113.5439, zoom: 12, regionCode: 'MO',
                cities: [
                    { id: 'macau', lat: 22.1987, lng: 113.5439, localKeywords: ['澳門 散步 vlog', 'Macau walking tour'] },
                ],
            },
            {
                code: 'MN', flag: '🇲🇳',
                lat: 46.8625, lng: 103.8467, zoom: 5, regionCode: 'MN',
                cities: [
                    { id: 'ulaanbaatar', lat: 47.8864, lng: 106.9057, localKeywords: ['Ulaanbaatar walking tour vlog', 'Mongolia travel vlog'] },
                ],
            },
            {
                code: 'KP', flag: '🇰🇵',
                lat: 40.3399, lng: 127.5101, zoom: 6, regionCode: 'KP',
                cities: [
                    { id: 'pyongyang', lat: 39.0392, lng: 125.7625, localKeywords: ['Pyongyang DPRK travel vlog', 'North Korea tour documentary'] },
                ],
            },
            {
                code: 'PH', flag: '🇵🇭',
                lat: 12.8797, lng: 121.7740, zoom: 5, regionCode: 'PH',
                cities: [
                    { id: 'manila', lat: 14.5995, lng: 120.9842, localKeywords: ['Manila walking tour vlog 4K'] },
                    { id: 'palawan', lat: 9.8349, lng: 118.7384, localKeywords: ['Palawan Philippines travel vlog'] },
                    { id: 'cebu', lat: 10.3157, lng: 123.8854, localKeywords: ['Cebu walking tour vlog'] },
                ],
            },
            {
                code: 'IN', flag: '🇮🇳',
                lat: 20.5937, lng: 78.9629, zoom: 5, regionCode: 'IN',
                cities: [
                    { id: 'varanasi', lat: 25.3176, lng: 82.9739, localKeywords: ['Varanasi walking tour vlog 4K', 'वाराणसी वॉकिंग टूर'] },
                    { id: 'jaipur', lat: 26.9124, lng: 75.7873, localKeywords: ['Jaipur walking tour vlog 4K', 'जयपुर vlog'] },
                    { id: 'new-delhi', lat: 28.6139, lng: 77.2090, localKeywords: ['Delhi walking tour 4K', 'दिल्ली vlog'] },
                ],
            },
        ],
    },

    // ══════════════════════════════════════
    // 東南アジア (10 countries)
    // ══════════════════════════════════════
    {
        id: 'southeast-asia',
        icon: '🌴',
        lat: 10.0,
        lng: 108.0,
        zoom: 4,
        countries: [
            {
                code: 'TH', flag: '🇹🇭',
                lat: 15.8700, lng: 100.9925, zoom: 6, regionCode: 'TH',
                cities: [
                    { id: 'bangkok', lat: 13.7563, lng: 100.5018, localKeywords: ['กรุงเทพ vlog เดินเล่น', 'Bangkok walking tour 4K'] },
                    { id: 'chiang-mai', lat: 18.7883, lng: 98.9853, localKeywords: ['เชียงใหม่ vlog', 'Chiang Mai walking tour'] },
                    { id: 'phuket', lat: 7.8804, lng: 98.3923, localKeywords: ['ภูเก็ต vlog', 'Phuket walking tour'] },
                ],
            },
            {
                code: 'VN', flag: '🇻🇳',
                lat: 14.0583, lng: 108.2772, zoom: 5, regionCode: 'VN',
                cities: [
                    { id: 'hanoi', lat: 21.0285, lng: 105.8542, localKeywords: ['Hà Nội vlog đi bộ', 'Hanoi walking tour 4K'] },
                    { id: 'ho-chi-minh', lat: 10.8231, lng: 106.6297, localKeywords: ['Sài Gòn vlog đi bộ', 'Ho Chi Minh walking tour'] },
                    { id: 'hoi-an', lat: 15.8801, lng: 108.3380, localKeywords: ['Hội An vlog đi bộ', 'Hoi An walking tour'] },
                ],
            },
            {
                code: 'SG', flag: '🇸🇬',
                lat: 1.3521, lng: 103.8198, zoom: 11, regionCode: 'SG',
                cities: [
                    { id: 'singapore', lat: 1.3521, lng: 103.8198, localKeywords: ['Singapore walking tour 4K vlog'] },
                ],
            },
            {
                code: 'ID', flag: '🇮🇩',
                lat: -0.7893, lng: 113.9213, zoom: 5, regionCode: 'ID',
                cities: [
                    { id: 'bali', lat: -8.3405, lng: 115.0920, localKeywords: ['Bali vlog jalan-jalan', 'Bali walking tour 4K'] },
                    { id: 'jakarta', lat: -6.2088, lng: 106.8456, localKeywords: ['Jakarta vlog jalan-jalan', 'Jakarta walking tour'] },
                    { id: 'yogyakarta', lat: -7.7956, lng: 110.3695, localKeywords: ['Yogyakarta vlog jalan-jalan', 'Jogja walking tour'] },
                ],
            },
            {
                code: 'MY', flag: '🇲🇾',
                lat: 4.2105, lng: 101.9758, zoom: 6, regionCode: 'MY',
                cities: [
                    { id: 'kuala-lumpur', lat: 3.1390, lng: 101.6869, localKeywords: ['Kuala Lumpur walking tour 4K vlog'] },
                    { id: 'penang', lat: 5.4164, lng: 100.3327, localKeywords: ['Penang Georgetown walking tour vlog'] },
                ],
            },
            {
                code: 'KH', flag: '🇰🇭',
                lat: 12.5657, lng: 104.9910, zoom: 7, regionCode: 'KH',
                cities: [
                    { id: 'siem-reap', lat: 13.3671, lng: 103.8448, localKeywords: ['Siem Reap Angkor vlog walking tour 4K'] },
                    { id: 'phnom-penh', lat: 11.5449, lng: 104.8922, localKeywords: ['Phnom Penh walking tour vlog'] },
                ],
            },
            {
                code: 'MM', flag: '🇲🇲',
                lat: 21.9162, lng: 95.9560, zoom: 6, regionCode: 'MM',
                cities: [
                    { id: 'bagan', lat: 21.1717, lng: 94.8585, localKeywords: ['Bagan Myanmar travel vlog 4K'] },
                    { id: 'yangon', lat: 16.8661, lng: 96.1951, localKeywords: ['Yangon walking tour vlog'] },
                ],
            },
            {
                code: 'LA', flag: '🇱🇦',
                lat: 19.8563, lng: 102.4955, zoom: 6, regionCode: 'LA',
                cities: [
                    { id: 'luang-prabang', lat: 19.8832, lng: 102.1350, localKeywords: ['Luang Prabang walking tour vlog 4K'] },
                    { id: 'vientiane', lat: 17.9757, lng: 102.6331, localKeywords: ['Vientiane Laos walking tour vlog'] },
                ],
            },
            {
                code: 'BN', flag: '🇧🇳',
                lat: 4.5353, lng: 114.7277, zoom: 9, regionCode: 'BN',
                cities: [
                    { id: 'bandar-seri-begawan', lat: 4.9405, lng: 114.9480, localKeywords: ['Brunei BSB walking tour vlog'] },
                ],
            },
            {
                code: 'PW', flag: '🇵🇼',
                lat: 7.5150, lng: 134.5825, zoom: 9, regionCode: 'PW',
                cities: [
                    { id: 'koror', lat: 7.3419, lng: 134.4793, localKeywords: ['Palau Koror travel vlog 4K', 'Palau island vlog'] },
                ],
            },
        ],
    },

    // ══════════════════════════════════════
    // 中東 (10 countries)
    // ══════════════════════════════════════
    {
        id: 'middle-east',
        icon: '🕌',
        lat: 28.0,
        lng: 43.0,
        zoom: 4,
        countries: [
            {
                code: 'AE', flag: '🇦🇪',
                lat: 23.4241, lng: 53.8478, zoom: 7, regionCode: 'AE',
                cities: [
                    { id: 'dubai', lat: 25.2048, lng: 55.2708, localKeywords: ['دبي vlog مشي', 'Dubai walking tour 4K'] },
                    { id: 'abu-dhabi', lat: 24.4539, lng: 54.3773, localKeywords: ['أبوظبي vlog', 'Abu Dhabi walking tour'] },
                ],
            },
            {
                code: 'TR', flag: '🇹🇷',
                lat: 38.9637, lng: 35.2433, zoom: 5, regionCode: 'TR',
                cities: [
                    { id: 'istanbul', lat: 41.0082, lng: 28.9784, localKeywords: ['İstanbul gezinti vlog', 'Istanbul walking tour 4K'] },
                    { id: 'cappadocia', lat: 38.6431, lng: 34.8289, localKeywords: ['Kapadokya vlog', 'Cappadocia walking tour'] },
                    { id: 'ephesus', lat: 37.9398, lng: 27.3413, localKeywords: ['Efes yürüyüş vlog', 'Ephesus Turkey walking tour'] },
                ],
            },
            {
                code: 'SA', flag: '🇸🇦',
                lat: 23.8859, lng: 45.0792, zoom: 5, regionCode: 'SA',
                cities: [
                    { id: 'riyadh', lat: 24.7136, lng: 46.6753, localKeywords: ['الرياض vlog تجول', 'Riyadh walking tour 4K'] },
                    { id: 'alula', lat: 26.6190, lng: 37.9300, localKeywords: ['العُلا vlog', 'AlUla Saudi Arabia travel vlog'] },
                ],
            },
            {
                code: 'MA', flag: '🇲🇦',
                lat: 31.7917, lng: -7.0926, zoom: 6, regionCode: 'MA',
                cities: [
                    { id: 'marrakech', lat: 31.6295, lng: -7.9811, localKeywords: ['مراكش vlog مشي', 'Marrakech walking tour 4K'] },
                    { id: 'fes', lat: 34.0331, lng: -5.0003, localKeywords: ['فاس vlog', 'Fes medina walking tour'] },
                    { id: 'chefchaouen', lat: 35.1736, lng: -5.2697, localKeywords: ['شفشاون vlog', 'Chefchaouen blue city walking tour'] },
                ],
            },
            {
                code: 'JO', flag: '🇯🇴',
                lat: 30.5852, lng: 36.2384, zoom: 7, regionCode: 'JO',
                cities: [
                    { id: 'petra', lat: 30.3285, lng: 35.4444, localKeywords: ['Petra Jordan walking tour vlog 4K'] },
                    { id: 'wadi-rum', lat: 29.5750, lng: 35.4200, localKeywords: ['Wadi Rum Jordan travel vlog'] },
                    { id: 'amman', lat: 31.9454, lng: 35.9284, localKeywords: ['عمان vlog مشي', 'Amman Jordan walking tour'] },
                ],
            },
            {
                code: 'EG', flag: '🇪🇬',
                lat: 26.8206, lng: 30.8025, zoom: 5, regionCode: 'EG',
                cities: [
                    { id: 'cairo', lat: 30.0444, lng: 31.2357, localKeywords: ['القاهرة vlog مشي', 'Cairo Egypt walking tour 4K'] },
                    { id: 'luxor', lat: 25.6872, lng: 32.6396, localKeywords: ['الأقصر vlog', 'Luxor Egypt walking tour'] },
                ],
            },
            {
                code: 'IR', flag: '🇮🇷',
                lat: 32.4279, lng: 53.6880, zoom: 5, regionCode: 'IR',
                cities: [
                    { id: 'isfahan', lat: 32.6546, lng: 51.6680, localKeywords: ['Isfahan walking tour vlog', 'اصفهان ویدیو'] },
                    { id: 'tehran', lat: 35.6892, lng: 51.3890, localKeywords: ['Tehran walking tour vlog', 'تهران ویدیو'] },
                ],
            },
            {
                code: 'GE', flag: '🇬🇪',
                lat: 42.3154, lng: 43.3569, zoom: 7, regionCode: 'GE',
                cities: [
                    { id: 'tbilisi', lat: 41.6938, lng: 44.8015, localKeywords: ['Tbilisi walking tour vlog 4K', 'თბილისი ვლოგი'] },
                    { id: 'batumi', lat: 41.6408, lng: 41.6408, localKeywords: ['Batumi Georgia walking tour vlog'] },
                ],
            },
            {
                code: 'QA', flag: '🇶🇦',
                lat: 25.3548, lng: 51.1839, zoom: 9, regionCode: 'QA',
                cities: [
                    { id: 'doha', lat: 25.2854, lng: 51.5310, localKeywords: ['الدوحة vlog مشي', 'Doha Qatar walking tour 4K'] },
                ],
            },
            {
                code: 'IL', flag: '🇮🇱',
                lat: 31.0461, lng: 34.8516, zoom: 7, regionCode: 'IL',
                cities: [
                    { id: 'jerusalem', lat: 31.7683, lng: 35.2137, localKeywords: ['Jerusalem walking tour vlog 4K', 'ירושלים סיור'] },
                    { id: 'tel-aviv', lat: 32.0853, lng: 34.7818, localKeywords: ['Tel Aviv walking tour vlog 4K'] },
                ],
            },
        ],
    },

    // ══════════════════════════════════════
    // ヨーロッパ (12 countries)
    // ══════════════════════════════════════
    {
        id: 'europe',
        icon: '🏰',
        lat: 50.0,
        lng: 10.0,
        zoom: 4,
        countries: [
            {
                code: 'FR', flag: '🇫🇷',
                lat: 46.2276, lng: 2.2137, zoom: 6, regionCode: 'FR',
                cities: [
                    { id: 'paris', lat: 48.8566, lng: 2.3522, localKeywords: ['Paris balade vlog 4K', 'Paris walking tour'] },
                    { id: 'nice', lat: 43.7102, lng: 7.2620, localKeywords: ['Nice balade vlog', 'Nice walking tour'] },
                    { id: 'lyon', lat: 45.7640, lng: 4.8357, localKeywords: ['Lyon balade vlog', 'Lyon walking tour'] },
                ],
            },
            {
                code: 'IT', flag: '🇮🇹',
                lat: 41.8719, lng: 12.5674, zoom: 6, regionCode: 'IT',
                cities: [
                    { id: 'rome', lat: 41.9028, lng: 12.4964, localKeywords: ['Roma passeggiata vlog 4K', 'Rome walking tour'] },
                    { id: 'venice', lat: 45.4408, lng: 12.3155, localKeywords: ['Venezia passeggiata vlog', 'Venice walking tour 4K'] },
                    { id: 'florence', lat: 43.7696, lng: 11.2558, localKeywords: ['Firenze passeggiata vlog', 'Florence walking tour'] },
                    { id: 'amalfi', lat: 40.6340, lng: 14.6027, localKeywords: ['Amalfi Coast vlog walking tour 4K'] },
                ],
            },
            {
                code: 'ES', flag: '🇪🇸',
                lat: 40.4637, lng: -3.7492, zoom: 6, regionCode: 'ES',
                cities: [
                    { id: 'barcelona', lat: 41.3874, lng: 2.1686, localKeywords: ['Barcelona paseo vlog 4K', 'Barcelona walking tour'] },
                    { id: 'seville', lat: 37.3891, lng: -5.9845, localKeywords: ['Sevilla paseo vlog', 'Seville walking tour'] },
                    { id: 'granada', lat: 37.1773, lng: -3.5986, localKeywords: ['Granada paseo vlog', 'Granada Alhambra walking tour'] },
                ],
            },
            {
                code: 'GB', flag: '🇬🇧',
                lat: 55.3781, lng: -3.4360, zoom: 6, regionCode: 'GB',
                cities: [
                    { id: 'london', lat: 51.5074, lng: -0.1278, localKeywords: ['London walking tour 4K', 'London vlog stroll'] },
                    { id: 'edinburgh', lat: 55.9533, lng: -3.1883, localKeywords: ['Edinburgh walking tour', 'Edinburgh vlog'] },
                    { id: 'bath', lat: 51.3781, lng: -2.3597, localKeywords: ['Bath UK walking tour vlog 4K'] },
                ],
            },
            {
                code: 'CZ', flag: '🇨🇿',
                lat: 49.8175, lng: 15.4730, zoom: 7, regionCode: 'CZ',
                cities: [
                    { id: 'prague', lat: 50.0755, lng: 14.4378, localKeywords: ['Praha procházka vlog 4K', 'Prague walking tour'] },
                    { id: '-esk-krumlov', lat: 48.8126, lng: 14.3175, localKeywords: ['Český Krumlov walking tour vlog'] },
                ],
            },
            {
                code: 'NL', flag: '🇳🇱',
                lat: 52.1326, lng: 5.2913, zoom: 7, regionCode: 'NL',
                cities: [
                    { id: 'amsterdam', lat: 52.3676, lng: 4.9041, localKeywords: ['Amsterdam wandeling vlog 4K', 'Amsterdam walking tour'] },
                    { id: 'utrecht', lat: 52.0907, lng: 5.1214, localKeywords: ['Utrecht walking tour vlog'] },
                ],
            },
            {
                code: 'DE', flag: '🇩🇪',
                lat: 51.1657, lng: 10.4515, zoom: 6, regionCode: 'DE',
                cities: [
                    { id: 'cologne', lat: 50.9333, lng: 6.9500, localKeywords: ['Köln Spaziergang vlog', 'Cologne walking tour 4K'] },
                    { id: 'munich', lat: 48.1351, lng: 11.5820, localKeywords: ['München Spaziergang vlog', 'Munich walking tour'] },
                    { id: 'hamburg', lat: 53.5753, lng: 10.0153, localKeywords: ['Hamburg Spaziergang vlog', 'Hamburg walking tour'] },
                ],
            },
            {
                code: 'HU', flag: '🇭🇺',
                lat: 47.1625, lng: 19.5033, zoom: 7, regionCode: 'HU',
                cities: [
                    { id: 'budapest', lat: 47.4979, lng: 19.0402, localKeywords: ['Budapest séta vlog 4K', 'Budapest walking tour'] },
                ],
            },
            {
                code: 'PT', flag: '🇵🇹',
                lat: 39.3999, lng: -8.2245, zoom: 7, regionCode: 'PT',
                cities: [
                    { id: 'lisbon', lat: 38.7223, lng: -9.1393, localKeywords: ['Lisboa passeio vlog 4K', 'Lisbon walking tour'] },
                    { id: 'porto', lat: 41.1579, lng: -8.6291, localKeywords: ['Porto passeio vlog', 'Porto walking tour 4K'] },
                ],
            },
            {
                code: 'GR', flag: '🇬🇷',
                lat: 39.0742, lng: 21.8243, zoom: 6, regionCode: 'GR',
                cities: [
                    { id: 'athens', lat: 37.9838, lng: 23.7275, localKeywords: ['Αθήνα βόλτα vlog', 'Athens Greece walking tour 4K'] },
                    { id: 'santorini', lat: 36.3932, lng: 25.4615, localKeywords: ['Santorini Greece walking tour vlog 4K'] },
                ],
            },
            {
                code: 'PL', flag: '🇵🇱',
                lat: 51.9194, lng: 19.1451, zoom: 6, regionCode: 'PL',
                cities: [
                    { id: 'krak-w', lat: 50.0647, lng: 19.9450, localKeywords: ['Kraków spacer vlog 4K', 'Krakow walking tour'] },
                    { id: 'warsaw', lat: 52.2297, lng: 21.0122, localKeywords: ['Warszawa spacer vlog', 'Warsaw walking tour'] },
                ],
            },
            {
                code: 'HR', flag: '🇭🇷',
                lat: 45.1000, lng: 15.2000, zoom: 7, regionCode: 'HR',
                cities: [
                    { id: 'dubrovnik', lat: 42.6507, lng: 18.0944, localKeywords: ['Dubrovnik walking tour vlog 4K'] },
                    { id: 'split', lat: 43.5081, lng: 16.4402, localKeywords: ['Split Croatia walking tour vlog'] },
                ],
            },
        ],
    },

    // ══════════════════════════════════════
    // 南北アメリカ (10 countries)
    // ══════════════════════════════════════
    {
        id: 'americas',
        icon: '🗽',
        lat: 5.0,
        lng: -70.0,
        zoom: 3,
        countries: [
            {
                code: 'US', flag: '🇺🇸',
                lat: 37.0902, lng: -95.7129, zoom: 4, regionCode: 'US',
                cities: [
                    { id: 'new-york-city', lat: 40.7128, lng: -74.0060, localKeywords: ['New York City walking tour 4K', 'Manhattan walk vlog'] },
                    { id: 'los-angeles', lat: 34.0522, lng: -118.2437, localKeywords: ['Los Angeles walking tour 4K', 'LA vlog walk'] },
                    { id: 'new-orleans', lat: 29.9511, lng: -90.0715, localKeywords: ['New Orleans walking tour vlog 4K'] },
                    { id: 'san-francisco', lat: 37.7749, lng: -122.4194, localKeywords: ['San Francisco walking tour 4K', 'SF vlog'] },
                ],
            },
            {
                code: 'CA', flag: '🇨🇦',
                lat: 56.1304, lng: -106.3468, zoom: 4, regionCode: 'CA',
                cities: [
                    { id: 'vancouver', lat: 49.2827, lng: -123.1207, localKeywords: ['Vancouver walking tour 4K vlog'] },
                    { id: 'toronto', lat: 43.6532, lng: -79.3832, localKeywords: ['Toronto walking tour 4K vlog'] },
                    { id: 'quebec', lat: 46.8139, lng: -71.2080, localKeywords: ['Québec balade vlog 4K', 'Quebec City walking tour'] },
                ],
            },
            {
                code: 'MX', flag: '🇲🇽',
                lat: 23.6345, lng: -102.5528, zoom: 5, regionCode: 'MX',
                cities: [
                    { id: 'mexico-city', lat: 19.4326, lng: -99.1332, localKeywords: ['Ciudad de México caminata vlog 4K', 'Mexico City walking tour'] },
                    { id: 'oaxaca', lat: 17.0732, lng: -96.7266, localKeywords: ['Oaxaca caminata vlog', 'Oaxaca walking tour'] },
                    { id: 'm-rida', lat: 20.9674, lng: -89.5926, localKeywords: ['Mérida Yucatán caminata vlog', 'Merida Mexico walking tour'] },
                ],
            },
            {
                code: 'BR', flag: '🇧🇷',
                lat: -14.2350, lng: -51.9253, zoom: 4, regionCode: 'BR',
                cities: [
                    { id: 'rio-de-janeiro', lat: -22.9068, lng: -43.1729, localKeywords: ['Rio de Janeiro caminhada vlog 4K', 'Rio walking tour'] },
                    { id: 's-o-paulo', lat: -23.5505, lng: -46.6333, localKeywords: ['São Paulo caminhada vlog', 'Sao Paulo walking tour'] },
                ],
            },
            {
                code: 'AR', flag: '🇦🇷',
                lat: -38.4161, lng: -63.6167, zoom: 4, regionCode: 'AR',
                cities: [
                    { id: 'buenos-aires', lat: -34.6037, lng: -58.3816, localKeywords: ['Buenos Aires caminata vlog 4K', 'Buenos Aires walking tour'] },
                    { id: 'patagonia', lat: -41.1335, lng: -71.3103, localKeywords: ['Patagonia Argentina travel vlog 4K'] },
                ],
            },
            {
                code: 'CL', flag: '🇨🇱',
                lat: -35.6751, lng: -71.5430, zoom: 5, regionCode: 'CL',
                cities: [
                    { id: 'santiago', lat: -33.4489, lng: -70.6693, localKeywords: ['Santiago caminata vlog 4K', 'Santiago Chile walking tour'] },
                    { id: 'valpara-so', lat: -33.0458, lng: -71.6197, localKeywords: ['Valparaíso caminata vlog', 'Valparaiso walking tour'] },
                ],
            },
            {
                code: 'PE', flag: '🇵🇪',
                lat: -9.1900, lng: -75.0152, zoom: 5, regionCode: 'PE',
                cities: [
                    { id: 'machu-picchu', lat: -13.1631, lng: -72.5450, localKeywords: ['Machu Picchu walking tour vlog 4K'] },
                    { id: 'cusco', lat: -13.5319, lng: -71.9675, localKeywords: ['Cusco caminata vlog 4K', 'Cusco Peru walking tour'] },
                    { id: 'lima', lat: -12.0464, lng: -77.0428, localKeywords: ['Lima caminata vlog 4K', 'Lima Peru walking tour'] },
                ],
            },
            {
                code: 'CO', flag: '🇨🇴',
                lat: 4.5709, lng: -74.2973, zoom: 5, regionCode: 'CO',
                cities: [
                    { id: 'cartagena', lat: 10.3910, lng: -75.4794, localKeywords: ['Cartagena caminata vlog 4K', 'Cartagena Colombia walking tour'] },
                    { id: 'medell-n', lat: 6.2442, lng: -75.5812, localKeywords: ['Medellín caminata vlog 4K', 'Medellin walking tour'] },
                ],
            },
            {
                code: 'CU', flag: '🇨🇺',
                lat: 21.5218, lng: -77.7812, zoom: 7, regionCode: 'CU',
                cities: [
                    { id: 'havana', lat: 23.1136, lng: -82.3666, localKeywords: ['Havana Cuba walking tour vlog 4K'] },
                    { id: 'trinidad', lat: 21.8030, lng: -79.9836, localKeywords: ['Trinidad Cuba walking tour vlog'] },
                ],
            },
            {
                code: 'EC', flag: '🇪🇨',
                lat: -1.8312, lng: -78.1834, zoom: 6, regionCode: 'EC',
                cities: [
                    { id: 'quito', lat: -0.1807, lng: -78.4678, localKeywords: ['Quito caminata vlog 4K', 'Quito Ecuador walking tour'] },
                    { id: 'gal-pagos', lat: -0.9538, lng: -90.9656, localKeywords: ['Galapagos Islands travel vlog 4K'] },
                ],
            },
        ],
    },

    // ══════════════════════════════════════
    // アフリカ・オセアニア (10 countries)
    // ══════════════════════════════════════
    {
        id: 'africa-oceania',
        icon: '🦁',
        lat: -15.0,
        lng: 30.0,
        zoom: 3,
        countries: [
            {
                code: 'ZA', flag: '🇿🇦',
                lat: -30.5595, lng: 22.9375, zoom: 5, regionCode: 'ZA',
                cities: [
                    { id: 'cape-town', lat: -33.9249, lng: 18.4241, localKeywords: ['Cape Town walking tour 4K vlog'] },
                    { id: 'johannesburg', lat: -26.2041, lng: 28.0473, localKeywords: ['Johannesburg walking tour vlog 4K'] },
                ],
            },
            {
                code: 'KE', flag: '🇰🇪',
                lat: -0.0236, lng: 37.9062, zoom: 6, regionCode: 'KE',
                cities: [
                    { id: 'nairobi', lat: -1.2921, lng: 36.8219, localKeywords: ['Nairobi Kenya walking tour vlog 4K'] },
                    { id: 'mombasa', lat: -4.0435, lng: 39.6682, localKeywords: ['Mombasa Kenya walking tour vlog'] },
                ],
            },
            {
                code: 'AU', flag: '🇦🇺',
                lat: -25.2744, lng: 133.7751, zoom: 4, regionCode: 'AU',
                cities: [
                    { id: 'sydney', lat: -33.8688, lng: 151.2093, localKeywords: ['Sydney walking tour 4K vlog'] },
                    { id: 'melbourne', lat: -37.8136, lng: 144.9631, localKeywords: ['Melbourne walking tour 4K vlog'] },
                    { id: 'cairns', lat: -16.9186, lng: 145.7781, localKeywords: ['Cairns Australia travel vlog 4K'] },
                ],
            },
            {
                code: 'NZ', flag: '🇳🇿',
                lat: -40.9006, lng: 174.8860, zoom: 5, regionCode: 'NZ',
                cities: [
                    { id: 'queenstown', lat: -45.0312, lng: 168.6626, localKeywords: ['Queenstown New Zealand walking tour vlog 4K'] },
                    { id: 'auckland', lat: -36.8485, lng: 174.7633, localKeywords: ['Auckland walking tour vlog 4K'] },
                ],
            },
            {
                code: 'ET', flag: '🇪🇹',
                lat: 9.1450, lng: 40.4897, zoom: 6, regionCode: 'ET',
                cities: [
                    { id: 'addis-ababa', lat: 9.0250, lng: 38.7469, localKeywords: ['Addis Ababa Ethiopia walking tour vlog 4K'] },
                    { id: 'lalibela', lat: 12.0319, lng: 39.0467, localKeywords: ['Lalibela Ethiopia travel vlog 4K'] },
                ],
            },
            {
                code: 'TZ', flag: '🇹🇿',
                lat: -6.3690, lng: 34.8888, zoom: 6, regionCode: 'TZ',
                cities: [
                    { id: 'zanzibar', lat: -6.1659, lng: 39.1917, localKeywords: ['Zanzibar walking tour vlog 4K'] },
                    { id: 'serengeti', lat: -2.3333, lng: 34.8333, localKeywords: ['Serengeti Tanzania safari travel vlog 4K'] },
                ],
            },
            {
                code: 'GH', flag: '🇬🇭',
                lat: 7.9465, lng: -1.0232, zoom: 7, regionCode: 'GH',
                cities: [
                    { id: 'accra', lat: 5.6037, lng: -0.1870, localKeywords: ['Accra Ghana walking tour vlog 4K'] },
                    { id: 'kumasi', lat: 6.6885, lng: -1.6244, localKeywords: ['Kumasi Ghana walking tour vlog'] },
                ],
            },
            {
                code: 'SN', flag: '🇸🇳',
                lat: 14.4974, lng: -14.4524, zoom: 7, regionCode: 'SN',
                cities: [
                    { id: 'dakar', lat: 14.7167, lng: -17.4677, localKeywords: ['Dakar Sénégal vlog balade 4K', 'Dakar Senegal walking tour'] },
                ],
            },
            {
                code: 'FJ', flag: '🇫🇯',
                lat: -17.7134, lng: 178.0650, zoom: 8, regionCode: 'FJ',
                cities: [
                    { id: 'suva', lat: -18.1248, lng: 178.4501, localKeywords: ['Fiji Suva travel vlog 4K', 'Fiji islands vlog'] },
                ],
            },
            {
                code: 'MU', flag: '🇲🇺',
                lat: -20.3484, lng: 57.5522, zoom: 9, regionCode: 'MU',
                cities: [
                    { id: 'port-louis', lat: -20.1609, lng: 57.4989, localKeywords: ['Mauritius travel vlog 4K', 'Ile Maurice vlog'] },
                ],
            },
        ],
    },
];

// Flatten all cities for quick search
export function getAllCities(): Array<City & { countryCode: string; countryFlag: string; regionCode: string }> {
    return AREAS.flatMap(area =>
        area.countries.flatMap(country =>
            country.cities.map(city => ({
                ...city,
                countryCode: country.code,
                countryFlag: country.flag,
                regionCode: country.regionCode,
            }))
        )
    );
}

export function getAreaById(id: string): Area | undefined {
    return AREAS.find(a => a.id === id);
}

// Haversine distance between two lat/lng points (in km)
function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Find the nearest registered city to a given coordinate
export function getNearestCity(lat: number, lng: number): {
    city: City & { countryCode: string; countryFlag: string; regionCode: string };
    country: Country;
    area: Area;
} {
    let best: { city: City; country: Country; area: Area; dist: number } | null = null;

    for (const area of AREAS) {
        for (const country of area.countries) {
            for (const city of country.cities) {
                const dist = haversineKm(lat, lng, city.lat, city.lng);
                if (!best || dist < best.dist) {
                    best = { city, country, area, dist };
                }
            }
        }
    }

    if (!best) throw new Error('No cities in database');

    return {
        city: {
            ...best.city,
            countryCode: best.country.code,
            countryFlag: best.country.flag,
            regionCode: best.country.regionCode,
        },
        country: best.country,
        area: best.area,
    };
}

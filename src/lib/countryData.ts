// Country data for hierarchical drill-down UI
// Includes local language keywords for improved YouTube search accuracy
// Selection criteria: rich YouTube Vlog content, popular travel destinations, cultural diversity per area

export interface Country {
    code: string;       // ISO country code
    name: string;       // English name
    nameJa: string;     // Japanese name
    flag: string;       // Flag emoji
    lat: number;
    lng: number;
    zoom: number;       // Leaflet zoom level when selected
    regionCode: string; // YouTube API regionCode
    cities: City[];
}

export interface City {
    name: string;
    nameJa: string;
    lat: number;
    lng: number;
    // Local language search keywords for YouTube
    localKeywords: string[];
}

export interface Area {
    id: string;
    name: string;
    nameJa: string;
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
        name: 'East Asia',
        nameJa: '東アジア',
        icon: '🏯',
        lat: 35.0,
        lng: 110.0,
        zoom: 4,
        countries: [
            {
                code: 'JP', name: 'Japan', nameJa: '日本', flag: '🇯🇵',
                lat: 36.2048, lng: 138.2529, zoom: 6, regionCode: 'JP',
                cities: [
                    { name: 'Tokyo', nameJa: '東京', lat: 35.6762, lng: 139.6503, localKeywords: ['東京 散歩 vlog', 'Tokyo walking tour 4K'] },
                    { name: 'Kyoto', nameJa: '京都', lat: 35.0116, lng: 135.7681, localKeywords: ['京都 散歩 vlog', 'Kyoto walking tour'] },
                    { name: 'Osaka', nameJa: '大阪', lat: 34.6937, lng: 135.5023, localKeywords: ['大阪 散歩 vlog', 'Osaka walking tour'] },
                    { name: 'Hokkaido', nameJa: '北海道', lat: 43.2203, lng: 142.8635, localKeywords: ['北海道 vlog', 'Hokkaido travel vlog'] },
                ],
            },
            {
                code: 'KR', name: 'South Korea', nameJa: '韓国', flag: '🇰🇷',
                lat: 36.5, lng: 127.8, zoom: 7, regionCode: 'KR',
                cities: [
                    { name: 'Seoul', nameJa: 'ソウル', lat: 37.5665, lng: 126.9780, localKeywords: ['서울 산책 브이로그', 'Seoul walking tour 4K'] },
                    { name: 'Busan', nameJa: '釜山', lat: 35.1796, lng: 129.0756, localKeywords: ['부산 브이로그', 'Busan walking tour'] },
                    { name: 'Jeonju', nameJa: '全州', lat: 35.8242, lng: 127.1480, localKeywords: ['전주 한옥마을 vlog', 'Jeonju walking tour'] },
                ],
            },
            {
                code: 'CN', name: 'China', nameJa: '中国', flag: '🇨🇳',
                lat: 35.8617, lng: 104.1954, zoom: 4, regionCode: 'CN',
                cities: [
                    { name: 'Beijing', nameJa: '北京', lat: 39.9042, lng: 116.4074, localKeywords: ['北京 漫步 vlog', 'Beijing walking tour 4K'] },
                    { name: 'Shanghai', nameJa: '上海', lat: 31.2304, lng: 121.4737, localKeywords: ['上海 散步 vlog', 'Shanghai walking tour'] },
                    { name: 'Chengdu', nameJa: '成都', lat: 30.5728, lng: 104.0668, localKeywords: ['成都 散步 vlog', 'Chengdu walking tour'] },
                    { name: 'Xi\'an', nameJa: '西安', lat: 34.3416, lng: 108.9398, localKeywords: ['西安 漫步 vlog', 'Xi\'an walking tour'] },
                ],
            },
            {
                code: 'TW', name: 'Taiwan', nameJa: '台湾', flag: '🇹🇼',
                lat: 23.6978, lng: 120.9605, zoom: 7, regionCode: 'TW',
                cities: [
                    { name: 'Taipei', nameJa: '台北', lat: 25.0330, lng: 121.5654, localKeywords: ['台北 散步 vlog', 'Taipei walking tour 4K'] },
                    { name: 'Tainan', nameJa: '台南', lat: 22.9999, lng: 120.2270, localKeywords: ['台南 散步 vlog', 'Tainan walking tour'] },
                ],
            },
            {
                code: 'HK', name: 'Hong Kong', nameJa: '香港', flag: '🇭🇰',
                lat: 22.3193, lng: 114.1694, zoom: 10, regionCode: 'HK',
                cities: [
                    { name: 'Hong Kong', nameJa: '香港', lat: 22.3193, lng: 114.1694, localKeywords: ['香港 散步 vlog', 'Hong Kong walking tour 4K'] },
                ],
            },
            {
                code: 'MO', name: 'Macau', nameJa: 'マカオ', flag: '🇲🇴',
                lat: 22.1987, lng: 113.5439, zoom: 12, regionCode: 'MO',
                cities: [
                    { name: 'Macau', nameJa: 'マカオ', lat: 22.1987, lng: 113.5439, localKeywords: ['澳門 散步 vlog', 'Macau walking tour'] },
                ],
            },
            {
                code: 'MN', name: 'Mongolia', nameJa: 'モンゴル', flag: '🇲🇳',
                lat: 46.8625, lng: 103.8467, zoom: 5, regionCode: 'MN',
                cities: [
                    { name: 'Ulaanbaatar', nameJa: 'ウランバートル', lat: 47.8864, lng: 106.9057, localKeywords: ['Ulaanbaatar walking tour vlog', 'Mongolia travel vlog'] },
                ],
            },
            {
                code: 'KP', name: 'North Korea', nameJa: '北朝鮮', flag: '🇰🇵',
                lat: 40.3399, lng: 127.5101, zoom: 6, regionCode: 'KP',
                cities: [
                    { name: 'Pyongyang', nameJa: '平壌', lat: 39.0392, lng: 125.7625, localKeywords: ['Pyongyang DPRK travel vlog', 'North Korea tour documentary'] },
                ],
            },
            {
                code: 'PH', name: 'Philippines', nameJa: 'フィリピン', flag: '🇵🇭',
                lat: 12.8797, lng: 121.7740, zoom: 5, regionCode: 'PH',
                cities: [
                    { name: 'Manila', nameJa: 'マニラ', lat: 14.5995, lng: 120.9842, localKeywords: ['Manila walking tour vlog 4K'] },
                    { name: 'Palawan', nameJa: 'パラワン', lat: 9.8349, lng: 118.7384, localKeywords: ['Palawan Philippines travel vlog'] },
                    { name: 'Cebu', nameJa: 'セブ', lat: 10.3157, lng: 123.8854, localKeywords: ['Cebu walking tour vlog'] },
                ],
            },
            {
                code: 'IN', name: 'India', nameJa: 'インド', flag: '🇮🇳',
                lat: 20.5937, lng: 78.9629, zoom: 5, regionCode: 'IN',
                cities: [
                    { name: 'Varanasi', nameJa: 'バラナシ', lat: 25.3176, lng: 82.9739, localKeywords: ['Varanasi walking tour vlog 4K', 'वाराणसी वॉकिंग टूर'] },
                    { name: 'Jaipur', nameJa: 'ジャイプル', lat: 26.9124, lng: 75.7873, localKeywords: ['Jaipur walking tour vlog 4K', 'जयपुर vlog'] },
                    { name: 'New Delhi', nameJa: 'ニューデリー', lat: 28.6139, lng: 77.2090, localKeywords: ['Delhi walking tour 4K', 'दिल्ली vlog'] },
                ],
            },
        ],
    },

    // ══════════════════════════════════════
    // 東南アジア (10 countries)
    // ══════════════════════════════════════
    {
        id: 'southeast-asia',
        name: 'Southeast Asia',
        nameJa: '東南アジア',
        icon: '🌴',
        lat: 10.0,
        lng: 108.0,
        zoom: 4,
        countries: [
            {
                code: 'TH', name: 'Thailand', nameJa: 'タイ', flag: '🇹🇭',
                lat: 15.8700, lng: 100.9925, zoom: 6, regionCode: 'TH',
                cities: [
                    { name: 'Bangkok', nameJa: 'バンコク', lat: 13.7563, lng: 100.5018, localKeywords: ['กรุงเทพ vlog เดินเล่น', 'Bangkok walking tour 4K'] },
                    { name: 'Chiang Mai', nameJa: 'チェンマイ', lat: 18.7883, lng: 98.9853, localKeywords: ['เชียงใหม่ vlog', 'Chiang Mai walking tour'] },
                    { name: 'Phuket', nameJa: 'プーケット', lat: 7.8804, lng: 98.3923, localKeywords: ['ภูเก็ต vlog', 'Phuket walking tour'] },
                ],
            },
            {
                code: 'VN', name: 'Vietnam', nameJa: 'ベトナム', flag: '🇻🇳',
                lat: 14.0583, lng: 108.2772, zoom: 5, regionCode: 'VN',
                cities: [
                    { name: 'Hanoi', nameJa: 'ハノイ', lat: 21.0285, lng: 105.8542, localKeywords: ['Hà Nội vlog đi bộ', 'Hanoi walking tour 4K'] },
                    { name: 'Ho Chi Minh', nameJa: 'ホーチミン', lat: 10.8231, lng: 106.6297, localKeywords: ['Sài Gòn vlog đi bộ', 'Ho Chi Minh walking tour'] },
                    { name: 'Hoi An', nameJa: 'ホイアン', lat: 15.8801, lng: 108.3380, localKeywords: ['Hội An vlog đi bộ', 'Hoi An walking tour'] },
                ],
            },
            {
                code: 'SG', name: 'Singapore', nameJa: 'シンガポール', flag: '🇸🇬',
                lat: 1.3521, lng: 103.8198, zoom: 11, regionCode: 'SG',
                cities: [
                    { name: 'Singapore', nameJa: 'シンガポール', lat: 1.3521, lng: 103.8198, localKeywords: ['Singapore walking tour 4K vlog'] },
                ],
            },
            {
                code: 'ID', name: 'Indonesia', nameJa: 'インドネシア', flag: '🇮🇩',
                lat: -0.7893, lng: 113.9213, zoom: 5, regionCode: 'ID',
                cities: [
                    { name: 'Bali', nameJa: 'バリ', lat: -8.3405, lng: 115.0920, localKeywords: ['Bali vlog jalan-jalan', 'Bali walking tour 4K'] },
                    { name: 'Jakarta', nameJa: 'ジャカルタ', lat: -6.2088, lng: 106.8456, localKeywords: ['Jakarta vlog jalan-jalan', 'Jakarta walking tour'] },
                    { name: 'Yogyakarta', nameJa: 'ジョグジャカルタ', lat: -7.7956, lng: 110.3695, localKeywords: ['Yogyakarta vlog jalan-jalan', 'Jogja walking tour'] },
                ],
            },
            {
                code: 'MY', name: 'Malaysia', nameJa: 'マレーシア', flag: '🇲🇾',
                lat: 4.2105, lng: 101.9758, zoom: 6, regionCode: 'MY',
                cities: [
                    { name: 'Kuala Lumpur', nameJa: 'クアラルンプール', lat: 3.1390, lng: 101.6869, localKeywords: ['Kuala Lumpur walking tour 4K vlog'] },
                    { name: 'Penang', nameJa: 'ペナン', lat: 5.4164, lng: 100.3327, localKeywords: ['Penang Georgetown walking tour vlog'] },
                ],
            },
            {
                code: 'KH', name: 'Cambodia', nameJa: 'カンボジア', flag: '🇰🇭',
                lat: 12.5657, lng: 104.9910, zoom: 7, regionCode: 'KH',
                cities: [
                    { name: 'Siem Reap', nameJa: 'シェムリアップ', lat: 13.3671, lng: 103.8448, localKeywords: ['Siem Reap Angkor vlog walking tour 4K'] },
                    { name: 'Phnom Penh', nameJa: 'プノンペン', lat: 11.5449, lng: 104.8922, localKeywords: ['Phnom Penh walking tour vlog'] },
                ],
            },
            {
                code: 'MM', name: 'Myanmar', nameJa: 'ミャンマー', flag: '🇲🇲',
                lat: 21.9162, lng: 95.9560, zoom: 6, regionCode: 'MM',
                cities: [
                    { name: 'Bagan', nameJa: 'バガン', lat: 21.1717, lng: 94.8585, localKeywords: ['Bagan Myanmar travel vlog 4K'] },
                    { name: 'Yangon', nameJa: 'ヤンゴン', lat: 16.8661, lng: 96.1951, localKeywords: ['Yangon walking tour vlog'] },
                ],
            },
            {
                code: 'LA', name: 'Laos', nameJa: 'ラオス', flag: '🇱🇦',
                lat: 19.8563, lng: 102.4955, zoom: 6, regionCode: 'LA',
                cities: [
                    { name: 'Luang Prabang', nameJa: 'ルアンパバーン', lat: 19.8832, lng: 102.1350, localKeywords: ['Luang Prabang walking tour vlog 4K'] },
                    { name: 'Vientiane', nameJa: 'ビエンチャン', lat: 17.9757, lng: 102.6331, localKeywords: ['Vientiane Laos walking tour vlog'] },
                ],
            },
            {
                code: 'BN', name: 'Brunei', nameJa: 'ブルネイ', flag: '🇧🇳',
                lat: 4.5353, lng: 114.7277, zoom: 9, regionCode: 'BN',
                cities: [
                    { name: 'Bandar Seri Begawan', nameJa: 'バンダルスリブガワン', lat: 4.9405, lng: 114.9480, localKeywords: ['Brunei BSB walking tour vlog'] },
                ],
            },
            {
                code: 'PW', name: 'Palau', nameJa: 'パラオ', flag: '🇵🇼',
                lat: 7.5150, lng: 134.5825, zoom: 9, regionCode: 'PW',
                cities: [
                    { name: 'Koror', nameJa: 'コロール', lat: 7.3419, lng: 134.4793, localKeywords: ['Palau Koror travel vlog 4K', 'Palau island vlog'] },
                ],
            },
        ],
    },

    // ══════════════════════════════════════
    // 中東 (10 countries)
    // ══════════════════════════════════════
    {
        id: 'middle-east',
        name: 'Middle East',
        nameJa: '中東',
        icon: '🕌',
        lat: 28.0,
        lng: 43.0,
        zoom: 4,
        countries: [
            {
                code: 'AE', name: 'UAE', nameJa: 'アラブ首長国連邦', flag: '🇦🇪',
                lat: 23.4241, lng: 53.8478, zoom: 7, regionCode: 'AE',
                cities: [
                    { name: 'Dubai', nameJa: 'ドバイ', lat: 25.2048, lng: 55.2708, localKeywords: ['دبي vlog مشي', 'Dubai walking tour 4K'] },
                    { name: 'Abu Dhabi', nameJa: 'アブダビ', lat: 24.4539, lng: 54.3773, localKeywords: ['أبوظبي vlog', 'Abu Dhabi walking tour'] },
                ],
            },
            {
                code: 'TR', name: 'Turkey', nameJa: 'トルコ', flag: '🇹🇷',
                lat: 38.9637, lng: 35.2433, zoom: 5, regionCode: 'TR',
                cities: [
                    { name: 'Istanbul', nameJa: 'イスタンブール', lat: 41.0082, lng: 28.9784, localKeywords: ['İstanbul gezinti vlog', 'Istanbul walking tour 4K'] },
                    { name: 'Cappadocia', nameJa: 'カッパドキア', lat: 38.6431, lng: 34.8289, localKeywords: ['Kapadokya vlog', 'Cappadocia walking tour'] },
                    { name: 'Ephesus', nameJa: 'エフェソス', lat: 37.9398, lng: 27.3413, localKeywords: ['Efes yürüyüş vlog', 'Ephesus Turkey walking tour'] },
                ],
            },
            {
                code: 'SA', name: 'Saudi Arabia', nameJa: 'サウジアラビア', flag: '🇸🇦',
                lat: 23.8859, lng: 45.0792, zoom: 5, regionCode: 'SA',
                cities: [
                    { name: 'Riyadh', nameJa: 'リヤド', lat: 24.7136, lng: 46.6753, localKeywords: ['الرياض vlog تجول', 'Riyadh walking tour 4K'] },
                    { name: 'AlUla', nameJa: 'アルウラ', lat: 26.6190, lng: 37.9300, localKeywords: ['العُلا vlog', 'AlUla Saudi Arabia travel vlog'] },
                ],
            },
            {
                code: 'MA', name: 'Morocco', nameJa: 'モロッコ', flag: '🇲🇦',
                lat: 31.7917, lng: -7.0926, zoom: 6, regionCode: 'MA',
                cities: [
                    { name: 'Marrakech', nameJa: 'マラケシュ', lat: 31.6295, lng: -7.9811, localKeywords: ['مراكش vlog مشي', 'Marrakech walking tour 4K'] },
                    { name: 'Fes', nameJa: 'フェズ', lat: 34.0331, lng: -5.0003, localKeywords: ['فاس vlog', 'Fes medina walking tour'] },
                    { name: 'Chefchaouen', nameJa: 'シェフシャウエン', lat: 35.1736, lng: -5.2697, localKeywords: ['شفشاون vlog', 'Chefchaouen blue city walking tour'] },
                ],
            },
            {
                code: 'JO', name: 'Jordan', nameJa: 'ヨルダン', flag: '🇯🇴',
                lat: 30.5852, lng: 36.2384, zoom: 7, regionCode: 'JO',
                cities: [
                    { name: 'Petra', nameJa: 'ペトラ', lat: 30.3285, lng: 35.4444, localKeywords: ['Petra Jordan walking tour vlog 4K'] },
                    { name: 'Wadi Rum', nameJa: 'ワディラム', lat: 29.5750, lng: 35.4200, localKeywords: ['Wadi Rum Jordan travel vlog'] },
                    { name: 'Amman', nameJa: 'アンマン', lat: 31.9454, lng: 35.9284, localKeywords: ['عمان vlog مشي', 'Amman Jordan walking tour'] },
                ],
            },
            {
                code: 'EG', name: 'Egypt', nameJa: 'エジプト', flag: '🇪🇬',
                lat: 26.8206, lng: 30.8025, zoom: 5, regionCode: 'EG',
                cities: [
                    { name: 'Cairo', nameJa: 'カイロ', lat: 30.0444, lng: 31.2357, localKeywords: ['القاهرة vlog مشي', 'Cairo Egypt walking tour 4K'] },
                    { name: 'Luxor', nameJa: 'ルクソール', lat: 25.6872, lng: 32.6396, localKeywords: ['الأقصر vlog', 'Luxor Egypt walking tour'] },
                ],
            },
            {
                code: 'IR', name: 'Iran', nameJa: 'イラン', flag: '🇮🇷',
                lat: 32.4279, lng: 53.6880, zoom: 5, regionCode: 'IR',
                cities: [
                    { name: 'Isfahan', nameJa: 'イスファハン', lat: 32.6546, lng: 51.6680, localKeywords: ['Isfahan walking tour vlog', 'اصفهان ویدیو'] },
                    { name: 'Tehran', nameJa: 'テヘラン', lat: 35.6892, lng: 51.3890, localKeywords: ['Tehran walking tour vlog', 'تهران ویدیو'] },
                ],
            },
            {
                code: 'GE', name: 'Georgia', nameJa: 'ジョージア', flag: '🇬🇪',
                lat: 42.3154, lng: 43.3569, zoom: 7, regionCode: 'GE',
                cities: [
                    { name: 'Tbilisi', nameJa: 'トビリシ', lat: 41.6938, lng: 44.8015, localKeywords: ['Tbilisi walking tour vlog 4K', 'თბილისი ვლოგი'] },
                    { name: 'Batumi', nameJa: 'バトゥミ', lat: 41.6408, lng: 41.6408, localKeywords: ['Batumi Georgia walking tour vlog'] },
                ],
            },
            {
                code: 'QA', name: 'Qatar', nameJa: 'カタール', flag: '🇶🇦',
                lat: 25.3548, lng: 51.1839, zoom: 9, regionCode: 'QA',
                cities: [
                    { name: 'Doha', nameJa: 'ドーハ', lat: 25.2854, lng: 51.5310, localKeywords: ['الدوحة vlog مشي', 'Doha Qatar walking tour 4K'] },
                ],
            },
            {
                code: 'IL', name: 'Israel', nameJa: 'イスラエル', flag: '🇮🇱',
                lat: 31.0461, lng: 34.8516, zoom: 7, regionCode: 'IL',
                cities: [
                    { name: 'Jerusalem', nameJa: 'エルサレム', lat: 31.7683, lng: 35.2137, localKeywords: ['Jerusalem walking tour vlog 4K', 'ירושלים סיור'] },
                    { name: 'Tel Aviv', nameJa: 'テルアビブ', lat: 32.0853, lng: 34.7818, localKeywords: ['Tel Aviv walking tour vlog 4K'] },
                ],
            },
        ],
    },

    // ══════════════════════════════════════
    // ヨーロッパ (12 countries)
    // ══════════════════════════════════════
    {
        id: 'europe',
        name: 'Europe',
        nameJa: 'ヨーロッパ',
        icon: '🏰',
        lat: 50.0,
        lng: 10.0,
        zoom: 4,
        countries: [
            {
                code: 'FR', name: 'France', nameJa: 'フランス', flag: '🇫🇷',
                lat: 46.2276, lng: 2.2137, zoom: 6, regionCode: 'FR',
                cities: [
                    { name: 'Paris', nameJa: 'パリ', lat: 48.8566, lng: 2.3522, localKeywords: ['Paris balade vlog 4K', 'Paris walking tour'] },
                    { name: 'Nice', nameJa: 'ニース', lat: 43.7102, lng: 7.2620, localKeywords: ['Nice balade vlog', 'Nice walking tour'] },
                    { name: 'Lyon', nameJa: 'リヨン', lat: 45.7640, lng: 4.8357, localKeywords: ['Lyon balade vlog', 'Lyon walking tour'] },
                ],
            },
            {
                code: 'IT', name: 'Italy', nameJa: 'イタリア', flag: '🇮🇹',
                lat: 41.8719, lng: 12.5674, zoom: 6, regionCode: 'IT',
                cities: [
                    { name: 'Rome', nameJa: 'ローマ', lat: 41.9028, lng: 12.4964, localKeywords: ['Roma passeggiata vlog 4K', 'Rome walking tour'] },
                    { name: 'Venice', nameJa: 'ヴェネツィア', lat: 45.4408, lng: 12.3155, localKeywords: ['Venezia passeggiata vlog', 'Venice walking tour 4K'] },
                    { name: 'Florence', nameJa: 'フィレンツェ', lat: 43.7696, lng: 11.2558, localKeywords: ['Firenze passeggiata vlog', 'Florence walking tour'] },
                    { name: 'Amalfi', nameJa: 'アマルフィ', lat: 40.6340, lng: 14.6027, localKeywords: ['Amalfi Coast vlog walking tour 4K'] },
                ],
            },
            {
                code: 'ES', name: 'Spain', nameJa: 'スペイン', flag: '🇪🇸',
                lat: 40.4637, lng: -3.7492, zoom: 6, regionCode: 'ES',
                cities: [
                    { name: 'Barcelona', nameJa: 'バルセロナ', lat: 41.3874, lng: 2.1686, localKeywords: ['Barcelona paseo vlog 4K', 'Barcelona walking tour'] },
                    { name: 'Seville', nameJa: 'セビリア', lat: 37.3891, lng: -5.9845, localKeywords: ['Sevilla paseo vlog', 'Seville walking tour'] },
                    { name: 'Granada', nameJa: 'グラナダ', lat: 37.1773, lng: -3.5986, localKeywords: ['Granada paseo vlog', 'Granada Alhambra walking tour'] },
                ],
            },
            {
                code: 'GB', name: 'United Kingdom', nameJa: 'イギリス', flag: '🇬🇧',
                lat: 55.3781, lng: -3.4360, zoom: 6, regionCode: 'GB',
                cities: [
                    { name: 'London', nameJa: 'ロンドン', lat: 51.5074, lng: -0.1278, localKeywords: ['London walking tour 4K', 'London vlog stroll'] },
                    { name: 'Edinburgh', nameJa: 'エディンバラ', lat: 55.9533, lng: -3.1883, localKeywords: ['Edinburgh walking tour', 'Edinburgh vlog'] },
                    { name: 'Bath', nameJa: 'バース', lat: 51.3781, lng: -2.3597, localKeywords: ['Bath UK walking tour vlog 4K'] },
                ],
            },
            {
                code: 'CZ', name: 'Czech Republic', nameJa: 'チェコ', flag: '🇨🇿',
                lat: 49.8175, lng: 15.4730, zoom: 7, regionCode: 'CZ',
                cities: [
                    { name: 'Prague', nameJa: 'プラハ', lat: 50.0755, lng: 14.4378, localKeywords: ['Praha procházka vlog 4K', 'Prague walking tour'] },
                    { name: 'Český Krumlov', nameJa: 'チェスキークルムロフ', lat: 48.8126, lng: 14.3175, localKeywords: ['Český Krumlov walking tour vlog'] },
                ],
            },
            {
                code: 'NL', name: 'Netherlands', nameJa: 'オランダ', flag: '🇳🇱',
                lat: 52.1326, lng: 5.2913, zoom: 7, regionCode: 'NL',
                cities: [
                    { name: 'Amsterdam', nameJa: 'アムステルダム', lat: 52.3676, lng: 4.9041, localKeywords: ['Amsterdam wandeling vlog 4K', 'Amsterdam walking tour'] },
                    { name: 'Utrecht', nameJa: 'ユトレヒト', lat: 52.0907, lng: 5.1214, localKeywords: ['Utrecht walking tour vlog'] },
                ],
            },
            {
                code: 'DE', name: 'Germany', nameJa: 'ドイツ', flag: '🇩🇪',
                lat: 51.1657, lng: 10.4515, zoom: 6, regionCode: 'DE',
                cities: [
                    { name: 'Cologne', nameJa: 'ケルン', lat: 50.9333, lng: 6.9500, localKeywords: ['Köln Spaziergang vlog', 'Cologne walking tour 4K'] },
                    { name: 'Munich', nameJa: 'ミュンヘン', lat: 48.1351, lng: 11.5820, localKeywords: ['München Spaziergang vlog', 'Munich walking tour'] },
                    { name: 'Hamburg', nameJa: 'ハンブルク', lat: 53.5753, lng: 10.0153, localKeywords: ['Hamburg Spaziergang vlog', 'Hamburg walking tour'] },
                ],
            },
            {
                code: 'HU', name: 'Hungary', nameJa: 'ハンガリー', flag: '🇭🇺',
                lat: 47.1625, lng: 19.5033, zoom: 7, regionCode: 'HU',
                cities: [
                    { name: 'Budapest', nameJa: 'ブダペスト', lat: 47.4979, lng: 19.0402, localKeywords: ['Budapest séta vlog 4K', 'Budapest walking tour'] },
                ],
            },
            {
                code: 'PT', name: 'Portugal', nameJa: 'ポルトガル', flag: '🇵🇹',
                lat: 39.3999, lng: -8.2245, zoom: 7, regionCode: 'PT',
                cities: [
                    { name: 'Lisbon', nameJa: 'リスボン', lat: 38.7223, lng: -9.1393, localKeywords: ['Lisboa passeio vlog 4K', 'Lisbon walking tour'] },
                    { name: 'Porto', nameJa: 'ポルト', lat: 41.1579, lng: -8.6291, localKeywords: ['Porto passeio vlog', 'Porto walking tour 4K'] },
                ],
            },
            {
                code: 'GR', name: 'Greece', nameJa: 'ギリシャ', flag: '🇬🇷',
                lat: 39.0742, lng: 21.8243, zoom: 6, regionCode: 'GR',
                cities: [
                    { name: 'Athens', nameJa: 'アテネ', lat: 37.9838, lng: 23.7275, localKeywords: ['Αθήνα βόλτα vlog', 'Athens Greece walking tour 4K'] },
                    { name: 'Santorini', nameJa: 'サントリーニ', lat: 36.3932, lng: 25.4615, localKeywords: ['Santorini Greece walking tour vlog 4K'] },
                ],
            },
            {
                code: 'PL', name: 'Poland', nameJa: 'ポーランド', flag: '🇵🇱',
                lat: 51.9194, lng: 19.1451, zoom: 6, regionCode: 'PL',
                cities: [
                    { name: 'Kraków', nameJa: 'クラクフ', lat: 50.0647, lng: 19.9450, localKeywords: ['Kraków spacer vlog 4K', 'Krakow walking tour'] },
                    { name: 'Warsaw', nameJa: 'ワルシャワ', lat: 52.2297, lng: 21.0122, localKeywords: ['Warszawa spacer vlog', 'Warsaw walking tour'] },
                ],
            },
            {
                code: 'HR', name: 'Croatia', nameJa: 'クロアチア', flag: '🇭🇷',
                lat: 45.1000, lng: 15.2000, zoom: 7, regionCode: 'HR',
                cities: [
                    { name: 'Dubrovnik', nameJa: 'ドゥブロヴニク', lat: 42.6507, lng: 18.0944, localKeywords: ['Dubrovnik walking tour vlog 4K'] },
                    { name: 'Split', nameJa: 'スプリト', lat: 43.5081, lng: 16.4402, localKeywords: ['Split Croatia walking tour vlog'] },
                ],
            },
        ],
    },

    // ══════════════════════════════════════
    // 南北アメリカ (10 countries)
    // ══════════════════════════════════════
    {
        id: 'americas',
        name: 'Americas',
        nameJa: '南北アメリカ',
        icon: '🗽',
        lat: 5.0,
        lng: -70.0,
        zoom: 3,
        countries: [
            {
                code: 'US', name: 'USA', nameJa: 'アメリカ', flag: '🇺🇸',
                lat: 37.0902, lng: -95.7129, zoom: 4, regionCode: 'US',
                cities: [
                    { name: 'New York City', nameJa: 'ニューヨーク', lat: 40.7128, lng: -74.0060, localKeywords: ['New York City walking tour 4K', 'Manhattan walk vlog'] },
                    { name: 'Los Angeles', nameJa: 'ロサンゼルス', lat: 34.0522, lng: -118.2437, localKeywords: ['Los Angeles walking tour 4K', 'LA vlog walk'] },
                    { name: 'New Orleans', nameJa: 'ニューオーリンズ', lat: 29.9511, lng: -90.0715, localKeywords: ['New Orleans walking tour vlog 4K'] },
                    { name: 'San Francisco', nameJa: 'サンフランシスコ', lat: 37.7749, lng: -122.4194, localKeywords: ['San Francisco walking tour 4K', 'SF vlog'] },
                ],
            },
            {
                code: 'CA', name: 'Canada', nameJa: 'カナダ', flag: '🇨🇦',
                lat: 56.1304, lng: -106.3468, zoom: 4, regionCode: 'CA',
                cities: [
                    { name: 'Vancouver', nameJa: 'バンクーバー', lat: 49.2827, lng: -123.1207, localKeywords: ['Vancouver walking tour 4K vlog'] },
                    { name: 'Toronto', nameJa: 'トロント', lat: 43.6532, lng: -79.3832, localKeywords: ['Toronto walking tour 4K vlog'] },
                    { name: 'Quebec', nameJa: 'ケベックシティ', lat: 46.8139, lng: -71.2080, localKeywords: ['Québec balade vlog 4K', 'Quebec City walking tour'] },
                ],
            },
            {
                code: 'MX', name: 'Mexico', nameJa: 'メキシコ', flag: '🇲🇽',
                lat: 23.6345, lng: -102.5528, zoom: 5, regionCode: 'MX',
                cities: [
                    { name: 'Mexico City', nameJa: 'メキシコシティ', lat: 19.4326, lng: -99.1332, localKeywords: ['Ciudad de México caminata vlog 4K', 'Mexico City walking tour'] },
                    { name: 'Oaxaca', nameJa: 'オアハカ', lat: 17.0732, lng: -96.7266, localKeywords: ['Oaxaca caminata vlog', 'Oaxaca walking tour'] },
                    { name: 'Mérida', nameJa: 'メリダ', lat: 20.9674, lng: -89.5926, localKeywords: ['Mérida Yucatán caminata vlog', 'Merida Mexico walking tour'] },
                ],
            },
            {
                code: 'BR', name: 'Brazil', nameJa: 'ブラジル', flag: '🇧🇷',
                lat: -14.2350, lng: -51.9253, zoom: 4, regionCode: 'BR',
                cities: [
                    { name: 'Rio de Janeiro', nameJa: 'リオデジャネイロ', lat: -22.9068, lng: -43.1729, localKeywords: ['Rio de Janeiro caminhada vlog 4K', 'Rio walking tour'] },
                    { name: 'São Paulo', nameJa: 'サンパウロ', lat: -23.5505, lng: -46.6333, localKeywords: ['São Paulo caminhada vlog', 'Sao Paulo walking tour'] },
                ],
            },
            {
                code: 'AR', name: 'Argentina', nameJa: 'アルゼンチン', flag: '🇦🇷',
                lat: -38.4161, lng: -63.6167, zoom: 4, regionCode: 'AR',
                cities: [
                    { name: 'Buenos Aires', nameJa: 'ブエノスアイレス', lat: -34.6037, lng: -58.3816, localKeywords: ['Buenos Aires caminata vlog 4K', 'Buenos Aires walking tour'] },
                    { name: 'Patagonia', nameJa: 'パタゴニア', lat: -41.1335, lng: -71.3103, localKeywords: ['Patagonia Argentina travel vlog 4K'] },
                ],
            },
            {
                code: 'CL', name: 'Chile', nameJa: 'チリ', flag: '🇨🇱',
                lat: -35.6751, lng: -71.5430, zoom: 5, regionCode: 'CL',
                cities: [
                    { name: 'Santiago', nameJa: 'サンティアゴ', lat: -33.4489, lng: -70.6693, localKeywords: ['Santiago caminata vlog 4K', 'Santiago Chile walking tour'] },
                    { name: 'Valparaíso', nameJa: 'バルパライソ', lat: -33.0458, lng: -71.6197, localKeywords: ['Valparaíso caminata vlog', 'Valparaiso walking tour'] },
                ],
            },
            {
                code: 'PE', name: 'Peru', nameJa: 'ペルー', flag: '🇵🇪',
                lat: -9.1900, lng: -75.0152, zoom: 5, regionCode: 'PE',
                cities: [
                    { name: 'Machu Picchu', nameJa: 'マチュピチュ', lat: -13.1631, lng: -72.5450, localKeywords: ['Machu Picchu walking tour vlog 4K'] },
                    { name: 'Cusco', nameJa: 'クスコ', lat: -13.5319, lng: -71.9675, localKeywords: ['Cusco caminata vlog 4K', 'Cusco Peru walking tour'] },
                    { name: 'Lima', nameJa: 'リマ', lat: -12.0464, lng: -77.0428, localKeywords: ['Lima caminata vlog 4K', 'Lima Peru walking tour'] },
                ],
            },
            {
                code: 'CO', name: 'Colombia', nameJa: 'コロンビア', flag: '🇨🇴',
                lat: 4.5709, lng: -74.2973, zoom: 5, regionCode: 'CO',
                cities: [
                    { name: 'Cartagena', nameJa: 'カルタヘナ', lat: 10.3910, lng: -75.4794, localKeywords: ['Cartagena caminata vlog 4K', 'Cartagena Colombia walking tour'] },
                    { name: 'Medellín', nameJa: 'メデジン', lat: 6.2442, lng: -75.5812, localKeywords: ['Medellín caminata vlog 4K', 'Medellin walking tour'] },
                ],
            },
            {
                code: 'CU', name: 'Cuba', nameJa: 'キューバ', flag: '🇨🇺',
                lat: 21.5218, lng: -77.7812, zoom: 7, regionCode: 'CU',
                cities: [
                    { name: 'Havana', nameJa: 'ハバナ', lat: 23.1136, lng: -82.3666, localKeywords: ['Havana Cuba walking tour vlog 4K'] },
                    { name: 'Trinidad', nameJa: 'トリニダ', lat: 21.8030, lng: -79.9836, localKeywords: ['Trinidad Cuba walking tour vlog'] },
                ],
            },
            {
                code: 'EC', name: 'Ecuador', nameJa: 'エクアドル', flag: '🇪🇨',
                lat: -1.8312, lng: -78.1834, zoom: 6, regionCode: 'EC',
                cities: [
                    { name: 'Quito', nameJa: 'キト', lat: -0.1807, lng: -78.4678, localKeywords: ['Quito caminata vlog 4K', 'Quito Ecuador walking tour'] },
                    { name: 'Galápagos', nameJa: 'ガラパゴス', lat: -0.9538, lng: -90.9656, localKeywords: ['Galapagos Islands travel vlog 4K'] },
                ],
            },
        ],
    },

    // ══════════════════════════════════════
    // アフリカ・オセアニア (10 countries)
    // ══════════════════════════════════════
    {
        id: 'africa-oceania',
        name: 'Africa & Oceania',
        nameJa: 'アフリカ・オセアニア',
        icon: '🦁',
        lat: -15.0,
        lng: 30.0,
        zoom: 3,
        countries: [
            {
                code: 'ZA', name: 'South Africa', nameJa: '南アフリカ', flag: '🇿🇦',
                lat: -30.5595, lng: 22.9375, zoom: 5, regionCode: 'ZA',
                cities: [
                    { name: 'Cape Town', nameJa: 'ケープタウン', lat: -33.9249, lng: 18.4241, localKeywords: ['Cape Town walking tour 4K vlog'] },
                    { name: 'Johannesburg', nameJa: 'ヨハネスブルグ', lat: -26.2041, lng: 28.0473, localKeywords: ['Johannesburg walking tour vlog 4K'] },
                ],
            },
            {
                code: 'KE', name: 'Kenya', nameJa: 'ケニア', flag: '🇰🇪',
                lat: -0.0236, lng: 37.9062, zoom: 6, regionCode: 'KE',
                cities: [
                    { name: 'Nairobi', nameJa: 'ナイロビ', lat: -1.2921, lng: 36.8219, localKeywords: ['Nairobi Kenya walking tour vlog 4K'] },
                    { name: 'Mombasa', nameJa: 'モンバサ', lat: -4.0435, lng: 39.6682, localKeywords: ['Mombasa Kenya walking tour vlog'] },
                ],
            },
            {
                code: 'AU', name: 'Australia', nameJa: 'オーストラリア', flag: '🇦🇺',
                lat: -25.2744, lng: 133.7751, zoom: 4, regionCode: 'AU',
                cities: [
                    { name: 'Sydney', nameJa: 'シドニー', lat: -33.8688, lng: 151.2093, localKeywords: ['Sydney walking tour 4K vlog'] },
                    { name: 'Melbourne', nameJa: 'メルボルン', lat: -37.8136, lng: 144.9631, localKeywords: ['Melbourne walking tour 4K vlog'] },
                    { name: 'Cairns', nameJa: 'ケアンズ', lat: -16.9186, lng: 145.7781, localKeywords: ['Cairns Australia travel vlog 4K'] },
                ],
            },
            {
                code: 'NZ', name: 'New Zealand', nameJa: 'ニュージーランド', flag: '🇳🇿',
                lat: -40.9006, lng: 174.8860, zoom: 5, regionCode: 'NZ',
                cities: [
                    { name: 'Queenstown', nameJa: 'クイーンズタウン', lat: -45.0312, lng: 168.6626, localKeywords: ['Queenstown New Zealand walking tour vlog 4K'] },
                    { name: 'Auckland', nameJa: 'オークランド', lat: -36.8485, lng: 174.7633, localKeywords: ['Auckland walking tour vlog 4K'] },
                ],
            },
            {
                code: 'ET', name: 'Ethiopia', nameJa: 'エチオピア', flag: '🇪🇹',
                lat: 9.1450, lng: 40.4897, zoom: 6, regionCode: 'ET',
                cities: [
                    { name: 'Addis Ababa', nameJa: 'アディスアベバ', lat: 9.0250, lng: 38.7469, localKeywords: ['Addis Ababa Ethiopia walking tour vlog 4K'] },
                    { name: 'Lalibela', nameJa: 'ラリベラ', lat: 12.0319, lng: 39.0467, localKeywords: ['Lalibela Ethiopia travel vlog 4K'] },
                ],
            },
            {
                code: 'TZ', name: 'Tanzania', nameJa: 'タンザニア', flag: '🇹🇿',
                lat: -6.3690, lng: 34.8888, zoom: 6, regionCode: 'TZ',
                cities: [
                    { name: 'Zanzibar', nameJa: 'ザンジバル', lat: -6.1659, lng: 39.1917, localKeywords: ['Zanzibar walking tour vlog 4K'] },
                    { name: 'Serengeti', nameJa: 'セレンゲティ', lat: -2.3333, lng: 34.8333, localKeywords: ['Serengeti Tanzania safari travel vlog 4K'] },
                ],
            },
            {
                code: 'GH', name: 'Ghana', nameJa: 'ガーナ', flag: '🇬🇭',
                lat: 7.9465, lng: -1.0232, zoom: 7, regionCode: 'GH',
                cities: [
                    { name: 'Accra', nameJa: 'アクラ', lat: 5.6037, lng: -0.1870, localKeywords: ['Accra Ghana walking tour vlog 4K'] },
                    { name: 'Kumasi', nameJa: 'クマシ', lat: 6.6885, lng: -1.6244, localKeywords: ['Kumasi Ghana walking tour vlog'] },
                ],
            },
            {
                code: 'SN', name: 'Senegal', nameJa: 'セネガル', flag: '🇸🇳',
                lat: 14.4974, lng: -14.4524, zoom: 7, regionCode: 'SN',
                cities: [
                    { name: 'Dakar', nameJa: 'ダカール', lat: 14.7167, lng: -17.4677, localKeywords: ['Dakar Sénégal vlog balade 4K', 'Dakar Senegal walking tour'] },
                ],
            },
            {
                code: 'FJ', name: 'Fiji', nameJa: 'フィジー', flag: '🇫🇯',
                lat: -17.7134, lng: 178.0650, zoom: 8, regionCode: 'FJ',
                cities: [
                    { name: 'Suva', nameJa: 'スバ', lat: -18.1248, lng: 178.4501, localKeywords: ['Fiji Suva travel vlog 4K', 'Fiji islands vlog'] },
                ],
            },
            {
                code: 'MU', name: 'Mauritius', nameJa: 'モーリシャス', flag: '🇲🇺',
                lat: -20.3484, lng: 57.5522, zoom: 9, regionCode: 'MU',
                cities: [
                    { name: 'Port Louis', nameJa: 'ポートルイス', lat: -20.1609, lng: 57.4989, localKeywords: ['Mauritius travel vlog 4K', 'Ile Maurice vlog'] },
                ],
            },
        ],
    },
];

// Flatten all cities for quick search
export function getAllCities(): Array<City & { countryName: string; countryFlag: string; regionCode: string }> {
    return AREAS.flatMap(area =>
        area.countries.flatMap(country =>
            country.cities.map(city => ({
                ...city,
                countryName: country.name,
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
    city: City & { countryName: string; countryFlag: string; regionCode: string };
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
            countryName: best.country.name,
            countryFlag: best.country.flag,
            regionCode: best.country.regionCode,
        },
        country: best.country,
        area: best.area,
    };
}

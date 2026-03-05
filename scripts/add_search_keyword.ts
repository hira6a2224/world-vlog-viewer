import fs from 'fs';
import path from 'path';

const messagesDir = path.join(process.cwd(), 'src/messages');

const uiModes: Record<string, any> = {
    en: { mode_vlog: "VLOG", mode_camp: "CAMP", mode_scenic: "SCENIC", search_keyword: "walking tour" },
    ja: { mode_vlog: "Vlog", mode_camp: "キャンプ", mode_scenic: "絶景", search_keyword: "散歩" },
    zh: { mode_vlog: "日常记录", mode_camp: "露营", mode_scenic: "绝景", search_keyword: "散步" },
    es: { mode_vlog: "Vlog", mode_camp: "Acampar", mode_scenic: "Panorámico", search_keyword: "caminando" },
    fr: { mode_vlog: "Vlog", mode_camp: "Camping", mode_scenic: "Paysage", search_keyword: "visite à pied" },
    ar: { mode_vlog: "مدونة فيديو", mode_camp: "تخييم", mode_scenic: "مناظر خلابة", search_keyword: "جولة مشي" }
};

const locales = ['en', 'ja', 'zh', 'es', 'fr', 'ar'];

for (const loc of locales) {
    const filePath = path.join(messagesDir, `${loc}.json`);
    if (!fs.existsSync(filePath)) continue;

    const dat = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    dat.Index.mode_vlog = uiModes[loc]?.mode_vlog;
    dat.Index.mode_camp = uiModes[loc]?.mode_camp;
    dat.Index.mode_scenic = uiModes[loc]?.mode_scenic;
    dat.Index.search_keyword = uiModes[loc]?.search_keyword;

    fs.writeFileSync(filePath, JSON.stringify(dat, null, 2));
}

console.log('Search keywords appended.');

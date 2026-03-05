import fs from 'fs';
import path from 'path';

const messagesDir = path.join(process.cwd(), 'src/messages');
const locales = ['en', 'ja', 'zh', 'ar', 'es', 'fr'];

const translations: Record<string, string> = {
    en: 'Failed to connect to video server. Please try again later.',
    ja: '動画サーバーへの接続に失敗しました。後でもう一度お試しください。',
    zh: '无法连接到视频服务器，请稍后再试。',
    ar: 'فشل الاتصال بخادم الفيديو. يرجى المحاولة مرة أخرى لاحقًا.',
    es: 'Error al conectar con el servidor de video. Inténtalo de nuevo más tarde.',
    fr: 'Échec de la connexion au serveur vidéo. Veuillez réessayer plus tard.'
};

for (const locale of locales) {
    const filePath = path.join(messagesDir, `${locale}.json`);
    if (!fs.existsSync(filePath)) continue;

    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);

    if (data.Index && !data.Index.error_connection) {
        data.Index.error_connection = translations[locale];
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
        console.log(`Added error_connection to ${locale}.json`);
    }
}

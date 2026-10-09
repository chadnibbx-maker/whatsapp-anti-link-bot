
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

const LINK_REGEX =
  /(?:https?:\/\/|www\.|wa\.me\/|chat\.whatsapp\.com\/|t\.me\/|bit\.ly\/|[a-z0-9-]+\.(?:com|net|org|in|io|co|me|info|xyz|app|dev|site|online|store|tech|gg|ly|to|edu|gov|tv|ai|uk|us|ca|de|fr|ru|jp|cn|br|au|bd|pk|ng|za|eu|pro|biz|cloud|blog|shop|live|click|link|top|icu|vip|fun|one|today|world|website|space|digital|agency|company|solutions|services|support|news|media|social|video|music|design|art|photo|game|games|club|work|life|love|email|network|systems|technology|center|academy|education|travel|health|finance|market|business|expert|guide|wiki|page|pages|press|group|team|zone|plus|global|international|capital|care|run|fit|food|bar|cafe|restaurant|hotel|shop|store|sale|deals|cheap|best|cool|fun|lol|wtf|meme|porn|xxx|adult|sex|cam|tube|stream|download|upload|file|files|cloud|app|apk|pdf|zip|me|cc|ws|tk|ml|ga|cf|gq)\b)/i;

client.on('qr', qr => {
  console.log('Scan this QR code with WhatsApp:');
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('WhatsApp Anti-Link Bot is online!');
});

client.on('message', async message => {
  try {
    if (message.fromMe) return;

    // Only moderate group messages
    if (!message.from.endsWith('@g.us')) return;

    const text = message.body || '';
    const hasLink = LINK_REGEX.test(text);

    if (hasLink) {
      await message.delete(true);
      console.log('Group link message removed.');
    }

    // Adult image/video/sticker moderation is not
    // enabled yet; it requires a separate classifier.
  } catch (error) {
    console.error('Message moderation error:', error.message);
  }
});

client.on('auth_failure', message => {
  console.error('WhatsApp authentication failed:', message);
});

client.on('disconnected', reason => {
  console.log('WhatsApp disconnected:', reason);
});

client.initialize();
  

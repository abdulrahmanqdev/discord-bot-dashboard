# Discord Dashboard

Discord botun için modern ve işlevsel bir yönetim paneli. Sunucu yönetimi, komut sistemi, ekonomi (coin sistemi), hoş geldin mesajları, caps-lock engelleme ve daha fazlası tek panelde.

## Proje Yapısı

```
discord-dashboard/
├── client/    # Next.js 14 + React web paneli (Port: 3000)
└── server/    # Node.js + Express API + Discord Bot (Port: 3745)
```

## Kullanılan Teknolojiler

- **Frontend:** Next.js 14, React 18, Tailwind CSS, Framer Motion, Zustand, NextAuth, Recharts
- **Backend:** Node.js, Express 5, Discord.js v14, Firebase Admin, JWT
- **Veritabanı:** Firebase Firestore (ayarlar, coin, kullanıcı verileri)

## Kurulum

### 1. Bağımlılıkları Yükle

```bash
# Client
cd client
npm install

# Server (yeni terminal)
cd server
npm install
```

### 2. Discord Developer Portal Ayarları

1. [Discord Developers](https://discord.com/developers/applications) adresinden yeni bir Application (bot) oluştur
2. **Bot** sekmesinden bot tokenini al ve **Privileged Gateway Intents** (Server Members, Message Content vb.) izinlerini aç
3. **OAuth2 → General** sekmesine gel ve **Redirects** kısmına aşağıdaki URL'yi ekle ve **Save**'e tıkla:
   ```
   http://localhost:3000/api/auth/callback/discord
   ```
4. **OAuth2 → General** sayfasındaki `CLIENT ID` ve `CLIENT SECRET` değerlerini kopyala (aşağıda lazım olacak)

### 3. Firebase Ayarları

1. [Firebase Console](https://console.firebase.google.com/)'dan yeni proje oluştur
2. **Project Settings → Service Accounts → Generate New Private Key** butonuna tıkla ve JSON dosyasını indir
3. İndirdiğin JSON dosyasının içeriğini kopyala ve şu iki dosyanın içine yapıştır:
   - `server/src/serviceAccountKey.json`
   - `server/src/bot/Config/serviceAccountKey.json`

### 4. Ayar Dosyalarını Doldur

#### Client Ayarları — `client/src/settings.js`

```js
const settings = {
	port: 3000,
	api: {
		url: "http://localhost:3745", // Geliştirme için değişiklik yapmana gerek yok
	},
	bot: {
		id: "BURAYA_DISCORD_CLIENT_ID",      // Discord Developers → OAuth2 → Client ID
		token: "BURAYA_BOT_TOKEN",           // Discord Developers → Bot → Token
	},
	secret: "BURAYA_DISCORD_CLIENT_SECRET", // Discord Developers → OAuth2 → Client Secret
	jwt: "KENDI_Rastgele_SeCRET_KODUN",     // Güvenlik için rastgele bir değer (2 adet aynı olmalı)
};
```

#### Server Ayarları — `server/src/settings.js`

```js
module.exports = {
  port: 3745,
  origin: "http://localhost:3000",
  bot: {
		id: "BURAYA_DISCORD_CLIENT_ID",      // Yukarıdaki ile AYNI olmalı
		token: "BURAYA_BOT_TOKEN",           // Yukarıdaki ile AYNI olmalı
	},
	secret: "BURAYA_DISCORD_CLIENT_SECRET", // Yukarıdaki ile AYNI olmalı
  jwt: "KENDI_Rastgele_SeCRET_KODUN",     // Client tarafı ile AYNI olmalı
}
```

#### Bot Config — `server/src/bot/Config/botConfig.js`

```js
module.exports = {
   developersID: ["DISCORD_KULLANICI_IDN"], // Bot sahibinin Discord kullanıcı ID'si
   token: "BURAYA_BOT_TOKEN",               // Bot token (yukarıdaki ile aynı)
   serviceAccountKey: require('./serviceAccountKey.json'), // Firebase JSON dosyan
   playings: ["/help | /moderation-system" ],
}
```

> ⚠️ **Önemli:** `client` ve `server` içindeki `jwt` anahtarı **Aynı** olmalıdır, aksi takdirde oturum açmaz.

## Çalıştırma

İki terminal aç, her ikisini de çalıştır:

```bash
# Terminal 1 - Client (Web Paneli)
cd client
npm run dev

# Terminal 2 - Server (API + Bot)
cd server
npm start
```

Tarayıcıdan aç: **http://localhost:3000**

## Özellikler

- 🔐 Discord ile OAuth2 giriş
- 🖥️ Tüm sunucuları tek panelde görme & yönetme
- 👋 Hoş geldin mesajı sistemi (özelleştirilebilir)
- 🔠 Caps-Lock engelleme & uyarı sistemi
- 👥 Üye atma (kick) paneli
- 💰 Ekonomi / Coin sistemi (günlük coin, transfer, sıralama)
- 🔨 Moderasyon komutları (ban, kick, unban, blacklist)
- 📈 Premium üyelik sistemi
- 👤 Profil sayfası
- ❓ SSS ve güncelleme sayfaları

## Hızlı Başvuru — Doldurulacak Yerler Özeti

| Dosya | Alan | Nereden Alınır? |
|-------|------|-----------------|
| `client/src/settings.js` | `bot.id` | Discord Devs → OAuth2 → Client ID |
| `client/src/settings.js` | `bot.token` | Discord Devs → Bot → Token |
| `client/src/settings.js` | `secret` | Discord Devs → OAuth2 → Client Secret |
| `client/src/settings.js` | `jwt` | Kendin oluştur (her iki dosyada aynı) |
| `server/src/settings.js` | yukarıdakilerin hepsi | Yukarıdaki ile AYNI |
| `server/src/bot/Config/botConfig.js` | `developersID` | Kendi Discord Kullanıcı ID'n |
| `server/src/bot/Config/botConfig.js` | `token` | Bot Token |
| `serviceAccountKey.json` (2 adet) | Tümü | Firebase Console → Service Account |
| Discord Devs → Redirect URL | — | `http://localhost:3000/api/auth/callback/discord` |

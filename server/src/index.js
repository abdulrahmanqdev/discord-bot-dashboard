// @ts-check
const { client, start } = require("./base/bot.js");
const { verifyAuthorization } = require("./middlewares/authorization.js");
const settings = require("./settings.js");
const consola = require("consola");
const cors = require("cors");
const { ChannelType, Guild, EmbedBuilder } = require("discord.js");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const { db } = require("./bot/tools.js");
require("./bot/index");
const chalk = require("chalk");
const times = new Date()
const app = express();
app.use(morgan("dev"), express.json(), helmet());
app.use(cors({
  origin: settings.origin,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

app.get("/guilds", verifyAuthorization, async (/** @type {import("express").Request & { user: { id: string; iat: number; exp: number; } }} */ req, res) => {
  const guilds = client.guilds.cache.map((guild) => {
    const channels = guild.channels.cache.map((channel) => {
      return { id: channel.id, type: channel.type, name: channel.name };
    });
    const roles = guild.roles.cache.map((role) => {
      return { id: role.id, name: role.name };
    });
    /** @type {any} */
    const json = guild.toJSON();

    return { ...json, channels, roles }
  });
  const success = guilds.length >= 1 && guilds.every((guild) => guild instanceof Guild);

  res.status(200).send({ success, data: [...guilds] })
});

app.get("/guilds/:id/permissions", verifyAuthorization, async (/** @type {import("express").Request & { user: { id: string; iat: number; exp: number; } }} */ req, res) => {
  const guild = client.guilds.cache.get(req.params.id);
  if (!guild) {
    res.status(200).send({ success: typeof guild === "undefined", message: "The requested server does not exist or could not be found." });
    return;
  }

  try {
    const member = await guild.members.fetch(req.user.id);
    const permissions = member.permissions.toArray();

    res.status(200).send({ success: true, data: [...permissions] });
  } catch {
    res.status(200).send({ success: false, message: "Missing required permissions to access this resource." });
  }
});

app.post("/guilds/:id/channels/:channelId", verifyAuthorization, async (/** @type {import("express").Request & { user: { id: string; iat: number; exp: number; } }} */ req, res) => {
  const guild = client.guilds.cache.get(req.params.id);
  if (!guild) {
    res.status(200).send({ success: typeof guild === "undefined", message: "The requested server does not exist or could not be found." });
    return;
  }

  try {
   const channel = guild.channels.cache.get(req.params.channelId);
   if (!(channel && channel.type === ChannelType.GuildText)) {
    res.status(200).send({ success: typeof guild === "undefined", message: "The requested channel does not exist or could not be found." });
    return;
   }

   const embed = new EmbedBuilder()
   .setTitle("Hey, Dashboard'tan mesaj geldi baksana")
   .setDescription(`${req.body.message}`)
   .setColor("Blue")

   await channel.send({ embeds: [embed] });
    res.status(200).send({ success: true });
  } catch {
    res.status(200).send({ success: false, message: "Missing required permissions to access this resource." });
  }
});

app.post("/guilds/:id/system", verifyAuthorization, async (/** @type {import("express").Request & { user: { id: string; iat: number; exp: number; } }} */ req, res) => {
  const { entryChannel, exitChannel, enabled } = req.body;
  const guildId = req.params.id;
  if (typeof enabled === 'undefined') {
    return res.status(400).json({ success: false, message: "Enabled durumu eksik!" });
  }
  if (!entryChannel || !exitChannel) {
    return res.status(400).json({ success: false, message: "Giriş ve çıkış kanalları eksik!" });
  }

  const guild = client.guilds.cache.get(req.params.id);
  if (!guild) {
    return res.status(404).json({ success: false, message: "Sunucu bulunamadı." });
  }

  const currentSystemSettings = await db.get(`welcomeSetup/` + guild.id);
  if (currentSystemSettings && currentSystemSettings.status === true && enabled === true) {
    return res.status(400).json({ success: false, message: "Sistem zaten aktif!" });
  }

  try {
    await db.set(`welcomeSetup/` + guild.id, { 
      channel: entryChannel,
      channels: exitChannel, 
      enabled: enabled 
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Ayarlar kaydedilirken bir hata oluştu." });
  }
});
app.post("/guilds/:id/capslock", verifyAuthorization, async (/** @type {import("express").Request & { user: { id: string; iat: number; exp: number; } }} */ req, res) => {
  const { enabled, threshold, channel } = req.body;
  const userId = req.user?.id;
  const guildId = req.params.id;
  if (!userId) {
      return res.status(400).json({ success: false, message: "User ID eksik!" });
  }

  try {
      // Veritabanına ayarları kaydet
      await db.set(`moderation-system/capsSystem/${guildId}`, {
          channel: channel,
          enabled: enabled ? 'on' : 'off',
          threshold: threshold,
          user: userId, // Sistemi kaydeden kullanıcı ID'si
      });

      return res.status(200).json({ success: true, message: "CapsLock sistemi başarıyla kaydedildi." });
  } catch (error) {
      console.error("Veritabanı hatası:", error);
      return res.status(500).json({ success: false, message: "Ayarlar kaydedilirken bir hata oluştu." });
  }
});

app.post("/guilds/:id/kick", verifyAuthorization, async (/** @type {import("express").Request & { user: { id: string; iat: number; exp: number; } }} */ req, res) => {
  const { username, channelId } = req.body;
  const guildId = req.params.id;
  const userId = req.user?.id; // verifyAuthorization middleware'den gelen kullanıcı ID

  if (!username || username.trim() === "") {
    return res.status(400).json({ success: false, message: "Kullanıcı adı eksik!" });
  }
  if (!channelId || channelId.trim() === "") {
    return res.status(400).json({ success: false, message: "Kanal ID'si eksik!" });
  }

  const guild = client.guilds.cache.get(guildId);
  if (!guild) {
    return res.status(404).json({ success: false, message: "Sunucu bulunamadı." });
  }

  try {
    await db.set(`kick/${guildId}/${username}`, {
      addedAt: Date.now(),
      addedBy: userId || "unknown",
      streamer: username,
      streamId: null,
      channel: channelId
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Ayarlar kaydedilirken bir hata oluştu." });
  }
});

app.get("/guilds/:id/member-count", verifyAuthorization, async (req, res) => {
  const guild = client.guilds.cache.get(req.params.id);

  if (!guild) {
    return res.status(404).json({ success: false, message: "Sunucu bulunamadı." });
  }

  try {
    await guild.members.fetch();
    const memberCount = guild.memberCount;

    return res.status(200).json({ success: true, memberCount });
  } catch (error) {
    consola.error(error);
    return res.status(500).json({
      success: false,
      message: "Kullanıcı sayısı alınamadı.",
    });
  }
});


app.listen(settings.port, () => {
  console.log(chalk.blue(`${times.toLocaleString()}`) + chalk.magenta(` [PORT] `) + chalk.white(`The port was run successfully! http://localhost:${settings.port}/`))
  start();
})

// @ts-check
import settings from "@/settings.js";
import axios from "axios";

/**
 *
 * @param {string} access_token
 * @returns {Promise<import("discord-api-types/v10").APIGuild[]>}
 */
export async function getGuilds(access_token) {
	const httpResponse = await axios.get("https://discord.com/api/users/@me/guilds", {
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	});
	const guilds = httpResponse.data;

	return guilds;
}

/**
 * Discord API'den kullanıcı bilgilerini ve rozetlerini çeker.
 *
 * @param {string} access_token - Discord OAuth2 erişim token'ı
 * @returns {Promise<{ id: string, username: string, avatar: string, banner: string, public_flags: number }>} - Kullanıcı bilgileri
 */
export async function getUserInfo(access_token) {
	try {
		const httpResponse = await axios.get("https://discord.com/api/v10/users/@me", {
			headers: {
				Authorization: `Bearer ${access_token}`,
			},
		});
		return httpResponse.data;
	}
	catch (error) {
		console.error("Discord kullanıcı bilgileri alınırken hata oluştu:", error.response?.data || error.message);
		throw error;
	}
}

export function getBadgesFromFlags(flags) {
	const DiscordUserFlags = {
		DISCORD_EMPLOYEE: 1 << 0,
		PARTNERED_SERVER_OWNER: 1 << 1,
		HYPESQUAD_EVENTS: 1 << 2,
		BUG_HUNTER_LEVEL_1: 1 << 3,
		HOUSE_BRAVERY: 1 << 6,
		HOUSE_BRILLIANCE: 1 << 7,
		HOUSE_BALANCE: 1 << 8,
		EARLY_SUPPORTER: 1 << 9,
		BUG_HUNTER_LEVEL_2: 1 << 14,
		EARLY_VERIFIED_BOT_DEVELOPER: 1 << 17,
		NITRO: 1 << 19,
	};

	const badges = [];
	for (const [key, value] of Object.entries(DiscordUserFlags)) {
		if ((flags & value) === value) {
			badges.push(key);
		}
	}
	return badges;
}

export const DiscordBadgeIcons = {
	DISCORD_EMPLOYEE: "https://img.icons8.com/?size=100&id=Zk5UTKNPbUev&format=png&color=000000",
	PARTNERED_SERVER_OWNER: "https://img.icons8.com/?size=100&id=L7B44VoOdIqj&format=png&color=000000",
	HYPESQUAD_EVENTS: "https://img.icons8.com/?size=100&id=h6eKoXSRNFgA&format=png&color=000000",
	BUG_HUNTER_LEVEL_1: "https://img.icons8.com/?size=100&id=GsDKcItpztti&format=png&color=000000",
	HOUSE_BRAVERY: "https://img.icons8.com/?size=100&id=u1TI0IQMcE7q&format=png&color=000000",
	HOUSE_BRILLIANCE: "https://img.icons8.com/?size=100&id=Ln7pCdhGRrN9&format=png&color=000000",
	HOUSE_BALANCE: "https://img.icons8.com/?size=100&id=B1RNuFJol4fr&format=png&color=000000",
	EARLY_SUPPORTER: "https://img.icons8.com/?size=100&id=oCHhGw76VSOh&format=png&color=000000",
	BUG_HUNTER_LEVEL_2: "https://img.icons8.com/?size=100&id=efZLx2wJQTPk&format=png&color=000000",
	EARLY_VERIFIED_BOT_DEVELOPER: "https://img.icons8.com/?size=100&id=undefined&format=png&color=000000",
	NITRO: "https://img.icons8.com/?size=100&id=S6odLj8qKMjU&format=png&color=000000",
};

/**
 *
 * @param {string} jwt
 * @returns {Promise<import("discord-api-types/v10").APIGuild[]>}
 */
export async function getServers(jwt) {
	const httpResponse = await axios.get(`${settings.api.url}/guilds`, {
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${jwt}`,
		},
	});
	const guilds = httpResponse.data;

	return guilds?.data;
}

/**
 *
 * @param {string} server_id
 * @param {string} jwt
 * @returns {Promise<string[]>}
 */
export async function getPermissions(server_id, jwt) {
	const httpResponse = await axios.get(`${settings.api.url}/guilds/${server_id}/permissions`, {
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${jwt}`,
		},
	});
	const permissions = httpResponse.data;

	return permissions?.data;
}

/**
 *
 * @param {string} server_id
 * @param {string} jwt
 * @param {string} channel_id
 * @param {string} message
 * @returns {Promise<string[]>}
 */
export async function setMessage(server_id, channel_id, jwt, message) {
	const httpResponse = await axios.post(`${settings.api.url}/guilds/${server_id}/channels/${channel_id}`, { message }, {
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${jwt}`,
		},
	});
	const permissions = httpResponse.data;

	return permissions;
}

export async function setSystemSettings(server_id, jwt, settingsData) {
	try {
		// Kullanıcı adı kontrolü
		if (!settingsData.entryChannel || !settingsData.exitChannel) {
			throw new Error("Giriş ve çıkış kanalları belirtilmelidir.");
		}

		if (!settingsData.userId) {
			throw new Error("Kullanıcı ID'si eksik.");
		}

		// API isteği gönder
		const httpResponse = await axios.post(`${settings.api.url}/guilds/${server_id}/system`, settingsData, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${jwt}`,
			},
		});

		return httpResponse.data;
	}
	catch (error) {
		console.error("Sistem ayarları kaydedilirken hata oluştu:", error.message || error);
		throw error;
	}
}

/**
 * @param {string} server_id
 * @param {string} jwt
 * @returns {Promise<{ success: boolean, data: { enabled: boolean, entryChannel: string, exitChannel: string } }>}
 */
export async function getSystemSettings(server_id, jwt) {
	try {
		const httpResponse = await axios.get(`${settings.api.url}/guilds/${server_id}/system`, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${jwt}`,
			},
		});
		return httpResponse.data?.data;
	}
	catch (error) {
		console.error("Sistem ayarları alınırken hata oluştu:", error);
		return null;
	}
}

/**
 * Kick sistemi ayarlarını kaydetmek için bir HTTP isteği gönderir.
 *
 * @param {string} server_id - Sunucu ID'si
 * @param {string} jwt - Kullanıcı JWT token'ı
 * @param {{ enabled: boolean, reason: string }} settingsData - Kick sistemi ayarları
 * @returns {Promise<{ success: boolean, message?: string }>} - API yanıtı
 */
export async function setKickSettings(server_id, jwt, settingsData) {
	try {
	  const httpResponse = await axios.post(`${settings.api.url}/guilds/${server_id}/kick`, settingsData, {
			headers: {
		  "Content-Type": "application/json",
		  Authorization: `Bearer ${jwt}`,
			},
	  });
	  return httpResponse.data;
	}
	catch (error) {
	  console.error("Kick sistemi ayarları kaydedilirken hata oluştu:", error.message || error);
	  throw error;
	}
}

/**
 * Kick sistemi ayarlarını almak için bir HTTP isteği gönderir.
 *
 * @param {string} server_id - Sunucu ID'si
 * @param {string} jwt - Kullanıcı JWT token'ı
 * @returns {Promise<{ success: boolean, data: { enabled: boolean, reason: string } }>} - Kick sistemi ayarları
 */
export async function getKickSettings(server_id, jwt) {
	try {
	  const httpResponse = await axios.get(`${settings.api.url}/guilds/${server_id}/kick`, {
			headers: {
		  "Content-Type": "application/json",
		  Authorization: `Bearer ${jwt}`,
			},
	  });
	  return httpResponse.data?.data;
	}
	catch (error) {
	  console.error("Kick sistemi ayarları alınırken hata oluştu:", error.response?.data || error.message);
	  return null;
	}
}

/**
 * CapsLock sistemi ayarlarını kaydetmek için bir HTTP isteği gönderir.
 *
 * @param {string} server_id - Sunucu ID'si
 * @param {string} jwt - Kullanıcı JWT token'ı
 * @param {{ enabled: boolean, threshold: number }} settingsData - CapsLock sistemi ayarları
 * @returns {Promise<{ success: boolean, message?: string }>} - API yanıtı
 */
export async function setCapsLockSettings(server_id, jwt, settingsData) {
	try {
		const httpResponse = await axios.post(`${settings.api.url}/guilds/${server_id}/capslock`, settingsData, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${jwt}`,
			},
		});
		return httpResponse.data;
	}
	catch (error) {
		console.error("CapsLock sistemi ayarları kaydedilirken hata oluştu:", error);
		return { success: false, message: "Ayarlar kaydedilemedi. Lütfen tekrar deneyin." };
	}
}

export async function getCapsLockSettings(server_id, jwt) {
	try {
		const httpResponse = await axios.get(`${settings.api.url}/guilds/${server_id}/capslock`, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${jwt}`,
			},
		});

		return httpResponse.data?.data;
	}
	catch (error) {
		if (error.response && error.response.status === 404) {
			console.warn(`Sunucu (${server_id}) için CapsLock ayarları bulunamadı.`);
			return { enabled: false, threshold: 50 };
		}

		console.error("CapsLock sistemi ayarları alınırken hata oluştu:", error);
		return null;
	}
}

/**
 * Kullanıcının açıklamasını backend'de günceller.
 *
 * @param {string} jwt - Kullanıcı JWT token'ı
 * @param {string} description - Yeni açıklama metni
 * @returns {Promise<{ success: boolean, message?: string }>} - API yanıtı
 */
export async function updateUserDescription(jwt, description) {
	try {
		const httpResponse = await axios.put(`${settings.api.url}/users/@me/description`, { description }, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${jwt}`,
			},
		});
		return httpResponse.data;
	}
	catch (error) {
		console.error("Kullanıcı açıklaması güncellenirken hata oluştu:", error.response?.data || error.message);
		throw error;
	}
}
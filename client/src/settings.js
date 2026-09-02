// @ts-check
const settings = {
	port: 3000,
	api: {
		url: process.env.NODE_ENV === "development" ? "http://localhost:3745" : "...",
	},
	bot: {
		id: "YOUR_DISCORD_CLIENT_ID",
		token: "YOUR_DISCORD_BOT_TOKEN",
	},
	secret: "YOUR_DISCORD_CLIENT_SECRET",
	jwt: "CREATE_A_RANDOM_SECRET_STRING_HERE_MUST_MATCH_SERVER",
};

export default settings;

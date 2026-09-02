// @ts-check
import settings from "@/settings.js";
import jwt from "jsonwebtoken";
import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

export const Authorization = NextAuth({
	providers: [
		DiscordProvider({
			clientId: settings.bot.id,
			clientSecret: settings.secret,
			authorization: { params: { scope: "identify guilds email" } },
		}),
	],
	secret: settings.jwt,
	callbacks: {
		async jwt({ token, account, user }) {
			if (account && user) {
				token.access_token = account.access_token;
				token.jwt = jwt.sign({ id: user.id }, settings.jwt, { expiresIn: "30d" });
			}

			return token;
		},
		async session({ session, token }) {
			// @ts-expect-error
			session.user.access_token = token.access_token;
			// @ts-expect-error
			session.user.jwt = token.jwt;
			return session;
		},
	},
});

export { Authorization as GET, Authorization as POST };


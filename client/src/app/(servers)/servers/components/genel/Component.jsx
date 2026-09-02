"use client";
import NotFound from "@/components/NotFound";
import Spinner from "@/components/Spinner";
import { getGuilds, getPermissions, getServers } from "@/functions/http";
import { useGuilds } from "@/stores/guilds";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useAsync } from "react-use";
import {
	Users,
	MessageCircle,
	Shield,
	Activity,
	Server,
	Settings,
	ChevronUp,
	ChevronDown,
	BarChart3,
	Calendar,
	Hash,
} from "lucide-react";

export default function Component() {
	const { data, status } = useSession();
	const params = useParams();
	const store = useGuilds();
	const [activeTab, setActiveTab] = useState("overview");
	const [showStats, setShowStats] = useState(true);

	const { loading, value } = useAsync(async () => {
		if (!data?.user?.access_token || !data?.user?.jwt) return null;

		try {
			const state = {
				servers: await getServers(data?.user.jwt),
				guilds: [],
				guild: null,
				permissions: [],
			};

			if (!(store?.array && store?.array.length)) {
				state.guilds = await getGuilds(data?.user.access_token);
				store.setArray(state.guilds);
			}
			else {
				state.guilds = store.array;
			}

			state.permissions = await getPermissions(params.server_id, data?.user.jwt);

			const checkUser = state.guilds.find((val) => val.id === params.server_id);

			if (checkUser) {
				state.guild = state.servers?.find((val) => val.id === params.server_id);
			}

			return state;
		}
		catch (error) {
			console.log(error);
			return null;
		}
	}, [status, params.server_id]);

	if (status === "loading" || loading) return <Spinner />;
	if (status === "unauthenticated") return <NotFound />;
	if (!value || !value.guild) return <NotFound />;

	// Parse channel types
	const textChannels = value.guild.channels?.filter((channel) => channel.type === 0 || channel.type === 5)?.length || 0;
	const voiceChannels = value.guild.channels?.filter((channel) => channel.type === 2)?.length || 0;
	const categories = value.guild.channels?.filter((channel) => channel.type === 4)?.length || 0;

	const serverStats = {
		textChannels,
		voiceChannels,
		categories,
		totalChannels: (value.guild.channels?.length || 0) - categories,
		roles: value.guild.roles?.length || 0,
		boosts: value.guild.premium_subscription_count || 0,
		createdAt: new Date(value.guild.createdAt || Date.now()).toLocaleDateString("tr-TR"),
		messages: Math.floor(Math.random() * 10000) + 5000,
		commands: Math.floor(Math.random() * 500) + 100,
		// Include the logged-in user in online count (add 1)
		onlineUsers: Math.floor((value.guild.memberCount || 0) * 0.4) + 1,
	};

	return (
		<div className="min-h-screen text-white p-4 md:p-6">
			<div className="max-w-7xl mx-auto">
				{/* Server Header */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-6 shadow-xl"
				>
					<div className="flex flex-col md:flex-row items-start md:items-center gap-4">
						<div className="flex-shrink-0">
							<div className="relative">
								<div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full opacity-75 blur-sm"></div>
								<div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden border-2 border-gray-700">
									{value.guild.icon ? (
										<img
											src={`https://cdn.discordapp.com/icons/${value.guild.id}/${value.guild.icon}.png`}
											alt={value.guild.name}
											className="w-full h-full object-cover"
										/>
									) : (
										<Server className="w-8 h-8 md:w-10 md:h-10 text-blue-400" />
									)}
								</div>
							</div>
						</div>

						<div className="flex-1">
							<h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
								{value.guild.name}
							</h1>
							<p className="text-gray-400 mt-1 flex items-center gap-2">
								<Calendar className="w-4 h-4" />
								<span>Oluşturulma: {serverStats.createdAt}</span>
								<span className="mx-2">•</span>
								<Hash className="w-4 h-4" />
								<span>ID: {value.guild.id}</span>
							</p>
						</div>
					</div>
				</motion.div>

				{/* Stats Overview */}
				<AnimatePresence>
					{showStats && (
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							exit={{ opacity: 0, height: 0 }}
							transition={{ duration: 0.3 }}
							className="overflow-hidden"
						>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
								{/* Total Members Card */}
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.3, delay: 0.1 }}
									className="bg-gradient-to-br from-blue-600/10 to-blue-800/10 backdrop-blur-sm border border-blue-500/20 rounded-xl p-5 shadow-lg hover:shadow-blue-900/5 transition-all hover:-translate-y-1"
								>
									<div className="flex items-start justify-between">
										<div>
											<p className="text-gray-400 text-sm font-medium mb-1">Toplam Üye</p>
											<h3 className="text-3xl font-bold text-white">{value.guild.memberCount || 0}</h3>
											<p className="text-gray-400 text-xs mt-1">
												<span className="text-green-400">{serverStats.onlineUsers}</span> çevrimiçi
											</p>
										</div>
										<div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
											<Users className="w-5 h-5 text-blue-400" />
										</div>
									</div>
								</motion.div>

								{/* Channels Card */}
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.3, delay: 0.2 }}
									className="bg-gradient-to-br from-indigo-600/10 to-indigo-800/10 backdrop-blur-sm border border-indigo-500/20 rounded-xl p-5 shadow-lg hover:shadow-indigo-900/5 transition-all hover:-translate-y-1"
								>
									<div className="flex items-start justify-between">
										<div>
											<p className="text-gray-400 text-sm font-medium mb-1">Kanallar</p>
											<h3 className="text-3xl font-bold text-white">{serverStats.totalChannels}</h3>
											<p className="text-gray-400 text-xs mt-1">
												{serverStats.textChannels}/{serverStats.voiceChannels} (Metin/Ses)
											</p>
										</div>
										<div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
											<MessageCircle className="w-5 h-5 text-indigo-400" />
										</div>
									</div>
								</motion.div>

								{/* Roles Card */}
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.3, delay: 0.3 }}
									className="bg-gradient-to-br from-purple-600/10 to-purple-800/10 backdrop-blur-sm border border-purple-500/20 rounded-xl p-5 shadow-lg hover:shadow-purple-900/5 transition-all hover:-translate-y-1"
								>
									<div className="flex items-start justify-between">
										<div>
											<p className="text-gray-400 text-sm font-medium mb-1">Roller</p>
											<h3 className="text-3xl font-bold text-white">{serverStats.roles}</h3>
											<p className="text-gray-400 text-xs mt-1">Sunucu Rolleri</p>
										</div>
										<div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
											<Shield className="w-5 h-5 text-purple-400" />
										</div>
									</div>
								</motion.div>

								{/* Boosts Card */}
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.3, delay: 0.4 }}
									className="bg-gradient-to-br from-pink-600/10 to-pink-800/10 backdrop-blur-sm border border-pink-500/20 rounded-xl p-5 shadow-lg hover:shadow-pink-900/5 transition-all hover:-translate-y-1"
								>
									<div className="flex items-start justify-between">
										<div>
											<p className="text-gray-400 text-sm font-medium mb-1">Boost</p>
											<h3 className="text-3xl font-bold text-white">{serverStats.boosts}</h3>
											<p className="text-gray-400 text-xs mt-1">
												{serverStats.boosts > 0 ? "Sunucu Boost Sayısı" : "Henüz boost yok"}
											</p>
										</div>
										<div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center">
											<Activity className="w-5 h-5 text-pink-400" />
										</div>
									</div>
								</motion.div>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
}

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useAsync } from "react-use";
import Link from "next/link";
import { Server, Plus, Shield, Crown, Sparkles, Loader2, ServerCrash } from "lucide-react";

import NotFound from "@/components/NotFound";
import Navbar from "@/components/NavBar";
import Footer from "@/app/components/footer";
import { getGuilds, getServers } from "@/functions/http";
import settings from "@/settings";
import { useGuilds } from "@/stores/guilds";

export default function ServersPage() {
	const { data, status } = useSession();
	const pathname = usePathname();
	const store = useGuilds();
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
	const [activeServer, setActiveServer] = useState(null);
	const [isVisible, setIsVisible] = useState({
		header: true,
		"server-grid": true,
	});
	useEffect(() => {
		setIsVisible({
			header: true,
			"server-grid": true,
		});
	}, []);
	const { loading, value, error } = useAsync(async () => {
		if (!data?.user?.access_token || !data?.user?.jwt) return null;

		try {
			const state = {
				servers: await getServers(data?.user.jwt),
				guilds: [],
			};

			if (!(store?.array && store?.array.length)) {
				state.guilds = await getGuilds(data?.user.access_token);
				store.setArray(state.guilds);
			}
			else {
				state.guilds = store.array;
			}

			return state;
		}
		catch (errors) {
			console.error("Error loading servers:", errors);
			return null;
		}
	}, [status, pathname]);
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	};
	const itemVariants = {
		hidden: { y: 20, opacity: 0 },
		visible: {
			y: 0,
			opacity: 1,
			transition: { type: "spring", stiffness: 100 },
		},
	};
	if (status === "loading" || loading) {
		return (
			<>
				<Navbar />
				<div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
					<motion.div
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.5 }}
						className="text-center"
					>
						<Loader2 className="h-16 w-16 text-blue-500 animate-spin mx-auto mb-4" />
						<p className="text-xl text-gray-300">Sunucular yükleniyor...</p>
					</motion.div>
				</div>
			</>
		);
	}
	if (status === "unauthenticated") {
		return <NotFound />;
	}
	const filteredGuilds = value?.guilds.filter((guild) => guild.permissions & 32) || [];
	return (
		<>
			<Navbar />
			<div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white overflow-hidden relative">
				<div className="absolute inset-0 overflow-hidden pointer-events-none">
					{[...Array(20)].map((_, i) => (
						<motion.div
							key={i}
							className="absolute rounded-full bg-opacity-20"
							style={{
								background: "radial-gradient(circle, #605ceb33 0%, transparent 70%)",
								width: `${Math.random() * 40 + 10}px`,
								height: `${Math.random() * 40 + 10}px`,
								top: `${Math.random() * 100}%`,
								left: `${Math.random() * 100}%`,
							}}
							animate={{
								y: [0, Math.random() * 100 - 50],
								x: [0, Math.random() * 100 - 50],
								opacity: [0.1, 0.5, 0.1],
							}}
							transition={{
								duration: Math.random() * 10 + 10,
								repeat: Number.POSITIVE_INFINITY,
								repeatType: "reverse",
							}}
						/>
					))}
				</div>
				<div className="container mx-auto px-4 py-12 relative z-10 mt-16">
					<motion.div
						id="header"
						initial={{ opacity: 0, y: -20 }}
						animate={isVisible.header ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
						transition={{ duration: 0.5 }}
						className="text-center mb-16"
					>
						<motion.div
							initial={{ scale: 0.8, opacity: 0 }}
							animate={isVisible.header ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
							transition={{ delay: 0.2, type: "spring" }}
							className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1 mb-4 border border-white/10"
						>
							<Server className="h-4 w-4 text-purple-400" />
							<span className="text-sm font-medium">Discord Sunucuları</span>
						</motion.div>
						<motion.h1
							initial={{ opacity: 0, y: 20 }}
							animate={isVisible.header ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
							transition={{ delay: 0.3, duration: 0.5 }}
							className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400"
						>
              Sunucularım{" "}
							<span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-500 relative">
								<motion.div
									className="absolute -top-6 -right-6 text-2xl"
									animate={{
										rotate: [0, 10, -10, 10, 0],
										scale: [1, 1.2, 1, 1.2, 1],
									}}
									transition={{
										duration: 2,
										repeat: Number.POSITIVE_INFINITY,
										repeatDelay: 3,
									}}
								>
									<Sparkles className="h-6 w-6 text-yellow-400 fill-yellow-400" />
								</motion.div>
							</span>
						</motion.h1>
						<motion.p
							initial={{ opacity: 0, y: 20 }}
							animate={isVisible.header ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
							transition={{ delay: 0.4, duration: 0.5 }}
							className="text-xl text-gray-300 max-w-3xl mx-auto"
						>
              Botun ekli olduğu veya eklenebileceği sunucuları burada görebilirsiniz.
							<br />
              Yönetici yetkiniz olmayan sunucular listelenmez.
						</motion.p>
					</motion.div>
					<motion.div
						id="server-grid"
						variants={containerVariants}
						initial="hidden"
						animate={isVisible["server-grid"] ? "visible" : "hidden"}
						className="max-w-6xl mx-auto"
					>
						{filteredGuilds.length > 0 ? (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								<AnimatePresence>
									{filteredGuilds.map((guild) => {
										const isAdded = value?.servers.some((server) => server.id === guild.id);
										const hasIcon = !!guild.icon;
										return (
											<motion.div
												key={guild.id}
												variants={itemVariants}
												whileHover={{ y: -10, transition: { duration: 0.2 } }}
												onMouseEnter={() => setActiveServer(guild.id)}
												onMouseLeave={() => setActiveServer(null)}
												className="group relative rounded-xl overflow-hidden transition-all"
											>
												<div
													className={`absolute inset-0 bg-gradient-to-br from-gray-800/80 via-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-xl group-hover:shadow-lg group-hover:shadow-gray-900/30 transition-all duration-300 ${hasIcon ? "" : "border border-gray-700/50 group-hover:border-gray-600/50"}`}
												></div>
												<div className="absolute inset-0 overflow-hidden">
													{[...Array(5)].map((_, i) => (
														<motion.div
															key={i}
															className="absolute rounded-full bg-opacity-20"
															style={{
																background: "radial-gradient(circle, #3b3f5133 0%, transparent 70%)",
																width: `${Math.random() * 40 + 20}px`,
																height: `${Math.random() * 40 + 20}px`,
																top: `${Math.random() * 100}%`,
																left: `${Math.random() * 100}%`,
															}}
															animate={{
																y: [0, Math.random() * 20 - 10],
																x: [0, Math.random() * 20 - 10],
																opacity: [0.2, 0.4, 0.2],
															}}
															transition={{
																duration: Math.random() * 5 + 5,
																repeat: Number.POSITIVE_INFINITY,
																repeatType: "reverse",
															}}
														/>
													))}
												</div>
												<div className="relative p-6">
													<motion.div
														animate={{
															scale: activeServer === guild.id ? [1, 1.1, 1] : 1,
														}}
														transition={{
															duration: 1,
															repeat: activeServer === guild.id ? Number.POSITIVE_INFINITY : 0,
														}}
														className={`absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-medium ${
															isAdded
																? "bg-gray-700/70 text-gray-300 border border-gray-600/50"
																: "bg-green-700/70 text-green-300 border border-green-600/50"
														}`}
													>
														{isAdded ? "Ekli" : "Ekle"}
													</motion.div>

													<div className="flex flex-col items-center text-center mb-8">
														<div className="relative mb-4">
															<div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-800 rounded-full blur-lg opacity-40 group-hover:opacity-60 transition-opacity"></div>
															{guild.icon ? (
																<picture>
																	<img
																		src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}`}
																		alt={guild.name}
																		className="relative w-24 h-24 rounded-full object-cover transition-all z-10"
																	/>
																</picture>
															) : (
																<div className="relative w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center border-2 border-gray-600/50 group-hover:border-gray-500 transition-all z-10">
																	<span className="text-3xl font-bold">{guild.name.charAt(0)}</span>
																</div>
															)}
															<motion.div
																className="absolute top-0 left-0 w-full h-full rounded-full z-20 opacity-0 group-hover:opacity-100 transition-opacity"
																style={{
																	background: "linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)",
																}}
																animate={{
																	left: ["-100%", "200%"],
																}}
																transition={{
																	repeat: Number.POSITIVE_INFINITY,
																	duration: 2,
																	repeatDelay: 3,
																}}
															/>
														</div>

														<h3 className="text-xl font-bold mb-1 group-hover:text-white transition-colors">
															{guild.name}
														</h3>
														<div className="flex items-center justify-center gap-1 text-gray-400 text-sm">
															{guild.owner ? (
																<>
																	<Crown className="h-3 w-3 text-yellow-400" />
																	<span>Yönetici</span>
																</>
															) : (
																<>
																	<Shield className="h-3 w-3 text-blue-400" />
																	<span>Moderatör</span>
																</>
															)}
														</div>
													</div>
													<motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="relative">
														<div className="absolute inset-0 rounded-lg bg-gradient-to-r from-gray-700 to-gray-800 blur-md opacity-40 group-hover:opacity-60 transition-opacity"></div>

														{isAdded ? (
															<Link
																href={`/servers/${guild.id}`}
																className="relative flex items-center justify-center gap-2 w-full py-3 px-4 bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg font-medium hover:from-gray-600 hover:to-gray-700 transition-all shadow-lg shadow-gray-900/30 border border-gray-700/50 z-10"
															>
																<Shield className="h-4 w-4" />
                                Yönet
															</Link>
														) : (
															<Link
																href={`https://discord.com/oauth2/authorize?client_id=${settings.bot.id}&permissions=8&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fcallback%2Fdiscord&integration_type=0&guild_id=${guild.id}`}
																className="relative flex items-center justify-center gap-2 w-full py-3 px-4 bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg font-medium hover:from-gray-600 hover:to-gray-700 transition-all shadow-lg shadow-gray-900/30 border border-gray-700/50 z-10"
															>
																<Plus className="h-4 w-4" />
                                Ekle
															</Link>
														)}
													</motion.div>
												</div>
											</motion.div>
										);
									})}
								</AnimatePresence>
							</div>
						) : error ? (
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5 }}
								className="text-center p-12 bg-red-500/10 backdrop-blur-sm rounded-xl border border-red-500/30 max-w-2xl mx-auto"
							>
								<ServerCrash className="h-16 w-16 text-red-400 mx-auto mb-4" />
								<h3 className="text-xl font-bold mb-2">Sunucular yüklenemedi</h3>
								<p className="text-gray-400 mb-6">
                  Sunucularınızı yüklerken bir hata oluştu. Lütfen daha sonra tekrar deneyin veya Discord bağlantınızı
                  kontrol edin.
								</p>
								<motion.button
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									onClick={() => window.location.reload()}
									className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
								>
                  Yeniden Dene
								</motion.button>
							</motion.div>
						) : (
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5 }}
								className="text-center p-12 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 max-w-2xl mx-auto"
							>
								<Server className="h-16 w-16 text-gray-400 mx-auto mb-4" />
								<h3 className="text-xl font-bold mb-2">Hiç sunucu bulunamadı</h3>
								<p className="text-gray-400 mb-6">
                  Yönetici yetkisine sahip olduğunuz hiçbir Discord sunucusu bulunamadı. Sunucunuzda yönetici yetkisine
                  sahip olduğunuzdan emin olun.
								</p>
								<motion.a
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									href="https://discord.com/app"
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-600/20 border border-indigo-500/20"
								>
                  Discord&apos;a Git
								</motion.a>
							</motion.div>
						)}
					</motion.div>
				</div>
				<div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
					<div
						className="absolute top-0 left-0 w-full h-64 opacity-20"
						style={{
							background: "linear-gradient(to right, #1f2937, #111827, #1f2937)",
							filter: "blur(100px)",
						}}
					/>
					<div
						className="absolute bottom-0 right-0 w-full h-64 opacity-20"
						style={{
							background: "linear-gradient(to left, #1f2937, #111827, #1f2937)",
							filter: "blur(100px)",
						}}
					/>
				</div>
				<motion.button
					className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-gray-700 text-white flex items-center justify-center shadow-lg z-50 border border-gray-600/50"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.9 }}
					onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
					</svg>
				</motion.button>
			</div>
			<Footer />
		</>
	);
}

"use client";

import { useState, useEffect, useRef } from "react";
import { Home, User, ChevronRight, Inbox, Shield, Music, Bell, Menu, X, Star, Zap, Server, LogOut } from "lucide-react";
import { useSession } from "next-auth/react";
import { useGuilds } from "@/stores/guilds";
import { usePathname, useRouter } from "next/navigation";
import { useAsync } from "react-use";
import { getGuilds, getServers } from "@/functions/http";
import Link from "next/link";
import NotFound from "@/components/NotFound";
import Spinner from "@/components/Spinner";
import { motion, AnimatePresence } from "framer-motion";
import { FaRobot } from "react-icons/fa6";

export default function AnimatedServerSidebar({ currentView, setCurrentView }) {
	const { data, status } = useSession();
	const pathname = usePathname();
	const router = useRouter();
	const store = useGuilds();
	const [openCategories, setOpenCategories] = useState({
		sistemler: true,
		genel: true,
	});
	const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [isSearching, setIsSearching] = useState(false);
	const sidebarRef = useRef(null);
	const searchInputRef = useRef(null);

	// Hover effect for menu items
	const [hoveredItem, setHoveredItem] = useState(null);

	const { loading, value } = useAsync(async () => {
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
		catch (error) {
			return null;
		}
	}, [status, pathname]);

	// Close sidebar when clicking outside on mobile
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (sidebarRef.current && !sidebarRef.current.contains(event.target) && isMobileSidebarOpen) {
				setIsMobileSidebarOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [isMobileSidebarOpen]);

	// Focus search input when search is opened
	useEffect(() => {
		if (isSearching && searchInputRef.current) {
			searchInputRef.current.focus();
		}
	}, [isSearching]);

	const serverId = pathname.split("/")[2];
	if (status === "loading" || loading) return <Spinner />;
	if (status === "unauthenticated") return <NotFound />;

	const selectedGuild = value?.guilds?.find((guild) => guild.id === serverId);

	const menuItems = [
		{
			type: "category",
			label: "Genel Ayarlar",
			id: "genel",
			children: [
				{
					label: "Genel Ayarları",
					view: "generalSettings",
					icon: <Home size={20} />,
					description: "Sunucu için temel ayarlar",
				},
			],
		},
		{
			type: "category",
			label: "Sistemler",
			id: "sistemler",
			children: [
				{
					label: "Giriş/Çıkış Sistemi",
					view: "sendMessage",
					icon: <Inbox size={20} />,
					description: "Kullanıcı giriş çıkış mesajları",
				},
				{
					label: "Caps Lock Sistemi",
					view: "capsSettings",
					icon: (
						<svg
							stroke="currentColor"
							fill="currentColor"
							strokeWidth="0"
							viewBox="0 0 16 16"
							className="shrink-0"
							height="20px"
							width="20px"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path d="M7.27 1.047a1 1 0 0 1 1.46 0l6.345 6.77c.6.638.146 1.683-.73 1.683H11.5v1a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-1H1.654C.78 9.5.326 8.455.924 7.816zM4.5 13.5a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1z"></path>
						</svg>
					),
					description: "Büyük harf kullanımı kontrolü",
				},
				{
					label: "Kick Sistemi",
					view: "kickSetting",
					icon: <User size={20} />,
					description: "Otomatik kick ayarları",
				},
				{
					label: "Chat Sistemi",
					view: "chatSystem",
					icon: <Bell size={20} />,
					description: "Chat sistemi ayarları",
				},
			],
		},
	];

	// Filter menu items based on search query
	const filteredMenuItems = searchQuery
		? menuItems
			.map((category) => {
				// Filter children that match the search query
				const matchingChildren = category.children.filter(
					(item) =>
						item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.description?.toLowerCase().includes(searchQuery.toLowerCase()),
				);

				// Only return categories that have matching children
				if (matchingChildren.length > 0) {
					return {
						...category,
						children: matchingChildren,
					};
				}
				return null;
			})
			.filter(Boolean)
		: menuItems;

	const toggleCategory = (id) => {
		setOpenCategories((prev) => ({ ...prev, [id]: !prev[id] }));
	};

	// Particle animation for the server icon
	const serverIconParticles = Array.from({ length: 6 }).map((_, i) => (
		<motion.div
			key={i}
			className="absolute rounded-full bg-blue-500"
			initial={{
				x: 0,
				y: 0,
				opacity: 0,
				width: 4,
				height: 4,
			}}
			animate={{
				x: Math.random() * 30 - 15,
				y: Math.random() * 30 - 15,
				opacity: [0, 0.8, 0],
				width: [4, 2],
				height: [4, 2],
			}}
			transition={{
				duration: 2 + Math.random() * 2,
				repeat: Number.POSITIVE_INFINITY,
				delay: i * 0.3,
				ease: "easeOut",
			}}
			style={{
				boxShadow: "0 0 8px 2px rgba(59, 130, 246, 0.5)",
			}}
		/>
	));

	return (
		<>
			{/* Scrollbar gizleme için global stil */}
			<style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;  /* IE ve Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>

			{/* Mobile Toggle Button */}
			<div className="md:hidden fixed top-4 left-4 z-50">
				<motion.button
					onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
					whileTap={{ scale: 0.9 }}
					className="bg-gray-800 text-white p-2 rounded-lg shadow-lg border border-gray-700"
				>
					<AnimatePresence mode="wait">
						{isMobileSidebarOpen ? (
							<motion.div
								key="close"
								initial={{ rotate: -90, opacity: 0 }}
								animate={{ rotate: 0, opacity: 1 }}
								exit={{ rotate: 90, opacity: 0 }}
								transition={{ duration: 0.2 }}
							>
								<X size={24} />
							</motion.div>
						) : (
							<motion.div
								key="menu"
								initial={{ rotate: 90, opacity: 0 }}
								animate={{ rotate: 0, opacity: 1 }}
								exit={{ rotate: -90, opacity: 0 }}
								transition={{ duration: 0.2 }}
							>
								<Menu size={24} />
							</motion.div>
						)}
					</AnimatePresence>
				</motion.button>
			</div>

			{/* Sidebar */}
			<AnimatePresence>
				{(isMobileSidebarOpen || true) && (
					<motion.aside
						ref={sidebarRef}
						initial={{
							x: -320,
							opacity: 0,
						}}
						animate={{
							x: 0,
							opacity: 1,
						}}
						exit={{
							x: -320,
							opacity: 0,
						}}
						transition={{
							type: "spring",
							stiffness: 300,
							damping: 30,
						}}
						className={`fixed md:relative top-0 left-0 h-screen overflow-hidden z-40 md:z-0 ${
							isMobileSidebarOpen ? "block" : "hidden md:block"
						}`}
					>
						<div className="flex flex-col w-80 h-full bg-gradient-to-b from-[#191a1d] to-[#13131b] overflow-hidden shadow-xl border-r border-white/5">
							{/* Glassmorphism overlay */}
							<div className="absolute inset-0 bg-blue-500/5 backdrop-blur-[2px] pointer-events-none" />

							{/* Background particles */}
							<div className="absolute inset-0 overflow-hidden pointer-events-none">
								{[...Array(8)].map((_, i) => (
									<motion.div
										key={i}
										className="absolute rounded-full opacity-10"
										style={{
											background: `radial-gradient(circle, ${
												["#3b82f6", "#8b5cf6", "#ec4899"][i % 3]
											} 0%, transparent 70%)`,
											width: `${Math.random() * 100 + 50}px`,
											height: `${Math.random() * 100 + 50}px`,
											top: `${Math.random() * 100}%`,
											left: `${Math.random() * 100}%`,
										}}
										animate={{
											y: [0, Math.random() * 30 - 15],
											x: [0, Math.random() * 30 - 15],
											opacity: [0.05, 0.1, 0.05],
										}}
										transition={{
											duration: Math.random() * 10 + 10,
											repeat: Number.POSITIVE_INFINITY,
											repeatType: "reverse",
										}}
									/>
								))}
							</div>

							<div className="relative flex flex-col h-full p-6 overflow-hidden">
								{/* Server Info */}
								{selectedGuild && (
									<motion.div
										initial={{ opacity: 0, y: -20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.5 }}
										className="flex flex-col items-center mb-6"
									>
										<div className="relative">
											{serverIconParticles}
											<motion.div
												whileHover={{ scale: 1.05 }}
												transition={{ type: "spring", stiffness: 400, damping: 10 }}
											>
												<img
													src={
														selectedGuild.icon
															? `https://cdn.discordapp.com/icons/${selectedGuild.id}/${selectedGuild.icon}.png`
															: `https://ui-avatars.com/api/?background=494d54&uppercase=false&color=dbdcdd&size=128&fontSize=0.33&name=${selectedGuild.name}`
													}
													alt={`${selectedGuild.name} Logo`}
													className="w-20 h-20 rounded-full mb-3 ring-2 ring-blue-500/30 shadow-lg shadow-blue-500/20"
												/>
											</motion.div>
											<motion.div
												className="absolute -inset-1 rounded-full opacity-75 pointer-events-none"
												animate={{
													boxShadow: [
														"0 0 0 0px rgba(59, 130, 246, 0)",
														"0 0 0 3px rgba(59, 130, 246, 0.3)",
														"0 0 0 0px rgba(59, 130, 246, 0)",
													],
												}}
												transition={{
													repeat: Number.POSITIVE_INFINITY,
													duration: 3,
												}}
											/>
										</div>
										<motion.h2
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											transition={{ delay: 0.2, duration: 0.5 }}
											className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-500 transition-all duration-200"
										>
											{selectedGuild.name}
										</motion.h2>
										<motion.div
											initial={{ width: 0 }}
											animate={{ width: "60%" }}
											transition={{ delay: 0.4, duration: 0.8 }}
											className="h-0.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 mt-2 rounded-full"
										/>
									</motion.div>
								)}

								{/* Navigation Menu */}
								<div className="flex-1 overflow-y-auto scrollbar-hide pr-2">
									<nav className="flex flex-col gap-2">
										<AnimatePresence initial={false}>
											{filteredMenuItems.map((item, index) => {
												if (item.type === "category") {
													const isOpen = openCategories[item.id];
													return (
														<motion.div
															key={item.id}
															initial={{ opacity: 0, y: 20 }}
															animate={{ opacity: 1, y: 0 }}
															transition={{ delay: index * 0.1, duration: 0.5 }}
															className="flex flex-col"
														>
															<motion.button
																onClick={() => toggleCategory(item.id)}
																className="flex items-center justify-between text-white hover:text-white px-4 py-2 mt-2 rounded-lg hover:bg-white/5 transition-colors"
																whileHover={{ x: 5 }}
																whileTap={{ scale: 0.98 }}
															>
																<span className="text-sm font-semibold uppercase tracking-wider">{item.label}</span>
																<motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
																	<ChevronRight size={18} />
																</motion.div>
															</motion.button>

															<AnimatePresence initial={false}>
																{isOpen && (
																	<motion.div
																		initial={{ opacity: 0, height: 0 }}
																		animate={{ opacity: 1, height: "auto" }}
																		exit={{ opacity: 0, height: 0 }}
																		transition={{ duration: 0.3 }}
																		className="overflow-hidden flex flex-col"
																	>
																		<div className="flex flex-col gap-1 mt-1 pl-2">
																			{item.children.map((child, childIndex) => (
																				<motion.div
																					key={child.view}
																					initial={{ opacity: 0, x: -20 }}
																					animate={{ opacity: 1, x: 0 }}
																					transition={{ delay: childIndex * 0.05, duration: 0.3 }}
																					onHoverStart={() => setHoveredItem(child.view)}
																					onHoverEnd={() => setHoveredItem(null)}
																				>
																					<button
																						onClick={() => {
																							setCurrentView(child.view);
																							setIsMobileSidebarOpen(false);
																						}}
																						className={`relative flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-left ${
																							currentView === child.view
																								? "bg-gradient-to-r from-blue-600/20 to-indigo-600/20 text-white"
																								: "text-gray-400 hover:text-white hover:bg-white/5"
																						} transition-all duration-200`}
																					>
																						{/* Glow effect for active item */}
																						{currentView === child.view && (
																							<motion.div
																								className="absolute inset-0 rounded-lg opacity-30 pointer-events-none"
																								style={{
																									background:
                                                    "radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.3), transparent 70%)",
																									zIndex: -1,
																								}}
																								layoutId="activeGlow"
																								transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
																							/>
																						)}

																						<motion.div
																							className={`${
																								currentView === child.view
																									? "text-blue-400"
																									: "text-gray-500 group-hover:text-gray-300"
																							}`}
																							animate={{
																								scale:
                                                  hoveredItem === child.view || currentView === child.view ? 1.2 : 1,
																								rotate: hoveredItem === child.view ? 5 : 0,
																							}}
																							transition={{ type: "spring", stiffness: 400, damping: 10 }}
																						>
																							{child.icon}
																						</motion.div>
																						<div className="flex flex-col">
																							<span className="font-medium">{child.label}</span>
																							{child.description && (
																								<span className="text-xs text-gray-500">{child.description}</span>
																							)}
																						</div>

																						{/* Indicator for active item */}
																						{currentView === child.view && (
																							<motion.div
																								layoutId="activeIndicator"
																								className="absolute left-0 top-1/2 w-1 h-8 bg-blue-500 rounded-r-full -translate-y-1/2"
																								transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
																							/>
																						)}
																					</button>
																				</motion.div>
																			))}
																		</div>
																	</motion.div>
																)}
															</AnimatePresence>
														</motion.div>
													);
												}
												return null;
											})}
										</AnimatePresence>
									</nav>
								</div>

								{/* Bottom Section */}
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.6, duration: 0.5 }}
									className="mt-6 pt-6 border-t border-white/10"
								>
									<Link href="/servers">
										<motion.button
											whileHover={{ scale: 1.03 }}
											whileTap={{ scale: 0.97 }}
											className="w-full px-4 py-3 bg-gradient-to-r from-red-600/10 to-red-600/20 text-red-500 border border-red-600/30 rounded-xl hover:bg-red-600/30 transition-all duration-200 flex items-center justify-center gap-2"
										>
											<LogOut size={18} />
											<span>Sunucu Listesine Dön</span>
										</motion.button>
									</Link>

									<div className="mt-4 text-center">
										<div className="flex items-center justify-center gap-2 text-xs text-gray-500">
											<FaRobot className="text-blue-400" />
											<span>Lavinnia Bot Dashboard</span>
										</div>
									</div>
								</motion.div>
							</div>
						</div>
					</motion.aside>
				)}
			</AnimatePresence>
		</>
	);
}

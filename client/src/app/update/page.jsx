"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ChevronDown, ChevronUp, Star, Shield, Wrench, Zap, Music, MessageSquare } from "lucide-react";
import { FaDiscord } from "react-icons/fa6";
import botUpdates from "./ContentUpdate";
import Navbar from "@/components/NavBar.jsx";
import Footer from "../components/footer";

// Güncelleme türleri için renkler ve ikonlar
const updateTypes = {
	feature: { color: "bg-red-500", icon: <Star className="w-4 h-4" />, label: "Yeni Özellik" },
	improvement: { color: "bg-blue-500", icon: <Zap className="w-4 h-4" />, label: "İyileştirme" },
	fix: { color: "bg-amber-500", icon: <Wrench className="w-4 h-4" />, label: "Hata Düzeltmesi" },
	commands: { color: "bg-indigo-500", icon: <MessageSquare className="w-4 h-4" />, label: "Komutlar" },
};

export default function UpdatesSection() {
	const [selectedFilter, setSelectedFilter] = useState("all");
	const [expandedUpdates, setExpandedUpdates] = useState({});
	const containerRef = useRef(null);
	const [isInView, setIsInView] = useState(false);

	// Görünürlük kontrolü için
	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				setIsInView(entry.isIntersecting);
			},
			{ threshold: 0.1 }
		);

		if (containerRef.current) {
			observer.observe(containerRef.current);
		}

		return () => {
			if (containerRef.current) {
				observer.unobserve(containerRef.current);
			}
		};
	}, []);

	// Filtreleme fonksiyonu
	const filteredUpdates = selectedFilter === "all"
		? botUpdates
		: botUpdates.filter(update => update.types.includes(selectedFilter));

	// Güncelleme detaylarını genişlet/daralt
	const toggleUpdate = (version) => {
		setExpandedUpdates(prev => ({
			...prev,
			[version]: !prev[version],
		}));
	};

	return (
		<>
			<Navbar />
			<section ref={containerRef} className="py-20 relative overflow-hidden bg-gray-900">
				<div className="absolute inset-0 overflow-hidden pointer-events-none">
					{[...Array(15)].map((_, i) => (
						<motion.div
							key={i}
							className="absolute rounded-full opacity-20"
							style={{
								background: `radial-gradient(circle, ${
									["#3b82f6", "#8b5cf6", "#ec4899"][i % 3]
								} 0%, transparent 70%)`,
								width: `${Math.random() * 300 + 100}px`,
								height: `${Math.random() * 300 + 100}px`,
								top: `${Math.random() * 100}%`,
								left: `${Math.random() * 100}%`,
							}}
							animate={{
								y: [0, Math.random() * 50 - 25],
								x: [0, Math.random() * 50 - 25],
								opacity: [0.1, 0.2, 0.1],
							}}
							transition={{
								duration: Math.random() * 10 + 10,
								repeat: Infinity,
								repeatType: "reverse",
							}}
						/>
					))}
					{/* Blur efekti için eklenen katman */}
					<div className="absolute inset-0 bg-gray-900/50 backdrop-blur-md"></div>
				</div>

				<div className="container mx-auto px-4 relative z-10 mt-20">
					{/* Başlık */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
						transition={{ duration: 0.5 }}
						className="text-center mb-16"
					>
						<div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1 mb-4">
							<FaDiscord className="h-4 w-4 text-blue-400" />
							<span className="text-sm font-medium">Bot Güncellemeleri</span>
						</div>
						<h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Son Güncellemeler</h2>
						<p className="text-gray-400 max-w-2xl mx-auto">
            Lavinnia Bot&apos;un en son güncellemeleri ve yeni özellikleri hakkında bilgi edinin.
						</p>
					</motion.div>

					{/* Filtreler */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
						transition={{ duration: 0.5, delay: 0.2 }}
						className="flex flex-wrap justify-center gap-2 mb-12"
					>
						<FilterButton
							active={selectedFilter === "all"}
							onClick={() => setSelectedFilter("all")}
						>
            Tümü
						</FilterButton>

						{Object.entries(updateTypes).map(([key, { icon, label }]) => (
							<FilterButton
								key={key}
								active={selectedFilter === key}
								onClick={() => setSelectedFilter(key)}
								icon={icon}
							>
								{label}
							</FilterButton>
						))}
					</motion.div>

					{/* Güncellemeler Zaman Çizelgesi */}
					<div className="relative">
						{/* Zaman çizelgesi çizgisi */}
						<motion.div
							initial={{ height: 0 }}
							animate={isInView ? { height: "100%" } : { height: 0 }}
							transition={{ duration: 1.5, ease: "easeInOut" }}
							className="absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-500 transform -translate-x-1/2 z-0"
						/>

						<div className="space-y-12">
							<AnimatePresence>
								{filteredUpdates.length === 0 ? (
									<motion.div
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -20 }}
										className="text-center py-12 text-gray-400"
									>
                  Bu filtre için güncelleme bulunamadı.
									</motion.div>
								) : (
									filteredUpdates.map((update, index) => (
										<motion.div
											key={update.version}
											initial={{ opacity: 0, y: 50 }}
											animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
											transition={{ duration: 0.5, delay: 0.1 * index }}
											className="relative"
										>
											{/* Zaman noktası */}
											<motion.div
												initial={{ scale: 0 }}
												animate={isInView ? { scale: 1 } : { scale: 0 }}
												transition={{ duration: 0.5, delay: 0.3 + 0.1 * index }}
												className="absolute left-0 md:left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-gray-800 border-2 border-blue-500 z-10 flex items-center justify-center"
											>
												<div className="w-2 h-2 rounded-full bg-blue-500" />
											</motion.div>

											{/* Güncelleme kartı */}
											<div className={`relative md:w-1/2 ${index % 2 === 0 ? "md:ml-auto md:pl-12" : "md:mr-auto md:pr-12"} pl-10 md:pl-0`}>
												<motion.div
													whileHover={{ y: -5 }}
													transition={{ type: "spring", stiffness: 300, damping: 20 }}
													className="bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 rounded-xl overflow-hidden shadow-xl"
												>
													{/* Kart başlığı */}
													<div className="border-b border-white/10 p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
														<div>
															<div className="flex items-center gap-2 mb-1">
																<span className="text-xs text-gray-400 flex items-center gap-1">
																	<Calendar className="w-3 h-3" /> {update.date}
																</span>
																<span className="text-sm font-mono text-blue-400">{update.version}</span>
															</div>
															<h3 className="text-xl font-bold text-white">{update.title}</h3>
														</div>
														<div className="flex flex-wrap gap-2">
															{update.types.map(type => (
																<span
																	key={type}
																	className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${updateTypes[type].color}/20 text-white`}
																>
																	{updateTypes[type].icon}
																	{updateTypes[type].label}
																</span>
															))}
														</div>
													</div>

													{/* Kart içeriği */}
													<div className="p-5">
														<p className="text-gray-300 mb-4">{update.description}</p>

														{/* Güncelleme görseli (varsa) */}
														{update.image && (
															<motion.div
																initial={{ opacity: 0, scale: 0.9 }}
																animate={{ opacity: 1, scale: 1 }}
																transition={{ duration: 0.5 }}
																className="mb-4 rounded-lg overflow-hidden"
															>
																<picture>
																	<img
																		src={update.image || "/placeholder.svg"}
																		alt={update.title}
																		className="w-10 h-10 object-cover rounded-lg hover:scale-105 transition-transform duration-500"
																	/>
																</picture>
															</motion.div>
														)}

														{/* Detaylar butonu */}
														{update.details && update.details.length > 0 && (
															<div>
																<button
																	onClick={() => toggleUpdate(update.version)}
																	className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors mt-2"
																>
																	<span>{expandedUpdates[update.version] ? "Detayları Gizle" : "Detayları Göster"}</span>
																	{expandedUpdates[update.version] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
																</button>

																<AnimatePresence>
																	{expandedUpdates[update.version] && (
																		<motion.div
																			initial={{ opacity: 0, height: 0 }}
																			animate={{ opacity: 1, height: "auto" }}
																			exit={{ opacity: 0, height: 0 }}
																			transition={{ duration: 0.3 }}
																			className="mt-4 space-y-2"
																		>
																			{update.details.map((detail, i) => (
																				<motion.div
																					key={i}
																					initial={{ opacity: 0, x: -10 }}
																					animate={{ opacity: 1, x: 0 }}
																					transition={{ duration: 0.3, delay: i * 0.1 }}
																					className="flex items-start gap-2"
																				>
																					<div className={`mt-1 w-4 h-4 rounded-full ${updateTypes[detail.type].color} flex items-center justify-center flex-shrink-0`}>
																						{updateTypes[detail.type].icon}
																					</div>
																					<span className="text-gray-300">{detail.text}</span>
																				</motion.div>
																			))}
																		</motion.div>
																	)}
																</AnimatePresence>
															</div>
														)}
													</div>
												</motion.div>
											</div>
										</motion.div>
									))
								)}
							</AnimatePresence>
						</div>
					</div>

					{/* Tüm güncellemeleri görüntüle butonu */}
					{botUpdates.length > 4 && (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
							transition={{ duration: 0.5, delay: 0.5 }}
							className="text-center mt-16"
						>
							<a
								href="/updates"
								className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl font-medium hover:opacity-90 transition-opacity shadow-lg shadow-blue-600/20 text-white"
							>
              Tüm Güncellemeleri Görüntüle
								<ChevronDown className="h-5 w-5" />
							</a>
						</motion.div>
					)}
				</div>
			</section>
			<Footer />
		</>
	);
}

// Filtre butonu bileşeni
function FilterButton({ children, active, onClick, icon }) {
	return (
		<motion.button
			whileHover={{ y: -2 }}
			whileTap={{ scale: 0.95 }}
			onClick={onClick}
			className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
				active
					? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20"
					: "bg-white/10 text-gray-300 hover:bg-white/15"
			}`}
		>
			{icon && icon}
			{children}
		</motion.button>
	);
}
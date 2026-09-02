"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	Search,
	Filter,
	Command,
	Shield,
	Music,
	Smile,
	Settings,
	Zap,
	Star,
	ChevronDown,
	Info,
	Lock,
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "../components/footer";
export default function CommandsPage() {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [expandedCommand, setExpandedCommand] = useState(null);
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
	const commandsContainerRef = useRef(null);
	const [scrollY, setScrollY] = useState(0);

	// Scroll pozisyonunu takip et
	useEffect(() => {
		const handleScroll = () => {
			setScrollY(window.scrollY);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// Komut kategorileri
	const categories = [
		{ id: "all", name: "Tüm Komutlar", icon: <Command className="h-5 w-5" />, color: "#6366f1" },
		{ id: "moderation", name: "Moderasyon", icon: <Shield className="h-5 w-5" />, color: "#8b5cf6" },
		{ id: "music", name: "Müzik", icon: <Music className="h-5 w-5" />, color: "#ec4899" },
		{ id: "fun", name: "Eğlence", icon: <Smile className="h-5 w-5" />, color: "#f59e0b" },
		{ id: "utility", name: "Yardımcı", icon: <Settings className="h-5 w-5" />, color: "#10b981" },
	];

	// Komutlar
	const commands = [
		{
			id: "ban",
			name: "ban",
			description: "Bir kullanıcıyı sunucudan yasaklar",
			usage: "/ban @kullanıcı [sebep]",
			example: "/ban @ToxicUser Kurallara uymamak",
			category: "moderation",
			isPremium: false,
			isNew: false,
		},
		{
			id: "kick",
			name: "kick",
			description: "Bir kullanıcıyı sunucudan atar",
			usage: "/kick @kullanıcı [sebep]",
			example: "/kick @User Spam yapmak",
			category: "moderation",
			isPremium: false,
			isNew: false,
		},
		{
			id: "mute",
			name: "mute",
			description: "Bir kullanıcıyı belirli bir süre susturur",
			usage: "/mute @kullanıcı [süre] [sebep]",
			example: "/mute @User 10m Spam yapmak",
			category: "moderation",
			isPremium: false,
			isNew: false,
		},
		{
			id: "clear",
			name: "clear",
			description: "Belirtilen sayıda mesajı siler",
			usage: "/clear [miktar]",
			example: "/clear 50",
			category: "moderation",
			isPremium: false,
			isNew: false,
		},
		{
			id: "warn",
			name: "warn",
			description: "Bir kullanıcıyı uyarır ve uyarı kaydı tutar",
			usage: "/warn @kullanıcı [sebep]",
			example: "/warn @User Kural ihlali",
			category: "moderation",
			isPremium: false,
			isNew: true,
		},
		{
			id: "play",
			name: "play",
			description: "Belirtilen şarkıyı çalar",
			usage: "/play [şarkı adı veya URL]",
			example: "/play Daft Punk Get Lucky",
			category: "music",
			isPremium: false,
			isNew: false,
		},
		{
			id: "skip",
			name: "skip",
			description: "Çalan şarkıyı atlar",
			usage: "/skip",
			example: "/skip",
			category: "music",
			isPremium: false,
			isNew: false,
		},
		{
			id: "queue",
			name: "queue",
			description: "Çalma sırasını gösterir",
			usage: "/queue",
			example: "/queue",
			category: "music",
			isPremium: false,
			isNew: false,
		},
		{
			id: "playlist",
			name: "playlist",
			description: "Özel çalma listeleri oluşturur ve yönetir",
			usage: "/playlist [create/play/add] [isim]",
			example: "/playlist create PartyMix",
			category: "music",
			isPremium: true,
			isNew: false,
		},
		{
			id: "lyrics",
			name: "lyrics",
			description: "Çalan şarkının sözlerini gösterir",
			usage: "/lyrics",
			example: "/lyrics",
			category: "music",
			isPremium: true,
			isNew: true,
		},
		{
			id: "meme",
			name: "meme",
			description: "Rastgele bir meme gösterir",
			usage: "/meme [kategori]",
			example: "/meme dank",
			category: "fun",
			isPremium: false,
			isNew: false,
		},
		{
			id: "joke",
			name: "joke",
			description: "Rastgele bir şaka yapar",
			usage: "/joke",
			example: "/joke",
			category: "fun",
			isPremium: false,
			isNew: false,
		},
		{
			id: "8ball",
			name: "8ball",
			description: "Sihirli 8-top cevapları verir",
			usage: "/8ball [soru]",
			example: "/8ball Bugün şanslı olacak mıyım?",
			category: "fun",
			isPremium: false,
			isNew: false,
		},
		{
			id: "gif",
			name: "gif",
			description: "Belirtilen arama terimiyle ilgili bir GIF gönderir",
			usage: "/gif [arama terimi]",
			example: "/gif kedi",
			category: "fun",
			isPremium: false,
			isNew: false,
		},
		{
			id: "trivia",
			name: "trivia",
			description: "Bilgi yarışması başlatır",
			usage: "/trivia [kategori] [zorluk]",
			example: "/trivia bilim zor",
			category: "fun",
			isPremium: true,
			isNew: true,
		},
		{
			id: "avatar",
			name: "avatar",
			description: "Bir kullanıcının avatarını gösterir",
			usage: "/avatar [@kullanıcı]",
			example: "/avatar @User",
			category: "utility",
			isPremium: false,
			isNew: false,
		},
		{
			id: "serverinfo",
			name: "serverinfo",
			description: "Sunucu hakkında bilgi verir",
			usage: "/serverinfo",
			example: "/serverinfo",
			category: "utility",
			isPremium: false,
			isNew: false,
		},
		{
			id: "userinfo",
			name: "userinfo",
			description: "Bir kullanıcı hakkında bilgi verir",
			usage: "/userinfo [@kullanıcı]",
			example: "/userinfo @User",
			category: "utility",
			isPremium: false,
			isNew: false,
		},
		{
			id: "poll",
			name: "poll",
			description: "Anket oluşturur",
			usage: "/poll [soru] [seçenek1] [seçenek2] ...",
			example: "/poll 'En sevdiğiniz renk?' 'Mavi' 'Kırmızı' 'Yeşil'",
			category: "utility",
			isPremium: false,
			isNew: false,
		},
		{
			id: "remind",
			name: "remind",
			description: "Belirtilen süre sonra hatırlatma yapar",
			usage: "/remind [süre] [mesaj]",
			example: "/remind 3h Toplantıyı unutma",
			category: "utility",
			isPremium: true,
			isNew: false,
		},
	];

	// Filtrelenmiş komutlar
	const filteredCommands = commands.filter((command) => {
		const matchesSearch =
      command.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      command.description.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesCategory = selectedCategory === "all" || command.category === selectedCategory;
		return matchesSearch && matchesCategory;
	});

	// Animasyon varyantları
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.05,
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

	// Kategori rengini al
	const getCategoryColor = (categoryId) => {
		const category = categories.find((cat) => cat.id === categoryId);
		return category ? category.color : "#6366f1";
	};

	return (
		<>
			<Navbar />
			<div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white overflow-hidden relative">
				{/* Animasyonlu arka plan parçacıkları */}
				<div className="absolute inset-0 overflow-hidden pointer-events-none">
					{[...Array(20)].map((_, i) => (
						<motion.div
							key={i}
							className="absolute rounded-full bg-opacity-20"
							style={{
								background: `radial-gradient(circle, ${getCategoryColor(selectedCategory)}33 0%, transparent 70%)`,
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

				{/* Fare takibi efekti */}
				<motion.div
					className="hidden md:block absolute w-96 h-96 rounded-full pointer-events-none"
					style={{
						background: `radial-gradient(circle, ${getCategoryColor(selectedCategory)}22 0%, transparent 70%)`,
						left: mousePosition.x - 192,
						top: mousePosition.y - 192,
					}}
					animate={{
						left: mousePosition.x - 192,
						top: mousePosition.y - 192,
					}}
					transition={{ type: "spring", damping: 30, stiffness: 200 }}
				/>

				{/* Ana içerik */}
				<div className="container mx-auto px-4 py-20 relative z-10">
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className="text-center mb-16"
					>
						<motion.div
							initial={{ scale: 0.8, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							transition={{ delay: 0.2, type: "spring" }}
							className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1 mb-4"
						>
							<Command className="h-4 w-4 text-blue-400" />
							<span className="text-sm font-medium">Komut Listesi</span>
						</motion.div>

						<motion.h1
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.3, duration: 0.5 }}
							className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400"
						>
            Tüm{" "}
							<span
								className="bg-clip-text text-transparent"
								style={{
									backgroundImage: `linear-gradient(to right, ${getCategoryColor(selectedCategory)}, ${getCategoryColor(selectedCategory)}cc)`,
								}}
							>
              Komutlar
							</span>
						</motion.h1>

						<motion.p
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.4, duration: 0.5 }}
							className="text-xl text-gray-300 max-w-3xl mx-auto"
						>
            Botumuzun tüm komutlarını keşfedin ve sunucunuzu güçlendirin.
						</motion.p>
					</motion.div>

					{/* Arama ve Filtreleme */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.5, duration: 0.5 }}
						className="max-w-4xl mx-auto mb-12"
					>
						<div className="flex flex-col md:flex-row gap-4">
							{/* Arama */}
							<div className="relative flex-1">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<Search className="h-5 w-5 text-gray-400" />
								</div>
								<input
									type="text"
									className="block w-full pl-10 pr-3 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
									placeholder="Komut ara..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
								/>
							</div>

							{/* Kategori Filtresi */}
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<Filter className="h-5 w-5 text-gray-400" />
								</div>
								<select
									className="block w-full pl-10 pr-10 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white appearance-none"
									value={selectedCategory}
									onChange={(e) => setSelectedCategory(e.target.value)}
								>
									{categories.map((category) => (
										<option key={category.id} value={category.id} className="bg-gray-800">
											{category.name}
										</option>
									))}
								</select>
								<div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
									<ChevronDown className="h-5 w-5 text-gray-400" />
								</div>
							</div>
						</div>
					</motion.div>

					{/* Kategori Butonları */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.6, duration: 0.5 }}
						className="flex flex-wrap justify-center gap-2 mb-12"
					>
						{categories.map((category) => (
							<motion.button
								key={category.id}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={() => setSelectedCategory(category.id)}
								className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
									selectedCategory === category.id
										? "bg-white/20 text-white"
										: "bg-white/10 text-gray-300 hover:bg-white/15 hover:text-white"
								}`}
								style={selectedCategory === category.id ? { boxShadow: `0 0 10px ${category.color}66` } : {}}
							>
								{category.icon}
								{category.name}
							</motion.button>
						))}
					</motion.div>

					{/* Komut Listesi */}
					<motion.div
						variants={containerVariants}
						initial="hidden"
						animate="visible"
						className="max-w-4xl mx-auto"
						ref={commandsContainerRef}
					>
						{filteredCommands.length > 0 ? (
							<div className="grid grid-cols-1 gap-4">
								<AnimatePresence>
									{filteredCommands.map((command) => (
										<motion.div
											key={command.id}
											variants={itemVariants}
											layout
											onClick={() => setExpandedCommand(expandedCommand === command.id ? null : command.id)}
											className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl overflow-hidden cursor-pointer transition-all hover:bg-white/15"
											whileHover={{ y: -5, transition: { duration: 0.2 } }}
										>
											<div className="p-4">
												<div className="flex justify-between items-start">
													<div className="flex items-center gap-3">
														<div
															className="w-10 h-10 rounded-lg flex items-center justify-center"
															style={{ backgroundColor: getCategoryColor(command.category) + "33" }}
														>
															{categories.find((cat) => cat.id === command.category)?.icon}
														</div>
														<div>
															<div className="flex items-center gap-2">
																<h3 className="text-lg font-bold">/{command.name}</h3>
																{command.isPremium && (
																	<div className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-amber-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">
																		<Star className="h-3 w-3" />
																		<span>Premium</span>
																	</div>
																)}
																{command.isNew && (
																	<div className="flex items-center gap-1 bg-gradient-to-r from-green-400 to-emerald-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">
																		<Zap className="h-3 w-3" />
																		<span>Yeni</span>
																	</div>
																)}
															</div>
															<p className="text-sm text-gray-300">{command.description}</p>
														</div>
													</div>
													<div className="text-gray-400">
														<Info className="h-5 w-5" />
													</div>
												</div>

												<AnimatePresence>
													{expandedCommand === command.id && (
														<motion.div
															initial={{ opacity: 0, height: 0 }}
															animate={{ opacity: 1, height: "auto" }}
															exit={{ opacity: 0, height: 0 }}
															transition={{ duration: 0.3 }}
															className="mt-4 pt-4 border-t border-white/10"
														>
															<div className="space-y-3">
																<div>
																	<h4 className="text-sm font-medium text-gray-400">Kullanım</h4>
																	<div className="mt-1 bg-black/30 p-2 rounded-lg font-mono text-sm">{command.usage}</div>
																</div>
																<div>
																	<h4 className="text-sm font-medium text-gray-400">Örnek</h4>
																	<div className="mt-1 bg-black/30 p-2 rounded-lg font-mono text-sm">
																		{command.example}
																	</div>
																</div>
																{command.isPremium && (
																	<div className="flex items-center gap-2 text-sm text-yellow-400">
																		<Lock className="h-4 w-4" />
																		<span>Bu komut sadece premium kullanıcılar için mevcuttur.</span>
																		<Link
																			href="/premium"
																			className="underline hover:text-yellow-300 ml-1"
																			onClick={(e) => e.stopPropagation()}
																		>
                                    Premium&apos;a yükselt
																		</Link>
																	</div>
																)}
															</div>
														</motion.div>
													)}
												</AnimatePresence>
											</div>
										</motion.div>
									))}
								</AnimatePresence>
							</div>
						) : (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								className="text-center py-12 bg-white/5 rounded-xl border border-white/10"
							>
								<p className="text-gray-400">Aramanızla eşleşen komut bulunamadı.</p>
							</motion.div>
						)}
					</motion.div>

					{/* Premium Bilgi Kartı */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.8, duration: 0.5 }}
						className="mt-16 max-w-4xl mx-auto"
					>
						<div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-xl rounded-xl p-6 border border-white/10">
							<div className="flex flex-col md:flex-row items-center gap-6">
								<div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
									<Star className="h-8 w-8 text-white" />
								</div>
								<div className="flex-1 text-center md:text-left">
									<h3 className="text-xl font-bold mb-2">Premium Komutlara Erişin</h3>
									<p className="text-gray-300 mb-4">
                  Premium üyelik ile tüm komutlara erişin ve botunuzun tüm potansiyelini ortaya çıkarın.
									</p>
									<Link
										href="/premium"
										className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg font-medium hover:opacity-90 transition-opacity"
									>
                  Premium&apos;a Yükselt
										<ChevronDown className="h-4 w-4 rotate-270" />
									</Link>
								</div>
							</div>
						</div>
					</motion.div>
				</div>

				{/* Süsleme Elementleri */}
				<div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
					<div
						className="absolute top-0 left-0 w-full h-64 opacity-30"
						style={{
							background: `linear-gradient(to right, ${categories[0].color}22, ${categories[1].color}22, ${categories[2].color}22)`,
							filter: "blur(100px)",
						}}
					/>
					<div
						className="absolute bottom-0 right-0 w-full h-64 opacity-30"
						style={{
							background: `linear-gradient(to left, ${categories[0].color}22, ${categories[1].color}22, ${categories[2].color}22)`,
							filter: "blur(100px)",
						}}
					/>
				</div>
			</div>
			<Footer />
		</>
	);
}

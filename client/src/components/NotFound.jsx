"use client";

import { useState, useEffect } from "react";
import SpinnerComponent from "@/components/Spinner.jsx";
import settings from "@/settings.js";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaDiscord, FaRobot, FaServer } from "react-icons/fa6";
import {
	Shield,
	Music,
	Smile,
	Settings,
	Star,
	ChevronRight,
	Users,
	BarChart,
	MessageCircle,
	ArrowRight,
	Command,
} from "lucide-react";
import Navbar from "@/components/NavBar.jsx";
import Footer from "../app/components/footer";

export default function Page() {
	const { status } = useSession();
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
	const [scrollY, setScrollY] = useState(0);
	useEffect(() => {
		const handleScroll = () => {
			setScrollY(window.scrollY);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	if (status === "loading") return <SpinnerComponent />;
	return <HomePage mousePosition={mousePosition} scrollY={scrollY} status={status} />;
}

function HomePage({ mousePosition, scrollY, status }) {
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

	// Bot özellikleri
	const features = [
		{
			icon: <Shield className="h-6 w-6 text-blue-400" />,
			title: "Gelişmiş Moderasyon",
			description: "Sunucunuzu güvende tutmak için kapsamlı moderasyon araçları",
			color: "from-blue-500 to-indigo-600",
		},
		{
			icon: <Music className="h-6 w-6 text-purple-400" />,
			title: "Yüksek Kaliteli Müzik",
			description: "Kesintisiz müzik deneyimi ve özel çalma listeleri",
			color: "from-purple-500 to-pink-600",
		},
		{
			icon: <Smile className="h-6 w-6 text-yellow-400" />,
			title: "Eğlence Komutları",
			description: "Sunucunuzu canlandıracak eğlenceli aktiviteler ve oyunlar",
			color: "from-yellow-400 to-orange-500",
		},
		{
			icon: <Settings className="h-6 w-6 text-emerald-400" />,
			title: "Tam Özelleştirme",
			description: "Sunucunuza özel ayarlar ve komutlarla kişiselleştirme",
			color: "from-emerald-500 to-teal-600",
		},
	];

	// İstatistikler
	const stats = [
		{ value: "500+", label: "Sunucu", icon: <FaServer className="h-5 w-5" /> },
		{ value: "10,000+", label: "Kullanıcı", icon: <Users className="h-5 w-5" /> },
		{ value: "50+", label: "Komut", icon: <MessageCircle className="h-5 w-5" /> },
		{ value: "99.9%", label: "Çalışma Süresi", icon: <BarChart className="h-5 w-5" /> },
	];

	return (
		<>
			<Navbar />
			<div className="relative overflow-hidden bg-gray-900 text-white">
				{/* Animasyonlu arka plan parçacıkları */}
				<div className="absolute inset-0 overflow-hidden pointer-events-none">
					{[...Array(20)].map((_, i) => (
						<motion.div
							key={i}
							className="absolute rounded-full bg-opacity-20"
							style={{
								background: "radial-gradient(circle, #3b82f633 0%, transparent 70%)",
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
						background: "radial-gradient(circle, #3b82f622 0%, transparent 70%)",
						left: mousePosition.x - 192,
						top: mousePosition.y - 192,
					}}
					animate={{
						left: mousePosition.x - 192,
						top: mousePosition.y - 192,
					}}
					transition={{ type: "spring", damping: 30, stiffness: 200 }}
				/>

				{/* Hero Section */}
				<section className="relative pt-20 pb-16 md:pt-32 md:pb-24">
					<div className="container mx-auto px-4">
						<motion.div
							initial={{ opacity: 0, y: -20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5 }}
							className="text-center max-w-4xl mx-auto mb-16"
						>
							<motion.div
								initial={{ scale: 0.8, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								transition={{ delay: 0.2, type: "spring" }}
								className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1 mb-4"
							>
								<FaRobot className="h-4 w-4 text-blue-400" />
								<span className="text-sm font-medium">Lavinnia Bot</span>
							</motion.div>

							<motion.h1
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.3, duration: 0.5 }}
								className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400"
							>
				Discord Sunucunuzu{" "}
								<span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
				  Güçlendirin
								</span>
							</motion.h1>

							<motion.p
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.4, duration: 0.5 }}
								className="text-xl text-gray-300 max-w-3xl mx-auto mb-8"
							>
				Gelişmiş moderasyon, müzik, eğlence ve daha fazlası için tasarlanmış çok yönlü Discord botumuzla
				sunucunuzu bir üst seviyeye taşıyın.
							</motion.p>

							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.5, duration: 0.5 }}
								className="flex flex-col sm:flex-row gap-4 justify-center"
							>
								<Link
									href={`https://discord.com/oauth2/authorize?client_id=${settings.bot.id}`}
									className="flex items-center justify-center gap-x-2 rounded-xl px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
								>
									<FaDiscord size={20} />
									<span className="text-base font-medium">Discord&apos;a Ekle</span>
								</Link>

								{status === "authenticated" ? (
									<Link
										href="/servers"
										className="flex items-center justify-center gap-x-2 rounded-xl px-6 py-3 text-white bg-zinc-800 hover:bg-zinc-700 border border-white/10 transition-all shadow-lg"
									>
										<span className="text-base font-medium">Kontrol Paneli</span>
									</Link>
								) : (
									<button
										onClick={() => signIn("discord")}
										className="flex items-center justify-center gap-x-2 rounded-xl px-6 py-3 text-white bg-zinc-800 hover:bg-zinc-700 border border-white/10 transition-all shadow-lg"
									>
										<FaDiscord size={20} />
										<span className="text-base font-medium">Discord ile Giriş Yap</span>
									</button>
								)}
							</motion.div>
						</motion.div>

						{/* Bot Preview */}
						<motion.div
							initial={{ opacity: 0, y: 40 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.6, duration: 0.7 }}
							className="relative max-w-5xl mx-auto"
						>
							<div className="relative">
								<div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent z-10 h-32 bottom-0 top-auto"></div>
								<div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 backdrop-blur-sm border border-white/10 rounded-2xl p-4 shadow-2xl">
									<div className="bg-gray-800 rounded-xl overflow-hidden">
										<div className="bg-gray-900 px-4 py-2 flex items-center gap-2 border-b border-gray-700">
											<div className="flex gap-1.5">
												<div className="w-3 h-3 rounded-full bg-red-500"></div>
												<div className="w-3 h-3 rounded-full bg-yellow-500"></div>
												<div className="w-3 h-3 rounded-full bg-green-500"></div>
											</div>
											<div className="text-xs text-gray-400 flex-1 text-center">Lavinnia Bot</div>
										</div>
										<div className="p-4 h-64 flex flex-col">
											<div className="flex items-start gap-3 mb-4">
												<div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
													<picture>
														<img
															src="https://discord.com/assets/4b83c5f3a0c8e1b2d7f3.svg"
															className="h-5 w-5" >
														</img>
													</picture>
												</div>
												<div className="bg-gray-700 rounded-lg p-3 text-sm max-w-xs">
													<p>Merhaba! ben Lavinnia Bot. Size nasıl yardımcı olabilirim 😎</p>
												</div>
											</div>

											<div className="flex items-start gap-3 mb-4 self-end">
												<div className="bg-blue-600 rounded-lg p-3 text-sm max-w-xs">
													<p>/help komutları göster</p>
												</div>
												<div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white">
													<span>U</span>
												</div>
											</div>

											<div className="flex items-start gap-3">
												<div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
													<FaRobot className="h-5 w-5" />
												</div>
												<div className="bg-gray-700 rounded-lg p-3 text-sm max-w-md">
													<p className="font-bold mb-2">Lavinnia Bot Help menu of the bot</p>
													<div className="grid grid-cols-2 gap-2 text-xs">
														<div className="bg-gray-800 p-1.5 rounded">/invite</div>
														<div className="bg-gray-800 p-1.5 rounded">/ping</div>
														<div className="bg-gray-800 p-1.5 rounded">/ban</div>
														<div className="bg-gray-800 p-1.5 rounded">/kick</div>
													</div>
													<div className="flex items-center gap-3 mt-4">
														<div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white">
															<span>U</span>
														</div>
														<p className="text-gray-400 text-sm">Bu komutları kullanarak sunucunuzu kolayca yönetebilirsiniz.</p>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>

								{/* Dekoratif elementler */}
								<div className="absolute -top-6 -right-6 w-20 h-20 bg-blue-500 rounded-full blur-2xl opacity-20"></div>
								<div className="absolute -bottom-6 -left-6 w-20 h-20 bg-indigo-500 rounded-full blur-2xl opacity-20"></div>
							</div>
						</motion.div>
					</div>
				</section>

				{/* Özellikler Bölümü */}
				<section className="py-20 relative">
					<div className="container mx-auto px-4">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
							className="text-center mb-16"
						>
							<h2 className="text-3xl md:text-4xl font-bold mb-4">Güçlü Özellikler</h2>
							<p className="text-gray-400 max-w-2xl mx-auto">
				Discord botumuz, sunucunuzu yönetmek ve geliştirmek için ihtiyacınız olan tüm araçları sunar.
							</p>
						</motion.div>

						<motion.div
							variants={containerVariants}
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true }}
							className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
						>
							{features.map((feature, index) => (
								<motion.div
									key={index}
									variants={itemVariants}
									whileHover={{ y: -10, transition: { duration: 0.2 } }}
									className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-blue-500/50 transition-all"
								>
									<div
										className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}
									>
										{feature.icon}
									</div>
									<h3 className="text-xl font-bold mb-2">{feature.title}</h3>
									<p className="text-gray-400">{feature.description}</p>
								</motion.div>
							))}
						</motion.div>
					</div>
				</section>

				{/* İstatistikler Bölümü */}
				<section className="py-16 relative">
					<div className="container mx-auto px-4">
						<div className="bg-gradient-to-r from-blue-600/10 to-indigo-600/10 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-12">
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5 }}
								viewport={{ once: true }}
								className="text-center mb-12"
							>
								<h2 className="text-3xl font-bold mb-4">Rakamlarla Botumuz</h2>
								<p className="text-gray-400 max-w-2xl mx-auto">
				  Binlerce sunucu ve kullanıcı tarafından güvenilen Discord botumuz.
								</p>
							</motion.div>

							<motion.div
								variants={containerVariants}
								initial="hidden"
								whileInView="visible"
								viewport={{ once: true }}
								className="grid grid-cols-2 md:grid-cols-4 gap-6"
							>
								{stats.map((stat, index) => (
									<motion.div key={index} variants={itemVariants} className="text-center">
										<div className="w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center mx-auto mb-4">
											{stat.icon}
										</div>
										<div className="text-3xl md:text-4xl font-bold mb-1">{stat.value}</div>
										<div className="text-gray-400">{stat.label}</div>
									</motion.div>
								))}
							</motion.div>
						</div>
					</div>
				</section>

				{/* Komutlar Önizleme */}
				<section className="py-20 relative">
					<div className="container mx-auto px-4">
						<div className="flex flex-col md:flex-row items-center gap-12">
							<motion.div
								initial={{ opacity: 0, x: -30 }}
								whileInView={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.5 }}
								viewport={{ once: true }}
								className="flex-1"
							>
								<h2 className="text-3xl md:text-4xl font-bold mb-6">
				  Kullanımı Kolay <span className="text-blue-400">Komutlar</span>
								</h2>
								<p className="text-gray-400 mb-8">
				  50&apos;den fazla komutla sunucunuzu yönetin, müzik çalın, eğlenceli aktiviteler düzenleyin ve daha
				  fazlasını yapın.
								</p>

								<div className="space-y-4 mb-8">
									{[
										{ cmd: "/moderation-system", desc: "Moderasyon ve Sistemleri Göz Atabilirsiniz" },
										{ cmd: "/chat-system", desc: "Sohbet Sistemine Göz Atabilirsiniz." },
									].map((item, i) => (
										<motion.div
											key={i}
											initial={{ opacity: 0, x: -20 }}
											whileInView={{ opacity: 1, x: 0 }}
											transition={{ duration: 0.3, delay: i * 0.1 }}
											viewport={{ once: true }}
											className="flex items-center gap-3"
										>
											<div className="w-10 h-10 rounded-lg bg-blue-600/20 flex items-center justify-center text-blue-400">
												<Command className="h-5 w-5" />
											</div>
											<div>
												<div className="font-mono text-sm text-blue-400">{item.cmd}</div>
												<div className="text-gray-400 text-sm">{item.desc}</div>
											</div>
										</motion.div>
									))}
								</div>

								<Link
									href="/komutlar"
									className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
								>
									<span>Tüm komutları görüntüle</span>
									<ArrowRight className="h-4 w-4" />
								</Link>
							</motion.div>

							<motion.div
								initial={{ opacity: 0, x: 30 }}
								whileInView={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.5 }}
								viewport={{ once: true }}
								className="flex-1"
							>
								<div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 rounded-xl overflow-hidden shadow-xl">
									<div className="border-b border-white/10 p-4 flex items-center gap-2">
										<Command className="h-5 w-5 text-blue-400" />
										<h3 className="font-medium">Komut Listesi</h3>
									</div>
									<div className="p-4 space-y-3">
										{[
											{ name: "ban", desc: "Kullanıcıyı sunucudan yasaklar", category: "moderasyon" },
											{ name: "kick", desc: "Kullanıcıyı sunucudan kickler", category: "moderasyon" },
											{ name: "invite", desc: "Botun davet bağlantısını gösterir", category: "moderasyon" },
											{ name: "help", desc: "Yardım menüsünü gösterir", category: "moderasyon" },
											{ name: "ping", desc: "Botun anlık geçikmesini gösterir", category: "moderasyon" },
										].map((cmd, i) => (
											<motion.div
												key={i}
												initial={{ opacity: 0, y: 10 }}
												whileInView={{ opacity: 1, y: 0 }}
												transition={{ duration: 0.3, delay: i * 0.1 }}
												viewport={{ once: true }}
												className="bg-white/5 rounded-lg p-3 flex justify-between items-center"
											>
												<div>
													<div className="font-mono text-white">/{cmd.name}</div>
													<div className="text-sm text-gray-400">{cmd.desc}</div>
												</div>
												<div className="text-xs px-2 py-1 rounded-full bg-white/10 text-gray-300">{cmd.category}</div>
											</motion.div>
										))}
									</div>
									<div className="bg-gray-800 p-3 text-center">
										<Link href="/komutlar" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
					  Daha fazla komut görüntüle
										</Link>
									</div>
								</div>
							</motion.div>
						</div>
					</div>
				</section>

				{/* Premium Bölümü */}
				<section className="py-20 relative">
					<div className="container mx-auto px-4">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5 }}
							viewport={{ once: true }}
							className="bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-purple-600/20 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-12 text-center"
						>
							<div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1 mb-6">
								<Star className="h-4 w-4 text-yellow-400" />
								<span className="text-sm font-medium">Premium</span>
							</div>

							<h2 className="text-3xl md:text-4xl font-bold mb-4">Premium Özelliklerle Daha Fazlasına Erişin</h2>
							<p className="text-gray-300 max-w-2xl mx-auto mb-8">
				Özel komutlar ve daha fazlası için premium aboneliğe geçin.
							</p>

							<Link
								href="/premium"
								className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl font-medium hover:opacity-90 transition-opacity shadow-lg shadow-blue-600/20"
							>
				Premium Özellikleri Keşfet
								<ChevronRight className="h-5 w-5" />
							</Link>
						</motion.div>
					</div>
				</section>
			</div>
			<Footer />
		</>
	);
}

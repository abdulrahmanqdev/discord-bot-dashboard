"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, X, Sparkles, Crown, Zap, Star, ChevronRight } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/app/components/footer";
export default function PremiumPage() {
	const [selectedPlan, setSelectedPlan] = useState("standard");
	const [isYearly, setIsYearly] = useState(false);
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
	const plans = [
		{
			id: "basic",
			name: "Temel",
			icon: <Zap className="h-6 w-6" />,
			description: "Küçük sunucular için temel özellikler",
			monthlyPrice: 49,
			yearlyPrice: 490,
			features: [
				{ name: "5 Özel Komut", included: true },
				{ name: "Temel Moderasyon", included: true },
				{ name: "Hoş Geldin Mesajları", included: true },
				{ name: "Müzik Çalma", included: true },
				{ name: "Rol Yönetimi", included: false },
				{ name: "Gelişmiş İstatistikler", included: false },
				{ name: "Özel Entegrasyonlar", included: false },
				{ name: "7/24 Öncelikli Destek", included: false },
			],
			color: "#4f46e5",
			gradient: "from-indigo-500 to-blue-500",
			popular: false,
		},
		{
			id: "standard",
			name: "Standart",
			icon: <Star className="h-6 w-6" />,
			description: "Büyüyen sunucular için ideal çözüm",
			monthlyPrice: 99,
			yearlyPrice: 990,
			features: [
				{ name: "15 Özel Komut", included: true },
				{ name: "Gelişmiş Moderasyon", included: true },
				{ name: "Özelleştirilebilir Mesajlar", included: true },
				{ name: "Müzik Çalma", included: true },
				{ name: "Rol Yönetimi", included: true },
				{ name: "Gelişmiş İstatistikler", included: true },
				{ name: "Özel Entegrasyonlar", included: false },
				{ name: "7/24 Öncelikli Destek", included: false },
			],
			color: "#8b5cf6",
			gradient: "from-violet-500 to-purple-500",
			popular: true,
		},
		{
			id: "premium",
			name: "Premium",
			icon: <Crown className="h-6 w-6" />,
			description: "Büyük sunucular için tam donanımlı",
			monthlyPrice: 199,
			yearlyPrice: 1990,
			features: [
				{ name: "Sınırsız Özel Komut", included: true },
				{ name: "Gelişmiş Moderasyon", included: true },
				{ name: "Tam Özelleştirilebilir", included: true },
				{ name: "Müzik Çalma", included: true },
				{ name: "Rol Yönetimi", included: true },
				{ name: "Gelişmiş İstatistikler", included: true },
				{ name: "Özel Entegrasyonlar", included: true },
				{ name: "7/24 Öncelikli Destek", included: true },
			],
			color: "#ec4899",
			gradient: "from-pink-500 to-rose-500",
			popular: false,
		},
	];
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
								background: `radial-gradient(circle, ${plans.find((p) => p.id === selectedPlan).color}33 0%, transparent 70%)`,
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
				<motion.div
					className="hidden md:block absolute w-96 h-96 rounded-full pointer-events-none"
					style={{
						background: `radial-gradient(circle, ${plans.find((p) => p.id === selectedPlan).color}22 0%, transparent 70%)`,
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
				<div className="container mx-auto px-4 py-20 relative z-10 mt-20">
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
							<Sparkles className="h-4 w-4 text-yellow-400" />
							<span className="text-sm font-medium">Premium Özellikler</span>
						</motion.div>

						<motion.h1
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.3, duration: 0.5 }}
							className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400"
						>
            Botunuzu{" "}
							<span
								className={`bg-clip-text text-transparent bg-gradient-to-r ${plans.find((p) => p.id === selectedPlan).gradient}`}
							>
              Premium
							</span>{" "}
            Yapın
						</motion.h1>

						<motion.p
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.4, duration: 0.5 }}
							className="text-xl text-gray-300 max-w-3xl mx-auto"
						>
            Sunucunuzu bir üst seviyeye taşıyacak premium özelliklere erişin ve kullanıcılarınıza en iyi deneyimi sunun.
						</motion.p>
					</motion.div>

					{/* Fiyatlandırma Geçişi */}
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ delay: 0.5, duration: 0.5 }}
						className="flex justify-center mb-12"
					>
						<div className="bg-white/10 p-1 rounded-full flex items-center">
							<button
								onClick={() => setIsYearly(false)}
								className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
									!isYearly ? "bg-white/20 text-white" : "text-gray-300 hover:text-white"
								}`}
							>
              Aylık
							</button>
							<button
								onClick={() => setIsYearly(true)}
								className={`px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
									isYearly ? "bg-white/20 text-white" : "text-gray-300 hover:text-white"
								}`}
							>
              Yıllık
								<span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">%17 İndirim</span>
							</button>
						</div>
					</motion.div>

					{/* Fiyatlandırma Planları */}
					<motion.div
						variants={containerVariants}
						initial="hidden"
						animate="visible"
						className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
					>
						{plans.map((plan) => (
							<motion.div
								key={plan.id}
								variants={itemVariants}
								whileHover={{ y: -10, transition: { duration: 0.2 } }}
								className={`relative rounded-2xl overflow-hidden ${plan.popular ? "md:-mt-4 md:mb-4" : ""}`}
								onClick={() => setSelectedPlan(plan.id)}
							>
								{/* Popüler plan işareti */}
								{plan.popular && (
									<div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-yellow-400 to-orange-500" />
								)}

								<div
									className={`h-full backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl overflow-hidden transition-all ${
										selectedPlan === plan.id ? `ring-2 ring-offset-2 ring-offset-gray-900 ring-${plan.color}` : ""
									}`}
								>
									{/* Plan başlığı */}
									<div className="p-6 pb-4">
										<div className="flex justify-between items-start mb-4">
											<div>
												<div
													className={`w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br ${plan.gradient} mb-3`}
												>
													{plan.icon}
												</div>
												<h3 className="text-xl font-bold">{plan.name}</h3>
												<p className="text-gray-400 text-sm mt-1">{plan.description}</p>
											</div>
											{plan.popular && (
												<div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                        Popüler
												</div>
											)}
										</div>

										{/* Fiyat */}
										<div className="mt-4 mb-6">
											<div className="flex items-end">
												<span className="text-4xl font-bold">{isYearly ? plan.yearlyPrice : plan.monthlyPrice}</span>
												<span className="text-gray-400 ml-2 mb-1">₺/{isYearly ? "yıl" : "ay"}</span>
											</div>
											{isYearly && (
												<p className="text-green-400 text-sm mt-1">
													{Math.round(((plan.monthlyPrice * 12 - plan.yearlyPrice) / (plan.monthlyPrice * 12)) * 100)}%
                        tasarruf
												</p>
											)}
										</div>

										{/* CTA Butonu */}
										<Link
											href={`/checkout?plan=${plan.id}&billing=${isYearly ? "yearly" : "monthly"}`}
											className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
												selectedPlan === plan.id
													? `bg-gradient-to-r ${plan.gradient} text-white`
													: "bg-white/20 hover:bg-white/30 text-white"
											}`}
										>
											{selectedPlan === plan.id ? "Şimdi Başla" : "Seç"}
											<ChevronRight className="h-4 w-4" />
										</Link>
									</div>

									{/* Özellikler */}
									<div className="p-6 pt-4 border-t border-white/10">
										<p className="text-sm font-medium text-gray-300 mb-4">Dahil olanlar:</p>
										<ul className="space-y-3">
											{plan.features.map((feature, index) => (
												<motion.li
													key={index}
													initial={{ opacity: 0, x: -10 }}
													animate={{ opacity: 1, x: 0 }}
													transition={{ delay: 0.6 + index * 0.1 }}
													className="flex items-start gap-3 text-sm"
												>
													<div className="mt-0.5">
														{feature.included ? (
															<div className={`rounded-full p-1 bg-gradient-to-r ${plan.gradient}`}>
																<Check className="h-3 w-3 text-white" />
															</div>
														) : (
															<div className="rounded-full p-1 bg-gray-800">
																<X className="h-3 w-3 text-gray-500" />
															</div>
														)}
													</div>
													<span className={feature.included ? "text-gray-200" : "text-gray-500"}>{feature.name}</span>
												</motion.li>
											))}
										</ul>
									</div>
								</div>
							</motion.div>
						))}
					</motion.div>

					{/* Güven Göstergeleri */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 1, duration: 0.5 }}
						className="mt-20 text-center"
					>
						<p className="text-gray-400 mb-6">Binlerce sunucu tarafından güvenilir</p>
						<div className="flex flex-wrap justify-center gap-8 opacity-70">
							{["Discord Partner", "Verified Bot", "Top.gg Onaylı", "500+ Sunucu", "10,000+ Kullanıcı"].map((item, i) => (
								<div key={i} className="text-sm font-medium">
									{item}
								</div>
							))}
						</div>
					</motion.div>
				</div>

				{/* Süsleme Elementleri */}
				<div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
					<div
						className="absolute top-0 left-0 w-full h-64 opacity-30"
						style={{
							background: `linear-gradient(to right, ${plans[0].color}22, ${plans[1].color}22, ${plans[2].color}22)`,
							filter: "blur(100px)",
						}}
					/>
					<div
						className="absolute bottom-0 right-0 w-full h-64 opacity-30"
						style={{
							background: `linear-gradient(to left, ${plans[0].color}22, ${plans[1].color}22, ${plans[2].color}22)`,
							filter: "blur(100px)",
						}}
					/>
				</div>
			</div>
			<Footer />
		</>
	);
}

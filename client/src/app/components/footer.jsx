"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Facebook, Instagram, Twitter, Linkedin, Heart, ChevronRight, MessageCircle, Star, Shield } from "lucide-react";
import { FaDiscord } from "react-icons/fa6";

export default function Footer() {
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const checkVisibility = () => {
			const footer = document.getElementById("animated-footer");
			if (!footer) return;

			const rect = footer.getBoundingClientRect();
			const isFooterVisible = rect.top < window.innerHeight && rect.bottom >= 0;
			setIsVisible(isFooterVisible);
		};

		window.addEventListener("scroll", checkVisibility);
		checkVisibility();
		return () => window.removeEventListener("scroll", checkVisibility);
	}, []);

	// Animasyon varyantları
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
		<footer
			id="animated-footer"
			className="relative overflow-hidden bg-gradient-to-b from-[#171821] to-[#0e0e13] text-white"
		>
			{/* Animasyonlu arka plan parçacıkları */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				{[...Array(10)].map((_, i) => (
					<motion.div
						key={i}
						className="absolute rounded-full bg-opacity-20"
						style={{
							background: "radial-gradient(circle, #3b82f633 0%, transparent 70%)",
							width: `${Math.random() * 30 + 10}px`,
							height: `${Math.random() * 30 + 10}px`,
							top: `${Math.random() * 100}%`,
							left: `${Math.random() * 100}%`,
						}}
						animate={{
							y: [0, Math.random() * 50 - 25],
							x: [0, Math.random() * 50 - 25],
							opacity: [0.1, 0.3, 0.1],
						}}
						transition={{
							duration: Math.random() * 10 + 10,
							repeat: Number.POSITIVE_INFINITY,
							repeatType: "reverse",
						}}
					/>
				))}
			</div>

			{/* Üst Dekoratif Çizgi */}
			<div className="relative">
				<div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
				<div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-blue-500/30 blur-sm"></div>
			</div>

			<div className="container mx-auto px-4 py-16 relative z-10">
				<motion.div
					variants={containerVariants}
					initial="hidden"
					animate={isVisible ? "visible" : "hidden"}
					className="grid grid-cols-1 md:grid-cols-4 gap-10"
				>
					<motion.div variants={itemVariants} className="space-y-6">
						<div className="flex items-center gap-2">
							<div className="w-10 h-10 rounded-full flex items-center justify-center">
								<picture>
									<img src="/favicon.ico" alt="Logo" className="w-10 h-10 rounded-full" />
								</picture>
							</div>
							<h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                Lavinnia Bot
							</h3>
						</div>
						<p className="text-gray-400 leading-relaxed">
              Kaliteli hizmet ve ürünler sunmak için her zaman yanınızdayız. Discord sunucunuzu bir üst seviyeye
              taşıyın.
						</p>

						<div className="pt-4">
							<div className="flex items-center gap-2 text-sm text-gray-400">
								<div className="flex -space-x-2">

								</div>
								<span>Binlerce kullanıcı tarafından güvenilir</span>
							</div>
						</div>
					</motion.div>

					{/* Ana Sayfalar */}
					<motion.div variants={itemVariants} className="space-y-6">
						<h3 className="text-lg font-bold relative inline-block">
              Ana Sayfalar
							<div className="absolute -bottom-1 left-0 w-12 h-0.5 bg-blue-500"></div>
						</h3>
						<ul className="space-y-4">
							{[
								{ name: "Ana Sayfa", href: "/" },
								{ name: "Premium", href: "/premium" },
								{ name: "Komutlar", href: "/command" },
							].map((link, i) => (
								<motion.li key={i} whileHover={{ x: 5 }} className="flex items-center gap-2 group">
									<div className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
									<Link
										href={link.href}
										className="text-gray-400 hover:text-white transition-colors flex items-center gap-1"
									>
										{link.name}
										<ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
									</Link>
								</motion.li>
							))}
						</ul>
					</motion.div>

					{/* Diğer */}
					<motion.div variants={itemVariants} className="space-y-6">
						<h3 className="text-lg font-bold relative inline-block">
              Diğer
							<div className="absolute -bottom-1 left-0 w-12 h-0.5 bg-blue-500"></div>
						</h3>
						<ul className="space-y-4">
							{[
								{ name: "FAQ (Sık Sorulan Sorular)", href: "/sss", icon: <MessageCircle className="h-4 w-4" /> },
								{ name: "Top.gg", href: "https://top.gg", icon: <Star className="h-4 w-4" /> },
								{ name: "Destek Sunucusu", href: "https://discord.gg/", icon: <Shield className="h-4 w-4" /> },
							].map((link, i) => (
								<motion.li key={i} whileHover={{ x: 5 }} className="flex items-center gap-2 group">
									<div className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
									<Link
										href={link.href}
										className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
									>
										{link.icon}
										{link.name}
									</Link>
								</motion.li>
							))}
						</ul>
					</motion.div>

					{/* Sosyal Medya */}
					<motion.div variants={itemVariants} className="space-y-6">
						<h3 className="text-lg font-bold relative inline-block">
              Bizi Takip Edin
							<div className="absolute -bottom-1 left-0 w-12 h-0.5 bg-blue-500"></div>
						</h3>
						<div className="flex flex-wrap gap-4">
							{[
								{ icon: <Facebook className="h-5 w-5" />, href: "https://facebook.com", color: "bg-[#1877F2]" },
								{ icon: <Twitter className="h-5 w-5" />, href: "https://twitter.com", color: "bg-[#1DA1F2]" },
								{
									icon: <Instagram className="h-5 w-5" />,
									href: "https://instagram.com",
									color: "bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45]",
								},
								{ icon: <Linkedin className="h-5 w-5" />, href: "https://linkedin.com", color: "bg-[#0A66C2]" },
								{ icon: <FaDiscord className="h-5 w-5" />, href: "https://discord.gg", color: "bg-[#5865F2]" },
							].map((social, i) => (
								<motion.a
									key={i}
									href={social.href}
									target="_blank"
									rel="noopener noreferrer"
									className={`w-10 h-10 rounded-lg flex items-center justify-center text-white transition-transform ${social.color} hover:scale-110`}
									whileHover={{ y: -5 }}
									whileTap={{ scale: 0.95 }}
								>
									{social.icon}
								</motion.a>
							))}
						</div>
					</motion.div>
				</motion.div>

				{/* Alt Bilgi */}
				<motion.div
					variants={itemVariants}
					initial="hidden"
					animate={isVisible ? "visible" : "hidden"}
					className="mt-16 pt-8 border-t border-white/10"
				>
					<div className="flex flex-col md:flex-row justify-between items-center">
						<p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} Lavinnia. All rights reserved.</p>
						<motion.p
							className="text-sm text-gray-400 mt-4 md:mt-0 flex items-center gap-1"
							whileHover={{ scale: 1.05 }}
						>
              Developed with{" "}
							<motion.span
								animate={{ scale: [1, 1.2, 1] }}
								transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
							>
								<Heart className="h-4 w-4 text-red-500 fill-red-500" />
							</motion.span>{" "}
              by <span className="text-blue-400 hover:text-blue-300 transition-colors cursor-pointer">slow3rxq</span>
						</motion.p>
					</div>
				</motion.div>
			</div>
		</footer>
	);
}

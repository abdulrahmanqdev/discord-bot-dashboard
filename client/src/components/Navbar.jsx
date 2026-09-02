"use client";

import { useState, useEffect, useRef } from "react";
import { signIn, useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FaDiscord, FaRobot } from "react-icons/fa6";
import { Menu, X, ChevronDown, Command, Crown, Settings, User, LogOut, Search, Bell, HelpCircle, Home, Server } from "lucide-react";

export default function AnimatedNavbar() {
	const { data, status } = useSession();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const dropdownRef = useRef(null);
	const searchRef = useRef(null);

	// Handle scroll
	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 50);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// Handle clicks outside dropdown
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setIsDropdownOpen(false);
			}
			if (searchRef.current && !searchRef.current.contains(event.target)) {
				setIsSearchOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	// Loading state
	if (status === "loading") {
		return (
			<div className="fixed top-0 left-0 w-full h-16 flex items-center justify-center z-50 bg-gray-900">
				<div className="flex space-x-2">
					{[0, 1, 2].map((i) => (
						<motion.div
							key={i}
							animate={{
								scale: [1, 1.5, 1],
								opacity: [0.3, 1, 0.3],
							}}
							transition={{
								duration: 1.5,
								repeat: Infinity,
								ease: "easeInOut",
								delay: i * 0.2,
							}}
							className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
							style={{
								boxShadow: "0 0 15px 2px rgba(59, 130, 246, 0.5)",
							}}
						/>
					))}
				</div>
			</div>
		);
	}

	const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
	const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

	const navItems = [
		{ name: "Ana Sayfa", href: "/" },
		{ name: "Komutlar", href: "/command" },
		{ name: "Premium", href: "/premium" },
		{ name: "Sunucular", href: "/servers" },
	];

	const logoParticles = Array.from({ length: 6 }).map((_, i) => (
		<motion.div
			key={i}
			className="absolute rounded-full bg-[#cf8bfd]"
			initial={{
				x: 0,
				y: 0,
				opacity: 0,
				width: 4,
				height: 4,
			}}
			animate={{
				x: Math.random() * 40 - 20,
				y: Math.random() * 40 - 20,
				opacity: [0, 0.8, 0],
				width: [4, 2],
				height: [4, 2],
			}}
			transition={{
				duration: 2 + Math.random() * 2,
				repeat: Infinity,
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
			<motion.nav
				initial={{ y: -100, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{
					type: "spring",
					stiffness: 100,
					damping: 20,
					delay: 0.2,
				}}
				className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
					scrolled
						? "bg-gray-900/85 backdrop-blur-md shadow-lg"
						: "bg-transparent"
				}`}
			>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between h-16">
						{/* Logo */}
						<Link href="/" className="relative group z-10">
							<div className="flex items-center">
								<motion.div
									initial={{ opacity: 0, scale: 0.8 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{ duration: 0.5 }}
									className="relative"
									whileHover={{ scale: 1.05 }}
								>
									<div className="relative flex items-center gap-2">
										<div className="relative">
											{logoParticles}
											<picture>
												<img src="/favicon.ico" alt="Logo" className="w-10 h-10 rounded-full" />
											</picture>
										</div>
										<span className="text-white text-xl font-bold tracking-wide">
                      Lavinnia <span className="text-blue-400">Bot</span>
										</span>
									</div>
									<motion.div
										className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"
										initial={{ width: 0 }}
										animate={{ width: "100%" }}
										transition={{ duration: 0.8, delay: 0.5 }}
									/>
								</motion.div>
							</div>
						</Link>

						{/* Desktop Navigation */}
						<div className="hidden md:flex items-center space-x-6 mr-5">
							{navItems.map((item, i) => (
								<Link key={i} href={item.href}>
									<motion.div
										className="text-gray-300 hover:text-white flex items-center gap-1.5 relative group"
										whileHover={{ y: -2 }}
										transition={{ type: "spring", stiffness: 500, damping: 17 }}
									>
										<motion.span
											initial={{ opacity: 0, x: -10 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{ delay: 0.3 + i * 0.1 }}
											className="absolute -left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
										>
											{item.icon}
										</motion.span>
										<motion.span
											initial={{ opacity: 0, y: 10 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: 0.3 + i * 0.1 }}
										>
											{item.name}
										</motion.span>
										<motion.div
											className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"
											initial={{ width: 0 }}
											whileHover={{ width: "100%" }}
											transition={{ duration: 0.3 }}
										/>
									</motion.div>
								</Link>
							))}
							{status === "authenticated" ? (
								<div className="relative" ref={dropdownRef}>
									<motion.button
										onClick={toggleDropdown}
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
										className="flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-white/10 hover:border-white/20 transition-all duration-300"
									>
										<div className="relative">
											<picture>
												<img
													src={data.user.image || "https://cdn.discordapp.com/attachments/1321520016180641886/1374417631422972055/UlcyJiF_2FQJ_K0obqIQC_NadzmlC8FoeFQLuP3jRPPbqPaIN3H8-D0Wq2Pao4LQbyVY6MEQ9Hs4eiMxAV7GIfCAfc90_6behUpwWwzlbm-QuX8USanxIPoJzuQbJpT2PehlNtTGw9BJN6nZBPpni8t5pUWOVxUkLBf7tD801f0RKWc5auFGqPauzS3sYd-LFlg6ia2SMxUUgvWzBrGw19.jpg?ex=682df9aa&is=682ca82a&hm=9965922de8157b0a823ac7e1a54dee8c6d3c5a55befbc12e62ae9c2a092b00a9&"}
													alt="Avatar"
													className="w-8 h-8 rounded-full ring-2 ring-white/10"
												/>
											</picture>
											<motion.div
												animate={{
													boxShadow: ["0 0 0 0px rgba(59, 130, 246, 0.5)", "0 0 0 4px rgba(59, 130, 246, 0)"],
												}}
												transition={{
													repeat: Infinity,
													duration: 2,
													repeatType: "loop",
												}}
												className="absolute inset-0 rounded-full"
											/>
										</div>
										<span>{data.user.name}</span>
										<ChevronDown
											className={`w-4 h-4 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`}
										/>
									</motion.button>

									<AnimatePresence>
										{isDropdownOpen && (
											<motion.div
												initial={{ opacity: 0, y: -10, scale: 0.95 }}
												animate={{ opacity: 1, y: 0, scale: 1 }}
												exit={{ opacity: 0, y: -10, scale: 0.95 }}
												transition={{ duration: 0.2, type: "spring", stiffness: 500, damping: 30 }}
												className="absolute right-0 mt-2 w-80 bg-gradient-to-b from-gray-800 to-gray-900 border border-white/10 rounded-lg shadow-lg py-2 backdrop-blur-lg"
												style={{
													boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.7)",
												}}
											>

												<div className="py-2">
													<DropdownItem href="/profil" icon={<User className="w-4 h-4" />} text="Profile" />
													<DropdownItem
														href="/servers"
														icon={<Settings className="w-4 h-4" />}
														text="Manage Servers"
													/>
													<DropdownItem
														href="/update"
														icon={<Bell className="w-4 h-4" />}
														text="Updates"
													/>
												</div>

												<div className="border-t border-white/5 mt-1 pt-1">
													<button
														onClick={() => signOut()}
														className="flex items-center gap-2 w-full text-left px-5 py-2.5 text-red-400 hover:bg-red-500/10 transition-colors duration-200"
													>
														<LogOut className="w-4 h-4" />
														<span>Log Out</span>
													</button>
												</div>
											</motion.div>
										)}
									</AnimatePresence>
								</div>
							) : (
								<motion.button
									onClick={() => signIn("discord")}
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									className="flex items-center gap-2 px-5 py-2 font-medium bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
								>
									<FaDiscord className="w-4 h-4" />
									<span>Giriş Yap</span>
								</motion.button>
							)}
						</div>

						{/* Mobile Menu Button */}
						<div className="md:hidden">
							<motion.button
								onClick={toggleMenu}
								whileTap={{ scale: 0.9 }}
								className="text-gray-300 hover:text-white transition-colors p-1"
							>
								<AnimatePresence mode="wait">
									{isMenuOpen ? (
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
					</div>
				</div>
			</motion.nav>

			{/* Mobile Menu */}
			<AnimatePresence>
				{isMenuOpen && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.3, ease: "easeInOut" }}
						className="md:hidden fixed top-16 left-0 right-0 z-40 bg-gradient-to-b from-gray-900 to-gray-800 border-b border-white/5 backdrop-blur-lg"
						style={{ boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)" }}
					>
						<div className="px-6 py-4 space-y-1">
							{navItems.map((item, i) => (
								<motion.div
									key={i}
									initial={{ x: -20, opacity: 0 }}
									animate={{ x: 0, opacity: 1 }}
									transition={{ delay: i * 0.1 }}
								>
									<Link
										href={item.href}
										className="flex items-center gap-3 py-3 text-gray-300 hover:text-white transition-colors"
										onClick={() => setIsMenuOpen(false)}
									>
										<motion.div
											whileHover={{ scale: 1.2, rotate: 5 }}
											whileTap={{ scale: 0.9 }}
											className="bg-white/5 p-2 rounded-lg"
										>
											{item.icon}
										</motion.div>
										<span>{item.name}</span>
									</Link>
								</motion.div>
							))}

							<motion.div
								initial={{ x: -20, opacity: 0 }}
								animate={{ x: 0, opacity: 1 }}
								transition={{ delay: navItems.length * 0.1 }}
								className="pt-2 mt-2 border-t border-white/5"
							>
								{status === "authenticated" ? (
									<>
										<div className="flex items-center gap-3 py-3">
											<div className="relative">
												<picture>
													<img
														src={data.user.image || "/placeholder.svg?height=40&width=40"}
														alt="Avatar"
														className="w-10 h-10 rounded-full border-2 border-blue-500/30"
													/>
												</picture>
												<motion.div
													className="absolute -inset-1 rounded-full opacity-75"
													animate={{
														boxShadow: [
															"0 0 0 0px rgba(59, 130, 246, 0)",
															"0 0 0 3px rgba(59, 130, 246, 0.3)",
															"0 0 0 0px rgba(59, 130, 246, 0)",
														],
													}}
													transition={{
														repeat: Infinity,
														duration: 2,
													}}
												/>
											</div>
											<div>
												<p className="text-white font-medium">{data.user.name}</p>
												<p className="text-xs text-gray-400">{data.user.email || "Discord Kullanıcısı"}</p>
											</div>
										</div>

										<MobileMenuItem
											href="/profil"
											icon={<User className="w-4 h-4" />}
											text="Profil"
											onClick={() => setIsMenuOpen(false)}
										/>

										<MobileMenuItem
											href="/servers"
											icon={<Settings className="w-4 h-4" />}
											text="Sunucuları Yönet"
											onClick={() => setIsMenuOpen(false)}
										/>

										<MobileMenuItem
											href="/notifications"
											icon={<Bell className="w-4 h-4" />}
											text="Bildirimler"
											badge="3"
											onClick={() => setIsMenuOpen(false)}
										/>

										<motion.button
											onClick={() => {
												signOut();
												setIsMenuOpen(false);
											}}
											className="flex items-center gap-3 py-3 text-red-400 hover:text-red-300 transition-colors w-full text-left"
											whileHover={{ x: 5 }}
											whileTap={{ scale: 0.98 }}
										>
											<motion.div whileHover={{ rotate: 15 }} className="bg-red-500/10 p-2 rounded-lg">
												<LogOut className="w-4 h-4" />
											</motion.div>
											<span>Çıkış Yap</span>
										</motion.button>
									</>
								) : (
									<motion.button
										onClick={() => signIn("discord")}
										className="flex items-center justify-center gap-2 w-full py-3 mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg"
										whileTap={{ scale: 0.98 }}
									>
										<FaDiscord className="w-4 h-4" />
										<span>Discord ile Giriş Yap</span>
									</motion.button>
								)}
							</motion.div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}

function DropdownItem({ href, icon, text, badge }) {
	return (
		<Link
			href={href}
			className="flex items-center justify-between px-5 py-2.5 text-gray-300 hover:text-white hover:bg-white/5 transition-colors duration-200 group"
		>
			<div className="flex items-center gap-2">
				<motion.div
					whileHover={{ scale: 1.2, rotate: 5 }}
					whileTap={{ scale: 0.9 }}
					className="text-blue-400 group-hover:text-blue-300"
				>
					{icon}
				</motion.div>
				<span>{text}</span>
			</div>
			{badge && <div className="bg-blue-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">{badge}</div>}
		</Link>
	);
}

function MobileMenuItem({ href, icon, text, badge, onClick }) {
	return (
		<Link href={href} onClick={onClick}>
			<motion.div
				className="flex items-center justify-between py-3 text-gray-300 hover:text-white transition-colors"
				whileHover={{ x: 5 }}
				whileTap={{ scale: 0.98 }}
			>
				<div className="flex items-center gap-3">
					<motion.div whileHover={{ rotate: 5 }} className="bg-white/5 p-2 rounded-lg">
						{icon}
					</motion.div>
					<span>{text}</span>
				</div>
				{badge && <div className="bg-blue-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">{badge}</div>}
			</motion.div>
		</Link>
	);
}
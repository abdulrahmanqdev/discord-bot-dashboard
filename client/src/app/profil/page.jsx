"use client";
import Spinner from "@/components/Spinner";
import { getGuilds, getServers, getUserInfo, getBadgesFromFlags, DiscordBadgeIcons } from "@/functions/http";
import { useGuilds } from "@/stores/guilds";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useAsync } from "react-use";
import { FaDiscord } from "react-icons/fa6";
import Navbar from "@/components/NavBar.jsx";
import { motion } from "framer-motion";

export default function ProfilePage() {
	const { data, status } = useSession();
	const pathname = usePathname();
	const store = useGuilds();

	const { loading, value } = useAsync(async () => {
		if (!data?.user?.access_token) return null;
		if (!data?.user?.jwt) return null;

		try {
			const state = {
				servers: await getServers(data?.user.jwt),
				guilds: [],
				userInfo: await getUserInfo(data?.user.access_token),
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
			console.error("Hata:", error);
			return null;
		}
		}, [status, pathname]);

	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const [isEditMenuOpen, setIsEditMenuOpen] = useState(false);
	const [description, setDescription] = useState(value?.userInfo?.description || "");
	const [tempDescription, setTempDescription] = useState(description);

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	const toggleEditMenu = () => {
		setTempDescription(description);
		setIsEditMenuOpen(!isEditMenuOpen);
	};

	const handleDescriptionChange = (e) => {
		setTempDescription(e.target.value);
	};

	const saveDescription = () => {
		setDescription(tempDescription);
		setIsEditMenuOpen(false);
	};

	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 10) {
				setScrolled(true);
			}
			else {
				setScrolled(false);
			}
		};

		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	if (status === "loading" || loading || !value?.userInfo) return <Spinner />;
	if (!data?.user) {
		return <div className="text-center text-gray-400">Kullanıcı bilgileri yüklenemedi.</div>;
	}

	const user = {
		id: value?.userInfo?.id,
		name: value?.userInfo?.username,
		discriminator: value?.userInfo?.discriminator,
		image: value?.userInfo?.avatar
			? `https://cdn.discordapp.com/avatars/${value?.userInfo?.id}/${value?.userInfo?.avatar}.png`
			: `https://cdn.discordapp.com/embed/avatars/${Number.parseInt(value?.userInfo?.discriminator || 0) % 5}.png`,
		banner: value?.userInfo?.banner,
		nitro: value?.userInfo?.premium_type || 0,
	};

	const badges = getBadgesFromFlags(value?.userInfo?.public_flags || 0);
	if (user.nitro === 1 || user.nitro === 2) {
		badges.push("NITRO");
	}

	return (
		<div className="relative overflow-hidden bg-gray-900 text-white min-h-screen">
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

			<Navbar isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
			<div className="mx-auto max-w-[1750px] pt-28 mb-52 relative z-10">
				<div
					className="relative h-[300px] w-full rounded-xl"
					style={{
						backgroundImage: user?.banner
							? `url(https://cdn.discordapp.com/banners/${user.id}/${user.banner}.png)`
							: "url(https://images.pexels.com/photos/4871011/pexels-photo-4871011.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)",
						backgroundColor: user?.banner ? "transparent" : "#171820",
						backgroundSize: "cover",
						backgroundPosition: "center",
					}}
				>
					<div className="absolute -bottom-14 left-10 z-[3] w-[calc(100%_-_2.5rem)]">
						<picture>
							<img
								src={user?.image || "/placeholder.svg"}
								alt={user?.name || "Kullanıcı"}
								className="size-[128px] rounded-full border-[10px] border-[#12131A] bg-[#12131A]"
								onError={(e) => {
									e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=random&color=fff&size=128`;
								}}
							/>
						</picture>
					</div>
				</div>
				<div className="mt-[70px]">
					<h2 className="text-3xl font-bold text-white flex items-center gap-4">
            @{user?.name}
						<div className="flex items-center gap-2">
							{badges.length > 0 ? (
								badges.map((badge, index) => (
									<picture key={index}>
										<img
											src={DiscordBadgeIcons[badge] || "https://example.com/icons/default.png" || "/placeholder.svg"}
											alt={badge}
											className="w-6 h-6"
											title={badge}
										/>
									</picture>
								))
							) : (
								<span className="text-gray-400 text-sm">Rozet yok</span>
							)}
						</div>
						<a
							href={`https://discord.com/users/${user?.id}`}
							target="_blank"
							rel="noopener noreferrer"
							className="ml-auto px-4 py-2 text-lg bg-blue-600/10 text-white border border-blue-600/30 rounded-xl p-3 hover:bg-blue-600/30 transition-all flex items-center gap-2"
						>
							<FaDiscord size={20} />
              Discord&apos;a Git
						</a>
						<button
							onClick={toggleEditMenu}
							className="px-4 py-2 text-lg bg-red-600/10 text-white border border-red-600/30 rounded-xl p-3 hover:bg-red-600/30 transition-all flex items-center gap-2"
						>
							<svg
								stroke="currentColor"
								fill="currentColor"
								strokeWidth="0"
								viewBox="0 0 576 512"
								height="20px"
								width="20px"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z"></path>
							</svg>
              Profilini Düzenle
						</button>
					</h2>
					<p className="mt-2 text-gray-300 text-lg break-words">{description || "Henüz bir açıklama eklenmemiş."}</p>
					{isEditMenuOpen && (
						<div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
							<div className="p-6 bg-[#191a1d] rounded-lg shadow-lg w-[90%] max-w-[500px] transform transition-transform duration-300 scale-95 opacity-100 animate-fade-in border border-white/10">
								<h3 className="text-lg font-bold text-white">Açıklamanı Düzenle</h3>
								<form
									onSubmit={(e) => {
										e.preventDefault();
										if (tempDescription.length < 50) {
											alert("Açıklama en az 50 karakter olmalıdır.");
											return;
										}
										saveDescription();
									}}
								>
									<textarea
										value={tempDescription}
										onChange={handleDescriptionChange}
										className="w-full mt-4 p-2 bg-[#1E1F22] border border-blue-600 text-white rounded-lg resize-none"
										rows="4"
										placeholder="Açıklamanızı buraya yazın..."
									/>
									<div className="mt-4 flex justify-end gap-2">
										<button
											type="button"
											onClick={() => setIsEditMenuOpen(false)}
											className="px-4 py-2 bg-red-600/10 text-red-600 border border-red-600/30 rounded-xl p-3 hover:bg-red-600/30 transition-all"
										>
                      İptal
										</button>
										<button
											type="submit"
											disabled={!tempDescription || tempDescription.length < 50}
											className={`px-4 py-2 rounded-lg transition ${
												!tempDescription || tempDescription.length < 50
													? "bg-gray-600/10 text-gray-600 border border-gray-600/30 rounded-xl p-3 hover:bg-bray-600/30 transition-all cursor-not-allowed"
													: "bg-green-600/10 text-green-600 border border-green-600/30 rounded-xl p-3 hover:bg-green-600/30 transition-all"
											}`}
										>
                      Kaydet
										</button>
									</div>
								</form>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

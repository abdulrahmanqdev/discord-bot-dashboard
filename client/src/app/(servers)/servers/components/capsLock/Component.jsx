"use client";
import NotFound from "@/components/NotFound";
import Spinner from "@/components/Spinner";
import {
	getGuilds,
	getPermissions,
	getServers,
	setSystemSettings,
	getCapsLockSettings,
	setCapsLockSettings,
} from "@/functions/http";
import { useGuilds } from "@/stores/guilds";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useAsync } from "react-use";
import { motion, AnimatePresence } from "framer-motion";

export default function Component() {
	const { data, status } = useSession();
	const store = useGuilds();
	const params = useParams();
	const server_id = params.server_id;

	const [currentView, setCurrentView] = useState("capsSettings");
	const [selectedChannel, setSelectedChannel] = useState(null);
	const [systemEnabled, setSystemEnabled] = useState(false);
	const [askConfirm, setAskConfirm] = useState(false);
	const [successMessage, setSuccessMessage] = useState(null);
	const [errorMessage, setErrorMessage] = useState(null);
	const [selectedNumber, setSelectedNumber] = useState("");
	const pathname = usePathname();

	useEffect(() => {
		const savedCapsLockSystemEnabled = localStorage.getItem("capsLockSystemEnabled");
		if (savedCapsLockSystemEnabled !== null) {
			setSystemEnabled(JSON.parse(savedCapsLockSystemEnabled));
		}
	}, []);

	const { loading, value } = useAsync(async () => {
		if (!data?.user?.access_token || !data?.user?.jwt) return null;

		try {
			const state = {
				servers: await getServers(data?.user.jwt),
				guilds: [],
				guild: null,
				//permissions: [],
			};

			if (!(store?.array && store?.array.length)) {
				state.guilds = await getGuilds(data?.user.access_token);
				store.setArray(state.guilds);
			}
			else {
				state.guilds = store.array;
			}

			//state.permissions = await getPermissions(server_id, data?.user.jwt);
			const checkUser = state.guilds.find((val) => val.id === server_id);
			if (checkUser) {
				state.guild = state.servers?.find((val) => val.id === server_id);
			}

			return state;
		}
		catch (error) {
			console.log(error);
			return null;
		}
	}, [status, server_id]);

	const handleSaveCapsLockSettings = async () => {
		if (!selectedChannel || !selectedNumber) {
			setErrorMessage("Lütfen tüm alanları doldurunuz.");
			setTimeout(() => setErrorMessage(null), 5000);
			return;
		}

		try {
			const response = await setCapsLockSettings(server_id, data.user.jwt, {
				channel: selectedChannel,
				enabled: systemEnabled ? "on" : "off",
				threshold: parseInt(selectedNumber, 10),
				userId: data.user.id,
			});

			if (response.success) {
				setSuccessMessage("✅ CapsLock sistemi ayarları başarıyla kaydedildi!");
				setTimeout(() => setErrorMessage(null), 5000);
			}
			else {
				setErrorMessage("❌ Ayarlar kaydedilirken bir hata oluştu.");
				setTimeout(() => setErrorMessage(null), 5000);
			}
		}
		catch (error) {
			console.error("CapsLock sistemi ayarları kaydedilirken hata oluştu:", error.response?.data || error.message);
			setErrorMessage("❌ Sunucuya bağlanılamadı.");
		}
	};

	const handleChannelChange = (e) => {
		const channelId = e.target.value;
		setSelectedChannel(channelId);
		localStorage.setItem("selectedChannel", channelId);
	};

	const handleToggleCapsLockSystem = () => {
		const newValue = !systemEnabled;
		setSystemEnabled(newValue);
		localStorage.setItem("capsLockSystemEnabled", JSON.stringify(newValue));
	};

	if (status === "loading" || loading) return <Spinner />;
	if (status === "unauthenticated") return <NotFound />;

	return (
		<div className="mb-6">
			<div className="flex justify-between items-start mb-4">
				<div>
					<h1 className="text-2xl font-semibold">Caps Lock Sistemi</h1>
					<p className="text-sm text-gray-400">
                        Sunucudaki büyük harf sınırını ayarlayabilirsiniz. Aşağıdaki onay kutusunu açarak sistemin devamını ayarlayabilirsiniz.
					</p>
				</div>
			</div>

			<AnimatePresence>
				{systemEnabled && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 20 }}
						transition={{ duration: 0.3, ease: "easeOut" }}
						className="grid md:grid-cols-2 gap-4 mb-6"
					>
						<div>
							<label className="block text-sm mb-1">Giriş Kanalını seçiniz</label>
							<select
								onChange={handleChannelChange}
								value={selectedChannel || ""}
								className="w-full bg-[#2B2D31] p-3 rounded-lg border border-[#40444B] focus:ring-2 focus:ring-blue-500"
							>
								<option value="" disabled hidden>
                                    Bir kanal seçiniz...
								</option>
								{value.guild.channels
									.filter((channel) => channel.type === 0)
									.map((channel) => (
										<option key={channel.id} value={channel.id}>
                                            #{channel.name}
										</option>
									))}
							</select>
						</div>
						<div>
							<label className="block text-sm mb-1">Büyük harf sınırı</label>
							<select
								value={selectedNumber}
								onChange={(e) => setSelectedNumber(e.target.value)}
								className="w-full bg-[#2B2D31] p-3 rounded-lg border border-[#40444B] focus:ring-2 focus:ring-blue-500"
							>
								<option value="" disabled hidden>
                                    Bir sayı seçiniz...
								</option>
								<option value="10">%10</option>
								<option value="20">%20</option>
								<option value="30">%30</option>
								<option value="50">%50</option>
								<option value="70">%70</option>
							</select>
						</div>
						<div className="flex col-span-2 mt-4 text-right">
							<button
								onClick={handleSaveCapsLockSettings}
								className="bg-blue-600/10 text-blue-600 border border-blue-600/30 rounded-xl hover:bg-blue-600/30 font-semibold py-2 px-6 transition-all duration-200"
							>
                                Sistemi Kaydet
							</button>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{errorMessage && (
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -20 }}
					transition={{ duration: 0.3 }}
					className="bg-red-500 text-white px-4 py-2 rounded-lg mt-4"
				>
					{errorMessage}
				</motion.div>
			)}

			{successMessage && (
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -20 }}
					transition={{ duration: 0.3 }}
					className="bg-green-500 text-white px-4 py-2 rounded-lg mt-4"
				>
					{successMessage}
				</motion.div>
			)}
		</div>
	);
}
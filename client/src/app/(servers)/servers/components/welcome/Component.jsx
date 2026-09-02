"use client";
import NotFound from "@/components/NotFound";
import Spinner from "@/components/Spinner";
import {
	getGuilds,
	getPermissions,
	getServers,
	setSystemSettings,
	getSystemSettings,
} from "@/functions/http";
import { useGuilds } from "@/stores/guilds";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useAsync } from "react-use";
import { motion, AnimatePresence } from "framer-motion";

export default function Component() {
	const { data, status } = useSession();
	const store = useGuilds();
	const params = useParams();
	const server_id = params.server_id;

	const [selectedEntryChannel, setSelectedEntryChannel] = useState(null);
	const [selectedExitChannel, setSelectedExitChannel] = useState(null);
	const [successMessage, setSuccessMessage] = useState(null);
	const [errorMessage, setErrorMessage] = useState(null);
	const [askConfirm, setAskConfirm] = useState(false);
	const [systemEnabled, setSystemEnabled] = useState(false);

	const { loading, value } = useAsync(async () => {
		if (!data?.user?.access_token || !data?.user?.jwt) return null;

		try {
			const state = {
				servers: await getServers(data?.user.jwt),
				guilds: [],
				guild: null,
				permissions: [],
			};

			if (!(store?.array && store?.array.length)) {
				state.guilds = await getGuilds(data?.user.access_token);
				store.setArray(state.guilds);
			}
			else {
				state.guilds = store.array;
			}

			state.permissions = await getPermissions(
				params.server_id,
				data?.user.jwt
			);

			const checkUser = state.guilds.find(
				(val) => val.id === params.server_id
			);

			if (checkUser) {
				state.guild = state.servers?.find((val) => val.id === params.server_id);
			}

			return state;
		}
		catch (error) {
			console.log(error);
			return null;
		}
	}, [status, params.server_id]);


	const handleSaveSystemSettings = async () => {
		if (!selectedEntryChannel || !selectedExitChannel) {
			setErrorMessage("Lütfen giriş ve çıkış kanallarını seçin.");
			setTimeout(() => setErrorMessage(null), 5000);
			return;
		}

		try {
			const response = await setSystemSettings(server_id, data.user.jwt, {
				entryChannel: selectedEntryChannel,
				exitChannel: selectedExitChannel,
				enabled: systemEnabled ? "on" : "off",
				userId: data.user.id,
			});

			if (response.success) {
				setSuccessMessage("✅ Giriş/Çıkış sistemi ayarları başarıyla kaydedildi!");

				// Select menüleri sıfırla
				setSelectedEntryChannel(null);
				setSelectedExitChannel(null);

				// localStorage'daki verileri temizle
				localStorage.removeItem("selectedEntryChannel");
				localStorage.removeItem("selectedExitChannel");

				setTimeout(() => setSuccessMessage(null), 5000);
			}
			else {
				setErrorMessage("❌ Ayarlar kaydedilirken bir hata oluştu.");
				setTimeout(() => setErrorMessage(null), 5000);
			}
		}
		catch (error) {
			console.error("Giriş/Çıkış sistemi ayarları kaydedilirken hata oluştu:", error.response?.data || error.message);
			setErrorMessage("❌ Sunucuya bağlanılamadı.");
		}
	};

	const handleEntryChannelChange = (e) => {
		const channelId = e.target.value;
		setSelectedEntryChannel(channelId);
		localStorage.setItem("selectedEntryChannel", channelId);
	};

	const handleExitChannelChange = (e) => {
		const channelId = e.target.value;
		setSelectedExitChannel(channelId);
		localStorage.setItem("selectedExitChannel", channelId);
	};

	useEffect(() => {
		const savedSystemEnabled = localStorage.getItem("entryExitSystemEnabled");
		const savedEntryChannel = localStorage.getItem("selectedEntryChannel");
		const savedExitChannel = localStorage.getItem("selectedExitChannel");

		if (savedSystemEnabled !== null) {
			setSystemEnabled(JSON.parse(savedSystemEnabled));
		}

		if (savedEntryChannel) {
			setSelectedEntryChannel(savedEntryChannel);
		}

		if (savedExitChannel) {
			setSelectedExitChannel(savedExitChannel);
		}
	}, []);

	if (status === "loading" || loading) return <Spinner />;
	if (status === "unauthenticated") return <NotFound />;
	if (!value?.guild || !value?.permissions.includes("ManageGuild")) {
		return <div>Böyle bir sunucu bulunamadı veya yetkiniz yok!</div>;
	}
	return (
		<div className="mb-6">
			<div className="flex justify-between items-start mb-4">
				<div>
					<h1 className="text-2xl font-semibold">Giriş/Çıkış Sistemi</h1>
					<p className="text-sm text-gray-400">
                    Sistemi kurarak sunucunuzda kullanabilirsiniz. Aşağıdan kanalları seçerek sistemi aktif et butonuna basabilirsiniz.
					</p>
				</div>
			</div>
			<AnimatePresence>
				{systemEnabled && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 20 }}
						transition={{ duration: 0.4, ease: "easeOut" }}
						className="grid md:grid-cols-2 gap-4 mb-6"
					>
						{/* Giriş Kanalı */}
						<motion.div
							initial={{ opacity: 0, x: -30 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.1 }}
						>
							<label className="block text-sm mb-1">Giriş Kanalını seçiniz</label>
							<select
								onChange={handleEntryChannelChange}
								value={selectedEntryChannel || ""}
								className="w-full bg-[#2B2D31] p-3 rounded-lg border border-[#40444B] focus:ring-2 focus:ring-blue-500 mx-auto"
							>
								<option value="" disabled hidden>Bir giriş kanalı seçiniz...</option>
								{value.guild.channels
									.filter((channel) => channel.type === 0)
									.map((channel) => (
										<option key={channel.id} value={channel.id}>
                                        #{channel.name}
										</option>
									))}
							</select>
						</motion.div>
						<motion.div
							initial={{ opacity: 0, x: 30 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.2 }}
						>
							<label className="block text-sm mb-1">Çıkış Kanalını seçiniz</label>
							<select
								onChange={handleExitChannelChange}
								value={selectedExitChannel || ""}
								className="w-[760px] bg-[#2B2D31] p-3 rounded-lg border border-[#40444B] focus:ring-2 focus:ring-blue-500 mx-auto"
							>
								<option value="" disabled hidden>Bir çıkış kanalı seçiniz...</option>
								{value.guild.channels
									.filter((channel) => channel.type === 0)
									.map((channel) => (
										<option key={channel.id} value={channel.id}>
                                        #{channel.name}
										</option>
									))}
							</select>
						</motion.div>

						{/* Kaydet Butonu */}
						<motion.div
							className="flex col-span-2 mt-4 text-right"
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: 0.3 }}
						>
							<button
								onClick={handleSaveSystemSettings}
								className="bg-blue-600/10 text-blue-600 border border-blue-600/30 rounded-xl hover:bg-blue-600/30 font-semibold py-2 px-6 transition-all duration-200"
							>
                            Sistemi Kaydet
							</button>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Başarı Mesajı */}
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

			{/* Hata Mesajı */}
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
		</div>
	);
}
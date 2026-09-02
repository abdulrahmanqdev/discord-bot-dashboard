"use client";
import NotFound from "@/components/NotFound";
import Spinner from "@/components/Spinner";
import {
	getGuilds,
	getPermissions,
	getServers,
	setKickSettings,
	getKickSettings,
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

	const [selectedChannel, setSelectedChannel] = useState(null);
	const [systemEnabled, setSystemEnabled] = useState(false);
	const [successMessage, setSuccessMessage] = useState(null);
	const [errorMessage, setErrorMessage] = useState(null);
	const [username, setUsername] = useState("");

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

			state.permissions = await getPermissions(server_id, data?.user.jwt);
			const checkUser = state.guilds.find((val) => val.id === server_id);
			if (checkUser) {
				state.guild = state.servers?.find((val) => val.id === server_id);
			}

			return state;
		}
		catch (error) {
			console.error(error);
			return null;
		}
	}, [status, server_id]);

	const handleChannelChange = (e) => {
		const channelId = e.target.value;
		setSelectedChannel(channelId);
		localStorage.setItem("selectedKickChannel", channelId);
	};

	const handleUsernameChange = (e) => {
		const usernameValue = e.target.value;
		setUsername(usernameValue);
		localStorage.setItem("kickUsername", usernameValue);
	};
	const handleSaveSettings = async () => {
		if (!selectedChannel || !username) {
			setErrorMessage("Lütfen tüm alanları doldurunuz.");
			setTimeout(() => setErrorMessage(null), 5000);
			return;
		}

		try {
			// Kullanıcı adı kontrolü
			const userExists = await checkIfUserExists(username);
			if (!userExists) {
				setErrorMessage("❌ Girilen kullanıcı adı kick platformunda mevcut değil!");
				setTimeout(() => setErrorMessage(null), 5000);
				return;
			}

			const existingSettings = await getKickSettings(server_id, data.user.jwt);
			if (existingSettings) {
				setErrorMessage("❌ Kick sistemi zaten mevcut!");
				setTimeout(() => setErrorMessage(null), 5000);
				return;
			}

			const response = await setKickSettings(server_id, data.user.jwt, {
				enabled: systemEnabled,
				username: username,
				channelId: selectedChannel,
			});

			if (response.success) {
				setSuccessMessage("✅ Kick sistemi ayarları başarıyla kaydedildi!");
				setUsername("");
				setSelectedChannel(null);
				localStorage.removeItem("kickUsername");
				localStorage.removeItem("selectedKickChannel");
			}
			else {
				setErrorMessage("❌ Ayarlar kaydedilirken bir hata oluştu.");
			}
		}
		catch (error) {
			console.error("Kick sistemi ayarları kaydedilirken hata oluştu:", error.response?.data || error.message);
			setErrorMessage("❌ Sunucuya bağlanılamadı.");
		}
		finally {
			setTimeout(() => {
				setErrorMessage(null);
				setSuccessMessage(null);
			}, 5000);
		}
	};

	useEffect(() => {
		const savedSystemEnabled = localStorage.getItem("kickSystemEnabled");
		const savedChannel = localStorage.getItem("selectedKickChannel");
		const savedUsername = localStorage.getItem("kickUsername");

		if (savedSystemEnabled !== null) {
			setSystemEnabled(JSON.parse(savedSystemEnabled));
		}

		if (savedChannel) {
			setSelectedChannel(savedChannel);
		}

		if (savedUsername) {
			setUsername(savedUsername);
		}
	}, []);

	if (status === "loading" || loading) return <Spinner />;
	if (status === "unauthenticated") return <NotFound />;

	return (
		<div className="mb-6">
			<div className="flex justify-between items-start mb-4">
				<div>
					<h1 className="text-2xl font-semibold">Kick Sistemi</h1>
					<p className="text-sm text-gray-400">
                        Sunucunuzda kick sistemini kolayca açıp ayarlayabilirsiniz.
					</p>
				</div>
			</div>

			<AnimatePresence>
				{systemEnabled && (
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 10 }}
						transition={{ duration: 0.3 }}
						className="grid md:grid-cols-2 gap-4 mb-6"
					>
						<div>
							<label className="block text-sm mb-1">Kullanıcı Adı</label>
							<input
								type="text"
								value={username}
								onChange={handleUsernameChange}
								placeholder="Kullanıcı adını giriniz..."
								className="w-full bg-[#2B2D31] p-3 rounded-lg border border-[#40444B] focus:ring-2 focus:ring-blue-500"
							/>
						</div>

						<div>
							<label className="block text-sm mb-1">Bildirim Kanalı</label>
							<select
								onChange={handleChannelChange}
								value={selectedChannel || ""}
								className="w-full bg-[#2B2D31] p-3 rounded-lg border border-[#40444B] focus:ring-2 focus:ring-blue-500"
							>
								<option value="" disabled hidden>
                                    Bildirim kanalı seçiniz...
								</option>
								{value?.guild?.channels
									?.filter((channel) => channel.type === 0)
									.map((channel) => (
										<option key={channel.id} value={channel.id}>
                                            #{channel.name}
										</option>
									))}
							</select>
						</div>

						<div className="flex col-span-2 mt-4 text-right">
							<button
								onClick={handleSaveSettings}
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
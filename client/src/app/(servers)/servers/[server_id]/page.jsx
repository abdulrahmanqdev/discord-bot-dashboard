"use client";
import NotFound from "@/components/NotFound";
import Spinner from "@/components/Spinner";
import {
	getGuilds,
	getPermissions,
	getServers,
	setSystemSettings,
} from "@/functions/http";
import { useGuilds } from "@/stores/guilds";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useAsync } from "react-use";
import Capslock from "@/app/(servers)/servers/components/capsLock/Component";
import Kick from "@/app/(servers)/servers/components/kick/Component";
import Genel from "@/app/(servers)/servers/components/genel/Component";
import Welcome from "@/app/(servers)/servers/components/welcome/Component";
import ServerSidebar from "../components/SideBar";

export default function Page() {
	const { data, status } = useSession();
	const params = useParams();
	const store = useGuilds();

	const [selectedEntryChannel, setSelectedEntryChannel] = useState(null);
	const [selectedExitChannel, setSelectedExitChannel] = useState(null);
	const [successMessage, setSuccessMessage] = useState(null);
	const [errorMessage, setErrorMessage] = useState(null);
	const [askConfirm, setAskConfirm] = useState(false);
	const [currentView, setCurrentView] = useState("sendMessage");
	const [systemEnabled, setSystemEnabled] = useState(false);
	const [menuOpen, setMenuOpen] = useState(false);

	return (
		<div className="min-h-screen text-white flex relative z-0">
			<ServerSidebar
				currentView={currentView}
				setCurrentView={setCurrentView}
				menuOpen={menuOpen}
				setMenuOpen={setMenuOpen}
			/>

			<main
				className={`flex-1 p-6 transition-all md:ml-50 ${
					menuOpen ? "transform translate-x-48" : ""
				}`}
			>
				{currentView === "sendMessage" && (
					<div>
						<div className="flex justify-between items-start mb-5">
							<Welcome />

						</div>
					</div>
				)}

				{currentView === "generalSettings" && <Genel />}
				{currentView === "capsSettings" && <Capslock />}
				{currentView === "kickSetting" && <Kick />}
			</main>
		</div>
	);
}
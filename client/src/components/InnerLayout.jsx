// InnerLayout.jsx
"use client";
import { signOut, useSession } from "next-auth/react";
import { LuLogOut } from "react-icons/lu";

export default function InnerLayout({ children }) {
	const { status } = useSession();

	return (
		<>
			{children}
		</>
	);
}

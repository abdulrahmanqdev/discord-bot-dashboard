"use client";
import { SessionProvider } from "next-auth/react";
import InnerLayout from "./InnerLayout";
export default function Providers({ children }) {
	return (
		<SessionProvider>
			<InnerLayout>{children}</InnerLayout>
		</SessionProvider>
	);
}

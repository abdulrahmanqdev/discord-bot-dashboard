import "@/app/assets/styles/globals.css";
import Providers from "@/components/Providers.jsx";
import cn from "@/functions/cn.js";

export const metadata = {
	title: "Lavinnia Bot | Website",
	description: "Website designed for Lavinnia bot",
};


export default function RootLayout({ children }) {
	return (
		<html lang="tr">
			<body className="">
				<Providers>
					<main>{children}</main>
				</Providers>
			</body>
		</html>
	);
}

import { LuLoader } from "react-icons/lu";

export default function Spinner() {
	return (
		<div className="min-h-screen flex justify-center items-center">
			<LuLoader className="size-6 animate-spin" />
		</div>
	);
}
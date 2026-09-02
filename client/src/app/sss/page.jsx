"use client";

import { useState, useEffect } from "react";
import { Search, Sparkles, HelpCircle, MessageCircle, ChevronRight, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/app/components/footer";
import Link from "next/link";

const faqData = [
	{
		id: "q1",
		question: "Siparişimi nasıl takip edebilirim?",
		answer:
      "Siparişinizi takip etmek için hesabınıza giriş yapın ve 'Siparişlerim' bölümüne gidin. Buradan siparişinizin durumunu ve kargo takip numarasını görebilirsiniz.",
		category: "siparis",
		icon: "📦",
	},
	{
		id: "q2",
		question: "İade politikanız nedir?",
		answer:
      "Ürünlerimizi teslim aldıktan sonra 14 gün içinde iade edebilirsiniz. İade etmek istediğiniz ürünün kullanılmamış ve orijinal ambalajında olması gerekmektedir. İade işlemi için müşteri hizmetlerimizle iletişime geçmeniz yeterlidir.",
		category: "iade",
		icon: "🔄",
	},
	{
		id: "q3",
		question: "Kargo ücreti ne kadar?",
		answer:
      "100 TL ve üzeri siparişlerde kargo ücretsizdir. 100 TL altındaki siparişlerde ise 20 TL kargo ücreti alınmaktadır.",
		category: "siparis",
		icon: "🚚",
	},
	{
		id: "q4",
		question: "Ödeme seçenekleriniz nelerdir?",
		answer:
      "Kredi kartı, banka kartı, havale/EFT ve kapıda ödeme seçeneklerimiz mevcuttur. Kredi kartına 12 aya varan taksit imkanı sunuyoruz.",
		category: "odeme",
		icon: "💳",
	},
	{
		id: "q5",
		question: "Siparişim ne zaman elime ulaşır?",
		answer:
      "Siparişiniz onaylandıktan sonra 1-3 iş günü içinde kargoya verilir. Kargo firmasına bağlı olarak teslimat süresi 1-4 iş günü arasında değişebilir.",
		category: "siparis",
		icon: "⏱️",
	},
	{
		id: "q6",
		question: "Ürün değişimi yapabilir miyim?",
		answer:
      "Evet, teslim aldığınız ürünü 14 gün içinde farklı bir ürünle değiştirebilirsiniz. Değişim yapmak istediğiniz ürünün kullanılmamış ve orijinal ambalajında olması gerekmektedir.",
		category: "iade",
		icon: "🔁",
	},
	{
		id: "q7",
		question: "Faturamı nasıl alabilirim?",
		answer:
      "Faturanız siparişinizle birlikte gönderilmektedir. Ayrıca, dijital faturanıza hesabınızdan da erişebilirsiniz.",
		category: "siparis",
		icon: "📄",
	},
	{
		id: "q8",
		question: "Şifremi unuttum, ne yapmalıyım?",
		answer:
      "Giriş sayfasında 'Şifremi Unuttum' seçeneğine tıklayarak e-posta adresinize şifre sıfırlama bağlantısı gönderebilirsiniz.",
		category: "hesap",
		icon: "🔑",
	},
	{
		id: "q9",
		question: "Yurt dışına kargo yapıyor musunuz?",
		answer:
      "Evet, belirli ülkelere kargo hizmetimiz bulunmaktadır. Yurt dışı kargo ücretleri ve teslimat süreleri ülkeye göre değişiklik göstermektedir.",
		category: "siparis",
		icon: "🌍",
	},
	{
		id: "q10",
		question: "Hediye paketi seçeneğiniz var mı?",
		answer:
      "Evet, sepet sayfasında 'Hediye Paketi' seçeneğini işaretleyerek ürününüzün hediye paketi ile gönderilmesini sağlayabilirsiniz. Hediye paketi ücreti 10 TL'dir.",
		category: "siparis",
		icon: "🎁",
	},
];

export default function FAQPage() {
	const [searchQuery, setSearchQuery] = useState("");
	const [activeCategory, setActiveCategory] = useState("tumu");
	const [expandedFAQ, setExpandedFAQ] = useState(null);
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
	const [isVisible, setIsVisible] = useState({});

	useEffect(() => {
		const handleScroll = () => {
			const sections = ["header", "search", "categories", "faq-list", "contact"];
			sections.forEach((section) => {
				const element = document.getElementById(section);
				if (element) {
					const rect = element.getBoundingClientRect();
					const isInView = rect.top < window.innerHeight * 0.75 && rect.bottom >= 0;
					setIsVisible((prev) => ({ ...prev, [section]: isInView }));
				}
			});
		};

		window.addEventListener("scroll", handleScroll);
		handleScroll();
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const categories = [
		{ id: "tumu", name: "Tümü", color: "#3b82f6", icon: "🔍" },
		{ id: "siparis", name: "Sipariş", color: "#8b5cf6", icon: "📦" },
		{ id: "iade", name: "İade ve Değişim", color: "#ec4899", icon: "🔄" },
		{ id: "odeme", name: "Ödeme", color: "#10b981", icon: "💳" },
		{ id: "hesap", name: "Hesap", color: "#f59e0b", icon: "👤" },
	];

	// Arama ve kategori filtreleme
	const filteredFAQs = faqData.filter((faq) => {
		const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesCategory = activeCategory === "tumu" || faq.category === activeCategory;
		return matchesSearch && matchesCategory;
	});

	// Kategori rengini al
	const getCategoryColor = (categoryId) => {
		const category = categories.find((cat) => cat.id === categoryId);
		return category ? category.color : "#3b82f6";
	};

	// Animasyon varyantları
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	const itemVariants = {
		hidden: { y: 20, opacity: 0 },
		visible: {
			y: 0,
			opacity: 1,
			transition: { type: "spring", stiffness: 100 },
		},
	};

	const toggleFAQ = (id) => {
		setExpandedFAQ(expandedFAQ === id ? null : id);
	};

	return (
		<>
			<Navbar />
			<div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white overflow-hidden relative">
				{/* Animasyonlu arka plan parçacıkları */}
				<div className="absolute inset-0 overflow-hidden pointer-events-none">
					{[...Array(20)].map((_, i) => (
						<motion.div
							key={i}
							className="absolute rounded-full bg-opacity-20"
							style={{
								background: `radial-gradient(circle, ${getCategoryColor(activeCategory)}33 0%, transparent 70%)`,
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

				{/* Fare takibi efekti */}
				<motion.div
					className="hidden md:block absolute w-96 h-96 rounded-full pointer-events-none"
					style={{
						background: `radial-gradient(circle, ${getCategoryColor(activeCategory)}22 0%, transparent 70%)`,
						left: mousePosition.x - 192,
						top: mousePosition.y - 192,
					}}
					animate={{
						left: mousePosition.x - 192,
						top: mousePosition.y - 192,
					}}
					transition={{ type: "spring", damping: 30, stiffness: 200 }}
				/>

				{/* Ana içerik */}
				<div className="container mx-auto px-4 py-20 relative z-10 mt-20">
					{/* Başlık Bölümü */}
					<motion.div
						id="header"
						initial={{ opacity: 0, y: -20 }}
						animate={isVisible.header ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
						transition={{ duration: 0.5 }}
						className="text-center mb-16"
					>
						<motion.div
							initial={{ scale: 0.8, opacity: 0 }}
							animate={isVisible.header ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
							transition={{ delay: 0.2, type: "spring" }}
							className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1 mb-4 border border-white/10"
						>
							<HelpCircle className="h-4 w-4 text-blue-400" />
							<span className="text-sm font-medium">Yardım Merkezi</span>
						</motion.div>

						<motion.h1
							initial={{ opacity: 0, y: 20 }}
							animate={isVisible.header ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
							transition={{ delay: 0.3, duration: 0.5 }}
							className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400"
						>
              Sık Sorulan{" "}
							<span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500 relative">
                Sorular
								<motion.div
									className="absolute -top-6 -right-6 text-2xl"
									animate={{
										rotate: [0, 10, -10, 10, 0],
										scale: [1, 1.2, 1, 1.2, 1],
									}}
									transition={{
										duration: 2,
										repeat: Number.POSITIVE_INFINITY,
										repeatDelay: 3,
									}}
								>
									<Sparkles className="h-6 w-6 text-yellow-400 fill-yellow-400" />
								</motion.div>
							</span>
						</motion.h1>

						<motion.p
							initial={{ opacity: 0, y: 20 }}
							animate={isVisible.header ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
							transition={{ delay: 0.4, duration: 0.5 }}
							className="text-xl text-gray-300 max-w-3xl mx-auto"
						>
              Müşterilerimizin en çok sorduğu soruları ve cevaplarını burada bulabilirsiniz. Aradığınız cevabı
              bulamazsanız, lütfen bizimle iletişime geçin.
						</motion.p>
					</motion.div>

					{/* Arama Bölümü */}
					<motion.div
						id="search"
						initial={{ opacity: 0, y: 20 }}
						animate={isVisible.search ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
						transition={{ delay: 0.5, duration: 0.5 }}
						className="max-w-md mx-auto mb-12"
					>
						<div className="relative">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<Search className="h-5 w-5 text-blue-400" />
							</div>
							<motion.input
								whileFocus={{ boxShadow: `0 0 0 2px ${getCategoryColor(activeCategory)}` }}
								type="text"
								placeholder="Soru ara..."
								className="block w-full pl-10 pr-3 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:outline-none text-white placeholder-gray-400 transition-all"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>
					</motion.div>

					{/* Kategori Butonları */}
					<motion.div
						id="categories"
						variants={containerVariants}
						initial="hidden"
						animate={isVisible.categories ? "visible" : "hidden"}
						className="flex flex-wrap justify-center gap-2 mb-12"
					>
						{categories.map((category) => (
							<motion.button
								key={category.id}
								variants={itemVariants}
								whileHover={{ scale: 1.05, y: -5 }}
								whileTap={{ scale: 0.95 }}
								onClick={() => setActiveCategory(category.id)}
								className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
									activeCategory === category.id
										? "bg-white/20 text-white"
										: "bg-white/10 text-gray-300 hover:bg-white/15 hover:text-white"
								}`}
								style={activeCategory === category.id ? { boxShadow: `0 0 10px ${category.color}66` } : {}}
							>
								<span>{category.icon}</span>
								{category.name}
							</motion.button>
						))}
					</motion.div>

					{/* FAQ Listesi */}
					<motion.div
						id="faq-list"
						variants={containerVariants}
						initial="hidden"
						animate={isVisible["faq-list"] ? "visible" : "hidden"}
						className="max-w-3xl mx-auto"
					>
						{filteredFAQs.length > 0 ? (
							<div className="space-y-4">
								<AnimatePresence>
									{filteredFAQs.map((faq) => (
										<motion.div
											key={faq.id}
											variants={itemVariants}
											layout
											className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl overflow-hidden transition-all hover:bg-white/15"
											whileHover={{ y: -5, transition: { duration: 0.2 } }}
										>
											<motion.div className="p-4 cursor-pointer" onClick={() => toggleFAQ(faq.id)}>
												<div className="flex justify-between items-center">
													<div className="flex items-center gap-3">
														<div
															className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
															style={{ backgroundColor: `${getCategoryColor(faq.category)}33` }}
														>
															{faq.icon}
														</div>
														<h3 className="text-lg font-bold">{faq.question}</h3>
													</div>
													<motion.div
														animate={{ rotate: expandedFAQ === faq.id ? 90 : 0 }}
														transition={{ duration: 0.3 }}
													>
														<ChevronRight className="h-5 w-5 text-gray-400" />
													</motion.div>
												</div>

												<AnimatePresence>
													{expandedFAQ === faq.id && (
														<motion.div
															initial={{ opacity: 0, height: 0 }}
															animate={{ opacity: 1, height: "auto" }}
															exit={{ opacity: 0, height: 0 }}
															transition={{ duration: 0.3 }}
															className="mt-4 pt-4 border-t border-white/10"
														>
															<p className="text-gray-300">{faq.answer}</p>
														</motion.div>
													)}
												</AnimatePresence>
											</motion.div>
										</motion.div>
									))}
								</AnimatePresence>
							</div>
						) : (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								className="text-center py-12 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10"
							>
								<p className="text-gray-400">Aramanızla eşleşen soru bulunamadı.</p>
							</motion.div>
						)}
					</motion.div>

					{/* İletişim Bölümü */}
					<motion.div
						id="contact"
						initial={{ opacity: 0, y: 20 }}
						animate={isVisible.contact ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
						transition={{ delay: 0.8, duration: 0.5 }}
						className="mt-16 max-w-3xl mx-auto"
					>
						<div className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 backdrop-blur-xl rounded-xl p-8 border border-white/10 relative overflow-hidden">
							{/* Dekoratif elementler */}
							<motion.div
								className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500 rounded-full blur-3xl opacity-20"
								animate={{
									scale: [1, 1.2, 1],
									opacity: [0.2, 0.3, 0.2],
								}}
								transition={{
									duration: 4,
									repeat: Number.POSITIVE_INFINITY,
									repeatType: "reverse",
								}}
							></motion.div>

							<motion.div
								className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-500 rounded-full blur-3xl opacity-20"
								animate={{
									scale: [1, 1.2, 1],
									opacity: [0.2, 0.3, 0.2],
								}}
								transition={{
									duration: 5,
									repeat: Number.POSITIVE_INFINITY,
									repeatType: "reverse",
								}}
							></motion.div>

							<div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
								<div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
									<MessageCircle className="h-8 w-8 text-white" />
								</div>
								<div className="flex-1 text-center md:text-left">
									<h3 className="text-xl font-bold mb-2">Aradığınız cevabı bulamadınız mı?</h3>
									<p className="text-gray-300 mb-4">
                    Sorularınız için müşteri hizmetlerimizle iletişime geçebilirsiniz.
									</p>
									<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
										<Link
											href="https://discord.gg/"
											target="_blank"
											rel="noopener noreferrer"
											className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-600/20 border border-blue-500/20"
										>
                      Bize Ulaşın
											<ArrowRight className="h-4 w-4" />
										</Link>
									</motion.div>
								</div>
							</div>
						</div>
					</motion.div>
				</div>

				{/* Süsleme Elementleri */}
				<div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
					<div
						className="absolute top-0 left-0 w-full h-64 opacity-30"
						style={{
							background: `linear-gradient(to right, ${categories[0].color}22, ${categories[1].color}22, ${categories[2].color}22)`,
							filter: "blur(100px)",
						}}
					/>
					<div
						className="absolute bottom-0 right-0 w-full h-64 opacity-30"
						style={{
							background: `linear-gradient(to left, ${categories[0].color}22, ${categories[1].color}22, ${categories[2].color}22)`,
							filter: "blur(100px)",
						}}
					/>
				</div>

				{/* Scroll to top button */}
				<motion.button
					className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg z-50 border border-blue-500/20"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.9 }}
					onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
					</svg>
				</motion.button>
			</div>
			<Footer />
		</>
	);
}

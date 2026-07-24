import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { Link, Links, Meta, Outlet, Scripts, ScrollRestoration, ServerRouter, UNSAFE_withComponentProps, useLocation, useNavigate, useOutletContext, useSearchParams } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Heart, ShoppingBag, ShoppingCart, Star, Trash2, User } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
//#region node_modules/@react-router/dev/dist/config/defaults/entry.server.node.tsx
var entry_server_node_exports = /* @__PURE__ */ __exportAll({
	default: () => handleRequest,
	streamTimeout: () => streamTimeout
});
var streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
	if (request.method.toUpperCase() === "HEAD") return new Response(null, {
		status: responseStatusCode,
		headers: responseHeaders
	});
	return new Promise((resolve, reject) => {
		let shellRendered = false;
		let userAgent = request.headers.get("user-agent");
		let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
		let timeoutId = setTimeout(() => abort(), 6e3);
		const { pipe, abort } = renderToPipeableStream(/* @__PURE__ */ jsx(ServerRouter, {
			context: routerContext,
			url: request.url
		}), {
			[readyOption]() {
				shellRendered = true;
				const body = new PassThrough({ final(callback) {
					clearTimeout(timeoutId);
					timeoutId = void 0;
					callback();
				} });
				const stream = createReadableStreamFromReadable(body);
				responseHeaders.set("Content-Type", "text/html");
				pipe(body);
				resolve(new Response(stream, {
					headers: responseHeaders,
					status: responseStatusCode
				}));
			},
			onShellError(error) {
				reject(error);
			},
			onError(error) {
				responseStatusCode = 500;
				if (shellRendered) console.error(error);
			}
		});
	});
}
//#endregion
//#region app/context/AuthContext.tsx
var AuthContext = createContext(void 0);
function AuthProvider({ children }) {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [user, setUser] = useState(null);
	const login = async (email, password) => {
		try {
			const response = await fetch("http://localhost:5000/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email,
					password
				})
			});
			const data = await response.json();
			if (response.ok) {
				setIsAuthenticated(true);
				setUser({
					name: `${data.user.firstName} ${data.user.lastName}`.trim() || data.user.name,
					email: data.user.email,
					phone: data.user.phone || "+91 XXXXX XXXXX",
					imageUrl: data.user.imageUrl || "https://avatar.vercel.sh/" + data.user.email,
					isPremium: data.user.isPremium || false
				});
				return true;
			}
			alert(data.message);
			return false;
		} catch (error) {
			console.error("Failed to connect to backend:", error);
			return false;
		}
	};
	const requestOtp = async (firstName, lastName, email, password) => {
		try {
			const response = await fetch("http://localhost:5000/api/auth/request-otp", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					firstName,
					lastName,
					email,
					password
				})
			});
			const data = await response.json();
			if (response.ok) return {
				success: true,
				message: data.message
			};
			return {
				success: false,
				message: data.message || "Unable to send OTP."
			};
		} catch (error) {
			console.error("Failed to connect to backend:", error);
			return {
				success: false,
				message: "Unable to connect to the server."
			};
		}
	};
	const verifyOtp = async (email, otp) => {
		try {
			const response = await fetch("http://localhost:5000/api/auth/verify-otp", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email,
					otp
				})
			});
			const data = await response.json();
			if (response.ok) {
				setIsAuthenticated(true);
				setUser({
					name: `${data.user.firstName} ${data.user.lastName}`.trim() || data.user.name,
					email: data.user.email,
					phone: data.user.phone || "+91 XXXXX XXXXX",
					imageUrl: data.user.imageUrl || "https://avatar.vercel.sh/" + data.user.email,
					isPremium: data.user.isPremium || false
				});
				return {
					success: true,
					message: data.message
				};
			}
			return {
				success: false,
				message: data.message || "Verification failed."
			};
		} catch (error) {
			console.error("Failed to connect to backend:", error);
			return {
				success: false,
				message: "Unable to connect to the server."
			};
		}
	};
	const updateProfile = (updatedData) => {
		if (user) setUser({
			...user,
			...updatedData
		});
	};
	const logout = () => {
		setIsAuthenticated(false);
		setUser(null);
	};
	return /* @__PURE__ */ jsx(AuthContext.Provider, {
		value: {
			isAuthenticated,
			user,
			login,
			requestOtp,
			verifyOtp,
			logout,
			updateProfile
		},
		children
	});
}
function useAuth() {
	const context = useContext(AuthContext);
	if (!context) throw new Error("useAuth must be used within an AuthProvider");
	return context;
}
//#endregion
//#region app/components/UI/SearchBar.tsx
var TRENDING_SEARCHES = [
	"Vintage Leather Jacket",
	"Nike Dunks",
	"Levis 501",
	"Y2K Tops"
];
function SearchBar() {
	const [query, setQuery] = useState("");
	const [isOpen, setIsOpen] = useState(false);
	const [recentSearches, setRecentSearches] = useState([]);
	const searchRef = useRef(null);
	const navigate = useNavigate();
	useEffect(() => {
		const saved = localStorage.getItem("value-village-recent-searches");
		if (saved) setRecentSearches(JSON.parse(saved));
	}, []);
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (searchRef.current && !searchRef.current.contains(event.target)) setIsOpen(false);
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);
	const handleSearch = (searchTerm) => {
		if (!searchTerm.trim()) return;
		const newRecents = [searchTerm, ...recentSearches.filter((s) => s !== searchTerm)].slice(0, 5);
		setRecentSearches(newRecents);
		localStorage.setItem("value-village-recent-searches", JSON.stringify(newRecents));
		setIsOpen(false);
		navigate(`/shop?search=${encodeURIComponent(searchTerm)}`);
	};
	const onKeyDown = (e) => {
		if (e.key === "Enter") handleSearch(query);
	};
	const clearRecents = (e) => {
		e.stopPropagation();
		setRecentSearches([]);
		localStorage.removeItem("value-village-recent-searches");
	};
	return /* @__PURE__ */ jsxs("div", {
		ref: searchRef,
		style: {
			position: "relative",
			width: "300px"
		},
		children: [/* @__PURE__ */ jsxs("div", {
			style: { position: "relative" },
			children: [/* @__PURE__ */ jsx("input", {
				type: "text",
				value: query,
				onChange: (e) => setQuery(e.target.value),
				onFocus: () => setIsOpen(true),
				onKeyDown,
				placeholder: "Search items, brands...",
				style: {
					width: "100%",
					padding: "10px 16px 10px 40px",
					borderRadius: "24px",
					border: `1px solid ${isOpen ? "var(--brown)" : "var(--border-color)"}`,
					backgroundColor: "var(--bg-surface)",
					color: "var(--text-main)",
					outline: "none",
					transition: "all 0.2s ease"
				}
			}), /* @__PURE__ */ jsxs("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "var(--text-muted)",
				strokeWidth: "2",
				strokeLinecap: "round",
				strokeLinejoin: "round",
				style: {
					position: "absolute",
					left: "12px",
					top: "50%",
					transform: "translateY(-50%)",
					width: "18px",
					height: "18px"
				},
				children: [/* @__PURE__ */ jsx("circle", {
					cx: "11",
					cy: "11",
					r: "8"
				}), /* @__PURE__ */ jsx("line", {
					x1: "21",
					y1: "21",
					x2: "16.65",
					y2: "16.65"
				})]
			})]
		}), isOpen && /* @__PURE__ */ jsxs("div", {
			style: {
				position: "absolute",
				top: "100%",
				left: 0,
				right: 0,
				marginTop: "8px",
				backgroundColor: "var(--bg-surface)",
				border: "1px solid var(--border-color)",
				borderRadius: "12px",
				boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
				zIndex: 50,
				overflow: "hidden"
			},
			children: [
				recentSearches.length > 0 && /* @__PURE__ */ jsxs("div", {
					style: { padding: "16px" },
					children: [/* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							marginBottom: "8px"
						},
						children: [/* @__PURE__ */ jsx("span", {
							style: {
								fontSize: "12px",
								fontWeight: 700,
								color: "var(--text-muted)",
								textTransform: "uppercase",
								letterSpacing: "0.5px"
							},
							children: "Recent"
						}), /* @__PURE__ */ jsx("button", {
							onClick: clearRecents,
							style: {
								background: "none",
								border: "none",
								color: "var(--text-muted)",
								fontSize: "12px",
								cursor: "pointer",
								textDecoration: "underline"
							},
							children: "Clear"
						})]
					}), /* @__PURE__ */ jsx("div", {
						style: {
							display: "flex",
							flexDirection: "column",
							gap: "4px"
						},
						children: recentSearches.map((term) => /* @__PURE__ */ jsxs("div", {
							onClick: () => handleSearch(term),
							style: {
								padding: "8px",
								cursor: "pointer",
								borderRadius: "6px",
								display: "flex",
								alignItems: "center",
								gap: "8px",
								color: "var(--text-main)"
							},
							onMouseOver: (e) => e.currentTarget.style.backgroundColor = "var(--bg-base)",
							onMouseOut: (e) => e.currentTarget.style.backgroundColor = "transparent",
							children: [/* @__PURE__ */ jsx("span", {
								style: { color: "var(--text-muted)" },
								children: "🕒"
							}), term]
						}, term))
					})]
				}),
				recentSearches.length > 0 && /* @__PURE__ */ jsx("hr", { style: {
					border: "none",
					borderTop: "1px solid var(--border-color)",
					margin: 0
				} }),
				/* @__PURE__ */ jsxs("div", {
					style: { padding: "16px" },
					children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontSize: "12px",
							fontWeight: 700,
							color: "var(--text-muted)",
							textTransform: "uppercase",
							letterSpacing: "0.5px",
							marginBottom: "12px"
						},
						children: "Trending Right Now"
					}), /* @__PURE__ */ jsx("div", {
						style: {
							display: "flex",
							flexWrap: "wrap",
							gap: "8px"
						},
						children: TRENDING_SEARCHES.map((term) => /* @__PURE__ */ jsxs("button", {
							onClick: () => handleSearch(term),
							style: {
								padding: "6px 12px",
								borderRadius: "16px",
								border: "1px solid var(--border-color)",
								backgroundColor: "var(--bg-base)",
								color: "var(--text-main)",
								fontSize: "13px",
								cursor: "pointer",
								transition: "all 0.2s ease"
							},
							onMouseOver: (e) => e.currentTarget.style.borderColor = "var(--brown)",
							onMouseOut: (e) => e.currentTarget.style.borderColor = "var(--border-color)",
							children: ["🔥 ", term]
						}, term))
					})]
				})
			]
		})]
	});
}
//#endregion
//#region app/components/UI/UserProfileSidebar.tsx
function UserProfileSidebar({ isOpen, onClose, user, onLogout, onSaveProfile }) {
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState({
		name: user.name,
		email: user.email,
		phone: user.phone
	});
	const handleSave = () => {
		onSaveProfile(formData);
		setIsEditing(false);
	};
	return /* @__PURE__ */ jsx(AnimatePresence, { children: isOpen && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(motion.div, {
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		exit: { opacity: 0 },
		onClick: onClose,
		style: {
			position: "fixed",
			top: 0,
			left: 0,
			width: "100vw",
			height: "100vh",
			backgroundColor: "rgba(0, 0, 0, 0.4)",
			zIndex: 998,
			backdropFilter: "blur(2px)"
		}
	}), /* @__PURE__ */ jsxs(motion.div, {
		initial: { x: "100%" },
		animate: { x: 0 },
		exit: { x: "100%" },
		transition: {
			type: "spring",
			damping: 25,
			stiffness: 200
		},
		style: {
			position: "fixed",
			top: 0,
			right: 0,
			width: "100%",
			maxWidth: "400px",
			height: "100vh",
			backgroundColor: "var(--color-bg)",
			boxShadow: "-4px 0 15px rgba(0,0,0,0.1)",
			zIndex: 999,
			display: "flex",
			flexDirection: "column",
			padding: "var(--spacing-lg)"
		},
		children: [
			/* @__PURE__ */ jsxs("div", {
				style: {
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					marginBottom: "var(--spacing-lg)"
				},
				children: [/* @__PURE__ */ jsx("h2", {
					style: {
						margin: 0,
						fontFamily: "var(--font-family-headings)",
						fontSize: "var(--size-h3)"
					},
					children: "Account"
				}), /* @__PURE__ */ jsx("button", {
					onClick: onClose,
					style: {
						background: "none",
						border: "none",
						cursor: "pointer",
						fontSize: "1.5rem",
						color: "var(--color-text-muted)"
					},
					children: "✕"
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				style: {
					flex: 1,
					display: "flex",
					flexDirection: "column",
					gap: "var(--spacing-md)"
				},
				children: [
					/* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							alignItems: "center",
							gap: "var(--spacing-md)"
						},
						children: [/* @__PURE__ */ jsx("img", {
							src: user.imageUrl || "https://via.placeholder.com/80",
							alt: "Profile",
							style: {
								width: "80px",
								height: "80px",
								borderRadius: "50%",
								objectFit: "cover",
								border: "2px solid var(--color-border)"
							}
						}), /* @__PURE__ */ jsx("div", { children: user.isPremium ? /* @__PURE__ */ jsx("span", {
							style: {
								backgroundColor: "var(--color-primary)",
								color: "white",
								padding: "4px 12px",
								borderRadius: "20px",
								fontSize: "var(--size-sm)",
								fontWeight: "bold"
							},
							children: "✨ Premium Member"
						}) : /* @__PURE__ */ jsx("span", {
							style: {
								backgroundColor: "var(--color-border)",
								color: "var(--color-text-muted)",
								padding: "4px 12px",
								borderRadius: "20px",
								fontSize: "var(--size-sm)"
							},
							children: "Standard Plan"
						}) })]
					}),
					/* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							flexDirection: "column",
							gap: "var(--spacing-sm)",
							marginTop: "var(--spacing-md)"
						},
						children: [
							/* @__PURE__ */ jsx("label", {
								style: {
									fontSize: "var(--size-sm)",
									color: "var(--color-text-muted)",
									fontWeight: "bold"
								},
								children: "Name"
							}),
							isEditing ? /* @__PURE__ */ jsx("input", {
								value: formData.name,
								onChange: (e) => setFormData({
									...formData,
									name: e.target.value
								}),
								style: {
									padding: "8px",
									borderRadius: "var(--radius-sm)",
									border: "1px solid var(--color-border)",
									fontFamily: "var(--font-family-body)"
								}
							}) : /* @__PURE__ */ jsx("p", {
								style: {
									margin: 0,
									fontSize: "var(--size-body)",
									color: "var(--color-text-main)"
								},
								children: user.name
							}),
							/* @__PURE__ */ jsx("label", {
								style: {
									fontSize: "var(--size-sm)",
									color: "var(--color-text-muted)",
									fontWeight: "bold",
									marginTop: "8px"
								},
								children: "Email"
							}),
							isEditing ? /* @__PURE__ */ jsx("input", {
								value: formData.email,
								onChange: (e) => setFormData({
									...formData,
									email: e.target.value
								}),
								style: {
									padding: "8px",
									borderRadius: "var(--radius-sm)",
									border: "1px solid var(--color-border)",
									fontFamily: "var(--font-family-body)"
								}
							}) : /* @__PURE__ */ jsx("p", {
								style: {
									margin: 0,
									fontSize: "var(--size-body)",
									color: "var(--color-text-main)"
								},
								children: user.email
							}),
							/* @__PURE__ */ jsx("label", {
								style: {
									fontSize: "var(--size-sm)",
									color: "var(--color-text-muted)",
									fontWeight: "bold",
									marginTop: "8px"
								},
								children: "Phone"
							}),
							isEditing ? /* @__PURE__ */ jsx("input", {
								value: formData.phone,
								onChange: (e) => setFormData({
									...formData,
									phone: e.target.value
								}),
								style: {
									padding: "8px",
									borderRadius: "var(--radius-sm)",
									border: "1px solid var(--color-border)",
									fontFamily: "var(--font-family-body)"
								}
							}) : /* @__PURE__ */ jsx("p", {
								style: {
									margin: 0,
									fontSize: "var(--size-body)",
									color: "var(--color-text-main)"
								},
								children: user.phone
							})
						]
					}),
					/* @__PURE__ */ jsx("div", {
						style: { marginTop: "var(--spacing-lg)" },
						children: isEditing ? /* @__PURE__ */ jsxs("div", {
							style: {
								display: "flex",
								gap: "10px"
							},
							children: [/* @__PURE__ */ jsx("button", {
								onClick: handleSave,
								style: {
									flex: 1,
									padding: "10px",
									backgroundColor: "var(--color-primary)",
									color: "white",
									border: "none",
									borderRadius: "var(--radius-md)",
									cursor: "pointer",
									fontWeight: "bold"
								},
								children: "Save Changes"
							}), /* @__PURE__ */ jsx("button", {
								onClick: () => setIsEditing(false),
								style: {
									padding: "10px",
									backgroundColor: "transparent",
									color: "var(--color-text-muted)",
									border: "1px solid var(--color-border)",
									borderRadius: "var(--radius-md)",
									cursor: "pointer"
								},
								children: "Cancel"
							})]
						}) : /* @__PURE__ */ jsx("button", {
							onClick: () => setIsEditing(true),
							style: {
								width: "100%",
								padding: "10px",
								backgroundColor: "transparent",
								color: "var(--color-text-main)",
								border: "1px solid var(--color-border)",
								borderRadius: "var(--radius-md)",
								cursor: "pointer",
								fontWeight: "bold",
								transition: "var(--transition-fast)"
							},
							children: "Edit Profile"
						})
					})
				]
			}),
			/* @__PURE__ */ jsx("div", {
				style: {
					borderTop: "1px solid var(--color-border)",
					paddingTop: "var(--spacing-md)"
				},
				children: /* @__PURE__ */ jsx("button", {
					onClick: onLogout,
					style: {
						width: "100%",
						padding: "12px",
						backgroundColor: "#fee2e2",
						color: "#ef4444",
						border: "none",
						borderRadius: "var(--radius-md)",
						cursor: "pointer",
						fontWeight: "bold",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						gap: "8px"
					},
					children: "Log Out"
				})
			})
		]
	})] }) });
}
//#endregion
//#region app/components/layout/Navbar.tsx
function Navbar() {
	const { user, logout, updateProfile } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const handleProfileClick = () => {
		if (user) setIsSidebarOpen(true);
		else navigate("/login", { state: { from: location.pathname } });
	};
	const handleSaveProfile = async (updatedData) => {
		if (updateProfile) updateProfile(updatedData);
		console.log("Sending to backend to save:", updatedData);
	};
	const handleLogout = () => {
		console.log("Logging out...");
		setIsSidebarOpen(false);
		logout();
		navigate("/");
	};
	if (location.pathname.startsWith("/admin")) return null;
	const closeMenu = () => setIsMenuOpen(false);
	return /* @__PURE__ */ jsxs("nav", { children: [
		/* @__PURE__ */ jsx("button", {
			className: "hamburger",
			onClick: () => setIsMenuOpen(!isMenuOpen),
			"aria-label": "Toggle navigation",
			children: isMenuOpen ? "✕" : "☰"
		}),
		/* @__PURE__ */ jsxs(Link, {
			to: "/",
			className: "nav-logo",
			onClick: closeMenu,
			style: { textDecoration: "none" },
			children: ["VALUE VILLAGE", /* @__PURE__ */ jsx("span", {
				className: "nav-logo-tag",
				children: "Thrift & Resale"
			})]
		}),
		/* @__PURE__ */ jsxs("div", {
			className: `nav-links ${isMenuOpen ? "open" : ""}`,
			children: [
				/* @__PURE__ */ jsx(Link, {
					to: "/",
					className: "nav-link",
					onClick: closeMenu,
					children: "Home"
				}),
				/* @__PURE__ */ jsx(Link, {
					to: "/shop",
					className: "nav-link",
					onClick: closeMenu,
					children: "Shop"
				}),
				/* @__PURE__ */ jsx(Link, {
					to: "/about",
					className: "nav-link",
					onClick: closeMenu,
					children: "About"
				})
			]
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "nav-icons",
			style: {
				display: "flex",
				alignItems: "center",
				gap: "16px"
			},
			children: [
				/* @__PURE__ */ jsx(SearchBar, {}),
				/* @__PURE__ */ jsx(Link, {
					to: "/wishlist",
					className: "nav-icon",
					title: "Wishlist",
					onClick: closeMenu,
					style: { textDecoration: "none" },
					children: "🤍"
				}),
				/* @__PURE__ */ jsxs(Link, {
					to: "/cart",
					className: "nav-icon",
					title: "Cart",
					onClick: closeMenu,
					style: {
						position: "relative",
						textDecoration: "none"
					},
					children: [/* @__PURE__ */ jsx(ShoppingBag, {}), /* @__PURE__ */ jsx("span", {
						className: "cart-badge",
						children: "2"
					})]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "nav-icon",
					title: "Account",
					onClick: handleProfileClick,
					style: { cursor: "pointer" },
					children: user ? /* @__PURE__ */ jsx(User, { fill: "currentColor" }) : /* @__PURE__ */ jsx(User, {})
				})
			]
		}),
		user && /* @__PURE__ */ jsx(UserProfileSidebar, {
			isOpen: isSidebarOpen,
			onClose: () => setIsSidebarOpen(false),
			user,
			onSaveProfile: handleSaveProfile,
			onLogout: handleLogout
		})
	] });
}
//#endregion
//#region app/components/layout/Footer.tsx
function Footer() {
	if (useLocation().pathname.startsWith("/admin")) return null;
	return /* @__PURE__ */ jsxs("footer", { children: [/* @__PURE__ */ jsxs("div", {
		className: "footer-top",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "footer-brand",
				children: [/* @__PURE__ */ jsx("div", {
					className: "footer-logo-f",
					children: "VALUE VILLAGE"
				}), /* @__PURE__ */ jsx("div", {
					className: "footer-tagline",
					children: "Kerala's favourite thrift and resale destination. Pre-loved fashion at prices you'll love."
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "footer-col",
				children: [/* @__PURE__ */ jsx("div", {
					className: "footer-col-title",
					children: "Shop"
				}), /* @__PURE__ */ jsxs("div", {
					className: "footer-links",
					children: [
						/* @__PURE__ */ jsx(Link, {
							to: "/shop",
							className: "footer-link",
							style: { textDecoration: "none" },
							children: "Women's"
						}),
						/* @__PURE__ */ jsx(Link, {
							to: "/shop",
							className: "footer-link",
							style: { textDecoration: "none" },
							children: "Men's"
						}),
						/* @__PURE__ */ jsx(Link, {
							to: "/shop",
							className: "footer-link",
							style: { textDecoration: "none" },
							children: "Vintage"
						}),
						/* @__PURE__ */ jsx(Link, {
							to: "/shop",
							className: "footer-link",
							style: { textDecoration: "none" },
							children: "Shoes"
						})
					]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "footer-col",
				children: [/* @__PURE__ */ jsx("div", {
					className: "footer-col-title",
					children: "Orders"
				}), /* @__PURE__ */ jsxs("div", {
					className: "footer-links",
					children: [
						/* @__PURE__ */ jsx(Link, {
							to: "/tracking",
							className: "footer-link",
							style: { textDecoration: "none" },
							children: "Track Order"
						}),
						/* @__PURE__ */ jsx(Link, {
							to: "/returns",
							className: "footer-link",
							style: { textDecoration: "none" },
							children: "Returns"
						}),
						/* @__PURE__ */ jsx("span", {
							className: "footer-link",
							children: "Size Guide"
						}),
						/* @__PURE__ */ jsx("span", {
							className: "footer-link",
							children: "Help Centre"
						})
					]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "footer-col",
				children: [/* @__PURE__ */ jsx("div", {
					className: "footer-col-title",
					children: "Company"
				}), /* @__PURE__ */ jsxs("div", {
					className: "footer-links",
					children: [
						/* @__PURE__ */ jsx(Link, {
							to: "/about",
							className: "footer-link",
							style: { textDecoration: "none" },
							children: "About Us"
						}),
						/* @__PURE__ */ jsx("span", {
							className: "footer-link",
							children: "Sell With Us"
						}),
						/* @__PURE__ */ jsx("span", {
							className: "footer-link",
							children: "Careers"
						}),
						/* @__PURE__ */ jsx("span", {
							className: "footer-link",
							children: "Press"
						})
					]
				})]
			})
		]
	}), /* @__PURE__ */ jsxs("div", {
		className: "footer-bottom",
		style: {
			display: "flex",
			flexWrap: "wrap",
			gap: "16px"
		},
		children: [/* @__PURE__ */ jsx("div", {
			className: "footer-copy",
			children: "© 2026 Value Village Thrift & Resale. All rights reserved."
		}), /* @__PURE__ */ jsx("div", {
			style: {
				display: "flex",
				alignItems: "center",
				gap: "24px"
			},
			children: /* @__PURE__ */ jsxs("div", {
				style: {
					display: "flex",
					gap: "16px",
					alignItems: "center"
				},
				children: [
					/* @__PURE__ */ jsx("a", {
						href: "https://instagram.com",
						target: "_blank",
						rel: "noreferrer",
						className: "footer-link",
						"aria-label": "Instagram",
						children: /* @__PURE__ */ jsxs("svg", {
							xmlns: "http://www.w3.org/2000/svg",
							width: "20",
							height: "20",
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							strokeWidth: "2",
							strokeLinecap: "round",
							strokeLinejoin: "round",
							children: [
								/* @__PURE__ */ jsx("rect", {
									width: "20",
									height: "20",
									x: "2",
									y: "2",
									rx: "5",
									ry: "5"
								}),
								/* @__PURE__ */ jsx("path", { d: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" }),
								/* @__PURE__ */ jsx("line", {
									x1: "17.5",
									x2: "17.51",
									y1: "6.5",
									y2: "6.5"
								})
							]
						})
					}),
					/* @__PURE__ */ jsx("a", {
						href: "https://facebook.com",
						target: "_blank",
						rel: "noreferrer",
						className: "footer-link",
						"aria-label": "Facebook",
						children: /* @__PURE__ */ jsx("svg", {
							xmlns: "http://www.w3.org/2000/svg",
							width: "20",
							height: "20",
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							strokeWidth: "2",
							strokeLinecap: "round",
							strokeLinejoin: "round",
							children: /* @__PURE__ */ jsx("path", { d: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" })
						})
					}),
					/* @__PURE__ */ jsx("a", {
						href: "https://wa.me/",
						target: "_blank",
						rel: "noreferrer",
						className: "footer-link",
						"aria-label": "WhatsApp",
						children: /* @__PURE__ */ jsxs("svg", {
							xmlns: "http://www.w3.org/2000/svg",
							width: "20",
							height: "20",
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							strokeWidth: "2",
							strokeLinecap: "round",
							strokeLinejoin: "round",
							children: [/* @__PURE__ */ jsx("path", { d: "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" }), /* @__PURE__ */ jsx("path", { d: "m16.9 15.4-3.1-1.3-1.4 1.7a10.6 10.6 0 0 1-5.6-5.6l1.7-1.4-1.3-3.1A1 1 0 0 0 6 5.4c-1.3.4-2.2 1.9-2 3.4a13.3 13.3 0 0 0 11.2 11.2c1.5.2 3-.7 3.4-2a1 1 0 0 0-1.7-2.6z" })]
						})
					})
				]
			})
		})]
	})] });
}
//#endregion
//#region app/context/WishlistContext.tsx
var WishlistContext = createContext(void 0);
function WishlistProvider({ children }) {
	const [wishlistItems, setWishlistItems] = useState([]);
	const toggleWishlist = (product) => {
		setWishlistItems((prev) => {
			if (prev.find((item) => item._id === product._id)) return prev.filter((item) => item._id !== product._id);
			return [...prev, product];
		});
	};
	const isInWishlist = (id) => {
		return wishlistItems.some((item) => item._id === id);
	};
	return /* @__PURE__ */ jsx(WishlistContext.Provider, {
		value: {
			wishlistItems,
			toggleWishlist,
			isInWishlist
		},
		children
	});
}
function useWishlist() {
	const context = useContext(WishlistContext);
	if (!context) throw new Error("useWishlist must be used within a WishlistProvider");
	return context;
}
//#endregion
//#region app/components/UI/ChatBot.tsx
function Chatbot() {
	const { user } = useAuth();
	const [isOpen, setIsOpen] = useState(false);
	const [messages, setMessages] = useState([{
		id: "1",
		sender: "bot",
		text: "Hi! How can I help you today?"
	}]);
	const [dynamicFAQ, setDynamicFAQ] = useState([]);
	useEffect(() => {
		const fetchFAQ = async () => {
			try {
				const response = await fetch("http://localhost:5000/api/chat/faqs");
				if (response.ok) setDynamicFAQ(await response.json());
			} catch (error) {
				console.error("Failed to fetch FAQ data", error);
			}
		};
		fetchFAQ();
	}, []);
	const handleQuestionClick = async (qaPair) => {
		const userMsg = {
			id: Date.now().toString(),
			sender: "user",
			text: qaPair.question
		};
		const botMsgId = (Date.now() + 1).toString();
		setMessages((prev) => [
			...prev,
			userMsg,
			{
				id: botMsgId,
				sender: "bot",
				text: "Typing..."
			}
		]);
		try {
			const response = await fetch("http://localhost:5000/api/chat/log", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					userId: user?.id,
					question: qaPair.question,
					answer: qaPair.answer
				})
			});
			if (response.ok) {
				const data = await response.json();
				setMessages((prev) => prev.map((msg) => msg.id === botMsgId ? {
					...msg,
					text: qaPair.answer,
					dbLogId: data.logId
				} : msg));
			} else throw new Error("Failed to log chat");
		} catch (error) {
			console.error("Failed to log chat");
			setMessages((prev) => prev.map((msg) => msg.id === botMsgId ? {
				...msg,
				text: qaPair.answer
			} : msg));
		}
	};
	const submitFeedback = async (dbLogId, localMsgId, feedback) => {
		setMessages((prev) => prev.map((msg) => msg.id === localMsgId ? {
			...msg,
			feedbackGiven: true
		} : msg));
		try {
			await fetch(`http://localhost:5000/api/chat/feedback/${dbLogId}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ feedback })
			});
		} catch (error) {
			console.error("Failed to send feedback");
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		style: {
			position: "fixed",
			bottom: "24px",
			right: "24px",
			zIndex: 999
		},
		children: [!isOpen && /* @__PURE__ */ jsx("button", {
			onClick: () => setIsOpen(true),
			style: {
				width: "60px",
				height: "60px",
				borderRadius: "50%",
				backgroundColor: "var(--white)",
				color: "#ff0505",
				border: "2px solid #ff0505",
				cursor: "pointer",
				boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
				fontSize: "24px"
			},
			children: "          💬"
		}), isOpen && /* @__PURE__ */ jsxs("div", {
			style: {
				width: "320px",
				height: "480px",
				backgroundColor: "var(--bg-surface)",
				border: "1px solid var(--border-color)",
				borderRadius: "12px",
				display: "flex",
				flexDirection: "column",
				boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
				overflow: "hidden"
			},
			children: [
				/* @__PURE__ */ jsxs("div", {
					style: {
						padding: "16px",
						backgroundColor: "var(--brown)",
						color: "#fff",
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center"
					},
					children: [/* @__PURE__ */ jsx("h3", {
						style: {
							margin: 0,
							fontSize: "16px",
							fontWeight: 600
						},
						children: "Support Bot"
					}), /* @__PURE__ */ jsx("button", {
						onClick: () => setIsOpen(false),
						style: {
							background: "none",
							border: "none",
							color: "#fff",
							cursor: "pointer",
							fontSize: "16px"
						},
						children: "✖"
					})]
				}),
				/* @__PURE__ */ jsx("div", {
					style: {
						flexGrow: 1,
						padding: "16px",
						overflowY: "auto",
						display: "flex",
						flexDirection: "column",
						gap: "12px"
					},
					children: messages.map((msg) => /* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							flexDirection: "column",
							alignItems: msg.sender === "user" ? "flex-end" : "flex-start"
						},
						children: [
							/* @__PURE__ */ jsx("div", {
								style: {
									maxWidth: "85%",
									padding: "10px 14px",
									borderRadius: "16px",
									fontSize: "14px",
									lineHeight: "1.4",
									backgroundColor: msg.sender === "user" ? "var(--brown)" : "var(--bg-base)",
									color: msg.sender === "user" ? "#fff" : "var(--text-main)",
									borderBottomRightRadius: msg.sender === "user" ? "4px" : "16px",
									borderBottomLeftRadius: msg.sender === "bot" ? "4px" : "16px"
								},
								children: msg.text
							}),
							msg.sender === "bot" && msg.dbLogId && !msg.feedbackGiven && /* @__PURE__ */ jsxs("div", {
								style: {
									display: "flex",
									gap: "8px",
									marginTop: "6px",
									marginLeft: "4px"
								},
								children: [/* @__PURE__ */ jsx("button", {
									onClick: () => submitFeedback(msg.dbLogId, msg.id, "good"),
									style: {
										fontSize: "12px",
										padding: "4px 8px",
										borderRadius: "12px",
										border: "1px solid var(--border-color)",
										background: "transparent",
										color: "var(--text-muted)",
										cursor: "pointer"
									},
									children: "👍"
								}), /* @__PURE__ */ jsx("button", {
									onClick: () => submitFeedback(msg.dbLogId, msg.id, "bad"),
									style: {
										fontSize: "12px",
										padding: "4px 8px",
										borderRadius: "12px",
										border: "1px solid var(--border-color)",
										background: "transparent",
										color: "var(--text-muted)",
										cursor: "pointer"
									},
									children: "👎"
								})]
							}),
							msg.feedbackGiven && /* @__PURE__ */ jsx("span", {
								style: {
									fontSize: "11px",
									color: "var(--text-muted)",
									marginTop: "4px",
									marginLeft: "4px"
								},
								children: "Thanks for the feedback!"
							})
						]
					}, msg.id))
				}),
				/* @__PURE__ */ jsxs("div", {
					style: {
						padding: "16px",
						borderTop: "1px solid var(--border-color)",
						backgroundColor: "var(--bg-base)",
						display: "flex",
						flexDirection: "column",
						gap: "8px"
					},
					children: [/* @__PURE__ */ jsx("span", {
						style: {
							fontSize: "12px",
							color: "var(--text-muted)",
							fontWeight: 600
						},
						children: "Ask a question:"
					}), dynamicFAQ.length === 0 ? /* @__PURE__ */ jsx("span", {
						style: {
							fontSize: "12px",
							color: "var(--text-muted)"
						},
						children: "Loading options..."
					}) : dynamicFAQ.map((item, idx) => /* @__PURE__ */ jsx("button", {
						onClick: () => handleQuestionClick(item),
						style: {},
						children: item.question
					}, idx))]
				})
			]
		})]
	});
}
//#endregion
//#region app/context/CartContext.tsx
var CartContext = createContext(void 0);
function CartProvider({ children }) {
	const [cartItems, setCartItems] = useState([]);
	const [isLoaded, setIsLoaded] = useState(false);
	useEffect(() => {
		const savedCart = localStorage.getItem("value-village-cart");
		if (savedCart) try {
			setCartItems(JSON.parse(savedCart));
		} catch (error) {
			console.error("Failed to parse cart data");
		}
		setIsLoaded(true);
	}, []);
	useEffect(() => {
		if (isLoaded) localStorage.setItem("value-village-cart", JSON.stringify(cartItems));
	}, [cartItems, isLoaded]);
	const addToCart = (product) => {
		setCartItems((prev) => {
			if (prev.find((item) => item._id === product._id)) return prev.map((item) => item._id === product._id ? {
				...item,
				quantity: item.quantity + 1
			} : item);
			return [...prev, {
				...product,
				quantity: 1
			}];
		});
	};
	const removeFromCart = (id) => {
		setCartItems((prev) => prev.filter((item) => item._id !== id));
	};
	const updateQuantity = (id, newQuantity) => {
		if (newQuantity < 1) {
			removeFromCart(id);
			return;
		}
		setCartItems((prev) => prev.map((item) => item._id === id ? {
			...item,
			quantity: newQuantity
		} : item));
	};
	const clearCart = () => {
		setCartItems([]);
	};
	return /* @__PURE__ */ jsx(CartContext.Provider, {
		value: {
			cartItems,
			addToCart,
			removeFromCart,
			updateQuantity,
			clearCart
		},
		children
	});
}
function useCart() {
	const context = useContext(CartContext);
	if (context === void 0) throw new Error("useCart must be used within a CartProvider");
	return context;
}
//#endregion
//#region app/root.tsx
var root_exports = /* @__PURE__ */ __exportAll({ default: () => root_default });
var root_default = UNSAFE_withComponentProps(function Root() {
	const [theme, setTheme] = useState("dark");
	useEffect(() => {
		setTheme(localStorage.getItem("app-theme") || "light");
	}, []);
	return /* @__PURE__ */ jsxs("html", {
		lang: "en",
		children: [/* @__PURE__ */ jsxs("head", { children: [
			/* @__PURE__ */ jsx("meta", { charSet: "UTF-8" }),
			/* @__PURE__ */ jsx("meta", {
				name: "viewport",
				content: "width=device-width, initial-scale=1.0"
			}),
			/* @__PURE__ */ jsx("title", { children: "Value Village — Thrift & Resale" }),
			/* @__PURE__ */ jsx("link", {
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			}),
			/* @__PURE__ */ jsx("link", {
				href: "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=Nunito:wght@400;500;600;700&display=swap",
				rel: "stylesheet"
			}),
			/* @__PURE__ */ jsx(Meta, {}),
			/* @__PURE__ */ jsx(Links, {})
		] }), /* @__PURE__ */ jsxs("body", { children: [
			/* @__PURE__ */ jsx(AuthProvider, { children: /* @__PURE__ */ jsxs(WishlistProvider, { children: [
				" ",
				/* @__PURE__ */ jsxs(CartProvider, { children: [/* @__PURE__ */ jsx(Navbar, {}), /* @__PURE__ */ jsxs("div", {
					style: {
						paddingTop: "68px",
						minHeight: "100vh"
					},
					children: [/* @__PURE__ */ jsx(Outlet, { context: {
						theme,
						setTheme
					} }), /* @__PURE__ */ jsx(Chatbot, {})]
				})] }),
				/* @__PURE__ */ jsx(Footer, {})
			] }) }),
			/* @__PURE__ */ jsx(ScrollRestoration, {}),
			/* @__PURE__ */ jsx(Scripts, {})
		] })]
	});
});
//#endregion
//#region app/components/UI/3DFliptext.tsx
function Text3DFlip({ children, className, textClassName, flipTextClassName, rotateDirection = "top", staggerDuration = .03, staggerFrom = "first", transition = {
	type: "spring",
	damping: 25,
	stiffness: 160
} }) {
	const characters = children.split("");
	const [flipCount, setFlipCount] = useState(0);
	const getDelay = (index) => {
		if (staggerFrom === "first") return index * staggerDuration;
		if (staggerFrom === "last") return (characters.length - 1 - index) * staggerDuration;
		if (staggerFrom === "center") {
			const center = Math.floor(characters.length / 2);
			return Math.abs(center - index) * staggerDuration;
		}
		if (typeof staggerFrom === "number") return Math.abs(staggerFrom - index) * staggerDuration;
		return index * staggerDuration;
	};
	const getRotation = (direction, count) => {
		const step = 90;
		switch (direction) {
			case "top": return { rotateX: count * step };
			case "bottom": return { rotateX: count * -90 };
			case "left": return { rotateY: count * -90 };
			case "right": return { rotateY: count * step };
			default: return { rotateX: count * step };
		}
	};
	const getFaceTransform = (direction, faceIndex) => {
		const angle = (direction === "top" || direction === "right" ? -1 : 1) * faceIndex * 90;
		if (direction === "top" || direction === "bottom") return `rotateX(${angle}deg) translateZ(0.5em)`;
		return `rotateY(${angle}deg) translateZ(0.5em)`;
	};
	return /* @__PURE__ */ jsx(motion.div, {
		onMouseEnter: () => setFlipCount((c) => c + 1),
		className,
		style: {
			display: "flex",
			flexWrap: "wrap",
			cursor: "pointer",
			perspective: "1000px"
		},
		children: characters.map((char, i) => {
			const isSpace = char === " ";
			return /* @__PURE__ */ jsx(motion.span, {
				initial: false,
				animate: getRotation(rotateDirection, flipCount),
				transition: {
					...transition,
					delay: getDelay(i)
				},
				style: {
					position: "relative",
					display: "inline-block",
					transformStyle: "preserve-3d"
				},
				children: [
					0,
					1,
					2,
					3
				].map((faceIndex) => /* @__PURE__ */ jsx("span", {
					className: faceIndex % 2 === 0 ? textClassName : flipTextClassName,
					style: {
						position: faceIndex === 0 ? "relative" : "absolute",
						left: faceIndex === 0 ? "auto" : 0,
						top: faceIndex === 0 ? "auto" : 0,
						height: faceIndex === 0 ? "auto" : "100%",
						width: faceIndex === 0 ? "auto" : "100%",
						display: "inline-flex",
						alignItems: "center",
						justifyContent: "center",
						transform: getFaceTransform(rotateDirection, faceIndex),
						backfaceVisibility: "hidden",
						WebkitBackfaceVisibility: "hidden"
					},
					children: isSpace ? "\xA0" : char
				}, faceIndex))
			}, i);
		})
	});
}
//#endregion
//#region app/components/UI/HoverAni/pointer.tsx
function HeartCursor({ isVisible, x, y }) {
	return /* @__PURE__ */ jsx(AnimatePresence, { children: isVisible && /* @__PURE__ */ jsx(motion.div, {
		initial: {
			opacity: 0,
			scale: .5
		},
		animate: {
			opacity: 1,
			scale: 1,
			x: x - 20,
			y: y - 20
		},
		exit: {
			opacity: 0,
			scale: .5
		},
		transition: {
			type: "spring",
			stiffness: 500,
			damping: 28,
			mass: .5
		},
		style: {
			position: "absolute",
			top: 0,
			left: 0,
			pointerEvents: "none",
			zIndex: 50
		},
		children: /* @__PURE__ */ jsx(motion.svg, {
			width: "40",
			height: "40",
			viewBox: "0 0 40 40",
			fill: "none",
			xmlns: "http://www.w3.org/2000/svg",
			animate: {
				scale: [
					1,
					1.2,
					1
				],
				rotate: [
					0,
					5,
					-5,
					0
				]
			},
			transition: {
				duration: 1.5,
				repeat: Infinity,
				ease: "easeInOut"
			},
			children: /* @__PURE__ */ jsx("path", {
				d: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
				fill: "var(--color-secondary)"
			})
		})
	}) });
}
//#endregion
//#region app/components/UI/ProductCard.tsx
function ProductCard({ product }) {
	const { addToCart } = useCart();
	const { toggleWishlist, isInWishlist } = useWishlist();
	const isSaved = isInWishlist(product._id);
	const [isHovered, setIsHovered] = useState(false);
	const [isHoveringWishlist, setIsHoveringWishlist] = useState(false);
	const [mousePos, setMousePos] = useState({
		x: 0,
		y: 0
	});
	const handleMouseMove = (e) => {
		const rect = e.currentTarget.getBoundingClientRect();
		setMousePos({
			x: e.clientX - rect.left,
			y: e.clientY - rect.top
		});
	};
	const displayImage = product.imageUrl && product.imageUrl.length > 0 ? product.imageUrl[0] : "https://via.placeholder.com/400x500?text=No+Image";
	return /* @__PURE__ */ jsx(Link, {
		to: `/product/${product._id}`,
		style: {
			textDecoration: "none",
			color: "inherit"
		},
		children: /* @__PURE__ */ jsxs("div", {
			className: "product-card",
			style: {
				cursor: "pointer",
				transition: "transform 0.2s ease"
			},
			children: [/* @__PURE__ */ jsxs("div", {
				className: "product-img",
				onMouseEnter: () => setIsHovered(true),
				onMouseLeave: () => setIsHovered(false),
				onMouseMove: handleMouseMove,
				style: {
					aspectRatio: "4/5",
					backgroundColor: "var(--cream)",
					borderRadius: "8px",
					overflow: "hidden",
					position: "relative",
					cursor: "none"
				},
				children: [
					/* @__PURE__ */ jsx(HeartCursor, {
						isVisible: isHovered && !isHoveringWishlist,
						x: mousePos.x,
						y: mousePos.y
					}),
					/* @__PURE__ */ jsx("img", {
						src: displayImage,
						alt: product.name,
						style: {
							width: "100%",
							height: "100%",
							objectFit: "cover"
						}
					}),
					/* @__PURE__ */ jsx("button", {
						className: "p-wish",
						onClick: (e) => {
							e.preventDefault();
							toggleWishlist(product);
						},
						style: {
							position: "absolute",
							top: "12px",
							right: "12px",
							color: isSaved ? "var(--red)" : "var(--brown-muted)",
							background: "white",
							border: "none",
							borderRadius: "50%",
							width: "32px",
							height: "32px",
							cursor: "pointer",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
							zIndex: 10
						},
						children: isSaved ? "❤️" : "🤍"
					})
				]
			}), /* @__PURE__ */ jsxs("div", {
				className: "product-info",
				style: { marginTop: "12px" },
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "product-name",
						style: {
							fontSize: "16px",
							fontWeight: 600
						},
						children: product.name
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "product-meta",
						style: {
							fontSize: "13px",
							color: "var(--brown-muted)",
							textTransform: "capitalize",
							marginTop: "4px"
						},
						children: [
							product.category,
							" • ",
							product.condition
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "product-price-row",
						style: {
							marginTop: "8px",
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center"
						},
						children: [/* @__PURE__ */ jsxs("span", {
							className: "price-now",
							style: {
								fontSize: "16px",
								fontWeight: 700
							},
							children: ["₹", product.price]
						}), /* @__PURE__ */ jsx("button", {
							onClick: (e) => {
								e.preventDefault();
								addToCart(product);
							},
							style: {
								padding: "6px 12px",
								backgroundColor: "var(--brown)",
								color: "white",
								border: "none",
								borderRadius: "4px",
								cursor: "pointer"
							},
							children: "Add to Cart"
						})]
					})
				]
			})]
		})
	});
}
//#endregion
//#region app/components/UI/ReviewMarquee.tsx
var reviews = [
	{
		name: "Jack",
		username: "@jack",
		body: "I've never seen anything like this before. It's amazing. I love it.",
		img: "https://avatar.vercel.sh/jack"
	},
	{
		name: "Jane",
		username: "@jane",
		img: "https://avatar.vercel.sh/jane",
		body: "This is the best thing I've ever bought. I can't believe how good it is."
	},
	{
		name: "John",
		username: "@john",
		body: "I love this product. It's so good.",
		img: "https://avatar.vercel.sh/john"
	},
	{
		name: "Alice",
		username: "@alice",
		body: "This is the best thing I've ever bought. I can't believe how good it is.",
		img: "https://avatar.vercel.sh/alice"
	},
	{
		name: "Bob",
		username: "@bob",
		body: "I've never seen anything like this before. It's amazing. I love it.",
		img: "https://avatar.vercel.sh/bob"
	},
	{
		name: "Charlie",
		username: "@charlie",
		body: "This is the best thing I've ever bought. I can't believe how good it is.",
		img: "https://avatar.vercel.sh/charlie"
	},
	{
		name: "David",
		username: "@david",
		body: "I've never seen anything like this before. It's amazing. I love it.",
		img: "https://avatar.vercel.sh/david"
	},
	{
		name: "Eve",
		username: "@eve",
		body: "This is the best thing I've ever bought. I can't believe how good it is.",
		img: "https://avatar.vercel.sh/eve"
	},
	{
		name: "Frank",
		username: "@frank",
		body: "I've never seen anything like this before. It's amazing. I love it.",
		img: "https://avatar.vercel.sh/frank"
	},
	{
		name: "Grace",
		username: "@grace",
		body: "This is the best thing I've ever bought. I can't believe how good it is.",
		img: "https://avatar.vercel.sh/grace"
	}
];
var firstRow = reviews.slice(0, reviews.length / 2);
var secondRow = reviews.slice(reviews.length / 2);
var ReviewCard = ({ img, name, username, body }) => {
	return /* @__PURE__ */ jsxs("figure", {
		style: {
			position: "relative",
			width: "256px",
			cursor: "pointer",
			overflow: "hidden",
			borderRadius: "12px",
			border: "1px solid var(--border-color, #e5e7eb)",
			padding: "16px",
			backgroundColor: "var(--cream, #fff)",
			boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
			display: "flex",
			flexDirection: "column",
			gap: "8px",
			flexShrink: 0
		},
		children: [/* @__PURE__ */ jsxs("div", {
			style: {
				display: "flex",
				flexDirection: "row",
				alignItems: "center",
				gap: "12px"
			},
			children: [/* @__PURE__ */ jsx("img", {
				style: { borderRadius: "50%" },
				width: "32",
				height: "32",
				alt: "",
				src: img
			}), /* @__PURE__ */ jsxs("div", {
				style: {
					display: "flex",
					flexDirection: "column"
				},
				children: [/* @__PURE__ */ jsx("figcaption", {
					style: {
						fontSize: "14px",
						fontWeight: 600,
						color: "var(--text-main, #000)"
					},
					children: name
				}), /* @__PURE__ */ jsx("p", {
					style: {
						fontSize: "12px",
						color: "var(--brown-muted, #666)",
						margin: 0
					},
					children: username
				})]
			})]
		}), /* @__PURE__ */ jsxs("blockquote", {
			style: {
				marginTop: "8px",
				fontSize: "14px",
				color: "var(--text-main, #333)"
			},
			children: [
				"\"",
				body,
				"\""
			]
		})]
	});
};
var StandardMarquee = ({ children, reverse = false, duration = "40s" }) => {
	return /* @__PURE__ */ jsx("div", {
		style: {
			display: "flex",
			overflow: "hidden",
			width: "100%",
			gap: "16px"
		},
		children: /* @__PURE__ */ jsxs("div", {
			className: `marquee-content ${reverse ? "marquee-reverse" : ""}`,
			style: {
				display: "flex",
				gap: "16px",
				minWidth: "min-content",
				animationDuration: duration
			},
			children: [children, children]
		})
	});
};
function ReviewMarquee() {
	return /* @__PURE__ */ jsxs("div", {
		style: {
			position: "relative",
			display: "flex",
			width: "100%",
			flexDirection: "column",
			alignItems: "center",
			justifyContent: "center",
			overflow: "hidden",
			padding: "20px 0"
		},
		children: [
			/* @__PURE__ */ jsx("div", {
				style: {
					marginBottom: "16px",
					width: "100%"
				},
				children: /* @__PURE__ */ jsx(StandardMarquee, {
					duration: "30s",
					children: firstRow.map((review) => /* @__PURE__ */ jsx(ReviewCard, { ...review }, review.username))
				})
			}),
			/* @__PURE__ */ jsx("div", {
				style: { width: "100%" },
				children: /* @__PURE__ */ jsx(StandardMarquee, {
					reverse: true,
					duration: "30s",
					children: secondRow.map((review) => /* @__PURE__ */ jsx(ReviewCard, { ...review }, review.username))
				})
			}),
			/* @__PURE__ */ jsx("div", { style: {
				pointerEvents: "none",
				position: "absolute",
				top: 0,
				bottom: 0,
				left: 0,
				width: "15%",
				background: "linear-gradient(to right, var(--bg-base, white), transparent)"
			} }),
			/* @__PURE__ */ jsx("div", { style: {
				pointerEvents: "none",
				position: "absolute",
				top: 0,
				bottom: 0,
				right: 0,
				width: "15%",
				background: "linear-gradient(to left, var(--bg-base, white), transparent)"
			} })
		]
	});
}
//#endregion
//#region app/routes/home.tsx
var home_exports = /* @__PURE__ */ __exportAll({ default: () => home_default });
var home_default = UNSAFE_withComponentProps(function Home() {
	const marqueeWords = [
		"PRE-LOVED",
		"VINTAGE",
		"GREAT DEALS",
		"FREE RETURNS",
		"THRIFT",
		"RESALE"
	];
	const scrollingText = [
		...marqueeWords,
		...marqueeWords,
		...marqueeWords,
		...marqueeWords
	];
	return /* @__PURE__ */ jsxs("div", {
		className: "page-content",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "hero",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "hero-left",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "hero-kicker",
							children: "🏷️ New drops every Tuesday"
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "hero-title",
							style: {
								display: "flex",
								flexDirection: "column",
								alignItems: "flex-start"
							},
							children: [
								/* @__PURE__ */ jsx(Text3DFlip, {
									textClassName: "text-black",
									flipTextClassName: "text-[var(--brown)]",
									rotateDirection: "top",
									staggerDuration: .03,
									children: "FIND"
								}),
								/* @__PURE__ */ jsx(Text3DFlip, {
									textClassName: "text-black",
									flipTextClassName: "text-[var(--brown)]",
									rotateDirection: "top",
									staggerDuration: .03,
									children: "YOUR"
								}),
								/* @__PURE__ */ jsx(Text3DFlip, {
									className: "red",
									textClassName: "text-[var(--red, #ef4444)]",
									flipTextClassName: "text-black",
									rotateDirection: "top",
									staggerDuration: .03,
									children: "STYLE."
								})
							]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "hero-subtitle",
							children: "Pre-loved. Perfectly priced."
						}),
						/* @__PURE__ */ jsx("p", {
							className: "hero-desc",
							children: "Thousands of handpicked thrift finds from trusted resellers. Designer labels, vintage gems, and everyday essentials — all at a fraction of retail."
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "hero-actions",
							children: [/* @__PURE__ */ jsx(Link, {
								to: "/shop",
								children: /* @__PURE__ */ jsx("button", {
									className: "btn-primary",
									children: "Shop Now"
								})
							}), /* @__PURE__ */ jsx(Link, {
								to: "/sell",
								children: /* @__PURE__ */ jsx("button", {
									className: "btn-yellow",
									children: "Sell With Us"
								})
							})]
						})
					]
				}), /* @__PURE__ */ jsxs("div", {
					className: "hero-right",
					children: [
						/* @__PURE__ */ jsx("div", { className: "hero-right-bg" }),
						/* @__PURE__ */ jsx("div", {
							className: "hero-right-big",
							children: "THRIFT"
						}),
						/* @__PURE__ */ jsx("div", {
							className: "hero-right-content",
							children: /* @__PURE__ */ jsxs("div", {
								className: "price-tag",
								children: [
									/* @__PURE__ */ jsx("div", {
										className: "price-tag-label",
										children: "Starting from"
									}),
									/* @__PURE__ */ jsx("div", {
										className: "price-tag-val",
										children: "₹199"
									}),
									/* @__PURE__ */ jsx("div", {
										className: "price-tag-sub",
										children: "Verified pre-loved items"
									})
								]
							})
						})
					]
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "marquee-wrapper",
				children: /* @__PURE__ */ jsx("div", {
					className: "marquee-content",
					children: scrollingText.map((text, index) => /* @__PURE__ */ jsxs("div", {
						className: "marquee-item",
						children: [
							text,
							" ",
							/* @__PURE__ */ jsx("span", {
								className: "marquee-diamond",
								children: "♦"
							})
						]
					}, index))
				})
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "category-section",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "cat-header-row",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						className: "cat-eyebrow",
						children: "BROWSE BY CATEGORY"
					}), /* @__PURE__ */ jsxs("h2", {
						className: "cat-h2",
						children: [
							"SHOP THE",
							/* @__PURE__ */ jsx("br", {}),
							"VILLAGE"
						]
					})] }), /* @__PURE__ */ jsx(Link, {
						to: "/shop",
						className: "cat-link-all",
						children: "ALL CATEGORIES →"
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "cat-grid",
					children: [
						/* @__PURE__ */ jsxs(Link, {
							to: "/shop?category=womens",
							className: "cat-card bg-brown",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "cat-card-icon",
									children: "👗"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "cat-card-title",
									children: "WOMEN'S"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "cat-card-count",
									children: "18,200 items"
								})
							]
						}),
						/* @__PURE__ */ jsxs(Link, {
							to: "/shop?category=mens",
							className: "cat-card bg-green",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "cat-card-icon",
									children: "👔"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "cat-card-title",
									children: "MEN'S"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "cat-card-count",
									children: "12,400 items"
								})
							]
						}),
						/* @__PURE__ */ jsxs(Link, {
							to: "/shop?category=shoes",
							className: "cat-card bg-purple",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "cat-card-icon",
									children: "👟"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "cat-card-title",
									children: "SHOES"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "cat-card-count",
									children: "7,600 items"
								})
							]
						}),
						/* @__PURE__ */ jsxs(Link, {
							to: "/shop?category=accessories",
							className: "cat-card bg-tan",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "cat-card-icon",
									children: "👜"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "cat-card-title",
									children: "ACCESSORIES"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "cat-card-count",
									children: "5,800 items"
								})
							]
						}),
						/* @__PURE__ */ jsxs(Link, {
							to: "/shop?category=vintage",
							className: "cat-card bg-red",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "cat-card-icon",
									children: "✨"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "cat-card-title",
									children: "VINTAGE"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "cat-card-count",
									children: "3,200 items"
								})
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "products-section",
				style: { paddingTop: "60px" },
				children: [/* @__PURE__ */ jsxs("div", {
					className: "section-header",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						className: "section-eyebrow",
						children: "Handpicked finds"
					}), /* @__PURE__ */ jsxs("div", {
						className: "section-title",
						children: [
							"HOT RIGHT",
							/* @__PURE__ */ jsx("br", {}),
							"NOW 🔥"
						]
					})] }), /* @__PURE__ */ jsx(Link, {
						to: "/shop",
						children: /* @__PURE__ */ jsx("button", {
							className: "section-link",
							children: "View all →"
						})
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "product-grid",
					children: [{
						_id: "1",
						emoji: "👗",
						name: "Levi's Denim Jacket '90s",
						meta: "Size M · Like new · Women's",
						priceNow: 38,
						priceWas: 120,
						savePercentage: 68,
						badge: {
							type: "hot",
							text: "🔥 Hot"
						}
					}, {
						_id: "2",
						emoji: "👟",
						name: "Nike Air Max 90 Vintage",
						meta: "Size 10 · Good condition",
						priceNow: 54,
						priceWas: 130,
						savePercentage: 58,
						badge: {
							type: "thrift",
							text: "Thrift"
						}
					}].map((product) => /* @__PURE__ */ jsx(ProductCard, { product }, product._id))
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "reviews-section",
				style: { padding: "60px 0" },
				children: [/* @__PURE__ */ jsx("h2", {
					style: {
						textAlign: "center",
						marginBottom: "40px",
						color: "var(--brown)"
					},
					children: "What Our Thrifters Say"
				}), /* @__PURE__ */ jsx(ReviewMarquee, {})]
			})
		]
	});
});
//#endregion
//#region app/components/admin/FaqManager.tsx
function FaqManager() {
	const [faqs, setFaqs] = useState([]);
	const [loading, setLoading] = useState(true);
	const [editingId, setEditingId] = useState(null);
	const [formData, setFormData] = useState({
		question: "",
		answer: "",
		order: 10,
		isActive: true
	});
	const fetchFaqs = async () => {
		try {
			setFaqs(await (await fetch("http://localhost:5000/api/chat/faqs")).json());
		} catch (error) {
			console.error("Failed to load FAQs");
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		fetchFaqs();
	}, []);
	const handleSubmit = async (e) => {
		e.preventDefault();
		const url = editingId ? `http://localhost:5000/api/chat/faqs/${editingId}` : `http://localhost:5000/api/chat/faqs`;
		const method = editingId ? "PUT" : "POST";
		try {
			if ((await fetch(url, {
				method,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData)
			})).ok) {
				setEditingId(null);
				setFormData({
					question: "",
					answer: "",
					order: 10,
					isActive: true
				});
				fetchFaqs();
			}
		} catch (error) {
			console.error("Failed to save FAQ");
		}
	};
	const handleDelete = async (id) => {
		if (!window.confirm("Are you sure you want to delete this FAQ?")) return;
		try {
			await fetch(`http://localhost:5000/api/chat/faqs/${id}`, { method: "DELETE" });
			setFaqs(faqs.filter((faq) => faq._id !== id));
		} catch (error) {
			console.error("Failed to delete FAQ");
		}
	};
	const startEdit = (faq) => {
		setEditingId(faq._id);
		setFormData({
			question: faq.question,
			answer: faq.answer,
			order: faq.order,
			isActive: faq.isActive
		});
	};
	if (loading) return /* @__PURE__ */ jsx("div", {
		style: { color: "var(--text-main)" },
		children: "Loading Knowledge Base..."
	});
	return /* @__PURE__ */ jsxs("div", {
		style: {
			display: "flex",
			flexDirection: "column",
			gap: "32px"
		},
		children: [/* @__PURE__ */ jsxs("div", {
			style: {
				backgroundColor: "var(--bg-surface)",
				padding: "24px",
				borderRadius: "12px",
				border: "1px solid var(--border-color)"
			},
			children: [/* @__PURE__ */ jsx("h3", {
				style: {
					margin: "0 0 16px 0",
					color: "var(--text-main)"
				},
				children: editingId ? "✏️ Edit FAQ" : "➕ Add New FAQ"
			}), /* @__PURE__ */ jsxs("form", {
				onSubmit: handleSubmit,
				style: {
					display: "flex",
					flexDirection: "column",
					gap: "16px"
				},
				children: [
					/* @__PURE__ */ jsx("input", {
						type: "text",
						placeholder: "Question (e.g., Do you ship internationally?)",
						value: formData.question,
						onChange: (e) => setFormData({
							...formData,
							question: e.target.value
						}),
						required: true,
						style: {
							padding: "10px",
							borderRadius: "var(--radius-md)",
							border: "1px solid var(--border-color)",
							backgroundColor: "var(--bg-base)",
							color: "var(--text-main)",
							fontFamily: "inherit"
						}
					}),
					/* @__PURE__ */ jsx("textarea", {
						placeholder: "Answer",
						value: formData.answer,
						onChange: (e) => setFormData({
							...formData,
							answer: e.target.value
						}),
						required: true,
						rows: 3,
						style: {
							padding: "10px",
							borderRadius: "var(--radius-md)",
							border: "1px solid var(--border-color)",
							backgroundColor: "var(--bg-base)",
							color: "var(--text-main)",
							fontFamily: "inherit"
						}
					}),
					/* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							gap: "16px",
							alignItems: "center"
						},
						children: [/* @__PURE__ */ jsxs("label", {
							style: {
								display: "flex",
								alignItems: "center",
								gap: "8px",
								color: "var(--text-main)",
								fontSize: "14px"
							},
							children: ["Order (e.g., 10, 20):", /* @__PURE__ */ jsx("input", {
								type: "number",
								value: formData.order,
								onChange: (e) => setFormData({
									...formData,
									order: Number(e.target.value)
								}),
								style: {
									width: "80px",
									padding: "6px",
									borderRadius: "4px",
									border: "1px solid var(--border-color)",
									backgroundColor: "var(--bg-base)",
									color: "var(--text-main)"
								}
							})]
						}), /* @__PURE__ */ jsxs("label", {
							style: {
								display: "flex",
								alignItems: "center",
								gap: "8px",
								color: "var(--text-main)",
								fontSize: "14px"
							},
							children: [/* @__PURE__ */ jsx("input", {
								type: "checkbox",
								checked: formData.isActive,
								onChange: (e) => setFormData({
									...formData,
									isActive: e.target.checked
								})
							}), "Active"]
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							gap: "12px"
						},
						children: [/* @__PURE__ */ jsx("button", {
							type: "submit",
							style: {
								padding: "10px 24px",
								borderRadius: "var(--radius-md)",
								backgroundColor: "var(--brown)",
								color: "#fff",
								border: "none",
								cursor: "pointer",
								fontWeight: 600
							},
							children: editingId ? "Update FAQ" : "Save FAQ"
						}), editingId && /* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => {
								setEditingId(null);
								setFormData({
									question: "",
									answer: "",
									order: 10,
									isActive: true
								});
							},
							style: {
								padding: "10px 24px",
								borderRadius: "8px",
								backgroundColor: "transparent",
								color: "var(--text-main)",
								border: "1px solid var(--border-color)",
								cursor: "pointer"
							},
							children: "Cancel"
						})]
					})
				]
			})]
		}), /* @__PURE__ */ jsxs("div", {
			style: {
				display: "flex",
				flexDirection: "column",
				gap: "12px"
			},
			children: [
				/* @__PURE__ */ jsx("h3", {
					style: {
						margin: 0,
						color: "var(--text-main)"
					},
					children: "Current Knowledge Base"
				}),
				faqs.map((faq) => /* @__PURE__ */ jsxs("div", {
					style: {
						display: "flex",
						justifyContent: "space-between",
						alignItems: "flex-start",
						padding: "16px",
						backgroundColor: "var(--bg-surface)",
						border: "1px solid var(--border-color)",
						borderRadius: "12px"
					},
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							alignItems: "center",
							gap: "8px",
							marginBottom: "4px"
						},
						children: [
							/* @__PURE__ */ jsxs("span", {
								style: {
									fontSize: "12px",
									padding: "2px 6px",
									backgroundColor: "var(--bg-base)",
									borderRadius: "4px",
									color: "var(--text-muted)"
								},
								children: ["Order: ", faq.order]
							}),
							!faq.isActive && /* @__PURE__ */ jsx("span", {
								style: {
									fontSize: "12px",
									padding: "2px 6px",
									backgroundColor: "#fee2e2",
									color: "#991b1b",
									borderRadius: "4px"
								},
								children: "Inactive"
							}),
							/* @__PURE__ */ jsx("strong", {
								style: { color: "var(--text-main)" },
								children: faq.question
							})
						]
					}), /* @__PURE__ */ jsx("p", {
						style: {
							margin: 0,
							color: "var(--text-muted)",
							fontSize: "14px"
						},
						children: faq.answer
					})] }), /* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							gap: "8px"
						},
						children: [/* @__PURE__ */ jsx("button", {
							onClick: () => startEdit(faq),
							style: {
								background: "none",
								border: "none",
								cursor: "pointer",
								fontSize: "16px"
							},
							children: "✏️"
						}), /* @__PURE__ */ jsx("button", {
							onClick: () => handleDelete(faq._id),
							style: {
								background: "none",
								border: "none",
								cursor: "pointer",
								fontSize: "16px"
							},
							children: "🗑️"
						})]
					})]
				}, faq._id)),
				faqs.length === 0 && /* @__PURE__ */ jsx("p", {
					style: { color: "var(--text-muted)" },
					children: "No FAQs added yet."
				})
			]
		})]
	});
}
//#endregion
//#region app/routes/admin.tsx
var admin_exports = /* @__PURE__ */ __exportAll({ default: () => admin_default });
var admin_default = UNSAFE_withComponentProps(function AdminDashboard() {
	const { user } = useAuth();
	useNavigate();
	const { theme, setTheme } = useOutletContext();
	const toggleTheme = () => {
		const newTheme = theme === "dark" ? "light" : "dark";
		setTheme(newTheme);
		localStorage.setItem("app-theme", newTheme);
	};
	const [allProducts, setAllProducts] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [activeTab, setActiveTab] = useState("pending");
	const [productTab, setProductTab] = useState("products");
	useEffect(() => {
		const fetchDashboardData = async () => {
			try {
				console.log("1. Frontend asking for data...");
				const response = await fetch("http://localhost:5000/api/admin/products");
				console.log("2. Response Status:", response.status);
				if (response.ok) {
					const data = await response.json();
					console.log("3. Data successfully received:", data);
					setAllProducts(data);
				} else console.log("❌ Backend threw an error status!");
			} catch (error) {
				console.error("❌ Network Fetch Error (Is the backend running?):", error);
			} finally {
				setIsLoading(false);
			}
		};
		fetchDashboardData();
	}, []);
	const handleAction = async (productId, status) => {
		let rejectionReason = "";
		if (status === "rejected") {
			const reason = window.prompt("Reason for rejection?");
			if (reason === null) return;
			rejectionReason = reason;
		}
		try {
			if ((await fetch(`http://localhost:5000/api/admin/products/${productId}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					status,
					rejectionReason
				})
			})).ok) setAllProducts((prev) => prev.map((item) => item._id === productId ? {
				...item,
				status,
				rejectionReason
			} : item));
			else alert("Failed to update status.");
		} catch (error) {
			console.error("Action error:", error);
		}
	};
	const pendingItems = allProducts.filter((p) => p.status === "pending" || !p.status);
	const approvedItems = allProducts.filter((p) => p.status === "approved");
	const rejectedItems = allProducts.filter((p) => p.status === "rejected");
	const soldItems = allProducts.filter((p) => p.status === "sold");
	let currentDisplayList = [];
	if (activeTab === "all") currentDisplayList = allProducts;
	if (activeTab === "pending") currentDisplayList = pendingItems;
	if (activeTab === "approved") currentDisplayList = approvedItems;
	if (activeTab === "rejected") currentDisplayList = rejectedItems;
	if (activeTab === "sold") currentDisplayList = soldItems;
	if (isLoading) return /* @__PURE__ */ jsx("div", {
		style: {
			padding: "48px",
			textAlign: "center",
			color: "var(--brown)"
		},
		children: "Loading Command Center..."
	});
	return /* @__PURE__ */ jsxs("div", {
		style: {
			display: "flex",
			minHeight: "100vh",
			backgroundColor: "#f9f9f9",
			color: "#1A1612"
		},
		children: [/* @__PURE__ */ jsxs("div", {
			style: {
				width: "280px",
				backgroundColor: "#fff",
				borderRight: "1px solid var(--border)",
				padding: "32px 24px",
				display: "flex",
				flexDirection: "column"
			},
			children: [/* @__PURE__ */ jsxs("h2", {
				style: {
					fontFamily: "var(--font-display)",
					fontSize: "24px",
					marginBottom: "32px"
				},
				children: ["ADMIN ", /* @__PURE__ */ jsx("span", {
					style: { color: "var(--red)" },
					children: "PANEL"
				})]
			}), /* @__PURE__ */ jsxs("div", {
				style: {
					display: "flex",
					flexDirection: "column",
					gap: "8px"
				},
				children: [
					/* @__PURE__ */ jsx(SidebarButton, {
						label: "Pending Queue",
						count: pendingItems.length,
						active: activeTab === "pending",
						onClick: () => setActiveTab("pending"),
						alert: pendingItems.length > 0
					}),
					/* @__PURE__ */ jsx(SidebarButton, {
						label: "Total Listed Items",
						count: allProducts.length,
						active: activeTab === "all",
						onClick: () => setActiveTab("all")
					}),
					/* @__PURE__ */ jsx(SidebarButton, {
						label: "Approved",
						count: approvedItems.length,
						active: activeTab === "approved",
						onClick: () => setActiveTab("approved")
					}),
					/* @__PURE__ */ jsx(SidebarButton, {
						label: "Rejected",
						count: rejectedItems.length,
						active: activeTab === "rejected",
						onClick: () => setActiveTab("rejected")
					}),
					/* @__PURE__ */ jsx(SidebarButton, {
						label: "Sold Items",
						count: soldItems.length,
						active: activeTab === "sold",
						onClick: () => setActiveTab("sold")
					}),
					/* @__PURE__ */ jsx("hr", { style: {
						margin: "16px 0",
						border: "none",
						borderTop: "1px solid var(--border)"
					} }),
					/* @__PURE__ */ jsx(SidebarButton, {
						label: "Analytics & Stats",
						count: null,
						active: activeTab === "analytics",
						onClick: () => setActiveTab("analytics")
					}),
					/* @__PURE__ */ jsx("button", {
						onClick: () => setProductTab("faqs"),
						children: "🤖 Chatbot FAQs"
					}),
					/* @__PURE__ */ jsx("div", {
						style: {
							marginTop: "auto",
							paddingTop: "24px",
							borderTop: "1px solid var(--border-color)"
						},
						children: /* @__PURE__ */ jsx("button", {
							onClick: toggleTheme,
							style: {
								display: "flex",
								alignItems: "center",
								gap: "12px",
								width: "100%",
								padding: "12px 16px",
								borderRadius: "8px",
								border: "1px solid var(--border-color)",
								backgroundColor: "transparent",
								color: "var(--text-main)",
								cursor: "pointer",
								fontWeight: 600,
								transition: "all 0.2s ease"
							},
							children: theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"
						})
					})
				]
			})]
		}), /* @__PURE__ */ jsxs("div", {
			style: {
				flexGrow: 1,
				padding: "48px",
				overflowY: "auto"
			},
			children: [
				/* @__PURE__ */ jsxs("div", {
					style: { marginBottom: "32px" },
					children: [/* @__PURE__ */ jsx("h1", {
						style: {
							fontSize: "32px",
							fontWeight: 700,
							textTransform: "capitalize"
						},
						children: activeTab === "all" ? "Total Platform Listings" : activeTab
					}), /* @__PURE__ */ jsx("p", {
						style: { color: "var(--brown-muted)" },
						children: "Manage and review platform activity."
					})]
				}),
				productTab === "faqs" && /* @__PURE__ */ jsx(FaqManager, {}),
				activeTab === "analytics" ? /* @__PURE__ */ jsxs("div", {
					style: {
						padding: "48px",
						backgroundColor: "#fff",
						border: "1px solid var(--border)",
						borderRadius: "8px",
						textAlign: "center"
					},
					children: [/* @__PURE__ */ jsx("h2", { children: "📊 Analytics Engine" }), /* @__PURE__ */ jsx("p", {
						style: {
							color: "var(--brown-muted)",
							marginTop: "8px"
						},
						children: "Sales graphs, user growth, and conversion rates will go here."
					})]
				}) : /* @__PURE__ */ jsx("div", {
					style: {
						display: "flex",
						flexDirection: "column",
						gap: "16px"
					},
					children: currentDisplayList.length === 0 ? /* @__PURE__ */ jsx("div", {
						style: {
							padding: "32px",
							textAlign: "center",
							backgroundColor: "#fff",
							borderRadius: "8px",
							border: "1px dashed var(--border)",
							color: "var(--brown-muted)"
						},
						children: "No items found in this category."
					}) : currentDisplayList.map((item) => {
						const displayImage = item.imageUrl && item.imageUrl.length > 0 ? item.imageUrl[0] : item.imageUrl ? item.imageUrl : "https://via.placeholder.com/80?text=No+Image";
						const displayStatus = item.status || "pending";
						return /* @__PURE__ */ jsxs("div", {
							style: {
								display: "flex",
								gap: "24px",
								padding: "16px",
								border: "1px solid var(--border)",
								borderRadius: "8px",
								backgroundColor: "var(--bg-surface)",
								alignItems: "center"
							},
							children: [
								/* @__PURE__ */ jsx("img", {
									src: displayImage,
									alt: "thumb",
									style: {
										width: "80px",
										height: "80px",
										objectFit: "cover",
										borderRadius: "4px",
										backgroundColor: "var(--cream)"
									}
								}),
								/* @__PURE__ */ jsxs("div", {
									style: { flexGrow: 1 },
									children: [
										/* @__PURE__ */ jsx("div", {
											style: {
												fontSize: "18px",
												fontWeight: 600
											},
											children: item.name
										}),
										/* @__PURE__ */ jsxs("div", {
											style: {
												fontSize: "14px",
												color: "var(--brown-muted)"
											},
											children: [
												"Seller: ",
												item.seller?.email || "Unknown",
												" | Price: ₹",
												item.price
											]
										}),
										displayStatus === "rejected" && item.rejectionReason && /* @__PURE__ */ jsxs("div", {
											style: {
												fontSize: "13px",
												color: "var(--red)",
												marginTop: "4px",
												backgroundColor: "#FDF2F2",
												padding: "4px 8px",
												borderRadius: "4px",
												display: "inline-block"
											},
											children: ["Reason: ", item.rejectionReason]
										})
									]
								}),
								/* @__PURE__ */ jsx("div", {
									style: {
										padding: "6px 12px",
										borderRadius: "24px",
										fontSize: "12px",
										fontWeight: 600,
										textTransform: "uppercase",
										backgroundColor: "var(--cream)"
									},
									children: displayStatus
								}),
								displayStatus === "pending" && /* @__PURE__ */ jsxs("div", {
									style: {
										display: "flex",
										gap: "8px"
									},
									children: [/* @__PURE__ */ jsx("button", {
										onClick: () => handleAction(item._id, "rejected"),
										style: {
											padding: "8px 16px",
											border: "1px solid var(--red)",
											color: "var(--red)",
											backgroundColor: "#fff",
											borderRadius: "4px",
											cursor: "pointer",
											fontWeight: 600
										},
										children: "Reject"
									}), /* @__PURE__ */ jsx("button", {
										onClick: () => handleAction(item._id, "approved"),
										style: {
											padding: "8px 16px",
											border: "none",
											backgroundColor: "var(--brown)",
											color: "#fff",
											borderRadius: "4px",
											cursor: "pointer",
											fontWeight: 600
										},
										children: "Approve"
									})]
								})
							]
						}, item._id);
					})
				})
			]
		})]
	});
});
function SidebarButton({ label, count, active, onClick, alert = false }) {
	return /* @__PURE__ */ jsxs("button", {
		onClick,
		style: {
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center",
			padding: "12px 16px",
			width: "100%",
			border: "none",
			borderRadius: "8px",
			backgroundColor: active ? "var(--cream)" : "transparent",
			color: active ? "var(--brown)" : "var(--brown-muted)",
			fontWeight: active ? 700 : 500,
			cursor: "pointer",
			textAlign: "left",
			transition: "all 0.2s ease"
		},
		children: [/* @__PURE__ */ jsx("span", { children: label }), count !== null && count !== void 0 && /* @__PURE__ */ jsx("span", {
			style: {
				backgroundColor: alert ? "var(--red)" : active ? "#fff" : "var(--cream)",
				color: alert ? "#fff" : "var(--brown)",
				padding: "2px 8px",
				borderRadius: "12px",
				fontSize: "12px",
				fontWeight: 700
			},
			children: count
		})]
	});
}
//#endregion
//#region app/routes/login.tsx
var login_exports = /* @__PURE__ */ __exportAll({ default: () => login_default });
var login_default = UNSAFE_withComponentProps(function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();
	const { login } = useAuth();
	const from = location.state?.from || "/";
	const triggerConfetti = () => {
		const end = Date.now() + 2 * 1e3;
		const colors = [
			"var(--color-secondary)",
			"#8b5cf6",
			"#fbbf24"
		];
		(function frame() {
			confetti({
				particleCount: 5,
				angle: 60,
				spread: 55,
				origin: { x: 0 },
				colors
			});
			confetti({
				particleCount: 5,
				angle: 120,
				spread: 55,
				origin: { x: 1 },
				colors
			});
			if (Date.now() < end) requestAnimationFrame(frame);
		})();
	};
	const handleLogin = async (e) => {
		e.preventDefault();
		if (await login(email, password)) {
			triggerConfetti();
			setTimeout(() => {}, 2500);
			navigate(from, { replace: true });
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "page-content auth-wrap",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "auth-toggle",
				children: [/* @__PURE__ */ jsx("div", {
					className: "auth-toggle-btn active",
					children: "Sign In"
				}), /* @__PURE__ */ jsx(Link, {
					to: "/register",
					className: "auth-toggle-btn inactive",
					children: "Create Account"
				})]
			}),
			/* @__PURE__ */ jsx("h1", {
				className: "auth-h1",
				children: "WELCOME BACK"
			}),
			/* @__PURE__ */ jsx("div", {
				className: "auth-sub",
				children: "Sign in to access your closet and saved finds."
			}),
			/* @__PURE__ */ jsxs("form", {
				onSubmit: handleLogin,
				children: [/* @__PURE__ */ jsxs("div", {
					className: "form-sec",
					style: { marginBottom: "24px" },
					children: [/* @__PURE__ */ jsx("div", {
						className: "form-row full",
						style: { marginBottom: "20px" },
						children: /* @__PURE__ */ jsxs("div", {
							className: "form-field",
							children: [/* @__PURE__ */ jsx("label", {
								className: "form-label",
								children: "Email Address"
							}), /* @__PURE__ */ jsx("input", {
								type: "email",
								className: "form-input",
								required: true,
								placeholder: "you@example.com",
								value: email,
								onChange: (e) => setEmail(e.target.value)
							})]
						})
					}), /* @__PURE__ */ jsx("div", {
						className: "form-row full",
						children: /* @__PURE__ */ jsxs("div", {
							className: "form-field",
							children: [/* @__PURE__ */ jsxs("div", {
								style: {
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
									marginBottom: "8px"
								},
								children: [/* @__PURE__ */ jsx("label", {
									className: "form-label",
									style: { marginBottom: 0 },
									children: "Password"
								}), /* @__PURE__ */ jsx(Link, {
									to: "/forgot-password",
									style: {
										fontSize: "12px",
										color: "var(--brown-muted)",
										textDecoration: "underline"
									},
									children: "Forgot?"
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "input-wrap",
								children: [/* @__PURE__ */ jsx("input", {
									type: showPassword ? "text" : "password",
									className: "form-input",
									required: true,
									placeholder: "Enter your password",
									value: password,
									onChange: (e) => setPassword(e.target.value)
								}), /* @__PURE__ */ jsx("span", {
									className: "eye-icon",
									onClick: () => setShowPassword(!showPassword),
									style: { cursor: "pointer" },
									children: showPassword ? "👁️‍🗨️" : "👁️"
								})]
							})]
						})
					})]
				}), /* @__PURE__ */ jsx("button", {
					type: "submit",
					className: "btn-primary",
					style: {
						width: "100%",
						fontSize: "14px",
						padding: "16px"
					},
					children: "SIGN IN →"
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "auth-divider",
				style: { marginTop: "32px" },
				children: /* @__PURE__ */ jsx("span", { children: "Or continue with" })
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "social-row",
				style: { marginTop: "24px" },
				children: [/* @__PURE__ */ jsx("button", {
					type: "button",
					className: "btn-social",
					children: "🍎 Apple"
				}), /* @__PURE__ */ jsx("button", {
					type: "button",
					className: "btn-social",
					children: "🔵 Google"
				})]
			})
		]
	});
});
//#endregion
//#region app/routes/register.tsx
var register_exports = /* @__PURE__ */ __exportAll({ default: () => register_default });
var register_default = UNSAFE_withComponentProps(function Register() {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [otp, setOtp] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [agreed, setAgreed] = useState(false);
	const [otpStage, setOtpStage] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");
	const [successMessage, setSuccessMessage] = useState("");
	const navigate = useNavigate();
	const location = useLocation();
	const { requestOtp, verifyOtp } = useAuth();
	const from = location.state?.from || "/";
	const triggerConfetti = () => {
		const end = Date.now() + 2 * 1e3;
		const colors = [
			"var(--color-secondary)",
			"#8b5cf6",
			"#fbbf24"
		];
		(function frame() {
			confetti({
				particleCount: 5,
				angle: 60,
				spread: 55,
				origin: { x: 0 },
				colors
			});
			confetti({
				particleCount: 5,
				angle: 120,
				spread: 55,
				origin: { x: 1 },
				colors
			});
			if (Date.now() < end) requestAnimationFrame(frame);
		})();
	};
	const handleRegister = async (e) => {
		e.preventDefault();
		setError("");
		setSuccessMessage("");
		if (!agreed) {
			setError("Please agree to the Terms of Service.");
			return;
		}
		if (password !== confirmPassword) {
			setError("Passwords do not match.");
			return;
		}
		if (password.length < 8) {
			setError("Password must be at least 8 characters long.");
			return;
		}
		setIsSubmitting(true);
		const result = await requestOtp(firstName, lastName, email, password);
		setIsSubmitting(false);
		if (result.success) {
			setOtpStage(true);
			setSuccessMessage(result.message);
		} else setError(result.message);
	};
	const handleVerifyOtp = async (e) => {
		e.preventDefault();
		setError("");
		setSuccessMessage("");
		if (otp.length !== 6) {
			setError("Please enter the 6-digit OTP.");
			return;
		}
		setIsSubmitting(true);
		const result = await verifyOtp(email, otp);
		setIsSubmitting(false);
		if (result.success) {
			triggerConfetti();
			setTimeout(() => {}, 2500);
			navigate(from, { replace: true });
		} else setError(result.message);
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "page-content auth-wrap",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "auth-toggle",
				children: [/* @__PURE__ */ jsx(Link, {
					to: "/login",
					className: "auth-toggle-btn inactive",
					children: "Sign In"
				}), /* @__PURE__ */ jsx("div", {
					className: "auth-toggle-btn active",
					children: "Create Account"
				})]
			}),
			/* @__PURE__ */ jsx("h1", {
				className: "auth-h1",
				children: "JOIN THE VILLAGE"
			}),
			/* @__PURE__ */ jsx("div", {
				className: "auth-sub",
				children: "Create your free account in 30 seconds"
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "social-row",
				children: [
					/* @__PURE__ */ jsx("button", {
						type: "button",
						className: "btn-social",
						children: "🍎 Apple"
					}),
					/* @__PURE__ */ jsx("button", {
						type: "button",
						className: "btn-social",
						children: "🔵 Google"
					}),
					/* @__PURE__ */ jsx("button", {
						type: "button",
						className: "btn-social",
						children: "📘 Facebook"
					})
				]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "auth-divider",
				children: /* @__PURE__ */ jsx("span", { children: "Or sign up with email" })
			}),
			/* @__PURE__ */ jsxs("form", {
				onSubmit: otpStage ? handleVerifyOtp : handleRegister,
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "form-sec",
						style: { marginBottom: "8px" },
						children: [!otpStage && /* @__PURE__ */ jsxs(Fragment, { children: [
							/* @__PURE__ */ jsxs("div", {
								className: "form-row",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "form-field",
									children: [/* @__PURE__ */ jsx("label", {
										className: "form-label",
										children: "First Name"
									}), /* @__PURE__ */ jsx("input", {
										type: "text",
										className: "form-input",
										required: true,
										placeholder: "Jane",
										value: firstName,
										onChange: (e) => setFirstName(e.target.value)
									})]
								}), /* @__PURE__ */ jsxs("div", {
									className: "form-field",
									children: [/* @__PURE__ */ jsx("label", {
										className: "form-label",
										children: "Last Name"
									}), /* @__PURE__ */ jsx("input", {
										type: "text",
										className: "form-input",
										required: true,
										placeholder: "Doe",
										value: lastName,
										onChange: (e) => setLastName(e.target.value)
									})]
								})]
							}),
							/* @__PURE__ */ jsx("div", {
								className: "form-row full",
								style: { marginTop: "20px" },
								children: /* @__PURE__ */ jsxs("div", {
									className: "form-field",
									children: [/* @__PURE__ */ jsx("label", {
										className: "form-label",
										children: "Email Address"
									}), /* @__PURE__ */ jsx("input", {
										type: "email",
										className: "form-input",
										required: true,
										placeholder: "you@example.com",
										value: email,
										onChange: (e) => setEmail(e.target.value)
									})]
								})
							}),
							/* @__PURE__ */ jsx("div", {
								className: "form-row full",
								style: { marginTop: "20px" },
								children: /* @__PURE__ */ jsxs("div", {
									className: "form-field",
									children: [/* @__PURE__ */ jsx("label", {
										className: "form-label",
										children: "Password"
									}), /* @__PURE__ */ jsxs("div", {
										className: "input-wrap",
										children: [/* @__PURE__ */ jsx("input", {
											type: showPassword ? "text" : "password",
											className: "form-input",
											required: true,
											placeholder: "Min. 8 characters",
											value: password,
											onChange: (e) => setPassword(e.target.value)
										}), /* @__PURE__ */ jsx("span", {
											className: "eye-icon",
											onClick: () => setShowPassword(!showPassword),
											children: showPassword ? "👁️‍🗨️" : "👁️"
										})]
									})]
								})
							}),
							/* @__PURE__ */ jsx("div", {
								className: "form-row full",
								style: { marginTop: "20px" },
								children: /* @__PURE__ */ jsxs("div", {
									className: "form-field",
									children: [/* @__PURE__ */ jsx("label", {
										className: "form-label",
										children: "Confirm Password"
									}), /* @__PURE__ */ jsx("input", {
										type: showPassword ? "text" : "password",
										className: "form-input",
										required: true,
										placeholder: "Re-enter password",
										value: confirmPassword,
										onChange: (e) => setConfirmPassword(e.target.value)
									})]
								})
							})
						] }), otpStage && /* @__PURE__ */ jsx("div", {
							className: "form-row full",
							style: { marginTop: "10px" },
							children: /* @__PURE__ */ jsxs("div", {
								className: "form-field",
								children: [/* @__PURE__ */ jsx("label", {
									className: "form-label",
									children: "Enter OTP"
								}), /* @__PURE__ */ jsx("input", {
									type: "text",
									className: "form-input",
									required: true,
									placeholder: "123456",
									value: otp,
									onChange: (e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
								})]
							})
						})]
					}),
					!otpStage && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("div", {
						className: "pw-strength-bar",
						children: /* @__PURE__ */ jsx("div", {
							className: "pw-fill",
							style: { width: password.length >= 8 ? "100%" : "30%" }
						})
					}), /* @__PURE__ */ jsxs("div", {
						className: "pw-text",
						children: ["Strength: ", password.length >= 8 ? "Good" : "Weak"]
					})] }),
					error && /* @__PURE__ */ jsx("div", {
						style: {
							color: "#b91c1c",
							marginTop: "12px",
							fontSize: "13px"
						},
						children: error
					}),
					successMessage && /* @__PURE__ */ jsx("div", {
						style: {
							color: "#166534",
							marginTop: "12px",
							fontSize: "13px"
						},
						children: successMessage
					}),
					!otpStage && /* @__PURE__ */ jsxs("div", {
						className: "auth-check-row",
						onClick: () => setAgreed(!agreed),
						children: [/* @__PURE__ */ jsx("div", {
							className: `auth-check-box ${agreed ? "checked" : ""}`,
							children: agreed && "✓"
						}), /* @__PURE__ */ jsxs("div", {
							className: "auth-check-label",
							style: { fontSize: "12px" },
							children: [
								"I agree to the ",
								/* @__PURE__ */ jsx(Link, {
									to: "/terms",
									className: "auth-link",
									style: { fontWeight: 400 },
									children: "Terms of Service"
								}),
								" and ",
								/* @__PURE__ */ jsx(Link, {
									to: "/privacy",
									className: "auth-link",
									style: { fontWeight: 400 },
									children: "Privacy Policy"
								}),
								". I'm happy to receive deals, new arrivals, and promo emails from Value Village."
							]
						})]
					}),
					/* @__PURE__ */ jsx("button", {
						type: "submit",
						className: "btn-primary",
						style: {
							width: "100%",
							fontSize: "14px",
							padding: "16px"
						},
						disabled: isSubmitting,
						children: isSubmitting ? "Please wait..." : otpStage ? "VERIFY OTP →" : "CREATE ACCOUNT →"
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				style: {
					textAlign: "center",
					marginTop: "32px",
					fontSize: "13px",
					color: "var(--brown-muted)"
				},
				children: ["Already a member? ", /* @__PURE__ */ jsx(Link, {
					to: "/login",
					className: "auth-link",
					children: "Sign in here"
				})]
			})
		]
	});
});
//#endregion
//#region app/routes/shop.tsx
var shop_exports = /* @__PURE__ */ __exportAll({ default: () => shop_default });
var CATEGORY_BANNERS = [
	{
		label: "All",
		value: "all",
		image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&q=80"
	},
	{
		label: "Men's",
		value: "Men's",
		image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&q=80"
	},
	{
		label: "Women's",
		value: "Women's",
		image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80"
	},
	{
		label: "Kids'",
		value: "Kids",
		image: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=400&q=80"
	},
	{
		label: "Accessories",
		value: "Accessories",
		image: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=400&q=80"
	}
];
var shop_default = UNSAFE_withComponentProps(function Shop() {
	const [products, setProducts] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [searchParams, setSearchParams] = useSearchParams();
	const currentCategory = searchParams.get("category") || "all";
	const currentSort = searchParams.get("sort") || "newest";
	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const response = await fetch("http://localhost:5000/api/products");
				if (!response.ok) throw new Error("Server responded with an error");
				setProducts(await response.json());
			} catch (err) {
				console.error("Failed to fetch products:", err);
				setError("Could not connect to the database server.");
			} finally {
				setIsLoading(false);
			}
		};
		fetchProducts();
	}, []);
	let displayProducts = currentCategory === "all" ? [...products] : products.filter((p) => p.category === currentCategory);
	if (currentSort === "price-low") displayProducts.sort((a, b) => a.price - b.price);
	else if (currentSort === "price-high") displayProducts.sort((a, b) => b.price - a.price);
	else if (currentSort === "newest") displayProducts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
	const handleCategoryChange = (categoryValue) => {
		setSearchParams({
			category: categoryValue,
			sort: currentSort
		});
	};
	const handleSortChange = (e) => {
		setSearchParams({
			category: currentCategory,
			sort: e.target.value
		});
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "page-content",
		style: {
			padding: "32px 24px",
			maxWidth: "1400px",
			margin: "0 auto"
		},
		children: [/* @__PURE__ */ jsxs("div", {
			style: { marginBottom: "48px" },
			children: [/* @__PURE__ */ jsx("h2", {
				style: {
					fontSize: "24px",
					fontWeight: 600,
					marginBottom: "16px"
				},
				children: "Shop by Category"
			}), /* @__PURE__ */ jsx("div", {
				style: {
					display: "flex",
					gap: "16px",
					overflowX: "auto",
					paddingBottom: "16px",
					scrollbarWidth: "none"
				},
				children: CATEGORY_BANNERS.map((cat) => {
					const isActive = currentCategory === cat.value;
					return /* @__PURE__ */ jsxs("div", {
						onClick: () => handleCategoryChange(cat.value),
						style: {
							minWidth: "160px",
							height: "100px",
							borderRadius: "12px",
							position: "relative",
							overflow: "hidden",
							cursor: "pointer",
							border: isActive ? "3px solid var(--brown)" : "3px solid transparent",
							transition: "transform 0.2s ease",
							transform: isActive ? "scale(0.95)" : "scale(1)"
						},
						children: [
							/* @__PURE__ */ jsx("img", {
								src: cat.image,
								alt: cat.label,
								style: {
									width: "100%",
									height: "100%",
									objectFit: "cover"
								}
							}),
							/* @__PURE__ */ jsx("div", { style: {
								position: "absolute",
								inset: 0,
								backgroundColor: "rgba(0,0,0,0.4)"
							} }),
							/* @__PURE__ */ jsx("div", {
								style: {
									position: "absolute",
									inset: 0,
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									color: "#fff",
									fontWeight: 700,
									fontSize: "18px",
									textShadow: "0 2px 4px rgba(0,0,0,0.5)"
								},
								children: cat.label
							})
						]
					}, cat.value);
				})
			})]
		}), /* @__PURE__ */ jsxs("div", {
			className: "shop-layout",
			style: {
				display: "flex",
				gap: "32px"
			},
			children: [/* @__PURE__ */ jsxs("div", {
				className: "sidebar",
				style: {
					width: "250px",
					flexShrink: 0
				},
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "sidebar-title",
						style: {
							fontSize: "20px",
							fontWeight: 600,
							marginBottom: "24px"
						},
						children: "Filters"
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "filter-group",
						style: { marginBottom: "32px" },
						children: [/* @__PURE__ */ jsx("div", {
							className: "filter-group-title",
							style: {
								fontWeight: 600,
								marginBottom: "16px"
							},
							children: "Category List"
						}), /* @__PURE__ */ jsx("div", {
							className: "filter-opts",
							style: {
								display: "flex",
								flexDirection: "column",
								gap: "12px"
							},
							children: CATEGORY_BANNERS.map((cat) => /* @__PURE__ */ jsxs("label", {
								style: {
									display: "flex",
									alignItems: "center",
									gap: "8px",
									cursor: "pointer"
								},
								children: [/* @__PURE__ */ jsx("input", {
									type: "radio",
									name: "categoryGroup",
									checked: currentCategory === cat.value,
									onChange: () => handleCategoryChange(cat.value),
									style: { cursor: "pointer" }
								}), /* @__PURE__ */ jsx("span", {
									style: { fontWeight: currentCategory === cat.value ? 700 : 400 },
									children: cat.label
								})]
							}, cat.value))
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "filter-group",
						children: [/* @__PURE__ */ jsx("div", {
							className: "filter-group-title",
							style: {
								fontWeight: 600,
								marginBottom: "16px"
							},
							children: "Colour"
						}), /* @__PURE__ */ jsxs("div", {
							className: "color-row",
							style: {
								display: "flex",
								gap: "8px"
							},
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "c-swatch on",
									style: {
										background: "#1A1612",
										width: "30px",
										height: "30px",
										borderRadius: "50%"
									}
								}),
								/* @__PURE__ */ jsx("div", {
									className: "c-swatch",
									style: {
										background: "#FFF",
										border: "1px solid #ccc",
										width: "30px",
										height: "30px",
										borderRadius: "50%"
									}
								}),
								/* @__PURE__ */ jsx("div", {
									className: "c-swatch",
									style: {
										background: "#C8342A",
										width: "30px",
										height: "30px",
										borderRadius: "50%"
									}
								}),
								/* @__PURE__ */ jsx("div", {
									className: "c-swatch",
									style: {
										background: "#4A6741",
										width: "30px",
										height: "30px",
										borderRadius: "50%"
									}
								})
							]
						})]
					})
				]
			}), /* @__PURE__ */ jsxs("div", {
				className: "shop-main",
				style: { flexGrow: 1 },
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "shop-bar",
						style: {
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							marginBottom: "24px",
							paddingBottom: "16px",
							borderBottom: "1px solid var(--border)"
						},
						children: [/* @__PURE__ */ jsxs("div", {
							className: "shop-count",
							style: { fontWeight: 600 },
							children: [/* @__PURE__ */ jsx("span", {
								style: { fontSize: "20px" },
								children: displayProducts.length
							}), " items found"]
						}), /* @__PURE__ */ jsxs("select", {
							value: currentSort,
							onChange: handleSortChange,
							style: {
								padding: "8px 16px",
								borderRadius: "4px",
								border: "1px solid var(--border)",
								cursor: "pointer",
								outline: "none"
							},
							children: [
								/* @__PURE__ */ jsx("option", {
									value: "newest",
									children: "Newest First"
								}),
								/* @__PURE__ */ jsx("option", {
									value: "price-low",
									children: "Price: Low to High"
								}),
								/* @__PURE__ */ jsx("option", {
									value: "price-high",
									children: "Price: High to Low"
								})
							]
						})]
					}),
					error && /* @__PURE__ */ jsxs("div", {
						style: {
							padding: "16px",
							backgroundColor: "#FDF2F2",
							border: "1px solid #F8D7DA",
							color: "#9B1C1C",
							borderRadius: "6px",
							marginBottom: "24px",
							fontSize: "14px"
						},
						children: [
							"⚠️ ",
							/* @__PURE__ */ jsx("strong", { children: "Connection Notice:" }),
							" ",
							error
						]
					}),
					isLoading ? /* @__PURE__ */ jsx("div", {
						style: {
							padding: "48px",
							textAlign: "center"
						},
						children: "Loading listings..."
					}) : /* @__PURE__ */ jsx("div", {
						className: "shop-grid",
						style: {
							display: "grid",
							gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
							gap: "24px"
						},
						children: displayProducts.length === 0 ? /* @__PURE__ */ jsxs("div", {
							style: {
								gridColumn: "1 / -1",
								textAlign: "center",
								padding: "48px 0",
								color: "var(--brown-muted)"
							},
							children: [
								/* @__PURE__ */ jsx("div", {
									style: {
										fontSize: "32px",
										marginBottom: "12px"
									},
									children: "📦"
								}),
								/* @__PURE__ */ jsx("h3", { children: "No listings available for this category" }),
								/* @__PURE__ */ jsx("p", {
									style: {
										fontSize: "14px",
										marginTop: "4px"
									},
									children: "Try selecting a different filter."
								})
							]
						}) : displayProducts.map((product) => /* @__PURE__ */ jsx(ProductCard, { product }, product._id))
					})
				]
			})]
		})]
	});
});
//#endregion
//#region app/routes/sell.tsx
var sell_exports = /* @__PURE__ */ __exportAll({ default: () => sell_default });
var sell_default = UNSAFE_withComponentProps(function Sell() {
	const { user } = useAuth();
	const navigate = useNavigate();
	const fileInputRef = useRef(null);
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [price, setPrice] = useState("");
	const [category, setCategory] = useState("Women's");
	const [condition, setCondition] = useState("Good");
	const [imageUrl, setImages] = useState([]);
	const [previews, setPreviews] = useState([]);
	const [isUploading, setIsUploading] = useState(false);
	const handleImageChange = (e) => {
		if (e.target.files) {
			const selectedFiles = Array.from(e.target.files);
			if (imageUrl.length + selectedFiles.length > 5) return alert("You can only upload a maximum of 5 images.");
			setImages([...imageUrl, ...selectedFiles]);
			const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));
			setPreviews([...previews, ...newPreviews]);
		}
	};
	const removeImage = (indexToRemove) => {
		setImages(imageUrl.filter((_, index) => index !== indexToRemove));
		setPreviews(previews.filter((_, index) => index !== indexToRemove));
	};
	const handleUpload = async (e) => {
		e.preventDefault();
		if (imageUrl.length === 0) return alert("Please upload at least one image!");
		if (!user) return alert("You must be logged in to sell items.");
		setIsUploading(true);
		const formData = new FormData();
		formData.append("name", name);
		formData.append("description", description);
		formData.append("price", price);
		formData.append("category", category);
		formData.append("condition", condition);
		imageUrl.forEach((image) => {
			formData.append("images", image);
		});
		try {
			const response = await fetch("http://localhost:5000/api/products", {
				method: "POST",
				body: formData
			});
			const data = await response.json();
			if (response.ok) {
				alert("Item added to your closet successfully!");
				navigate("/shop");
			} else alert(data.message);
		} catch (error) {
			alert("Failed to upload item.");
		} finally {
			setIsUploading(false);
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "page-content",
		style: {
			maxWidth: "800px",
			margin: "0 auto",
			padding: "48px 24px"
		},
		children: [
			/* @__PURE__ */ jsxs("h1", {
				style: {
					fontFamily: "var(--font-display)",
					fontSize: "48px",
					color: "var(--brown)",
					marginBottom: "8px"
				},
				children: ["SELL YOUR ", /* @__PURE__ */ jsx("span", {
					style: { color: "var(--red)" },
					children: "FINDS"
				})]
			}),
			/* @__PURE__ */ jsx("p", {
				style: {
					color: "var(--brown-muted)",
					marginBottom: "32px"
				},
				children: "Add up to 5 photos to show off your item."
			}),
			/* @__PURE__ */ jsxs("form", {
				onSubmit: handleUpload,
				style: {
					display: "grid",
					gridTemplateColumns: "1fr 1fr",
					gap: "32px"
				},
				children: [/* @__PURE__ */ jsxs("div", {
					style: {
						display: "flex",
						flexDirection: "column",
						gap: "16px"
					},
					children: [imageUrl.length < 5 && /* @__PURE__ */ jsxs("div", {
						style: {
							aspectRatio: "4/5",
							border: "2px dashed var(--border)",
							borderRadius: "8px",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							backgroundColor: "var(--cream)",
							cursor: "pointer"
						},
						onClick: () => fileInputRef.current?.click(),
						children: [/* @__PURE__ */ jsxs("div", {
							style: {
								textAlign: "center",
								color: "var(--brown-muted)"
							},
							children: [/* @__PURE__ */ jsx("div", {
								style: {
									fontSize: "40px",
									marginBottom: "8px"
								},
								children: "📸"
							}), /* @__PURE__ */ jsx("div", {
								style: {
									fontSize: "13px",
									fontWeight: 600
								},
								children: "Click to upload (Max 5)"
							})]
						}), /* @__PURE__ */ jsx("input", {
							type: "file",
							ref: fileInputRef,
							style: { display: "none" },
							accept: "image/*",
							multiple: true,
							onChange: handleImageChange
						})]
					}), previews.length > 0 && /* @__PURE__ */ jsx("div", {
						style: {
							display: "grid",
							gridTemplateColumns: "repeat(3, 1fr)",
							gap: "8px"
						},
						children: previews.map((preview, index) => /* @__PURE__ */ jsxs("div", {
							style: {
								position: "relative",
								aspectRatio: "1/1",
								borderRadius: "4px",
								overflow: "hidden"
							},
							children: [/* @__PURE__ */ jsx("img", {
								src: preview,
								alt: "Preview",
								style: {
									width: "100%",
									height: "100%",
									objectFit: "cover"
								}
							}), /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => removeImage(index),
								style: {
									position: "absolute",
									top: "4px",
									right: "4px",
									background: "rgba(0,0,0,0.5)",
									color: "white",
									border: "none",
									borderRadius: "50%",
									width: "24px",
									height: "24px",
									cursor: "pointer",
									fontSize: "12px"
								},
								children: "✕"
							})]
						}, index))
					})]
				}), /* @__PURE__ */ jsxs("div", {
					style: {
						display: "flex",
						flexDirection: "column",
						gap: "20px"
					},
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "form-field",
							children: [/* @__PURE__ */ jsx("label", {
								className: "form-label",
								children: "Item Name"
							}), /* @__PURE__ */ jsx("input", {
								type: "text",
								className: "form-input",
								required: true,
								value: name,
								onChange: (e) => setName(e.target.value),
								placeholder: "e.g., Vintage Levi's 501"
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "form-row",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "form-field",
								children: [/* @__PURE__ */ jsx("label", {
									className: "form-label",
									children: "Price (₹)"
								}), /* @__PURE__ */ jsx("input", {
									type: "number",
									className: "form-input",
									required: true,
									value: price,
									onChange: (e) => setPrice(e.target.value),
									placeholder: "0.00"
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "form-field",
								children: [/* @__PURE__ */ jsx("label", {
									className: "form-label",
									children: "Condition"
								}), /* @__PURE__ */ jsxs("select", {
									className: "form-input",
									value: condition,
									onChange: (e) => setCondition(e.target.value),
									children: [
										/* @__PURE__ */ jsx("option", { children: "New with tags" }),
										/* @__PURE__ */ jsx("option", { children: "Like New" }),
										/* @__PURE__ */ jsx("option", { children: "Good" }),
										/* @__PURE__ */ jsx("option", { children: "Fair / Vintage Wear" })
									]
								})]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "form-field",
							children: [/* @__PURE__ */ jsx("label", {
								className: "form-label",
								children: "Category"
							}), /* @__PURE__ */ jsxs("select", {
								className: "form-input",
								value: category,
								onChange: (e) => setCategory(e.target.value),
								children: [
									/* @__PURE__ */ jsx("option", { children: "Women's" }),
									/* @__PURE__ */ jsx("option", { children: "Men's" }),
									/* @__PURE__ */ jsx("option", { children: "Shoes" }),
									/* @__PURE__ */ jsx("option", { children: "Accessories" }),
									/* @__PURE__ */ jsx("option", { children: "Vintage" })
								]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "form-field",
							children: [/* @__PURE__ */ jsx("label", {
								className: "form-label",
								children: "Description"
							}), /* @__PURE__ */ jsx("textarea", {
								className: "form-input",
								required: true,
								value: description,
								onChange: (e) => setDescription(e.target.value),
								placeholder: "Tell shoppers about the fit, fabric, and any flaws...",
								style: {
									minHeight: "120px",
									resize: "vertical"
								}
							})]
						}),
						/* @__PURE__ */ jsx("button", {
							type: "submit",
							className: "btn-primary",
							disabled: isUploading,
							style: {
								padding: "16px",
								marginTop: "auto"
							},
							children: isUploading ? "UPLOADING..." : "LIST ITEM →"
						})
					]
				})]
			})
		]
	});
});
//#endregion
//#region app/routes/about.tsx
var about_exports = /* @__PURE__ */ __exportAll({ default: () => about_default });
var about_default = UNSAFE_withComponentProps(function About() {
	return /* @__PURE__ */ jsxs("div", {
		className: "page-content",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "about-hero-vv",
				children: [
					/* @__PURE__ */ jsx("div", { className: "about-hero-bg" }),
					/* @__PURE__ */ jsx("div", {
						className: "about-hero-big",
						children: "VILLAGE"
					}),
					/* @__PURE__ */ jsx("div", {
						className: "about-hero-tag",
						children: "Our Mission"
					}),
					/* @__PURE__ */ jsxs("h1", {
						className: "about-hero-h1",
						children: ["ABOUT ", /* @__PURE__ */ jsx("span", { children: "US" })]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "about-hero-sub",
						children: "Sustainable shopping made accessible and fun."
					})
				]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "about-body",
				children: /* @__PURE__ */ jsxs("div", {
					className: "about-grid",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						className: "about-tag",
						children: "Our Story"
					}), /* @__PURE__ */ jsxs("h2", {
						className: "about-h2",
						children: [
							"Founded by thrifters,",
							/* @__PURE__ */ jsx("br", {}),
							/* @__PURE__ */ jsx("em", { children: "for thrifters." })
						]
					})] }), /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("p", {
						className: "about-p",
						children: "Value Village connects buyers and sellers for a circular fashion economy. We handpick items and ensure quality so shoppers can find hidden gems with confidence. We curate pre-loved fashion, vintage finds, and everyday essentials from trusted resellers across Canada."
					}) })]
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "stats-banner",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "stat-card",
						children: [/* @__PURE__ */ jsx("div", {
							className: "stat-big",
							children: "12K+"
						}), /* @__PURE__ */ jsx("div", {
							className: "stat-caption",
							children: "Items Listed"
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "stat-card",
						children: [/* @__PURE__ */ jsx("div", {
							className: "stat-big",
							children: "₹500"
						}), /* @__PURE__ */ jsx("div", {
							className: "stat-caption",
							children: "Avg. Price"
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "stat-card",
						children: [/* @__PURE__ */ jsx("div", {
							className: "stat-big",
							children: "4.9★"
						}), /* @__PURE__ */ jsx("div", {
							className: "stat-caption",
							children: "Seller Rating"
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "stat-card",
						children: [/* @__PURE__ */ jsx("div", {
							className: "stat-big",
							children: "85%"
						}), /* @__PURE__ */ jsx("div", {
							className: "stat-caption",
							children: "Seller Payout"
						})]
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "about-values",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "section-header",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						className: "section-eyebrow",
						children: "Join the community"
					}), /* @__PURE__ */ jsx("h2", {
						className: "section-title",
						style: { fontSize: "36px" },
						children: "SELL WITH US"
					})] }), /* @__PURE__ */ jsx(Link, {
						to: "/sell",
						children: /* @__PURE__ */ jsx("button", {
							className: "btn-primary",
							children: "Create Account"
						})
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "values-grid",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "value-card",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "value-icon",
									children: "♻️"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "value-title",
									children: "Circular Economy"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "value-desc",
									children: "Keep clothes out of landfills and give them a second life."
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "value-card",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "value-icon",
									children: "💰"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "value-title",
									children: "Keep 85%"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "value-desc",
									children: "We offer one of the highest seller payouts in the industry."
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "value-card",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "value-icon",
									children: "📦"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "value-title",
									children: "We Handle the Rest"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "value-desc",
									children: "Just list your items, and we provide the shipping labels and support."
								})
							]
						})
					]
				})]
			})
		]
	});
});
//#endregion
//#region app/routes/cart.tsx
var cart_exports = /* @__PURE__ */ __exportAll({ default: () => cart_default });
var cart_default = UNSAFE_withComponentProps(function Cart() {
	const { cartItems, removeFromCart, updateQuantity } = useCart();
	const subtotal = cartItems.reduce((sum, item) => sum + Number(item.price) * (item.quantity || 1), 0);
	const shipping = subtotal > 2e3 ? 0 : 150;
	const total = subtotal + shipping;
	const formatPrice = (amount) => {
		return new Intl.NumberFormat("en-IN", {
			style: "currency",
			currency: "INR",
			maximumFractionDigits: 0
		}).format(Number(amount));
	};
	if (cartItems.length === 0) return /* @__PURE__ */ jsxs("div", {
		className: "page-content",
		style: {
			backgroundColor: "var(--cream)",
			minHeight: "calc(100vh - 68px)",
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			justifyContent: "center",
			padding: "60px 20px"
		},
		children: [
			/* @__PURE__ */ jsx("div", {
				style: {
					fontSize: "80px",
					marginBottom: "24px",
					opacity: .5
				},
				children: /* @__PURE__ */ jsx(ShoppingCart, {
					size: "{80}",
					strokeWidth: "{1}"
				})
			}),
			/* @__PURE__ */ jsxs("h1", {
				style: {
					color: "var(--brown)",
					fontSize: "48px",
					textAlign: "center",
					margin: "0 0 16px 0"
				},
				children: ["YOUR CART IS ", /* @__PURE__ */ jsx("span", {
					style: { color: "var(--red)" },
					children: "EMPTY"
				})]
			}),
			/* @__PURE__ */ jsx("p", {
				style: {
					color: "var(--brown-muted)",
					marginBottom: "32px",
					fontSize: "15px",
					textAlign: "center",
					maxWidth: "400px"
				},
				children: "Looks like you haven't added anything yet. Discover unique thrifted pieces before they are gone!"
			}),
			/* @__PURE__ */ jsx(Link, {
				to: "/shop",
				children: /* @__PURE__ */ jsx("button", {
					style: {
						padding: "16px 32px",
						fontSize: "14px",
						backgroundColor: "var(--brown)",
						color: "#fff",
						border: "none",
						borderRadius: "8px",
						cursor: "pointer",
						fontWeight: 600
					},
					children: "+ EXPLORE THRIFT FINDS"
				})
			})
		]
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "page-content",
		style: {
			backgroundColor: "var(--cream)",
			minHeight: "calc(100vh - 68px)",
			padding: "48px 64px"
		},
		children: [/* @__PURE__ */ jsxs("h1", {
			style: {
				color: "var(--brown)",
				fontSize: "32px",
				marginBottom: "32px"
			},
			children: ["MY ", /* @__PURE__ */ jsx("span", { children: "CART" })]
		}), /* @__PURE__ */ jsxs("div", {
			style: {
				display: "grid",
				gridTemplateColumns: "2fr 1fr",
				gap: "48px",
				alignItems: "start"
			},
			children: [/* @__PURE__ */ jsx("div", {
				style: {
					display: "flex",
					flexDirection: "column",
					gap: "24px"
				},
				children: cartItems.map((item) => /* @__PURE__ */ jsxs("div", {
					style: {
						display: "flex",
						gap: "24px",
						backgroundColor: "#fff",
						padding: "24px",
						borderRadius: "12px",
						border: "1px solid var(--border-color)"
					},
					children: [/* @__PURE__ */ jsx("div", {
						style: {
							width: "120px",
							height: "120px",
							borderRadius: "8px",
							overflow: "hidden",
							backgroundColor: "#eee",
							flexShrink: 0
						},
						children: item.imageUrl && item.imageUrl.length > 0 ? /* @__PURE__ */ jsx("img", {
							src: item.imageUrl[0],
							alt: item.name,
							style: {
								width: "100%",
								height: "100%",
								objectFit: "cover"
							}
						}) : /* @__PURE__ */ jsx("div", {
							style: {
								width: "100%",
								height: "100%",
								display: "flex",
								alignItems: "center",
								justifyContent: "center"
							},
							children: "No Image"
						})
					}), /* @__PURE__ */ jsxs("div", {
						style: {
							flexGrow: 1,
							display: "flex",
							flexDirection: "column",
							justifyContent: "space-between"
						},
						children: [/* @__PURE__ */ jsxs("div", {
							style: {
								display: "flex",
								justifyContent: "space-between",
								alignItems: "flex-start"
							},
							children: [/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsxs("div", {
									style: {
										fontSize: "12px",
										color: "var(--text-muted)",
										marginBottom: "4px"
									},
									children: [
										item.category || "General",
										" • ",
										item.condition || "Used"
									]
								}),
								/* @__PURE__ */ jsx("div", {
									style: {
										fontSize: "18px",
										fontWeight: 600,
										color: "var(--text-main)",
										marginBottom: "8px"
									},
									children: item.name
								}),
								/* @__PURE__ */ jsx("div", {
									style: {
										fontSize: "16px",
										fontWeight: 700,
										color: "var(--text-main)"
									},
									children: formatPrice(item.price)
								})
							] }), /* @__PURE__ */ jsx("button", {
								onClick: () => removeFromCart(item._id),
								style: {
									background: "none",
									border: "none",
									color: "var(--red)",
									cursor: "pointer",
									fontSize: "20px"
								},
								children: /* @__PURE__ */ jsx(Trash2, { size: "{20}" })
							})]
						}), /* @__PURE__ */ jsxs("div", {
							style: {
								display: "flex",
								alignItems: "center",
								gap: "16px",
								marginTop: "16px"
							},
							children: [/* @__PURE__ */ jsx("span", {
								style: {
									fontSize: "14px",
									color: "var(--text-muted)"
								},
								children: "Quantity:"
							}), /* @__PURE__ */ jsxs("div", {
								style: {
									display: "flex",
									alignItems: "center",
									border: "1px solid var(--border-color)",
									borderRadius: "6px",
									overflow: "hidden"
								},
								children: [
									/* @__PURE__ */ jsx("button", {
										onClick: () => updateQuantity(item._id, (item.quantity || 1) - 1),
										style: {
											padding: "4px 12px",
											background: "var(--bg-base)",
											border: "none",
											cursor: "pointer"
										},
										children: "-"
									}),
									/* @__PURE__ */ jsx("span", {
										style: {
											padding: "4px 12px",
											background: "#fff",
											fontSize: "14px",
											fontWeight: 600
										},
										children: item.quantity || 1
									}),
									/* @__PURE__ */ jsx("button", {
										onClick: () => updateQuantity(item._id, (item.quantity || 1) + 1),
										style: {
											padding: "4px 12px",
											background: "var(--bg-base)",
											border: "none",
											cursor: "pointer"
										},
										children: "+"
									})
								]
							})]
						})]
					})]
				}, item._id))
			}), /* @__PURE__ */ jsxs("div", {
				style: {
					backgroundColor: "#fff",
					padding: "32px",
					borderRadius: "12px",
					border: "1px solid var(--border-color)",
					position: "sticky",
					top: "100px"
				},
				children: [
					/* @__PURE__ */ jsx("h2", {
						style: {
							fontSize: "20px",
							color: "var(--text-main)",
							marginBottom: "24px",
							borderBottom: "1px solid var(--border-color)",
							paddingBottom: "16px"
						},
						children: "Order Summary"
					}),
					/* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							flexDirection: "column",
							gap: "16px",
							marginBottom: "24px"
						},
						children: [/* @__PURE__ */ jsxs("div", {
							style: {
								display: "flex",
								justifyContent: "space-between",
								color: "var(--text-muted)",
								fontSize: "15px"
							},
							children: [/* @__PURE__ */ jsxs("span", { children: [
								"Subtotal (",
								cartItems.length,
								" items)"
							] }), /* @__PURE__ */ jsx("span", { children: formatPrice(subtotal) })]
						}), /* @__PURE__ */ jsxs("div", {
							style: {
								display: "flex",
								justifyContent: "space-between",
								color: "var(--text-muted)",
								fontSize: "15px"
							},
							children: [/* @__PURE__ */ jsx("span", { children: "Shipping" }), /* @__PURE__ */ jsx("span", { children: shipping === 0 ? /* @__PURE__ */ jsx("span", {
								style: {
									color: "green",
									fontWeight: 600
								},
								children: "Free"
							}) : formatPrice(shipping) })]
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							justifyContent: "space-between",
							color: "var(--text-main)",
							fontSize: "20px",
							fontWeight: 700,
							borderTop: "1px solid var(--border-color)",
							paddingTop: "24px",
							marginBottom: "32px"
						},
						children: [/* @__PURE__ */ jsx("span", { children: "Total" }), /* @__PURE__ */ jsx("span", { children: formatPrice(total) })]
					}),
					/* @__PURE__ */ jsx("button", {
						style: {
							width: "100%",
							padding: "16px",
							backgroundColor: "var(--brown)",
							color: "#fff",
							border: "none",
							borderRadius: "8px",
							fontSize: "16px",
							fontWeight: 600,
							cursor: "pointer",
							transition: "all 0.2s ease"
						},
						children: "PROCEED TO CHECKOUT"
					})
				]
			})]
		})]
	});
});
//#endregion
//#region app/routes/checkout.tsx
var checkout_exports = /* @__PURE__ */ __exportAll({});
//#endregion
//#region app/routes/wishlist.tsx
var wishlist_exports = /* @__PURE__ */ __exportAll({ default: () => wishlist_default });
var wishlist_default = UNSAFE_withComponentProps(function Wishlist() {
	const { wishlistItems, toggleWishlist } = useWishlist();
	const totalItems = wishlistItems.length;
	const totalPotentialSavings = wishlistItems.reduce((acc, item) => acc + (Number(item.price) || 0), 0);
	if (totalItems === 0) return /* @__PURE__ */ jsxs("div", {
		className: "page-content",
		style: {
			backgroundColor: "var(--cream)",
			minHeight: "calc(100vh - 68px)",
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			justifyContent: "center",
			padding: "60px 20px"
		},
		children: [
			/* @__PURE__ */ jsx("div", {
				style: {
					fontSize: "80px",
					marginBottom: "24px",
					opacity: .5
				},
				children: /* @__PURE__ */ jsx(Heart, {
					size: "{80}",
					strokeWidth: "{1}"
				})
			}),
			/* @__PURE__ */ jsxs("h1", {
				className: "wl-h1",
				style: {
					color: "var(--brown)",
					fontSize: "48px",
					textAlign: "center"
				},
				children: ["YOUR WISHLIST IS ", /* @__PURE__ */ jsx("span", {
					style: { color: "var(--red)" },
					children: "EMPTY"
				})]
			}),
			/* @__PURE__ */ jsx("p", {
				style: {
					color: "var(--brown-muted)",
					marginBottom: "32px",
					fontSize: "15px",
					textAlign: "center",
					maxWidth: "400px"
				},
				children: "You haven't saved any items yet. Start exploring our thrift finds and tap the heart icon to save your favourites for later!"
			}),
			/* @__PURE__ */ jsx(Link, {
				to: "/shop",
				children: /* @__PURE__ */ jsx("button", {
					className: "btn-primary",
					style: {
						padding: "16px 32px",
						fontSize: "14px"
					},
					children: "+ EXPLORE THRIFT FINDS"
				})
			})
		]
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "page-content",
		style: { backgroundColor: "var(--cream)" },
		children: [/* @__PURE__ */ jsxs("div", {
			className: "wl-hero",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "wl-hero-left",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "wl-eyebrow",
						children: "MY ACCOUNT"
					}),
					/* @__PURE__ */ jsxs("h1", {
						className: "wl-h1",
						children: ["MY ", /* @__PURE__ */ jsx("span", { children: "WISHLIST" })]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "wl-sub",
						children: "Saved finds · Price alerts · Collections"
					})
				]
			}), /* @__PURE__ */ jsxs("div", {
				className: "wl-stats",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
					className: "wl-stat-val",
					children: totalItems
				}), /* @__PURE__ */ jsx("div", {
					className: "wl-stat-label",
					children: "Items Saved"
				})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
					className: "wl-stat-val",
					children: ["₹", totalPotentialSavings]
				}), /* @__PURE__ */ jsx("div", {
					className: "wl-stat-label",
					children: "Potential Savings"
				})] })]
			})]
		}), /* @__PURE__ */ jsx("div", {
			className: "wl-layout",
			style: {
				gridTemplateColumns: "1fr",
				padding: "48px 64px"
			},
			children: /* @__PURE__ */ jsx("div", {
				className: "wl-grid",
				style: { marginTop: 0 },
				children: wishlistItems.map((item) => /* @__PURE__ */ jsxs("div", {
					className: "wl-card",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "wl-img-wrap",
						children: [
							item.imageUrl && item.imageUrl.length > 0 ? /* @__PURE__ */ jsx("img", {
								src: item.imageUrl[0],
								alt: item.name,
								style: {
									width: "100%",
									height: "100%",
									objectFit: "cover"
								}
							}) : /* @__PURE__ */ jsx("div", {
								style: {
									width: "100%",
									height: "100%",
									backgroundColor: "#eee",
									display: "flex",
									alignItems: "center",
									justifyContent: "center"
								},
								children: "No Image"
							}),
							/* @__PURE__ */ jsx("button", {
								className: "wl-card-heart",
								onClick: () => toggleWishlist(item),
								style: {
									border: "none",
									cursor: "pointer",
									position: "absolute",
									top: "10px",
									right: "10px",
									background: "#fff",
									borderRadius: "50%",
									padding: "8px"
								},
								children: /* @__PURE__ */ jsx(Heart, { fill: "currentColor" })
							}),
							/* @__PURE__ */ jsx("div", {
								className: "wl-hover-actions",
								children: /* @__PURE__ */ jsxs("button", {
									className: "wl-btn-add",
									children: [/* @__PURE__ */ jsx(ShoppingBag, { size: "{16}" }), " ADD TO CART"]
								})
							})
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "wl-info",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "wl-seller",
								children: [/* @__PURE__ */ jsx("span", { children: /* @__PURE__ */ jsx(Star, {
									fill: "currentColor",
									size: "{14}"
								}) }), " @value.village"]
							}),
							/* @__PURE__ */ jsx("div", {
								className: "wl-title",
								children: item.name
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "wl-meta",
								children: [
									/* @__PURE__ */ jsx("span", { children: item.category || "General" }),
									" • ",
									/* @__PURE__ */ jsx("span", { children: item.condition || "Used" })
								]
							}),
							/* @__PURE__ */ jsx("div", {
								className: "wl-price-row",
								children: /* @__PURE__ */ jsxs("div", {
									className: "wl-price-now",
									children: ["₹", item.price]
								})
							})
						]
					})]
				}, item._id))
			})
		})]
	});
});
//#endregion
//#region app/routes/product.$id.tsx
var product_$id_exports = /* @__PURE__ */ __exportAll({});
//#endregion
//#region \0virtual:react-router/server-manifest
var server_manifest_default = {
	"entry": {
		"module": "/assets/entry.client-CRiVoWGA.js",
		"imports": ["/assets/jsx-runtime-CH2KZ_ZK.js"],
		"css": []
	},
	"routes": {
		"root": {
			"id": "root",
			"parentId": void 0,
			"path": "",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/root-p_B5Nt2g.js",
			"imports": [
				"/assets/jsx-runtime-CH2KZ_ZK.js",
				"/assets/AuthContext-CYnmJ9KQ.js",
				"/assets/CartContext-ehT5WU0j.js",
				"/assets/WishlistContext-BJP3JZai.js",
				"/assets/proxy-CENKYBeg.js",
				"/assets/createLucideIcon-CE3FKFPd.js",
				"/assets/shopping-bag-B3z_Mz7d.js"
			],
			"css": ["/assets/root-xiXGbrww.css"],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/home": {
			"id": "routes/home",
			"parentId": "root",
			"path": void 0,
			"index": true,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/home-D_ZCa_29.js",
			"imports": [
				"/assets/jsx-runtime-CH2KZ_ZK.js",
				"/assets/ProductCard-DT-gxc0j.js",
				"/assets/proxy-CENKYBeg.js",
				"/assets/CartContext-ehT5WU0j.js",
				"/assets/WishlistContext-BJP3JZai.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/admin": {
			"id": "routes/admin",
			"parentId": "root",
			"path": "admin",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/admin-zQHqmwoU.js",
			"imports": ["/assets/jsx-runtime-CH2KZ_ZK.js", "/assets/AuthContext-CYnmJ9KQ.js"],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/login": {
			"id": "routes/login",
			"parentId": "root",
			"path": "login",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/login-BSaAFuQi.js",
			"imports": [
				"/assets/jsx-runtime-CH2KZ_ZK.js",
				"/assets/AuthContext-CYnmJ9KQ.js",
				"/assets/confetti.module-C2617tjR.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/register": {
			"id": "routes/register",
			"parentId": "root",
			"path": "register",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/register-BLANHGQQ.js",
			"imports": [
				"/assets/jsx-runtime-CH2KZ_ZK.js",
				"/assets/AuthContext-CYnmJ9KQ.js",
				"/assets/confetti.module-C2617tjR.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/shop": {
			"id": "routes/shop",
			"parentId": "root",
			"path": "shop",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/shop-Dj95PlvU.js",
			"imports": [
				"/assets/jsx-runtime-CH2KZ_ZK.js",
				"/assets/ProductCard-DT-gxc0j.js",
				"/assets/CartContext-ehT5WU0j.js",
				"/assets/WishlistContext-BJP3JZai.js",
				"/assets/proxy-CENKYBeg.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/sell": {
			"id": "routes/sell",
			"parentId": "root",
			"path": "sell",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/sell-BwB1nJNc.js",
			"imports": ["/assets/jsx-runtime-CH2KZ_ZK.js", "/assets/AuthContext-CYnmJ9KQ.js"],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/about": {
			"id": "routes/about",
			"parentId": "root",
			"path": "about",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/about-DXr3UuIF.js",
			"imports": ["/assets/jsx-runtime-CH2KZ_ZK.js"],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/cart": {
			"id": "routes/cart",
			"parentId": "root",
			"path": "cart",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/cart-xW3nUnK0.js",
			"imports": [
				"/assets/jsx-runtime-CH2KZ_ZK.js",
				"/assets/CartContext-ehT5WU0j.js",
				"/assets/createLucideIcon-CE3FKFPd.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/checkout": {
			"id": "routes/checkout",
			"parentId": "root",
			"path": "checkout",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": false,
			"hasErrorBoundary": false,
			"module": "/assets/checkout-BvRk9kiK.js",
			"imports": [],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/wishlist": {
			"id": "routes/wishlist",
			"parentId": "root",
			"path": "wishlist",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/wishlist-CqTCW_S7.js",
			"imports": [
				"/assets/jsx-runtime-CH2KZ_ZK.js",
				"/assets/WishlistContext-BJP3JZai.js",
				"/assets/createLucideIcon-CE3FKFPd.js",
				"/assets/shopping-bag-B3z_Mz7d.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/product.$id": {
			"id": "routes/product.$id",
			"parentId": "root",
			"path": "product/:id",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": false,
			"hasErrorBoundary": false,
			"module": "/assets/product._id-BvRk9kiK.js",
			"imports": [],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		}
	},
	"url": "/assets/manifest-91608993.js",
	"version": "91608993",
	"sri": void 0
};
//#endregion
//#region \0virtual:react-router/server-build
var assetsBuildDirectory = "build\\client";
var basename = "/";
var future = {
	"unstable_optimizeDeps": false,
	"v8_passThroughRequests": true,
	"v8_trailingSlashAwareDataRequests": true,
	"unstable_previewServerPrerendering": false,
	"v8_middleware": true,
	"v8_splitRouteModules": true,
	"v8_viteEnvironmentApi": true
};
var ssr = true;
var isSpaMode = false;
var prerender = [];
var routeDiscovery = {
	"mode": "lazy",
	"manifestPath": "/__manifest"
};
var publicPath = "/";
var entry = { module: entry_server_node_exports };
var routes = {
	"root": {
		id: "root",
		parentId: void 0,
		path: "",
		index: void 0,
		caseSensitive: void 0,
		module: root_exports
	},
	"routes/home": {
		id: "routes/home",
		parentId: "root",
		path: void 0,
		index: true,
		caseSensitive: void 0,
		module: home_exports
	},
	"routes/admin": {
		id: "routes/admin",
		parentId: "root",
		path: "admin",
		index: void 0,
		caseSensitive: void 0,
		module: admin_exports
	},
	"routes/login": {
		id: "routes/login",
		parentId: "root",
		path: "login",
		index: void 0,
		caseSensitive: void 0,
		module: login_exports
	},
	"routes/register": {
		id: "routes/register",
		parentId: "root",
		path: "register",
		index: void 0,
		caseSensitive: void 0,
		module: register_exports
	},
	"routes/shop": {
		id: "routes/shop",
		parentId: "root",
		path: "shop",
		index: void 0,
		caseSensitive: void 0,
		module: shop_exports
	},
	"routes/sell": {
		id: "routes/sell",
		parentId: "root",
		path: "sell",
		index: void 0,
		caseSensitive: void 0,
		module: sell_exports
	},
	"routes/about": {
		id: "routes/about",
		parentId: "root",
		path: "about",
		index: void 0,
		caseSensitive: void 0,
		module: about_exports
	},
	"routes/cart": {
		id: "routes/cart",
		parentId: "root",
		path: "cart",
		index: void 0,
		caseSensitive: void 0,
		module: cart_exports
	},
	"routes/checkout": {
		id: "routes/checkout",
		parentId: "root",
		path: "checkout",
		index: void 0,
		caseSensitive: void 0,
		module: checkout_exports
	},
	"routes/wishlist": {
		id: "routes/wishlist",
		parentId: "root",
		path: "wishlist",
		index: void 0,
		caseSensitive: void 0,
		module: wishlist_exports
	},
	"routes/product.$id": {
		id: "routes/product.$id",
		parentId: "root",
		path: "product/:id",
		index: void 0,
		caseSensitive: void 0,
		module: product_$id_exports
	}
};
var allowedActionOrigins = false;
//#endregion
export { allowedActionOrigins, server_manifest_default as assets, assetsBuildDirectory, basename, entry, future, isSpaMode, prerender, publicPath, routeDiscovery, routes, ssr };

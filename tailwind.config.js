/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
    theme: {
        extend: {
            colors: {
                "surface-container-lowest": "#0c0e14",
                "background": "#12131a",
                "on-error": "#690005",
                "on-primary-fixed-variant": "#454747",
                "on-tertiary-container": "#676460",
                "surface-dim": "#12131a",
                "on-primary-fixed": "#1a1c1c",
                "on-surface": "#e2e1eb",
                "on-background": "#e2e1eb",
                "on-secondary-fixed": "#1b1b1e",
                "secondary-container": "#47464a",
                "tertiary-container": "#e7e1dd",
                "outline": "#8e9192",
                "on-error-container": "#ffdad6",
                "surface-container-high": "#282a31",
                "secondary-fixed": "#e4e1e6",
                "on-surface-variant": "#c4c7c8",
                "surface": "#12131a",
                "surface-tint": "#c6c6c7",
                "primary-fixed-dim": "#c6c6c7",
                "inverse-surface": "#e2e1eb",
                "surface-bright": "#383940",
                "error": "#ffb4ab",
                "primary": "#ffffff",
                "primary-fixed": "#e2e2e2",
                "on-secondary-fixed-variant": "#47464a",
                "tertiary-fixed-dim": "#cbc6c1",
                "inverse-primary": "#5d5f5f",
                "error-container": "#93000a",
                "on-secondary-container": "#b6b4b8",
                "inverse-on-surface": "#2f3037",
                "primary-container": "#e2e2e2",
                "surface-container": "#1e1f26",
                "tertiary-fixed": "#e7e1dd",
                "on-tertiary-fixed": "#1d1b19",
                "outline-variant": "#444748",
                "tertiary": "#ffffff",
                "secondary-fixed-dim": "#c8c5ca",
                "on-primary": "#2f3131",
                "surface-container-highest": "#33343c",
                "surface-variant": "#33343c",
                "on-tertiary": "#32302d",
                "on-secondary": "#303033",
                "secondary": "#c8c5ca",
                "on-primary-container": "#636565",
                "on-tertiary-fixed-variant": "#494643",
                "surface-container-low": "#1a1b22",
                // Shadcn UI fallback variables (mapped to the new colors where possible)
                foreground: "#e2e1eb",
                card: {
                    DEFAULT: "#1e1f26",
                    foreground: "#e2e1eb",
                },
                popover: {
                    DEFAULT: "#1e1f26",
                    foreground: "#e2e1eb",
                },
                muted: {
                    DEFAULT: "#33343c",
                    foreground: "#c4c7c8",
                },
                accent: {
                    DEFAULT: "#33343c",
                    foreground: "#ffffff",
                },
                destructive: {
                    DEFAULT: "#ffb4ab",
                    foreground: "#690005",
                },
                border: "rgba(255, 255, 255, 0.08)",
                input: "rgba(255, 255, 255, 0.08)",
                ring: "#ffffff",
            },
            borderRadius: {
                DEFAULT: "0.5rem",
                sm: "0.25rem",
                md: "0.75rem",
                lg: "1rem",
                xl: "1.5rem",
                full: "9999px"
            },
            spacing: {
                "base": "4px",
                "xs": "4px",
                "sm": "8px",
                "md": "16px",
                "lg": "24px",
                "xl": "32px",
                "xxl": "48px",
                "gutter": "16px",
                "margin-desktop": "48px",
                "margin-mobile": "16px"
            },
            fontFamily: {
                "display-lg": ["Hanken Grotesk", "sans-serif"],
                "display-lg-mobile": ["Hanken Grotesk", "sans-serif"],
                "headline-lg": ["Hanken Grotesk", "sans-serif"],
                "headline-md": ["Hanken Grotesk", "sans-serif"],
                "body-lg": ["Inter", "sans-serif"],
                "body-md": ["Inter", "sans-serif"],
                "body-sm": ["Inter", "sans-serif"],
                "label-md": ["Geist", "sans-serif"],
                "label-sm": ["Geist", "sans-serif"],
                sans: ["Inter", "sans-serif"]
            },
            fontSize: {
                "display-lg": ["48px", { lineHeight: "56px", letterSpacing: "-0.02em", fontWeight: "700" }],
                "display-lg-mobile": ["36px", { lineHeight: "40px", letterSpacing: "-0.02em", fontWeight: "700" }],
                "headline-lg": ["32px", { lineHeight: "40px", letterSpacing: "-0.01em", fontWeight: "600" }],
                "headline-md": ["24px", { lineHeight: "32px", fontWeight: "600" }],
                "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
                "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
                "body-sm": ["14px", { lineHeight: "20px", fontWeight: "400" }],
                "label-md": ["12px", { lineHeight: "16px", letterSpacing: "0.05em", fontWeight: "500" }],
                "label-sm": ["10px", { lineHeight: "12px", letterSpacing: "0.08em", fontWeight: "600" }]
            },
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' }
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' }
                }
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out'
            }
        }
    },
    plugins: [require("tailwindcss-animate")],
}

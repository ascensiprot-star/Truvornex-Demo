/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
    theme: {
        extend: {
            colors: {
                /* ── Theme-aware colors (respect CSS variables) ── */
                "background":               "var(--color-bg)",
                "surface":                  "var(--color-surface)",
                "surface-container":        "var(--color-surface)",
                "surface-container-low":    "var(--color-surface-low)",
                "surface-container-high":   "var(--color-surface-high)",
                "surface-container-highest":"var(--color-surface-highest)",
                "surface-container-lowest": "var(--color-surface-lowest)",
                "surface-dim":              "var(--color-bg)",
                "surface-bright":           "var(--color-surface-highest)",
                "surface-variant":          "var(--color-surface-highest)",
                "primary":                  "var(--color-primary)",
                "on-primary":               "var(--color-on-primary)",
                "on-background":            "var(--color-text)",
                "on-surface":               "var(--color-text)",
                "on-surface-variant":       "var(--color-text-muted)",
                "outline":                  "var(--color-text-subtle)",
                "outline-variant":          "var(--color-border)",
                "accent-purple":            "var(--color-accent)",

                /* ── Static semantic colors ── */
                "error":                    "#ef4444",
                "on-error":                 "#ffffff",
                "error-container":          "#fca5a5",
                "on-error-container":       "#7f1d1d",
                "secondary":                "#94a3b8",
                "on-secondary":             "#ffffff",
                "secondary-container":      "var(--color-surface-high)",
                "on-secondary-container":   "var(--color-text-muted)",
                "tertiary":                 "var(--color-primary)",
                "on-tertiary":              "var(--color-on-primary)",
                "tertiary-container":       "var(--color-surface-high)",
                "inverse-surface":          "var(--color-primary)",
                "inverse-on-surface":       "var(--color-on-primary)",
                "inverse-primary":          "var(--color-bg)",
                "primary-container":        "var(--color-surface-high)",
                "on-primary-container":     "var(--color-text-muted)",
                "primary-fixed":            "var(--color-surface-high)",
                "primary-fixed-dim":        "var(--color-surface-highest)",
                "on-primary-fixed":         "var(--color-text)",
                "on-primary-fixed-variant": "var(--color-text-muted)",
                "surface-tint":             "var(--color-accent)",

                /* ── Shadcn button fix — primary-foreground must map to on-primary ── */
                "primary-foreground": "var(--color-on-primary)",

                /* ── Shadcn compatibility ── */
                foreground:     "var(--color-text)",
                card: {
                    DEFAULT:    "var(--color-surface)",
                    foreground: "var(--color-text)",
                },
                popover: {
                    DEFAULT:    "var(--color-surface)",
                    foreground: "var(--color-text)",
                },
                muted: {
                    DEFAULT:    "var(--color-surface-high)",
                    foreground: "var(--color-text-muted)",
                },
                accent: {
                    DEFAULT:    "var(--color-surface-high)",
                    foreground: "var(--color-primary)",
                },
                destructive: {
                    DEFAULT:    "#ef4444",
                    foreground: "#ffffff",
                },
                border: "var(--color-border)",
                input:  "var(--color-surface-high)",
                ring:   "var(--color-primary)",
            },
            borderRadius: {
                DEFAULT: "0.5rem",
                sm:  "0.375rem",
                md:  "0.75rem",
                lg:  "1rem",
                xl:  "1.25rem",
                "2xl": "1.5rem",
                full: "9999px"
            },
            spacing: {
                "xs":  "4px",
                "sm":  "8px",
                "md":  "16px",
                "lg":  "24px",
                "xl":  "32px",
                "xxl": "48px",
                "margin-desktop": "48px",
                "margin-mobile":  "16px",
            },
            fontFamily: {
                "display":  ["Plus Jakarta Sans", "sans-serif"],
                "headline": ["Plus Jakarta Sans", "sans-serif"],
                sans: ["Plus Jakarta Sans", "sans-serif"],
                inter: ["Plus Jakarta Sans", "sans-serif"],
            },
            fontSize: {
                /* ── Standard readable scale ── */
                "xs":    ["12px",   { lineHeight: "17px" }],
                "sm":    ["14px",   { lineHeight: "20px" }],
                "base":  ["16px",   { lineHeight: "24px" }],
                "lg":    ["18px",   { lineHeight: "27px" }],
                "xl":    ["20px",   { lineHeight: "28px", letterSpacing: "-0.015em" }],
                "2xl":   ["24px",   { lineHeight: "32px", letterSpacing: "-0.025em" }],
                "3xl":   ["30px",   { lineHeight: "38px", letterSpacing: "-0.03em" }],
                "4xl":   ["36px",   { lineHeight: "44px", letterSpacing: "-0.035em" }],
                "5xl":   ["48px",   { lineHeight: "56px", letterSpacing: "-0.04em" }],
                "6xl":   ["60px",   { lineHeight: "68px", letterSpacing: "-0.045em" }],
                /* ── Custom semantic tokens ── */
                "display-lg":        ["52px",  { lineHeight: "60px",  letterSpacing: "-0.04em", fontWeight: "700" }],
                "display-lg-mobile": ["34px",  { lineHeight: "40px",  letterSpacing: "-0.03em", fontWeight: "700" }],
                "headline-lg":       ["28px",  { lineHeight: "36px",  letterSpacing: "-0.025em", fontWeight: "600" }],
                "headline-md":       ["22px",  { lineHeight: "30px",  fontWeight: "600" }],
                "body-lg":           ["17px",  { lineHeight: "26px",  fontWeight: "400" }],
                "body-md":           ["15px",  { lineHeight: "23px",  fontWeight: "400" }],
                "body-sm":           ["14px",  { lineHeight: "21px",  fontWeight: "400" }],
                "label-md":          ["13px",  { lineHeight: "18px",  letterSpacing: "0.03em", fontWeight: "500" }],
                "label-sm":          ["11px",  { lineHeight: "15px",  letterSpacing: "0.05em", fontWeight: "600" }],
            },
            boxShadow: {
                'sm':  'var(--shadow-sm)',
                'md':  'var(--shadow-md)',
                'lg':  'var(--shadow-lg)',
                'glow': '0 0 20px var(--color-accent-light)',
            },
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to:   { height: 'var(--radix-accordion-content-height)' }
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to:   { height: '0' }
                },
                'slide-up': {
                    from: { transform: 'translateY(8px)', opacity: '0' },
                    to:   { transform: 'translateY(0)',   opacity: '1' }
                },
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up':   'accordion-up 0.2s ease-out',
                'slide-up':       'slide-up 0.25s ease-out',
            }
        }
    },
    plugins: [require("tailwindcss-animate")],
}

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [],
  theme: {
    screens: {
      iphone5: "320px",
      // => @media (min-width: 320px) { for iphone 5 }

      samsg: "360px",
      // => @media (min-width: 320px) { for Samsung phone }

      xxxs: "360px",
      // => @media (min-width: 380px) { ... }

      xxs: "380px",
      // => @media (min-width: 380px) { ... }

      xs: "512px",
      // => @media (min-width: 512px) { ... }

      sm: "640px",
      // => @media (min-width: 640px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }
      mdx: "800px",
      // => @media (min-width: 800px) { ... }
      mdxx: "850px",
      // => @media (min-width: 850px) { ... }

      lg: "1024px",
      // => @media (min-width: 1024px) { ... }

      xl: "1280px",
      // => @media (min-width: 1280px) { ... }

      "2xl": "1536px",
      // => @media (min-width: 1536px) { ... }

      "3xl": "1600px",
      // => @media (min-width: 1600px) { ... }

      "4xl": "1920px",
      // => @media (min-width: 1920px) { ... }
    },
    extend: {
      boxShadow: {
        "3xl": "0 35px 60px -15px rgba(0, 0, 0, 0.3)",
        opaq: "0 4px 16px 6px rgba(0,0,0,0.4)",
        full: "0 3px 1px -2px rgba(0,0,0, 0.2), 0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12) ",
      },
      colors: {
        // Brand Colors
        primary: {
          light: "#1E40AFFF", // blue-600
          dark: "#60A5FA", // blue-400
        },
        accent: {
          light: "#FBBF24", // yellow-400
          dark: "#FACC15", // yellow-300
        },
        danger: {
          light: "#EF4444", // red-500
          dark: "#F87171", // red-400
        },
        success: {
          light: "#10B981", // green-500
          dark: "#6EE7B7", // green-300
        },
        neutral: {
          light: "#64748B", // slate-500
          dark: "#CBD5E1", // slate-300
        },

        // Backgrounds & Cards
        background: {
          light: "#F9FAFB", // gray-50
          dark: "#0F172A", // slate-900
        },
        card: {
          light: "#FFFFFF",
          dark: "#1E293B", // slate-800
        },

        // Text
        textPrimary: {
          light: "#111827",
          dark: "#F1F5F9",
        },
        textSecondary: {
          light: "#6B7280",
          dark: "#94A3B8",
        },

        // Border
        borderColor: {
          light: "#E5E7EB",
          dark: "#334155",
        },

        // Urgency Tags
        urgency: {
          normal: {
            text: "#2563EB",
            bgLight: "#DBEAFE",
            bgDark: "#1E3A8A",
          },
          important: {
            text: "#92400E",
            bgLight: "#FEF3C7",
            bgDark: "#78350F",
          },
          critical: {
            text: "#B91C1C",
            bgLight: "#FECACA",
            bgDark: "#7F1D1D",
          },
        },
      },
      fontFamily: {
        sans: ['"Noto Sans"', '"Noto Sans Ethiopic"', "sans-serif"],
        heading: ['"Playfair Display"', "serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};

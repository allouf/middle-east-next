import type { Config } from "tailwindcss";

const config: Config = {
  important: "#root",
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        somar: ['Somar Sans Regular', 'sans-serif'],
        'somar-medium': ['Somar Sans Medium', 'sans-serif'],
        'somar-semibold': ['Somar Sans SemiBold', 'sans-serif'],
        'somar-bold': ['Somar Sans Bold', 'sans-serif'],
        'somar-light': ['Somar Sans Light', 'sans-serif'],
        'somar-expanded': ["var(--font-somar-sans-expanded)", "sans-serif"],
        expanded: ["var(--font-somar-sans-expanded)", "sans-serif"],
      },
      colors: {
        bgGray: "var(--bgGray)",
        bgWhite: "var(--bgWhite)",
        bgOffWhite: "var(--bgOffWhite)",
        blueLight: "var(--blueLight)",
        blueLightHover: "var(--blueLightHover)",
        blueIcons: "var(--blueIcons)",
        blueBtn: "var(--blueBtn)",
        blueSiteSecondary: "var(--blueSiteSecondary)",
        blueSite: "var(--SiteColor)",
        blueSiteHover: "var(--blueSiteHover)",
        textColor: "var(--textColor)",
        textWhiteColor: "var(--textWhiteColor)",
        textGrayColor: "var(--textGrayColor)",
        subTitleColor: "var(--subTitleColor)",
        grayLight: "var(--grayLight)",
        grayLight2: "var(--grayLight2)",
        darkbg: "var(--darkbg)",
        grayBorder: "var(--grayBorder)",
        lightGreen: "var(--lightGreen)",
      },
      boxShadow: {
        custom:
          "inset 20px 10px 20px rgba(0, 0, 0, 0.1), 15px 20px 10px rgba(0, 0, 0, 0.1), 15px 20px 20px rgba(0, 0, 0, 0.1), inset -10px -10px 15px rgba(255, 255, 255, 0.6)",
        customTwo:
          "inset 10px 10px 10px rgba(0, 0, 0, 0.1), 10px 10px 10px rgba(0, 0, 0, 0.1), 15px 15px 20px rgba(0, 0, 0, 0.1), inset -10px -10px 15px rgba(255, 255, 255, 0.5)",
        bottom: "1px 8px 10px 1px rgba(0,0,0,0.2)",
      },
      borderRadius: {
        custom: "57% 43% 37% 63% / 45% 52% 48% 55%",
        customTwo: "64% 36% 42% 58% / 42% 37% 63% 58% ",
        customThree: "49% 51% 42% 58% / 56% 47% 53% 44% ",
      },
      animation: {
        slideFade: "slideFade 1s ease-out forwards",
      },
      keyframes: {
        slideFade: {
          "0%": { opacity: "0", transform: "translateY(-200px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      maxWidth: {
        "8xl": "88rem",
      },
      backgroundColor: {
        disabled: "var(--lightGreen)",
      },
    },
  },
  plugins: [],
};

export default config;


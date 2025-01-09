// const srcTailwind = require("./src/tailwind");
/** @type {import('tailwindcss').Config} */
import type { Config } from "tailwindcss";
const config: Config = {
	// presets: [srcTailwind],
	content: ["./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {},
	},
	plugins: [],
};

export default config;

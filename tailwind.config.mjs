/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				siitec: {
					dark: '#1B315E',   // Azul oscuro institucional
					light: '#5CA4D8',  // Azul cyan/claro de los circuitos
					accent: '#F9B233', // Amarillo/Naranja del punto
					gray: '#F3F4F6'    // Un gris muy suave para fondos
				}
			},
			fontFamily: {
				sans: ['Inter', 'sans-serif'], 
			}
		},
	},
	plugins: [],
}
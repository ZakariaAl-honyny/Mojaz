import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				'50': '#E6F2EC',
  				'100': '#B3D9C4',
  				'200': '#80C09C',
  				'300': '#4DA674',
  				'400': '#1A8D4C',
  				'500': '#006C35',
  				'600': '#005C2D',
  				'700': '#004C25',
  				'800': '#003C1D',
  				'900': '#002C15',
  				DEFAULT: '#006C35'
  			},
  			secondary: {
  				'50': '#FFF8E1',
  				'100': '#FFECB3',
  				'200': '#FFE082',
  				'300': '#FFD54F',
  				'400': '#FFCA28',
  				'500': '#D4A017',
  				'600': '#C49000',
  				'700': '#A67C00',
  				'800': '#8D6A00',
  				'900': '#6D5200',
  				DEFAULT: '#D4A017'
  			},
        status: {
          success: '#10B981',
          warning: '#F59E0B',
          error:   '#EF4444',
          info:    '#3B82F6',
        },
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)',
        gov: '8px'
  		},
      fontFamily: {
        arabic: ['IBM Plex Sans Arabic', 'Cairo', 'sans-serif'],
        english: ['Inter', 'IBM Plex Sans', 'sans-serif'],
      },
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;

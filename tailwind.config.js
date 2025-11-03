/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',

    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
    colors: {
        // Zama brand colors
        'zama-yellow': '#FFD208',
        'zama-black': '#000000',
        'zama-gray': {
          50: '#f5f5f5',
          100: '#e0e0e0',
          200: '#888888',
          300: '#666666',
          400: '#333333',
          500: '#2a2a2a',
          600: '#1a1a1a',
          700: '#000000',
        },
        'zama-green': '#4caf50',
        'zama-red': '#f44336',
        'zama-orange': '#ff9800',
        'zama-blue': '#007bff',

        background: "oklch(1 0 0)",
        foreground: "oklch(0.145 0 0)",
        card: {
          DEFAULT: "hsl(oklch(1 0 0))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "oklch(0.205 0 0)",
          foreground: "oklch(0.205 0 0)",
        },
        secondary: {
          DEFAULT: "oklch(0.97 0 0)",
          foreground: "oklch(0.97 0 0)",
        },
        muted: {
          DEFAULT: "oklch(0.556 0 0)",
          foreground: "oklch(0.556 0 0)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "oklch(0.577 0.245 27.325)",
          foreground: "oklch(0.577 0.245 27.325)",
        },
        // border: "hsl(var(--border))",
        border: "oklch(0.922 0 0)",
        input: "oklch(0.922 0 0)",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      fontFamily: {
        'system': ['system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'zama': '0 4px 12px rgba(0, 0, 0, 0.3)',
      },
    },
  },
   plugins: [],
}




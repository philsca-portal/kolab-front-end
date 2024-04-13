/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "wave": {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(10deg)" },
          "50%": { transform: "rotate(0deg)" },
          "75%": { transform: "rotate(40deg)" },
        },
        "opacity-transition": {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        "opacity-scale-transition": {
          from: { opacity: 0, transform: "scale(0.8)" },
          to: { opacity: 1, transform: "scale(1)" },
        },
        "opacity-translate-from-left-transition": {
          from: { opacity: 0, transform: "translate(-50px)" },
          to: { opacity: 1, transform: "translate(0px)" },
        },
        // firstimage
          "opacity-translate-from-left-transition-large": {
            from: { opacity: 0, transform: "translate(-29rem,18rem)" },
            to: { opacity: 1, transform: "translate(-26rem,18rem)" },
          },
          "opacity-translate-from-left-transition-medium": {
            from: { opacity: 0, transform: "translate(-22rem,15rem)" },
            to: { opacity: 1, transform: "translate(-19rem,15rem)" },
          },
          "opacity-translate-from-left-transition-small": {
            from: { opacity: 0, transform: "translate(-15rem,11rem)" },
            to: { opacity: 1, transform: "translate(-12rem,11rem)" },
          },
          "opacity-translate-from-left-transition-mobile": {
            from: { opacity: 0, transform: "translate(-9.5rem,8rem)" },
            to: { opacity: 1, transform: "translate(-6.5rem,8rem)" },
          },
        //
        "opacity-translate-from-right-transition": {
          from: { opacity: 0, transform: "translate(50px)" },
          to: { opacity: 1, transform: "translate(0px)" },
        },
        // second image
          "opacity-translate-from-right-transition-large": {
            from: { opacity: 0, transform: "translate(27rem,-13rem)" },
            to: { opacity: 1, transform: "translate(24rem,-13rem)" },
          },
          "opacity-translate-from-right-transition-medium": {
            from: { opacity: 0, transform: "translate(21rem,-13rem)" },
            to: { opacity: 1, transform: "translate(18rem,-13rem)" },
          },
          "opacity-translate-from-right-transition-small": {
            from: { opacity: 0, transform: "translate(17rem,-9rem)" },
            to: { opacity: 1, transform: "translate(14rem,-9rem)" },
          },
          "opacity-translate-from-right-transition-mobile": {
            from: { opacity: 0, transform: "translate(10.5rem,-6rem)" },
            to: { opacity: 1, transform: "translate(7.5rem,-6rem)" },
          },
        // 
        "opacity-translate-from-top-transition": {
          from: { opacity: 0, transform: "translateY(-50px)" },
          to: { opacity: 1, transform: "translateY(0px)" },
        },
        // third image
          "opacity-translate-from-top-transition-large": {
            from: { opacity: 0, transform: "translate(-5rem,-21rem)" },
            to: { opacity: 1, transform: "translate(-5rem,-18rem)" },
          },
          "opacity-translate-from-top-transition-medium": {
            from: { opacity: 0, transform: "translate(-4rem,-17rem)" },
            to: { opacity: 1, transform: "translate(-4rem,-14rem)" },
          },
          "opacity-translate-from-top-transition-small": {
            from: { opacity: 0, transform: "translate(-3rem,-13rem)" },
            to: { opacity: 1, transform: "translate(-3rem,-10rem)" },
          },
          "opacity-translate-from-top-transition-mobile": {
            from: { opacity: 0, transform: "translate(-2.5rem,-10rem)" },
            to: { opacity: 1, transform: "translate(-2.5rem,-7rem)" },
          },
        // 
        "opacity-translate-from-bottom-transition": {
          from: { opacity: 0, transform: "translateY(50px)" },
          to: { opacity: 1, transform: "translateY(0px)" },
        },
        // fourth image
          "opacity-translate-from-bottom-transition-large": {
            from: { opacity: 0, transform: "translate(15rem,15rem)" },
            to: { opacity: 1, transform: "translate(15rem,12rem)" },
          },
          "opacity-translate-from-bottom-transition-medium": {
            from: { opacity: 0, transform: "translate(13rem,13rem)" },
            to: { opacity: 1, transform: "translate(13rem,10rem)" },
          },
          "opacity-translate-from-bottom-transition-small": {
            from: { opacity: 0, transform: "translate(10rem,10rem)" },
            to: { opacity: 1, transform: "translate(10rem,7rem)" },
          },
          "opacity-translate-from-bottom-transition-mobile": {
            from: { opacity: 0, transform: "translate(6rem,9rem)" },
            to: { opacity: 1, transform: "translate(6rem,6rem)" },
          },
          "loader-spin": {
            from: { transform: "rotate(0deg)" },
            to: { transform: "rotate(360deg)" },
          },
        //
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "wave": "wave 1.5s infinite",
        "opacity-transition-1sec": "opacity-transition 1s forwards",
        "opacity-transition": "opacity-transition 2s forwards",
        "opacity-scale-transition": "opacity-scale-transition 2s forwards",
        "opacity-translate-from-left-transition-1sec": "opacity-translate-from-left-transition 1s forwards",
        "opacity-translate-from-left-transition": "opacity-translate-from-left-transition 2s forwards",
        // first image
          "opacity-translate-from-left-transition-large": "opacity-translate-from-left-transition-large 1s forwards",
          "opacity-translate-from-left-transition-medium": "opacity-translate-from-left-transition-medium 1s forwards",
          "opacity-translate-from-left-transition-small": "opacity-translate-from-left-transition-small 1s forwards",
          "opacity-translate-from-left-transition-mobile": "opacity-translate-from-left-transition-mobile 1s forwards",
          // 
        "opacity-translate-from-right-transition-0.2sec": "opacity-translate-from-right-transition 0.2s forwards",
        "opacity-translate-from-right-transition": "opacity-translate-from-right-transition 2s forwards",
        // second image
          "opacity-translate-from-right-transition-large": "opacity-translate-from-right-transition-large 1s forwards",
          "opacity-translate-from-right-transition-medium": "opacity-translate-from-right-transition-medium 1s forwards",
          "opacity-translate-from-right-transition-small": "opacity-translate-from-right-transition-small 1s forwards",
          "opacity-translate-from-right-transition-mobile": "opacity-translate-from-right-transition-mobile 1s forwards",
        // 
        "opacity-translate-from-top-transition": "opacity-translate-from-top-transition 2s forwards",
        // third image
          "opacity-translate-from-top-transition-large": "opacity-translate-from-top-transition-large 1s forwards",
          "opacity-translate-from-top-transition-medium": "opacity-translate-from-top-transition-medium 1s forwards",
          "opacity-translate-from-top-transition-small": "opacity-translate-from-top-transition-small 1s forwards",
          "opacity-translate-from-top-transition-mobile": "opacity-translate-from-top-transition-mobile 1s forwards",
        // 
        "opacity-translate-from-bottom-transition": "opacity-translate-from-bottom-transition 2s forwards",
        // fourth image
          "opacity-translate-from-bottom-transition-large": "opacity-translate-from-bottom-transition-large 1s forwards",
          "opacity-translate-from-bottom-transition-medium": "opacity-translate-from-bottom-transition-medium 1s forwards",
          "opacity-translate-from-bottom-transition-small": "opacity-translate-from-bottom-transition-small 1s forwards",
          "opacity-translate-from-bottom-transition-mobile": "opacity-translate-from-bottom-transition-mobile 1s forwards",
        //
        "opacity-translate-from-left-transition1": "opacity-translate-from-left-transition 3s forwards",
        "opacity-translate-from-left-transition2": "opacity-translate-from-left-transition 4s forwards",
        "opacity-scale-transition1": "opacity-scale-transition 4s forwards",
        "opacity-scale-transition2": "opacity-scale-transition 5s forwards",
        "opacity-translate-from-top-transition1": "opacity-translate-from-top-transition 6s forwards",
        "loader-spin": "loader-spin 2s linear infinite"
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
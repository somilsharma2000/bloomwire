/** @type {import('tailwindcss').Config} */
export default {
  "content": [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  "theme": {
    "extend": {
      "colors": {
        "bloom": {
          "rose": "#C2185B",
          "blush": "#FDF2F8",
          "wine": "#880E4F",
          "terracotta": "#e8945e",
          "sage": "#8FA88E",
          "cream": "#FFF8F3",
          "dark": "#FFF8F3",
          "darker": "#FFF8F3",
          "gold": "#D4A017",
          "ink": "#2D2D2D",
          "neon": "#E91E63",
          "glow": "#ff6b9d",
          "pastelRose": "#FDF2F8",
          "pastelPeach": "#FFF0E8",
          "pastelLavender": "#F8F4FD",
          "pastelMint": "#F0F8F0",
          "pastelGold": "#FEF9E7",
          "pastelSage": "#a8c4a0",
          "warmCream": "#FFF8F3",
          "warmInk": "#2D2D2D",
          "warmGray": "#6B6B6B",
          "warmMuted": "#9A9A9A",
          "footerCream": "#F5EDE6"
        }
      },
      "fontFamily": {
        "serif": [
          "\"Cormorant Garamond\"",
          "serif"
        ],
        "sans": [
          "Inter",
          "system-ui",
          "sans-serif"
        ]
      },
      "animation": {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "fade-down": "fadeDown 0.6s ease-out forwards",
        "scale-in": "scaleIn 0.4s ease-out forwards",
        "shimmer": "shimmer 2s linear infinite",
        "float": "float 6s ease-in-out infinite",
        "glow": "glowPulse 3s ease-in-out infinite",
        "spin-slow": "spin 20s linear infinite",
        "gradient-shift": "gradientShift 8s ease infinite",
        "float-up": "floatUp 15s linear infinite",
        "pulse-soft": "pulseSoft 4s ease-in-out infinite"
      },
      "keyframes": {
        "fadeIn": {
          "0%": {
            "opacity": "0"
          },
          "100%": {
            "opacity": "1"
          }
        },
        "fadeUp": {
          "0%": {
            "opacity": "0",
            "transform": "translateY(30px)"
          },
          "100%": {
            "opacity": "1",
            "transform": "translateY(0)"
          }
        },
        "fadeDown": {
          "0%": {
            "opacity": "0",
            "transform": "translateY(-20px)"
          },
          "100%": {
            "opacity": "1",
            "transform": "translateY(0)"
          }
        },
        "scaleIn": {
          "0%": {
            "opacity": "0",
            "transform": "scale(0.95)"
          },
          "100%": {
            "opacity": "1",
            "transform": "scale(1)"
          }
        },
        "shimmer": {
          "0%": {
            "backgroundPosition": "-200% 0"
          },
          "100%": {
            "backgroundPosition": "200% 0"
          }
        },
        "float": {
          "0%, 100%": {
            "transform": "translateY(0)"
          },
          "50%": {
            "transform": "translateY(-15px)"
          }
        },
        "glowPulse": {
          "0%, 100%": {
            "boxShadow": "0 0 20px rgba(194,24,91,0.2)"
          },
          "50%": {
            "boxShadow": "0 0 40px rgba(194,24,91,0.4)"
          }
        },
        "gradientShift": {
          "0%, 100%": {
            "backgroundPosition": "0% 50%"
          },
          "50%": {
            "backgroundPosition": "100% 50%"
          }
        },
        "floatUp": {
          "0%": {
            "transform": "translateY(100vh) rotate(0deg)",
            "opacity": "0"
          },
          "10%": {
            "opacity": "0.6"
          },
          "90%": {
            "opacity": "0.4"
          },
          "100%": {
            "transform": "translateY(-100vh) rotate(360deg)",
            "opacity": "0"
          }
        },
        "pulseSoft": {
          "0%, 100%": {
            "opacity": "0.05"
          },
          "50%": {
            "opacity": "0.1"
          }
        }
      }
    }
  },
  "plugins": []
}

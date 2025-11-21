import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const METADATA = {
  name: "Meme Coin Madness",
  description: "Fast-paced meme coin tapper on Base. Smash coins, dodge rugs, build combos, and chase new high scores.",
  bannerImageUrl: 'https://meme-coin-madness-miniapp-jocw-nkbmidm36.vercel.app/banner.png',
  iconImageUrl: 'https://meme-coin-madness-miniapp-jocw-nkbmidm36.vercel.app/icon.png',
  homeUrl: process.env.NEXT_PUBLIC_URL ?? "https://meme-coin-madness-miniapp-jocw-nkbmidm36.vercel.app",
  splashBackgroundColor: "#FFFFFF"
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

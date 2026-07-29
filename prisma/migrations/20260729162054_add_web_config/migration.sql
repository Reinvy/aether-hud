-- AlterTable
ALTER TABLE "PortfolioConfig" ADD COLUMN     "animationsEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "siteDescription" TEXT NOT NULL DEFAULT 'High-End Tactical Portfolio — Obsidian &amp; Imperial Gold Edition',
ADD COLUMN     "siteName" TEXT NOT NULL DEFAULT 'AETHER-HUD',
ADD COLUMN     "themePreset" TEXT NOT NULL DEFAULT 'obsidian';

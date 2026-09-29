-- Teyvat Codex identity defaults.
-- The retired defaults branded the CMS as "AETHER-HUD" / "Teyvat Codex &
-- Tactical Portfolio"; new rows now inherit the shipped product identity.

ALTER TABLE "PortfolioConfig" ALTER COLUMN "siteName" SET DEFAULT 'Teyvat Codex';
ALTER TABLE "PortfolioConfig" ALTER COLUMN "siteDescription" SET DEFAULT 'Teyvat Codex — Interactive Traveler Dossier';

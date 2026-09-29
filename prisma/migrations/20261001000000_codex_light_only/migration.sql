ALTER TABLE "PortfolioConfig" DROP COLUMN IF EXISTS "themePreset";
ALTER TABLE "PortfolioConfig" RENAME COLUMN "sysVersion" TO "edition";
ALTER TABLE "PortfolioConfig" ALTER COLUMN "edition" SET DEFAULT 'Teyvat Codex Edition';

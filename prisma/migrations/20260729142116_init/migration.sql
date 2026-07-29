-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL DEFAULT '/placeholder.svg',
    "tags" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "complexity" TEXT NOT NULL DEFAULT 'CLASS-B',
    "performance" TEXT NOT NULL DEFAULT '95%',
    "year" TEXT NOT NULL,
    "liveUrl" TEXT,
    "githubUrl" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "icon" TEXT NOT NULL DEFAULT 'Zap',
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Experience" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "company" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT,
    "type" TEXT NOT NULL DEFAULT 'work',
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "avatar" TEXT NOT NULL DEFAULT '/placeholder.svg',
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PortfolioConfig" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'main',
    "name" TEXT NOT NULL DEFAULT 'Bahrul Ulumul Haq',
    "tagline" TEXT NOT NULL DEFAULT 'Full-Stack Developer & AI Engineer',
    "bio" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "location" TEXT NOT NULL DEFAULT '',
    "avatar" TEXT NOT NULL DEFAULT '/placeholder.svg',
    "status" TEXT NOT NULL DEFAULT 'ONLINE',
    "sysVersion" TEXT NOT NULL DEFAULT 'v2.4.1',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SocialLink" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "platform" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "icon" TEXT NOT NULL DEFAULT 'Globe',
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TelemetryEvent" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "rating" TEXT NOT NULL DEFAULT 'unknown',
    "delta" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "clientId" TEXT NOT NULL DEFAULT '',
    "path" TEXT NOT NULL DEFAULT '/',
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TelemetryEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TelemetryEvent_name_recordedAt_idx" ON "TelemetryEvent"("name", "recordedAt");

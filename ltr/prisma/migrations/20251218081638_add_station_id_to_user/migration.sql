-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'STATION_MASTER';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "stationId" INTEGER;

-- CreateTable
CREATE TABLE "Station" (
    "id" SERIAL NOT NULL,
    "stationCode" TEXT NOT NULL,
    "stationName" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Station_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Train" (
    "id" SERIAL NOT NULL,
    "trainNumber" TEXT NOT NULL,
    "trainName" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "departureTime" TEXT NOT NULL,
    "arrivalTime" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'On Time',
    "platform" TEXT,
    "delay" INTEGER NOT NULL DEFAULT 0,
    "assignedStationId" INTEGER,
    "stationMasterId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Train_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Station_stationCode_key" ON "Station"("stationCode");

-- CreateIndex
CREATE INDEX "Station_stationCode_idx" ON "Station"("stationCode");

-- CreateIndex
CREATE INDEX "Station_city_idx" ON "Station"("city");

-- CreateIndex
CREATE UNIQUE INDEX "Train_trainNumber_key" ON "Train"("trainNumber");

-- CreateIndex
CREATE INDEX "Train_trainNumber_idx" ON "Train"("trainNumber");

-- CreateIndex
CREATE INDEX "Train_assignedStationId_idx" ON "Train"("assignedStationId");

-- CreateIndex
CREATE INDEX "Train_stationMasterId_idx" ON "Train"("stationMasterId");

-- CreateIndex
CREATE INDEX "Train_status_idx" ON "Train"("status");

-- CreateIndex
CREATE INDEX "User_stationId_idx" ON "User"("stationId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "Station"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Train" ADD CONSTRAINT "Train_assignedStationId_fkey" FOREIGN KEY ("assignedStationId") REFERENCES "Station"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Train" ADD CONSTRAINT "Train_stationMasterId_fkey" FOREIGN KEY ("stationMasterId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

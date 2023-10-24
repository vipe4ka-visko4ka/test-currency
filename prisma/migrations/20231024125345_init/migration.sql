-- CreateTable
CREATE TABLE "exchange_offices" (
    "id" SERIAL NOT NULL,
    "country_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "exchange_offices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exchanges" (
    "id" SERIAL NOT NULL,
    "exchange_office_id" INTEGER NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "ask" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exchanges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rates" (
    "id" SERIAL NOT NULL,
    "exchange_office_id" INTEGER NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "in" DOUBLE PRECISION NOT NULL,
    "out" DOUBLE PRECISION NOT NULL,
    "reserve" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "countries" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "countries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "countries_code_key" ON "countries"("code");

-- CreateIndex
CREATE UNIQUE INDEX "countries_name_key" ON "countries"("name");

-- AddForeignKey
ALTER TABLE "exchange_offices" ADD CONSTRAINT "exchange_offices_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exchanges" ADD CONSTRAINT "exchanges_exchange_office_id_fkey" FOREIGN KEY ("exchange_office_id") REFERENCES "exchange_offices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rates" ADD CONSTRAINT "rates_exchange_office_id_fkey" FOREIGN KEY ("exchange_office_id") REFERENCES "exchange_offices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

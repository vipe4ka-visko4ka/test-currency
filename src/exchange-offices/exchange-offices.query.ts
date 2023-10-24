import { Prisma } from '@prisma/client';

export const topOfficesByTopCountriesQuery = Prisma.sql`
  WITH with_asked_value AS (
    SELECT 
      exchange_offices."id",
      exchange_offices."name",
      countries.name as country_name,
      exchanges.from,
      exchanges.to,
      exchanges.ask AS asked_value,
      exchanges.ask / CASE
        WHEN (exchanges.from = rates.from AND exchanges.to = rates.to)
        THEN (rates.out / rates.in)
        ELSE (rates.in / rates.out)
      END AS paid_value
    FROM exchange_offices
    INNER JOIN countries ON exchange_offices."country_id" = countries."id"
    INNER JOIN exchanges ON exchange_offices."id" = exchanges."exchange_office_id"
    INNER JOIN rates
      ON exchange_offices."id" = rates."exchange_office_id"
      AND (
        (exchanges."from" = rates."from" AND exchanges."to" = rates."to")
        OR (exchanges."from" = rates."to" AND exchanges."to" = rates."from")
      )
    
  ),

  with_usd_values AS (
    SELECT 
      with_asked_value."id",
      with_asked_value."name",
      with_asked_value.country_name,
      with_asked_value."from",
      with_asked_value."to",
      with_asked_value."asked_value",
      with_asked_value."paid_value",
      asked_value / CASE
          WHEN (R1.from = 'USD')
          THEN (R1.out / R1.in)
          ELSE (R1.in / R1.out)
      END AS asked_value_in_usd,
      paid_value / CASE
          WHEN (R2.from = 'USD')
          THEN (R2.out / R2.in)
          ELSE (R2.in / R2.out)
      END AS paid_value_in_usd
    FROM with_asked_value
    INNER JOIN rates R1
      ON with_asked_value."id" = R1."exchange_office_id"
      AND (
        (with_asked_value."to" = R1."from" AND R1."to" = 'USD')
        OR (with_asked_value."to" = R1."to" AND R1."from" = 'USD')
      )
    INNER JOIN rates R2
      ON with_asked_value."id" = R2."exchange_office_id"
      AND (
        (with_asked_value."from" = R2."from" AND R2."to" = 'USD')
        OR (with_asked_value."from" = R2."to" AND R2."from" = 'USD')
      )
  ),


  with_profit AS (
    SELECT
      "name",
      "country_name",
      SUM(asked_value_in_usd - paid_value_in_usd) as office_profit
    FROM with_usd_values GROUP BY "name", "country_name"
  ),

  with_country_profit AS (
    SELECT *, SUM(office_profit) OVER(PARTITION BY "country_name") AS country_profit FROM with_profit
  ),

  with_ranks AS (
    SELECT
      *,
      DENSE_RANK() OVER(PARTITION BY "country_name" ORDER BY office_profit DESC) as office_rank,
      DENSE_RANK() OVER(ORDER BY country_profit DESC) as country_rank
    FROM with_country_profit
  )

  SELECT "name", "country_name", "office_profit", "country_profit" FROM with_ranks WHERE office_rank <= 3 AND country_rank <= 3;
`;

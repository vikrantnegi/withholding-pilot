# Question set — FROZEN 19 Sep 2026

16 practice + 12 held-out. Cuts and pairing changes are recorded in `DECISIONS.md`. Do not edit after the 22 Sep session; append a dated correction instead.

## Sub-skills

| | sub-skill | typical wrong model |
|---|---|---|
| S1 | group + one aggregate per group | aggregates the whole table / forgets GROUP BY |
| S2 | filter rows *before* grouping (WHERE + GROUP BY) | puts the row filter in HAVING |
| S3 | filter groups *after* aggregating (HAVING) | aggregate in WHERE, or filters rows instead of groups |
| S4 | combine: WHERE + GROUP BY + HAVING + ORDER BY | drops one filter, or puts a filter at the wrong stage |

## Schema

```sql
deploys (deploy_id, service, env, status, duration_sec)   -- 40 rows
tickets (ticket_id, team, priority, status, hours_to_close) -- 36 rows
rides   (ride_id, city, driver, fare, distance_km, rating) -- 42 rows
```

Seed data: `schema.sql`. Hints: `hints.py`. Scoring: `grade_rule.py`.

## Practice (16)

### P02 · S1 · pair: H02

What is the average fare in each city? Show city and avg_fare rounded to 1 decimal, sorted by city name, A to Z.

```sql
SELECT city, ROUND(AVG(fare),1) AS avg_fare FROM rides GROUP BY city ORDER BY city;
```

**Fallback hint:** An average only exists once rides are bundled per city. Bundle first, then average inside each bundle.

- Wrong model — *no GROUP BY* (runs): `SELECT city, ROUND(AVG(fare),1) FROM rides`
- Wrong model — *groups by the wrong column* (runs): `SELECT city, ROUND(AVG(fare),1) FROM rides GROUP BY driver ORDER BY city`

Reference returns 5 rows.

### P04 · S1 · pair: H03

How far has each driver driven in total? Show driver and total_km rounded to 1 decimal, highest total first.

```sql
SELECT driver, ROUND(SUM(distance_km),1) AS total_km FROM rides GROUP BY driver ORDER BY total_km DESC;
```

**Fallback hint:** Adding up distance for every driver means one total per driver. Something has to tell the database where one driver's rows end and the next begin.

- Wrong model — *COUNT instead of SUM* (runs): `SELECT driver, COUNT(distance_km) AS total_km FROM rides GROUP BY driver ORDER BY total_km DESC`
- Wrong model — *no GROUP BY* (runs): `SELECT driver, ROUND(SUM(distance_km),1) FROM rides`

Reference returns 6 rows.

### P05 · S1 · pair: H01

How many deploys went to each environment of each service? Show service, env and deploy_count, sorted by service name then env name.

```sql
SELECT service, env, COUNT(*) AS deploy_count FROM deploys GROUP BY service, env ORDER BY service, env;
```

**Fallback hint:** Here a row of output is one service-and-environment combination, not one service. You can bundle by more than one column.

- Wrong model — *groups by one column only* (runs): `SELECT service, env, COUNT(*) FROM deploys GROUP BY service ORDER BY service, env`
- Wrong model — *groups by env only* (runs): `SELECT service, env, COUNT(*) FROM deploys GROUP BY env ORDER BY service, env`

Reference returns 10 rows.

### P07 · S2 · pair: H04

Count only the failed deploys for each service. Show service and failed_count, sorted by service name, A to Z.

```sql
SELECT service, COUNT(*) AS failed_count FROM deploys WHERE status = 'failed' GROUP BY service ORDER BY service;
```

**Fallback hint:** A deploy either failed or it did not — that is a fact about one row. Throw those rows out before the grouping happens, not after.

- Wrong model — *row filter in HAVING* (runs): `SELECT service, COUNT(*) FROM deploys GROUP BY service HAVING status = 'failed' ORDER BY service`
- Wrong model — *no filter* (runs): `SELECT service, COUNT(*) FROM deploys GROUP BY service ORDER BY service`

Reference returns 5 rows.

### P08 · S2 · pair: H05

Looking only at rides longer than 10 km, what is the average fare in each city? Show city and avg_fare rounded to 1 decimal, sorted by city name, A to Z.

```sql
SELECT city, ROUND(AVG(fare),1) AS avg_fare FROM rides WHERE distance_km > 10 GROUP BY city ORDER BY city;
```

**Fallback hint:** Distance belongs to a single ride, so the length test happens while you are still looking at individual rides, before they are bundled by city.

- Wrong model — *row filter in HAVING* (runs): `SELECT city, ROUND(AVG(fare),1) FROM rides GROUP BY city HAVING distance_km > 10 ORDER BY city`
- Wrong model — *no filter* (runs): `SELECT city, ROUND(AVG(fare),1) FROM rides GROUP BY city ORDER BY city`

Reference returns 5 rows.

### P09 · S2 · pair: H06

How many P1 tickets has each team closed? Show team and closed_p1, sorted by team name, A to Z.

```sql
SELECT team, COUNT(*) AS closed_p1 FROM tickets WHERE priority = 'P1' AND status = 'closed' GROUP BY team ORDER BY team;
```

**Fallback hint:** Two conditions, both about one ticket: its priority and its status. Both belong at the row stage, before grouping.

- Wrong model — *only one of the two conditions* (runs): `SELECT team, COUNT(*) FROM tickets WHERE priority = 'P1' GROUP BY team ORDER BY team`
- Wrong model — *conditions in HAVING* (runs): `SELECT team, COUNT(*) FROM tickets GROUP BY team HAVING priority = 'P1' AND status = 'closed' ORDER BY team`

Reference returns 3 rows.

### P10 · S2 · pair: —

Considering prod deploys only, what is the average deploy duration per service? Show service and avg_seconds rounded to 1 decimal, slowest first.

```sql
SELECT service, ROUND(AVG(duration_sec),1) AS avg_seconds FROM deploys WHERE env = 'prod' GROUP BY service ORDER BY avg_seconds DESC;
```

**Fallback hint:** Environment is a property of one deploy. Drop the staging rows before the averaging starts, or the average will include them.

- Wrong model — *row filter in HAVING* (runs): `SELECT service, ROUND(AVG(duration_sec),1) AS avg_seconds FROM deploys GROUP BY service HAVING env = 'prod' ORDER BY avg_seconds DESC`
- Wrong model — *no filter* (runs): `SELECT service, ROUND(AVG(duration_sec),1) AS avg_seconds FROM deploys GROUP BY service ORDER BY avg_seconds DESC`

Reference returns 5 rows.

### P12 · S2 · pair: —

Among closed tickets only, what is the longest close time for each priority? Show priority and longest_hours, sorted by priority, P1 first.

```sql
SELECT priority, MAX(hours_to_close) AS longest_hours FROM tickets WHERE status = 'closed' GROUP BY priority ORDER BY priority;
```

**Fallback hint:** Being closed is a property of one ticket. If you test it after grouping, the database is testing a group against a row's value.

- Wrong model — *no filter* (runs): `SELECT priority, MAX(hours_to_close) FROM tickets GROUP BY priority ORDER BY priority`
- Wrong model — *row filter in HAVING* (runs): `SELECT priority, MAX(hours_to_close) FROM tickets GROUP BY priority HAVING status = 'closed' ORDER BY priority`

Reference returns 3 rows.

### P13 · S2 · pair: —

Ignoring the auth service, how many successful deploys did each environment get? Show env and success_count, sorted by env name, A to Z.

```sql
SELECT env, COUNT(*) AS success_count FROM deploys WHERE status = 'success' AND service <> 'auth' GROUP BY env ORDER BY env;
```

**Fallback hint:** Two row-level conditions here: the status, and excluding one service. Both belong before the grouping.

- Wrong model — *forgets to exclude auth* (runs): `SELECT env, COUNT(*) FROM deploys WHERE status = 'success' GROUP BY env ORDER BY env`
- Wrong model — *row filters in HAVING* (runs): `SELECT env, COUNT(*) FROM deploys GROUP BY env HAVING status = 'success' AND service <> 'auth' ORDER BY env`

Reference returns 2 rows.

### P14 · S3 · pair: H07

Which services have been deployed more than 6 times? Show service and deploy_count, sorted by service name, A to Z.

```sql
SELECT service, COUNT(*) AS deploy_count FROM deploys GROUP BY service HAVING COUNT(*) > 6 ORDER BY service;
```

**Fallback hint:** A count does not exist until the rows are bundled. Filter on the count after the grouping step, not before it.

- Wrong model — *aggregate in WHERE* (errors in SQLite): `SELECT service, COUNT(*) FROM deploys WHERE COUNT(*) > 6 GROUP BY service ORDER BY service`
- Wrong model — *filters rows on deploy_id* (runs): `SELECT service, COUNT(*) FROM deploys WHERE deploy_id > 6 GROUP BY service ORDER BY service`

Reference returns 3 rows.

### P15 · S3 · pair: H08

Which cities have an average fare above 200? Show city and avg_fare rounded to 1 decimal, highest average first.

```sql
SELECT city, ROUND(AVG(fare),1) AS avg_fare FROM rides GROUP BY city HAVING AVG(fare) > 200 ORDER BY avg_fare DESC;
```

**Fallback hint:** You are testing a city's average, not one ride's fare. That average only exists after the rides are bundled, so the test has to come after.

- Wrong model — *row filter instead of group filter* (runs): `SELECT city, ROUND(AVG(fare),1) AS avg_fare FROM rides WHERE fare > 200 GROUP BY city ORDER BY avg_fare DESC`
- Wrong model — *aggregate in WHERE* (errors in SQLite): `SELECT city, ROUND(AVG(fare),1) AS avg_fare FROM rides WHERE AVG(fare) > 200 GROUP BY city ORDER BY avg_fare DESC`

Reference returns 2 rows.

### P16 · S3 · pair: H09

Which teams have spent more than 300 hours in total closing tickets? Show team and total_hours, sorted by team name, A to Z.

```sql
SELECT team, SUM(hours_to_close) AS total_hours FROM tickets GROUP BY team HAVING SUM(hours_to_close) > 300 ORDER BY team;
```

**Fallback hint:** The total belongs to the team, not to any single ticket. Filter on the team's total once the grouping has produced it.

- Wrong model — *row filter instead of group filter* (runs): `SELECT team, SUM(hours_to_close) FROM tickets WHERE hours_to_close > 30 GROUP BY team ORDER BY team`
- Wrong model — *aggregate in WHERE* (errors in SQLite): `SELECT team, SUM(hours_to_close) FROM tickets WHERE SUM(hours_to_close) > 300 GROUP BY team ORDER BY team`

Reference returns 2 rows.

### P17 · S3 · pair: —

Which drivers have done at least 7 rides? Show driver and ride_count, most rides first.

```sql
SELECT driver, COUNT(*) AS ride_count FROM rides GROUP BY driver HAVING COUNT(*) >= 7 ORDER BY ride_count DESC;
```

**Fallback hint:** The number of rides is a fact about a driver, not about a ride. It can only be tested after the rows are bundled per driver.

- Wrong model — *aggregate in WHERE* (errors in SQLite): `SELECT driver, COUNT(*) AS ride_count FROM rides WHERE COUNT(*) >= 7 GROUP BY driver ORDER BY ride_count DESC`
- Wrong model — *no HAVING* (runs): `SELECT driver, COUNT(*) AS ride_count FROM rides GROUP BY driver ORDER BY ride_count DESC`

Reference returns 3 rows.

### P18 · S3 · pair: —

Which services have never had a deploy faster than 60 seconds? Show service and fastest_seconds, sorted by service name, A to Z.

```sql
SELECT service, MIN(duration_sec) AS fastest_seconds FROM deploys GROUP BY service HAVING MIN(duration_sec) >= 60 ORDER BY service;
```

**Fallback hint:** "Never faster than 60" is a claim about every deploy in a service. If you drop the fast rows first, the evidence that rules a service out is gone.

- Wrong model — *row filter instead of group filter* (runs): `SELECT service, MIN(duration_sec) FROM deploys WHERE duration_sec >= 60 GROUP BY service ORDER BY service`
- Wrong model — *aggregate in WHERE* (errors in SQLite): `SELECT service, MIN(duration_sec) FROM deploys WHERE MIN(duration_sec) >= 60 GROUP BY service ORDER BY service`

Reference returns 3 rows.

### P19 · S3 · pair: —

Which priorities take less than 45 hours to close on average? Show priority and avg_hours rounded to 1 decimal, sorted by priority, P1 first.

```sql
SELECT priority, ROUND(AVG(hours_to_close),1) AS avg_hours FROM tickets GROUP BY priority HAVING AVG(hours_to_close) < 45 ORDER BY priority;
```

**Fallback hint:** You are comparing each priority's average against a number. The average appears only after grouping, so the comparison goes after it.

- Wrong model — *row filter instead of group filter* (runs): `SELECT priority, ROUND(AVG(hours_to_close),1) FROM tickets WHERE hours_to_close < 45 GROUP BY priority ORDER BY priority`
- Wrong model — *no HAVING* (runs): `SELECT priority, ROUND(AVG(hours_to_close),1) FROM tickets GROUP BY priority ORDER BY priority`

Reference returns 2 rows.

### P20 · S3 · pair: —

Which cities have more than 100 km of rides in total? Show city and total_km rounded to 1 decimal, highest first.

```sql
SELECT city, ROUND(SUM(distance_km),1) AS total_km FROM rides GROUP BY city HAVING SUM(distance_km) > 100 ORDER BY total_km DESC;
```

**Fallback hint:** One ride's distance and a city's total distance are different things. Test the total, which exists only once the rides are bundled.

- Wrong model — *row filter instead of group filter* (runs): `SELECT city, ROUND(SUM(distance_km),1) AS total_km FROM rides WHERE distance_km > 10 GROUP BY city ORDER BY total_km DESC`
- Wrong model — *aggregate in WHERE* (errors in SQLite): `SELECT city, ROUND(SUM(distance_km),1) AS total_km FROM rides WHERE SUM(distance_km) > 100 GROUP BY city ORDER BY total_km DESC`

Reference returns 3 rows.

## Held-out (12)

### H01 · S1 · pair: P05

The ops lead wants ride volume by city. List each city with its number of rides (city, ride_count), busiest city first.

```sql
SELECT city, COUNT(*) AS ride_count FROM rides GROUP BY city ORDER BY ride_count DESC;
```

**Fallback hint:** Each city should come out as one row with its own count. Bundle the rides by city first.

- Wrong model — *no GROUP BY* (runs): `SELECT city, COUNT(*) FROM rides`

Reference returns 5 rows.

### H02 · S1 · pair: P02

Is staging slower than prod? Show each env with its average deploy duration in seconds, rounded to 1 decimal (env, avg_seconds), sorted by env name, A to Z.

```sql
SELECT env, ROUND(AVG(duration_sec),1) AS avg_seconds FROM deploys GROUP BY env ORDER BY env;
```

**Fallback hint:** One average per environment. Check that the grouping is telling the database how to split the deploys.

- Wrong model — *no GROUP BY* (runs): `SELECT env, ROUND(AVG(duration_sec),1) FROM deploys`

Reference returns 2 rows.

### H03 · S1 · pair: P04

What is the single highest fare each driver has earned? Show driver and top_fare, sorted by driver name, A to Z.

```sql
SELECT driver, MAX(fare) AS top_fare FROM rides GROUP BY driver ORDER BY driver;
```

**Fallback hint:** The highest fare per driver, not the highest overall. Something has to mark where one driver's rows end.

- Wrong model — *no GROUP BY* (runs): `SELECT driver, MAX(fare) FROM rides`

Reference returns 6 rows.

### H04 · S2 · pair: P07

How many tickets are still open for each team? Show team and open_tickets, most open first.

```sql
SELECT team, COUNT(*) AS open_tickets FROM tickets WHERE status = 'open' GROUP BY team ORDER BY open_tickets DESC;
```

**Fallback hint:** Open-or-closed is a fact about one ticket. Drop the closed ones before the grouping.

- Wrong model — *row filter in HAVING* (runs): `SELECT team, COUNT(*) AS open_tickets FROM tickets GROUP BY team HAVING status = 'open' ORDER BY open_tickets DESC`

Reference returns 4 rows.

### H05 · S2 · pair: P08

When deploys fail, how long do they run? Using failed deploys only, show each service with its average duration rounded to 1 decimal (service, avg_seconds), sorted by service name, A to Z.

```sql
SELECT service, ROUND(AVG(duration_sec),1) AS avg_seconds FROM deploys WHERE status = 'failed' GROUP BY service ORDER BY service;
```

**Fallback hint:** Failure is a property of a single deploy. Remove the successful rows first, then average what remains.

- Wrong model — *row filter in HAVING* (runs): `SELECT service, ROUND(AVG(duration_sec),1) FROM deploys GROUP BY service HAVING status = 'failed' ORDER BY service`

Reference returns 5 rows.

### H06 · S2 · pair: P09

Total fare per city, counting only rides rated 5. Show city and fare_total, sorted by city name, A to Z.

```sql
SELECT city, SUM(fare) AS fare_total FROM rides WHERE rating = 5 GROUP BY city ORDER BY city;
```

**Fallback hint:** The rating belongs to one ride. Filter the rides on rating before they are bundled by city.

- Wrong model — *row filter in HAVING* (runs): `SELECT city, SUM(fare) FROM rides GROUP BY city HAVING rating = 5 ORDER BY city`

Reference returns 5 rows.

### H07 · S3 · pair: P14

List the teams that have raised more than 8 tickets, with how many (team, ticket_count), sorted by team name, A to Z.

```sql
SELECT team, COUNT(*) AS ticket_count FROM tickets GROUP BY team HAVING COUNT(*) > 8 ORDER BY team;
```

**Fallback hint:** The count only exists after grouping, so the test on how many has to come after it.

- Wrong model — *aggregate in WHERE* (errors in SQLite): `SELECT team, COUNT(*) FROM tickets WHERE COUNT(*) > 8 GROUP BY team ORDER BY team`

Reference returns 2 rows.

### H08 · S3 · pair: P15

Which services average more than 175 seconds per deploy? Show service and avg_seconds rounded to 1 decimal, sorted by service name, A to Z.

```sql
SELECT service, ROUND(AVG(duration_sec),1) AS avg_seconds FROM deploys GROUP BY service HAVING AVG(duration_sec) > 175 ORDER BY service;
```

**Fallback hint:** You are testing a service's average, which appears only once its deploys are bundled.

- Wrong model — *row filter instead of group filter* (runs): `SELECT service, ROUND(AVG(duration_sec),1) FROM deploys WHERE duration_sec > 175 GROUP BY service ORDER BY service`

Reference returns 2 rows.

### H09 · S3 · pair: P16

Which drivers have earned more than 1500 in total fares? Show driver and total_fare, highest earner first.

```sql
SELECT driver, SUM(fare) AS total_fare FROM rides GROUP BY driver HAVING SUM(fare) > 1500 ORDER BY total_fare DESC;
```

**Fallback hint:** A driver's total fare is not a single ride's fare. Test the total, after the grouping.

- Wrong model — *row filter instead of group filter* (runs): `SELECT driver, SUM(fare) AS total_fare FROM rides WHERE fare > 150 GROUP BY driver ORDER BY total_fare DESC`

Reference returns 3 rows.

### H10 · S4 · pair: P10+P14

Looking at prod deploys only, which services have at least 3 of them? Show service and prod_deploys, most first.

```sql
SELECT service, COUNT(*) AS prod_deploys FROM deploys WHERE env = 'prod' GROUP BY service HAVING COUNT(*) >= 3 ORDER BY prod_deploys DESC;
```

**Fallback hint:** There are two separate filters here. Prod-or-not is about one deploy, and how many is about a service. One goes before the grouping, the other after.

- Wrong model — *both filters in HAVING* (runs): `SELECT service, COUNT(*) AS prod_deploys FROM deploys GROUP BY service HAVING env = 'prod' AND COUNT(*) >= 3 ORDER BY prod_deploys DESC`
- Wrong model — *forgets the prod filter* (runs): `SELECT service, COUNT(*) AS prod_deploys FROM deploys GROUP BY service HAVING COUNT(*) >= 3 ORDER BY prod_deploys DESC`

Reference returns 2 rows.

### H11 · S4 · pair: P08+P15

For rides longer than 5 km, which cities average a fare above 250? Show city and avg_fare rounded to 1 decimal, highest average first.

```sql
SELECT city, ROUND(AVG(fare),1) AS avg_fare FROM rides WHERE distance_km > 5 GROUP BY city HAVING AVG(fare) > 250 ORDER BY avg_fare DESC;
```

**Fallback hint:** Length is about a single ride; the average is about a city. Apply them at different stages, in that order.

- Wrong model — *forgets the km filter* (runs): `SELECT city, ROUND(AVG(fare),1) AS avg_fare FROM rides GROUP BY city HAVING AVG(fare) > 250 ORDER BY avg_fare DESC`
- Wrong model — *group filter as a row filter* (runs): `SELECT city, ROUND(AVG(fare),1) AS avg_fare FROM rides WHERE distance_km > 5 AND fare > 250 GROUP BY city ORDER BY avg_fare DESC`

Reference returns 4 rows.

### H12 · S4 · pair: P12+P19

Among closed tickets, which teams take more than 35 hours to close on average? Show team and avg_hours rounded to 1 decimal, slowest first.

```sql
SELECT team, ROUND(AVG(hours_to_close),1) AS avg_hours FROM tickets WHERE status = 'closed' GROUP BY team HAVING AVG(hours_to_close) > 35 ORDER BY avg_hours DESC;
```

**Fallback hint:** Closed-or-open is about one ticket; the average close time is about a team. Row test first, group test after.

- Wrong model — *forgets the closed filter* (runs): `SELECT team, ROUND(AVG(hours_to_close),1) AS avg_hours FROM tickets GROUP BY team HAVING AVG(hours_to_close) > 35 ORDER BY avg_hours DESC`
- Wrong model — *group filter as a row filter* (runs): `SELECT team, ROUND(AVG(hours_to_close),1) AS avg_hours FROM tickets WHERE status = 'closed' AND hours_to_close > 35 GROUP BY team ORDER BY avg_hours DESC`

Reference returns 3 rows.

## Pairing table

| held-out | sub-skill | practice pair |
|---|---|---|
| H01 | S1 | P05 |
| H02 | S1 | P02 |
| H03 | S1 | P04 |
| H04 | S2 | P07 |
| H05 | S2 | P08 |
| H06 | S2 | P09 |
| H07 | S3 | P14 |
| H08 | S3 | P15 |
| H09 | S3 | P16 |
| H10 | S4 | P10+P14 |
| H11 | S4 | P08+P15 |
| H12 | S4 | P12+P19 |

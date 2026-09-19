# Fallback hint per item. Used when the hint writer's output fails the guard.
# Rules: one or two sentences, plain English, names the stage the learner got wrong,
# never contains SELECT, never contains the threshold number, never spells out a clause.
HINTS = {
# S1 — the group is the thing being counted
"P01":"Each service should end up as one row with its own count. Ask the database to group the rows by service before you count them.",
"P02":"An average only exists once rides are bundled per city. Bundle first, then average inside each bundle.",
"P03":"You want one longest value per team, not the longest overall. Tell the database what to bundle the tickets by.",
"P04":"Adding up distance for every driver means one total per driver. Something has to tell the database where one driver's rows end and the next begin.",
"P05":"Here a row of output is one service-and-environment combination, not one service. You can bundle by more than one column.",
"P06":"One total per team. Check whether you are adding up hours inside each team, or across the whole table.",
# S2 — filter the rows first, then bundle
"P07":"A deploy either failed or it did not — that is a fact about one row. Throw those rows out before the grouping happens, not after.",
"P08":"Distance belongs to a single ride, so the length test happens while you are still looking at individual rides, before they are bundled by city.",
"P09":"Two conditions, both about one ticket: its priority and its status. Both belong at the row stage, before grouping.",
"P10":"Environment is a property of one deploy. Drop the staging rows before the averaging starts, or the average will include them.",
"P12":"Being closed is a property of one ticket. If you test it after grouping, the database is testing a group against a row's value.",
"P13":"Two row-level conditions here: the status, and excluding one service. Both belong before the grouping.",
# S3 — filter the bundles after they exist
"P14":"A count does not exist until the rows are bundled. Filter on the count after the grouping step, not before it.",
"P15":"You are testing a city's average, not one ride's fare. That average only exists after the rides are bundled, so the test has to come after.",
"P16":"The total belongs to the team, not to any single ticket. Filter on the team's total once the grouping has produced it.",
"P17":"The number of rides is a fact about a driver, not about a ride. It can only be tested after the rows are bundled per driver.",
"P18":"\"Never faster than 60\" is a claim about every deploy in a service. If you drop the fast rows first, the evidence that rules a service out is gone.",
"P19":"You are comparing each priority's average against a number. The average appears only after grouping, so the comparison goes after it.",
"P20":"One ride's distance and a city's total distance are different things. Test the total, which exists only once the rides are bundled.",
# S4 — both stages, in order
"H10":"There are two separate filters here. Prod-or-not is about one deploy, and how many is about a service. One goes before the grouping, the other after.",
"H11":"Length is about a single ride; the average is about a city. Apply them at different stages, in that order.",
"H12":"Closed-or-open is about one ticket; the average close time is about a team. Row test first, group test after.",
# held-out (used only if the removal test offers help — it does not, but keep parity)
"H01":"Each city should come out as one row with its own count. Bundle the rides by city first.",
"H02":"One average per environment. Check that the grouping is telling the database how to split the deploys.",
"H03":"The highest fare per driver, not the highest overall. Something has to mark where one driver's rows end.",
"H04":"Open-or-closed is a fact about one ticket. Drop the closed ones before the grouping.",
"H05":"Failure is a property of a single deploy. Remove the successful rows first, then average what remains.",
"H06":"The rating belongs to one ride. Filter the rides on rating before they are bundled by city.",
"H07":"The count only exists after grouping, so the test on how many has to come after it.",
"H08":"You are testing a service's average, which appears only once its deploys are bundled.",
"H09":"A driver's total fare is not a single ride's fare. Test the total, after the grouping.",
}

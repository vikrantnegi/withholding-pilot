# Speaker notes: Capstone Demo Day deck
Removed from the shared deck on 11 Oct so others don't see them. One section per slide, in deck order.

## Slide 1: Try first, or get the answer?

0:20. Two people get the same SQL question wrong. One AI tutor gives them the answer. The other makes them try first, then gives a hint. A week later, with no tutor, who does better? That's the question the Learning OS brief set. I built a tutor to test it and ran it on six developers. (Say six, not seven: one was excluded.)

## Slide 2: The initial hypothesis

0:45. The brief gave us this hypothesis: a tutor that sizes its help to what each learner can already do will leave them better off once the tutor is gone, compared with a tutor that just gives answers. The reasoning: if you hold back help, the learner has to recall instead of read, and recall is what makes a skill stick. I narrowed it to something I could actually test with a handful of people: help only after you try, and a hint before the answer. And I wrote down a prediction that could fail: a week later, this group should beat the answer group on the skills they practised, but not on one skill nobody practised. That last part is what would show it's the practice, not something general. (Why the skill-sizing part was cut comes at slide 9 — don't explain it here.)

## Slide 3: Screen, practise, wait a week, then test with no help

0:45. Four stages. One, screening: seven developers, two rounds, to find where people actually get stuck. Then I paired them by skill and split them into two groups. Two, practice: 16 questions on GROUP BY with the tutor. Arm A has to try first and gets a hint before the answer. Arm B gets the answer when they ask. Three, five to seven days later, an exam: 12 new questions, no tutor, no help for anyone. Four, results: scored per person per question, against ten checks I wrote before seeing any data. Let me take each stage in turn.

## Slide 4: Same page, same question. One setting differs.

0:15. In practice, both groups used the same page with the same questions. Only the Help button differs. Arm A has to try first, gets a hint, and gets the answer only after two more tries. Arm B gets the answer whenever they ask. Let me show you. (Switch to the browser now: Cmd+Tab. Arm A, question 10: Help with editor empty, refuses. Paste and run WHERE COUNT(*) > 6, errors. Help, a hint. Paste and run WHERE deploy_id > 6, still wrong. Paste and run the plain GROUP BY. Help, now the answer. Arm B, question 10: Help at once, the answer. Switch back, next slide. If the wifi fails: demo video 1:50 to 3:53.)

## Slide 5: Arm B is Arm A with half of it switched off

0:30. Point left, then right. On the left, Arm A. Green is the learner, orange is plain code, purple is the LLM. When the learner asks for help, the gate checks they tried, the policy picks hint or answer, and only then does the LLM write a hint, which the guard checks. On the right, Arm B: the same drawing with the gate, the policy and the whole LLM part switched off. Help goes straight to the answer.

## Slide 6: Code decides whether to help. The LLM only words the hint.

0:30. So that's the only difference: one setting. Human writes the SQL. Deterministic code owns the gate, the policy and the leak guard. Probabilistic, the LLM, writes one thing only: the hint's words, and the guard checks it never gives the answer away. If the LLM decided when to help, every learner would get different treatment, and I couldn't say what Arm A actually received.

## Slide 7: 36 vs 25 looks like a win. Now look at the first try.

1:00. Six people practised, then sat 12 new questions a week later, with no help for anyone. The withholding group got 36 of 36. The answer group got 25. That looks like a win. But look at the highlighted row: on the first try, both got exactly 17. The gap came after that. Arm B left 7 of 36 questions blank; Arm A left none, and fixed all 19 of its wrong first tries.

## Slide 8: Why I don’t credit the gap to withholding

0:50. I wrote ten checks before seeing any data. Two failed. One: during practice, Arm B could get the answer straight away, but they tried first anyway, 0.83 times on average (12 Help presses, from the two Arm B people who used Help). So the gate didn't create a behaviour Arm B lacked. Two: Arm A hit 100%. A test with no headroom can't show how far ahead anyone is. And one Arm A person never pressed Help in practice, yet scored 12 of 12. Counting only people who used Help as designed, the gap shrinks from 11 questions to 3. So I don't claim withholding caused the gap.

## Slide 9: The claim moved three times

0:45. Point at each row. You saw the brief's version on slide 2. Two parts were cut early. To judge skill you need many attempts; each learner did about 16 questions. And if everyone got different help, I couldn't say what the group received. So I kept the core idea, try first, as one fixed rule. Withholding did not make people give up during practice; that part held. The test changed the last part. I expected trying first to make SQL stick. If it did, Arm A should win on the first try. They didn't: 17 each. Their advantage came after a mistake. So: trying first changes what you do after a mistake, not what you remember. PAUSE here.

## Slide 10: Item order is a variable. Randomise it.

0:30. Next, I'd shuffle the question order per person — three people stopped early, and fixed order turned "they stopped" into "the biggest gap". Use harder questions so nobody hits 100%. And make first-try correct the main score: it's the number v2 says won't move, so it's the one that can prove me wrong. The app, the code and every number are linked here. Thank you. Then stop talking and wait for questions.

## Slide 11: The gap sits on the last three questions

Only show if asked about where the gap comes from, or about the held-back skill. Key line: the hypothesis predicted a gap on practised skills and none on S4. The reverse happened, and S4's gap is blanks from stopping early, confounded with fixed question order.

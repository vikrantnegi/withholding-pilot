# Soderstrom & Bjork (2015): doing well in practice is not the same as learning

Perspectives on Psychological Science 10(2), 176-199.
https://bjorklab.psych.ucla.edu/wp-content/uploads/sites/13/2016/11/soderstorm_ra_learningvsperformance.pdf
Read 5 Sep 2026. Rewritten in plain English 7 Sep 2026.

## The short version

A century of studies showing that how well someone does during practice tells you almost
nothing about what they can do a week later. Worse, the conditions that make practice go badly
are often the ones that make the skill stick.

This is the paper your whole measurement choice rests on. If anyone challenges why you test
people after the tool is taken away instead of while they use it, this is the answer.

---

## 1. Two words that mean different things

The paper's definitions, word for word (p. 176):

> **Learning:** "the relatively permanent changes in behavior or knowledge that support
> long-term retention and transfer"

> **Performance:** "the temporary fluctuations in behavior or knowledge that can be observed
> and measured during or immediately after the acquisition process"

Practice is performance. A test days later, with no help, is learning.

Your 21 Sep practice session measures performance. Your 27 Sep removal test measures learning.
The paper's entire point is that these two things routinely move in opposite directions.

Paste both definitions into the PRD. They are the cleanest statement of what you are measuring.

---

## 2. Your experiment already ran in 1968, with a joystick

Baker (1968), p. 185. People learned a joystick tracking task. One group got physical guidance
while practising, meaning the apparatus helped move their hand. The other group got none.

- During training and on tests taken soon after, the guided group did better.
- On a test six weeks later, the unguided group had learned more.
- The guided group did no better than a group who had only watched and never done the task at
  all.

Read that last point again. Getting help during practice produced the same result as never
practising.

That is the same finding Bastani got with an answer-giving LLM in 2025, in a completely
different field, 57 years earlier. Cite them together. Two unrelated literatures reaching the
same conclusion is a much stronger opening than either one alone.

Two more in the same direction:

**Winstein, Pohl & Lewthwaite (1994)**, p. 186. A lever positioning task. The guided group made
fewer errors while practising. The unguided group did better on the later test.

**Feijen, Hodges & Beek (2010)**, p. 186. Coordinating both arms, with three conditions: full
guidance, partial guidance, no guidance. Full guidance stopped people making errors during
training. Partial guidance or no guidance produced better learning.

That third study is the closest thing in this literature to a defence of your graded ladder.
Partial help did not lose to no help. Use it when someone asks why you did not build a system
that simply refuses to help.

---

## 3. Why your 5 to 7 day gap is not optional

The reversal takes time to show up, and it arrives in a specific order. First the gap between
conditions closes. Then it flips.

| Study | Short delay | Longer delay |
|---|---|---|
| Roediger & Karpicke (2006), prose passages | 5 min: restudying wins, .80 to .70 | 1 week: testing wins, .60 to .40 |
| Wheeler, Ewers & Buonanno (2003), word list | 5 min: restudying well ahead | 1 week: reversed. Restudy group forgot about 75%, testing group about 30% |
| Thompson, Wenger & Bartling (1978) | 5 min: study 50%, testing 28% | 2 days: testing 25%, study 23% |
| Bloom & Shuell (1981), French vocabulary | immediate: virtually identical | 7 days: spaced practice group recalled more |
| Shea & Morgan (1979), movement patterns | 10 min: blocked practice still ahead | 10 days: varied practice dramatically better |

**The warning is in the Shea & Morgan row.** At 10 minutes the "wrong" condition was still
winning. At 2 days in Thompson et al. the crossover had barely happened, 25% against 23%.

So if your removal test happens earlier than planned, you do not get a smaller effect. You risk
getting the opposite result. Arm B could beat Arm A on a test run two days after practice, and
that number would be real, correct, and tell you nothing about learning.

Your 5 to 7 day gap is the minimum at which the flip reliably shows. Treat it as load-bearing.
Log the actual gap for each person, not the planned one.

The most encouraging single data point is Bloom & Shuell: an immediate test showed no difference
at all between conditions, and at 7 days the spaced group came out clearly ahead.

---

## 4. The mechanism, stated properly

Your hypothesis log currently says: help withheld at the edge of ability forces retrieval instead
of reading, and retrieval is what makes a skill available later.

That is a description of what happens, not an explanation of why.

The explanation the review uses is the **New Theory of Disuse** (Bjork & Bjork 1992), pp. 191-192.
It splits memory into two separate quantities:

- **Storage strength:** how well something is connected to everything else you know. This is
  learning. It does not go down.
- **Retrieval strength:** how easily you can reach it right now. This is performance. It goes up
  and down.

The key claim: how much storage strength you gain from an encounter shrinks as your current
retrieval strength rises. The easier something is to reach at this moment, the less you gain by
reaching for it.

That single sentence explains why answer-giving fails. Handing over the answer pushes retrieval
strength to maximum at that instant, which drives the storage gain from that interaction towards
zero. The task gets done and nothing is banked.

Withholding keeps retrieval strength low at the moment of the attempt, which is exactly when the
storage gain is largest.

The review's own summary, p. 192: "Forgetting can foster learning."

Put the storage and retrieval sentence in the PRD. It turns your hypothesis from a plausible
story into a mechanism with a named theory behind it.

---

## 5. The finding that changes your policy design

**The generation effect, and specifically failed generation**, pp. 187-188.

Slamecka & Graf (1978) and Jacoby (1978): things you produce yourself are remembered better than
things you read. The review is honest about the cost, and it applies to you: unless people
generate every item correctly, the generation group will look worse during practice, because a
failed attempt means never seeing the answer.

Then the part that matters more.

**Kornell, Hays & Bjork (2009)**, p. 188. Weakly related word pairs. One group studied the pair
intact, for example whale and mammal. The other saw only the first word and had to guess the
second before being shown it. They almost always guessed wrong, usually saying something like
"ocean". The wrong guess still improved learning compared to just studying the pair.

Kane & Anderson (1978) and Slamecka & Fevreiski (1983) found the same decades earlier.

**What this changes.** The value is not only in what the learner eventually produces. It is in
the attempt made before help arrives, and it pays off even when the attempt fails.

Two consequences for the build:

1. **Never serve any level of help until an attempt has been logged.** A wrong query submitted
   before help arrives is not a failure state. It is the treatment. Your policy should require
   "has attempted", not just check estimated competence.

2. **This is your answer to Q2**, the learner who wants the answer at 11pm the night before a
   deadline. You do not have to refuse them. Let them escalate all the way to a full answer, but
   only after an attempt. The attempt is where the learning happens, and a failed one still
   counts. Everyone gets what they want and the mechanism survives. Log the escalation and treat
   escalation rate as data.

That turns the ethical tension from a question about denying people into a question about order.

---

## 6. Your held-out questions should not repeat practised ones

Three studies where the varied-practice group beat the fixed group on an item they had never
practised, while the fixed group had practised exactly that item.

- **Kerr & Booth (1978)**, p. 183. Beanbag toss. Fixed group practised only at 3 feet. Varied
  group practised at 2 and 4 feet, never 3. Final test at 3 feet: the varied group won.
- **Goode, Geraci & Roediger (2008)**, p. 184. Anagrams. One group solved LDOOF three times. The
  other solved three different scrambles of the same word and never saw LDOOF. Tested on LDOOF,
  the group that had never seen it solved more.
- **McCracken & Stelmach (1977)**, p. 183. A timing task. Varied practice was worse in the last
  30 practice trials (about 35 ms error against 20 ms) and better on both the immediate and the
  one-day-delayed transfer test.

Also **Goode & Magill (1986)**, p. 180, badminton serves: the interleaved group retained better
whether tested on the same side of the court or the opposite side.

This supports the decision you already made from Bastani's appendix: held-out questions paired
by concept, not repeats of practised items. The literature says transfer to an unpractised item
is where the effect is largest and clearest, not a harder bar you set yourself for no reason.

---

## 7. Your testers will say the wrong arm was better, and you should expect it

This is the section that should change how you write your counter-metric.

**Baddeley & Longman (1978)**, p. 189. Postal workers learning a keyboard. Distributed practice
produced better long-term retention. The distributed group reported being less satisfied with
their training and felt they were falling behind the massed group. They were right about falling
behind. They were wrong about what it meant.

**Kornell & Bjork (2008)**, p. 189. Learning to recognise painting styles. The interleaved
schedule won on the final test. Most participants said massing had helped them learn better, and
they said this after taking the test that interleaving won.

**Roediger & Karpicke (2006)**, p. 190. Participants predicted that repeated studying would beat
testing at one week. It did not. Their prediction matched the 5-minute result instead.

Survey data points the same way. 93% of students think massing beats spacing (McCabe 2011). 84%
rank rereading as their preferred method and only 11% use self-testing (Karpicke, Butler &
Roediger 2009).

The review's explanation, p. 189: people treat short-term performance as a reliable guide to
long-term learning, and rereading wins because it feels fluent, which gets mistaken for knowing.

**What this means for 27 Sep.** You planned to track abandonment as your counter-metric. Wu and
Kestin already suggested the motivational cliff lands on Arm B rather than Arm A. This adds a
third correction and a sharper one: Arm A participants are likely to report that your tool was
worse, even while scoring higher on the removal test.

Write that prediction down now. Something like:

> Arm A is expected to report lower satisfaction and lower perceived learning than Arm B. Per
> Baddeley & Longman and Kornell & Bjork, self-reported learning tracks how fluent practice felt,
> not how much was retained. A satisfaction gap favouring Arm B alongside a retention gap
> favouring Arm A is the signature of the mechanism working, not evidence against it.

Committing to that costs nothing today and saves the write-up on 28 Sep. Without it you will be
interpreting a satisfaction result you did not predict, after you already know the retention
number.

---

## 8. Direct answers to two of the brief's questions

**Q4: retention improves and completion drops. Which do you optimise?**

The whole review is the answer. Every technique in it makes practice go worse and later
retention better: spacing, interleaving, varied practice, self-testing, generating your own
answers, less guidance.

p. 193: "conditions that appear to degrade acquisition performance are often the very conditions
that yield the most durable and flexible learning."

You optimise retention. The completion drop is a predicted signature, not damage you are
tolerating. Say it that way.

**Q3: your removal test shows no difference. What do you check first?**

This paper adds one item to your checklist that is not currently there: check the actual gap
between practice and removal for each participant, not the planned gap. Someone who practised on
22 Sep and tested on 26 Sep is at 4 days, sitting in the region where Shea & Morgan still had the
wrong condition ahead. A short gap does not weaken your effect, it can reverse it. Treat a short
gap as a measurement failure, in the same category as your manipulation check, not as data.

---

## 9. What the paper says about how to run a study like yours

p. 193, and it reads like it was written for your design:

> "Researchers interested in elucidating factors that optimize learning should be cognizant of
> the possibility that the effects of manipulating a given variable might interact with retention
> interval... we recommend that experimenters include both short- and long-term measures in their
> studies."

You already do this. Practice completion is your short-term measure and the removal test is your
long-term one. Cite this line so that keeping both looks deliberate rather than like an
afterthought.

---

## 10. Useful background that does not change the build

- **Overlearning.** Krueger (1929): practising past the point of getting it right, twice as many
  trials, produced better recall at 28 days, and more overlearning meant more retention. Relevant
  if you are choosing how many repetitions per concept. Extra reps past correct are not wasted.
- **Latent learning.** Tolman & Honzik (1930), rats in a maze. Ten days of no visible improvement,
  then near-instant improvement the moment a reward appeared. The learning had been there the
  whole time and performance was hiding it. A good framing device for a Demo Day slide.
- **The paper says nothing useful about feedback design.** I checked specifically, since your
  scoring harness is feedback-shaped. Reduced, delayed and summary feedback are not covered. The
  only feedback-adjacent finding is that Roediger & Karpicke's testing condition beat restudying
  with no feedback at all. For feedback timing you need a different source, and Koedinger &
  Aleven in this folder has it.
- **Two competing explanations** sit alongside the storage and retrieval account: schema theory
  (Schmidt 1975) and the reloading hypothesis (Lee & Magill 1983, 1985), p. 192. Worth one
  sentence if you want to show you know the mechanism is contested.

---

## 11. What to actually do

1. Paste the two definitions from section 1 into the PRD.
2. Replace the mechanism sentence in your hypothesis with the storage and retrieval version from
   section 4.
3. Add "an attempt must be logged before any help is served" to the policy spec. This is section
   5, and it is the highest-value change in this note.
4. Add the satisfaction-gap prediction from section 7 to your pre-commitments before 27 Sep.
5. Add "actual elapsed gap per participant" to the null-result checklist in
   `../ANALYSIS-PLAN.md`.
6. Cite Baker (1968) next to Bastani. One is 2025 LLM evidence, the other is 1968 motor-skill
   evidence, and they say the same thing.

# Card Math: a credit card prototype

**Live:** https://kumares2013-tech.github.io/ai-portfolio/card-finder/
*Unofficial concept by Kumares Velasamy. Not affiliated with any bank or comparison site.*

## The problem I picked

A Singapore comparison site's own job ad describes comparison journeys that "feel heavier than they should:
long forms, jargon, and decisions most people would rather not think about". I looked at the
credit card journey, because that's where the jargon is densest and where the stress carries on
*after* the click.

What I found, from public pages and public user posts (sources in the research notes):

1. **The card quiz asks what you spend on, never how much.** Its questions are spend categories, reward
   type, bank, income bracket and spend bracket. Without per-category amounts it can't tell you whether
   you'd clear a card's minimum spend or hit its cap, and those two numbers decide whether a card is
   any good for you.
2. **So people do the sum by hand, in public.** First-time card users post their monthly spending line by
   line on r/singaporefi and ask strangers which card to get.
3. **The worst stress comes after applying.** Gifts need a spend target by a date, the bank's reference number
   and a separate claim form. Users post that their account still says "Pending Gift Qualification"
   after meeting the spend.
4. **The page itself talks in jargon a first-timer can't parse:** "S$1 = 20X Points (8 miles)… for
   cardholders who maintain at least S$50,000 average daily balance", "Card Account Opening Date", URN.

## What the prototype does

| User's question | What the page answers |
|---|---|
| "Which card is best for *me*?" | Type in a normal month by category. Get the top three cards in **dollars per month**, ranked. |
| "What's the catch?" | Every minimum spend and cap is checked against *your* numbers, in plain English: "Needs $800 a month; you spend $650." |
| "What would I actually get?" | Year-one value after the annual fee, and the working behind every number. |
| "Why not the others?" | A one-line reason for each card that lost. |
| "How do I not lose the gift?" | A dated plan from the approval date: save the reference number, file the claim, the day **at your pace** you'll reach the spend target, the deadline, and when to chase. One tap puts the dates in your calendar. |

**Design choices**
- Dollars, not rates. "4 mpd" and "8% cashback" mean nothing until they're multiplied by your spending
  and cut by the cap.
- Example numbers on first load, clearly marked, so the page shows its value before anyone types.
- Sign-up gifts are **excluded** from the ranking on purpose. They change every few weeks, and a big
  gift attached to the wrong card costs users money over a year.
- Every number shows its working and links to the bank's own page.

## How the engine works

`evaluate(card, spending)` is a pure function. For each of a card's earn rules, in order:
1. Add up your spending in the rule's categories.
2. If the rule has a minimum spend and your monthly total misses it, record the miss and fall back to the base rate.
3. Apply any cap on eligible spend, then any cap on the reward.
4. Everything not claimed by a bonus rule earns the card's base rate.

Miles are converted at a value you choose (default 1.5 cents). Card rules live in `cards.json`.
Each card carries its source URL and the date it was checked.

**Known simplifications** (a production version needs the bank's merchant-category data):
categories are approximated from merchant types, quarterly and tiered cards are simplified to a
monthly equivalent, and bank-specific exclusions are summarised, not enforced.

## How I'd test it (one week, five users)

- **Who:** people who have applied for a card in the last year, or are about to.
- **Task:** "Find the best card for your spending", once on the current flow and once on this one,
  with the order swapped for half the group.
- **Riskiest assumption:** that people will type in amounts per category. If they won't, the whole
  approach fails, so it's tested first. Fallback: one-tap presets such as "I mostly eat out", "I drive" or "I shop online".
- **Metrics:**
  1. Time to a pick they say they're confident in.
  2. Can they say what the card would earn them next month (within 10%)?
  3. After the gift plan, can they name the claim step? (My prediction: few can on the current flow.)
- **Read date:** the end of the test week. **Kill** the per-category input if fewer than 3 of the 5 complete it without help.
  **Double down** if confident-pick time halves.

## Built with

One HTML file, no framework, no server, hosted on GitHub Pages. Built in an evening with AI
coding agents: one researched the journey and the user complaints, one collected card terms from
the banks' own pages, and one built the page and the engine. I picked the problem, set the flow and
reviewed every number.

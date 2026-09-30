# cards.json: Singapore credit card earn rules

Checked 30 Sep 2026. Every rule comes from the bank's own product page and its T&C, FAQ or fee PDF. No comparison site was used. 13 cards: 6 cashback, 7 miles.

## Reading the file

- `rate_unit`: `percent` for cashback cards and `miles_per_sgd` for miles cards.
- `cap_sgd_per_month` goes with `cap_applies_to`. The two cap types are:
  - **cashback dollars**: the cashback cards
  - **eligible spend**: the miles cards, where 9,000 bonus points works out to S$1,000 of spend
- Where a cap is set per quarter, the file stores the monthly equivalent and says so. HSBC Live+ is S$250 a quarter, stored as S$83.33.
- A category can appear in more than one rule. When it does, the higher rule covers only part of the category, such as one merchant, an online-only payment or one MCC subset, and its `notes` say which part. The base rule covers the rest. The prototype has to assume that share or ask the user.
- Extra fields:
  - `tiers` and `tier_rates` (UOB One)
  - `earn_rules_from_2026_11_01` (OCBC 365, whose new rules start 1 Nov 2026)
  - `choose_one` (UOB Lady's: only one preferred category applies)
  - `first_year_fee_waived`, `annual_fee_notes`, `min_income_notes`, `source_version`
- `miles_value_note` uses 1.5 cents per mile. That is **our assumption, not a bank figure**, so let the user change it.

## Cards and sources

| id | Source (bank) | Confidence | Main uncertainty |
|---|---|---|---|
| uob-one | one-card.page, one_card_full_tnc.pdf (v2.1, 22 Sep 2025), FAQ (19 Mar 2026) | high | Pays a fixed amount per quarter, not a %; merchant bonuses apply only to Grab, Shopee, McDonald's, SimplyGo and Shell |
| uob-evol | evol-card page, EVOL T&C v2.2 (1 Jul 2026), FX promo T&C | high | The 10% applies only to online or mobile-wallet payments, which the prototype can't see. There is no base rate for FX spend; a 1% promo runs until 31 Dec 2026 |
| ocbc-365 | 365 page, current T&C (11 Apr 2025), new T&C from 1 Nov 2026 | high | The rules change in one month, and both sets are included. It is unclear whether the current cap also covers base cashback |
| citi-cash-back | cash-back-card page, FAQ (04/2024), info sheet | high | First-year fee waiver isn't stated. Public transport is excluded; only named ride-hailing and taxi firms earn 8% |
| dbs-live-fresh | product page, cashback T&C (16 Jan 2026), 3.25% FX T&C | high | The 3.25% overseas cashback only offsets FX fees (net gain is about 0.3%). The promo has no stated end date |
| hsbc-live-plus | liveplus page, cashback T&C (13 Mar 2026), HSBC tariff PDF (fee) | high | Minimum income is S$65k unless you already bank with HSBC. Shopping MCCs apply in-store and online |
| citi-premiermiles | premiermiles-card page, card FAQ PDF | high | The first-year fee depends on which welcome offer you pick. The Citi Miles to KrisFlyer ratio (1:1) isn't stated |
| dbs-altitude | altitude page, T&C (Sep 2026) | high | The S$25k fee waiver ended 1 Aug 2026 |
| uob-prvi-miles | prvi-miles-card.page, PRVI T&C | high | Shell and SPC earn 0. The UNI$ conversion fee amount isn't stated |
| hsbc-revolution | revolution page, reward points T&C (1 Apr 2026), tariff PDF | high | 4 mpd needs contactless or online payment at listed MCCs. Groceries, petrol and public transport earn 0.4 |
| dbs-womans-world | Woman's card page, T&C (27 Jul 2026) | high | Minimum income is S$80k. Online food and ride-hailing may also count as "online" |
| uob-ladys | ladys-card page, Lady's T&C v1.1 (Aug 2025) | high | The user picks one category. The page summary said S$192 but the T&C says S$196.20; the T&C figure is used |
| citi-rewards | citi-rewards-card page, 10X T&C (2020 doc, still linked), Citi Kris+ page | medium | The points-to-miles ratio is derived, not published. The "mobile wallet" exclusion is vague |

Full URLs are in each card's `source_urls`.

## Dropped

- **Trust Link**: its bonus structure (up to 15% in Linkpoints at FairPrice Group) is a promotion that ran from 1 Nov 2025 to **30 Sep 2026**, which is the day this was checked. The rules from tomorrow aren't published. The rates are published only as an image in the key facts sheet and also depend on NTUC union membership. Outside the promo, the base is 0.22% local and 0.05% foreign. Add it back once Trust publishes the next table.

## Simplifications the prototype must know about

1. **Things the prototype can't see**:
   - Payment method (contactless, online or chip). This matters for EVOL, HSBC Revolution, Citi Rewards and DBS Woman's World.
   - Merchant (Grab, Shopee, Shell or McDonald's). This matters for UOB One, Citi Cash Back, PRVI and Live+.
   - MCC edge cases: hotel dining, and fast food on HSBC Revolution.
   - Salary crediting. None of the 13 cards needs it; the UOB One Account bonus-interest link is out of scope.
2. **Tiers and minimum spends use different months**:
   - Statement month: UOB One, EVOL, Citi
   - Calendar month: OCBC, DBS, HSBC
   - Calendar quarter: HSBC Live+
   - A monthly spend profile is treated as the same every month.
3. **Per-transaction rounding.** DBS points are counted in S$5 blocks and UOB rounds UNI$ down. Small purchases earn less than the headline rate.
4. **FX fees are not netted out**, except in the DBS Live Fresh note. Foreign-currency spend costs about 3.25% on most cards; UOB EVOL charges no FX fee and Trust charges none either.
5. **Welcome offers, renewal miles and partner portals** (Kaligo, Agoda, Expedia) are left out of `earn_rules`. They appear only in notes.
6. **Bills and utilities.** Most miles cards and HSBC exclude MCC 4900. Where no rule lists `bills_utilities`, treat the rate as **0**, not the base rate.

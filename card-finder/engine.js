/* Card Math engine. Pure functions; no DOM. Loaded by index.html and by test_engine.js.
   Rates: cashback cards in PERCENT, miles cards in MILES PER S$1.
   Every rule is from the bank's own page (see cards.json / CARDS_SOURCES.md, checked 30 Sept 2026).
   Where a bonus depends on something the page can't know (the merchant, the petrol brand),
   the bonus is LEFT OUT and the card's caveat says so, so the numbers never overpromise. */

const CATS = [
  { id: "dining",    name: "Eating out & food delivery", hint: "Restaurants, cafes, GrabFood, foodpanda", ex: 350 },
  { id: "groceries", name: "Groceries",                  hint: "FairPrice, Cold Storage, Sheng Siong, RedMart", ex: 300 },
  { id: "ride",      name: "Grab rides & taxis",         hint: "Grab, Gojek, TADA, ComfortDelGro", ex: 80 },
  { id: "public",    name: "Bus & MRT",                  hint: "Fares paid by tapping your card or phone at the gantry", ex: 60 },
  { id: "online",    name: "Online shopping",            hint: "Shopee, Lazada, Amazon, Taobao in SGD", ex: 200 },
  { id: "petrol",    name: "Petrol",                     hint: "Leave at 0 if you don't drive", ex: 0 },
  { id: "overseas",  name: "Spending overseas",          hint: "Anything charged in a foreign currency, as a monthly average", ex: 100 },
  { id: "other",     name: "Everything else",            hint: "Malls, pharmacy, anything not above. Leave bills out: most cards pay nothing on them.", ex: 180 },
];

const CARDS = [
  { id: "uob-one", name: "UOB One Card", bank: "UOB", type: "cashback", fee: 196.2, waivedY1: true, income: 30000,
    tiers: [{ min: 600, monthly: 20, label: "$60 a quarter" }, { min: 1000, monthly: 33.33, label: "$100 a quarter" }, { min: 2000, monthly: 66.67, label: "$200 a quarter" }],
    rules: [{ cats: ["groceries"], tierRate: { 2: 2.67, 3: 4.67 }, group: "extra", label: "extra on groceries" }],
    groups: { extra: { earnCap: 120 } }, base: 0,
    plain: "Pays a fixed amount each quarter if you spend at least $600 in every month: $60, $100 or $200 a quarter. Spending more inside a tier earns nothing extra.",
    mustDo: ["Spend the tier amount and make at least 10 purchases in every one of the three months. One weak month drops the whole quarter."],
    caveat: "UOB also pays extra at Grab, Shopee, McDonald's, SimplyGo and on SP bills. That's left out here because it depends on the exact shop.",
    source: "https://www.uob.com.sg/personal/cards/cashback/one-card.page" },

  { id: "uob-evol", name: "UOB EVOL Card", bank: "UOB", type: "cashback", fee: 0, waivedY1: true, income: 30000, minSpend: 800,
    rules: [
      { cats: ["online"], rate: 10, needsMin: true, group: "tenpct", label: "online" },
      { cats: ["dining", "groceries", "ride", "public"], rate: 10, needsMin: true, pay: ["phone"], group: "tenpct", label: "phone payments" },
    ],
    groups: { tenpct: { earnCap: 30 }, rest: { earnCap: 30 } }, base: 0.3, baseGroup: "rest", zero: ["overseas"],
    plain: "10% back on online spending and on phone-tap payments in shops, once you spend $800 in a statement month. That 10% is capped at $30 a month.",
    mustDo: ["Spend $800 each statement month.", "In shops, pay with Apple Pay, Google Pay or Samsung Pay. Tapping the plastic card earns only 0.3%."],
    caveat: "Shell and SPC petrol earn nothing. The 1% on overseas spending is a promotion that ends on 31 Dec 2026, so it's left out.",
    source: "https://www.uob.com.sg/personal/cards/cashback/evol-card/index.page" },

  { id: "ocbc-365", name: "OCBC 365 Card", bank: "OCBC", type: "cashback", fee: 196.2, waivedY1: true, income: 30000, minSpend: 800,
    rules: [{ cats: ["dining", "groceries", "ride", "public", "petrol"], rate: 6, needsMin: true, group: "six", label: "food, groceries, transport and petrol" }],
    groups: { six: { earnCap: 160 } }, base: 0.25,
    plain: "6% back on eating out, groceries, transport and petrol once you spend $800 in a calendar month, up to $160 a month.",
    mustDo: ["Spend $800 in each calendar month."],
    caveat: "These are OCBC's new rules from 1 Nov 2026. Bills and streaming lose their bonus on that date. The fee is waived for the first two years.",
    source: "https://www.ocbc.com/personal-banking/cards/365-cashback-credit-card" },

  { id: "citi-cash-back", name: "Citi Cash Back Card", bank: "Citibank", type: "cashback", fee: 196.2, waivedY1: null, income: 30000, minSpend: 800,
    rules: [
      { cats: ["petrol", "ride"], rate: 8, needsMin: true, label: "petrol and private rides" },
      { cats: ["dining", "groceries"], rate: 6, needsMin: true, label: "dining and groceries" },
    ],
    base: 0.2, totalCap: 80, zero: ["public"], notCounted: ["public"],
    plain: "8% on petrol and Grab or taxi rides and 6% on food and groceries, once you spend $800 in a statement month. Everything together is capped at $80 a month.",
    mustDo: ["Spend $800 each statement month. Bus and MRT fares don't count toward it."],
    caveat: "Bus and MRT fares earn nothing on this card. Citi's page doesn't say whether the first-year fee is waived, so the fee is counted.",
    source: "https://www.citibank.com.sg/credit-cards/cashback/cash-back-card" },

  { id: "dbs-live-fresh", name: "DBS Live Fresh Card", bank: "DBS", type: "cashback", fee: 196.2, waivedY1: true, income: 30000, minSpend: 800,
    baseAll: 0.3,
    rules: [
      { cats: ["online"], rate: 5.7, needsMin: true, group: "shop", label: "shopping" },
      { cats: ["ride", "public"], rate: 5.7, needsMin: true, group: "move", label: "transport" },
    ],
    groups: { shop: { earnCap: 50 }, move: { earnCap: 20 } },
    plain: "6% back on shopping (including Shopee and Lazada) and transport once you spend $800 in a calendar month, and 0.3% on everything. The bonus is capped at $50 for shopping and $20 for transport.",
    mustDo: ["Spend $800 in each calendar month."],
    caveat: "The extra 3.25% on spending in Asian currencies only covers the bank's FX fees, so it's left out. Electricity and water bills earn nothing.",
    source: "https://www.dbs.com.sg/personal/cards/credit-cards/live-fresh-dbs-visa-paywave-platinum-card" },

  { id: "hsbc-live-plus", name: "HSBC Live+ Card", bank: "HSBC", type: "cashback", fee: 196.2, waivedY1: true, income: 65000, minSpend: 600,
    rules: [{ cats: ["dining", "online", "petrol"], rate: 5, needsMin: true, label: "dining, shopping and petrol" }],
    base: 0.3, totalCap: 83.33,
    plain: "5% back on dining, shopping and petrol if you spend $600 in every month of the quarter, and 0.3% on the rest. Capped at $250 a quarter.",
    mustDo: ["Spend $600 in each of the three months of every quarter."],
    caveat: "New HSBC customers need S$65,000 income. The petrol bonus is Shell and Caltex only. New cardholders get 8% on dining for their first two quarters, which isn't counted here.",
    source: "https://www.hsbc.com.sg/credit-cards/products/liveplus/" },

  { id: "citi-premiermiles", name: "Citi PremierMiles Card", bank: "Citibank", type: "miles", fee: 196.2, waivedY1: null, income: 30000,
    rules: [{ cats: ["overseas"], rate: 2.2, label: "overseas" }], base: 1.2,
    plain: "1.2 miles per dollar on everything and 2.2 overseas. No categories, no minimum, no cap, and the miles never expire.",
    mustDo: [],
    caveat: "Overseas spending also costs Citi's FX fee of up to 3.25%. Whether the first-year fee is waived depends on the welcome offer you pick, so the fee is counted.",
    source: "https://www.citibank.com.sg/credit-cards/travel/premiermiles-card" },

  { id: "dbs-altitude", name: "DBS Altitude Card", bank: "DBS", type: "miles", fee: 196.2, waivedY1: true, income: 30000,
    rules: [{ cats: ["overseas"], rate: 2.2, label: "overseas" }], base: 1.3,
    plain: "1.3 miles per dollar on everything and 2.2 overseas. No categories, no minimum, no cap.",
    mustDo: [],
    caveat: "The spend-based fee waiver ended on 1 Aug 2026. Points are counted in $5 blocks, so small purchases round down.",
    source: "https://www.dbs.com.sg/personal/cards/credit-cards/dbs-altitude-cards" },

  { id: "uob-prvi-miles", name: "UOB PRVI Miles Card", bank: "UOB", type: "miles", fee: 261.6, waivedY1: true, income: 30000,
    rules: [{ cats: ["overseas"], rate: 2.4, label: "overseas" }], base: 1.4,
    plain: "1.4 miles per dollar on everything and 2.4 overseas. The highest flat rate here, with no minimum and no cap.",
    mustDo: [],
    caveat: "Shell and SPC petrol earn nothing on the Visa and Mastercard versions. After year one, its annual fee is the highest here.",
    source: "https://www.uob.com.sg/personal/cards/travel/prvi-miles-card.page" },

  { id: "hsbc-revolution", name: "HSBC Revolution Card", bank: "HSBC", type: "miles", fee: 0, waivedY1: true, income: 65000,
    rules: [
      { cats: ["dining"], rate: 4, pay: ["phone", "tap"], group: "four", label: "dining (tap or online)" },
      { cats: ["ride", "online"], rate: 4, group: "four", label: "rides and online shopping" },
    ],
    groups: { four: { spendCap: 1000 } }, base: 0.4,
    plain: "4 miles per dollar on dining, Grab rides and online shopping, on up to $1,000 a month, and 0.4 elsewhere. No annual fee.",
    mustDo: ["Tap or pay online at restaurants. Inserting the card earns 0.4."],
    caveat: "New HSBC customers need S$65,000 income. Fast food and supermarkets don't count, and overseas earns 4 only on flight and hotel bookings.",
    source: "https://www.hsbc.com.sg/credit-cards/products/revolution/" },

  { id: "dbs-womans-world", name: "DBS Woman's World Card", bank: "DBS", type: "miles", fee: 196.2, waivedY1: true, income: 80000,
    rules: [{ cats: ["online"], rate: 4, group: "four", label: "online" }, { cats: ["overseas"], rate: 1.2, label: "overseas in shops" }],
    groups: { four: { spendCap: 1000 } }, base: 0.4,
    plain: "4 miles per dollar on online spending, up to $1,000 a month, and 0.4 elsewhere.",
    mustDo: [],
    caveat: "Needs S$80,000 income. Food delivery and in-app rides may also count as online, but they aren't counted here. The fee waiver for spending S$25,000 ended on 1 Aug 2026.",
    source: "https://www.dbs.com.sg/personal/cards/credit-cards/dbs-woman-mastercard-card" },

  { id: "uob-ladys", name: "UOB Lady's Card", bank: "UOB", type: "miles", fee: 196.2, waivedY1: true, income: 30000,
    choose: [
      { name: "Dining", rules: [{ cats: ["dining"], rate: 4, group: "four", label: "dining (your pick)" }] },
      { name: "Family", rules: [{ cats: ["groceries"], rate: 4, group: "four", label: "groceries (your pick)" }] },
      { name: "Transport", rules: [{ cats: ["ride", "public", "petrol"], rate: 4, group: "four", label: "transport (your pick)" }] },
    ],
    groups: { four: { spendCap: 1000 } }, base: 0.4,
    plain: "4 miles per dollar on one category you choose each quarter, on up to $1,000 a month, and 0.4 on everything else.",
    mustDo: ["Register your category with UOB every quarter. If you skip it, you earn 0.4 on everything."],
    caveat: "The Travel category covers only flights and hotels, and Fashion covers only clothes shops, so neither is modelled here.",
    source: "https://www.uob.com.sg/personal/cards/rewards/ladys-card/index.page" },

  { id: "citi-rewards", name: "Citi Rewards Card", bank: "Citibank", type: "miles", fee: 196.2, waivedY1: true, income: 30000,
    rules: [{ cats: ["online"], rate: 4, group: "four", label: "online shopping" }],
    groups: { four: { spendCap: 1000 } }, base: 0.4,
    plain: "4 miles per dollar on online shopping, on up to $1,000 a month, and 0.4 elsewhere.",
    mustDo: [],
    caveat: "Food delivery, online groceries and in-app rides can also earn 4, but they aren't counted here. Citi doesn't publish the points-to-miles rate as a single figure; it's taken from Citi's Kris+ page.",
    source: "https://www.citibank.com.sg/credit-cards/rewards/citi-rewards-card" },
];

const fmt = (n, d = 0) => "$" + Number(n).toLocaleString("en-SG", { minimumFractionDigits: d, maximumFractionDigits: d });

/* One month of one card. Returns earned (cash $ or miles), dollars, lines and plain-English checks. */
function evaluateRules(card, rules, spend, opts) {
  const counted = CATS.filter(c => !(card.notCounted || []).includes(c.id)).reduce((a, c) => a + (spend[c.id] || 0), 0);
  const minMet = !card.minSpend || counted >= card.minSpend;
  const tierIdx = card.tiers ? card.tiers.map(t => counted >= t.min).lastIndexOf(true) : -1;
  const pct = card.type === "cashback" ? 0.01 : 1;
  const checks = [], lines = [];
  const remaining = { ...spend };
  const used = {}, earnedIn = {};
  let earned = 0;

  if (card.minSpend) checks.push(minMet
    ? { kind: "ok", text: `You clear the ${fmt(card.minSpend)} minimum spend (you put ${fmt(counted)} on the card).` }
    : { kind: "warn", text: `Needs ${fmt(card.minSpend)} a month to unlock the bonus. You spend ${fmt(counted)}, so you'd get the base rate. ${fmt(card.minSpend - counted)} more a month would change that.` });

  if (card.tiers) {
    if (tierIdx < 0) checks.push({ kind: "warn", text: `Needs at least ${fmt(card.tiers[0].min)} every month. You spend ${fmt(counted)}, so it pays nothing.` });
    else {
      const t = card.tiers[tierIdx], next = card.tiers[tierIdx + 1];
      checks.push({ kind: "ok", text: `You reach the ${fmt(t.min)} tier: ${t.label}.` + (next ? ` The next tier needs ${fmt(next.min)} a month.` : "") });
      lines.push({ label: `Fixed cashback, ${t.label}`, spend: counted, value: t.monthly });
      earned += t.monthly;
    }
  }

  for (const r of rules) {
    const elig = r.cats.reduce((a, c) => a + (remaining[c] || 0), 0);
    if (!elig) continue;
    if (r.needsMin && !minMet) continue;
    if (r.pay && !r.pay.includes(opts.pay)) {
      checks.push({ kind: "warn", text: `The bonus on ${r.label} only counts if you pay ${r.pay.includes("tap") ? "by tapping or online" : "with your phone"}. You said you usually ${opts.pay === "insert" ? "insert your card" : "tap the card"}.` });
      continue;
    }
    let rate = r.rate;
    if (r.tierRate) { rate = r.tierRate[tierIdx + 1] || 0; if (!rate) continue; }
    const g = r.group && card.groups[r.group];
    let base = elig;
    if (g && g.spendCap) {
      const room = Math.max(0, g.spendCap - (used[r.group] || 0));
      if (base > room) checks.push({ kind: "warn", text: `Only ${fmt(g.spendCap)} a month earns the bonus rate. ${fmt(base - room)} of your ${r.label} goes over and earns ${card.base}${card.type === "cashback" ? "%" : " mpd"}.` });
      base = Math.min(base, room);
      used[r.group] = (used[r.group] || 0) + base;
    }
    let value = base * rate * pct;
    if (g && g.earnCap) {
      const room = Math.max(0, g.earnCap - (earnedIn[r.group] || 0));
      if (value > room) checks.push({ kind: "warn", text: `This card's bonus${rules.filter(x => x.group === r.group).length > 1 ? "" : " on " + r.label} is capped at ${fmt(g.earnCap)} a month. You'd hit the cap, so ${fmt(value - room, 2)} of it is lost.` });
      value = Math.min(value, room);
      earnedIn[r.group] = (earnedIn[r.group] || 0) + value;
    }
    lines.push({ label: `${r.label} at ${rate}${card.type === "cashback" ? "%" : " mpd"}`, spend: base, value });
    earned += value;
    let over = elig - base;
    for (const c of r.cats) remaining[c] = 0;
    if (over > 0) remaining.__over = (remaining.__over || 0) + over;
  }

  if (card.baseAll) {
    const all = CATS.reduce((a, c) => a + (spend[c.id] || 0), 0);
    const v = all * card.baseAll * pct;
    lines.push({ label: `${card.baseAll}% on everything`, spend: all, value: v });
    earned += v;
  } else if (card.base) {
    const zero = card.zero || [];
    const left = Object.entries(remaining).filter(([k]) => !zero.includes(k)).reduce((a, [, v]) => a + v, 0);
    let v = left * card.base * pct;
    if (card.baseGroup && card.groups[card.baseGroup].earnCap) v = Math.min(v, card.groups[card.baseGroup].earnCap);
    if (left > 0) { lines.push({ label: `Everything else at ${card.base}${card.type === "cashback" ? "%" : " mpd"}`, spend: left, value: v }); earned += v; }
  }
  if (card.totalCap && earned > card.totalCap) {
    checks.push({ kind: "warn", text: `The card pays at most ${fmt(card.totalCap, card.totalCap % 1 ? 2 : 0)} a month in total. You'd hit that, so ${fmt(earned - card.totalCap, 2)} is lost.` });
    earned = card.totalCap;
  }
  return { earned, lines, checks };
}

function evaluate(card, spend, opts) {
  let best, choice;
  if (card.choose) {
    for (const ch of card.choose) {
      const r = evaluateRules(card, ch.rules, spend, opts);
      if (!best || r.earned > best.earned) { best = r; choice = ch.name; }
    }
    best.checks.unshift({ kind: "ok", text: `Best category for your month: ${choice}. You choose it with UOB every quarter.` });
  } else best = evaluateRules(card, card.rules || [], spend, opts);
  const dollars = card.type === "miles" ? best.earned * opts.mileCents / 100 : best.earned;
  const feeY1 = card.waivedY1 ? 0 : card.fee;
  return { card, ...best, dollars, yearOne: dollars * 12 - feeY1, yearTwo: dollars * 12 - card.fee, choice };
}

if (typeof module !== "undefined") module.exports = { CATS, CARDS, evaluate, fmt };

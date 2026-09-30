const { CARDS, evaluate } = require("./engine.js");
const ex = { dining: 350, groceries: 300, ride: 80, public: 60, online: 200, petrol: 0, overseas: 100, other: 180 }; // total 1270
const opts = { pay: "phone", mileCents: 1.5 };
for (const c of CARDS) { const r = evaluate(c, ex, opts); console.log(c.id.padEnd(18), c.type.padEnd(8), r.earned.toFixed(2).padStart(8), "$" + r.dollars.toFixed(2).padStart(7), "y2", r.yearTwo.toFixed(0)); }
// controls hand-checked below
const hand = [
  ["ocbc-365 example", evaluate(CARDS.find(c=>c.id==="ocbc-365"), ex, opts).dollars, Math.min(160,(350+300+80+60)*0.06) + (200+100+180)*0.0025],
  ["citi-cb example (public not counted: 1210>=800)", evaluate(CARDS.find(c=>c.id==="citi-cash-back"), ex, opts).dollars, Math.min(80, 80*0.08 + (350+300)*0.06 + (200+100+180)*0.002)],
  ["evol example", evaluate(CARDS.find(c=>c.id==="uob-evol"), ex, opts).dollars, 30 + Math.min(30,(100*0)+(180)*0.003)],
  ["evol tap card", evaluate(CARDS.find(c=>c.id==="uob-evol"), ex, {...opts,pay:"tap"}).dollars, 20 + Math.min(30,(350+300+80+60+180)*0.003)],
  ["uob-one tier2 (1270): 33.33 + groceries 300*2.67%", evaluate(CARDS.find(c=>c.id==="uob-one"), ex, opts).dollars, 33.33 + 300*0.0267],
  ["live fresh", evaluate(CARDS.find(c=>c.id==="dbs-live-fresh"), ex, opts).dollars, Math.min(50,200*0.057)+Math.min(20,140*0.057)+1270*0.003],
  ["revolution miles", evaluate(CARDS.find(c=>c.id==="hsbc-revolution"), ex, opts).earned, (350+80+200)*4 + (300+60+100+180)*0.4],
  ["low spend 500 ocbc (min missed)", evaluate(CARDS.find(c=>c.id==="ocbc-365"), {dining:500,groceries:0,ride:0,public:0,online:0,petrol:0,overseas:0,other:0}, opts).dollars, 500*0.0025],
];
for (const [n,a,b] of hand) console.log((Math.abs(a-b)<0.01?"PASS":"FAIL"), n, a.toFixed(2), "expected", b.toFixed(2));

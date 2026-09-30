# Kumares Velasamy — Data & AI Automation Engineer

I build working software with AI coding agents and ship it: a live paid SaaS, a 90 GB market-data
pipeline, and automated video pipelines. Before this I spent over five years keeping enterprise
infrastructure running at IBM Singapore, SITA and a major Singapore bank. I bring that operations
discipline to how I run agents: guard rails, backups, rollback, and checking the live thing.

**Looking for:** Forward Deployed Engineer · AI Solutions Engineer · Data Engineer / Python
Integrations · Singapore, hybrid or remote.

---

## Featured work

### [Trading Reps](case-studies/trading-reps.md): live SaaS, built solo in 11 days
A practice app where beginner traders mark trades on 3,100+ real historical charts with the ending
hidden. Cloudflare Worker auth and gating, Stripe billing, an AI "find charts like mine" feature,
and a 31-lesson video course built by AI agents.
`Python` `Cloudflare Workers` `Stripe` `Gemini` `Claude Code` · [tradingreps.co](https://tradingreps.co)

### [Card Math: a credit card prototype](card-finder/) · [try it live](https://kumares2013-tech.github.io/ai-portfolio/card-finder/)
Comparison sites ask *what* you spend on, never *how much*, so they can't tell you whether you'd
clear a card's minimum spend or hit its cap. Type in your month and see your best Singapore cards in
dollars, with every catch in plain English and a dated plan so you don't lose the sign-up gift. The rules
for 13 cards come from the banks' own pages, and the maths is checked by tests.
`JavaScript` `product design` `research`

### [How I run AI coding agents](case-studies/ai-development-workflow.md)
*The model is stateless. Your project isn't.* The file-based system (rules, board, handover, agent
briefs, logs) that keeps multi-week projects on track across sessions and models, and the failures
that shaped each rule.

### IRONFLOW: market data pipeline *(private, write-up coming)*
Python pipeline that turns ~90 GB of minute-level market data into a compressed Parquet archive.
Cut the daily run from 30+ minutes to ~13 by redesigning how data passes between steps. Timestamped
backups, syntax checks and automatic rollback on error.

### MakanBuddy
A hawker-food PWA on Cloudflare Pages, with a WhatsApp Cloud API bot designed for surplus-food alerts.
I also produced its 100-second animated investor trailer. · [makanbuddy.pages.dev](https://makanbuddy.pages.dev)

---

## Skills

| Area | What I've actually used |
|---|---|
| AI engineering | Claude Code, multi-agent workflows, context engineering, vision + TTS models, Gemini API |
| Data | Python, ETL, Parquet/zstd, large-dataset processing, backtesting |
| Web + edge | Cloudflare Workers / Pages / KV, Next.js, React, PWAs, REST APIs |
| Integrations | Stripe, Resend, WhatsApp Cloud API, SEC EDGAR, Supabase |
| Operations | Data centre ops, monitoring, incident handling, change control, PowerShell |

## This repo

| Folder | What's in it |
|---|---|
| `case-studies/` | Write-ups of real private projects. Architecture, decisions, results. No private code. |
| `card-finder/` | Card Math: a live prototype, its research-backed card rules (`cards.json`) and its maths tests. |
| `project-1-rag/` | *In progress:* a small question-answering tool over public documents. |
| `tools/secret_check.py` | Pre-commit hook that blocks keys, tokens and private paths from ever being pushed. |

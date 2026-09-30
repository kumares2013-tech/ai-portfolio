# CLAUDE.md — ai-portfolio (PUBLIC REPO)

Everything in this folder is published on GitHub for recruiters to read.

## Hard rules
1. **Never** copy a file, code or data from `C:\Trading\`, `C:\Users\65811\My Drive\` or any
   other private project. Describe them here in words and diagrams only.
2. **No secrets:** no API keys, tokens, account IDs, `.env` files, personal phone numbers or home address.
3. **No trading logic:** no scanning rules, thresholds, selection criteria, data vendor names or datasets.
4. **Never invent a result.** Every number must come from `PORTFOLIO_CONTEXT.md` or be confirmed by
   the owner. If a fact is missing, ask for it.
5. Run `python tools/secret_check.py` before every commit. The pre-commit hook does it too.

## Where things are
- `PORTFOLIO_CONTEXT.md` — the approved facts. The only source of numbers.
- `OUTSTANDING.md` — what is next.
- `case-studies/` — write-ups of real private projects.
- `project-*` — small public demos that are real, running and explainable.

## Voice
Plain, specific English. Say what happened, the decision taken and why, and the result.
Don't use buzzwords, and don't claim more than was done.

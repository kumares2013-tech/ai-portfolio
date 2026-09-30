"""Install tools/secret_check.py as this repo's git pre-commit hook."""
from pathlib import Path

hook = Path(".git/hooks/pre-commit")
hook.write_text("#!/bin/sh\npython tools/secret_check.py\n", encoding="utf-8", newline="\n")
print(f"installed {hook}")

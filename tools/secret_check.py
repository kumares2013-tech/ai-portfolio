"""Block a commit that would publish a secret or private material.

Runs as a git pre-commit hook (see tools/install_hook.py) and scans the files
staged for commit. Exits 1 with the file, line and reason if anything matches.

    python tools/secret_check.py          # scan staged files
    python tools/secret_check.py --all    # scan every tracked file
"""
import re
import subprocess
import sys

PATTERNS = {
    "Stripe live key": r"\b[sr]k_live_[0-9A-Za-z]{10,}",
    "Stripe webhook secret": r"\bwhsec_[0-9A-Za-z]{10,}",
    "Anthropic key": r"\bsk-ant-[0-9A-Za-z_\-]{10,}",
    "OpenAI-style key": r"\bsk-[0-9A-Za-z]{32,}",
    "Google API key": r"\bAIza[0-9A-Za-z_\-]{30,}",
    "GitHub token": r"\bgh[pousr]_[0-9A-Za-z]{30,}",
    "AWS access key": r"\bAKIA[0-9A-Z]{16}\b",
    "Private key block": r"-----BEGIN [A-Z ]*PRIVATE KEY-----",
    "Assigned secret": r"(?i)\b(api[_-]?key|secret|token|password)\b\s*[:=]\s*['\"][^'\"\s]{12,}['\"]",
    "Singapore phone number": r"\+65[\s-]?[689]\d{3}[\s-]?\d{4}",
    "Private folder path": r"(?i)C:\\+(Trading|Users\\+[^\\]+\\+My Drive)",
}
BLOCKED_NAMES = re.compile(r"(^|/)(\.env(\..*)?|.*\.(pem|key|p12|parquet|sqlite|db))$")
ALLOWED_NAMES = {".env.example", "tools/secret_check.py", "CLAUDE.md"}


def git(*args):
    return subprocess.run(["git", *args], capture_output=True, text=True, encoding="utf-8", errors="replace", check=True).stdout


def files_to_scan(scan_all):
    out = git("ls-files") if scan_all else git("diff", "--cached", "--name-only", "--diff-filter=ACM")
    return [f for f in out.splitlines() if f]


def read(path, scan_all):
    try:
        if scan_all:
            with open(path, encoding="utf-8", errors="ignore") as f:
                return f.read()
        return git("show", f":{path}")
    except (OSError, subprocess.CalledProcessError, UnicodeDecodeError):
        return ""


def main():
    scan_all = "--all" in sys.argv
    problems = []
    for path in files_to_scan(scan_all):
        if path in ALLOWED_NAMES:
            continue
        if BLOCKED_NAMES.search(path):
            problems.append(f"{path}: file type must never be committed")
            continue
        for n, line in enumerate(read(path, scan_all).splitlines(), 1):
            for reason, pattern in PATTERNS.items():
                if re.search(pattern, line):
                    problems.append(f"{path}:{n}: {reason}")
    if problems:
        print("SECRET CHECK FAILED - nothing was committed:\n  " + "\n  ".join(problems))
        return 1
    print("secret check: clean")
    return 0


if __name__ == "__main__":
    sys.exit(main())

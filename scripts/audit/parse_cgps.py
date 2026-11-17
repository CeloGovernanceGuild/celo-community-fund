"""Parse celo-org/governance CGPs: metadata + mainnet.json transactions. Prints JSON."""
import json, os, re, sys

root = sys.argv[1] if len(sys.argv) > 1 else "."
cgps_dir = os.path.join(root, "CGPs")
out = []
for name in sorted(os.listdir(cgps_dir)):
    m = re.match(r"cgp-(\d+)\.md$", name)
    if not m:
        continue
    num = int(m.group(1))
    text = open(os.path.join(cgps_dir, name), encoding="utf-8", errors="replace").read()
    meta = {}
    fm = re.match(r"^---\s*\n(.*?)\n---", text, re.S)
    if fm:
        for line in fm.group(1).splitlines():
            if ":" in line:
                k, v = line.split(":", 1)
                meta[k.strip().lower()] = v.strip().strip('"').strip("'")
    else:
        # some old CGPs use a markdown table/list header
        for k in ("status", "governance-proposal-id", "date-executed", "title"):
            mm = re.search(rf"{k}\s*[:|]\s*([^\n|]+)", text, re.I)
            if mm:
                meta[k] = mm.group(1).strip()
    txs = None
    for cand in (os.path.join(cgps_dir, f"cgp-{num:04d}", "mainnet.json"),):
        if os.path.exists(cand):
            try:
                txs = json.load(open(cand))
            except Exception as e:
                txs = {"error": str(e)}
    extra = []
    d = os.path.join(cgps_dir, f"cgp-{num:04d}")
    if os.path.isdir(d):
        extra = sorted(os.listdir(d))
    out.append({"cgp": num, "meta": meta, "files": extra, "mainnet": txs})
json.dump(out, sys.stdout)

"""Fetch CELO transfers into the fund over the last year (Blockscout)."""
import json, sys, time, urllib.request

GOVT = "0x" + "d533ca259b330c7a88f74e000a3faea2d63b7972".rjust(64, "0")
TRANSFER = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
CELO = "0x471EcE3750Da237f93B8E339c536989b8978a438"

def get(lo, hi):
    url = (f"https://celo.blockscout.com/api?module=logs&action=getLogs&fromBlock={lo}&toBlock={hi}"
           f"&address={CELO}&topic0={TRANSFER}&topic2={GOVT}&topic0_2_opr=and")
    for attempt in range(6):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "celo-community-fund-audit/1.0"})
            res = json.load(urllib.request.urlopen(req, timeout=90)).get("result") or []
            if len(res) >= 1000 and hi - lo > 1:
                mid = (lo + hi) // 2
                return get(lo, mid) + get(mid + 1, hi)
            return res
        except Exception:
            time.sleep(3 * (attempt + 1))
    raise SystemExit("blockscout request failed")

latest = json.load(open("chain.json"))["latest_block"]
json.dump(get(latest - 365 * 86400, latest), open(sys.argv[1], "w"))

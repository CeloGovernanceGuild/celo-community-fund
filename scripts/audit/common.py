"""Shared helpers for the audit scripts. All token amounts are integers in wei (18 decimals)."""
import json, time, urllib.request

RPC = "https://forno.celo.org"
UA = {"User-Agent": "celo-community-fund-audit/1.0"}
GOV = "0xd533ca259b330c7a88f74e000a3faea2d63b7972"
TOKENS = {  # symbol -> address
    "CELO": "0x471EcE3750Da237f93B8E339c536989b8978a438",
    "USDm": "0x765DE816845861e75A25fCA122bb6898B8B1282a",
    "EURm": "0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73",
}
BY_ADDRESS = {a.lower(): s for s, a in TOKENS.items()}
CGP_CONTRACTS = {"GoldToken": "CELO", "StableToken": "USDm", "StableTokenEUR": "EURm"}
APPROVAL = "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925"
TRANSFER = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
EXECUTED = "0x712ae1383f79ac853f8d882153778e0260ef8f03b504e2866e0593e04d2b291f"


def rpc(method, params, retries=8):
    body = json.dumps({"jsonrpc": "2.0", "id": 1, "method": method, "params": params}).encode()
    for attempt in range(retries):
        try:
            req = urllib.request.Request(RPC, data=body, headers={"Content-Type": "application/json", **UA})
            res = json.load(urllib.request.urlopen(req, timeout=90)).get("result")
            if res is not None:
                return res
        except Exception:
            pass
        time.sleep(min(2 ** attempt, 30))
    raise SystemExit(f"rpc failed: {method} {params}")


def word(address):
    return address.lower().replace("0x", "").rjust(64, "0")


def balance_of(token, holder, block="latest"):
    data = "0x70a08231" + word(holder)
    return int(rpc("eth_call", [{"to": TOKENS[token], "data": data}, block]), 16)


def allowance(token, spender, block="latest"):
    data = "0xdd62ed3e" + word(GOV) + word(spender)
    return int(rpc("eth_call", [{"to": TOKENS[token], "data": data}, block]), 16)


def fmt(wei):
    """Exact decimal string with thousands separators and no rounding."""
    sign = "-" if wei < 0 else ""
    wei = abs(wei)
    whole, frac = divmod(wei, 10**18)
    s = f"{whole:,}"
    frac_s = str(frac).rjust(18, "0").rstrip("0")
    return sign + s + ("." + frac_s if frac_s else "")

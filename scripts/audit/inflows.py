"""Pure helpers for the CELO flow audit.

Blockscout's v2 token-transfer endpoint indexes both normal CELO token movements
and CELO value transfers inside Safe executions. Keeping its response in one
shape makes the reconciliation testable and avoids treating event logs as a
complete ledger.
"""
import datetime

GOV = "0xd533ca259b330c7a88f74e000a3faea2d63b7972"


def address(value):
    return value.lower()


def _direction(sender, recipient):
    sender, recipient = address(sender), address(recipient)
    if recipient == GOV and sender != GOV:
        return "in"
    if sender == GOV and recipient != GOV:
        return "out"
    return None


def blockscout_transfer(item):
    """Normalise one Blockscout v2 CELO transfer, or ignore an irrelevant row."""
    sender = item["from"]["hash"]
    recipient = item["to"]["hash"]
    direction = _direction(sender, recipient)
    if not direction:
        return None
    timestamp = datetime.datetime.fromisoformat(item["timestamp"].replace("Z", "+00:00"))
    return {
        "direction": direction,
        "source": "blockscout_transfer",
        "from": address(sender),
        "to": address(recipient),
        "amount": str(int(item["total"]["value"])),
        "block": int(item["block_number"]),
        "timestamp": int(timestamp.timestamp()),
        "tx": item["transaction_hash"].lower(),
        "index": int(item["log_index"]) if item.get("log_index") is not None else -1,
    }


def unique_sorted(flows):
    """Remove repeated API records without coalescing distinct transfers."""
    seen, result = set(), []
    for flow in flows:
        if not flow:
            continue
        key = (flow["tx"], flow["index"])
        if key not in seen:
            seen.add(key)
            result.append(flow)
    return sorted(result, key=lambda x: (x["block"], x["tx"], x["index"]))


def reconcile(flows, balance_start, balance_end):
    incoming = sum(int(x["amount"]) for x in flows if x["direction"] == "in")
    outgoing = sum(int(x["amount"]) for x in flows if x["direction"] == "out")
    observed_delta = incoming - outgoing
    balance_delta = balance_end - balance_start
    return {
        "balance_start": str(balance_start),
        "balance_end": str(balance_end),
        "incoming": str(incoming),
        "outgoing": str(outgoing),
        "observed_delta": str(observed_delta),
        "balance_delta": str(balance_delta),
        "unexplained": str(balance_delta - observed_delta),
    }


def rpc_log_transfer(log, timestamp):
    """Normalise one CELO `Transfer` log read from the RPC node, or ignore an irrelevant one."""
    sender = "0x" + log["topics"][1][-40:]
    recipient = "0x" + log["topics"][2][-40:]
    direction = _direction(sender, recipient)
    if not direction:
        return None
    return {
        "direction": direction,
        "source": "rpc_log",
        "from": address(sender),
        "to": address(recipient),
        "amount": str(int(log["data"], 16)),
        "block": int(log["blockNumber"], 16),
        "timestamp": int(timestamp),
        "tx": log["transactionHash"].lower(),
        "index": int(log["logIndex"], 16),
    }


def net_until(flows, block):
    """Net CELO (in minus out) of the flows up to and including `block`."""
    return sum(int(x["amount"]) * (1 if x["direction"] == "in" else -1) for x in flows if x["block"] <= block)


def gap_blocks(lo, hi, drift):
    """Blocks in (lo, hi] where the balance moved without a recorded flow.

    `drift(block)` is the balance change since the start of the window minus the net
    recorded flows up to that block. It only changes at a block with an unrecorded
    flow, so a bisection finds each one in about log2(hi - lo) balance reads. Two
    unrecorded flows that cancel each other exactly inside one half are not found.
    """
    found = []

    def walk(lo, hi, at_lo, at_hi):
        if at_lo == at_hi:
            return
        if hi - lo == 1:
            found.append(hi)
            return
        mid = (lo + hi) // 2
        at_mid = drift(mid)
        walk(lo, mid, at_lo, at_mid)
        walk(mid, hi, at_mid, at_hi)

    walk(lo, hi, drift(lo), drift(hi))
    return found

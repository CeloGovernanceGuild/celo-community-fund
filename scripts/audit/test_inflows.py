"""Regression tests for the CELO flow normalisation used by fetch_inflows.py."""
import unittest

from inflows import GOV, blockscout_transfer, reconcile, unique_sorted

E = 10**18
SENDER = "0x1111111111111111111111111111111111111111"


def transfer(*, sender=SENDER, recipient=GOV, amount=E, block=100, tx="0xtx", index=1):
    return {
        "from": {"hash": sender}, "to": {"hash": recipient},
        "total": {"value": str(amount)}, "block_number": block,
        "timestamp": "2026-11-06T14:03:34.000000Z", "transaction_hash": tx,
        "log_index": index,
    }


class InflowTests(unittest.TestCase):
    def test_keeps_each_blockscout_transfer_once(self):
        one = blockscout_transfer(transfer(amount=3 * E, tx="0xone", index=2))
        two = blockscout_transfer(transfer(amount=5 * E, tx="0xtwo", index=3, block=101))
        flows = unique_sorted([one, two, one])
        self.assertEqual([x["tx"] for x in flows], ["0xone", "0xtwo"])
        self.assertEqual(reconcile(flows, 2 * E, 10 * E)["unexplained"], "0")

    def test_preserves_zero_log_index(self):
        self.assertEqual(blockscout_transfer(transfer(index=0))["index"], 0)

    def test_keeps_the_known_operations_safe_native_payment(self):
        # This 625,553 CELO Safe value call on 2026-11-06 has no canonical
        # CELO Transfer event. Blockscout v2 indexes it as a token transfer.
        flow = blockscout_transfer(transfer(
            sender="0x7a1e98fc9a008107dbd1f430a05ace8cf6f3fe19", amount=625_553 * E,
            block=82_075_456, tx="0xd46e014b3f9da3e3c4ee1b698f6bbaf08a62e6f5212970091a5fee59dc20ab14", index=-300_004,
        ))
        self.assertEqual(flow["direction"], "in")
        self.assertEqual(flow["amount"], str(625_553 * E))
        self.assertEqual(flow["source"], "blockscout_transfer")

    def test_ignores_self_transfers(self):
        self.assertIsNone(blockscout_transfer(transfer(sender=GOV, recipient=GOV)))

    def test_reports_unexplained_balance_change(self):
        flow = blockscout_transfer(transfer())
        rec = reconcile([flow], 0, 3 * E)
        self.assertEqual(rec["observed_delta"], str(E))
        self.assertEqual(rec["unexplained"], str(2 * E))


if __name__ == "__main__":
    unittest.main()

import { describe, expect, it } from "vitest";
import { buildFundState } from "./fund.js";

const initiatives = [
  { title: "A", approved: 1000, proposal: "a" },
  { title: "B", approved: 500, proposal: "b" },
];
const drafts = [{ title: "D", amount: 200 }];

describe("buildFundState", () => {
  it("subtracts allowances and drafts from the balance", () => {
    const state = buildFundState({ balance: 10000, allowances: { A: 400, B: 0 }, initiatives, drafts });

    expect(state.initiativesAvailable).toBe(400);
    expect(state.draftsTotal).toBe(200);
    expect(state.fundsAvailable).toBe(9400);
    expect(state.funds.map((f) => f.spent)).toEqual([600, 500]);
  });

  it("builds lifetime and current charts without mutating inputs", () => {
    const state = buildFundState({ balance: 10000, allowances: { A: 400 }, initiatives, drafts });

    expect(state.charts.Current.children).toHaveLength(1);
    expect(state.charts.Lifetime.children).toHaveLength(2);
    expect(state.charts.Lifetime.children[0].children.map((c) => c.name)).toEqual(["Community Fund", "A", "B", "Drafts"]);
    expect(initiatives[0]).not.toHaveProperty("available");
  });

  it("lists the Community Fund first with its explorer link, and drafts last", () => {
    const { table } = buildFundState({ balance: 10000, allowances: {}, initiatives, drafts });

    expect(table[0].name).toBe("Community Fund");
    expect(table[0].proposal).toMatch(/celoscan\.io/);
    expect(table.at(-1)).toMatchObject({ name: "D", approved: 200, draft: true });
  });

  it("never produces a negative chart slice when drafts exceed the balance", () => {
    const state = buildFundState({ balance: 100, allowances: {}, initiatives, drafts });

    expect(state.fundsAvailable).toBe(-100);
    expect(state.charts.Current.children[0].children[0].loc).toBe(0);
  });
});

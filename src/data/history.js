// Snapshot of 2026-11-19, not refreshed by the daily audit. Edit by hand or regenerate; see docs/history.md.
// Proposals, eras and the movement map of organisations, from celo-org/governance and on-chain events.
export const history = {
  "snapshot": "2026-11-19",
  "totals": {
    "cgps": 255,
    "passed": 210,
    "notPassed": 29,
    "withdrawn": 16,
    "submissions": 317,
    "contested": 18
  },
  "years": [
    {
      "year": 2020,
      "companies": 13,
      "community": 0,
      "partners": 0,
      "total": 13,
      "passed": 10,
      "notPassed": 3
    },
    {
      "year": 2021,
      "companies": 28,
      "community": 3,
      "partners": 2,
      "total": 33,
      "passed": 27,
      "notPassed": 1
    },
    {
      "year": 2022,
      "companies": 16,
      "community": 5,
      "partners": 0,
      "total": 21,
      "passed": 16,
      "notPassed": 0
    },
    {
      "year": 2023,
      "companies": 20,
      "community": 13,
      "partners": 10,
      "total": 43,
      "passed": 35,
      "notPassed": 6
    },
    {
      "year": 2024,
      "companies": 21,
      "community": 13,
      "partners": 7,
      "total": 41,
      "passed": 36,
      "notPassed": 5
    },
    {
      "year": 2025,
      "companies": 43,
      "community": 17,
      "partners": 4,
      "total": 64,
      "passed": 52,
      "notPassed": 10
    },
    {
      "year": 2026,
      "companies": 29,
      "community": 10,
      "partners": 1,
      "total": 40,
      "passed": 34,
      "notPassed": 4
    }
  ],
  "types": [
    {
      "type": "Treasury funding requests",
      "what": "Grants, budgets and programs",
      "cgps": 92,
      "passed": 71,
      "notPassed": 16
    },
    {
      "type": "Stablecoins, reserve & oracles (Mento)",
      "what": "New stablecoins, reserve and oracle rules",
      "cgps": 72,
      "passed": 58,
      "notPassed": 8
    },
    {
      "type": "Network & economic parameters",
      "what": "Fees, rewards, gas and limits",
      "cgps": 29,
      "passed": 24,
      "notPassed": 1
    },
    {
      "type": "Protocol upgrades & security",
      "what": "Contract releases, hard forks, the L2",
      "cgps": 28,
      "passed": 27,
      "notPassed": 1
    },
    {
      "type": "Strategy, tokenomics & treasury",
      "what": "Supply, burns and treasury moves",
      "cgps": 20,
      "passed": 16,
      "notPassed": 3
    },
    {
      "type": "Governance process",
      "what": "How governance itself works",
      "cgps": 14,
      "passed": 14,
      "notPassed": 0
    }
  ],
  "camps": [
    {
      "key": "companies",
      "cgps": 170,
      "passed": 150,
      "notPassed": 12,
      "contested": 2
    },
    {
      "key": "community",
      "cgps": 61,
      "passed": 42,
      "notPassed": 13,
      "contested": 12
    },
    {
      "key": "partners",
      "cgps": 24,
      "passed": 18,
      "notPassed": 4,
      "contested": 4
    }
  ],
  "eras": [
    {
      "name": "Genesis",
      "years": "2020",
      "start": "2020-01-01",
      "end": "2021-01-01",
      "text": "Governance switches the network on: validator elections, rewards, CELO transfers and cUSD (CGP-1 to CGP-7)."
    },
    {
      "name": "Building the L1",
      "years": "2021–22",
      "start": "2021-01-01",
      "end": "2023-01-01",
      "text": "Core contract releases, cEUR and cREAL, and the first large programs from the fund: Ocelot, the Celo Ecosystem Treasury (CGP-38), Climate Collective (CGP-52) and Prezenti (CGP-54)."
    },
    {
      "name": "Treasury opens",
      "years": "2023",
      "start": "2023-01-01",
      "end": "2024-01-01",
      "text": "Mento returns genesis CELO to the fund (CGP-79), regional DAOs and partners are funded, and the L2 temperature check passes (CGP-87)."
    },
    {
      "name": "Structure",
      "years": "2024",
      "start": "2024-01-01",
      "end": "2025-01-01",
      "text": "Governance Guidelines, Guardians and a 10,000 CELO deposit (CGP-115), the Mento spin-off (CGP-139), the OP Stack for the L2 (CGP-133) and the Governance Guild (CGP-152)."
    },
    {
      "name": "L2 and Seasons",
      "short": "L2 & Seasons",
      "years": "2025",
      "start": "2025-01-01",
      "end": "2026-01-01",
      "text": "Celo becomes an Ethereum L2 with Security Councils (CGP-164 to CGP-175), six-month Seasons with budgets (CGP-189), and three competing validator-spending options (CGP-216 to CGP-218)."
    },
    {
      "name": "Consolidation",
      "years": "2026",
      "start": "2026-01-01",
      "end": "2027-01-01",
      "text": "cLabs and the Celo Foundation merge into Celo Core Co. (CGP-247), Opera takes a one-off 160M CELO stake (CGP-232), and a revenue-burn proposal is drafted (CGP-257)."
    }
  ],
  "map": {
    "today": "2026-11-19",
    "lanes": [
      {
        "key": "mento",
        "label": "Mento Labs",
        "camp": "companies"
      },
      {
        "key": "clabs",
        "label": "cLabs",
        "camp": "companies"
      },
      {
        "key": "coreco",
        "label": "Celo Core Co.",
        "camp": "companies"
      },
      {
        "key": "foundation",
        "label": "Celo Foundation",
        "camp": "companies"
      },
      {
        "key": "ciclops",
        "label": "CICLOPS",
        "camp": "companies"
      },
      {
        "key": "stabila",
        "label": "Stabila",
        "camp": "companies"
      },
      {
        "key": "minipay",
        "label": "MiniPay (Opera)",
        "camp": "partners"
      },
      {
        "key": "ocelot",
        "label": "Ocelot",
        "camp": "community"
      },
      {
        "key": "celopg",
        "label": "CeloPG",
        "camp": "community"
      },
      {
        "key": "prezenti",
        "label": "Prezenti",
        "camp": "community"
      },
      {
        "key": "regional",
        "label": "Regional DAOs",
        "camp": "community"
      },
      {
        "key": "govguild",
        "label": "Governance Guild",
        "camp": "community"
      },
      {
        "key": "commguild",
        "label": "Communities Guild",
        "camp": "community"
      }
    ],
    "segments": [
      {
        "lane": "clabs",
        "camp": "companies",
        "style": "own",
        "start": "2018-01-01",
        "end": "2026-01-21",
        "cap": null
      },
      {
        "lane": "foundation",
        "camp": "companies",
        "style": "own",
        "start": "2018-01-01",
        "end": "2026-01-21",
        "cap": null
      },
      {
        "lane": "coreco",
        "camp": "companies",
        "style": "own",
        "start": "2026-01-21",
        "end": "2026-11-19",
        "cap": "live"
      },
      {
        "lane": "mento",
        "camp": "companies",
        "style": "own",
        "start": "2023-02-24",
        "end": "2026-11-19",
        "cap": "live"
      },
      {
        "lane": "stabila",
        "camp": "companies",
        "style": "own",
        "start": "2024-05-17",
        "end": "2026-11-19",
        "cap": "live"
      },
      {
        "lane": "ciclops",
        "camp": "companies",
        "style": "own",
        "start": "2025-01-14",
        "end": "2026-11-19",
        "cap": "live"
      },
      {
        "lane": "minipay",
        "camp": "partners",
        "style": "own",
        "start": "2023-09-13",
        "end": "2026-11-19",
        "cap": "live"
      },
      {
        "lane": "ocelot",
        "camp": "community",
        "style": "own",
        "start": "2021-11-11",
        "end": "2023-11-30",
        "cap": "end"
      },
      {
        "lane": "celopg",
        "camp": "community",
        "style": "own",
        "start": "2024-01-01",
        "end": "2025-12-31",
        "cap": "end"
      },
      {
        "lane": "prezenti",
        "camp": "community",
        "style": "own",
        "start": "2021-02-01",
        "end": "2024-01-01",
        "cap": null
      },
      {
        "lane": "prezenti",
        "camp": "community",
        "style": "via",
        "start": "2024-01-01",
        "end": "2025-01-01",
        "cap": null
      },
      {
        "lane": "prezenti",
        "camp": "community",
        "style": "own",
        "start": "2025-01-01",
        "end": "2026-11-19",
        "cap": "live"
      },
      {
        "lane": "regional",
        "camp": "community",
        "style": "own",
        "start": "2023-03-01",
        "end": "2024-01-01",
        "cap": null
      },
      {
        "lane": "regional",
        "camp": "community",
        "style": "via",
        "start": "2024-01-01",
        "end": "2025-01-01",
        "cap": null
      },
      {
        "lane": "regional",
        "camp": "community",
        "style": "own",
        "start": "2025-01-01",
        "end": "2025-12-31",
        "cap": "end"
      },
      {
        "lane": "govguild",
        "camp": "community",
        "style": "volunteer",
        "start": "2021-04-20",
        "end": "2024-01-01",
        "cap": null
      },
      {
        "lane": "govguild",
        "camp": "community",
        "style": "via",
        "start": "2024-01-01",
        "end": "2025-01-01",
        "cap": null
      },
      {
        "lane": "govguild",
        "camp": "community",
        "style": "own",
        "start": "2025-01-01",
        "end": "2026-11-19",
        "cap": "live"
      },
      {
        "lane": "commguild",
        "camp": "community",
        "style": "via",
        "start": "2024-07-01",
        "end": "2025-01-01",
        "cap": null
      },
      {
        "lane": "commguild",
        "camp": "community",
        "style": "own",
        "start": "2025-01-01",
        "end": "2026-11-19",
        "cap": "live"
      }
    ],
    "links": [
      {
        "source": "coreco",
        "target": "clabs",
        "camp": "companies",
        "kind": "fork",
        "date": "2018-01-01"
      },
      {
        "source": "coreco",
        "target": "foundation",
        "camp": "companies",
        "kind": "fork",
        "date": "2018-01-01"
      },
      {
        "source": "clabs",
        "target": "mento",
        "camp": "companies",
        "kind": "fork",
        "date": "2023-02-24"
      },
      {
        "source": "foundation",
        "target": "minipay",
        "camp": "partners",
        "kind": "tie",
        "date": "2023-09-13"
      },
      {
        "source": "foundation",
        "target": "stabila",
        "camp": "companies",
        "kind": "fork",
        "date": "2024-05-17"
      },
      {
        "source": "foundation",
        "target": "ciclops",
        "camp": "companies",
        "kind": "fork",
        "date": "2025-01-14"
      },
      {
        "source": "clabs",
        "target": "coreco",
        "camp": "companies",
        "kind": "merge",
        "date": "2026-01-21"
      },
      {
        "source": "foundation",
        "target": "coreco",
        "camp": "companies",
        "kind": "merge",
        "date": "2026-01-21"
      }
    ],
    "events": [
      {
        "lane": "coreco",
        "date": "2018-01-01",
        "label": "Founded 2017–18",
        "anchor": "start",
        "dx": 14,
        "dy": 4,
        "dot": "root"
      },
      {
        "lane": "coreco",
        "date": "2026-01-21",
        "label": "Unified as Celo Core Co., Jan 2026",
        "anchor": "end",
        "dx": -12,
        "dy": 4,
        "dot": "ink"
      },
      {
        "lane": "mento",
        "date": "2024-05-31",
        "label": "Spin-off, CGP-139",
        "anchor": "start",
        "dx": 8,
        "dy": 16,
        "dot": "ink"
      },
      {
        "lane": "stabila",
        "date": "2024-05-17",
        "label": "CGP-132",
        "anchor": "start",
        "dx": 8,
        "dy": -9,
        "dot": null
      },
      {
        "lane": "ciclops",
        "date": "2025-01-14",
        "label": "CGP-158",
        "anchor": "start",
        "dx": 8,
        "dy": -9,
        "dot": null
      },
      {
        "lane": "minipay",
        "date": "2023-09-13",
        "label": "Built by Opera with the Celo Foundation, Sep 2023",
        "anchor": "end",
        "dx": -10,
        "dy": 4,
        "dot": null
      },
      {
        "lane": "minipay",
        "date": "2026-03-29",
        "label": "160M CELO stake, CGP-232",
        "anchor": "end",
        "dx": -8,
        "dy": -9,
        "dot": "ink"
      },
      {
        "lane": "ocelot",
        "date": "2021-11-11",
        "label": "Celo Ecosystem Treasury, CGP-38",
        "anchor": "end",
        "dx": -10,
        "dy": 4,
        "dot": null
      },
      {
        "lane": "prezenti",
        "date": "2021-02-01",
        "label": "Community Fund stewards",
        "anchor": "end",
        "dx": -10,
        "dy": 4,
        "dot": null
      },
      {
        "lane": "prezenti",
        "date": "2022-06-01",
        "label": "Prezenti, CGP-54",
        "anchor": "start",
        "dx": 8,
        "dy": -9,
        "dot": "ink"
      },
      {
        "lane": "regional",
        "date": "2023-03-01",
        "label": "Regional DAOs",
        "anchor": "end",
        "dx": -10,
        "dy": 4,
        "dot": null
      },
      {
        "lane": "regional",
        "date": "2025-01-01",
        "label": "Regional Council, CGP-160",
        "anchor": "start",
        "dx": 8,
        "dy": -13,
        "dot": "ink"
      },
      {
        "lane": "govguild",
        "date": "2021-04-20",
        "label": "Volunteer CGP editors",
        "anchor": "start",
        "dx": 4,
        "dy": 16,
        "dot": null
      },
      {
        "lane": "govguild",
        "date": "2025-01-01",
        "label": "Guild, CGP-152",
        "anchor": "start",
        "dx": 8,
        "dy": -9,
        "dot": "ink"
      },
      {
        "lane": "commguild",
        "date": "2024-07-01",
        "label": "Moderators",
        "anchor": "end",
        "dx": -62,
        "dy": 4,
        "dot": null
      },
      {
        "lane": "commguild",
        "date": "2025-01-01",
        "label": "CGP-165",
        "anchor": "start",
        "dx": 8,
        "dy": -9,
        "dot": "ink"
      }
    ],
    "milestones": [
      {
        "label": "Mainnet, Apr 2020",
        "date": "2020-04-22"
      },
      {
        "label": "Ethereum L2, Mar 2025",
        "date": "2025-03-26"
      }
    ]
  },
  "moves": [
    {
      "when": "2017–18",
      "what": "Celo is founded; cLabs and the Celo Foundation start side by side."
    },
    {
      "when": "Feb 2021",
      "what": "The first Community Fund stewards are funded (CGP-17)."
    },
    {
      "when": "Nov 2021",
      "what": "Ocelot, the Celo Ecosystem Treasury, gets 3M CELO for two years (CGP-38)."
    },
    {
      "when": "Jun 2022",
      "what": "Prezenti reopens the Community Fund (CGP-54)."
    },
    {
      "when": "Feb 2023",
      "what": "Mento Labs starts proposing on its own; its governance spins off in May 2024 (CGP-139)."
    },
    {
      "when": "Sep 2023",
      "what": "Opera launches MiniPay, built with the Celo Foundation; grants follow from Dec 2023 (CGP-111)."
    },
    {
      "when": "2024",
      "what": "CeloPG pays regional DAOs, Prezenti, governance Guardians and moderators from one budget (CGP-115, CGP-141)."
    },
    {
      "when": "May 2024",
      "what": "Stabila takes on stablecoin and liquidity work (CGP-132)."
    },
    {
      "when": "Jan 2025",
      "what": "CICLOPS takes over infrastructure stewardship from the Foundation (CGP-158). The Governance Guild (CGP-152), the Regional Council (CGP-160) and the Communities Guild (CGP-165) get budgets of their own."
    },
    {
      "when": "Jan 2026",
      "what": "cLabs and the Celo Foundation unify as Celo Core Co.; first funded as one in Season 3 (CGP-247)."
    },
    {
      "when": "Mar 2026",
      "what": "Opera moves from grants to a one-off 160M CELO stake (CGP-232)."
    }
  ]
};

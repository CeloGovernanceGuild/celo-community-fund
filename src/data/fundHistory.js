// Snapshot of 2026-11-19, edited by hand. See docs/history.md for sources and method.
// The live parts of the History page (approved per year, grants over time, value today) are worked out from
// ledger.js and the CELO/USD feed instead.

export const SNAPSHOT = '2026-11-19';

/** Proposals that asked for or moved the fund's money: CGP outcomes, votes and who submitted them. */
export const FUND_PROPOSALS = {
  "totals": {
    "cgps": 99,
    "passed": 80,
    "notPassed": 16,
    "withdrawn": 2,
    "draft": 1,
    "contested": 13,
    "submissions": 120
  },
  "years": [
    {
      "year": 2021,
      "companies": 4,
      "community": 2,
      "partners": 0,
      "total": 6,
      "passed": 6,
      "notPassed": 0,
      "votes": 6,
      "medianVoters": 152,
      "byGuild": 0,
      "byOthers": 7
    },
    {
      "year": 2022,
      "companies": 3,
      "community": 4,
      "partners": 0,
      "total": 7,
      "passed": 5,
      "notPassed": 0,
      "votes": 4,
      "medianVoters": 72,
      "byGuild": 0,
      "byOthers": 7
    },
    {
      "year": 2023,
      "companies": 3,
      "community": 12,
      "partners": 7,
      "total": 22,
      "passed": 15,
      "notPassed": 6,
      "votes": 20,
      "medianVoters": 64,
      "byGuild": 13,
      "byOthers": 18
    },
    {
      "year": 2024,
      "companies": 3,
      "community": 11,
      "partners": 6,
      "total": 20,
      "passed": 15,
      "notPassed": 5,
      "votes": 27,
      "medianVoters": 55,
      "byGuild": 16,
      "byOthers": 11
    },
    {
      "year": 2025,
      "companies": 11,
      "community": 14,
      "partners": 3,
      "total": 28,
      "passed": 23,
      "notPassed": 5,
      "votes": 31,
      "medianVoters": 58,
      "byGuild": 17,
      "byOthers": 15
    },
    {
      "year": 2026,
      "companies": 8,
      "community": 7,
      "partners": 1,
      "total": 16,
      "passed": 16,
      "notPassed": 0,
      "votes": 16,
      "medianVoters": 91,
      "byGuild": 9,
      "byOthers": 7
    }
  ],
  "camps": [
    {
      "key": "companies",
      "cgps": 32,
      "passed": 30,
      "notPassed": 2,
      "contested": 0
    },
    {
      "key": "community",
      "cgps": 50,
      "passed": 37,
      "notPassed": 10,
      "contested": 9
    },
    {
      "key": "partners",
      "cgps": 17,
      "passed": 13,
      "notPassed": 4,
      "contested": 4
    }
  ],
  "contested": [
    {
      "cgp": 183,
      "year": 2025,
      "title": "Celo Kreiva DAO Season 0-1 2025 Proposal",
      "camp": "community",
      "noPct": 99.9,
      "outcome": "rejected"
    },
    {
      "cgp": 112,
      "year": 2024,
      "title": "Celo Tribe University Society follow-up",
      "camp": "community",
      "noPct": 99.8,
      "outcome": "rejected"
    },
    {
      "cgp": 185,
      "year": 2025,
      "title": "CeLatam Venture Studio",
      "camp": "community",
      "noPct": 93.4,
      "outcome": "rejected"
    },
    {
      "cgp": 144,
      "year": 2024,
      "title": "Artemis Proposal to Build Public Goods Data Dashboards for Celo Ecosystem and Community",
      "camp": "partners",
      "noPct": 85.6,
      "outcome": "rejected"
    },
    {
      "cgp": 83,
      "year": 2023,
      "title": "Establishing creatives community (Celo x Art DAO)",
      "camp": "community",
      "noPct": 67.2,
      "outcome": "rejected"
    },
    {
      "cgp": 93,
      "year": 2023,
      "title": "ReFI DAO x CELO",
      "camp": "partners",
      "noPct": 56.8,
      "outcome": "rejected"
    },
    {
      "cgp": 107,
      "year": 2023,
      "title": "Celo Dapps over Apps",
      "camp": "community",
      "noPct": 53.3,
      "outcome": "rejected"
    },
    {
      "cgp": 116,
      "year": 2024,
      "title": "Celo Ecosystem Liquidity Operation Guild (CELO-Guild)",
      "camp": "community",
      "noPct": 52.1,
      "outcome": "expired"
    },
    {
      "cgp": 110,
      "year": 2023,
      "title": "Mentors Collective",
      "camp": "partners",
      "noPct": 50.4,
      "outcome": "rejected"
    },
    {
      "cgp": 198,
      "year": 2025,
      "title": "Celo Regional Council Season 1 Funding Request",
      "camp": "community",
      "noPct": 49.5,
      "outcome": "rejected"
    },
    {
      "cgp": 91,
      "year": 2023,
      "title": "Road to COP28",
      "camp": "community",
      "noPct": 40.4,
      "outcome": "rejected"
    },
    {
      "cgp": 92,
      "year": 2023,
      "title": "Proposal for mobile first community in celo ecosystem and telecom",
      "camp": "community",
      "noPct": 21.8,
      "outcome": "passed"
    },
    {
      "cgp": 143,
      "year": 2024,
      "title": "Enable Account Abstraction (ERC 4337) On Celo's upcoming L2 leveraging Biconomy's AA infrastructure",
      "camp": "partners",
      "noPct": 12.6,
      "outcome": "rejected"
    }
  ]
};

/** Proposals that set their budget in dollars, as stated in the CGP text: usd in total, other = the non-CELO part. */
export const PRICED = [
  {
    "cgp": 70,
    "date": "2023-04-29",
    "usd": 49680,
    "celo": 70000,
    "other": 0
  },
  {
    "cgp": 76,
    "date": "2023-04-23",
    "usd": 500000,
    "celo": 903000,
    "other": 0
  },
  {
    "cgp": 80,
    "date": "2023-05-14",
    "usd": 2500000,
    "celo": 5000000,
    "other": 0
  },
  {
    "cgp": 82,
    "date": "2023-07-11",
    "usd": 220000,
    "celo": 440000,
    "other": 0
  },
  {
    "cgp": 88,
    "date": "2023-08-03",
    "usd": 150000,
    "celo": 303030,
    "other": 0
  },
  {
    "cgp": 92,
    "date": "2023-08-29",
    "usd": 60000,
    "celo": 120000,
    "other": 0
  },
  {
    "cgp": 95,
    "date": "2023-09-05",
    "usd": 150000,
    "celo": 400000,
    "other": 0
  },
  {
    "cgp": 106,
    "date": "2023-11-12",
    "usd": 1207503,
    "celo": 2769504,
    "other": 0
  },
  {
    "cgp": 111,
    "date": "2023-12-22",
    "usd": 2840910,
    "celo": 5205000,
    "other": 0
  },
  {
    "cgp": 129,
    "date": "2024-04-12",
    "usd": 250000,
    "celo": 41000,
    "other": 200000
  },
  {
    "cgp": 130,
    "date": "2024-04-13",
    "usd": 150000,
    "celo": 46000,
    "other": 100000
  },
  {
    "cgp": 154,
    "date": "2024-11-17",
    "usd": 1223500,
    "celo": 2792440,
    "other": 0
  },
  {
    "cgp": 158,
    "date": "2025-01-14",
    "usd": 5850000,
    "celo": 3794940,
    "other": 3000000
  },
  {
    "cgp": 170,
    "date": "2025-03-21",
    "usd": 2840910,
    "celo": 5073054,
    "other": 0
  },
  {
    "cgp": 193,
    "date": "2025-08-08",
    "usd": 1380000,
    "celo": 2885246,
    "other": 500000
  },
  {
    "cgp": 197,
    "date": "2025-08-12",
    "usd": 470000,
    "celo": 1746267,
    "other": 0
  },
  {
    "cgp": 199,
    "date": "2025-08-15",
    "usd": 3300000,
    "celo": 9147160,
    "other": 300000
  },
  {
    "cgp": 200,
    "date": "2025-09-05",
    "usd": 1500000,
    "celo": 4545455,
    "other": 0
  },
  {
    "cgp": 201,
    "date": "2025-08-22",
    "usd": 2129774,
    "celo": 6453860,
    "other": 0
  },
  {
    "cgp": 202,
    "date": "2025-08-27",
    "usd": 3000000,
    "celo": 9254340,
    "other": 0
  },
  {
    "cgp": 215,
    "date": "2025-12-30",
    "usd": 22000,
    "celo": 183333,
    "other": 0
  },
  {
    "cgp": 219,
    "date": "2026-03-03",
    "usd": 56600,
    "celo": 738258,
    "other": 0
  },
  {
    "cgp": 220,
    "date": "2026-02-12",
    "usd": 1241914,
    "celo": 4355627,
    "other": 500000
  },
  {
    "cgp": 222,
    "date": "2026-02-10",
    "usd": 950000,
    "celo": 5622470,
    "other": 0
  },
  {
    "cgp": 223,
    "date": "2026-02-14",
    "usd": 60400,
    "celo": 532000,
    "other": 0
  },
  {
    "cgp": 224,
    "date": "2026-02-14",
    "usd": 1500000,
    "celo": 8880995,
    "other": 0
  },
  {
    "cgp": 227,
    "date": "2026-02-22",
    "usd": 276400,
    "celo": 3430000,
    "other": 0
  },
  {
    "cgp": 231,
    "date": "2026-02-27",
    "usd": 2700000,
    "celo": 21738286,
    "other": 0
  },
  {
    "cgp": 242,
    "date": "2026-09-03",
    "usd": 75000,
    "celo": 1312500,
    "other": 0
  },
  {
    "cgp": 246,
    "date": "2026-08-06",
    "usd": 360000,
    "celo": 4838710,
    "other": 0
  },
  {
    "cgp": 247,
    "date": "2026-08-06",
    "usd": 2396000,
    "celo": 31609499,
    "other": 0
  },
  {
    "cgp": 248,
    "date": "2026-08-10",
    "usd": 2670000,
    "celo": 35838926,
    "other": 0
  },
  {
    "cgp": 250,
    "date": "2026-08-13",
    "usd": 22100,
    "celo": 330000,
    "other": 0
  }
];

/** One-off CELO that governance moved into the fund. basis: 'stated' in the CGP text, or read 'onchain' in docs/audit.md. */
export const INFLOWS = [
  {
    "year": 2023,
    "cgp": [
      79
    ],
    "source": "Mento Reserve",
    "what": "Returns genesis CELO to the fund, first tranche",
    "celo": 25000000,
    "basis": "stated"
  },
  {
    "year": 2024,
    "cgp": [
      118
    ],
    "source": "Mento Reserve",
    "what": "Second tranche of returned CELO",
    "celo": 12593000,
    "basis": "stated"
  },
  {
    "year": 2025,
    "cgp": [
      156
    ],
    "source": "Mento Reserve",
    "what": "Mento governance handover. Another 65.9M CELO went to the Celo Governance Reserve",
    "celo": 20000000,
    "basis": "stated"
  },
  {
    "year": 2025,
    "cgp": [
      202
    ],
    "source": "Celo Governance Reserve",
    "what": "Transfer to the fund",
    "celo": 9254340,
    "basis": "onchain"
  },
  {
    "year": 2025,
    "cgp": [
      209
    ],
    "source": "Celo Governance Reserve",
    "what": "Transfer to the fund",
    "celo": 9318755,
    "basis": "stated"
  },
  {
    "year": 2026,
    "cgp": [
      220
    ],
    "source": "Celo Governance Reserve",
    "what": "Moved in to pay cLabs' Core Protocol Season 2",
    "celo": 4355627,
    "basis": "onchain"
  },
  {
    "year": 2026,
    "cgp": [
      231
    ],
    "source": "Celo Governance Reserve",
    "what": "Moved in with CICLOPS Season 2",
    "celo": 43012777,
    "basis": "onchain"
  },
  {
    "year": 2026,
    "cgp": [
      246,
      247,
      248
    ],
    "source": "Unreleased treasury",
    "what": "Season 3 budgets for Stabila, Celo Core Co. and CICLOPS, approved straight back out",
    "celo": 72287135,
    "basis": "onchain"
  },
  {
    "year": 2026,
    "cgp": [
      253
    ],
    "source": "Mento Reserve Safe",
    "what": "Returned under MGP-19, the proxy vote on stable asset issuance",
    "celo": 33937680,
    "basis": "onchain"
  }
];

/** Who ran the proposal process, and what the fund paid for it. */
export const PROCESS = {
  "handoff": [
    {
      "name": "Yaz Khoury & Will Kraft",
      "role": "Volunteer CGP editors",
      "years": "2021-22"
    },
    {
      "name": "Will Kraft, with 0xj4an-Work, 0xzoz & 0xGoldo",
      "role": "Volunteer CGP editors. Advisor: Eric Nakagawa (Celo Foundation)",
      "years": "2023, unpaid"
    },
    {
      "name": "Governance Guardians: 0xj4an-Work, 0xzoz & 0xGoldo",
      "role": "Advisors: Eric Nakagawa and, from July 2024, Anna Alexa (Celo Foundation)",
      "years": "2024, paid through CeloPG"
    },
    {
      "name": "Celo Governance Guild: 0xj4an-Work, 0xzoz & 0xGoldo",
      "role": "Advisors: Anna Alexa (Celo Foundation), Eric Nakagawa (Celo Foundation, external from late 2025) and Kate Gielty (Celo Core Co., from July 2026)",
      "years": "2025-today (approved Nov 2024, CGP-152)"
    }
  ],
  "costs": [
    {
      "year": 2024,
      "usd": null,
      "cgp": [
        115,
        141
      ],
      "note": "The Governance Guardians were paid by CeloPG out of its 2024 budgets. Their share is not itemized in those proposals."
    },
    {
      "year": 2025,
      "usd": 55000,
      "cgp": [
        152
      ],
      "note": "The Guild's own budget and Safe, paid in USDm."
    },
    {
      "year": 2026,
      "usd": 82500,
      "cgp": [
        223,
        250
      ],
      "note": "Season 2 asked for $60,400 and was paid 532,000 CELO. CELO kept falling, so a $22,100 top-up followed, paid as 330,000 CELO."
    }
  ]
};

export const ERAS = [
  {
    "years": "2021",
    "short": "Fund opens",
    "start": "2021-01-01",
    "end": "2022-01-01",
    "name": "The fund opens",
    "text": "CGP-17 activates the Community Fund and pays its first stewards. Ocelot, the Celo Ecosystem Treasury, receives 3M CELO (CGP-38), and the fund starts paying oracle providers."
  },
  {
    "years": "2022",
    "short": "Stewards",
    "start": "2022-01-01",
    "end": "2023-01-01",
    "name": "Stewards",
    "text": "Climate Collective (CGP-52) and Prezenti (CGP-54) are funded to run grant programs, and 5M USDm goes into liquidity the fund owns (CGP-61)."
  },
  {
    "years": "2023",
    "short": "Direct asks",
    "start": "2023-01-01",
    "end": "2024-01-01",
    "name": "Direct requests",
    "text": "Regional DAOs, Chainlink SCALE, Credit Collective, the cLabs L2 project and MiniPay ask the fund directly. Six of 21 decided requests fail. The Mento Reserve returns 25M CELO (CGP-79)."
  },
  {
    "years": "2024",
    "short": "One budget",
    "start": "2024-01-01",
    "end": "2025-01-01",
    "name": "One budget through CeloPG",
    "text": "CeloPG receives one budget per half-year (CGP-115, CGP-141) and pays community programs and the Governance Guardians from it. Stabila is funded (CGP-132), and the Governance Guild is created to separate governance from the budgets it oversees (CGP-152)."
  },
  {
    "years": "2025",
    "short": "Seasons",
    "start": "2025-01-01",
    "end": "2026-01-01",
    "name": "Seasons",
    "text": "Programs return to separate budgets in six-month Seasons: CICLOPS, Stabila, the Regional Council, the Communities Guild, Prezenti and MiniPay. Most are priced in dollars and paid in CELO, at prices that fall from about $0.75 in January to $0.12 by December. Mento hands governance over and returns 20M CELO (CGP-156)."
  },
  {
    "years": "2026",
    "short": "More CELO",
    "start": "2026-01-01",
    "end": "2027-01-01",
    "name": "More CELO for the same dollars",
    "text": "With CELO between about $0.06 and $0.17, budgets need far more CELO. Season 3 budgets for Celo Core Co., CICLOPS and Stabila come from the unreleased treasury (CGP-246 to CGP-248), and the Mento Reserve Safe returns 33.9M CELO (CGP-253)."
  }
];

/**
 * The movement map: organisations the fund paid, as lanes. A lane's `orgs` are the organisations in
 * src/data/organisations.js whose ledger grants are drawn on it. A segment with no end runs to today.
 */
export const MAP = {
  "lanes": [
    {
      "key": "mento",
      "label": "Mento Labs",
      "camp": "companies",
      "orgs": []
    },
    {
      "key": "clabs",
      "label": "cLabs",
      "camp": "companies",
      "orgs": [
        "cLabs"
      ]
    },
    {
      "key": "coreco",
      "label": "Celo Core Co.",
      "camp": "companies",
      "orgs": [
        "Celo Core Co."
      ]
    },
    {
      "key": "foundation",
      "label": "Celo Foundation",
      "camp": "companies",
      "orgs": [
        "Celo Foundation"
      ]
    },
    {
      "key": "ciclops",
      "label": "CICLOPS",
      "camp": "companies",
      "orgs": [
        "CICLOPS"
      ]
    },
    {
      "key": "stabila",
      "label": "Stabila",
      "camp": "companies",
      "orgs": [
        "Stabila"
      ]
    },
    {
      "key": "minipay",
      "label": "MiniPay (Opera)",
      "camp": "partners",
      "orgs": [
        "Opera (MiniPay)"
      ]
    },
    {
      "key": "ocelot",
      "label": "Ocelot",
      "camp": "community",
      "orgs": [
        "Ocelot (Celo Ecosystem Treasury)"
      ]
    },
    {
      "key": "climate",
      "label": "Climate Collective",
      "camp": "community",
      "orgs": [
        "Climate Collective"
      ]
    },
    {
      "key": "celopg",
      "label": "CeloPG",
      "camp": "community",
      "orgs": [
        "CeloPG"
      ]
    },
    {
      "key": "prezenti",
      "label": "Prezenti",
      "camp": "community",
      "orgs": [
        "Prezenti",
        "Celo Community Fund stewards"
      ]
    },
    {
      "key": "regional",
      "label": "Regional DAOs",
      "camp": "community",
      "orgs": [
        "Celo Africa DAO",
        "CeLatam DAO",
        "Celo Europe DAO",
        "Celo Korea",
        "CeloColombia DAO",
        "Celo Regional Council"
      ]
    },
    {
      "key": "govguild",
      "label": "Governance Guild",
      "camp": "community",
      "orgs": [
        "Celo Governance Guild"
      ]
    },
    {
      "key": "commguild",
      "label": "Communities Guild",
      "camp": "community",
      "orgs": [
        "Celo Communities Guild"
      ]
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
      "end": null,
      "cap": "live"
    },
    {
      "lane": "mento",
      "camp": "companies",
      "style": "own",
      "start": "2023-02-24",
      "end": null,
      "cap": "live"
    },
    {
      "lane": "stabila",
      "camp": "companies",
      "style": "own",
      "start": "2024-05-17",
      "end": null,
      "cap": "live"
    },
    {
      "lane": "ciclops",
      "camp": "companies",
      "style": "own",
      "start": "2025-01-14",
      "end": null,
      "cap": "live"
    },
    {
      "lane": "minipay",
      "camp": "partners",
      "style": "own",
      "start": "2023-09-13",
      "end": null,
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
      "lane": "climate",
      "camp": "community",
      "style": "own",
      "start": "2022-06-01",
      "end": "2025-05-31",
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
      "end": null,
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
      "end": null,
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
      "end": null,
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
      "label": "Founded 2017-18",
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
      "label": "CGP-232: 160M CELO stake, not from the fund",
      "anchor": "end",
      "dx": -8,
      "dy": 20,
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
      "dot": null
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
      "dot": null
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
      "dot": null
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
      "dot": null
    },
    {
      "lane": "climate",
      "date": "2022-06-01",
      "label": "CGP-52",
      "anchor": "end",
      "dx": -10,
      "dy": 4,
      "dot": null
    },
    {
      "lane": "mento",
      "date": "2023-05-01",
      "label": null,
      "title": "25M CELO returned to the fund, CGP-79",
      "anchor": "start",
      "dx": 0,
      "dy": 0,
      "dot": "return"
    },
    {
      "lane": "mento",
      "date": "2024-03-07",
      "label": null,
      "title": "12.6M CELO returned to the fund, CGP-118",
      "anchor": "start",
      "dx": 0,
      "dy": 0,
      "dot": "return"
    },
    {
      "lane": "mento",
      "date": "2025-07-11",
      "label": null,
      "title": "20M CELO returned to the fund, CGP-156",
      "anchor": "start",
      "dx": 0,
      "dy": 0,
      "dot": "return"
    },
    {
      "lane": "mento",
      "date": "2026-10-09",
      "label": null,
      "title": "33.9M CELO returned to the fund, CGP-253",
      "anchor": "start",
      "dx": 0,
      "dy": 0,
      "dot": "return"
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
};

export const MOVES = [
  {
    "when": "2017-18",
    "what": "Celo is founded; cLabs and the Celo Foundation start side by side."
  },
  {
    "when": "Feb 2021",
    "what": "The Community Fund opens and its first stewards are funded (CGP-17)."
  },
  {
    "when": "Nov 2021",
    "what": "Ocelot, the Celo Ecosystem Treasury, gets 3M CELO for two years (CGP-38)."
  },
  {
    "when": "Jun 2022",
    "what": "Climate Collective (CGP-52) and Prezenti (CGP-54) are funded to run grant programs."
  },
  {
    "when": "Feb 2023",
    "what": "Mento Labs starts proposing on its own. From May 2023 the Mento Reserve returns CELO to the fund (CGP-79, CGP-118, CGP-156, CGP-253), and its governance spins off in May 2024 (CGP-139)."
  },
  {
    "when": "Sep 2023",
    "what": "Opera launches MiniPay, built with the Celo Foundation; grants from the fund follow from Dec 2023 (CGP-111)."
  },
  {
    "when": "2024",
    "what": "CeloPG pays regional DAOs, Prezenti, governance Guardians and moderators from one budget (CGP-115, CGP-141)."
  },
  {
    "when": "May 2024",
    "what": "Stabila Foundation is created as a new entity for stablecoin and DeFi liquidity, run by Celo Foundation staff (CGP-132)."
  },
  {
    "when": "Nov 2024",
    "what": "The Governance Guild is approved (CGP-152). A first attempt expired without the approvers' sign-off."
  },
  {
    "when": "Jan 2025",
    "what": "CICLOPS takes over infrastructure stewardship from the Foundation (CGP-158). The Governance Guild (CGP-152), the Regional Council (CGP-160) and the Communities Guild (CGP-165) get budgets of their own."
  },
  {
    "when": "Jan 2026",
    "what": "cLabs and the Celo Foundation unify as Celo Core Co., first funded as one in Season 3 (CGP-247)."
  },
  {
    "when": "Mar 2026",
    "what": "Opera moves from grants to a one-off 160M CELO stake (CGP-232). It comes from the unreleased treasury, not the fund."
  }
];

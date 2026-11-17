import React, { useEffect, useState } from 'react';
import Amount from '../components/Amount';
import {
  GOVERNANCE_ADDRESS,
  GOVERNANCE_APPROVER,
  LINKS,
  OPERATIONS_SAFE,
  REVENUE_REPORTS_URL,
  SECURITY_COUNCIL,
  TOKEN_ADDRESSES,
  UNRELEASED_TREASURY,
  addressUrl,
} from '../data/data';
import { fetchGovernanceRules } from '../lib/celo';
import forumTemplate from '../templates/forum-proposal.md?raw';
import cgpTemplate from '../templates/cgp-template.md?raw';
import payloadTemplate from '../templates/mainnet.json?raw';

const TEMPLATES = [
  {
    file: 'forum-proposal.md',
    title: 'Forum post',
    when: 'Step 1. The structure every proposal follows on the Celo forum.',
    text: forumTemplate,
  },
  {
    file: 'cgp-template.md',
    title: 'CGP file',
    when: 'Step 4. The proposal file for the pull request to the governance repository.',
    text: cgpTemplate,
  },
  {
    file: 'mainnet.json',
    title: 'Funding transactions',
    when: 'Step 4. The transactions the proposal executes: here, an allowance of 1,250,000 CELO for one address. Replace the address and the amount in wei.',
    text: payloadTemplate,
  },
];

// Last values read from the chain by hand (2026-11-17). They are replaced by a live read when the page opens.
const CHECKED = {
  deposit: 10000n * 10n ** 18n,
  votingDays: 7,
  executionDays: 3,
  concurrent: 3,
  approvers: 14,
  approvalsNeeded: 3,
  safeOwners: 5,
  safeThreshold: 2,
};

function Template({ template }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(template.text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  };
  return (
    <li>
      <div className="row-main">
        <span className="row-title">{template.title} <span className="mono small muted">{template.file}</span></span>
        <span className="template-actions">
          <a className="button" href={`data:text/plain;charset=utf-8,${encodeURIComponent(template.text)}`} download={template.file}>Download</a>
          <button className="button" type="button" onClick={copy} aria-live="polite">{copied ? 'Copied' : 'Copy'}</button>
        </span>
      </div>
      <p className="row-meta"><span>{template.when}</span></p>
      <details className="template">
        <summary>Show the template</summary>
        <pre tabIndex={0}>{template.text}</pre>
      </details>
    </li>
  );
}

const PROPOSAL_TYPES = [
  { type: 'Funding', what: 'Asks the Community Fund for CELO, USDm or EURm.', forum: 'At least 7 days', guardians: 'Yes, two' },
  { type: 'Network and protocol', what: 'Network decisions and protocol improvements.', forum: 'At least 2 days', guardians: 'Not required' },
  { type: 'Smart contract changes', what: 'Upgrades and parameter changes to the core contracts.', forum: 'At least 2 days', guardians: 'Not required' },
  { type: 'Mento', what: 'How the Celo community votes in Mento governance. The title carries [Mento Governance].', forum: 'At least 2 days', guardians: 'Not required' },
];

const Out = ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>;
const days = (n) => `${n} ${n === 1 ? 'day' : 'days'}`;

export default function HowPage() {
  const [rules, setRules] = useState(CHECKED);
  const [live, setLive] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchGovernanceRules()
      .then((read) => {
        if (cancelled) return;
        const known = Object.fromEntries(Object.entries(read).filter(([, value]) => value != null));
        setRules({ ...CHECKED, ...known });
        setLive(Object.keys(known).length === Object.keys(CHECKED).length);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const approverSet = `${rules.approvalsNeeded} of its ${rules.approvers} signers`;

  return (
    <>
      <header className="page-head">
        <p className="eyebrow">How it works</p>
        <h1 className="display">From network fees to funded work.</h1>
        <p className="lede">
          Where the fund's money comes from, how a proposal becomes a grant, who signs off on it and how the
          recipient gets paid.
        </p>
        <p className="small muted" role="status">
          {live
            ? 'Deposit, voting periods and signer counts on this page are read from the Celo network right now.'
            : 'Deposit, voting periods and signer counts on this page were last checked on-chain on 2026-11-17.'}
        </p>
      </header>

      <div className="stack">
        <section className="card" aria-labelledby="in-title">
          <h2 className="section-title" id="in-title">1. Where the money comes from</h2>
          <ul className="rows" style={{ marginTop: '1rem' }}>
            <li>
              <strong>Network fees.</strong> Gas and sequencer fees are collected by the{' '}
              <Out href={addressUrl(OPERATIONS_SAFE)}>Celo Operations Safe</Out>, a multisig that needs{' '}
              {rules.safeThreshold} of its {rules.safeOwners} signers. Fees paid in stablecoins are used to buy CELO. Every
              two weeks the Safe sends the fund what is left after the cost of running the layer 2 and a 15% revenue
              share with the OP Superchain. These payments have no proposal; Celo Core Co. publishes{' '}
              <Out href={REVENUE_REPORTS_URL}>each one on the Celo forum</Out>.
            </li>
            <li>
              <strong>Protocol payments.</strong> The <Out href={addressUrl(UNRELEASED_TREASURY)}>unreleased treasury</Out>{' '}
              makes epoch payments to the fund. They are separate from sequencer distributions and can change through
              governance, so the audit reports each flow rather than presenting a combined daily rate as guaranteed.
            </li>
            <li>
              <strong>One-off returns and transfers.</strong> Governance can return CELO to the fund or move it in from
              the unreleased treasury. The Mento Reserve Safe return is an inflow governed by CGP-253; it is distinct
              from the Celo Governance Reserve.
            </li>
            <li>
              <strong>Proposal deposits.</strong> The deposit for submitting a proposal sits in the fund until its
              proposer withdraws it, so it shows up as CELO coming in and out. It is not the fund's money and is not
              counted as available. A deposit is only kept by the fund if the proposal expires in the queue, which has
              never happened.
            </li>
          </ul>
        </section>

        <section className="card" aria-labelledby="process-title">
          <h2 className="section-title" id="process-title">2. From idea to grant</h2>
          <p className="muted">
            Anyone can propose. The whole cycle takes at least three weeks, so the community has time to discuss and vote.
          </p>
          <ol className="steps">
            <li>
              <h3>Post it on the Celo forum</h3>
              <p>
                Open a thread in the <Out href={LINKS.forum}>Governance category</Out> using the{' '}
                <a href="#templates-title" onClick={(e) => { e.preventDefault(); document.getElementById('templates-title').scrollIntoView(); }}>forum post template</a>, marked [DRAFT]. It stays open for feedback for at least
                7 days if it asks for funds, or 2 days if it is technical or about Mento. Authors are expected to answer.
              </p>
            </li>
            <li>
              <h3>Present it on a Governance Call</h3>
              <p>
                Calls are held every two weeks, with up to three proposals each. Ask for a slot on the{' '}
                <Out href={LINKS.callIssues}>call's GitHub issue</Out> or its forum post.
              </p>
            </li>
            <li>
              <h3>Publish the final version</h3>
              <p>
                Address the feedback and mark the proposal [FINAL]. For funding requests, two Governance Guardians
                confirm on the thread that it follows the guidelines. That is a process check, not an endorsement.
              </p>
            </li>
            <li>
              <h3>Open a pull request</h3>
              <p>
                Add the proposal text and its transactions to the{' '}
                <Out href={LINKS.governanceRepo}>governance repository</Out>. Two Guardians check that the files match
                what was posted on the forum and merge it as a CGP.
              </p>
            </li>
            <li>
              <h3>Submit it on-chain</h3>
              <p>
                Submitting takes a refundable deposit of <Amount wei={rules.deposit} /> CELO. Up to {rules.concurrent}{' '}
                proposals move to a vote at a time; the rest wait in a queue. See{' '}
                <Out href={LINKS.createProposal}>how to submit a proposal</Out> in the Celo docs.
              </p>
            </li>
            <li>
              <h3>CELO holders vote</h3>
              <p>
                Voting lasts {days(rules.votingDays)}. Anyone with locked CELO can vote, or delegate their vote, on{' '}
                <Out href={LINKS.mondo}>Mondo</Out>. A proposal passes with enough participation and a majority of
                yes votes; both thresholds are set by the protocol.
              </p>
            </li>
            <li>
              <h3>The approvers sign off</h3>
              <p>
                The <Out href={addressUrl(GOVERNANCE_APPROVER)}>approver multisig</Out> ({approverSet}) has to approve the
                proposal during the vote or in the {days(rules.executionDays)} after it. Without that approval the proposal
                expires, even if it won the vote.
              </p>
            </li>
            <li>
              <h3>It executes</h3>
              <p>
                Anyone can then execute it. The <Out href={addressUrl(GOVERNANCE_ADDRESS)}>Governance contract</Out> is
                the fund, so the proposal moves the money itself.
              </p>
            </li>
          </ol>
          <h3 className="sub-title">Types of proposals</h3>
          <table className="table stackable">
            <thead>
              <tr><th>Type</th><th>What it is for</th><th>Time on the forum</th><th>Guardians confirm</th></tr>
            </thead>
            <tbody>
              {PROPOSAL_TYPES.map((t) => (
                <tr key={t.type}>
                  <td data-label="Type"><strong>{t.type}</strong></td>
                  <td data-label="What it is for">{t.what}</td>
                  <td data-label="Time on the forum">{t.forum}</td>
                  <td data-label="Guardians confirm">{t.guardians}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="small muted" style={{ marginTop: '0.75rem' }}>
            Every type is voted on-chain with the same deposit, voting period and approver sign-off. Any of them can
            also be a temperature check: a vote with no transactions that records what CELO holders think.
          </p>
          <h3 className="sub-title">If a proposal fails</h3>
          <ul className="rows">
            <li>If it missed quorum but had a majority of yes votes, it can be submitted again after 14 days.</li>
            <li>If it had a majority of no votes, it needs a new confirmation from the Guardians and can be submitted again after 28 days.</li>
          </ul>
          <h3 className="sub-title">Seasons</h3>
          <p style={{ maxWidth: '48rem' }}>
            Funding is planned in seasons. Each one starts with an Intent and a budget posted by the Celo Foundation and
            ratified by governance. Guardians check funding requests against that Intent and budget.
          </p>
        </section>

        <section className="card" aria-labelledby="templates-title">
          <h2 className="section-title" id="templates-title">Templates</h2>
          <p className="muted">Everything a proposal needs, ready to download or copy.</p>
          <ul className="rows" style={{ marginTop: '1rem' }}>
            {TEMPLATES.map((t) => <Template key={t.file} template={t} />)}
          </ul>
        </section>

        <section className="card" aria-labelledby="roles-title">
          <h2 className="section-title" id="roles-title">3. Who does what</h2>
          <ul className="rows" style={{ marginTop: '1rem' }}>
            <li>
              <strong>CELO holders.</strong> Decide. Every proposal is settled by the vote of locked CELO.
            </li>
            <li>
              <strong>Celo Governance Guild.</strong> The Governance Guardians run the process: they host the calls,
              help authors, review pull requests and keep the governance repository. The Guild is neutral and does not
              decide which proposals pass.
            </li>
            <li>
              <strong>Approvers.</strong> A technical check, like an audit. They verify that the proposal does what it
              says, does no harm to the network and can be verified by voters. They do not decide who deserves funds;
              that is for voters.
            </li>
            <li>
              <strong>Security Council.</strong> For emergencies only. A hotfix skips the vote, and needs both the
              approver multisig and the <Out href={addressUrl(SECURITY_COUNCIL)}>Security Council</Out> to approve it.
            </li>
            <li>
              <strong>Celo Operations Safe.</strong> Collects the network's fee revenue and forwards it to the fund. It
              is not part of governance and cannot spend from the fund.
            </li>
            <li>
              <strong>Recipients.</strong> Receive the grant in a multisig of their own, and report back to the community.
            </li>
          </ul>
        </section>

        <section className="card" aria-labelledby="claim-title">
          <h2 className="section-title" id="claim-title">4. How a recipient gets paid</h2>
          <p style={{ maxWidth: '48rem' }}>
            Most proposals do not send money. They approve an allowance: the recipient's address is authorized to take up
            to an amount, and the funds stay in the fund until it does. That is why open allowances count as committed.
            A few proposals transfer the funds directly when they execute.
          </p>
          <ol className="steps">
            <li>
              <h3>Use the approved address</h3>
              <p>Only the address named in the proposal can claim. It should be a multisig with at least 2 of 3 signers.</p>
            </li>
            <li>
              <h3>Call transferFrom on the token</h3>
              <p>
                On the token contract (<Out href={addressUrl(TOKEN_ADDRESSES.CELO)}>CELO</Out>,{' '}
                <Out href={addressUrl(TOKEN_ADDRESSES.USDm)}>USDm</Out> or{' '}
                <Out href={addressUrl(TOKEN_ADDRESSES.EURm)}>EURm</Out>), call <code>transferFrom</code> with the fund as
                the sender, your destination, and the amount in wei (1 CELO is 1 followed by 18 zeros). From a Safe, use
                the Transaction Builder.
              </p>
              <p className="mono small">from: {GOVERNANCE_ADDRESS}</p>
            </li>
            <li>
              <h3>Test first, claim as you need it</h3>
              <p>
                Send a small amount first. A grant can be claimed in parts; whatever is not claimed stays in the fund
                and shows as remaining in the <a href="#/ledger">ledger</a>.
              </p>
            </li>
          </ol>
        </section>

        <section className="card" aria-labelledby="example-title">
          <h2 className="section-title" id="example-title">A real example</h2>
          <p style={{ maxWidth: '48rem' }}>
            The Celo Governance Guild, which maintains this site, is funded the same way. CGP-223 approved a budget of
            60,400 USD for 2026, paid as an allowance of 532,000 CELO on 14 February 2026. The Guild claimed it in two
            parts and converted CELO to stablecoins as payments came due. CELO fell from about 0.11 USD to about 0.07 USD
            in that time, so the same CELO covered roughly 40,000 USD, and the Guild had to ask for a top-up without
            having spent more than approved.
          </p>
          <p style={{ maxWidth: '48rem' }}>
            Grants are approved in tokens, not in dollars. That is why this site tracks every grant in the token it was
            approved in, and why budgets are safer when they are paid in stablecoins.
          </p>
          <div className="actions">
            <a className="link-arrow" href="#/ledger">See it in the ledger</a>
          </div>
        </section>

        <section className="card" aria-labelledby="links-title">
          <h2 className="section-title" id="links-title">Tools and links</h2>
          <ul className="rows" style={{ marginTop: '1rem' }}>
            <li><Out href={LINKS.governanceRepo}>Governance repository</Out> <span className="muted">Every CGP, the call log and the technical guide.</span></li>
            <li><Out href={LINKS.callIssues}>Governance Call agendas</Out> <span className="muted">Ask for a slot to present.</span></li>
            <li><Out href={LINKS.createProposal}>Submitting a proposal on-chain</Out> <span className="muted">Celo docs.</span></li>
            <li><Out href={LINKS.governanceDocs}>Governance in the Celo docs</Out> <span className="muted">How the on-chain stages work.</span></li>
            <li><Out href={LINKS.mondo}>Mondo</Out> <span className="muted">Lock CELO, delegate and vote.</span></li>
            <li><Out href={LINKS.celocli}>Celo CLI</Out> <span className="muted">The command line tool used to submit a proposal.</span></li>
            <li><Out href={LINKS.forum}>Celo forum, Governance category</Out> <span className="muted">Where proposals are discussed.</span></li>
          </ul>
        </section>
      </div>
    </>
  );
}

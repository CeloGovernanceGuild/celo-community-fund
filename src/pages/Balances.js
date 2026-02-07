import React from 'react';
import { incomingProposals, getStatusColor } from '../data/incoming_proposals';

function Balances({
  communityFundCelo,
  communityFundUSDm,
  communityFundEURm,
  mentoReserveCelo,
  mentoReserveUSDm,
  mentoReserveEURm,
  celoPrice,
  eurPrice
}) {

  return (
    <div style={{ padding: '10px 12px', display: 'flex', gap: '15px', flexWrap: 'wrap', maxWidth: '100%', boxSizing: 'border-box' }}>
      {/* Left side - Proposals */}
      <div style={{ flex: '1.5', minWidth: '460px' }}>
        <div style={{ padding: '15px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
          <h3 style={{ margin: '0', color: '#FCFF52', fontSize: '20px' }}>Incoming Proposals</h3>
          <a
            href="https://github.com/celo-org/governance/tree/main/CGPs"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: '12px', color: '#64B5F6', textDecoration: 'none' }}
          >
            View All CGPs →
          </a>
        </div>

        {/* Status & Totals at Top */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <div style={{ flex: '1', minWidth: '130px', padding: '10px 12px', background: 'rgba(255,181,77,0.2)', borderRadius: '8px', border: '1px solid #FFB74D' }}>
            <p style={{ margin: '0', fontSize: '10px', color: '#FFB74D', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.5px' }}>Draft Proposals</p>
            <p style={{ margin: '6px 0 0 0', fontSize: '26px', fontWeight: 'bold', color: '#FFB74D', lineHeight: '1' }}>
              {incomingProposals.filter(p => p.status === 'DRAFT').reduce((sum, p) => sum + (p.fundingRequested.amount || 0), 0).toLocaleString()}
            </p>
            <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#FFB74D', opacity: '0.8' }}>CELO</p>
            <p style={{ margin: '6px 0 0 0', fontSize: '11px', color: '#999' }}>
              {incomingProposals.filter(p => p.status === 'DRAFT').length} proposal{incomingProposals.filter(p => p.status === 'DRAFT').length !== 1 ? 's' : ''}
            </p>
          </div>

          <div style={{ flex: '1', minWidth: '130px', padding: '10px 12px', background: 'rgba(100,181,246,0.2)', borderRadius: '8px', border: '1px solid #64B5F6' }}>
            <p style={{ margin: '0', fontSize: '10px', color: '#64B5F6', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.5px' }}>Proposed/Voting</p>
            <p style={{ margin: '6px 0 0 0', fontSize: '26px', fontWeight: 'bold', color: '#64B5F6', lineHeight: '1' }}>
              {incomingProposals.filter(p => p.status === 'PROPOSED').reduce((sum, p) => sum + (p.fundingRequested.amount || 0), 0).toLocaleString()}
            </p>
            <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#64B5F6', opacity: '0.8' }}>CELO</p>
            <p style={{ margin: '6px 0 0 0', fontSize: '11px', color: '#999' }}>
              {incomingProposals.filter(p => p.status === 'PROPOSED').length} proposal{incomingProposals.filter(p => p.status === 'PROPOSED').length !== 1 ? 's' : ''}
            </p>
          </div>

          <div style={{ flex: '1', minWidth: '130px', padding: '10px 12px', background: 'rgba(252,255,82,0.2)', borderRadius: '8px', border: '2px solid #FCFF52' }}>
            <p style={{ margin: '0', fontSize: '10px', color: '#FCFF52', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.5px' }}>Total Incoming</p>
            <p style={{ margin: '6px 0 0 0', fontSize: '28px', fontWeight: 'bold', color: '#FCFF52', lineHeight: '1' }}>
              {incomingProposals.reduce((sum, p) => sum + (p.fundingRequested.amount || 0), 0).toLocaleString()}
            </p>
            <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#FCFF52', opacity: '0.8' }}>CELO</p>
            <p style={{ margin: '6px 0 0 0', fontSize: '11px', color: '#999' }}>
              {incomingProposals.length} proposal{incomingProposals.length !== 1 ? 's' : ''} total
            </p>
          </div>
        </div>

        {/* Proposals List Below */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {incomingProposals.map((proposal) => (
            <div
              key={proposal.id}
              style={{
                padding: '8px 12px',
                background: 'rgba(0,0,0,0.3)',
                borderRadius: '6px',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px', flexWrap: 'wrap' }}>
                    <h5 style={{ margin: '0', color: '#FCFF52', fontSize: '12px', fontWeight: 'bold' }}>
                      {proposal.id.toUpperCase()}
                    </h5>
                    <span
                      style={{
                        padding: '2px 5px',
                        borderRadius: '3px',
                        fontSize: '9px',
                        fontWeight: 'bold',
                        background: getStatusColor(proposal.status) + '33',
                        color: getStatusColor(proposal.status),
                        border: `1px solid ${getStatusColor(proposal.status)}`
                      }}
                    >
                      {proposal.status}
                    </span>
                    {proposal.fundingRequested.note && (
                      <span
                        style={{
                          padding: '2px 5px',
                          borderRadius: '3px',
                          fontSize: '9px',
                          fontWeight: 'bold',
                          background: proposal.fundingRequested.note === 'Non Funding Proposal'
                            ? 'rgba(158,158,158,0.2)'
                            : 'rgba(255,152,0,0.2)',
                          color: proposal.fundingRequested.note === 'Non Funding Proposal'
                            ? '#9E9E9E'
                            : '#FF9800',
                          border: proposal.fundingRequested.note === 'Non Funding Proposal'
                            ? '1px solid #9E9E9E'
                            : '1px solid #FF9800'
                        }}
                        title={proposal.fundingRequested.note}
                      >
                        {proposal.fundingRequested.note === 'Non Funding Proposal'
                          ? 'NON-FUNDING'
                          : 'NO JSON IN .MD'}
                      </span>
                    )}
                  </div>
                  <p style={{ margin: '0', fontSize: '13px', color: '#fff', textAlign: 'left', lineHeight: '1.3' }}>
                    {proposal.title}
                  </p>
                </div>

                <div style={{ textAlign: 'right', minWidth: '130px', marginLeft: '12px' }}>
                  {proposal.fundingRequested.amount > 0 ? (
                    <p style={{ margin: '0', fontSize: '15px', color: '#FCFF52', fontWeight: 'bold' }}>
                      {proposal.fundingRequested.amount.toLocaleString()} CELO
                    </p>
                  ) : (
                    <p style={{ margin: '0', fontSize: '11px', color: '#9575CD' }}>
                      No funding
                    </p>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <a
                  href={proposal.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: '11px',
                    color: '#64B5F6',
                    textDecoration: 'none'
                  }}
                >
                  📄 Check on GitHub
                </a>
              </div>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: '10px',
          padding: '8px',
          background: 'rgba(100,181,246,0.1)',
          borderRadius: '6px',
          border: '1px solid rgba(100,181,246,0.3)'
        }}>
          <p style={{ margin: '0', fontSize: '10px', color: '#64B5F6', lineHeight: '1.5' }}>
            💡 Data from{' '}
            <a href="https://github.com/celo-org/governance" target="_blank" rel="noopener noreferrer" style={{ color: '#64B5F6', textDecoration: 'underline' }}>
              GitHub
            </a>
            {' '}and{' '}
            <a href="https://mondo.celo.org" target="_blank" rel="noopener noreferrer" style={{ color: '#64B5F6', textDecoration: 'underline' }}>
              Mondo
            </a>
          </p>
        </div>
      </div>
      </div>

      {/* Right side - Token Balances */}
      <div style={{ flex: '1', minWidth: '310px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ padding: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
          <h4 style={{ marginBottom: '10px', fontSize: '15px' }}>
            <a
              href="https://celoscan.io/address/0xD533Ca259b330c7A88f74E000a3FaEa2d63B7972"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#FCFF52', textDecoration: 'none' }}
            >
              Community Fund ↗
            </a>
          </h4>
        <div style={{ display: 'flex', gap: '6px', justifyContent: 'space-between' }}>
          <div style={{ flex: '1', padding: '8px', background: 'rgba(252,255,82,0.2)', borderRadius: '5px' }}>
            <p style={{ margin: '0', fontSize: '10px', color: '#ccc' }}>CELO</p>
            <p style={{ margin: '3px 0 0 0', fontSize: '17px', fontWeight: 'bold' }}>{communityFundCelo.toLocaleString()}</p>
            {celoPrice > 0 && (
              <>
                <p style={{ margin: '2px 0 0 0', fontSize: '9px', color: '#999' }}>@ ${celoPrice.toFixed(4)}</p>
                <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#56DF7C' }}>${(communityFundCelo * celoPrice).toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
              </>
            )}
          </div>
          <div style={{ flex: '1', padding: '8px', background: 'rgba(86,223,124,0.2)', borderRadius: '5px' }}>
            <p style={{ margin: '0', fontSize: '10px', color: '#ccc' }}>USDm</p>
            <p style={{ margin: '3px 0 0 0', fontSize: '17px', fontWeight: 'bold' }}>{communityFundUSDm.toLocaleString()}</p>
            <p style={{ margin: '2px 0 0 0', fontSize: '9px', color: '#999' }}>@ $1.00</p>
            <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#56DF7C' }}>${communityFundUSDm.toLocaleString()}</p>
          </div>
          <div style={{ flex: '1', padding: '8px', background: 'rgba(124,192,255,0.2)', borderRadius: '5px' }}>
            <p style={{ margin: '0', fontSize: '10px', color: '#ccc' }}>EURm</p>
            <p style={{ margin: '3px 0 0 0', fontSize: '17px', fontWeight: 'bold' }}>{communityFundEURm.toLocaleString()}</p>
            {eurPrice > 0 && (
              <>
                <p style={{ margin: '2px 0 0 0', fontSize: '9px', color: '#999' }}>@ ${eurPrice.toFixed(4)}</p>
                <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#56DF7C' }}>${(communityFundEURm * eurPrice).toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
              </>
            )}
          </div>
        </div>
        {(celoPrice > 0 || eurPrice > 0) && (
          <div style={{ marginTop: '10px', padding: '8px', background: 'rgba(86,223,124,0.1)', borderRadius: '5px', textAlign: 'center' }}>
            <p style={{ margin: '0', fontSize: '10px', color: '#ccc' }}>Subtotal (USD)</p>
            <p style={{ margin: '3px 0 0 0', fontSize: '17px', fontWeight: 'bold', color: '#56DF7C' }}>
              ${((communityFundCelo * celoPrice) + communityFundUSDm + (communityFundEURm * eurPrice)).toLocaleString(undefined, {maximumFractionDigits: 0})}
            </p>
          </div>
        )}
      </div>

      <div style={{ padding: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
        <h4 style={{ marginBottom: '10px', fontSize: '15px' }}>
          <a
            href="https://celoscan.io/address/0x9d65E69aC940dCB469fd7C46368C1e094250a400"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#FCFF52', textDecoration: 'none' }}
          >
            Reserve Contract ↗
          </a>
        </h4>
        <div style={{ display: 'flex', gap: '6px', justifyContent: 'space-between' }}>
          <div style={{ flex: '1', padding: '8px', background: 'rgba(252,255,82,0.2)', borderRadius: '5px' }}>
            <p style={{ margin: '0', fontSize: '10px', color: '#ccc' }}>CELO</p>
            <p style={{ margin: '3px 0 0 0', fontSize: '17px', fontWeight: 'bold' }}>{mentoReserveCelo.toLocaleString()}</p>
            {celoPrice > 0 && (
              <>
                <p style={{ margin: '2px 0 0 0', fontSize: '9px', color: '#999' }}>@ ${celoPrice.toFixed(4)}</p>
                <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#56DF7C' }}>${(mentoReserveCelo * celoPrice).toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
              </>
            )}
          </div>
          <div style={{ flex: '1', padding: '8px', background: 'rgba(86,223,124,0.2)', borderRadius: '5px' }}>
            <p style={{ margin: '0', fontSize: '10px', color: '#ccc' }}>USDm</p>
            <p style={{ margin: '3px 0 0 0', fontSize: '17px', fontWeight: 'bold' }}>{mentoReserveUSDm.toLocaleString()}</p>
            <p style={{ margin: '2px 0 0 0', fontSize: '9px', color: '#999' }}>@ $1.00</p>
            <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#56DF7C' }}>${mentoReserveUSDm.toLocaleString()}</p>
          </div>
          <div style={{ flex: '1', padding: '8px', background: 'rgba(124,192,255,0.2)', borderRadius: '5px' }}>
            <p style={{ margin: '0', fontSize: '10px', color: '#ccc' }}>EURm</p>
            <p style={{ margin: '3px 0 0 0', fontSize: '17px', fontWeight: 'bold' }}>{mentoReserveEURm.toLocaleString()}</p>
            {eurPrice > 0 && (
              <>
                <p style={{ margin: '2px 0 0 0', fontSize: '9px', color: '#999' }}>@ ${eurPrice.toFixed(4)}</p>
                <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#56DF7C' }}>${(mentoReserveEURm * eurPrice).toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
              </>
            )}
          </div>
        </div>
        {(celoPrice > 0 || eurPrice > 0) && (
          <div style={{ marginTop: '10px', padding: '8px', background: 'rgba(86,223,124,0.1)', borderRadius: '5px', textAlign: 'center' }}>
            <p style={{ margin: '0', fontSize: '10px', color: '#ccc' }}>Subtotal (USD)</p>
            <p style={{ margin: '3px 0 0 0', fontSize: '17px', fontWeight: 'bold', color: '#56DF7C' }}>
              ${((mentoReserveCelo * celoPrice) + mentoReserveUSDm + (mentoReserveEURm * eurPrice)).toLocaleString(undefined, {maximumFractionDigits: 0})}
            </p>
          </div>
        )}
      </div>

        {/* Combined Totals */}
        <div style={{ padding: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
          <h4 style={{ marginBottom: '10px', color: '#FCFF52', fontSize: '15px' }}>Combined Total</h4>
          <div style={{ display: 'flex', gap: '6px', justifyContent: 'space-between' }}>
            <div style={{ flex: '1', padding: '8px', background: 'rgba(252,255,82,0.2)', borderRadius: '5px' }}>
              <p style={{ margin: '0', fontSize: '10px', color: '#ccc' }}>CELO</p>
              <p style={{ margin: '3px 0 0 0', fontSize: '17px', fontWeight: 'bold' }}>
                {(communityFundCelo + mentoReserveCelo).toLocaleString()}
              </p>
              {celoPrice > 0 && (
                <>
                  <p style={{ margin: '2px 0 0 0', fontSize: '9px', color: '#999' }}>@ ${celoPrice.toFixed(4)}</p>
                  <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#56DF7C' }}>
                    ${((communityFundCelo + mentoReserveCelo) * celoPrice).toLocaleString(undefined, {maximumFractionDigits: 0})}
                  </p>
                </>
              )}
            </div>
            <div style={{ flex: '1', padding: '8px', background: 'rgba(86,223,124,0.2)', borderRadius: '5px' }}>
              <p style={{ margin: '0', fontSize: '10px', color: '#ccc' }}>USDm</p>
              <p style={{ margin: '3px 0 0 0', fontSize: '17px', fontWeight: 'bold' }}>
                {(communityFundUSDm + mentoReserveUSDm).toLocaleString()}
              </p>
              <p style={{ margin: '2px 0 0 0', fontSize: '9px', color: '#999' }}>@ $1.00</p>
              <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#56DF7C' }}>
                ${(communityFundUSDm + mentoReserveUSDm).toLocaleString()}
              </p>
            </div>
            <div style={{ flex: '1', padding: '8px', background: 'rgba(124,192,255,0.2)', borderRadius: '5px' }}>
              <p style={{ margin: '0', fontSize: '10px', color: '#ccc' }}>EURm</p>
              <p style={{ margin: '3px 0 0 0', fontSize: '17px', fontWeight: 'bold' }}>
                {(communityFundEURm + mentoReserveEURm).toLocaleString()}
              </p>
              {eurPrice > 0 && (
                <>
                  <p style={{ margin: '2px 0 0 0', fontSize: '9px', color: '#999' }}>@ ${eurPrice.toFixed(4)}</p>
                  <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#56DF7C' }}>
                    ${((communityFundEURm + mentoReserveEURm) * eurPrice).toLocaleString(undefined, {maximumFractionDigits: 0})}
                  </p>
                </>
              )}
            </div>
          </div>
          {(celoPrice > 0 || eurPrice > 0) && (
            <div style={{ marginTop: '10px', padding: '8px', background: 'rgba(86,223,124,0.1)', borderRadius: '5px', textAlign: 'center' }}>
              <p style={{ margin: '0', fontSize: '10px', color: '#ccc' }}>Grand Total (USD)</p>
              <p style={{ margin: '3px 0 0 0', fontSize: '17px', fontWeight: 'bold', color: '#56DF7C' }}>
                ${(
                  (communityFundCelo * celoPrice) + communityFundUSDm + (communityFundEURm * eurPrice) +
                  (mentoReserveCelo * celoPrice) + mentoReserveUSDm + (mentoReserveEURm * eurPrice)
                ).toLocaleString(undefined, {maximumFractionDigits: 0})}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Balances;

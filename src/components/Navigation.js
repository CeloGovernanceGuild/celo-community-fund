import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navigation() {
  const location = useLocation();

  const navStyle = {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
    padding: '8px 0',
    marginBottom: '10px'
  };

  const linkStyle = (isActive) => ({
    padding: '6px 15px',
    textDecoration: 'none',
    color: isActive ? '#000' : '#FCFF52',
    background: isActive ? '#FCFF52' : 'rgba(252,255,82,0.1)',
    borderRadius: '4px',
    fontWeight: isActive ? 'bold' : 'normal',
    fontSize: '14px',
    transition: 'all 0.2s ease',
    border: `1px solid ${isActive ? '#FCFF52' : 'rgba(252,255,82,0.3)'}`
  });

  return (
    <nav style={navStyle}>
      <Link
        to="/"
        style={linkStyle(location.pathname === '/')}
      >
        Balances
      </Link>
      <Link
        to="/status"
        style={linkStyle(location.pathname === '/status')}
      >
        Fund Status
      </Link>
    </nav>
  );
}

export default Navigation;

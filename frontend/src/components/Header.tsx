import React from 'react';
import { Vote } from 'lucide-react';
import './Header.css';

export const Header: React.FC = () => {
  return (
    <header className="header-container">
      <div className="header-title">
        <h1>VotaçãoApp</h1>
        <p>Cooperativa Central</p>
      </div>
      <div className="header-icon">
        <Vote size={20} />
      </div>
    </header>
  );
};

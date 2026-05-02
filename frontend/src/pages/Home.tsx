import React from 'react';
import { Link } from 'react-router-dom';
import { Vote, Settings, Users } from 'lucide-react';
import './Home.css';

export const Home: React.FC = () => {
  return (
    <div className="home-container">
      <div className="home-logo">
        <Vote size={64} />
      </div>
      
      <div className="home-title">
        <h2>VotaçãoApp</h2>
        <p>Cooperativa Central — Selecione seu perfil</p>
      </div>

      <div className="home-buttons">
        <Link to="/admin" className="btn-role btn-role-admin">
          <div className="role-icon"><Settings size={24} color="var(--accent-color)" /></div>
          <span>Administrador</span>
        </Link>
        
        <Link to="/votar" className="btn-role btn-role-user">
          <div className="role-icon"><Users size={24} color="var(--success-color)" /></div>
          <span>Associado (Votar)</span>
        </Link>
      </div>
    </div>
  );
};

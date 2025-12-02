import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <section className="hero-section">
        <img 
            src="/hotel-exterior.webp" 
            alt="Fachada do Hotel" 
            className="hero-image" 
        />
        <div className="hero-overlay">
            <h1>Bem-vindo ao Hotel Back-End</h1>
            <p>Experiência única de conforto, luxo e tranquilidade.</p>
        </div>
      </section>

      <div style={{textAlign: 'center', margin: '20px 0'}}>
          <h2 style={{color: '#2c3e50'}}>O destino perfeito para suas férias</h2>
          <p style={{maxWidth: '800px', margin: '0 auto', color: '#555'}}>
              Desfrute de uma arquitetura moderna integrada à natureza. 
              Nossa estrutura oferece tudo que você precisa para relaxar e se divertir.
          </p>
      </div>

      <section className="destaques-grid">
        <div className="card-destaque">
            <img src="/hotel-interior.webp" alt="Interior do Hotel" />
            <div className="card-info">
                <h3>Ambientes Sofisticados</h3>
                <p>Design moderno e aconchegante para você se sentir em casa.</p>
            </div>
        </div>

        <div className="card-destaque">
            <img src="/hotel-quarto.webp" alt="Quartos Luxuosos" />
            <div className="card-info">
                <h3>Acomodações Premium</h3>
                <p>Conforto absoluto com vistas incríveis e serviço de quarto 24h.</p>
                {/* Link direto para ver os quartos */}
                <Link to="/quartos/lista" style={{color: '#3498db', fontWeight: 'bold'}}>Ver Quartos</Link>
            </div>
        </div>

        <div className="card-destaque">

            <img src="/hotel-servicos.webp" alt="Serviços Exclusivos" onError={(e) => e.target.src='/hotel-servicos.webp'} />
            <div className="card-info">
                <h3>Gastronomia & Lazer</h3>
                <p>Restaurante internacional, piscina, spa e academia completa.</p>
            </div>
        </div>

      </section>

    </div>
  );
}

export default Home;
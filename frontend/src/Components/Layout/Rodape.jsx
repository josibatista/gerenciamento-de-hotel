import React from 'react';
import './Rodape.css';

function Rodape() {
    return (
        <footer className="rodape">
            <div className="container-rodape">
                <div className="rodape-info">
                    <p>&copy; 2025 <strong>Sistema de Gerenciamento de Hotel</strong>.</p>
                </div>
                
                <div className="rodape-autores">
                    <p>
                        Desenvolvido por: <span>Josiane Mariane Batista</span> & <span>Pamela Berti Braz</span>
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Rodape;
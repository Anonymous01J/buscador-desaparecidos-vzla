import React, { useState } from 'react';
import './index.css';

function App() {
  const [people, setPeople] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    
    setLoading(true);
    setHasSearched(true);
    
    try {
      // Usamos VITE_API_URL en producción o localhost en desarrollo local
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/people?q=${encodeURIComponent(search)}`);
      const data = await response.json();
      setPeople(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Hubo un error al buscar. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const getBadgeClass = (status) => {
    const s = status.toLowerCase();
    if (s.includes('encontrado') || s.includes('localizado') || s.includes('salvo')) {
      return 'badge encontrado';
    }
    return 'badge se-busca';
  };

  return (
    <div className="container">
      <header>
        <h1>Buscador de Desaparecidos</h1>
        <p className="subtitle">Terremoto en Venezuela 2026<br/>Registro consolidado de plataformas comunitarias y oficiales</p>
      </header>

      <form className="search-container" onSubmit={handleSearch}>
        <div className="search-wrapper">
            <input 
              type="text" 
              className="search-input" 
              placeholder="Buscar por nombre o apellido (ej. Carlos)..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="search-btn">
                Buscar
            </button>
        </div>
      </form>

      {loading ? (
        <div className="loading">
          <div className="loading-spinner"></div>
          <div>Consultando simultáneamente en múltiples bases de datos...</div>
        </div>
      ) : !hasSearched ? (
        <div className="no-results">
          Ingresa un nombre en el buscador para consultar en todas las listas de forma unificada.
        </div>
      ) : people.length === 0 ? (
        <div className="no-results">No se encontraron resultados exactos para "{search}".<br/><span style={{fontSize: '0.9em', opacity: 0.8}}>Intenta usar solo un apellido o un nombre.</span></div>
      ) : (
        <>
            <p className="results-meta">Se encontraron {people.length} coincidencias:</p>
            <div className="grid">
              {people.map((person) => (
                <div className="card" key={person.id}>
                  <div className="card-img-container">
                    {person.photo && person.photo !== 'null' ? (
                      <img src={person.photo} alt={`Foto de ${person.name}`} className="card-img" loading="lazy" />
                    ) : (
                      <span className="no-photo">Sin foto</span>
                    )}
                  </div>
                  <div className="card-content">
                    <span className={getBadgeClass(person.status)}>{person.status}</span>
                    <h3 className="card-title">{person.name}</h3>
                    
                    {person.contact && (
                      <div className="contact-info">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                        <span>{person.contact}</span>
                      </div>
                    )}
                    
                    <div className="card-source">
                      <span>Fuente: {person.source}</span>
                      {person.sourceUrl && (
                        <a href={person.sourceUrl} target="_blank" rel="noopener noreferrer" className="source-link">Ver original</a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
        </>
      )}
    </div>
  );
}

export default App;

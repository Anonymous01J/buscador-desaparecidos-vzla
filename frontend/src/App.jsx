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
        <h1>Buscador de Personas</h1>
        <p className="subtitle">Terremoto en Venezuela 2026 - Registro consolidado de plataformas no oficiales</p>
      </header>

      <form className="search-container" onSubmit={handleSearch}>
        <div style={{ display: 'flex', width: '100%', maxWidth: '600px', gap: '10px' }}>
            <input 
              type="text" 
              className="search-input" 
              placeholder="Buscar por nombre o apellido (ej. Carlos)..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ flexGrow: 1 }}
            />
            <button 
                type="submit" 
                style={{
                    padding: '0 1.5rem', 
                    borderRadius: '8px', 
                    backgroundColor: 'var(--accent-color)', 
                    color: 'white', 
                    border: 'none', 
                    fontSize: '1rem',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                }}>
                Buscar
            </button>
        </div>
      </form>

      {loading ? (
        <div className="loading">Buscando en múltiples plataformas en tiempo real...</div>
      ) : !hasSearched ? (
        <div className="no-results">Ingresa un nombre para buscar en todas las listas.</div>
      ) : people.length === 0 ? (
        <div className="no-results">No se encontraron resultados para "{search}".</div>
      ) : (
        <>
            <p style={{marginBottom: '1rem', color: 'var(--text-muted)'}}>Se encontraron {people.length} coincidencias:</p>
            <div className="grid">
              {people.map((person) => (
                <div className="card" key={person.id}>
                  <div className="card-img-container">
                    {person.photo && person.photo !== 'null' ? (
                      <img src={person.photo} alt={`Foto de ${person.name}`} className="card-img" loading="lazy" />
                    ) : (
                      <span className="no-photo">Sin foto disponible</span>
                    )}
                  </div>
                  <div className="card-content">
                    <span className={getBadgeClass(person.status)}>{person.status}</span>
                    <h3 className="card-title">{person.name}</h3>
                    
                    {person.contact && (
                      <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#ffeb3b', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                        <span>Contacto: {person.contact}</span>
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

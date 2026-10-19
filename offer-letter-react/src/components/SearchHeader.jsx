import { useState } from 'react';
import { COMPANY } from '../lib/company.js';
import { searchOffers } from '../lib/api.js';

/* Page header: logo, "find a previously generated letter" search, title. */
export default function SearchHeader() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [results, setResults] = useState([]);

  async function handleSearch() {
    const query = name.trim();
    setResults([]);
    if (!query) {
      setMessage('Enter a candidate name to search.');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      const data = await searchOffers(query);
      if (!data.results || data.results.length === 0) {
        setMessage('No matching offer letters found.');
      } else {
        setResults(data.results);
      }
    } catch (err) {
      console.error('Search failed:', err);
      setMessage(`Could not search: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <header className="page-header">
      <div className="page-header-top-row">
        <img className="page-header-logo" src={COMPANY.logoImage} alt="UX Interfacely" />

        <div className="history-search-block">
          <p className="history-search-label">Find a Previously Generated Letter</p>
          <div className="history-search-row">
            <input
              id="searchName"
              type="text"
              placeholder="Search by candidate name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button type="button" className="btn-primary" onClick={handleSearch} disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>
      </div>

      <h1 className="gradient-title">Offer Letter Generator</h1>
      <p className="page-subtitle">Generate, store and send employee offer letters</p>

      <div id="searchResults">
        {message && <p className="search-empty">{message}</p>}
        {results.map((row, index) => (
          <div className="search-result-row" key={row.id ?? index}>
            <div>
              <strong>{row.candidate_name || 'Unknown'}</strong>
              {' — '}
              {row.job_title || ''} · {row.status || ''}
              {row.date_of_joining ? ` · DOJ: ${row.date_of_joining}` : ''}
            </div>
            <div>
              {row.pdf_url ? (
                <a href={row.pdf_url} target="_blank" rel="noopener noreferrer">Open PDF</a>
              ) : (
                <span className="search-no-pdf">No PDF stored</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </header>
  );
}

import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';

export default function App() {
  const [songs, setSongs] = useState([]);
  const [search, setSearch] = useState('');
  const [language, setLanguage] = useState('');

  useEffect(() => {
    fetch('/bibel1023.csv')
      .then(response => response.text())
      .then(csv => {
        Papa.parse(csv, {
          header: true,
          complete: (result) => {
            setSongs(result.data);
          }
        });
      });
  }, []);

  const filteredSongs = songs.filter(song => {
    const matchLang = language ? song.Language?.toLowerCase() === language.toLowerCase() : true;
    const matchSearch = search
      ? (song.Song?.toLowerCase().includes(search.toLowerCase()) || song.Singer?.toLowerCase().includes(search.toLowerCase()))
      : true;
    return matchLang && matchSearch;
  });

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Karaoke Song Finder</h1>
      <input
        type="text"
        placeholder="Search by title or singer"
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ marginRight: '10px', padding: '5px' }}
      />
      <select value={language} onChange={e => setLanguage(e.target.value)} style={{ padding: '5px' }}>
        <option value="">All Languages</option>
        <option value="Deutsch">Deutsch</option>
        <option value="Englisch">Englisch</option>
        <option value="Italianisch">Italianisch</option>
        <option value="Spanisch">Spanisch</option>
        <option value="Turkisch">Turkisch</option>
        <option value="Francesch">Francesch</option>
        <option value="Polnisch">Polnisch</option>
      </select>
      <table border="1" style={{ marginTop: '20px', width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Singer</th>
            <th>Language</th>
            <th>Year</th>
          </tr>
        </thead>
        <tbody>
          {filteredSongs.map((song, index) => (
            <tr key={index}>
              <td>{song.Song}</td>
              <td>{song.Singer}</td>
              <td>{song.Language}</td>
              <td>{song.Year}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

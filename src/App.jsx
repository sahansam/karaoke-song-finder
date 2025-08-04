import React, { useState } from 'react';
import Papa from 'papaparse';

export default function App() {
  const [songs, setSongs] = useState([]);
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState('English');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        setSongs(results.data);
      },
    });
  };

  const filteredSongs = songs.filter(song => {
    return (
      (song.Title && song.Title.toLowerCase().includes(query.toLowerCase())) ||
      (song.Singer && song.Singer.toLowerCase().includes(query.toLowerCase()))
    ) && (song.Language === language || language === 'All');
  });

  const languages = ['All', 'Deutsch', 'English', 'Italian', 'Spanish', 'Turkish', 'French', 'Polish'];

  return (
    <div className="app-container" style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Karaoke Song Finder</h1>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      <div style={{ marginTop: '10px' }}>
        <input
          type="text"
          placeholder="Search by title or singer..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          {languages.map((lang) => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
      </div>
      <ul style={{ marginTop: '15px' }}>
        {filteredSongs.length > 0 ? (
          filteredSongs.map((song, index) => (
            <li key={index}>{song.Title} - {song.Singer} ({song.Language})</li>
          ))
        ) : (
          <li>No matching songs found</li>
        )}
      </ul>
    </div>
  );
}

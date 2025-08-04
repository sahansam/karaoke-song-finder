import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';

export default function App() {
  const [songs, setSongs] = useState([]);
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState('All');

  // Load CSV automatically on app start
  useEffect(() => {
    fetch('/songs.csv')
      .then((response) => response.text())
      .then((text) => {
        Papa.parse(text, {
          header: true,
          delimiter: ';',
          complete: (results) => {
            const mappedSongs = results.data.map(song => ({
              ID: song['#ID'],
              Singer: song['#Singer'],
              Title: song['#Song'],
              Year: song['#Year'],
              Language: song['#Language']
            }));
            setSongs(mappedSongs);
          },
        });
      });
  }, []);

  const filteredSongs = songs.filter(song => {
    return (
      (song.Title && song.Title.toLowerCase().includes(query.toLowerCase())) ||
      (song.Singer && song.Singer.toLowerCase().includes(query.toLowerCase()))
    ) && (song.Language === language || language === 'All');
  });

  const languages = ['All', 'Deutsch', 'English', 'Italianisch', 'Spanisch', 'Turkisch', 'Francesch', 'Polnisch'];

  return (
    <div className="app-container" style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Karaoke Song Finder</h1>
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

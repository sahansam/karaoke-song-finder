import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';

export default function App() {
  const [songs, setSongs] = useState([]);
  const [language, setLanguage] = useState('');
  const [singer, setSinger] = useState('');
  const [title, setTitle] = useState('');
  const [filteredSongs, setFilteredSongs] = useState([]);

  useEffect(() => {
    fetch('/songs.csv')
      .then((res) => res.text())
      .then((text) => {
        Papa.parse(text, {
          header: true,
          delimiter: ';',
          skipEmptyLines: true,
          complete: (result) => {
            setSongs(result.data);
          },
        });
      });
  }, []);

  const handleSearch = () => {
    let filtered = songs.filter((song) => {
      return (
        (language ? song['#Language'].toLowerCase() === language.toLowerCase() : true) &&
        (singer ? song['#Singer'].toLowerCase().includes(singer.toLowerCase()) : true) &&
        (title ? song['#Song'].toLowerCase().includes(title.toLowerCase()) : true)
      );
    });
    setFilteredSongs(filtered);
  };

  const languageOptions = [
    'Deutsch',
    'English',
    'Italian',
    'Spanish',
    'Turkish',
    'French',
    'Polish',
  ];

  const autocomplete = (input, field) => {
    return songs
      .filter((s) => (language ? s['#Language'].toLowerCase() === language.toLowerCase() : true))
      .map((s) => s[field])
      .filter((val, idx, arr) => val && val.toLowerCase().includes(input.toLowerCase()) && arr.indexOf(val) === idx)
      .slice(0, 5);
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px', background: 'linear-gradient(45deg, #ff8800, #7f00ff)', minHeight: '100vh', color: 'white', fontFamily: 'Poppins, sans-serif' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '20px', textShadow: '2px 2px 8px #000' }}>🎵 Jukebox Bible 🎵</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
        <select value={language} onChange={(e) => setLanguage(e.target.value)} style={{ padding: '10px', borderRadius: '5px', width: '200px' }}>
          <option value="">Select Language</option>
          {languageOptions.map((lang) => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Singer name..."
          value={singer}
          onChange={(e) => setSinger(e.target.value)}
          list="singer-list"
          style={{ padding: '10px', borderRadius: '5px', width: '200px' }}
        />
        <datalist id="singer-list">
          {autocomplete(singer, '#Singer').map((name) => (
            <option key={name} value={name} />
          ))}
        </datalist>

        <input
          type="text"
          placeholder="Song title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          list="title-list"
          style={{ padding: '10px', borderRadius: '5px', width: '200px' }}
        />
        <datalist id="title-list">
          {autocomplete(title, '#Song').map((song) => (
            <option key={song} value={song} />
          ))}
        </datalist>

        <button onClick={handleSearch} style={{ backgroundColor: '#ff8800', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Search</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center', maxHeight: '400px', overflowY: 'auto', width: '100%', padding: '10px' }}>
        {filteredSongs.length > 0 ? (
          filteredSongs.map((song) => (
            <div key={song['#ID']} style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '15px', borderRadius: '10px', width: '90%', maxWidth: '400px', boxShadow: '0 4px 6px rgba(0,0,0,0.2)', textAlign: 'left' }}>
              <h3>{song['#Song']}</h3>
              <p><strong>Singer:</strong> {song['#Singer']}</p>
              <p><strong>Language:</strong> {song['#Language']}</p>
              <p><strong>Year:</strong> {song['#Year']}</p>
            </div>
          ))
        ) : (
          <p>No songs found. Try adjusting your search.</p>
        )}
      </div>
    </div>
  );
}

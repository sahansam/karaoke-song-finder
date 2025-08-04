import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import './App.css';

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
        (language ? song['#Language'] === language : true) &&
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
      .map((s) => s[field])
      .filter((val, idx, arr) => val && val.toLowerCase().includes(input.toLowerCase()) && arr.indexOf(val) === idx)
      .slice(0, 5);
  };

  return (
    <div className="app-container">
      <h1 className="title">🎵 Jukebox Bible 🎵</h1>
      <div className="search-container">
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
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
        />
        <datalist id="title-list">
          {autocomplete(title, '#Song').map((song) => (
            <option key={song} value={song} />
          ))}
        </datalist>

        <button onClick={handleSearch}>Search</button>
      </div>

      <div className="results-container">
        {filteredSongs.length > 0 ? (
          filteredSongs.map((song) => (
            <div key={song['#ID']} className="song-card">
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

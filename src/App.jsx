import React, { useState } from 'react';
import Papa from 'papaparse';
import logo from './517800655_25190794110520466_3285837463860725229_n.jpg';

export default function App() {
  const [page, setPage] = useState('welcome');
  const [songs, setSongs] = useState([]);
  const [language, setLanguage] = useState('');
  const [singer, setSinger] = useState('');
  const [title, setTitle] = useState('');
  const [filteredSongs, setFilteredSongs] = useState([]);

  const fixedLanguages = ["Deutsch", "English", "Spanish", "French", "Italian"];

  React.useEffect(() => {
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

  React.useEffect(() => {
    let filtered = songs.filter((song) => {
      return (
        (language ? song['#Language'].toLowerCase() === language.toLowerCase() : true) &&
        (singer ? song['#Singer'].toLowerCase().includes(singer.toLowerCase()) : true) &&
        (title ? song['#Song'].toLowerCase().includes(title.toLowerCase()) : true)
      );
    });
    setFilteredSongs(filtered);
  }, [language, singer, title, songs]);

  const handleTitleSelect = (selectedTitle) => {
    setTitle(selectedTitle);
    const match = songs.find(
      (song) => song['#Song'].toLowerCase() === selectedTitle.toLowerCase() && (!language || song['#Language'].toLowerCase() === language.toLowerCase())
    );
    if (match) {
      setSinger(match['#Singer']);
    }
  };

  const autocomplete = (input, field) => {
    return songs
      .filter((s) => (language ? s['#Language'].toLowerCase() === language.toLowerCase() : true))
      .map((s) => s[field])
      .filter((val, idx, arr) => val && val.toLowerCase().includes(input.toLowerCase()) && arr.indexOf(val) === idx)
      .slice(0, 5);
  };

  if (page === 'welcome') {
    return (
      <div style={{ textAlign: 'center', padding: '40px', background: 'linear-gradient(45deg, #ff8800, #7f00ff)', minHeight: '100vh', color: 'white', fontFamily: 'Poppins, sans-serif' }}>
        <img src={logo} alt="Jukebox KWH" style={{ width: '250px', marginBottom: '20px', borderRadius: '15px', boxShadow: '0px 4px 10px rgba(0,0,0,0.5)' }} />
        <h1 style={{ fontSize: '2rem', marginBottom: '30px', textShadow: '2px 2px 8px #000' }}>🎵 Welcome to Jukebox KWH 🎵</h1>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <div onClick={() => setPage('menu')} style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '20px', borderRadius: '10px', width: '150px', cursor: 'pointer', textAlign: 'center' }}>Speisekarte</div>
          <div onClick={() => setPage('karaoke')} style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '20px', borderRadius: '10px', width: '150px', cursor: 'pointer', textAlign: 'center' }}>Karaoke</div>
        </div>
      </div>
    );
  }

  if (page === 'menu') {
    return (
      <div style={{ textAlign: 'center', padding: '40px', background: 'linear-gradient(45deg, #ff8800, #7f00ff)', minHeight: '100vh', color: 'white' }}>
        <h1>Speisekarte</h1>
        <p>Sample menu details coming soon...</p>
        <button onClick={() => setPage('welcome')} style={{ marginTop: '20px', padding: '10px 20px', borderRadius: '5px' }}>Back</button>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center', padding: '20px', background: 'linear-gradient(45deg, #ff8800, #7f00ff)', minHeight: '100vh', color: 'white', fontFamily: 'Poppins, sans-serif' }}>
      <h1 style={{ fontSize: '2.2rem', marginBottom: '20px', textShadow: '2px 2px 8px #000' }}>🎵 Jukebox Bible 🎵</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginBottom: '20px', width: '100%', maxWidth: '450px', margin: '0 auto' }}>
        <label style={{ width: '100%', textAlign: 'center', fontSize: '0.9rem' }}>Language</label>
        <select value={language} onChange={(e) => setLanguage(e.target.value)} style={{ padding: '8px', borderRadius: '5px', width: '100%', textAlign: 'center' }}>
          <option value="">All Languages</option>
          {fixedLanguages.map((lang) => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>

        <label style={{ width: '100%', textAlign: 'center', fontSize: '0.9rem' }}>Song Title</label>
        <input
          type="text"
          placeholder="Start typing song title..."
          value={title}
          onChange={(e) => handleTitleSelect(e.target.value)}
          list="title-list"
          style={{ padding: '8px', borderRadius: '5px', width: '100%', textAlign: 'center' }}
        />
        <datalist id="title-list">
          {autocomplete(title, '#Song').map((song) => (
            <option key={song} value={song} />
          ))}
        </datalist>

        <label style={{ width: '100%', textAlign: 'center', fontSize: '0.9rem' }}>Singer Name</label>
        <input
          type="text"
          placeholder="Type singer name..."
          value={singer}
          onChange={(e) => setSinger(e.target.value)}
          list="singer-list"
          style={{ padding: '8px', borderRadius: '5px', width: '100%', textAlign: 'center' }}
        />
        <datalist id="singer-list">
          {autocomplete(singer, '#Singer').map((name) => (
            <option key={name} value={name} />
          ))}
        </datalist>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', maxHeight: '350px', overflowY: 'auto', width: '100%', padding: '10px' }}>
        {filteredSongs.length > 0 ? (
          filteredSongs.map((song) => (
            <div key={song['#ID']} style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', padding: '8px', borderRadius: '8px', width: '90%', maxWidth: '350px', boxShadow: '0 3px 5px rgba(0,0,0,0.2)', textAlign: 'center' }}>
              <p>{song['#Song']} ({song['#Year']}) - {song['#Singer']}</p>
            </div>
          ))
        ) : (
          <p>No songs found. Try adjusting your search.</p>
        )}
      </div>
      <button onClick={() => setPage('welcome')} style={{ marginTop: '20px', padding: '10px 20px', borderRadius: '5px' }}>Back</button>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import logo from './517800655_25190794110520466_3285837463860725229_n.jpg';

export default function App() {
  const [page, setPage] = useState('welcome');
  const [songs, setSongs] = useState([]);
  const [language, setLanguage] = useState('All');
  const [singer, setSinger] = useState('');
  const [title, setTitle] = useState('');
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [visibleSongs, setVisibleSongs] = useState(10);
  const [showTable, setShowTable] = useState(false);

  const fixedLanguages = ["All", "Deutsch", "English", "Spanish", "French", "Italian", "Sinhalese"];

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

  useEffect(() => {
    let filtered = songs.filter((song) => {
      return (
        (language !== 'All' ? song['#Language'].toLowerCase() === language.toLowerCase() : true) &&
        (singer ? song['#Singer'].toLowerCase().includes(singer.toLowerCase()) : true) &&
        (title ? song['#Song'].toLowerCase().includes(title.toLowerCase()) : true)
      );
    });
    setFilteredSongs(filtered);
    setVisibleSongs(10);
  }, [language, singer, title, songs]);

  const handleTitleSelect = (selectedTitle) => {
    setTitle(selectedTitle);
    const match = songs.find(
      (song) => song['#Song'].toLowerCase() === selectedTitle.toLowerCase() && (language === 'All' || song['#Language'].toLowerCase() === language.toLowerCase())
    );
    if (match) {
      setSinger(match['#Singer']);
    }
  };

  const autocomplete = (input, field) => {
    return songs
      .filter((s) => (language !== 'All' ? s['#Language'].toLowerCase() === language.toLowerCase() : true))
      .map((s) => s[field])
      .filter((val, idx, arr) => val && val.toLowerCase().includes(input.toLowerCase()) && arr.indexOf(val) === idx)
      .slice(0, 5);
  };

  const loadMore = () => {
    setVisibleSongs((prev) => prev + 10);
  };

  const BackButton = () => (
    <button onClick={() => setPage('welcome')} style={{ position: 'fixed', top: '20px', left: '20px', padding: '10px 20px', borderRadius: '5px', background: 'rgba(255,255,255,0.3)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>⬅ Back</button>
  );

  const WelcomePage = () => (
    <div style={{ textAlign: 'center', padding: '40px', background: 'linear-gradient(45deg, #ff8800, #7f00ff)', minHeight: '100vh', color: 'white', fontFamily: 'Poppins, sans-serif' }}>
      <img src={logo} alt="Jukebox KWH" style={{ width: '250px', marginBottom: '20px', borderRadius: '15px', boxShadow: '0px 4px 10px rgba(0,0,0,0.5)' }} />
      <h1 style={{ fontSize: '2rem', marginBottom: '30px', textShadow: '2px 2px 8px #000' }}>🎵 Welcome to Jukebox KWH 🎵</h1>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
        <div onClick={() => setPage('menu')} style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '20px', borderRadius: '10px', width: '150px', cursor: 'pointer', textAlign: 'center' }}>Speisekarte</div>
        <div onClick={() => setPage('karaoke')} style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '20px', borderRadius: '10px', width: '150px', cursor: 'pointer', textAlign: 'center' }}>Karaoke</div>
        <div onClick={() => setPage('musicquiz')} style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '20px', borderRadius: '10px', width: '150px', cursor: 'pointer', textAlign: 'center' }}>Music Quiz</div>
        <div onClick={() => setPage('credits')} style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '20px', borderRadius: '10px', width: '150px', cursor: 'pointer', textAlign: 'center' }}>Credits</div>
      </div>
    </div>
  );

  if (page === 'welcome') return <WelcomePage />;

  if (page === 'menu') {
    return (
      <div style={{ textAlign: 'center', padding: '40px', background: 'linear-gradient(45deg, #ff8800, #7f00ff)', minHeight: '100vh', color: 'white' }}>
        <BackButton />
        <h1>Speisekarte</h1>
        <img src="/menu.jpg" alt="Menu" style={{ maxWidth: '80%', borderRadius: '10px', marginTop: '20px' }} />
      </div>
    );
  }

  if (page === 'musicquiz') {
    return (
      <div style={{ textAlign: 'center', padding: '40px', background: 'linear-gradient(45deg, #ff8800, #7f00ff)', minHeight: '100vh', color: 'white' }}>
        <BackButton />
        <h1>🎶 Music Quiz 🎶</h1>
        <p>🕹️ Coming soon... Test your music knowledge!</p>
      </div>
    );
  }

  if (page === 'credits') {
    return (
      <div style={{ textAlign: 'center', padding: '40px', background: 'linear-gradient(45deg, #ff8800, #7f00ff)', minHeight: '100vh', color: 'white' }}>
        <BackButton />
        <h1>📀 Credits 📀</h1>
        <p>Jukebox KWH v1.0 - Developed by Syed</p>
        <p>Special thanks to all karaoke lovers for their song contributions!</p>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center', padding: '20px', background: 'linear-gradient(45deg, #ff8800, #7f00ff)', minHeight: '100vh', color: 'white', fontFamily: 'Poppins, sans-serif' }}>
      <BackButton />
      <h1 style={{ fontSize: '2.2rem', marginBottom: '20px', textShadow: '2px 2px 8px #000' }}>🎤 Karaoke Song Finder 🎤</h1>
      <button onClick={() => setShowTable(!showTable)} style={{ padding: '10px 20px', marginBottom: '20px', borderRadius: '5px', background: 'rgba(255,255,255,0.3)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
        {showTable ? 'Hide Table' : 'Show Table'}
      </button>
      {showTable && (
        <table style={{ width: '90%', maxWidth: '700px', margin: '0 auto 20px auto', borderCollapse: 'collapse', backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}>
          <thead>
            <tr>
              <th style={{ padding: '8px', borderBottom: '1px solid #fff' }}>Song</th>
              <th style={{ padding: '8px', borderBottom: '1px solid #fff' }}>Singer</th>
              <th style={{ padding: '8px', borderBottom: '1px solid #fff' }}>Language</th>
              <th style={{ padding: '8px', borderBottom: '1px solid #fff' }}>Year</th>
            </tr>
          </thead>
          <tbody>
            {filteredSongs.slice(0, visibleSongs).map((song, index) => (
              <tr key={`${song['#ID']}-${index}`}>
                <td style={{ padding: '8px', borderBottom: '1px solid #fff' }}>{song['#Song']}</td>
                <td style={{ padding: '8px', borderBottom: '1px solid #fff' }}>{song['#Singer']}</td>
                <td style={{ padding: '8px', borderBottom: '1px solid #fff' }}>{song['#Language']}</td>
                <td style={{ padding: '8px', borderBottom: '1px solid #fff' }}>{song['#Year']}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginBottom: '20px', width: '100%', maxWidth: '450px', margin: '0 auto' }}>
        <label style={{ width: '100%', textAlign: 'center', fontSize: '0.9rem' }}>Language</label>
        <select value={language} onChange={(e) => setLanguage(e.target.value)} style={{ padding: '8px', borderRadius: '5px', width: '100%', textAlign: 'center' }}>
          {fixedLanguages.map((lang) => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>

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
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', maxHeight: '350px', overflowY: 'auto', width: '100%', padding: '10px' }}>
        {filteredSongs.length > 0 ? (
          filteredSongs.slice(0, visibleSongs).map((song, index) => (
            <div key={`${song['#ID']}-${index}`} style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', padding: '8px', borderRadius: '8px', width: '90%', maxWidth: '350px', boxShadow: '0 3px 5px rgba(0,0,0,0.2)', textAlign: 'center' }}>
              <p>🎶 {song['#Song']} ({song['#Year']}) - {song['#Singer']}</p>
            </div>
          ))
        ) : (
          <p>No songs found. Try adjusting your search.</p>
        )}
      </div>
      {visibleSongs < filteredSongs.length && (
        <button onClick={loadMore} style={{ marginTop: '10px', padding: '8px 16px', borderRadius: '5px' }}>Load More</button>
      )}
    </div>
  );
}


import { useState, useEffect, useRef } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import './App.css';

interface Puzzle {
  id: string;
  fen: string;
  task: string;
  solution: string;
}

const CONTACT_INFO = 'leopoldwatchi-creator';

function App() {
  const [view, setView] = useState<'puzzles' | 'analyzer'>('puzzles');
  const [problems, setProblems] = useState<Puzzle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [game, setGame] = useState(new Chess());
  const [moveStatus, setMoveStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [username, setUsername] = useState('Hikaru');
  const [isFetching, setIsFetching] = useState(false);
  const [fetchStatus, setFetchStatus] = useState('');
  const [gamesFound, setGamesFound] = useState(0);
  const isFetchingRef = useRef(false);

  // Le code du worker est maintenant dans un fichier séparé, donc App.tsx est plus propre.
  // Nous n'avons pas besoin de le modifier ici.

  useEffect(() => { fetch('/puzzles.json').then(r=>r.json()).then(setProblems).catch(console.error).finally(()=>setIsLoading(false)) }, []);
  useEffect(() => { if (problems.length > 0 && view === 'puzzles') { setGame(new Chess(problems[currentProblemIndex].fen)); setMoveStatus('idle'); } }, [currentProblemIndex, problems, view]);
  
  function onProblemDrop({ sourceSquare, targetSquare }: { sourceSquare: string; targetSquare: string | null; }): boolean { if (!targetSquare || problems.length === 0) return false; const c = problems[currentProblemIndex]; const g = new Chess(game.fen()); const m = g.move({ from: sourceSquare, to: targetSquare, promotion: 'q' }); if (m === null) return false; if (m.san === c.solution) { setMoveStatus('correct'); setGame(g); setScore(p => p + 1); setTimeout(() => { setCurrentProblemIndex(p => (p + 1) % problems.length); }, 1500); } else { setMoveStatus('incorrect'); setTimeout(() => setMoveStatus('idle'), 1500); return false; } return true; }
  
  async function handleLoadGames() {
    if (!username) { setFetchStatus('Veuillez entrer un pseudo.'); return; }
    setGamesFound(0);
    setFetchStatus(`Recherche des archives pour ${username}...`);
    setIsFetching(true);
    isFetchingRef.current = true;
    
    const apiHeaders = { 'User-Agent': `MonProjetPersonnelChess/1.0 (Contact: ${CONTACT_INFO})` };
    
    // CORRECTION : On réintroduit le PROXY_URL
    const PROXY_URL = 'https://cors-anywhere.herokuapp.com/';

    try {
      // On préfixe à nouveau l'URL avec le proxy
      const archivesUrl = `${PROXY_URL}https://api.chess.com/pub/player/${username}/games/archives`;
      const archivesRes = await fetch(archivesUrl, { headers: apiHeaders });
      if (!archivesRes.ok) throw new Error('API Error');
      
      const archivesData = await archivesRes.json();
      const archiveUrls: string[] = archivesData.archives.reverse();
      
      let totalGames = 0;
      for (let i = 0; i < archiveUrls.length; i++) {
        if (!isFetchingRef.current) { setFetchStatus('Arrêté.'); break; }
        setFetchStatus(`Chargement ${i + 1}/${archiveUrls.length}...`);
        
        // On préfixe également l'URL dans la boucle
        const gamesUrl = `${PROXY_URL}${archiveUrls[i]}`;
        const gamesRes = await fetch(gamesUrl, { headers: apiHeaders });
        const gamesData = await gamesRes.json();
        totalGames += gamesData.games.length;
        setGamesFound(totalGames);
        await new Promise(r => setTimeout(r, 500));
      }
      if (isFetchingRef.current) { setFetchStatus(`Terminé. ${tG} parties.`); }
    } catch (e) {
      setFetchStatus('Erreur. Le proxy est peut-être inactif ou l\'API a un problème.');
      console.error(e);
    } finally {
      setIsFetching(false);
      isFetchingRef.current = false;
    }
  }
  
  function handleStopFetching() { isFetchingRef.current = false; }
  
  // La fonction de test de Stockfish peut être enlevée si vous le souhaitez,
  // ou conservée pour le débogage.
  function testStockfish() { /* ... */ }

  return (
    <div className="app-container">
      <div className="view-switcher">
        <button className={view === 'puzzles' ? 'active' : ''} onClick={() => setView('puzzles')}>Résoudre des problèmes</button>
        <button className={view === 'analyzer' ? 'active' : ''} onClick={() => setView('analyzer')}>Analyser mes parties</button>
      </div>
      {view === 'puzzles' && (
        <>
          {isLoading ? <h1>Chargement...</h1> : (
            <>
              <div className="header"><h1>Mon Lichess - Problèmes</h1><div className="score-counter">Score : {score}</div></div>
              <h2>{problems.length > 0 ? problems[currentProblemIndex].task : 'Aucun problème'}</h2>
              <div className="feedback-container">{moveStatus === 'correct' && <p className="feedback-correct">Bien joué !</p>}{moveStatus === 'incorrect' && <p className="feedback-incorrect">Mauvais coup !</p>}</div>
              <div className="board-container"><Chessboard options={{ position: game.fen(), onPieceDrop: onProblemDrop, allowDragging: true }} /></div>
            </>
          )}
        </>
      )}
      {view === 'analyzer' && (
        <div className="analyzer-container">
            <h1>Analyse de Parties Chess.com</h1>
            <div className="importer-controls">
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Pseudo Chess.com" disabled={isFetching}/>
                {!isFetching ? (<button onClick={handleLoadGames}>Charger les parties</button>) : (<button onClick={handleStopFetching}>Stop</button>)}
            </div>
            <div className="status-text">{fetchStatus}</div>
            {gamesFound > 0 && <p>Nombre de parties trouvées : {gamesFound}</p>}
            {/* Le bouton de test n'est plus essentiel, je l'ai masqué mais vous pouvez le remettre */}
            {/* <div style={{...}}><button onClick={testStockfish}>Tester Stockfish</button></div> */}
        </div>
      )}
    </div>
  );
}

export default App;

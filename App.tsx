import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useParams, Link } from 'react-router-dom';
import Layout from './components/Layout';
import { fetchPlayerData, fetchLeaderboard, fetchGlobalStats, BRIDGE_CODE, PACKAGE_JSON_CODE } from './services/economyService';
import { PlayerData, LeaderboardEntry, GlobalStats } from './types';
import { MOCK_LEADERBOARD, SERVER_NAME } from './constants';
import { 
  Search, RefreshCw, AlertCircle, Zap, Settings, X, Terminal, Euro, ShieldCheck, FileText, ChevronLeft, TrendingUp, Users, Globe, Activity, Radio, Database
} from 'lucide-react';

// --- Styling Helpers ---
const getNameFontSizeClass = (name: string) => {
  const len = name.length;
  if (len > 14) return "text-2xl md:text-3xl lg:text-4xl";
  return "text-4xl md:text-5xl lg:text-6xl";
};

const getFontSizeClass = (balance: number) => {
  const len = Math.floor(balance).toLocaleString().length;
  if (len > 12) return "text-2xl md:text-4xl lg:text-5xl";
  if (len > 8) return "text-4xl md:text-6xl lg:text-7xl";
  return "text-5xl md:text-7xl lg:text-8xl";
};

// --- Main Dashboard Component ---
const Dashboard = ({ setShowBridgeModal }: { setShowBridgeModal: (v: boolean) => void }) => {
  const { playerName } = useParams();
  const navigate = useNavigate();
  
  const [searchName, setSearchName] = useState(playerName || '');
  const [loading, setLoading] = useState(false);
  const [player, setPlayer] = useState<PlayerData | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(MOCK_LEADERBOARD);
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [isLiveLeaderboard, setIsLiveLeaderboard] = useState(false);
  const [globalStats, setGlobalStats] = useState<GlobalStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const bridgeUrl = 'https://bridge-voidnest.onrender.com';

  const loadGlobalData = async () => {
    setLeaderboardLoading(true);
    setStatsLoading(true);
    try {
      const [lData, sData] = await Promise.allSettled([
        fetchLeaderboard(bridgeUrl),
        fetchGlobalStats(bridgeUrl)
      ]);
      if (lData.status === 'fulfilled' && lData.value?.length) {
        setLeaderboard(lData.value);
        setIsLiveLeaderboard(true);
      }
      if (sData.status === 'fulfilled' && sData.value) setGlobalStats(sData.value);
    } catch (e) {} finally {
      setLeaderboardLoading(false);
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    loadGlobalData();
  }, []);

  useEffect(() => {
    const handlePlayerParam = async () => {
      if (playerName) {
        setLoading(true);
        setError(null);
        setSearchName(playerName);
        const data = await fetchPlayerData(playerName, bridgeUrl);
        if (data) {
          setPlayer(data);
        } else {
          setPlayer(null);
          setError("Spieler nicht gefunden.");
        }
        setLoading(false);
      } else {
        setPlayer(null);
        setSearchName('');
        setError(null);
      }
    };
    handlePlayerParam();
  }, [playerName]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchName.trim()) return;
    navigate(`/player/${searchName.trim()}`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-16 pb-20 pt-6 md:pt-16 px-4">
      {!player && (
        <div className="text-center space-y-6 mb-12 animate-in fade-in slide-in-from-top-10 duration-1000">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
            <Globe size={14} /> LIVE ECONOMY NETWORK
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-white mc-font tracking-tighter leading-none">
            VOIDNEST<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">BANKING</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto font-medium">
            Verwalte dein Vermögen, checke die Top-Spieler und behalte die gesamte Server-Wirtschaft im Blick.
          </p>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700 delay-200">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-[2.5rem] md:rounded-[4rem] blur-xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          <form onSubmit={handleSearch} className="relative">
            <div className="relative w-full">
              <input
                type="text"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="Minecraft Spielername..."
                className="w-full bg-slate-900/40 backdrop-blur-2xl border-2 border-white/5 focus:border-purple-500/40 rounded-[2.5rem] md:rounded-[4rem] pl-12 pr-4 md:pl-16 md:pr-56 py-7 md:py-10 text-xl md:text-3xl text-white outline-none transition-all mc-font shadow-2xl"
              />
              <Search className="absolute left-5 md:left-8 top-1/2 -translate-y-1/2 text-slate-500 w-6 h-6 md:w-8 md:h-8" />
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="mt-6 md:mt-0 md:absolute md:right-4 md:top-1/2 md:-translate-y-1/2 bg-white text-black hover:bg-purple-600 hover:text-white disabled:bg-slate-800 disabled:text-slate-600 px-10 md:px-14 py-5 md:py-7 rounded-[2rem] md:rounded-[3rem] font-black text-lg md:text-xl transition-all flex items-center justify-center gap-3 shadow-2xl active:scale-95 shiny-button"
            >
              {loading ? <RefreshCw className="animate-spin" size={24} /> : <Zap size={24} fill="currentColor" />}
              {loading ? "SCANNE..." : "ABFRAGEN"}
            </button>
          </form>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 p-6 rounded-[2.5rem] flex items-center gap-4 text-rose-400 animate-in bounce-in">
             <AlertCircle size={28} className="shrink-0" />
             <p className="font-bold text-base">{error}</p>
          </div>
        )}
      </div>

      {!player ? (
        <div className="grid md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          <div className="bg-slate-900/30 border border-white/5 p-8 rounded-[2.5rem] hover:bg-slate-900/50 transition-all group">
            <div className="w-14 h-14 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Activity size={28} />
            </div>
            <h3 className="text-white font-black text-xl mb-3 mc-font tracking-tight">Echtzeit Scan</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Direkter Datenbankzugriff auf die Economy-Struktur für 100% genaue Kontostände ohne Verzögerung.</p>
          </div>

          <div className="bg-slate-900/40 border-2 border-blue-500/20 p-8 rounded-[2.5rem] hover:bg-slate-900/60 transition-all group overflow-hidden relative shadow-2xl shadow-blue-500/5">
            <div className="w-14 h-14 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform relative z-10">
              <Database size={28} />
            </div>
            <h3 className="text-white font-black text-xl mb-3 mc-font tracking-tight relative z-10">Wirtschafts-Zentrale</h3>
            <div className="space-y-4 relative z-10">
               <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Geld im Umlauf</span>
                  {statsLoading ? (
                    <div className="h-7 w-32 bg-slate-800 rounded animate-pulse"></div>
                  ) : (
                    <span className="text-2xl font-black text-white mc-font drop-shadow-lg">
                      {globalStats?.totalBalance?.toLocaleString() || "Syncing..."} <span className="text-blue-500 text-sm">€</span>
                    </span>
                  )}
               </div>
               <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Bank-Konten</span>
                    {statsLoading ? (
                      <div className="h-5 w-12 bg-slate-800 rounded animate-pulse mt-1"></div>
                    ) : (
                      <span className="text-lg font-bold text-slate-200">{globalStats?.accountCount || "--"}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/10">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                    <span className="text-[10px] font-black text-blue-400 uppercase">LIVE</span>
                  </div>
               </div>
            </div>
          </div>

          <div className="bg-slate-900/30 border border-white/5 p-8 rounded-[2.5rem] hover:bg-slate-900/50 transition-all group">
            <div className="w-14 h-14 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Users size={28} />
            </div>
            <h3 className="text-white font-black text-xl mb-3 mc-font tracking-tight">Top Vermögende</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Vergleiche dich mit dem Geldadel des Voidnest-Systems und kämpfe um den Thron der Reichen.</p>
          </div>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000 max-w-4xl mx-auto">
           <div className="bg-slate-900/40 border border-white/5 p-8 md:p-14 rounded-[3.5rem] md:rounded-[5rem] relative overflow-hidden group glass-panel">
              <div className="absolute top-0 right-0 p-16 opacity-[0.03] group-hover:opacity-[0.1] transition-all duration-1000 pointer-events-none">
                 <Euro size={400} />
              </div>
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 mb-10 md:mb-14 relative z-10">
                <div className="shrink-0 relative">
                  <div className="absolute -inset-4 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                  <img src={`https://mc-heads.net/avatar/${player.username}/160`} className="w-24 h-24 md:w-44 md:h-44 bg-slate-950 rounded-[2.5rem] p-3 md:p-5 border-2 border-slate-800 relative z-10 shadow-2xl" alt={player.username}/>
                </div>
                <div className="text-center md:text-left min-w-0 flex-1">
                  <p className="text-purple-500 text-xs font-black uppercase tracking-[0.5em] mb-2">Spielerprofil</p>
                  <h2 className={`font-black text-white mc-font tracking-tighter mb-4 drop-shadow-2xl whitespace-nowrap overflow-hidden text-ellipsis ${getNameFontSizeClass(player.username)}`}>{player.username}</h2>
                  <div className="flex gap-3 justify-center md:justify-start flex-wrap">
                     <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase rounded-full border border-emerald-500/20 shadow-lg">Verified</span>
                     <span className="px-4 py-1.5 bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase rounded-full border border-blue-500/20 shadow-lg">{SERVER_NAME}</span>
                  </div>
                </div>
              </div>
              <div className="bg-white/5 p-8 md:p-14 rounded-[3rem] md:rounded-[4rem] border border-white/5 shadow-inner relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
                <p className="text-slate-500 text-[10px] mb-6 uppercase font-black tracking-[0.6em] ml-1 opacity-60">Aktuelles Vermögen</p>
                <div className="flex flex-row items-baseline gap-4 md:gap-8 w-full">
                  <span className={`font-black text-white leading-none tracking-tighter whitespace-nowrap overflow-hidden text-ellipsis ${getFontSizeClass(player.balance)}`}>{(player.balance ?? 0).toLocaleString()}</span>
                  <span className="text-amber-400 text-4xl md:text-8xl font-black uppercase mc-font tracking-widest shrink-0">€</span>
                </div>
              </div>
            </div>
        </div>
      )}

      {!player && (
         <div className="animate-in fade-in duration-1000 delay-500 pt-10">
           <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 px-2 gap-4">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-black text-white mc-font tracking-tight">REICHSTE SPIELER</h2>
                {isLiveLeaderboard && (
                  <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-wider border border-emerald-500/20">
                    <Radio size={10} className="animate-pulse" /> LIVE
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-600 text-[10px] font-black uppercase tracking-widest">{isLiveLeaderboard ? "Echtzeit Daten" : "Vorschau Modus"}</span>
                {leaderboardLoading ? <RefreshCw className="text-purple-500 animate-spin" size={20} /> : <TrendingUp className="text-purple-500" size={20} />}
              </div>
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {leaderboard.map((p: any, i: number) => (
                <Link 
                  to={`/player/${p.username}`} 
                  key={i} 
                  className="bg-slate-900/20 border border-white/5 p-5 rounded-2xl flex items-center gap-4 hover:border-purple-500/30 transition-all group overflow-hidden"
                >
                  <span className="text-slate-700 font-black mc-font text-lg shrink-0">{i+1}.</span>
                  <img src={`https://mc-heads.net/avatar/${p.username}/32`} className="w-10 h-10 rounded-lg shrink-0" alt={p.username} />
                  <div className="min-w-0 flex-1">
                    <p className="text-white font-bold text-sm truncate" title={p.username}>{p.username}</p>
                    <p className="text-amber-400/80 font-black text-[11px] truncate" title={`${p.balance.toLocaleString()} €`}>
                      {p.balance.toLocaleString()} <span className="text-[9px]">€</span>
                    </p>
                  </div>
                </Link>
              ))}
           </div>
         </div>
      )}

      <div className="flex justify-center pt-20">
          <button onClick={() => setShowBridgeModal(true)} className="p-4 text-slate-800 hover:text-purple-500 transition-all opacity-30 hover:opacity-100 flex items-center gap-2 group">
            <Settings size={20} className="group-hover:rotate-90 transition-transform duration-500" />
            <span className="text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Bridge Repair V2.2.1</span>
          </button>
      </div>
    </div>
  );
};

const App = () => {
  const navigate = useNavigate();
  const [showBridgeModal, setShowBridgeModal] = useState(false);
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  const copyToClipboard = async (text: string, fileName: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedFile(fileName);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  return (
    <Layout 
      onHomeClick={() => navigate('/')} 
      onAgbClick={() => navigate('/agb')} 
      onDatenschutzClick={() => navigate('/datenschutz')}
    >
      <Routes>
        <Route path="/" element={<Dashboard setShowBridgeModal={setShowBridgeModal} />} />
        <Route path="/player/:playerName" element={<Dashboard setShowBridgeModal={setShowBridgeModal} />} />
        <Route path="/agb" element={
          <div className="max-w-4xl mx-auto py-10 animate-in fade-in slide-in-from-bottom-4 duration-500 px-4">
              <Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-white mb-8 transition-colors group text-sm font-bold">
                <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Zurück zum Dashboard
              </Link>
              <div className="bg-[#0c0a15]/80 border border-white/5 rounded-[2.5rem] p-8 md:p-12 space-y-12 backdrop-blur-xl shadow-2xl">
                <div className="flex items-center gap-6 border-b border-white/5 pb-8">
                  <div className="p-4 bg-purple-500/10 rounded-2xl text-purple-400 shrink-0 shadow-[0_0_20px_rgba(168,85,247,0.15)]"><FileText size={40} /></div>
                  <h2 className="text-2xl md:text-5xl font-black text-white uppercase tracking-tighter mc-font">Allgemeine Geschäftsbedingungen</h2>
                </div>
                
                <div className="space-y-10 text-slate-300">
                  <section className="space-y-4">
                    <h3 className="text-white font-black text-xl flex items-center gap-3">1. Geltungsbereich</h3>
                    <p className="leading-relaxed text-slate-400">Diese AGB gelten für die Nutzung des Economy-Dashboards von Voidnest.de. Mit der Nutzung dieses Dienstes erklären Sie sich mit diesen Bedingungen einverstanden.</p>
                  </section>

                  <section className="space-y-4">
                    <h3 className="text-white font-black text-xl flex items-center gap-3">2. Virtuelle Währung</h3>
                    <p className="leading-relaxed text-slate-400">
                      Sämtliche auf dieser Webseite angezeigten Euro-Beträge (€) stellen rein <strong className="text-white">virtuelle Spielwährung</strong> innerhalb des Minecraft-Servers Voidnest.de dar. Diese Währung hat <strong className="text-white">keinen realen Gegenwert</strong> und kann weder ausgezahlt noch in gesetzliche Zahlungsmittel umgetauscht werden.
                    </p>
                  </section>

                  <section className="space-y-4">
                    <h3 className="text-white font-black text-xl flex items-center gap-3">3. Haftungsausschluss</h3>
                    <p className="leading-relaxed text-slate-400">Wir übernehmen keine Gewähr für die ständige Verfügbarkeit der Datenbrücke oder die absolute Richtigkeit der angezeigten Kontostände. Technische Fehler sind möglich.</p>
                  </section>

                  <section className="space-y-4">
                    <h3 className="text-white font-black text-xl flex items-center gap-3">4. Nutzung des Dienstes</h3>
                    <p className="leading-relaxed text-slate-400">Die automatisierte Abfrage von Daten über die für dieses Dashboard genutzten Schnittstellen ist ohne ausdrückliche Genehmigung untersagt.</p>
                  </section>
                </div>
              </div>
          </div>
        } />
        <Route path="/datenschutz" element={
          <div className="max-w-4xl mx-auto py-10 animate-in fade-in slide-in-from-bottom-4 duration-500 px-4">
              <Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-white mb-8 transition-colors group text-sm font-bold">
                <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Zurück zum Dashboard
              </Link>
              <div className="bg-[#0c0a15]/80 border border-white/5 rounded-[2.5rem] p-8 md:p-12 space-y-12 backdrop-blur-xl shadow-2xl">
                <div className="flex items-center gap-6 border-b border-white/5 pb-8">
                  <div className="p-4 bg-blue-500/10 rounded-2xl text-blue-400 shrink-0 shadow-[0_0_20px_rgba(59,130,246,0.15)]"><ShieldCheck size={40} /></div>
                  <h2 className="text-2xl md:text-5xl font-black text-white uppercase tracking-tighter mc-font">Datenschutzerklärung</h2>
                </div>

                <p className="text-slate-400 text-lg">Der Schutz Ihrer Daten ist uns wichtig. Hier erfahren Sie, welche Daten wir wie verarbeiten.</p>

                <div className="space-y-10 text-slate-300">
                  <section className="space-y-4">
                    <h3 className="text-white font-black text-xl flex items-center gap-3">1. Datenverarbeitung</h3>
                    <p className="leading-relaxed text-slate-400">Bei einer Abfrage wird der von Ihnen eingegebene Minecraft-Nutzername an unsere Datenbank-Bridge übermittelt, um den aktuellen Kontostand aus der Server-Datenbank von Voidnest.de abzurufen.</p>
                  </section>

                  <section className="space-y-4">
                    <h3 className="text-white font-black text-xl flex items-center gap-3">2. Sicherheit & Echtzeit-Zugriff</h3>
                    <p className="leading-relaxed text-slate-400">Der Zugriff auf die Spieldaten erfolgt über eine gesicherte Schnittstelle. Es findet keine dauerhafte Speicherung Ihrer Abfragedaten auf diesem Webserver statt; die Daten werden lediglich für die Dauer der Anzeige im Speicher Ihres Browsers gehalten.</p>
                  </section>

                  <section className="space-y-4">
                    <h3 className="text-white font-black text-xl flex items-center gap-3">3. Externe Dienste</h3>
                    <p className="leading-relaxed text-slate-400">Zur Darstellung der Spieler-Skins nutzen wir den Dienst <strong className="text-white">mc-heads.net</strong>. Dabei wird Ihr Minecraft-Nutzername an deren Server übertragen, um das Profilbild auszuliefern.</p>
                  </section>

                  <section className="space-y-4">
                    <h3 className="text-white font-black text-xl flex items-center gap-3">4. Lokale Speicherung</h3>
                    <p className="leading-relaxed text-slate-400">Dieses Dashboard verwendet keine Tracking-Cookies. Zur Verbesserung der Benutzerfreundlichkeit kann Ihr zuletzt gesuchter Spielername im lokalen Speicher Ihres Browsers (LocalStorage) abgelegt werden.</p>
                  </section>
                </div>
              </div>
          </div>
        } />
        <Route path="*" element={<Dashboard setShowBridgeModal={setShowBridgeModal} />} />
      </Routes>

      {showBridgeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-4xl rounded-[3rem] p-8 md:p-14 relative overflow-y-auto max-h-[90vh]">
            <button onClick={() => setShowBridgeModal(false)} className="absolute top-8 right-8 text-slate-500 hover:text-white"><X size={32}/></button>
            <h2 className="text-3xl font-black text-white mb-8 flex items-center gap-4"><Terminal className="text-blue-500"/> BRIDGE REPAIR V2.2.1</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
                <p className="text-white font-bold mb-4">server.js (Bridge)</p>
                <button onClick={() => copyToClipboard(BRIDGE_CODE, 'server.js')} className={`w-full py-4 rounded-xl font-black ${copiedFile === 'server.js' ? 'bg-emerald-500' : 'bg-white text-black'}`}>
                  {copiedFile === 'server.js' ? 'KOPIERT!' : 'CODE KOPIEREN'}
                </button>
              </div>
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
                <p className="text-white font-bold mb-4">package.json</p>
                <button onClick={() => copyToClipboard(PACKAGE_JSON_CODE, 'package.json')} className={`w-full py-4 rounded-xl font-black ${copiedFile === 'package.json' ? 'bg-emerald-500' : 'bg-white text-black'}`}>
                  {copiedFile === 'package.json' ? 'KOPIERT!' : 'JSON KOPIEREN'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
'use client';

import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import {
  SkipForward, ExternalLink, X, Loader2, ChevronLeft,
  ChevronRight, ChevronDown, Menu, Search, Globe
} from 'lucide-react';
import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { AREAS, getAllCities, getNearestCity, type Area, type Country, type City } from '@/lib/countryData';
import { type VideoResult, formatViewCount, formatDuration } from '@/lib/youtube';

const LOCALES = [
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
] as const;

const LeafletMapComponent = dynamic(() => import('@/components/LeafletMap'), { ssr: false });
const YouTubePlayerComponent = dynamic(() => import('@/components/YouTubePlayer'), { ssr: false });

type DrillLevel = 'area' | 'country' | 'video';

export default function Home() {
  const t = useTranslations('Index');

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedAreaId, setExpandedAreaId] = useState<string | null>(null);
  const [expandedCountryCode, setExpandedCountryCode] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [videoMode, setVideoMode] = useState<'vlog' | 'camp' | 'scenic'>('vlog');
  const searchRef = useRef<HTMLInputElement>(null);

  // Locale switching
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = pathname.split('/')[1] || 'en';
  const switchLocale = useCallback((locale: string) => {
    const segments = pathname.split('/');
    segments[1] = locale;
    router.push(segments.join('/') || `/${locale}`);
  }, [pathname, router]);

  // Drill-down map state
  const [drillLevel, setDrillLevel] = useState<DrillLevel>('area');
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  // Video state
  const [videos, setVideos] = useState<VideoResult[]>([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);

  // All cities flattened for search
  const allCities = useMemo(() => getAllCities(), []);

  const filteredCities = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return allCities.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.nameJa.includes(searchQuery) ||
      c.countryName.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [searchQuery, allCities]);

  // Close sidebar on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const sidebar = document.getElementById('vlog-sidebar');
      const toggle = document.getElementById('sidebar-toggle');
      if (sidebar && !sidebar.contains(e.target as Node) &&
        toggle && !toggle.contains(e.target as Node)) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // --- Map Drill-Down ---
  const handleCountryClick = useCallback((country: Country) => {
    setSelectedCountry(country);
    setExpandedCountryCode(country.code);
  }, []);

  const handleCityClick = useCallback(async (city: City, country: Country) => {
    setSelectedCity(city);
    setIsLoading(true);
    setDrillLevel('video');
    setSidebarOpen(false);
    setSearchQuery('');

    try {
      const params = new URLSearchParams({
        q: city.name,
        maxResults: '8',
        regionCode: country.regionCode,
        localKeywords: JSON.stringify(city.localKeywords),
        mode: videoMode,
      });
      const res = await fetch(`/api/youtube?${params}`);
      const data = await res.json();
      if (data.videos && data.videos.length > 0) {
        setVideos(data.videos);
        setCurrentVideoIndex(0);
        setShowPlayer(true);
      } else {
        // Show a brief notification when no videos found
        setDrillLevel('country');
        alert(data.error || `No videos found for ${city.name}. Try again later.`);
      }
    } catch (err) {
      console.error('Failed to fetch videos:', err);
      setDrillLevel('country');
      alert('Failed to connect to video server. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [videoMode]);

  // Sidebar area/country click also triggers map
  const handleSidebarAreaClick = useCallback((area: Area) => {
    setExpandedAreaId(prev => prev === area.id ? null : area.id);
    setSelectedArea(area);
    setSelectedCountry(null);
    setSelectedCity(null);
    setDrillLevel('country');
  }, []);

  const handleSidebarCountryClick = useCallback((country: Country) => {
    setExpandedCountryCode(prev => prev === country.code ? null : country.code);
    handleCountryClick(country);
  }, [handleCountryClick]);

  const handleSkip = useCallback(() => {
    if (currentVideoIndex < videos.length - 1) {
      setCurrentVideoIndex(prev => prev + 1);
    } else {
      setCurrentVideoIndex(0);
    }
  }, [currentVideoIndex, videos.length]);

  const handleClosePlayer = useCallback(() => {
    setShowPlayer(false);
    setVideos([]);
    setCurrentVideoIndex(0);
    setDrillLevel(selectedCountry ? 'country' : 'area');
  }, [selectedCountry]);

  // --- Map anywhere click: Nominatim geocode → YouTube → nearest city fallback ---
  const [mapClickLocation, setMapClickLocation] = useState<string | null>(null);

  const handleMapClick = useCallback(async (lat: number, lng: number) => {
    // Don't fire if player is open
    if (showPlayer) return;

    setIsLoading(true);
    setMapClickLocation(null);
    setSidebarOpen(false);

    try {
      // 1. Reverse geocode with Nominatim (OpenStreetMap, free)
      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=en`,
        { headers: { 'User-Agent': 'WorldVlogViewer/1.0' } }
      );
      const geo = await geoRes.json();

      const addr = geo.address ?? {};
      const cityName: string =
        addr.city || addr.town || addr.village ||
        addr.county || addr.state || geo.display_name?.split(',')[0] || 'Unknown';
      const countryCode: string = (addr.country_code ?? '').toUpperCase();

      setMapClickLocation(cityName);
      setSelectedCity({ name: cityName, nameJa: cityName, lat, lng, localKeywords: [] });
      setDrillLevel('video');

      // 2. Search YouTube for this place
      const params = new URLSearchParams({
        q: cityName,
        maxResults: '8',
        ...(countryCode && { regionCode: countryCode }),
        mode: videoMode,
      });
      const ytRes = await fetch(`/api/youtube?${params}`);
      const ytData = await ytRes.json();

      if (ytData.videos && ytData.videos.length > 0) {
        setVideos(ytData.videos);
        setCurrentVideoIndex(0);
        setShowPlayer(true);
        return;
      }

      // 3. Fallback: find nearest registered city
      const { city: nearestCity, country: nearestCountry } = getNearestCity(lat, lng);
      console.info(`No videos for "${cityName}", falling back to nearest city: ${nearestCity.name}`);
      await handleCityClick(nearestCity, nearestCountry);

    } catch (err) {
      console.error('Map click search failed:', err);
      // Fallback on error too
      try {
        const { city: nearestCity, country: nearestCountry } = getNearestCity(lat, lng);
        await handleCityClick(nearestCity, nearestCountry);
      } catch { /* nothing we can do */ }
    } finally {
      setIsLoading(false);
      setMapClickLocation(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoMode, showPlayer]);

  const currentVideo = videos[currentVideoIndex];

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#1a1108]">

      {/* ══ Leaflet Map (full background) ══ */}
      <LeafletMapComponent
        selectedArea={selectedArea}
        selectedCountry={selectedCountry}
        onCountryClick={handleCountryClick}
        onCityClick={handleCityClick}
        onMapClick={handleMapClick}
      />

      {/* ══ SIDEBAR TOGGLE BUTTON (left top) ══ */}
      <button
        id="sidebar-toggle"
        onClick={() => setSidebarOpen(v => !v)}
        className="absolute top-4 left-4 z-[2000] glass-panel p-2.5 md:p-3 rounded-xl shadow-2xl hover:bg-amber-900/30 transition-all"
        aria-label="メニューを開く"
      >
        <Menu size={20} className="text-amber-300" />
      </button>

      {/* ══ SIDEBAR DRAWER ══ */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            id="vlog-sidebar"
            key="sidebar"
            initial={{ x: -340 }}
            animate={{ x: 0 }}
            exit={{ x: -340 }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="absolute top-0 left-0 h-full w-[85vw] max-w-80 z-[1900] flex flex-col shadow-2xl"
            style={{ background: 'rgba(10,6,2,0.96)', borderRight: '1px solid rgba(200,160,80,0.18)' }}
          >
            {/* ── Header ── */}
            <div className="flex items-center justify-between px-5 pt-16 pb-3 border-b border-amber-900/30">
              <div className="flex items-center gap-2">
                <span className="text-amber-400 font-black italic tracking-tighter text-lg md:text-xl">WORLD VLOG</span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="text-amber-400/60 hover:text-amber-300 transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* ── Mode Selection ── */}
            <div className="px-5 pt-3 pb-2 flex gap-1.5">
              <button
                onClick={() => setVideoMode('vlog')}
                className={`flex-1 flex flex-col items-center justify-center py-2.5 rounded-xl border transition-all
                  ${videoMode === 'vlog'
                    ? 'bg-amber-700/30 border-amber-500/50 text-amber-200 shadow-inner'
                    : 'bg-white/5 border-white/10 text-amber-200/50 hover:bg-amber-900/20 hover:text-amber-200/80'
                  }`}
              >
                <span className="text-xl mb-1">📹</span>
                <span className="text-[10px] font-bold tracking-wider">VLOG</span>
              </button>

              <button
                onClick={() => setVideoMode('camp')}
                className={`flex-1 flex flex-col items-center justify-center py-2.5 rounded-xl border transition-all
                  ${videoMode === 'camp'
                    ? 'bg-orange-700/30 border-orange-500/50 text-orange-200 shadow-inner'
                    : 'bg-white/5 border-white/10 text-amber-200/50 hover:bg-amber-900/20 hover:text-amber-200/80'
                  }`}
              >
                <span className="text-xl mb-1">⛺</span>
                <span className="text-[10px] font-bold tracking-wider">CAMP</span>
              </button>

              <button
                onClick={() => setVideoMode('scenic')}
                className={`flex-1 flex flex-col items-center justify-center py-2.5 rounded-xl border transition-all
                  ${videoMode === 'scenic'
                    ? 'bg-sky-700/30 border-sky-500/50 text-sky-200 shadow-inner'
                    : 'bg-white/5 border-white/10 text-amber-200/50 hover:bg-amber-900/20 hover:text-amber-200/80'
                  }`}
              >
                <span className="text-xl mb-1">🚁</span>
                <span className="text-[10px] font-bold tracking-wider">SCENIC</span>
              </button>
            </div>

            {/* ── City Search ── */}
            <div className="px-5 pb-2">
              <div className="flex items-center gap-2 bg-white/5 border border-amber-900/30 rounded-xl px-3 py-2 focus-within:border-amber-600/50 transition-colors">
                <Search size={16} className="text-amber-400/50 shrink-0" />
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="都市を検索…"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-sm text-amber-100 placeholder:text-amber-400/30 outline-none"
                />
              </div>

              {/* Search results */}
              <AnimatePresence>
                {filteredCities.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="mt-1 rounded-xl overflow-hidden border border-amber-900/30"
                    style={{ background: 'rgba(20,12,4,0.97)' }}
                  >
                    {filteredCities.map(city => {
                      // find the country this city belongs to
                      const country = AREAS
                        .flatMap(a => a.countries)
                        .find(c => c.regionCode === city.regionCode && c.cities.some(ci => ci.name === city.name));
                      return (
                        <button
                          key={`${city.countryName}-${city.name}`}
                          onClick={() => country && handleCityClick(city, country)}
                          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-amber-900/20 transition-colors text-left border-b border-amber-900/20 last:border-0"
                        >
                          <span className="text-amber-400/60 text-lg leading-none">{city.countryFlag}</span>
                          <div>
                            <p className="text-amber-100 text-sm font-medium">{city.name}</p>
                            <p className="text-amber-400/50 text-xs">{city.nameJa} · {city.countryName}</p>
                          </div>
                          <ChevronRight size={14} className="ml-auto text-amber-500/40" />
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Area / Country / City Accordion ── */}
            <div className="flex-1 overflow-y-auto px-3 pb-4">
              <p className="px-3 mb-1 text-[10px] uppercase tracking-widest text-amber-400/40 font-semibold">エリアを選択</p>
              {AREAS.map(area => (
                <div key={area.id}>
                  {/* Area row */}
                  <button
                    onClick={() => handleSidebarAreaClick(area)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl mb-0.5 text-left transition-all
                                            ${expandedAreaId === area.id
                        ? 'bg-amber-900/30 text-amber-200'
                        : 'hover:bg-amber-900/15 text-amber-200/70'
                      }`}
                  >
                    <span className="text-lg shrink-0">{area.icon}</span>
                    <span className="text-sm font-semibold flex-1">{area.nameJa}</span>
                    <ChevronDown
                      size={14}
                      className={`text-amber-500/50 transition-transform duration-200 ${expandedAreaId === area.id ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {/* Country accordion */}
                  <AnimatePresence>
                    {expandedAreaId === area.id && (
                      <motion.div
                        key={area.id + '-countries'}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        className="overflow-hidden"
                      >
                        {area.countries.map(country => (
                          <div key={country.code} className="ml-4 border-l border-amber-900/25 pl-2 mb-0.5">
                            {/* Country row */}
                            <button
                              onClick={() => handleSidebarCountryClick(country)}
                              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left transition-all
                                                                ${expandedCountryCode === country.code
                                  ? 'bg-amber-800/25 text-amber-200'
                                  : 'hover:bg-amber-900/15 text-amber-300/70'
                                }`}
                            >
                              <span className="text-base shrink-0">{country.flag}</span>
                              <span className="text-sm flex-1">{country.name}</span>
                              <ChevronDown
                                size={12}
                                className={`text-amber-500/40 transition-transform duration-200 ${expandedCountryCode === country.code ? 'rotate-180' : ''}`}
                              />
                            </button>

                            {/* City rows */}
                            <AnimatePresence>
                              {expandedCountryCode === country.code && (
                                <motion.div
                                  key={country.code + '-cities'}
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.18 }}
                                  className="overflow-hidden"
                                >
                                  {country.cities.map(city => (
                                    <button
                                      key={city.name}
                                      onClick={() => handleCityClick(city, country)}
                                      className="w-full flex items-center gap-2 px-4 py-1.5 rounded-lg text-left hover:bg-amber-700/20 transition-colors group"
                                    >
                                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600/60 shrink-0 group-hover:bg-amber-400 transition-colors" />
                                      <span className="text-xs text-amber-200/60 group-hover:text-amber-200 transition-colors flex-1">{city.name}</span>
                                      <span className="text-[10px] text-amber-400/30">{city.nameJa}</span>
                                    </button>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* ── Language Switcher ── */}
            <div className="px-5 pt-3 pb-10 border-t border-amber-900/30 shrink-0">
              <div className="flex items-center gap-1.5 mb-2">
                <Globe size={12} className="text-amber-400/50" />
                <p className="text-[10px] uppercase tracking-widest text-amber-400/40 font-semibold">言語 / Language</p>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {LOCALES.map(locale => (
                  <button
                    key={locale.code}
                    onClick={() => switchLocale(locale.code)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all
                      ${currentLocale === locale.code
                        ? 'bg-amber-700/40 border border-amber-500/50 text-amber-200 font-semibold'
                        : 'bg-white/5 border border-transparent text-amber-200/50 hover:bg-amber-900/20 hover:text-amber-200/80'
                      }`}
                  >
                    <span className="text-sm leading-none">{locale.flag}</span>
                    <span className="truncate">{locale.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ══ TOP-RIGHT: Breadcrumb / Back ══ */}
      <AnimatePresence>
        {drillLevel !== 'area' && !showPlayer && (
          <motion.button
            key="breadcrumb"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onClick={() => {
              setDrillLevel('area');
              setSelectedArea(null);
              setSelectedCountry(null);
              setSelectedCity(null);
            }}
            className="absolute top-5 right-5 z-[1900] glass-panel px-4 py-2 rounded-xl flex items-center gap-2 text-sm shadow-xl hover:bg-amber-900/20 transition-colors"
          >
            <ChevronLeft size={15} className="text-amber-400" />
            <span className="text-amber-200/80">
              {selectedArea?.nameJa}
              {selectedCountry && ` › ${selectedCountry.flag} ${selectedCountry.name}`}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ══ BRAND TEXT (bottom right) ══ */}
      <div className="absolute bottom-6 right-8 text-amber-100/8 pointer-events-none z-10">
        <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter">WORLD VLOG</h1>
      </div>

      {/* ══ LOADING OVERLAY ══ */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[1800] flex items-center justify-center bg-black/70 backdrop-blur-sm"
          >
            <div className="flex flex-col items-center gap-4">
              <Loader2 size={48} className="text-amber-400 animate-spin" />
              <p className="text-lg font-light tracking-widest text-amber-200/70">{selectedCity?.name}</p>
              <p className="text-xs text-amber-500/50">
                {videoMode === 'scenic' ? '🚁 絶景動画を検索中…' :
                  videoMode === 'camp' ? '⛺ キャンプ動画を検索中…' :
                    '📹 Vlog を検索中…'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ VIDEO PLAYER OVERLAY ══ */}
      <AnimatePresence>
        {showPlayer && currentVideo && (
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute inset-0 z-[1700] flex items-center justify-center p-3 md:p-12"
          >
            <div className="relative w-full h-full max-w-6xl glass-panel rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.7)] border border-amber-900/30 flex flex-col">
              {/* Close */}
              <button
                onClick={handleClosePlayer}
                className="absolute top-4 right-4 z-50 p-2 glass-panel rounded-full hover:bg-white/20 transition-colors"
              >
                <X size={20} />
              </button>

              {/* Mode badge */}
              <div className="absolute top-4 left-4 z-50 flex items-center gap-2">
                <span className="glass-panel px-3 py-1 rounded-full text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                  {videoMode === 'scenic' ? '🚁 Scenic Mode' :
                    videoMode === 'camp' ? '⛺ Camp Mode' :
                      '📹 Vlog Mode'}
                </span>
                {selectedCity && (
                  <span className="glass-panel px-3 py-1 rounded-full text-xs text-amber-200/60">
                    📍 {selectedCity.nameJa}
                  </span>
                )}
              </div>

              {/* Player */}
              <div className="relative w-full flex-1 min-h-0 bg-black group">
                <YouTubePlayerComponent
                  videoId={currentVideo.id}
                  onEnded={handleSkip}
                />

                {/* Bottom controls */}
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-end justify-between translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="space-y-1 max-w-[60%]">
                    <h2 className="text-lg md:text-2xl font-semibold tracking-tight text-white line-clamp-2">
                      {currentVideo.title}
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-white/60 flex-wrap">
                      <span>{currentVideo.channelTitle}</span>
                      <span className="w-1 h-1 rounded-full bg-white/30" />
                      <span>👁 {formatViewCount(currentVideo.viewCount)}</span>
                      <span className="w-1 h-1 rounded-full bg-white/30" />
                      <span>⏱ {formatDuration(currentVideo.durationSeconds)}</span>
                      <span className="w-1 h-1 rounded-full bg-white/30" />
                      <span className="text-xs">{currentVideoIndex + 1} / {videos.length}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <a
                      href={`https://www.youtube.com/channel/${currentVideo.channelId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 transition-all text-sm font-medium backdrop-blur-md text-white"
                    >
                      <ExternalLink size={16} />
                      <span className="hidden md:inline">{t('channel_link')}</span>
                    </a>
                    <button
                      onClick={handleSkip}
                      className="flex items-center gap-2 px-5 md:px-8 py-2 md:py-3 rounded-full bg-amber-600 hover:bg-amber-500 text-white transition-all text-sm font-semibold shadow-lg shadow-amber-900/40"
                    >
                      <SkipForward size={16} fill="currentColor" />
                      {t('skip_button')}
                    </button>
                  </div>
                </div>
              </div>

              {/* Affiliate Link Reservation Area */}
              <div className="w-full h-20 md:h-24 bg-neutral-900 border-t border-white/10 flex items-center justify-center p-4">
                <div className="text-center">
                  <span className="text-sm md:text-base font-medium text-white/40 mb-1 block">
                    {/* Placeholder for future Affiliate links (e.g. Booking.com, Amazon) */}
                    ✨ {videoMode === 'camp' ? 'Check out gear used in this video' : `Find the best hotels in ${selectedCity?.nameJa}`}
                  </span>
                  <div className="w-48 h-2 bg-white/5 rounded-full mx-auto" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

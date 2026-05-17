import React, { useRef, useState, useEffect } from "react";
import { X, Camera, Sparkles, RefreshCcw, Check, Music, Search } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface CreateStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStory: (image: string, songName?: string, artistName?: string) => void;
}

const FILTERS = [
  { name: "Normal", class: "filter-none" },
  { name: "Vintage", class: "sepia(0.5) contrast(1.2)" },
  { name: "Noir", class: "grayscale(1) contrast(1.1)" },
  { name: "Warm", class: "sepia(0.3) saturate(1.5) brightness(1.1)" },
  { name: "Cool", class: "hue-rotate(30deg) saturate(1.2)" },
  { name: "Vivid", class: "saturate(2) contrast(1.1)" },
];

const MOCK_TRACKS = [
  { id: 1, name: "Sunset Vibes", artist: "Chill Master" },
  { id: 2, name: "City Lights", artist: "Midnight Pulse" },
  { id: 3, name: "Aura Flow", artist: "Zenith" },
  { id: 4, name: "Electric Dreams", artist: "Cyber Soul" },
  { id: 5, name: "Summer Rain", artist: "Acoustic Waves" },
  { id: 6, name: "Vibe Check", artist: "The Groovers" },
];

export default function CreateStoryModal({ isOpen, onClose, onAddStory }: CreateStoryModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState(FILTERS[0]);
  const [musicSearchQuery, setMusicSearchQuery] = useState("");
  const [musicResults, setMusicResults] = useState<any[]>(MOCK_TRACKS);
  const [isSearchingMusic, setIsSearchingMusic] = useState(false);
  const [selectedSong, setSelectedSong] = useState<any | null>(null);
  const [isMusicPickerOpen, setIsMusicPickerOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (musicSearchQuery.trim().length > 2) {
      const timer = setTimeout(() => {
        searchMusic(musicSearchQuery);
      }, 500);
      return () => clearTimeout(timer);
    } else if (musicSearchQuery.trim() === "") {
      setMusicResults(MOCK_TRACKS);
    }
  }, [musicSearchQuery]);

  const searchMusic = async (query: string) => {
    setIsSearchingMusic(true);
    try {
      const res = await fetch("/api/gemini/search-music", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      if (data.tracks) {
        setMusicResults(data.tracks);
      }
    } catch (err) {
      console.error("Music search failed:", err);
    } finally {
      setIsSearchingMusic(false);
    }
  };

  useEffect(() => {
    if (isOpen && !capturedImage) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, capturedImage]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user", width: { ideal: 1080 }, height: { ideal: 1920 } }, 
        audio: false 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setError(null);
    } catch (err) {
      console.error("Camera error:", err);
      setError("Unable to access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Apply filter to canvas context before drawing
        context.filter = activeFilter.class;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageData = canvas.toDataURL("image/jpeg");
        setCapturedImage(imageData);
        stopCamera();
      }
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setSelectedSong(null);
    startCamera();
  };

  const handleDone = () => {
    if (capturedImage) {
      onAddStory(capturedImage, selectedSong?.name, selectedSong?.artist);
      onClose();
      setCapturedImage(null);
      setSelectedSong(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] bg-black flex flex-col items-center justify-center">
      {/* Top Controls */}
      <div className="absolute top-6 left-0 right-0 px-6 flex items-center justify-between z-50">
        <div className="flex items-center gap-4">
          {capturedImage && (
            <button 
              onClick={() => setIsMusicPickerOpen(true)}
              className={`p-2 rounded-full transition-colors ${selectedSong ? 'bg-blue-500 text-white' : 'text-white hover:bg-white/10'}`}
            >
              <Music size={24} />
            </button>
          )}
        </div>
        <button 
          onClick={onClose}
          className="p-2 text-white hover:bg-white/10 rounded-full transition-colors"
        >
          <X size={28} />
        </button>
      </div>

      <div className="relative w-full max-w-[450px] aspect-[9/16] bg-[#121212] overflow-hidden md:rounded-2xl shadow-2xl flex items-center justify-center">
        {!capturedImage ? (
          <>
            {error ? (
              <div className="p-8 text-center space-y-4">
                <p className="text-white/60">{error}</p>
                <button 
                  onClick={startCamera}
                  className="px-6 py-2 bg-white text-black rounded-lg font-bold"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <>
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted
                  style={{ filter: activeFilter.class }}
                  className="w-full h-full object-cover scale-x-[-1]"
                />
                
                <div className="absolute inset-x-0 bottom-32 flex justify-center gap-4 px-4 overflow-x-auto no-scrollbar py-4">
                  {FILTERS.map((f) => (
                    <button
                      key={f.name}
                      onClick={() => setActiveFilter(f)}
                      className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                        activeFilter.name === f.name 
                          ? 'bg-white text-black' 
                          : 'bg-black/40 text-white border border-white/20 hover:bg-black/60'
                      }`}
                    >
                      {f.name}
                    </button>
                  ))}
                </div>

                <div className="absolute bottom-10 inset-x-0 flex items-center justify-center">
                  <button 
                    onClick={capturePhoto}
                    className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center p-1 group"
                  >
                    <div className="w-full h-full rounded-full bg-white group-active:scale-95 transition-transform" />
                  </button>
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full relative">
            <img 
              src={capturedImage} 
              alt="Captured Story" 
              className="w-full h-full object-cover scale-x-[-1]"
            />

            <AnimatePresence>
              {selectedSong && !isMusicPickerOpen && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 20 }}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md rounded-xl p-4 flex items-center gap-3 border border-white/30 shadow-xl min-w-[200px]"
                >
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white">
                    <Music size={20} />
                  </div>
                  <div>
                    <h3 className="text-white text-sm font-bold truncate max-w-[150px]">{selectedSong.name}</h3>
                    <p className="text-white/60 text-xs truncate max-w-[150px]">{selectedSong.artist}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedSong(null)}
                    className="p-1 hover:bg-black/20 rounded-full ml-auto text-white"
                  >
                    <X size={14} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="absolute bottom-10 inset-x-0 flex items-center justify-between px-10">
              <button 
                onClick={handleRetake}
                className="flex flex-col items-center gap-2 text-white group"
              >
                <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  <RefreshCcw size={24} />
                </div>
                <span className="text-xs font-bold">Retake</span>
              </button>

              <button 
                onClick={handleDone}
                className="flex flex-col items-center gap-2 text-white group"
              >
                <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center group-hover:bg-blue-600 transition-colors shadow-lg">
                  <Check size={32} />
                </div>
                <span className="text-xs font-bold tracking-wider">SHARE STORY</span>
              </button>
            </div>
          </div>
        )}

        {/* Music Picker Overlay */}
        <AnimatePresence>
          {isMusicPickerOpen && (
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="absolute inset-x-0 bottom-0 top-0 bg-black/95 z-[60] flex flex-col"
            >
              <div className="p-6 flex items-center justify-between">
                <h2 className="text-white font-bold text-lg">Music</h2>
                <button onClick={() => setIsMusicPickerOpen(false)} className="text-white">
                  <X size={24} />
                </button>
              </div>

              <div className="px-6 mb-6">
                <div className="relative">
                  {isSearchingMusic ? (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      >
                        <RefreshCcw size={18} className="text-blue-500" />
                      </motion.div>
                    </div>
                  ) : (
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                  )}
                  <input 
                    type="text" 
                    placeholder="Search songs..." 
                    value={musicSearchQuery}
                    onChange={(e) => setMusicSearchQuery(e.target.value)}
                    className="w-full bg-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-6 space-y-4 pb-10">
                {musicResults.map((track) => (
                  <button 
                    key={track.id}
                    onClick={() => {
                      setSelectedSong(track);
                      setIsMusicPickerOpen(false);
                      setMusicSearchQuery("");
                    }}
                    className="w-full flex items-center gap-4 hover:bg-white/5 p-2 rounded-xl transition-colors group text-left"
                  >
                    <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center text-white group-hover:bg-blue-500/20 transition-colors">
                      <Music size={20} />
                    </div>
                    <div>
                      <h4 className="text-white text-sm font-bold">{track.name}</h4>
                      <p className="text-white/40 text-xs">{track.artist}</p>
                    </div>
                    {selectedSong?.id === track.id && (
                      <Check className="ml-auto text-blue-500" size={20} />
                    )}
                  </button>
                ))}
                {musicResults.length === 0 && !isSearchingMusic && (
                  <div className="text-center py-10">
                    <p className="text-white/40 text-sm">No songs found. Try a different search!</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <canvas ref={canvasRef} className="hidden" />
      
      {/* Background Decor */}
      <div className="hidden md:block absolute inset-0 -z-10 bg-gradient-to-br from-indigo-900/20 via-black to-purple-900/20" />
    </div>
  );
}

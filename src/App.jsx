import React, { useState, useEffect } from 'react';
import { Swords, Clock, BarChart2, Key, ChevronRight, Play, LogOut, ShieldCheck, Eye, Square } from 'lucide-react';
import { registerPlugin } from '@capacitor/core';

const TomBot = registerPlugin('TomBot');

export default function App() {
  const [activeTab, setActiveTab] = useState('farm');
  const [mode, setMode] = useState(() => localStorage.getItem('tom_bot_mode') || 'Ranked');
  const [timer, setTimer] = useState('15m');
  const [showStats, setShowStats] = useState(false);
  
  // شروط تفعيل النافذة العائمة
  const [accessEnabled, setAccessEnabled] = useState(false);
  const [captureEnabled, setCaptureEnabled] = useState(false);
  const [isBotRunning, setIsBotRunning] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const expiry = localStorage.getItem('tom_bot_expiry');
    return expiry && parseInt(expiry) > Date.now();
  });
  const [inputKey, setInputKey] = useState('');
  const [timeLeft, setTimeLeft] = useState('00 : 00 : 00 : 00');
  
  const SECRET_KEY = "TOM-BOT-2026";

  useEffect(() => {
    let interval = null;
    if (isAuthenticated) {
      const expiry = parseInt(localStorage.getItem('tom_bot_expiry'));
      interval = setInterval(() => {
        const now = Date.now();
        const diff = expiry - now;
        if (diff <= 0) {
          localStorage.removeItem('tom_bot_expiry');
          setIsAuthenticated(false);
          clearInterval(interval);
        } else {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((diff / 1000 / 60) % 60);
          const seconds = Math.floor((diff / 1000) % 60);
          setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const handleLogin = () => {
    if (inputKey === SECRET_KEY) {
      const thirtyDays = 30 * 24 * 60 * 60 * 1000;
      const expiry = Date.now() + thirtyDays;
      localStorage.setItem('tom_bot_expiry', expiry.toString());
      setIsAuthenticated(true);
    } else {
      alert('المفتاح غلط!');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('tom_bot_expiry');
    setIsAuthenticated(false);
  };

  const handleStartBot = async () => {
    try {
      await TomBot.performClick({ x: 500, y: 500 });
      alert('تم إرسال أمر الضغط بنجاح!');
    } catch (error) {
      alert('خطأ: ' + error.message);
    }
  };

  const openAccessibility = async () => {
    try { 
      await TomBot.openAccessibilitySettings(); 
      setAccessEnabled(true); // تعليم إنه تفعل
    } catch (error) { alert(error.message); }
  };

  const requestCapture = async () => {
    try { 
      await TomBot.requestScreenCapture(); 
      setCaptureEnabled(true); // تعليم إنه تفعل
    } catch (error) { alert(error.message); }
  };

  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [rel, setRel] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const handleModeClick = () => {
    const newMode = mode === 'Ranked' ? 'Bloody soon' : 'Ranked';
    setMode(newMode);
    localStorage.setItem('tom_bot_mode', newMode);
  };

  const handlePointerDown = (e) => {
    setDragging(true);
    setRel({ x: e.clientX - pos.x, y: e.clientY - pos.y });
    setStartPos({ x: e.clientX, y: e.clientY });
    e.preventDefault();
  };

  const handlePointerMove = (e) => {
    if (!dragging) return;
    setPos({ x: e.clientX - rel.x, y: e.clientY - rel.y });
    e.preventDefault();
  };

  const handlePointerUp = (e) => {
    setDragging(false);
    const distance = Math.hypot(e.clientX - startPos.x, e.clientY - startPos.y);
    if (distance < 10) {
      toggleBot();
    }
  };

  const toggleBot = async () => {
    const newState = !isBotRunning;
    setIsBotRunning(newState);
    try {
      if (newState) { await TomBot.startBot(); } 
      else { await TomBot.stopBot(); }
    } catch (error) { console.log(error); }
  };

  const farmItems = [
    { name: 'Wood', img: '/images/new4230-stat_wood_cutout.png' }, 
    { name: 'Stone', img: '/images/new4172-stat_stone_cutout.png' },
    { name: 'Iron', img: '/images/new4098-stat_iron_cutout.png' }, 
    { name: 'Sulfur', img: '/images/new4200-stat_sulfure_cutout.png' },
    { name: 'Steel', img: '/images/new4137-stat_steel_cutout.png' }, 
    { name: 'Cloth', img: '/images/new4026-stat_cloth_cutout.png' },
    { name: 'Crude', img: '/images/new4047-stat_crude_cutout.png' }, 
    { name: 'Fuel', img: '/images/new4072-stat_fuel_cutout.png' }
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0A0B0E] text-white flex flex-col items-center justify-center p-6 font-sans">
        <div className="w-full max-w-sm flex flex-col items-center">
            <h1 className="text-5xl font-extrabold mb-12 tracking-wide text-white">TOM bot</h1>
            <input type="text" placeholder="Enter Key" value={inputKey} onChange={(e) => setInputKey(e.target.value)} className="w-full bg-[#1A1D24] border border-gray-600 rounded-2xl px-6 py-4 text-center text-xl outline-none focus:border-[#00FF41] mb-6" />
            <button onClick={handleLogin} className="w-full bg-[#0A2C1B] border border-[#00FF41] text-white font-bold text-xl py-4 rounded-2xl">Enter</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#12141A] text-white flex flex-col justify-between font-sans relative overflow-hidden">
      <div className="p-6 pt-16 flex-1">
        {activeTab === 'farm' ? (
          <div className="flex flex-col items-center">
            <h1 className="text-4xl font-extrabold mb-12 tracking-wide">TOM bot</h1>
            <div className="w-full space-y-4 max-w-md">
              
              <div onClick={handleModeClick} className="flex items-center justify-between bg-[#232733] h-[65px] rounded-full px-6 cursor-pointer active:scale-95 transition-transform">
                <div className="flex items-center gap-4"><Swords className="w-6 h-6" /><span className="text-lg">Mode</span></div>
                <div className="flex items-center gap-2">
                  <div className={`px-4 py-2 rounded-full font-bold text-center ${mode === 'Bloody soon' ? 'bg-red-900/50 text-red-200 min-w-[120px]' : 'bg-[#16181F] min-w-[100px]'}`}>{mode}</div>
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>

              <div className="flex items-center justify-between bg-[#232733] h-[65px] rounded-full px-6">
                <div className="flex items-center gap-4"><Clock className="w-6 h-6" /><span className="text-lg">Timer</span></div>
                <input type="text" value={timer} onChange={(e) => setTimer(e.target.value)} className="bg-[#16181F] px-4 py-2 rounded-full font-bold text-center w-24 outline-none text-white" />
              </div>

              {/* زر الإحصائيات - شغال طبيعي */}
              <div onClick={() => setShowStats(true)} className="flex items-center justify-between bg-[#232733] h-[65px] rounded-full px-6 cursor-pointer active:scale-95 transition-transform">
                <div className="flex items-center gap-4"><BarChart2 className="w-6 h-6" /><span className="text-lg">Statistics</span></div>
                <ChevronRight className="w-5 h-5" />
              </div>

              <div onClick={openAccessibility} className="flex items-center justify-between bg-[#232733] h-[65px] rounded-full px-6 cursor-pointer active:scale-95 transition-transform">
                <div className="flex items-center gap-4"><ShieldCheck className="w-6 h-6 text-[#00FF41]" /><span className="text-lg">Accessibility</span></div>
                <ChevronRight className="w-5 h-5" />
              </div>

              <div onClick={requestCapture} className="flex items-center justify-between bg-[#232733] h-[65px] rounded-full px-6 cursor-pointer active:scale-95 transition-transform">
                <div className="flex items-center gap-4"><Eye className="w-6 h-6 text-[#00FF41]" /><span className="text-lg">Screen Capture</span></div>
                <ChevronRight className="w-5 h-5" />
              </div>

              <div onClick={handleStartBot} className="flex items-center justify-center bg-[#0A2C1B] border border-[#00FF41] h-[65px] rounded-full px-6 cursor-pointer active:scale-95 transition-transform mt-2 relative">
                <div className="absolute left-3 w-12 h-12 bg-[#122E1F] rounded-full flex items-center justify-center"><Play className="w-5 h-5 text-[#00FF41] fill-[#00FF41] ml-1" /></div>
                <span className="text-2xl font-bold text-white w-full text-center tracking-wide">Start</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col max-w-md mx-auto w-full relative">
            <div className="flex justify-between items-center mb-16">
                <h1 className="text-4xl font-extrabold">TOM bot</h1>
                <button onClick={handleLogout} className="bg-red-900/30 p-3 rounded-full"><LogOut className="w-5 h-5 text-red-400" /></button>
            </div>
            <p className="text-center text-xl text-gray-300 mb-8">Welcome</p>
            <div className="flex items-center bg-[#232733] h-[75px] rounded-full px-6">
              <Key className="w-6 h-6 text-[#00FF41]" /><div className="w-[1px] h-8 bg-gray-500 mx-4"></div>
              <span className="text-lg">Key time</span><span className="mr-auto text-lg font-bold text-[#00FF41]">{timeLeft}</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-center bg-[#232733] h-[65px] rounded-full max-w-md mx-auto">
          <button onClick={() => setActiveTab('farm')} className={`flex-1 text-center text-lg ${activeTab === 'farm' ? 'font-bold text-white' : 'text-gray-400'}`}>Farm</button>
          <div className="w-[1px] h-8 bg-gray-600"></div>
          <button onClick={() => setActiveTab('home')} className={`flex-1 text-center text-lg ${activeTab === 'home' ? 'font-bold text-white' : 'text-gray-400'}`}>Home</button>
        </div>
      </div>

      {/* نافذة الإحصائيات (رجعناها مثل أول) */}
      {showStats && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#0A1A13] border-2 border-[#00FF41] rounded-2xl w-full max-w-[320px] p-4 relative">
            <h2 className="text-2xl font-bold text-center mb-4">Farm Stats</h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-6">
              {farmItems.map((item, index) => (
                <div key={index} className="flex items-center gap-2 border-b border-gray-600/50 pb-1">
                  <img src={item.img} alt={item.name} style={{ width: '48px', height: '48px' }} className="object-contain drop-shadow-md" />
                  <span className="text-lg font-bold">0</span>
                </div>
              ))}
            </div>
            <button onClick={() => setShowStats(false)} className="w-full bg-[#E5E7EB] text-black font-bold text-lg py-2 rounded-lg">Close</button>
          </div>
        </div>
      )}

      {/* النافذة العائمة الشفافة 35x35 (تطلع بس إذا الصلاحيتين مفعله) */}
      {accessEnabled && captureEnabled && (
        <div
          style={{ transform: `translate(${pos.x}px, ${pos.y}px)`, touchAction: 'none', width: '35px', height: '35px' }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className={`absolute top-1/2 left-1/2 -ml-4 -mt-4 rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing shadow-2xl z-50 border transition-all duration-300 ${
            isBotRunning 
              ? 'bg-red-600/80 border-red-500 shadow-[0_0_15px_rgba(255,0,0,0.8)] backdrop-blur-sm' 
              : 'bg-black/30 backdrop-blur-md border-[#00FF41] shadow-[0_0_15px_rgba(0,255,65,0.5)]'
          }`}
        >
           {isBotRunning ? (
             <Square className="w-4 h-4 text-white fill-white" />
           ) : (
             <Play className="w-4 h-4 text-[#00FF41] fill-[#00FF41] ml-0.5" />
           )}
        </div>
      )}
    </div>
  );
}

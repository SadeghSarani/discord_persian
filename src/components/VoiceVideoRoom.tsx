'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  PhoneOff,
  Users,
  Sparkles,
  Maximize2,
  Minimize2,
  Wifi,
  Radio,
  Gamepad2,
  RotateCcw,
} from 'lucide-react';
import { Channel, User } from '@/types/discord';
import { GamerAvatar } from '@/components/GamerAvatar';
import confetti from 'canvas-confetti';

interface VoiceVideoRoomProps {
  channel: Channel;
  currentUser: User;
  connectedUsers: User[];
  isMuted: boolean;
  onToggleMute: () => void;
  onDisconnect: () => void;
}

export const VoiceVideoRoom: React.FC<VoiceVideoRoomProps> = ({
  channel,
  currentUser,
  connectedUsers,
  isMuted,
  onToggleMute,
  onDisconnect,
}) => {
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeSpeaker, setActiveSpeaker] = useState<string>(currentUser.id);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [isVirtualCam, setIsVirtualCam] = useState(false);

  // Group Mini-Game State
  const [showGameActivity, setShowGameActivity] = useState(false);
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [gameWinner, setGameWinner] = useState<string | null>(null);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const screenVideoRef = useRef<HTMLVideoElement | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const screenAnimRef = useRef<number | null>(null);

  // Audio Voice Level Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const candidates = [currentUser.id, 'user_1', 'user_2', 'user_3'];
      const randomSpeaker = candidates[Math.floor(Math.random() * candidates.length)];
      setActiveSpeaker(randomSpeaker);
    }, 4000);
    return () => clearInterval(interval);
  }, [currentUser.id]);

  // Tic-Tac-Toe Co-op logic
  const handleCellClick = (index: number) => {
    if (board[index] || gameWinner) return;
    const nextBoard = [...board];
    nextBoard[index] = isXNext ? '❌' : '⭕';
    setBoard(nextBoard);
    setIsXNext(!isXNext);

    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];
    for (const [a, b, c] of lines) {
      if (nextBoard[a] && nextBoard[a] === nextBoard[b] && nextBoard[a] === nextBoard[c]) {
        setGameWinner(nextBoard[a] === '❌' ? `${currentUser.name} برنده شد! 🎉` : 'آرش شب‌نورد برنده شد! 🏆');
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
        return;
      }
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setGameWinner(null);
  };

  // Fallback Animated Camera Generator
  const createVirtualCameraStream = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    let hue = 0;
    const draw = () => {
      hue = (hue + 1) % 360;
      const grad = ctx.createLinearGradient(0, 0, 640, 480);
      grad.addColorStop(0, '#090a14');
      grad.addColorStop(0.5, '#121427');
      grad.addColorStop(1, '#0c0d18');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 640, 480);

      ctx.save();
      ctx.beginPath();
      ctx.arc(320, 200, 78, 0, Math.PI * 2);
      ctx.fillStyle = `hsl(${hue}, 80%, 55%)`;
      ctx.shadowColor = `hsl(${hue}, 80%, 55%)`;
      ctx.shadowBlur = 30;
      ctx.fill();
      ctx.lineWidth = 6;
      ctx.strokeStyle = '#10b981';
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 50px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🎮', 320, 200);
      ctx.restore();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${currentUser.name} (استریم زنده)`, 320, 315);

      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText('● 1080p 60FPS • پینگ عالی', 320, 350);

      animFrameIdRef.current = requestAnimationFrame(draw);
    };
    draw();

    return canvas.captureStream(30);
  };

  // Fallback Screen Share Stream
  const createVirtualScreenStream = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    let posX = 100;
    let posY = 200;
    let dx = 4;
    let dy = 3;
    let angle = 0;

    const draw = () => {
      angle += 0.02;
      ctx.fillStyle = '#080910';
      ctx.fillRect(0, 0, 1280, 720);

      ctx.strokeStyle = 'rgba(16, 185, 129, 0.2)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(640, 360, 250, 0, Math.PI * 2);
      ctx.stroke();

      posX += dx;
      posY += dy;
      if (posX <= 60 || posX >= 1220) dx = -dx;
      if (posY <= 60 || posY >= 660) dy = -dy;

      ctx.save();
      ctx.translate(posX, posY);
      ctx.rotate(angle);
      ctx.fillStyle = '#6366f1';
      ctx.shadowColor = '#818cf8';
      ctx.shadowBlur = 25;
      ctx.fillRect(-40, -40, 80, 80);
      ctx.restore();

      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 28px sans-serif';
      ctx.fillText('🔴 LIVE STREAM: Warzone 3.0 Gameplay (Screen Share)', 60, 70);

      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText('FPS: 165 | PING: 28ms | GPU: RTX 4090', 60, 110);

      screenAnimRef.current = requestAnimationFrame(draw);
    };
    draw();

    return canvas.captureStream(30);
  };

  const toggleCamera = async () => {
    if (isVideoOn) {
      if (stream) stream.getTracks().forEach((track) => track.stop());
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      setStream(null);
      setIsVideoOn(false);
      setIsVirtualCam(false);
    } else {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        setStream(mediaStream);
        setIsVideoOn(true);
        setIsVirtualCam(false);
        if (localVideoRef.current) localVideoRef.current.srcObject = mediaStream;
      } catch (err) {
        const virtualStream = createVirtualCameraStream();
        if (virtualStream) {
          setStream(virtualStream);
          setIsVideoOn(true);
          setIsVirtualCam(true);
          if (localVideoRef.current) localVideoRef.current.srcObject = virtualStream;
        }
      }
    }
  };

  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      if (screenStream) screenStream.getTracks().forEach((track) => track.stop());
      if (screenAnimRef.current) cancelAnimationFrame(screenAnimRef.current);
      setScreenStream(null);
      setIsScreenSharing(false);
    } else {
      try {
        const sStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        setScreenStream(sStream);
        setIsScreenSharing(true);
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.8 } });
        sStream.getVideoTracks()[0].onended = () => setIsScreenSharing(false);
        if (screenVideoRef.current) screenVideoRef.current.srcObject = sStream;
      } catch (err) {
        const virtScreen = createVirtualScreenStream();
        if (virtScreen) {
          setScreenStream(virtScreen);
          setIsScreenSharing(true);
          confetti({ particleCount: 80, spread: 80, origin: { y: 0.8 } });
          if (screenVideoRef.current) screenVideoRef.current.srcObject = virtScreen;
        }
      }
    }
  };

  useEffect(() => {
    if (isVideoOn && localVideoRef.current && stream) {
      localVideoRef.current.srcObject = stream;
    }
  }, [isVideoOn, stream]);

  useEffect(() => {
    if (isScreenSharing && screenVideoRef.current && screenStream) {
      screenVideoRef.current.srcObject = screenStream;
    }
  }, [isScreenSharing, screenStream]);

  useEffect(() => {
    return () => {
      if (stream) stream.getTracks().forEach((track) => track.stop());
      if (screenStream) screenStream.getTracks().forEach((track) => track.stop());
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      if (screenAnimRef.current) cancelAnimationFrame(screenAnimRef.current);
    };
  }, [stream, screenStream]);

  const participants = [currentUser, ...connectedUsers.filter((u) => u.id !== currentUser.id && u.status === 'online')];

  return (
    <div className="flex-1 bg-gradient-to-b from-[#090a12] via-[#0d0e19] to-[#07080d] flex flex-col h-full relative overflow-hidden select-none">
      {/* Top Status Bar */}
      <div className="h-16 border-b border-white/[0.08] px-6 flex items-center justify-between bg-[#0c0e17]/70 backdrop-blur-2xl z-20 shadow-lg">
        <div className="flex items-center space-x-3.5 space-x-reverse">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-[15px] font-black text-white flex items-center gap-2 drop-shadow">
              {channel.name}
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                اتصال پایدار
              </span>
            </h2>
            <div className="text-[11px] text-[#949ba4] flex items-center gap-1.5 mt-0.5 font-medium">
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              <span>پینگ: ۲۸ms • سرور اختصاصی تهران</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 space-x-reverse text-[#b5bac1]">
          <button
            onClick={() => setShowGameActivity(!showGameActivity)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition border ${
              showGameActivity
                ? 'bg-indigo-600 text-white border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.5)]'
                : 'bg-white/[0.05] border-white/10 hover:bg-white/10 text-indigo-300'
            }`}
            title="بازی مشترک دوز"
          >
            <Gamepad2 className="w-4 h-4" />
            بازی دوز گروهی
          </button>

          <span className="text-xs bg-[#141624] px-3.5 py-1.5 rounded-xl border border-white/[0.1] flex items-center gap-1.5 text-white font-bold shadow-sm">
            <Users className="w-4 h-4 text-emerald-400" />
            {participants.length} نفر
          </span>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="hover:text-white transition p-2 rounded-xl hover:bg-white/[0.08]"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden p-4 gap-4 min-h-0 z-10">
        {/* Screen Share Stage */}
        {isScreenSharing && (
          <div className="flex-[3] bg-black/95 rounded-3xl overflow-hidden border border-indigo-500/40 relative shadow-2xl flex flex-col justify-center min-h-[220px]">
            <video
              ref={screenVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-contain"
            />
            <div className="absolute top-3 right-3 bg-black/80 backdrop-blur px-3 py-1.5 rounded-xl text-xs text-white border border-white/20 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span className="font-bold">استریم زنده صفحه نمایش {currentUser.name}</span>
            </div>
          </div>
        )}

        {/* Participant Cards Grid */}
        <div
          className={`flex-1 overflow-y-auto no-scrollbar gap-3 ${
            isScreenSharing
              ? 'flex md:flex-col overflow-x-auto md:overflow-y-auto max-h-full max-w-full md:w-64 shrink-0'
              : 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 auto-rows-fr'
          }`}
        >
          {participants.map((user) => {
            const isMe = user.id === currentUser.id;
            const isSpeaking = activeSpeaker === user.id && !isMuted;

            return (
              <div
                key={user.id}
                className={`rounded-2xl relative overflow-hidden flex flex-col items-center justify-center border transition-all duration-300 shadow-xl backdrop-blur-xl ${
                  isScreenSharing ? 'min-w-[140px] h-[130px] shrink-0' : 'min-h-[160px]'
                } ${
                  isSpeaking
                    ? 'bg-[#1c2138] border-emerald-500 ring-2 ring-emerald-500/50 shadow-[0_0_25px_rgba(16,185,129,0.3)]'
                    : 'bg-[#141624]/90 border-white/[0.08] hover:border-white/20'
                }`}
              >
                {isMe && isVideoOn ? (
                  <div className="w-full h-full relative">
                    <video
                      ref={localVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover transform -scale-x-100"
                    />
                    {isVirtualCam && (
                      <div className="absolute top-2 right-2 bg-black/75 px-2 py-0.5 rounded text-[10px] text-emerald-400 font-bold">
                        وبکم زنده
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center p-2">
                    <div
                      className={`relative p-1 rounded-full transition-all duration-300 ${
                        isSpeaking ? 'speaking-ring' : ''
                      }`}
                    >
                      <GamerAvatar
                        styleId={user.avatarStyle}
                        size={isScreenSharing ? 42 : 56}
                        withGlow={isSpeaking}
                      />
                    </div>
                    <span className="mt-2 font-bold text-white text-xs truncate max-w-[110px]">
                      {user.name}
                    </span>
                    {!isScreenSharing && user.gameActivity && (
                      <span className="text-[10px] text-indigo-300 font-medium truncate max-w-[110px] mt-0.5">
                        🎮 {user.gameActivity}
                      </span>
                    )}
                  </div>
                )}

                <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur px-2 py-0.5 rounded text-[10px] text-white flex items-center space-x-1 space-x-reverse">
                  <span className="truncate max-w-[60px]">{user.name}</span>
                  {isMe && isMuted && <MicOff className="w-3 h-3 text-red-400" />}
                </div>

                {isMe && (
                  <div className="absolute top-2 left-2 bg-indigo-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded shadow">
                    شما
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mini-Game Drawer */}
      {showGameActivity && (
        <div className="absolute bottom-24 right-8 bg-[#141624]/95 backdrop-blur-2xl p-5 rounded-3xl border border-indigo-500/40 shadow-2xl z-40 max-w-sm animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-indigo-400" />
              <h3 className="font-black text-white text-sm">بازی دوز مشترک بین بچه‌ها</h3>
            </div>
            <button onClick={resetGame} className="text-xs text-indigo-300 hover:text-white flex items-center gap-1">
              <RotateCcw className="w-3 h-3" /> ریست
            </button>
          </div>

          <p className="text-xs text-[#949ba4] mb-3">
            {gameWinner ? (
              <span className="text-emerald-400 font-bold">{gameWinner}</span>
            ) : (
              <span>نوبت: <strong className="text-white">{isXNext ? 'صادق (❌)' : 'آرش (⭕)'}</strong></span>
            )}
          </p>

          <div className="grid grid-cols-3 gap-2">
            {board.map((cell, idx) => (
              <button
                key={idx}
                onClick={() => handleCellClick(idx)}
                className="w-16 h-16 bg-[#1f2238] hover:bg-[#2b2f4c] rounded-2xl border border-white/10 text-2xl flex items-center justify-center transition active:scale-95 font-bold text-white"
              >
                {cell}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Floating Bottom Control Bar */}
      <div className="h-20 bg-[#07080e]/90 backdrop-blur-2xl border-t border-white/[0.08] px-8 flex items-center justify-center space-x-5 space-x-reverse z-30 shrink-0">
        <button
          onClick={onToggleMute}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
            isMuted ? 'bg-red-500 text-white' : 'bg-[#181a29] text-white hover:bg-[#25283d] border border-white/[0.1]'
          }`}
          title={isMuted ? 'فعال‌سازی میکروفن' : 'بی‌صدا کردن'}
        >
          {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        <button
          onClick={toggleCamera}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
            isVideoOn ? 'bg-emerald-500 text-white' : 'bg-[#181a29] text-white hover:bg-[#25283d] border border-white/[0.1]'
          }`}
          title={isVideoOn ? 'خاموش کردن وبکم' : 'روشن کردن وبکم'}
        >
          {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
        </button>

        <button
          onClick={toggleScreenShare}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
            isScreenSharing ? 'bg-indigo-600 text-white animate-pulse' : 'bg-[#181a29] text-white hover:bg-[#25283d] border border-white/[0.1]'
          }`}
          title="اشتراک صفحه مانیتور"
        >
          <Monitor className="w-5 h-5" />
        </button>

        <button
          onClick={() => confetti({ particleCount: 150, spread: 90, origin: { y: 0.65 } })}
          className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 text-black font-black flex items-center justify-center shadow-lg hover:scale-105 transition"
          title="افکت هایپ!"
        >
          <Sparkles className="w-5 h-5 text-white" />
        </button>

        <button
          onClick={onDisconnect}
          className="w-12 h-12 rounded-2xl bg-red-600 text-white hover:bg-red-700 flex items-center justify-center shadow-lg transition hover:scale-105"
          title="خروج از روم"
        >
          <PhoneOff className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

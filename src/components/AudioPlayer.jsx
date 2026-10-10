import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  SkipBack, 
  Repeat, 
  Volume2, 
  VolumeX, 
  X, 
  Zap, 
  UserCheck,
  Headphones
} from 'lucide-react';
import { RECITERS, getAyahAudioUrl } from '../data/reciters';

export function AudioPlayer({
  activeVerse,
  activeGroup,
  isPlaying,
  setIsPlaying,
  selectedReciterId,
  setSelectedReciterId,
  audioSpeed,
  setAudioSpeed,
  audioLoopCount,
  setAudioLoopCount,
  smartAlternatePlay,
  setSmartAlternatePlay,
  onVerseChange,
  onClose
}) {
  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentLoop, setCurrentLoop] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  // تحديث رابط الصوت وسرعته عند تغيير الآية أو القارئ
  useEffect(() => {
    if (!activeVerse) return;
    const url = getAyahAudioUrl(selectedReciterId, activeVerse.surahNumber, activeVerse.ayahNumber);
    
    if (audioRef.current) {
      audioRef.current.src = url;
      audioRef.current.playbackRate = audioSpeed;
      if (isPlaying) {
        audioRef.current.play().catch(err => console.log('Audio autoplay handled:', err));
      }
    }
  }, [activeVerse, selectedReciterId]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = audioSpeed;
    }
  }, [audioSpeed]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(err => console.log('Play err:', err));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  // عند انتهاء التلاوة: معالجة التكرار أو الانتقال التناوبي بين الآيات المتشابهة
  const handleEnded = () => {
    // إذا كان التكرار مستمراً أو متبقياً تكرار
    if (audioLoopCount === 'infinite' || currentLoop < audioLoopCount) {
      setCurrentLoop(prev => prev + 1);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
      return;
    }

    // تم استيفاء عدد التكرار للآية الحالية:
    setCurrentLoop(1);

    // إذا كان وضع الاستماع التناوبي الذكي مفعلاً ولديك أكثر من آية في المجموعة
    if (smartAlternatePlay && activeGroup && activeGroup.verses.length > 1) {
      const currentIndex = activeGroup.verses.findIndex(v => v.id === activeVerse.id);
      const nextIndex = (currentIndex + 1) % activeGroup.verses.length;
      onVerseChange(activeGroup.verses[nextIndex], activeGroup);
    } else {
      setIsPlaying(false);
    }
  };

  const formatTime = (sec) => {
    if (isNaN(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const nextSpeed = () => {
    const speeds = [0.75, 1.0, 1.25, 1.5];
    const nextIdx = (speeds.indexOf(audioSpeed) + 1) % speeds.length;
    setAudioSpeed(speeds[nextIdx]);
  };

  const nextLoop = () => {
    const loops = [1, 2, 3, 5, 'infinite'];
    const nextIdx = (loops.indexOf(audioLoopCount) + 1) % loops.length;
    setAudioLoopCount(loops[nextIdx]);
  };

  if (!activeVerse) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'var(--bg-surface)',
      borderTop: '1.5px solid var(--border-strong)',
      padding: '12px 20px',
      zIndex: 50,
      boxShadow: 'var(--shadow-player)',
      transition: 'all var(--transition-speed)'
    }}>
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onEnded={handleEnded}
      />

      <div style={{
        maxWidth: '1300px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* معلومات الآية الحالية */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '220px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'rgba(212,175,55,0.15)',
            border: '1px solid var(--gold-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--gold-primary)'
          }}>
            <Headphones size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontWeight: '800', fontSize: '14px', color: 'var(--text-main)' }}>
                سورة {activeVerse.surahName}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--gold-primary)', fontWeight: '700' }}>
                (آية {activeVerse.ayahNumber})
              </span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              {activeGroup?.title || 'مقارنة المتشابهات'}
            </div>
          </div>
        </div>

        {/* أزرار التحكم بالتشغيل والشريط الزمني */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          flex: '1 1 360px',
          maxWidth: '520px'
        }}>
          {/* أزرار التشغيل والتناوب والتكرار */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* الاستماع التناوبي الذكي */}
            <button
              onClick={() => setSmartAlternatePlay(!smartAlternatePlay)}
              style={{
                background: 'none',
                border: 'none',
                padding: '4px 8px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '11px',
                fontWeight: '700',
                color: smartAlternatePlay ? 'var(--emerald-accent)' : 'var(--text-muted)',
                backgroundColor: smartAlternatePlay ? 'rgba(16,185,129,0.12)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
              title="الاستماع التناوبي الذكي: الانتقال التلقائي للآية المتشابهة لمقارنة الفارق سمعياً"
            >
              <Zap size={14} />
              <span>تناوبي</span>
            </button>

            {/* تشغيل/إيقاف */}
            <button
              onClick={togglePlay}
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: 'var(--gold-primary)',
                color: '#081214',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 10px rgba(212,175,55,0.4)',
                cursor: 'pointer'
              }}
              title={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} style={{ marginRight: '-2px' }} />}
            </button>

            {/* تكرار اللوب */}
            <button
              onClick={nextLoop}
              style={{
                background: 'none',
                border: 'none',
                padding: '4px 8px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '12px',
                fontWeight: '700',
                color: audioLoopCount > 1 || audioLoopCount === 'infinite' ? 'var(--gold-primary)' : 'var(--text-muted)',
                backgroundColor: audioLoopCount > 1 || audioLoopCount === 'infinite' ? 'rgba(212,175,55,0.15)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
              title="تكرار الآية (1x / 2x / 3x / 5x / مستمر)"
            >
              <Repeat size={14} />
              <span>{audioLoopCount === 'infinite' ? '∞' : `${audioLoopCount}x`}</span>
            </button>

            {/* سرعة التلاوة */}
            <button
              onClick={nextSpeed}
              style={{
                background: 'none',
                border: 'none',
                padding: '4px 6px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '12px',
                fontWeight: '700',
                color: 'var(--text-muted)',
                backgroundColor: audioSpeed !== 1.0 ? 'rgba(212,175,55,0.1)' : 'transparent'
              }}
              title="تعديل سرعة التلاوة"
            >
              {audioSpeed}x
            </button>
          </div>

          {/* شريط التقدم الزمني */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', minWidth: '32px' }}>
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              style={{
                flex: 1,
                accentColor: 'var(--gold-primary)',
                height: '4px',
                cursor: 'pointer'
              }}
            />
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', minWidth: '32px' }}>
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* اختيار القارئ وزر الإغلاق */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <UserCheck size={16} style={{ color: 'var(--gold-primary)' }} />
            <select
              value={selectedReciterId}
              onChange={(e) => setSelectedReciterId(e.target.value)}
              style={{
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-card)',
                color: 'var(--text-main)',
                border: '1px solid var(--border-color)',
                fontSize: '12px',
                fontFamily: 'var(--font-ui)',
                cursor: 'pointer',
                outline: 'none',
                maxWidth: '180px'
              }}
            >
              {RECITERS.map(r => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px'
            }}
            title="إخفاء المشغل"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

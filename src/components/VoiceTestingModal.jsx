import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Mic, 
  MicOff, 
  CheckCircle2, 
  AlertCircle, 
  Volume2, 
  RotateCcw, 
  Sparkles,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { stripTashkeel } from '../utils/searchUtils';
import { MUTASHABIHAT_GROUPS } from '../data/quranData';

export function VoiceTestingModal({ isOpen, onClose, onMarkMastered }) {
  const [selectedGroupIdx, setSelectedGroupIdx] = useState(0);
  const [selectedVerseIdx, setSelectedVerseIdx] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [voiceSupported, setVoiceSupported] = useState(true);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'confusion' | 'partial', message: '', score: 0 }
  
  const recognitionRef = useRef(null);

  const currentGroup = MUTASHABIHAT_GROUPS[selectedGroupIdx];
  const currentVerse = currentGroup?.verses[selectedVerseIdx];

  // التحقق من دعم المتصفح لميزة التعرف على الصوت
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'ar-SA';
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = 0; i < event.results.length; i++) {
        finalTranscript += event.results[i][0].transcript;
      }
      setTranscript(finalTranscript);
      if (event.results[0].isFinal) {
        evaluateRecitation(finalTranscript);
      }
    };

    recognition.onerror = (event) => {
      console.log('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, [currentVerse]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      setFeedback(null);
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.log('Speech error on start:', err);
      }
    }
  };

  // تقييم التلاوة الذكي ومقارنتها بالمتشابهات
  const evaluateRecitation = (recitedText) => {
    if (!recitedText.trim()) return;

    const cleanRecited = stripTashkeel(recitedText);
    const cleanTarget = stripTashkeel(currentVerse.textUthmani);

    // الكلمات الفارقة الخاصة بهذه الآية
    const targetDiffWords = currentVerse.diffTokens
      ?.filter(t => t.isDiff)
      .map(t => stripTashkeel(t.text)) || [];

    // التحقق مما إذا كان الحافظ قد نطق الكلمات الفارقة للآية المقابلة في نفس المجموعة بالخطأ
    const otherVerses = currentGroup.verses.filter(v => v.id !== currentVerse.id);
    let confusedWithSurah = null;

    for (const ov of otherVerses) {
      const otherDiffWords = ov.diffTokens
        ?.filter(t => t.isDiff)
        .map(t => stripTashkeel(t.text)) || [];

      for (const word of otherDiffWords) {
        if (cleanRecited.includes(word) && !cleanTarget.includes(word)) {
          confusedWithSurah = ov.surahName;
          break;
        }
      }
    }

    if (confusedWithSurah) {
      setFeedback({
        type: 'confusion',
        message: `انتبه! لقد قرأت بلفظ موضع سورة (${confusedWithSurah}) بدلاً من سورة (${currentVerse.surahName})! استذكر الضابط الحفظي.`,
        score: 60
      });
      return;
    }

    // فحص نسبة مطابقة الكلمات
    const targetWords = cleanTarget.split(/\s+/);
    const recitedWords = cleanRecited.split(/\s+/);
    let matchedWords = 0;

    targetWords.forEach(w => {
      if (recitedWords.includes(w)) matchedWords++;
    });

    const score = Math.round((matchedWords / targetWords.length) * 100);

    if (score >= 70) {
      setFeedback({
        type: 'success',
        message: `ما شاء الله تبارك الله! تلاوة متقنة ومطابقة لموضع سورة ${currentVerse.surahName} باللفظ الصحيح.`,
        score
      });
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
      onMarkMastered(currentVerse.id);
    } else {
      setFeedback({
        type: 'partial',
        message: `تلاوة طيبة ولكن هناك نقص في مطابقة كامل الآية (${score}%). أعد التسميع بتأنٍ.`,
        score
      });
    }
  };

  const nextVerse = () => {
    setTranscript('');
    setFeedback(null);
    if (selectedVerseIdx < currentGroup.verses.length - 1) {
      setSelectedVerseIdx(selectedVerseIdx + 1);
    } else {
      setSelectedVerseIdx(0);
      setSelectedGroupIdx((selectedGroupIdx + 1) % MUTASHABIHAT_GROUPS.length);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1.5px solid var(--border-strong)',
        width: '100%',
        maxWidth: '680px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: 'var(--shadow-player)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* رأس النافذة */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Mic size={22} style={{ color: 'var(--gold-primary)' }} />
            <h2 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>
              التسميع الصوتي الذكي (Voice Recognition Test)
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* معلومات الموضع المستهدف */}
          <div style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>الموضع المطلوب تسميعه:</span>
              <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-gold)', marginTop: '2px' }}>
                سورة {currentVerse.surahName} [آية {currentVerse.ayahNumber}]
              </div>
            </div>
            <button
              onClick={nextVerse}
              className="btn-outline"
              style={{ padding: '6px 12px', fontSize: '12px' }}
            >
              الانتقال للموضع التالي
            </button>
          </div>

          {/* تنبيه إذا لم يكن التعرف على الصوت مدعوماً */}
          {!voiceSupported && (
            <div style={{
              backgroundColor: 'rgba(245,158,11,0.1)',
              border: '1px solid var(--amber-rule)',
              borderRadius: 'var(--radius-md)',
              padding: '12px',
              fontSize: '13px',
              color: 'var(--amber-rule)'
            }}>
              المتصفح الحالي لا يدعم ميزة الميكروفون التلقائية، يمكنك كتابة الآية بالأسفل لتجربة التحقق الذكي.
            </div>
          )}

          {/* مساحة التسميع الميكروفوني */}
          <div style={{
            backgroundColor: 'var(--bg-app)',
            border: '2px dashed',
            borderColor: isListening ? 'var(--emerald-accent)' : 'var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '30px 20px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            transition: 'border-color 0.3s'
          }}>
            {/* زر الميكروفون التفاعلي */}
            <button
              onClick={toggleListening}
              style={{
                width: '74px',
                height: '74px',
                borderRadius: '50%',
                backgroundColor: isListening ? 'var(--ruby-diff)' : 'var(--gold-primary)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isListening 
                  ? '0 0 25px rgba(239,68,68,0.6)' 
                  : '0 4px 15px rgba(212,175,55,0.4)',
                cursor: 'pointer',
                transform: isListening ? 'scale(1.08)' : 'scale(1)',
                transition: 'all 0.2s'
              }}
              title={isListening ? 'إيقاف الاستماع' : 'ابدأ التسميع بصوتك'}
            >
              {isListening ? <MicOff size={32} /> : <Mic size={32} />}
            </button>

            <span style={{ fontSize: '14px', fontWeight: '700', color: isListening ? 'var(--emerald-accent)' : 'var(--text-muted)' }}>
              {isListening ? '🎤 جارٍ الاستماع لتلاوتك... اقرأ الآن!' : 'اضغط على الميكروفون واقرأ الآية بصوتك'}
            </span>

            {/* النص الذي التقطه الميكروفون أو أُدخل يدوياً */}
            <div style={{ width: '100%', maxWidth: '90%' }}>
              <input
                type="text"
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="أو اكتب/ألصق قراءتك هنا للتحقق الفوري..."
                style={{
                  width: '100%',
                  backgroundColor: 'var(--bg-card)',
                  padding: '10px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  fontSize: '16px',
                  fontFamily: 'var(--font-quran-amiri)',
                  color: 'var(--text-main)',
                  textAlign: 'center',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => evaluateRecitation(transcript)}
                  disabled={!transcript.trim()}
                  className="btn-primary"
                  style={{ padding: '6px 16px', fontSize: '12px' }}
                >
                  <Sparkles size={14} style={{ marginLeft: '4px' }} />
                  تحقق من التلاوة واللبس
                </button>
                {transcript && (
                  <button
                    type="button"
                    onClick={() => { setTranscript(''); setFeedback(null); }}
                    className="btn-outline"
                    style={{ padding: '6px 12px', fontSize: '12px' }}
                  >
                    مسح
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* التغذية الراجعة الذكية على التسميع */}
          {feedback && (
            <div className="animate-fade-in" style={{
              backgroundColor: feedback.type === 'success' 
                ? 'rgba(16,185,129,0.12)' 
                : feedback.type === 'confusion' 
                ? 'rgba(239,68,68,0.12)' 
                : 'rgba(245,158,11,0.12)',
              border: `1.5px solid ${
                feedback.type === 'success' ? 'var(--emerald-accent)' : 
                feedback.type === 'confusion' ? 'var(--ruby-diff)' : 'var(--amber-rule)'
              }`,
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px'
            }}>
              {feedback.type === 'success' ? (
                <CheckCircle2 size={24} style={{ color: 'var(--emerald-accent)', flexShrink: 0 }} />
              ) : (
                <AlertCircle size={24} style={{ color: feedback.type === 'confusion' ? 'var(--ruby-diff)' : 'var(--amber-rule)', flexShrink: 0 }} />
              )}
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  color: feedback.type === 'success' ? 'var(--emerald-accent)' : 'var(--text-main)',
                  marginBottom: '4px'
                }}>
                  {feedback.message}
                </div>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  نسبة دقة التسميع: <strong>{feedback.score}%</strong>
                </span>
              </div>
            </div>
          )}

          {/* النص المكتوب للآية للتأكد والمقارنة */}
          <div style={{
            borderTop: '1px solid var(--border-color)',
            paddingTop: '14px',
            textAlign: 'center'
          }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              نص الآية المعتمد بالرسم العثماني:
            </span>
            <p style={{
              fontFamily: 'var(--font-quran-amiri)',
              fontSize: '20px',
              color: 'var(--text-main)',
              lineHeight: '2',
              margin: 0
            }}>
              {currentVerse.textUthmani}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

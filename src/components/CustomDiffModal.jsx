import React, { useState } from 'react';
import { 
  X, 
  Scale, 
  Play, 
  Pause, 
  Sparkles, 
  ArrowLeftRight, 
  Percent,
  Check
} from 'lucide-react';
import { stripTashkeel } from '../utils/searchUtils';

export function CustomDiffModal({ isOpen, onClose }) {
  const [verseAText, setVerseAText] = useState('ذَٰلِكَ ٱلْكِتَٰبُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ');
  const [verseBText, setVerseBText] = useState('هُدًى وَبُشْرَىٰ لِلْمُؤْمِنِينَ');
  const [verseATitle, setVerseATitle] = useState('البقرة: 2');
  const [verseBTitle, setVerseBTitle] = useState('النمل: 2');

  if (!isOpen) return null;

  // خوارزمية المقارنة الحية واستخراج نسبة التشابه
  const wordsA = verseAText.trim().split(/\s+/);
  const wordsB = verseBText.trim().split(/\s+/);

  const cleanWordsA = wordsA.map(w => stripTashkeel(w));
  const cleanWordsB = wordsB.map(w => stripTashkeel(w));

  // حساب نسبة التشابه
  let matchedCount = 0;
  cleanWordsA.forEach(w => {
    if (cleanWordsB.includes(w)) matchedCount++;
  });
  const similarityScore = Math.round((matchedCount / Math.max(wordsA.length, wordsB.length)) * 100);

  // النماذج الجاهزة السريعة
  const presets = [
    {
      title: 'هدى للمتقين vs وبشرى للمؤمنين',
      aTitle: 'البقرة: 2',
      aText: 'ذَٰلِكَ ٱلْكِتَٰبُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ',
      bTitle: 'النمل: 2',
      bText: 'هُدًى وَبُشْرَىٰ لِلْمُؤْمِنِينَ'
    },
    {
      title: 'تجري تحتها الأنهار (التوبة 100) vs تجري من تحتها',
      aTitle: 'التوبة: 100',
      aText: 'وَأَعَدَّ لَهُمْ جَنَّٰتٍۢ تَجْرِى تَحْتَهَا ٱلْأَنْهَٰرُ خَٰلِدِينَ فِيهَآ أَبَدًا',
      bTitle: 'التوبة: 89',
      bText: 'أَعَدَّ ٱللَّهُ لَهُمْ جَنَّٰتٍۢ تَجْرِى مِن تَحْتِهَا ٱلْأَنْهَٰرُ خَٰلِدِينَ فِيهَا'
    },
    {
      title: 'بما كانوا يكذبون vs بما كانوا يفسقون',
      aTitle: 'البقرة: 10',
      aText: 'وَلَهُمْ عَذَابٌ أَلِيمٌۢ بِمَا كَانُوا۟ يَكْذِبُونَ',
      bTitle: 'السجدة: 20',
      bText: 'وَقِيلَ لَهُمْ ذُوقُوا۟ عَذَابَ ٱلنَّارِ ٱلَّذِى كُنتُم بِهِۦ تُكَذِّبُونَ'
    }
  ];

  const applyPreset = (p) => {
    setVerseATitle(p.aTitle);
    setVerseAText(p.aText);
    setVerseBTitle(p.bTitle);
    setVerseBText(p.bText);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(6px)',
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
        maxWidth: '840px',
        maxHeight: '92vh',
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
            <Scale size={22} style={{ color: 'var(--gold-primary)' }} />
            <h2 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>
              أداة المقارنة الحرة بين أي آيتين (Custom Verse Diff Tool)
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
          {/* نماذج سريعة */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>
              نماذج جاهزة للمقارنة:
            </span>
            {presets.map((p, idx) => (
              <button
                key={idx}
                onClick={() => applyPreset(p)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-card)',
                  color: 'var(--text-gold)',
                  border: '1px solid var(--border-color)',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                {p.title}
              </button>
            ))}
          </div>

          {/* مدخلات الآيتين */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '16px'
          }}>
            {/* الآية الأولى */}
            <div style={{
              backgroundColor: 'var(--bg-card)',
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--gold-primary)' }}>
                  الموضع الأول (أ):
                </span>
                <input
                  type="text"
                  value={verseATitle}
                  onChange={(e) => setVerseATitle(e.target.value)}
                  placeholder="اسم السورة ورقم الآية"
                  style={{
                    backgroundColor: 'var(--bg-app)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '4px',
                    padding: '2px 8px',
                    fontSize: '12px',
                    color: 'var(--text-main)',
                    textAlign: 'center'
                  }}
                />
              </div>
              <textarea
                value={verseAText}
                onChange={(e) => setVerseAText(e.target.value)}
                rows={3}
                style={{
                  width: '100%',
                  backgroundColor: 'var(--bg-app)',
                  color: 'var(--text-main)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px',
                  fontFamily: 'var(--font-quran-amiri)',
                  fontSize: '18px',
                  lineHeight: '1.8',
                  outline: 'none',
                  resize: 'none'
                }}
              />
            </div>

            {/* الآية الثانية */}
            <div style={{
              backgroundColor: 'var(--bg-card)',
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--emerald-accent)' }}>
                  الموضع الثاني (ب):
                </span>
                <input
                  type="text"
                  value={verseBTitle}
                  onChange={(e) => setVerseBTitle(e.target.value)}
                  placeholder="اسم السورة ورقم الآية"
                  style={{
                    backgroundColor: 'var(--bg-app)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '4px',
                    padding: '2px 8px',
                    fontSize: '12px',
                    color: 'var(--text-main)',
                    textAlign: 'center'
                  }}
                />
              </div>
              <textarea
                value={verseBText}
                onChange={(e) => setVerseBText(e.target.value)}
                rows={3}
                style={{
                  width: '100%',
                  backgroundColor: 'var(--bg-app)',
                  color: 'var(--text-main)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px',
                  fontFamily: 'var(--font-quran-amiri)',
                  fontSize: '18px',
                  lineHeight: '1.8',
                  outline: 'none',
                  resize: 'none'
                }}
              />
            </div>
          </div>

          {/* شريط نسبة التشابه اللفظي */}
          <div style={{
            backgroundColor: 'var(--bg-card)',
            padding: '12px 18px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Percent size={18} style={{ color: 'var(--gold-primary)' }} />
              <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)' }}>
                نسبة التشابه اللفظي المقدرة:
              </span>
            </div>
            <span style={{
              fontSize: '18px',
              fontWeight: '800',
              color: similarityScore >= 80 ? 'var(--emerald-accent)' : 'var(--gold-primary)',
              backgroundColor: 'var(--bg-app)',
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)'
            }}>
              {similarityScore}%
            </span>
          </div>

          {/* شاشة مقارنة الفوارق اللفظية الملونة بدقة */}
          <div style={{
            backgroundColor: 'var(--bg-app)',
            border: '1.5px solid var(--border-strong)',
            borderRadius: 'var(--radius-md)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: 'var(--gold-primary)' }}>
              المقارنة البصرية المباشرة للفوارق (Diff Analysis):
            </h4>

            {/* الموضع أ مع تظليل الفروق */}
            <div>
              <span style={{ fontSize: '12px', color: 'var(--gold-primary)', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                {verseATitle}:
              </span>
              <p style={{
                fontFamily: 'var(--font-quran-amiri)',
                fontSize: '22px',
                lineHeight: '2.2',
                color: 'var(--text-main)',
                margin: 0
              }}>
                {wordsA.map((w, idx) => {
                  const isUnique = !cleanWordsB.includes(stripTashkeel(w));
                  return (
                    <span
                      key={idx}
                      className={isUnique ? 'diff-token is-diff' : ''}
                      style={{ margin: '0 2px' }}
                    >
                      {w}{' '}
                    </span>
                  );
                })}
              </p>
            </div>

            {/* الموضع ب مع تظليل الفروق */}
            <div style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '12px' }}>
              <span style={{ fontSize: '12px', color: 'var(--emerald-accent)', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                {verseBTitle}:
              </span>
              <p style={{
                fontFamily: 'var(--font-quran-amiri)',
                fontSize: '22px',
                lineHeight: '2.2',
                color: 'var(--text-main)',
                margin: 0
              }}>
                {wordsB.map((w, idx) => {
                  const isUnique = !cleanWordsA.includes(stripTashkeel(w));
                  return (
                    <span
                      key={idx}
                      className={isUnique ? 'diff-token is-diff' : ''}
                      style={{ margin: '0 2px' }}
                    >
                      {w}{' '}
                    </span>
                  );
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

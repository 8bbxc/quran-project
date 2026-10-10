import React, { useState } from 'react';
import { 
  X, 
  Award, 
  RotateCw, 
  Check, 
  AlertCircle, 
  HelpCircle, 
  Layers, 
  CheckCircle2, 
  XCircle,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MUTASHABIHAT_GROUPS } from '../data/quranData';

export function QuizModal({ isOpen, onClose, onMarkMastered, onMarkNeedsReview }) {
  const [activeTab, setActiveTab] = useState('flashcard'); // 'flashcard' | 'multiple_choice'
  
  // حالة البطاقات الذكية (Flashcard State)
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // حالة الاختيار من متعدد (Multiple Choice State)
  const [mcIndex, setMcIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);

  if (!isOpen) return null;

  const currentGroup = MUTASHABIHAT_GROUPS[currentGroupIndex];
  const currentVerse = currentGroup?.verses[currentVerseIndex];

  // توليد سؤال تفاعلي للاختيار من متعدد
  const mcQuestions = [
    {
      surah: 'البقرة',
      ayahNum: 10,
      questionText: 'فِي قُلُوبِهِم مَّرَضٌ فَزَادَهُمُ ٱللَّهُ مَرَضًا ۖ وَلَهُمْ عَذَابٌ أَلِيمٌۢ ...',
      options: ['بِمَا كَانُوا۟ يَكْذِبُونَ', 'بِمَا كَانُوا۟ يَفْسُقُونَ', 'بِمَا كَانُوا۟ يَظْلِمُونَ'],
      correctAnswer: 'بِمَا كَانُوا۟ يَكْذِبُونَ',
      explanation: 'في البقرة (يكذبون) في شأن المنافقين الذين كذبوا في دعوى الإيمان، بينما في السجدة (يفسقون).'
    },
    {
      surah: 'التوبة',
      ayahNum: 100,
      questionText: 'وَٱلسَّٰبِقُونَ ٱلْأَوَّلُونَ مِنَ ٱلْمُهَٰجِرِينَ وَٱلْأَنصَارِ ... جَنَّٰتٍۢ ... ٱلْأَنْهَٰرُ خَٰلِدِينَ فِيهَآ أَبَدًا',
      options: ['تَجْرِى تَحْتَهَا', 'تَجْرِى مِن تَحْتِهَا', 'تَجْرِي مِنْ تَحْتِهِمُ'],
      correctAnswer: 'تَجْرِى تَحْتَهَا',
      explanation: 'موضع وحيد ومنفرد في القرآن كاملاً بحذف (مِن) في الآية 100 من سورة التوبة في حق السابقين الأولين!'
    },
    {
      surah: 'البقرة',
      ayahNum: 48,
      questionText: 'وَٱتَّقُوا۟ يَوْمًا لَّا تَجْزِى نَفْسٌ عَن نَّفْسٍ شَيْـًٔا ... وَلَا يُؤْخَذُ مِنْهَا عَدْلٌ',
      options: ['وَلَا يُقْبَلُ مِنْهَا شَفَٰعَةٌ', 'وَلَا يُقْبَلُ مِنْهَا عَدْلٌ', 'وَلَا تَنفَعُهَا شَفَٰعَةٌ'],
      correctAnswer: 'وَلَا يُقْبَلُ مِنْهَا شَفَٰعَةٌ',
      explanation: 'في الموضع الأول (الآية 48) قُدمت الشفاعة: ولا يقبل منها شفاعة، وفي الموضع الثاني (الآية 123) قُدم العدل: ولا يقبل منها عدل.'
    },
    {
      surah: 'البقرة',
      ayahNum: 173,
      questionText: 'إِنَّمَا حَرَّمَ عَلَيْكُمُ ٱلْمَيْتَةَ وَٱلدَّمَ وَلَحْمَ ٱلْخِنزِيرِ ...',
      options: ['وَمَآ أُهِلَّ بِهِۦ لِغَيْرِ ٱللَّهِ', 'وَمَآ أُهِلَّ لِغَيْرِ ٱللَّهِ بِهِۦ', 'وَمَا ذُبِحَ عَلَى النُّصُبِ'],
      correctAnswer: 'وَمَآ أُهِلَّ بِهِۦ لِغَيْرِ ٱللَّهِ',
      explanation: 'انفردت البقرة بتقديم ضمير (بِهِۦ) على (لِغَيْرِ ٱللَّهِ)، بينما في المائدة والأنعام والنحل قُدم (لغير الله به).'
    }
  ];

  const currentMc = mcQuestions[mcIndex % mcQuestions.length];

  const nextFlashcard = () => {
    setIsFlipped(false);
    if (currentVerseIndex < currentGroup.verses.length - 1) {
      setCurrentVerseIndex(currentVerseIndex + 1);
    } else {
      setCurrentVerseIndex(0);
      setCurrentGroupIndex((currentGroupIndex + 1) % MUTASHABIHAT_GROUPS.length);
    }
  };

  const handleMcAnswer = (opt) => {
    if (selectedOption !== null) return;
    setSelectedOption(opt);
    setTotalAnswered(prev => prev + 1);
    if (opt === currentMc.correctAnswer) {
      setScore(prev => prev + 1);
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  };

  const nextMcQuestion = () => {
    setSelectedOption(null);
    setMcIndex(prev => prev + 1);
  };

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
            <Award size={22} style={{ color: 'var(--gold-primary)' }} />
            <h2 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>
              اختبار وتثبيت المتشابهات
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* التبديل بين البطاقات الذكية والاختيار من متعدد */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-card)'
        }}>
          <button
            onClick={() => setActiveTab('flashcard')}
            style={{
              flex: 1,
              padding: '12px',
              fontWeight: '700',
              fontSize: '14px',
              color: activeTab === 'flashcard' ? 'var(--gold-primary)' : 'var(--text-muted)',
              borderBottom: activeTab === 'flashcard' ? '2.5px solid var(--gold-primary)' : 'none',
              background: 'none'
            }}
          >
            <Layers size={16} />
            البطاقات الذكية (Flashcards)
          </button>
          <button
            onClick={() => setActiveTab('multiple_choice')}
            style={{
              flex: 1,
              padding: '12px',
              fontWeight: '700',
              fontSize: '14px',
              color: activeTab === 'multiple_choice' ? 'var(--gold-primary)' : 'var(--text-muted)',
              borderBottom: activeTab === 'multiple_choice' ? '2.5px solid var(--gold-primary)' : 'none',
              background: 'none'
            }}
          >
            <Sparkles size={16} />
            اختبار الخيارات (Quiz)
          </button>
        </div>

        {/* محتوى النمط الأول: البطاقات الذكية */}
        {activeTab === 'flashcard' && (
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-gold)', fontWeight: '700' }}>
                {currentGroup.title}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                بطاقة {currentGroupIndex + 1} من {MUTASHABIHAT_GROUPS.length}
              </span>
            </div>

            {/* بطاقة الاستذكار القابلة للقلب */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1.5px solid var(--border-strong)',
                borderRadius: 'var(--radius-lg)',
                padding: '30px 24px',
                textAlign: 'center',
                cursor: 'pointer',
                minHeight: '220px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: 'var(--shadow-card)',
                transition: 'transform 0.3s'
              }}
            >
              <span style={{
                fontSize: '13px',
                backgroundColor: 'var(--bg-muted)',
                color: 'var(--text-gold)',
                padding: '3px 12px',
                borderRadius: 'var(--radius-full)',
                marginBottom: '14px',
                fontWeight: '700'
              }}>
                سورة {currentVerse.surahName} (الآية {currentVerse.ayahNumber})
              </span>

              {!isFlipped ? (
                <div>
                  <p style={{
                    fontFamily: 'var(--font-quran-amiri)',
                    fontSize: '24px',
                    color: 'var(--text-main)',
                    lineHeight: '2.2',
                    margin: '0 0 16px 0'
                  }}>
                    {currentVerse.diffTokens ? (
                      currentVerse.diffTokens.map((t, i) => (
                        <span key={i}>
                          {t.isDiff ? (
                            <span style={{
                              backgroundColor: 'var(--border-strong)',
                              color: 'transparent',
                              borderRadius: '4px',
                              padding: '0 12px',
                              borderBottom: '2px dashed var(--gold-primary)',
                              userSelect: 'none'
                            }}>
                              [ ... اكمل الفارق ... ]
                            </span>
                          ) : (
                            t.text + ' '
                          )}
                        </span>
                      ))
                    ) : (
                      currentVerse.textUthmani
                    )}
                  </p>
                  <span style={{ fontSize: '12px', color: 'var(--gold-primary)', fontWeight: '600' }}>
                    👆 انقر على البطاقة لكشف اللفظ والفارق
                  </span>
                </div>
              ) : (
                <div className="animate-fade-in">
                  <p style={{
                    fontFamily: 'var(--font-quran-amiri)',
                    fontSize: '24px',
                    color: 'var(--text-main)',
                    lineHeight: '2.2',
                    margin: '0 0 16px 0'
                  }}>
                    {currentVerse.textUthmani}
                  </p>
                  <div style={{
                    backgroundColor: 'var(--bg-surface)',
                    padding: '10px 16px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '13px',
                    color: 'var(--text-gold)',
                    border: '1px solid var(--border-color)',
                    marginTop: '8px'
                  }}>
                    <strong>الضابط والفارق:</strong> {currentGroup.mnemonicRule?.poem || currentGroup.tawjeeh?.summary}
                  </div>
                </div>
              )}
            </div>

            {/* أزرار التقييم الذاتي والتنقل */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={() => { onMarkMastered(currentVerse.id); nextFlashcard(); }}
                style={{
                  flex: 1,
                  backgroundColor: 'rgba(16,185,129,0.15)',
                  color: 'var(--emerald-accent)',
                  border: '1px solid rgba(16,185,129,0.4)',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: '700'
                }}
              >
                <Check size={16} />
                أتقنتها بسهولة
              </button>

              <button
                onClick={() => { onMarkNeedsReview(currentVerse.id); nextFlashcard(); }}
                style={{
                  flex: 1,
                  backgroundColor: 'rgba(245,158,11,0.15)',
                  color: 'var(--amber-rule)',
                  border: '1px solid rgba(245,158,11,0.4)',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: '700'
                }}
              >
                <AlertCircle size={16} />
                تحتاج تثبيت ومراجعة
              </button>

              <button
                onClick={nextFlashcard}
                className="btn-outline"
                style={{ padding: '10px 16px' }}
              >
                <RotateCw size={16} />
                التالي
              </button>
            </div>
          </div>
        )}

        {/* محتوى النمط الثاني: الاختيار من متعدد */}
        {activeTab === 'multiple_choice' && (
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 14px',
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)'
            }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                السؤال {mcIndex + 1} من {mcQuestions.length}
              </span>
              <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--emerald-accent)' }}>
                النتيجة: {score} من {totalAnswered}
              </span>
            </div>

            {/* نص السؤال */}
            <div style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px',
              textAlign: 'center'
            }}>
              <span style={{
                display: 'inline-block',
                fontSize: '12px',
                fontWeight: '700',
                backgroundColor: 'rgba(212,175,55,0.15)',
                color: 'var(--gold-primary)',
                padding: '2px 10px',
                borderRadius: 'var(--radius-full)',
                marginBottom: '10px'
              }}>
                سورة {currentMc.surah} [آية {currentMc.ayahNum}]
              </span>
              <p style={{
                fontFamily: 'var(--font-quran-amiri)',
                fontSize: '22px',
                lineHeight: '2.2',
                color: 'var(--text-main)',
                margin: 0
              }}>
                {currentMc.questionText}
              </p>
            </div>

            {/* خيارات الإجابة */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {currentMc.options.map((opt, i) => {
                const isSelected = selectedOption === opt;
                const isCorrect = opt === currentMc.correctAnswer;
                let bg = 'var(--bg-surface)';
                let border = 'var(--border-color)';
                let textColor = 'var(--text-main)';

                if (selectedOption !== null) {
                  if (isCorrect) {
                    bg = 'rgba(16,185,129,0.15)';
                    border = 'var(--emerald-accent)';
                    textColor = 'var(--emerald-accent)';
                  } else if (isSelected) {
                    bg = 'rgba(239,68,68,0.15)';
                    border = 'var(--ruby-diff)';
                    textColor = 'var(--ruby-diff)';
                  }
                }

                return (
                  <button
                    key={i}
                    onClick={() => handleMcAnswer(opt)}
                    disabled={selectedOption !== null}
                    style={{
                      padding: '14px 18px',
                      borderRadius: 'var(--radius-md)',
                      border: `1.5px solid ${border}`,
                      backgroundColor: bg,
                      color: textColor,
                      fontSize: '18px',
                      fontFamily: 'var(--font-quran-amiri)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: selectedOption !== null ? 'default' : 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <span>{opt}</span>
                    {selectedOption !== null && isCorrect && (
                      <CheckCircle2 size={18} style={{ color: 'var(--emerald-accent)' }} />
                    )}
                    {selectedOption !== null && isSelected && !isCorrect && (
                      <XCircle size={18} style={{ color: 'var(--ruby-diff)' }} />
                    )}
                  </button>
                );
              })}
            </div>

            {/* التغذية الراجعة وزر التالي */}
            {selectedOption !== null && (
              <div className="animate-fade-in" style={{
                backgroundColor: 'var(--bg-card)',
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-main)', lineHeight: '1.6' }}>
                  <strong>التوجيه القرآني:</strong> {currentMc.explanation}
                </p>
                <button
                  onClick={nextMcQuestion}
                  className="btn-primary"
                  style={{ alignSelf: 'flex-end', padding: '8px 18px', fontSize: '13px' }}
                >
                  السؤال التالي
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

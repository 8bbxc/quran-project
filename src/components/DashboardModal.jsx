import React, { useState } from 'react';
import { 
  X, 
  BookMarked, 
  CheckCircle2, 
  AlertCircle, 
  Bookmark, 
  Sparkles, 
  PieChart, 
  Layers,
  ArrowRight,
  Clock,
  RotateCcw
} from 'lucide-react';
import { MUTASHABIHAT_GROUPS } from '../data/quranData';
import { getStoredSrsData, reviewVerseSrs, isDueToday } from '../utils/srsEngine';

export function DashboardModal({
  isOpen,
  onClose,
  masteredIds,
  needsReviewIds,
  favoriteIds,
  notes,
  onSelectVerse
}) {
  const [srsState, setSrsState] = useState(() => getStoredSrsData());

  if (!isOpen) return null;

  // إجمالي الآيات المتشابهة
  const allVerses = MUTASHABIHAT_GROUPS.flatMap(g => g.verses.map(v => ({ ...v, groupTitle: g.title })));
  const totalVerses = allVerses.length;

  const masteredCount = masteredIds.length;
  const needsReviewCount = needsReviewIds.length;
  const masteredPercentage = totalVerses > 0 ? Math.round((masteredCount / totalVerses) * 100) : 0;

  // الآيات المستحقة للمراجعة بنظام التكرار المتباعد
  const dueVerses = allVerses.filter(v => isDueToday(v.id));

  const handleRateSrs = (verseId, quality) => {
    reviewVerseSrs(verseId, quality);
    setSrsState(getStoredSrsData());
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
        maxWidth: '760px',
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
            <BookMarked size={22} style={{ color: 'var(--gold-primary)' }} />
            <h2 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>
              لوحة الإتقان ونظام التكرار المتباعد (SRS Dashboard)
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* بطاقات الإحصاءات العلوية */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '12px'
          }}>
            {/* نسبة الإتقان الكلية */}
            <div style={{
              backgroundColor: 'var(--bg-card)',
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>نسبة الإتقان</span>
              <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--gold-primary)', margin: '4px 0' }}>
                {masteredPercentage}%
              </div>
              <div style={{
                height: '6px',
                backgroundColor: 'var(--bg-muted)',
                borderRadius: '3px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${masteredPercentage}%`,
                  height: '100%',
                  backgroundColor: 'var(--emerald-accent)',
                  transition: 'width 0.4s'
                }} />
              </div>
            </div>

            {/* مستحق للمراجعة اليوم (SRS) */}
            <div style={{
              backgroundColor: 'var(--bg-card)',
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              border: '1.5px solid var(--gold-primary)',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '12px', color: 'var(--gold-primary)', fontWeight: '700' }}>مستحق اليوم (SRS)</span>
              <div style={{ fontSize: '26px', fontWeight: '800', color: 'var(--gold-primary)', margin: '4px 0' }}>
                {dueVerses.length}
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>جدول التكرار المتباعد</span>
            </div>

            {/* تم الإتقان */}
            <div style={{
              backgroundColor: 'var(--bg-card)',
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(16,185,129,0.3)',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '12px', color: 'var(--emerald-accent)' }}>مواضع متقنة</span>
              <div style={{ fontSize: '26px', fontWeight: '800', color: 'var(--emerald-accent)', margin: '4px 0' }}>
                {masteredCount}
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>من أصل {totalVerses}</span>
            </div>

            {/* تحتاج مراجعة */}
            <div style={{
              backgroundColor: 'var(--bg-card)',
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(245,158,11,0.3)',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '12px', color: 'var(--amber-rule)' }}>تحتاج تثبيت</span>
              <div style={{ fontSize: '26px', fontWeight: '800', color: 'var(--amber-rule)', margin: '4px 0' }}>
                {needsReviewCount}
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>موضع بحاجة تكرار</span>
            </div>
          </div>

          {/* قسم التكرار المتباعد (Spaced Repetition Queue) */}
          <div style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '18px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{
                fontSize: '15px',
                fontWeight: '700',
                color: 'var(--text-main)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                margin: 0
              }}>
                <Clock size={16} style={{ color: 'var(--gold-primary)' }} />
                جلسة المراجعة المتباعدة المجدولة لليوم ({dueVerses.length})
              </h3>
            </div>

            {dueVerses.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: '13px' }}>
                ✨ أحسنت! أتممت مراجعة جميع المواضع المستحقة لليوم وفق جدول التكرار المتباعد.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {dueVerses.slice(0, 3).map(v => {
                  const entry = srsState[v.id];
                  const currentInterval = entry?.interval || 1;

                  return (
                    <div
                      key={v.id}
                      style={{
                        backgroundColor: 'var(--bg-app)',
                        padding: '14px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-color)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-gold)' }}>
                          سورة {v.surahName} [آية {v.ayahNumber}]
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          الفترة الحالية: <strong>{currentInterval} يوم</strong>
                        </span>
                      </div>

                      <p style={{
                        fontFamily: 'var(--font-quran-amiri)',
                        fontSize: '17px',
                        color: 'var(--text-main)',
                        margin: '0 0 10px 0'
                      }}>
                        {v.textUthmani}
                      </p>

                      {/* أزرار تقييم الحفظ الأربعة */}
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => handleRateSrs(v.id, 1)}
                          style={{
                            padding: '4px 10px',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: 'rgba(239,68,68,0.15)',
                            color: 'var(--ruby-diff)',
                            border: '1px solid rgba(239,68,68,0.3)',
                            fontSize: '11px',
                            fontWeight: '700'
                          }}
                        >
                          أعد الآن (1 يوم)
                        </button>

                        <button
                          onClick={() => handleRateSrs(v.id, 2)}
                          style={{
                            padding: '4px 10px',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: 'rgba(245,158,11,0.15)',
                            color: 'var(--amber-rule)',
                            border: '1px solid rgba(245,158,11,0.3)',
                            fontSize: '11px',
                            fontWeight: '700'
                          }}
                        >
                          صعب (+1 يوم)
                        </button>

                        <button
                          onClick={() => handleRateSrs(v.id, 3)}
                          style={{
                            padding: '4px 10px',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: 'rgba(212,175,55,0.15)',
                            color: 'var(--gold-primary)',
                            border: '1px solid rgba(212,175,55,0.3)',
                            fontSize: '11px',
                            fontWeight: '700'
                          }}
                        >
                          جيد (+3 أيام)
                        </button>

                        <button
                          onClick={() => handleRateSrs(v.id, 4)}
                          style={{
                            padding: '4px 10px',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: 'rgba(16,185,129,0.15)',
                            color: 'var(--emerald-accent)',
                            border: '1px solid rgba(16,185,129,0.3)',
                            fontSize: '11px',
                            fontWeight: '700'
                          }}
                        >
                          متقن (+6 أيام)
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useMemo } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  BookOpen, 
  Sparkles, 
  Eye,
  Search,
  ExternalLink
} from 'lucide-react';
import { MUTASHABIHAT_GROUPS } from '../data/quranData';

export function MushafPageView({ isOpen, onClose, onSelectVerse }) {
  const [pageNumber, setPageNumber] = useState(2);
  const [activeMutashabihPreview, setActiveMutashabihPreview] = useState(null);

  // استخراج قائمة الصفحات التي تحتوي على مواضع متشابهة في قاعدة البيانات
  const pagesWithMutashabihat = useMemo(() => {
    const map = new Map();
    MUTASHABIHAT_GROUPS.forEach(g => {
      g.verses.forEach(v => {
        if (v.page) {
          if (!map.has(v.page)) {
            map.set(v.page, { page: v.page, surahName: v.surahName, juz: v.juz, versesCount: 0, groups: [] });
          }
          const item = map.get(v.page);
          item.versesCount += 1;
          if (!item.groups.some(grp => grp.id === g.id)) {
            item.groups.push(g);
          }
        }
      });
    });
    return Array.from(map.values()).sort((a, b) => a.page - b.page);
  }, []);

  if (!isOpen) return null;

  // جلب الآيات المتشابهة في الصفحة المختارة
  const pageVerses = MUTASHABIHAT_GROUPS.flatMap(g => 
    g.verses
      .filter(v => v.page === pageNumber)
      .map(v => ({ 
        ...v, 
        group: g,
        counterparts: g.verses.filter(other => other.id !== v.id)
      }))
  );

  const prevPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
      setActiveMutashabihPreview(null);
    }
  };

  const nextPage = () => {
    if (pageNumber < 604) {
      setPageNumber(pageNumber + 1);
      setActiveMutashabihPreview(null);
    }
  };

  const currentPageInfo = pagesWithMutashabihat.find(p => p.page === pageNumber);
  const surahTitle = pageVerses.length > 0 ? `سُورَةُ ${pageVerses[0].surahName}` : (currentPageInfo ? `سُورَةُ ${currentPageInfo.surahName}` : 'مصحف المدينة النبوية');
  const juzTitle = pageVerses.length > 0 ? `الجزء ${pageVerses[0].juz}` : (currentPageInfo ? `الجزء ${currentPageInfo.juz}` : `صفحة ${pageNumber}`);

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
      padding: '16px'
    }}>
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '2px solid var(--gold-primary)',
        width: '100%',
        maxWidth: '880px',
        maxHeight: '94vh',
        overflowY: 'auto',
        boxShadow: 'var(--shadow-player)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* شريط التحكم والتنقل العلوي */}
        <div style={{
          padding: '12px 20px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={20} style={{ color: 'var(--gold-primary)' }} />
            <h2 style={{ fontSize: '17px', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>
              عرض المصحف الشريف (604 صفحات) مع تظليل المتشابهات
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {/* قائمة الانتقال السريع للصفحات المرصودة */}
            <select
              value={pageNumber}
              onChange={(e) => {
                setPageNumber(parseInt(e.target.value));
                setActiveMutashabihPreview(null);
              }}
              style={{
                backgroundColor: 'var(--bg-card)',
                color: 'var(--gold-primary)',
                border: '1px solid var(--gold-primary)',
                borderRadius: 'var(--radius-sm)',
                padding: '5px 10px',
                fontSize: '12px',
                fontWeight: '700',
                outline: 'none',
                cursor: 'pointer'
              }}
              title="انتقال سريع للصفحات التي تحتوي على مواضع متشابهة مرصودة"
            >
              <option value="">-- انتقال لصفحات المتشابهات ({pagesWithMutashabihat.length}) --</option>
              {pagesWithMutashabihat.map(p => (
                <option key={p.page} value={p.page}>
                  صفحة {p.page} • {p.surahName} (جزء {p.juz})
                </option>
              ))}
            </select>

            {/* إدخال رقم الصفحة المباشر */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button onClick={nextPage} className="btn-outline" style={{ padding: '6px 10px' }} title="الصفحة التالية">
                <ChevronRight size={16} />
              </button>

              <input
                type="number"
                min="1"
                max="604"
                value={pageNumber}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (val >= 1 && val <= 604) {
                    setPageNumber(val);
                    setActiveMutashabihPreview(null);
                  }
                }}
                style={{
                  width: '58px',
                  textAlign: 'center',
                  backgroundColor: 'var(--bg-card)',
                  color: 'var(--gold-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '4px',
                  fontSize: '13px',
                  fontWeight: '800'
                }}
                title="أدخل رقم الصفحة من 1 إلى 604"
              />

              <button onClick={prevPage} className="btn-outline" style={{ padding: '6px 10px' }} title="الصفحة السابقة">
                <ChevronLeft size={16} />
              </button>
            </div>

            <button 
              onClick={onClose} 
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
              title="إغلاق"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* إطار صفحة المصحف الشريف المذهب */}
        <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{
            width: '100%',
            maxWidth: '720px',
            backgroundColor: 'var(--bg-card)',
            border: '8px double var(--gold-primary)',
            borderRadius: 'var(--radius-md)',
            padding: '24px 28px',
            boxShadow: 'inset 0 0 25px rgba(212,175,55,0.08), var(--shadow-card)',
            position: 'relative',
            minHeight: '440px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            {/* ترويسة الصفحة (اسم السورة والجزء) */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1.5px solid var(--gold-primary)',
              paddingBottom: '8px',
              marginBottom: '16px',
              fontSize: '13px',
              fontWeight: '700',
              color: 'var(--gold-primary)'
            }}>
              <span>{juzTitle}</span>
              <span style={{ fontSize: '16px', fontFamily: 'var(--font-quran-scheherazade)' }}>
                {surahTitle}
              </span>
              <span>صفحة {pageNumber}</span>
            </div>

            {/* البسملة في فواتح السور والصفحة 2 */}
            {pageNumber === 2 && (
              <div style={{
                textAlign: 'center',
                marginBottom: '14px',
                fontSize: '22px',
                fontFamily: 'var(--font-quran-amiri)',
                color: 'var(--gold-primary)'
              }}>
                بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
              </div>
            )}

            {/* نص الصفحة مع إبراز المتشابهات التفاعلي */}
            <div style={{
              fontFamily: 'var(--font-quran-amiri)',
              fontSize: '24px',
              lineHeight: '2.4',
              textAlign: 'justify',
              textAlignLast: 'center',
              color: 'var(--text-main)',
              flex: 1
            }}>
              {pageVerses.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {pageVerses.map((v, idx) => {
                    const isSelected = activeMutashabihPreview?.id === v.id;
                    const counterpart = v.counterparts[0];

                    return (
                      <div 
                        key={v.id}
                        style={{
                          backgroundColor: isSelected ? 'rgba(212,175,55,0.18)' : 'rgba(212,175,55,0.06)',
                          border: isSelected ? '1.5px solid var(--gold-primary)' : '1px dashed rgba(212,175,55,0.4)',
                          borderRadius: 'var(--radius-md)',
                          padding: '12px 16px',
                          transition: 'all 0.2s',
                          position: 'relative'
                        }}
                      >
                        {/* شارة توضيح الموضع المتشابه */}
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '6px',
                          fontSize: '11px',
                          fontWeight: '700',
                          color: 'var(--gold-primary)',
                          fontFamily: 'var(--font-ui)'
                        }}>
                          <span>
                            آية {v.ayahNumber} • {v.surahName}
                          </span>
                          {counterpart && (
                            <span 
                              onClick={() => setActiveMutashabihPreview(v)}
                              style={{
                                cursor: 'pointer',
                                backgroundColor: 'rgba(212,175,55,0.15)',
                                padding: '2px 8px',
                                borderRadius: 'var(--radius-sm)',
                                textDecoration: 'underline'
                              }}
                            >
                              ✨ نظيرتها في سورة {counterpart.surahName} [آية {counterpart.ayahNumber}]
                            </span>
                          )}
                        </div>

                        {/* نص الآية بالرسم العثماني */}
                        <div 
                          onClick={() => setActiveMutashabihPreview(v)}
                          style={{ cursor: 'pointer' }}
                          title="انقر لمعاينة الفارق والضابط الحفظي"
                        >
                          {v.diffTokens ? (
                            v.diffTokens.map((token, tIdx) => (
                              <span
                                key={tIdx}
                                style={{
                                  backgroundColor: token.isDiff ? 'rgba(239,68,68,0.22)' : 'transparent',
                                  color: token.isDiff ? 'var(--ruby-diff)' : 'inherit',
                                  fontWeight: token.isDiff ? '700' : 'normal',
                                  borderRadius: '3px',
                                  padding: token.isDiff ? '1px 4px' : '0'
                                }}
                              >
                                {token.text}{' '}
                              </span>
                            ))
                          ) : (
                            <span>{v.textUthmani}</span>
                          )}
                          <span className="ayah-end-badge">{v.ayahNumber}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                  <Sparkles size={36} style={{ color: 'var(--gold-primary)', marginBottom: '14px' }} />
                  <p style={{ margin: '0 0 14px 0', fontSize: '18px' }}>
                    صفحة <strong>{pageNumber}</strong> من المصحف الشريف
                  </p>
                  <p style={{ margin: 0, fontSize: '14px', fontFamily: 'var(--font-ui)', color: 'var(--text-muted)' }}>
                    تضم المنصة حالياً <strong>{pagesWithMutashabihat.length} صفحة</strong> تحتوي على مواضع متشابهة مفهرسة بدقة بالغة. اختر أي صفحة من القائمة العلوية لمعاينة الآيات المتشابهة في سياق الصفحة!
                  </p>
                  <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    {[2, 3, 67, 115, 203, 377, 540, 603].map(pNum => (
                      <button
                        key={pNum}
                        onClick={() => { setPageNumber(pNum); setActiveMutashabihPreview(null); }}
                        className="btn-outline"
                        style={{ padding: '4px 10px', fontSize: '12px' }}
                      >
                        صفحة {pNum}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* رقم الصفحة أسفل الإطار */}
            <div style={{
              textAlign: 'center',
              borderTop: '1px solid var(--border-color)',
              paddingTop: '8px',
              marginTop: '16px',
              fontSize: '14px',
              fontWeight: '800',
              color: 'var(--gold-primary)'
            }}>
              — {pageNumber} —
            </div>
          </div>

          {/* درج معاينة المتشابهة المقابلة المنبثق أسفل الصفحة */}
          {activeMutashabihPreview && (
            <div className="animate-fade-in" style={{
              marginTop: '16px',
              width: '100%',
              maxWidth: '720px',
              backgroundColor: 'var(--bg-card)',
              border: '1.5px solid var(--gold-primary)',
              borderRadius: 'var(--radius-md)',
              padding: '16px 20px',
              boxShadow: 'var(--shadow-card)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--gold-primary)' }}>
                  ✨ موضع التشابه والنظير: {activeMutashabihPreview.group?.title}
                </span>
                <button
                  onClick={() => setActiveMutashabihPreview(null)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* المقارنة السريعة بين الموضعين */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                {activeMutashabihPreview.group?.verses.map((v) => (
                  <div
                    key={v.id}
                    style={{
                      backgroundColor: v.id === activeMutashabihPreview.id ? 'rgba(212,175,55,0.1)' : 'var(--bg-surface)',
                      border: v.id === activeMutashabihPreview.id ? '1px solid var(--gold-primary)' : '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '10px 14px'
                    }}
                  >
                    <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--emerald-accent)', marginBottom: '4px' }}>
                      سورة {v.surahName} [آية {v.ayahNumber}] — ص {v.page}
                    </div>
                    <p style={{
                      fontFamily: 'var(--font-quran-amiri)',
                      fontSize: '17px',
                      color: 'var(--text-main)',
                      lineHeight: '1.8',
                      margin: 0
                    }}>
                      {v.textUthmani}
                    </p>
                  </div>
                ))}
              </div>

              {/* الضابط الحفظي إن وجد */}
              {activeMutashabihPreview.group?.mnemonicRule && (
                <div style={{
                  backgroundColor: 'rgba(212,175,55,0.08)',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '12px',
                  color: 'var(--text-gold)'
                }}>
                  <strong>الضابط الحفظي:</strong> {activeMutashabihPreview.group.mnemonicRule.poem || activeMutashabihPreview.group.mnemonicRule.ruleName}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '4px' }}>
                <button
                  onClick={() => {
                    onSelectVerse(activeMutashabihPreview);
                    onClose();
                  }}
                  className="btn-primary"
                  style={{ padding: '6px 14px', fontSize: '12px' }}
                >
                  <ExternalLink size={14} style={{ marginLeft: '4px' }} />
                  فتح التفسير والتوجيه الكامل في الواجهة الرئيسية
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

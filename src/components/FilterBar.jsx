import React from 'react';
import { Filter, Check, Bookmark, AlertCircle, Sparkles, BookOpen } from 'lucide-react';
import { CATEGORIES_LIST, SURAHS_LIST, JUZ_LIST } from '../data/quranData';

export function FilterBar({
  selectedCategory,
  setSelectedCategory,
  selectedSurah,
  setSelectedSurah,
  selectedJuz,
  setSelectedJuz,
  statusFilter,
  setStatusFilter,
  totalResults
}) {
  return (
    <div style={{
      maxWidth: '1350px',
      margin: '16px auto 8px',
      padding: '0 18px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    }}>
      {/* الصف الأول: تصنيف أنواع المتشابهات */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '4px'
      }}>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '13px',
          fontWeight: '700',
          color: 'var(--text-muted)',
          whiteSpace: 'nowrap',
          marginLeft: '4px'
        }}>
          <Filter size={14} />
          النوع:
        </span>
        {CATEGORIES_LIST.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '5px 12px',
                borderRadius: 'var(--radius-full)',
                fontSize: '12px',
                fontWeight: isActive ? '700' : '500',
                whiteSpace: 'nowrap',
                backgroundColor: isActive ? 'var(--gold-primary)' : 'var(--bg-surface)',
                color: isActive ? '#081214' : 'var(--text-main)',
                border: isActive ? '1px solid var(--gold-primary)' : '1px solid var(--border-color)',
                boxShadow: isActive ? '0 2px 8px rgba(212,175,55,0.25)' : 'none',
                cursor: 'pointer'
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* الصف الثاني: فلتر السورة وفلتر الجزء وحالة الحفظ */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px',
        padding: '10px 14px',
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* اختيار السورة */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <label htmlFor="surah-select" style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)' }}>
              السورة:
            </label>
            <select
              id="surah-select"
              value={selectedSurah}
              onChange={(e) => setSelectedSurah(e.target.value)}
              style={{
                padding: '5px 10px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-card)',
                color: 'var(--text-main)',
                border: '1px solid var(--border-color)',
                fontSize: '12px',
                fontFamily: 'var(--font-ui)',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="all">جميع السور</option>
              {SURAHS_LIST.map((s) => (
                <option key={s.number} value={s.number}>
                  سورة {s.name} ({s.totalVerses} آية)
                </option>
              ))}
            </select>
          </div>

          {/* اختيار الجزء */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <label htmlFor="juz-select" style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)' }}>
              الجزء:
            </label>
            <select
              id="juz-select"
              value={selectedJuz}
              onChange={(e) => setSelectedJuz(e.target.value)}
              style={{
                padding: '5px 10px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-card)',
                color: 'var(--text-main)',
                border: '1px solid var(--border-color)',
                fontSize: '12px',
                fontFamily: 'var(--font-ui)',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="all">جميع الأجزاء (30 جزءاً)</option>
              {JUZ_LIST.map((j) => (
                <option key={j.number} value={j.number}>
                  {j.name}
                </option>
              ))}
            </select>
          </div>

          {/* فلاتر حالة الحفظ */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)' }}>الحالة:</span>
            {[
              { id: 'all', label: 'الكل' },
              { id: 'mastered', label: 'أتقنته', icon: Check, color: 'var(--emerald-accent)' },
              { id: 'needsReview', label: 'يحتاج مراجعة', icon: AlertCircle, color: 'var(--amber-rule)' },
              { id: 'favorites', label: 'المفضلة', icon: Bookmark, color: 'var(--gold-primary)' }
            ].map((st) => {
              const active = statusFilter === st.id;
              return (
                <button
                  key={st.id}
                  onClick={() => setStatusFilter(st.id)}
                  style={{
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '12px',
                    fontWeight: active ? '700' : '500',
                    backgroundColor: active ? (st.color ? `${st.color}22` : 'var(--bg-muted)') : 'transparent',
                    color: active ? (st.color || 'var(--gold-primary)') : 'var(--text-muted)',
                    border: active ? `1px solid ${st.color || 'var(--gold-primary)'}` : '1px solid transparent'
                  }}
                >
                  {st.icon && <st.icon size={12} style={{ marginLeft: '4px', verticalAlign: 'middle' }} />}
                  {st.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* عدد النتائج */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '12px',
          color: 'var(--text-muted)'
        }}>
          <Sparkles size={14} style={{ color: 'var(--gold-primary)' }} />
          <span>المواضع المعروضة:</span>
          <strong style={{ color: 'var(--gold-primary)' }}>{totalResults}</strong>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { 
  BookOpen, 
  Search, 
  Moon, 
  Sun, 
  BookMarked, 
  Award, 
  HelpCircle, 
  CheckCircle2, 
  Type, 
  Share2, 
  X,
  Mic,
  Network,
  Scale,
  Image as ImageIcon,
  Clock
} from 'lucide-react';

export function Navbar({
  theme,
  setTheme,
  searchQuery,
  setSearchQuery,
  onOpenQuiz,
  onOpenVoiceTest,
  onOpenMushafView,
  onOpenGraph,
  onOpenCustomDiff,
  onOpenInfographic,
  onOpenDashboard,
  onOpenVerification,
  onOpenHalaqah,
  onOpenFontSettings,
  stats,
  srsDueCount
}) {
  const toggleTheme = () => {
    if (theme === 'dark') setTheme('light');
    else if (theme === 'light') setTheme('sepia');
    else setTheme('dark');
  };

  const themeLabel = theme === 'dark' ? 'ليلي' : theme === 'light' ? 'نهاري' : 'ورقي';

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 40,
      backgroundColor: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border-color)',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      transition: 'background-color var(--transition-speed)'
    }}>
      <div style={{
        maxWidth: '1350px',
        margin: '0 auto',
        padding: '10px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        {/* الشعار والهوية البصرية */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, rgba(212,175,55,0.2) 0%, rgba(16,185,129,0.2) 100%)',
            border: '1.5px solid var(--gold-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--gold-primary)'
          }}>
            <BookOpen size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <h1 style={{
                fontSize: '19px',
                fontWeight: '800',
                color: 'var(--text-main)',
                margin: 0
              }}>
                مُتَشَابِهَاتُ القُرْآنِ
              </h1>
              <span style={{
                backgroundColor: 'rgba(212,175,55,0.15)',
                color: 'var(--gold-primary)',
                fontSize: '11px',
                fontWeight: '700',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid rgba(212,175,55,0.3)'
              }}>
                برواية حفص
              </span>
            </div>
            <p style={{
              fontSize: '11px',
              color: 'var(--text-muted)',
              margin: '2px 0 0 0'
            }}>
              الرسم العثماني التام • التوجيه السلفي • المقارنة الذكية
            </p>
          </div>
        </div>

        {/* شريط البحث الذكي */}
        <div style={{
          flex: '1 1 260px',
          maxWidth: '360px',
          position: 'relative'
        }}>
          <Search size={16} style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)'
          }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث بالآية، الكلمة، السورة..."
            style={{
              width: '100%',
              padding: '8px 36px 8px 32px',
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-main)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-full)',
              fontSize: '13px',
              outline: 'none',
              transition: 'border-color 0.2s',
              fontFamily: 'var(--font-ui)'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '2px'
              }}
              title="مسح البحث"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* أزرار الميزات الـ 7 والأدوات الاستراتيجية */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          {/* 1. التسميع الصوتي الذكي */}
          <button
            onClick={onOpenVoiceTest}
            className="btn-outline"
            style={{ padding: '6px 10px', color: 'var(--emerald-accent)', borderColor: 'rgba(16,185,129,0.4)' }}
            title="التسميع الصوتي الذكي (Voice Memorization)"
          >
            <Mic size={16} />
            <span style={{ fontSize: '12px' }}>تسميع</span>
          </button>

          {/* 2. عرض صفحة المصحف (604 صفحات) */}
          <button
            onClick={onOpenMushafView}
            className="btn-outline"
            style={{ padding: '6px 10px' }}
            title="عرض صفحات المصحف الشريف"
          >
            <BookOpen size={16} />
            <span style={{ fontSize: '12px' }}>المصحف</span>
          </button>

          {/* 3. خريطة المتشابهات التفاعلية */}
          <button
            onClick={onOpenGraph}
            className="btn-outline"
            style={{ padding: '6px 10px' }}
            title="خريطة المتشابهات الذهنية التفاعلية"
          >
            <Network size={16} />
            <span style={{ fontSize: '12px' }}>الخريطة</span>
          </button>

          {/* 4. المقارنة الحرة بين أي آيتين */}
          <button
            onClick={onOpenCustomDiff}
            className="btn-outline"
            style={{ padding: '6px 10px' }}
            title="أداة المقارنة الحرة بين أي آيتين"
          >
            <Scale size={16} />
            <span style={{ fontSize: '12px' }}>مقارنة حرة</span>
          </button>

          {/* 5. مولد بطاقات الصور الدعوية */}
          <button
            onClick={onOpenInfographic}
            className="btn-outline"
            style={{ padding: '6px 10px' }}
            title="توليد بطاقات صور دعوية للمشاركة"
          >
            <ImageIcon size={16} />
          </button>

          {/* وضع الاختبار */}
          <button
            onClick={onOpenQuiz}
            style={{
              backgroundColor: 'var(--gold-primary)',
              color: '#081214',
              fontWeight: '700',
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)'
            }}
            title="اختبار تثبيت المتشابهات"
          >
            <Award size={16} />
            <span style={{ fontSize: '12px' }}>اختبر حفظك</span>
          </button>

          {/* الإحصائيات والإتقان ونظام SRS */}
          <button
            onClick={onOpenDashboard}
            className="btn-outline"
            style={{ padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '5px' }}
            title="لوحة الإتقان ونظام المراجعة المتباعدة (SRS)"
          >
            <BookMarked size={16} />
            <span style={{
              backgroundColor: 'var(--emerald-accent)',
              color: '#ffffff',
              fontSize: '11px',
              padding: '1px 6px',
              borderRadius: '10px',
              fontWeight: '700'
            }} title="المواضع المتقنة">
              {stats.masteredCount}
            </span>
            {srsDueCount > 0 && (
              <span style={{
                backgroundColor: 'var(--ruby-diff)',
                color: '#ffffff',
                fontSize: '11px',
                padding: '1px 6px',
                borderRadius: '10px',
                fontWeight: '700',
                animation: 'pulse 2s infinite'
              }} title={`${srsDueCount} موضع مستحق للمراجعة اليوم في نظام التكرار المتباعد`}>
                {srsDueCount} مراجعة
              </span>
            )}
          </button>

          {/* نمط الخط */}
          <button
            onClick={onOpenFontSettings}
            className="btn-outline"
            style={{ padding: '6px 8px' }}
            title="إعدادات الخط القرآني"
          >
            <Type size={16} />
          </button>

          {/* ختم التدقيق */}
          <button
            onClick={onOpenVerification}
            className="btn-outline"
            style={{ padding: '6px 8px', color: 'var(--gold-primary)' }}
            title="ختم التوثيق الشرعي"
          >
            <CheckCircle2 size={16} />
          </button>

          {/* تبديل السمة */}
          <button
            onClick={toggleTheme}
            className="btn-outline"
            style={{ padding: '6px 10px', minWidth: '75px' }}
            title="تبديل وضع الإضاءة"
          >
            {theme === 'dark' ? <Moon size={15} /> : theme === 'light' ? <Sun size={15} /> : <BookOpen size={15} />}
            <span style={{ fontSize: '11px' }}>{themeLabel}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

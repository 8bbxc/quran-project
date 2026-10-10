import React, { useState, useEffect, useMemo } from 'react';
import { 
  MUTASHABIHAT_GROUPS, 
  SURAHS_LIST,
  JUZ_LIST
} from './data/quranData';
import { RECITERS } from './data/reciters';
import { matchVerseSearch } from './utils/searchUtils';
import { getStoredUserData, saveStoredUserData } from './utils/storage';
import { getDueCount } from './utils/srsEngine';

import { Navbar } from './components/Navbar';
import { FilterBar } from './components/FilterBar';
import { VerseCard } from './components/VerseCard';
import { AudioPlayer } from './components/AudioPlayer';
import { QuizModal } from './components/QuizModal';
import { DashboardModal } from './components/DashboardModal';
import { VerificationModal } from './components/VerificationModal';
import { HalaqahModal } from './components/HalaqahModal';
import { FontSettingsModal } from './components/FontSettingsModal';

// الميزات السبع الاستراتيجية الجديدة:
import { VoiceTestingModal } from './components/VoiceTestingModal';
import { MushafPageView } from './components/MushafPageView';
import { QuranGraphModal } from './components/QuranGraphModal';
import { CustomDiffModal } from './components/CustomDiffModal';
import { InfographicGeneratorModal } from './components/InfographicGeneratorModal';

import { 
  BookOpen, 
  ShieldCheck, 
  Sparkles, 
  Award, 
  CheckCircle2, 
  Search,
  Mic,
  Network,
  Scale,
  Image as ImageIcon
} from 'lucide-react';

export default function App() {
  // تحميل الحالة المحفوظة للمستخدم
  const [userData, setUserData] = useState(() => getStoredUserData());

  // الحالة العامة للتطبيق
  const [theme, setTheme] = useState(userData.theme || 'dark');
  const [fontFamily, setFontFamily] = useState(userData.fontFamily || 'amiri-quran');
  const [fontSize, setFontSize] = useState(userData.fontSize || 28);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [selectedSurah, setSelectedSurah] = useState('all');
  const [selectedJuz, setSelectedJuz] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // المشغل الصوتي
  const [selectedReciterId, setSelectedReciterId] = useState(userData.selectedReciterId || 'husary');
  const [audioSpeed, setAudioSpeed] = useState(userData.audioSpeed || 1.0);
  const [audioLoopCount, setAudioLoopCount] = useState(userData.audioLoopCount || 2);
  const [smartAlternatePlay, setSmartAlternatePlay] = useState(userData.smartAlternatePlay ?? true);
  const [activeVerse, setActiveVerse] = useState(null);
  const [activeGroup, setActiveGroup] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // النوافذ المنبثقة
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [isHalaqahOpen, setIsHalaqahOpen] = useState(false);
  const [isFontSettingsOpen, setIsFontSettingsOpen] = useState(false);
  const [reportingTargetVerse, setReportingTargetVerse] = useState(null);

  // النوافذ للميزات السبع الجديدة
  const [isVoiceTestOpen, setIsVoiceTestOpen] = useState(false);
  const [isMushafViewOpen, setIsMushafViewOpen] = useState(false);
  const [isGraphOpen, setIsGraphOpen] = useState(false);
  const [isCustomDiffOpen, setIsCustomDiffOpen] = useState(false);
  const [isInfographicOpen, setIsInfographicOpen] = useState(false);
  const [infographicTargetGroup, setInfographicTargetGroup] = useState(null);

  // تطبيق السمة على وسم html
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // حفظ التغييرات في التخزين المحلي
  useEffect(() => {
    const updated = {
      ...userData,
      theme,
      fontFamily,
      fontSize,
      selectedReciterId,
      audioSpeed,
      audioLoopCount,
      smartAlternatePlay
    };
    saveStoredUserData(updated);
  }, [theme, fontFamily, fontSize, selectedReciterId, audioSpeed, audioLoopCount, smartAlternatePlay, userData]);

  // دوال تعديل حالة الإتقان والملاحظات
  const handleToggleMastered = (verseId) => {
    setUserData(prev => {
      const exists = prev.masteredGroupIds.includes(verseId);
      const newMastered = exists 
        ? prev.masteredGroupIds.filter(id => id !== verseId)
        : [...prev.masteredGroupIds, verseId];
      const newReview = prev.needsReviewGroupIds.filter(id => id !== verseId);
      return { ...prev, masteredGroupIds: newMastered, needsReviewGroupIds: newReview };
    });
  };

  const handleToggleNeedsReview = (verseId) => {
    setUserData(prev => {
      const exists = prev.needsReviewGroupIds.includes(verseId);
      const newReview = exists
        ? prev.needsReviewGroupIds.filter(id => id !== verseId)
        : [...prev.needsReviewGroupIds, verseId];
      const newMastered = prev.masteredGroupIds.filter(id => id !== verseId);
      return { ...prev, needsReviewGroupIds: newReview, masteredGroupIds: newMastered };
    });
  };

  const handleToggleFavorite = (verseId) => {
    setUserData(prev => {
      const exists = prev.favoriteGroupIds.includes(verseId);
      const newFavs = exists
        ? prev.favoriteGroupIds.filter(id => id !== verseId)
        : [...prev.favoriteGroupIds, verseId];
      return { ...prev, favoriteGroupIds: newFavs };
    });
  };

  const handleSaveNote = (verseId, note) => {
    setUserData(prev => ({
      ...prev,
      notes: { ...prev.notes, [verseId]: note }
    }));
  };

  const handlePlayVerse = (verse, group) => {
    if (activeVerse?.id === verse.id) {
      setIsPlaying(!isPlaying);
    } else {
      setActiveVerse(verse);
      setActiveGroup(group);
      setIsPlaying(true);
    }
  };

  const handleReportIssue = (verse) => {
    setReportingTargetVerse(verse);
    setIsVerificationOpen(true);
  };

  const handleOpenInfographic = (group) => {
    setInfographicTargetGroup(group);
    setIsInfographicOpen(true);
  };

  // تصفية مواضع المتشابهات بناء على البحث والتصنيف والسورة والجزء وحالة الحفظ
  const filteredGroups = useMemo(() => {
    return MUTASHABIHAT_GROUPS.filter(group => {
      // 1. فلتر التصنيف
      if (selectedCategory !== 'الكل') {
        const matchesCat = 
          group.category === selectedCategory || 
          group.subCategory === selectedCategory || 
          group.scope === selectedCategory;
        if (!matchesCat) return false;
      }

      // 2. فلتر السورة
      if (selectedSurah !== 'all') {
        const surahNum = parseInt(selectedSurah);
        const hasSurah = group.verses.some(v => v.surahNumber === surahNum);
        if (!hasSurah) return false;
      }

      // 3. فلتر الجزء
      if (selectedJuz !== 'all') {
        const juzNum = parseInt(selectedJuz);
        const hasJuz = group.verses.some(v => v.juz === juzNum);
        if (!hasJuz) return false;
      }

      // 4. فلتر حالة الحفظ
      if (statusFilter !== 'all') {
        if (statusFilter === 'mastered') {
          const hasMastered = group.verses.some(v => userData.masteredGroupIds.includes(v.id));
          if (!hasMastered) return false;
        } else if (statusFilter === 'needsReview') {
          const hasReview = group.verses.some(v => userData.needsReviewGroupIds.includes(v.id));
          if (!hasReview) return false;
        } else if (statusFilter === 'favorites') {
          const hasFav = group.verses.some(v => userData.favoriteGroupIds.includes(v.id));
          if (!hasFav) return false;
        }
      }

      // 5. مطابقة البحث الذكي القرآني
      return matchVerseSearch(group, searchQuery);
    });
  }, [searchQuery, selectedCategory, selectedSurah, selectedJuz, statusFilter, userData]);

  const allVerseIds = useMemo(() => 
    MUTASHABIHAT_GROUPS.flatMap(g => g.verses.map(v => v.id)), []
  );
  const srsDueCount = useMemo(() => getDueCount(allVerseIds), [allVerseIds]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', paddingBottom: activeVerse ? '110px' : '40px' }}>
      {/* شريط الملاحة العلوي */}
      <Navbar
        theme={theme}
        setTheme={setTheme}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenQuiz={() => setIsQuizOpen(true)}
        onOpenVoiceTest={() => setIsVoiceTestOpen(true)}
        onOpenMushafView={() => setIsMushafViewOpen(true)}
        onOpenGraph={() => setIsGraphOpen(true)}
        onOpenCustomDiff={() => setIsCustomDiffOpen(true)}
        onOpenInfographic={() => { setInfographicTargetGroup(null); setIsInfographicOpen(true); }}
        onOpenDashboard={() => setIsDashboardOpen(true)}
        onOpenVerification={() => { setReportingTargetVerse(null); setIsVerificationOpen(true); }}
        onOpenHalaqah={() => setIsHalaqahOpen(true)}
        onOpenFontSettings={() => setIsFontSettingsOpen(true)}
        stats={{
          masteredCount: userData.masteredGroupIds.length,
          needsReviewCount: userData.needsReviewGroupIds.length
        }}
        srsDueCount={srsDueCount}
      />

      {/* البانر الترحيبي التعريفي */}
      <section style={{
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-color)',
        padding: '24px 20px 20px',
        textAlign: 'center',
        background: 'radial-gradient(ellipse at top, rgba(212,175,55,0.08) 0%, transparent 70%)'
      }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(212,175,55,0.12)',
            border: '1px solid var(--gold-primary)',
            padding: '4px 14px',
            borderRadius: 'var(--radius-full)',
            color: 'var(--gold-primary)',
            fontSize: '12px',
            fontWeight: '700',
            marginBottom: '10px'
          }}>
            <ShieldCheck size={15} />
            <span>معتمد ومطابق لمصحف مجمع الملك فهد ومصحف KSU الإلكتروني وترتيل</span>
          </div>

          <h2 style={{
            fontSize: '26px',
            fontWeight: '800',
            color: 'var(--text-main)',
            margin: '0 0 8px 0',
            letterSpacing: '-0.5px'
          }}>
            تيسير حفظ وضبط متشابهات القرآن الكريم
          </h2>

          <p style={{
            fontSize: '14px',
            color: 'var(--text-muted)',
            lineHeight: '1.8',
            maxWidth: '780px',
            margin: '0 auto 16px'
          }}>
            منصة تخصصية لحُفّاظ كتاب الله تجمع بين **الرسم العثماني التام**، **التظليل البصري الذكي للفوارق**، **التسميع الصوتي بالميكروفون**، **عرض صفحات المصحف**، **الخرائط الذهنية**، و**المقارنة الصوتية التناوبية** بين الآيات المتشابهة.
          </p>

          {/* أشرطة الوصول السريع للميزات السبع */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => setIsVoiceTestOpen(true)}
              style={{
                backgroundColor: 'rgba(16,185,129,0.15)',
                color: 'var(--emerald-accent)',
                border: '1px solid rgba(16,185,129,0.4)',
                padding: '6px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: '12px',
                fontWeight: '700'
              }}
            >
              <Mic size={15} />
              التسميع الصوتي الذكي
            </button>

            <button
              onClick={() => setIsMushafViewOpen(true)}
              className="btn-outline"
              style={{ padding: '6px 14px', fontSize: '12px' }}
            >
              <BookOpen size={15} />
              صفحات المصحف (604 ص)
            </button>

            <button
              onClick={() => setIsGraphOpen(true)}
              className="btn-outline"
              style={{ padding: '6px 14px', fontSize: '12px' }}
            >
              <Network size={15} />
              الخريطة الذهنية التفاعلية
            </button>

            <button
              onClick={() => setIsCustomDiffOpen(true)}
              className="btn-outline"
              style={{ padding: '6px 14px', fontSize: '12px' }}
            >
              <Scale size={15} />
              أداة المقارنة الحرة
            </button>

            <button
              onClick={() => setIsQuizOpen(true)}
              className="btn-primary"
              style={{ padding: '6px 16px', fontSize: '12px' }}
            >
              <Award size={15} />
              بدء جلسة اختبار المتشابهات
            </button>
          </div>
        </div>
      </section>

      {/* شريط الفلاتر والتصنيفات */}
      <FilterBar
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedSurah={selectedSurah}
        setSelectedSurah={setSelectedSurah}
        selectedJuz={selectedJuz}
        setSelectedJuz={setSelectedJuz}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        totalResults={filteredGroups.length}
      />

      {/* المحتوى الرئيسي: مجموعات المتشابهات والبطاقات */}
      <main style={{
        maxWidth: '1350px',
        margin: '10px auto 40px',
        padding: '0 18px',
        width: '100%',
        flex: 1
      }}>
        {filteredGroups.length === 0 ? (
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1.5px dashed var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '50px 20px',
            textAlign: 'center',
            marginTop: '30px'
          }}>
            <Search size={40} style={{ color: 'var(--text-muted)', marginBottom: '14px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-main)', margin: '0 0 8px 0' }}>
              لم يتم العثور على مواضع مطابقة
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto 16px' }}>
              جرب تغيير كلمات البحث، أو اختر تصنيفاً آخر، أو ألغِ فلتر السورة والجزء لإظهار جميع المواضع.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('الكل'); setSelectedSurah('all'); setSelectedJuz('all'); setStatusFilter('all'); }}
              className="btn-primary"
              style={{ padding: '8px 20px', fontSize: '13px' }}
            >
              عرض جميع المتشابهات
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {filteredGroups.map((group, groupIdx) => (
              <section
                key={group.id}
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-strong)',
                  padding: '22px',
                  boxShadow: 'var(--shadow-card)'
                }}
              >
                {/* ترويسة مجموعة المتشابهات */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                  marginBottom: '18px',
                  borderBottom: '1.5px solid var(--border-color)',
                  paddingBottom: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(212,175,55,0.15)',
                      color: 'var(--gold-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '800',
                      fontSize: '13px'
                    }}>
                      {groupIdx + 1}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                        {group.title}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px' }}>
                        <span style={{ fontSize: '12px', color: 'var(--gold-primary)', fontWeight: '700' }}>
                          {group.category}
                        </span>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>•</span>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          {group.subCategory} ({group.scope})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* وسوم الضابط الحفظي السريع وزر توليد بطاقة صورة */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    {group.mnemonicRule?.poem && (
                      <div style={{
                        backgroundColor: 'rgba(212,175,55,0.08)',
                        border: '1px solid var(--rule-border)',
                        padding: '6px 14px',
                        borderRadius: 'var(--radius-md)',
                        fontFamily: 'var(--font-quran-amiri)',
                        fontSize: '16px',
                        fontWeight: '700',
                        color: 'var(--text-gold)',
                        textAlign: 'center'
                      }}>
                        « {group.mnemonicRule.poem} »
                      </div>
                    )}
                    <button
                      onClick={() => handleOpenInfographic(group)}
                      className="btn-outline"
                      style={{ padding: '6px 10px', fontSize: '12px' }}
                      title="توليد بطاقة صورة دعوية للمشاركة"
                    >
                      <ImageIcon size={14} />
                      <span>توليد بطاقة</span>
                    </button>
                  </div>
                </div>

                {/* بطاقات الآيات المتشابهة في هذه المجموعة */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: group.verses.length === 2 ? 'repeat(auto-fit, minmax(360px, 1fr))' : '1fr',
                  gap: '16px'
                }}>
                  {group.verses.map((verse) => (
                    <VerseCard
                      key={verse.id}
                      verse={verse}
                      group={group}
                      fontFamily={fontFamily}
                      fontSize={fontSize}
                      isPlaying={isPlaying}
                      isCurrentAudioVerse={activeVerse?.id === verse.id}
                      onPlayVerse={handlePlayVerse}
                      isMastered={userData.masteredGroupIds.includes(verse.id)}
                      onToggleMastered={handleToggleMastered}
                      isNeedsReview={userData.needsReviewGroupIds.includes(verse.id)}
                      onToggleNeedsReview={handleToggleNeedsReview}
                      isFavorite={userData.favoriteGroupIds.includes(verse.id)}
                      onToggleFavorite={handleToggleFavorite}
                      userNote={userData.notes[verse.id]}
                      onSaveNote={handleSaveNote}
                      onReportIssue={handleReportIssue}
                      onOpenInfographic={handleOpenInfographic}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>

      {/* المشغل الصوتي العائم الثابت */}
      <AudioPlayer
        activeVerse={activeVerse}
        activeGroup={activeGroup}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        selectedReciterId={selectedReciterId}
        setSelectedReciterId={setSelectedReciterId}
        audioSpeed={audioSpeed}
        setAudioSpeed={setAudioSpeed}
        audioLoopCount={audioLoopCount}
        setAudioLoopCount={setAudioLoopCount}
        smartAlternatePlay={smartAlternatePlay}
        setSmartAlternatePlay={setSmartAlternatePlay}
        onVerseChange={(v, g) => { setActiveVerse(v); setActiveGroup(g); setIsPlaying(true); }}
        onClose={() => { setIsPlaying(false); setActiveVerse(null); }}
      />

      {/* النوافذ المنبثقة التفاعلية */}
      <QuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        onMarkMastered={handleToggleMastered}
        onMarkNeedsReview={handleToggleNeedsReview}
      />

      <DashboardModal
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
        masteredIds={userData.masteredGroupIds}
        needsReviewIds={userData.needsReviewGroupIds}
        favoriteIds={userData.favoriteGroupIds}
        notes={userData.notes}
        onSelectVerse={(v) => {
          setActiveVerse(v);
          const grp = MUTASHABIHAT_GROUPS.find(g => g.verses.some(x => x.id === v.id));
          setActiveGroup(grp);
        }}
      />

      <VerificationModal
        isOpen={isVerificationOpen}
        onClose={() => setIsVerificationOpen(false)}
        targetVerse={reportingTargetVerse}
      />

      <HalaqahModal
        isOpen={isHalaqahOpen}
        onClose={() => setIsHalaqahOpen(false)}
      />

      <FontSettingsModal
        isOpen={isFontSettingsOpen}
        onClose={() => setIsFontSettingsOpen(false)}
        fontFamily={fontFamily}
        setFontFamily={setFontFamily}
        fontSize={fontSize}
        setFontSize={setFontSize}
      />

      {/* النوافذ للميزات السبع الجديدة */}
      <VoiceTestingModal
        isOpen={isVoiceTestOpen}
        onClose={() => setIsVoiceTestOpen(false)}
        onMarkMastered={handleToggleMastered}
      />

      <MushafPageView
        isOpen={isMushafViewOpen}
        onClose={() => setIsMushafViewOpen(false)}
        onSelectVerse={(v) => {
          setActiveVerse(v);
          const grp = MUTASHABIHAT_GROUPS.find(g => g.verses.some(x => x.id === v.id));
          setActiveGroup(grp);
        }}
      />

      <QuranGraphModal
        isOpen={isGraphOpen}
        onClose={() => setIsGraphOpen(false)}
        onSelectGroup={(g) => {
          setSelectedCategory(g.category);
        }}
      />

      <CustomDiffModal
        isOpen={isCustomDiffOpen}
        onClose={() => setIsCustomDiffOpen(false)}
      />

      <InfographicGeneratorModal
        isOpen={isInfographicOpen}
        onClose={() => setIsInfographicOpen(false)}
        initialGroup={infographicTargetGroup}
      />

      {/* التذييل والأمانة العلمية */}
      <footer style={{
        marginTop: 'auto',
        borderTop: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-surface)',
        padding: '24px 20px',
        textAlign: 'center',
        fontSize: '13px',
        color: 'var(--text-muted)'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gold-primary)', fontWeight: '700' }}>
            <CheckCircle2 size={16} />
            <span>منصة متشابهات القرآن الكريم - جميع الحقوق وقفية لوجه الله تعالى</span>
          </div>
          <p style={{ margin: 0, maxWidth: '700px', lineHeight: '1.7' }}>
            المصادر المعتمدة: مصحف مجمع الملك فهد لطباعة المصحف الشريف، المصحف الإلكتروني لجامعة الملك سعود (KSU Quran)، تطبيق ترتيل، أمهات كتب المتشابهات والتفاسير السلفية، وصحاح السنة النبوية.
          </p>
          <button
            onClick={() => { setReportingTargetVerse(null); setIsVerificationOpen(true); }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--gold-primary)',
              textDecoration: 'underline',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            عرض تفاصيل المنهجية والأمانة العلمية أو الإبلاغ عن ملحوظة
          </button>
        </div>
      </footer>
    </div>
  );
}

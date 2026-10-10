import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  Check, 
  AlertCircle, 
  Bookmark, 
  ChevronDown, 
  ChevronUp, 
  Volume2, 
  Share2, 
  FileText,
  Sparkles,
  Image as ImageIcon
} from 'lucide-react';
import { AccordionDetails } from './AccordionDetails';

export function VerseCard({
  verse,
  group,
  fontFamily,
  fontSize,
  isPlaying,
  isCurrentAudioVerse,
  onPlayVerse,
  isMastered,
  onToggleMastered,
  isNeedsReview,
  onToggleNeedsReview,
  isFavorite,
  onToggleFavorite,
  userNote,
  onSaveNote,
  onReportIssue,
  onOpenInfographic
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteText, setNoteText] = useState(userNote || '');

  const fontClass = fontFamily === 'scheherazade' ? 'font-scheherazade' : 'font-amiri-quran';

  const handleSaveNote = () => {
    onSaveNote(verse.id, noteText);
    setIsEditingNote(false);
  };

  return (
    <div style={{
      backgroundColor: 'var(--bg-card)',
      border: '1px solid',
      borderColor: isCurrentAudioVerse ? 'var(--gold-primary)' : 'var(--border-color)',
      borderRadius: 'var(--radius-lg)',
      padding: '20px',
      boxShadow: 'var(--shadow-card)',
      transition: 'border-color var(--transition-speed), transform var(--transition-speed)',
      position: 'relative'
    }}>
      {/* الرأس: اسم السورة ورقم الآية والجزء */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '12px',
        marginBottom: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* اسم السورة برسم واضح */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'var(--bg-muted)',
            padding: '4px 12px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-color)'
          }}>
            <span style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-gold)' }}>
              سورة {verse.surahName}
            </span>
          </div>

          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            الآية: <strong style={{ color: 'var(--text-main)' }}>{verse.ayahNumber}</strong>
          </span>

          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            الجزء: <strong style={{ color: 'var(--text-main)' }}>{verse.juz}</strong>
          </span>

          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            الصفحة: <strong style={{ color: 'var(--text-main)' }}>{verse.page}</strong>
          </span>
        </div>

        {/* أزرار الإجراء السريع: استماع، توليد صورة، إتقان، مراجعة، مفضلة */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {/* زر الاستماع السريع */}
          <button
            onClick={() => onPlayVerse(verse, group)}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '12px',
              fontWeight: '700',
              backgroundColor: isCurrentAudioVerse && isPlaying ? 'var(--gold-primary)' : 'var(--bg-muted)',
              color: isCurrentAudioVerse && isPlaying ? '#081214' : 'var(--text-main)',
              border: '1px solid',
              borderColor: isCurrentAudioVerse ? 'var(--gold-primary)' : 'var(--border-color)'
            }}
            title="استمع للآية بصوت القارئ المعتمد"
          >
            {isCurrentAudioVerse && isPlaying ? <Pause size={14} /> : <Play size={14} />}
            <span>استماع</span>
          </button>

          {/* زر توليد صورة دعوية */}
          <button
            onClick={() => onOpenInfographic(group)}
            className="btn-outline"
            style={{ padding: '6px 10px', fontSize: '12px' }}
            title="توليد بطاقة صورة دعوية للمشاركة"
          >
            <ImageIcon size={14} />
            <span>بطاقة</span>
          </button>

          {/* زر تم الإتقان */}
          <button
            onClick={() => onToggleMastered(verse.id)}
            style={{
              padding: '6px 10px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '12px',
              backgroundColor: isMastered ? 'rgba(16,185,129,0.2)' : 'transparent',
              color: isMastered ? 'var(--emerald-accent)' : 'var(--text-muted)',
              border: '1px solid',
              borderColor: isMastered ? 'var(--emerald-accent)' : 'var(--border-color)'
            }}
            title={isMastered ? 'تم إتقان هذا الموضع' : 'تحديد كـ "أتقنته"'}
          >
            <Check size={14} />
            <span>{isMastered ? 'متقن' : 'أتقنته'}</span>
          </button>

          {/* زر يحتاج مراجعة */}
          <button
            onClick={() => onToggleNeedsReview(verse.id)}
            style={{
              padding: '6px 10px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '12px',
              backgroundColor: isNeedsReview ? 'rgba(245,158,11,0.2)' : 'transparent',
              color: isNeedsReview ? 'var(--amber-rule)' : 'var(--text-muted)',
              border: '1px solid',
              borderColor: isNeedsReview ? 'var(--amber-rule)' : 'var(--border-color)'
            }}
            title="تحديد كموضع يحتاج تثبيت ومراجعة"
          >
            <AlertCircle size={14} />
            <span>مراجعة</span>
          </button>

          {/* زر المفضلة */}
          <button
            onClick={() => onToggleFavorite(verse.id)}
            style={{
              padding: '6px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'transparent',
              color: isFavorite ? 'var(--gold-primary)' : 'var(--text-muted)',
              border: '1px solid var(--border-color)'
            }}
            title="حفظ في المفضلة"
          >
            <Bookmark size={14} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      {/* نص الآية بالرسم العثماني التام مع تمييز الفروق */}
      <div 
        className={`font-quran ${fontClass}`}
        style={{
          fontSize: `${fontSize}px`,
          padding: '10px 8px 16px',
          color: 'var(--text-main)',
          userSelect: 'text'
        }}
      >
        {verse.diffTokens ? (
          verse.diffTokens.map((token, idx) => (
            <span
              key={idx}
              className={`diff-token ${token.isDiff ? 'is-diff' : ''}`}
              title={token.note || ''}
            >
              {token.text}{' '}
            </span>
          ))
        ) : (
          <span>{verse.textUthmani} </span>
        )}
        <span className="ayah-end-badge">
          {verse.ayahNumber}
        </span>
      </div>

      {/* زر الملاحظات الشخصية إذا وجدت */}
      {userNote && !isEditingNote && (
        <div style={{
          backgroundColor: 'var(--bg-muted)',
          padding: '8px 12px',
          borderRadius: 'var(--radius-sm)',
          fontSize: '13px',
          color: 'var(--text-muted)',
          marginBottom: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span><strong>ملاحظتي:</strong> {userNote}</span>
          <button
            onClick={() => setIsEditingNote(true)}
            style={{ background: 'none', border: 'none', color: 'var(--gold-primary)', fontSize: '11px' }}
          >
            تعديل
          </button>
        </div>
      )}

      {/* حقل تعديل الملاحظة */}
      {isEditingNote && (
        <div style={{ marginBottom: '12px', display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="اكتب رابطك الذهني أو ملاحظتك على هذا الموضع..."
            style={{
              flex: 1,
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--bg-app)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              fontSize: '13px',
              outline: 'none',
              fontFamily: 'var(--font-ui)'
            }}
          />
          <button onClick={handleSaveNote} className="btn-primary" style={{ padding: '6px 14px', fontSize: '12px' }}>
            حفظ
          </button>
          <button onClick={() => setIsEditingNote(false)} className="btn-outline" style={{ padding: '6px 10px', fontSize: '12px' }}>
            إلغاء
          </button>
        </div>
      )}

      {/* شريط الإجراءات السفلي لتوسيع الشرح والتفسير والضوابط */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '8px',
        borderTop: '1px solid var(--border-color)'
      }}>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-gold)',
            fontSize: '13px',
            fontWeight: '600',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            padding: '4px 0'
          }}
        >
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          <span>{isExpanded ? 'طي الشرح والتوجيه' : 'عرض التفسير والضابط الحفظي والتوجيه'}</span>
        </button>

        {!userNote && !isEditingNote && (
          <button
            onClick={() => setIsEditingNote(true)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '12px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <FileText size={13} />
            <span>إضافة ملاحظة</span>
          </button>
        )}
      </div>

      {/* قسم الشرح والتفسير والضوابط المنسدل */}
      {isExpanded && (
        <AccordionDetails 
          verse={verse} 
          group={group} 
          onReportIssue={onReportIssue}
        />
      )}
    </div>
  );
}

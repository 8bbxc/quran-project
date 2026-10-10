import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  Printer, 
  Copy, 
  Check, 
  Users, 
  ExternalLink,
  MessageCircle
} from 'lucide-react';
import { MUTASHABIHAT_GROUPS } from '../data/quranData';

export function HalaqahModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);
  const [selectedGroupIdx, setSelectedGroupIdx] = useState(0);

  if (!isOpen) return null;

  const currentGroup = MUTASHABIHAT_GROUPS[selectedGroupIdx];

  const handleCopyText = () => {
    let summaryText = `📖 *متشابهات القرآن الكريم - لتيسير الحفظ*\n\n`;
    summaryText += `🔹 *الموضوع:* ${currentGroup.title}\n`;
    if (currentGroup.mnemonicRule?.poem) {
      summaryText += `📜 *الضابط الحفظي:* «${currentGroup.mnemonicRule.poem}»\n\n`;
    }
    summaryText += `📌 *المواضع المتشابهة:*\n`;
    currentGroup.verses.forEach(v => {
      summaryText += `▫️ سورة ${v.surahName} [آية ${v.ayahNumber}]:\n« ${v.textUthmani} »\n\n`;
    });
    summaryText += `🔗 للمراجعة التفاعلية عبر منصة المتشابهات: https://quran-mutashabihat.org`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    let summaryText = `📖 *متشابهات القرآن الكريم - ${currentGroup.title}*\n\n`;
    currentGroup.verses.forEach(v => {
      summaryText += `▫️ سورة ${v.surahName} (${v.ayahNumber}): ${v.textUthmani}\n`;
    });
    const url = `https://wa.me/?text=${encodeURIComponent(summaryText)}`;
    window.open(url, '_blank');
  };

  const handlePrint = () => {
    window.print();
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
        maxWidth: '640px',
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
            <Users size={22} style={{ color: 'var(--gold-primary)' }} />
            <h2 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>
              مشاركة الحلقات والطلاب والطباعة
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
          {/* اختيار الموضع المراد مشاركته */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              اختر موضع المتشابهات لتوليد بطاقة المشاركة:
            </label>
            <select
              value={selectedGroupIdx}
              onChange={(e) => setSelectedGroupIdx(parseInt(e.target.value))}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-card)',
                color: 'var(--text-main)',
                border: '1px solid var(--border-color)',
                fontSize: '14px',
                fontFamily: 'var(--font-ui)',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {MUTASHABIHAT_GROUPS.map((g, idx) => (
                <option key={g.id} value={idx}>
                  {idx + 1}. {g.title} ({g.verses.map(v => v.surahName).join(' / ')})
                </option>
              ))}
            </select>
          </div>

          {/* معاينة نص البطاقة المجهزة للمشاركة */}
          <div style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            fontSize: '13px',
            lineHeight: '1.8'
          }}>
            <h4 style={{ margin: '0 0 8px 0', color: 'var(--gold-primary)', fontSize: '15px' }}>
              {currentGroup.title}
            </h4>
            {currentGroup.mnemonicRule?.poem && (
              <p style={{ margin: '0 0 8px 0', color: 'var(--text-gold)', fontWeight: '700' }}>
                « {currentGroup.mnemonicRule.poem} »
              </p>
            )}
            <ul style={{ paddingRight: '20px', margin: 0 }}>
              {currentGroup.verses.map(v => (
                <li key={v.id} style={{ marginBottom: '6px' }}>
                  <strong>سورة {v.surahName} [{v.ayahNumber}]:</strong> {v.textUthmani}
                </li>
              ))}
            </ul>
          </div>

          {/* أزرار المشاركة والطباعة */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={handleCopyText}
              className="btn-primary"
              style={{ flex: 1, padding: '10px 16px', fontSize: '13px' }}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span>{copied ? 'تم النسخ بنجاح!' : 'نسخ نص الواجب للحلقة'}</span>
            </button>

            <button
              onClick={handleWhatsAppShare}
              style={{
                backgroundColor: '#25D366',
                color: '#ffffff',
                padding: '10px 16px',
                borderRadius: 'var(--radius-md)',
                fontSize: '13px',
                fontWeight: '700'
              }}
            >
              <MessageCircle size={16} />
              <span>مشاركة واتساب</span>
            </button>

            <button
              onClick={handlePrint}
              className="btn-outline"
              style={{ padding: '10px 16px', fontSize: '13px' }}
            >
              <Printer size={16} />
              <span>طباعة ورقة مراجعة</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

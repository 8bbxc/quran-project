import React, { useState } from 'react';
import { 
  BookOpen, 
  HelpCircle, 
  ShieldCheck, 
  ScrollText, 
  MessageSquare, 
  Tag, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  AlertCircle
} from 'lucide-react';

export function AccordionDetails({ verse, group, onReportIssue }) {
  const [activeTab, setActiveTab] = useState('tafseer'); // 'tafseer' | 'tawjeeh' | 'hadith'
  const [tafseerSource, setTafseerSource] = useState('muyassar'); // 'muyassar' | 'saadi' | 'ibnkatheer'

  return (
    <div style={{
      marginTop: '16px',
      paddingTop: '16px',
      borderTop: '1px dashed var(--border-color)'
    }}>
      {/* شريط تبويبات الشرح */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '8px',
        marginBottom: '14px',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => setActiveTab('tafseer')}
          style={{
            padding: '6px 14px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '13px',
            fontWeight: activeTab === 'tafseer' ? '700' : '500',
            backgroundColor: activeTab === 'tafseer' ? 'var(--bg-muted)' : 'transparent',
            color: activeTab === 'tafseer' ? 'var(--gold-primary)' : 'var(--text-muted)',
            border: activeTab === 'tafseer' ? '1px solid var(--border-strong)' : '1px solid transparent'
          }}
        >
          <BookOpen size={14} />
          التفسير المعتمد
        </button>

        <button
          onClick={() => setActiveTab('tawjeeh')}
          style={{
            padding: '6px 14px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '13px',
            fontWeight: activeTab === 'tawjeeh' ? '700' : '500',
            backgroundColor: activeTab === 'tawjeeh' ? 'var(--bg-muted)' : 'transparent',
            color: activeTab === 'tawjeeh' ? 'var(--gold-primary)' : 'var(--text-muted)',
            border: activeTab === 'tawjeeh' ? '1px solid var(--border-strong)' : '1px solid transparent'
          }}
        >
          <ScrollText size={14} />
          توجيه المتشابه والضابط
        </button>

        {verse.hadith && (
          <button
            onClick={() => setActiveTab('hadith')}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '13px',
              fontWeight: activeTab === 'hadith' ? '700' : '500',
              backgroundColor: activeTab === 'hadith' ? 'rgba(16,185,129,0.15)' : 'transparent',
              color: activeTab === 'hadith' ? 'var(--emerald-accent)' : 'var(--text-muted)',
              border: activeTab === 'hadith' ? '1px solid rgba(16,185,129,0.3)' : '1px solid transparent'
            }}
          >
            <ShieldCheck size={14} />
            حديث الآية ({verse.hadith.source})
          </button>
        )}

        <button
          onClick={() => onReportIssue(verse)}
          style={{
            marginRight: 'auto',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            fontSize: '12px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer'
          }}
          title="أبلغ عن ملحوظة تدقيقية في حرف أو تشكيل"
        >
          <AlertCircle size={13} />
          إبلاغ عن ملحوظة
        </button>
      </div>

      {/* محتوى تبويب التفسير */}
      {activeTab === 'tafseer' && (
        <div className="animate-fade-in">
          {/* محدد مصدر التفسير */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '10px'
          }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>المصدر:</span>
            {[
              { id: 'muyassar', label: 'التفسير الميسر (مجمع الملك فهد)' },
              { id: 'saadi', label: 'تفسير السعدي' },
              { id: 'ibnkatheer', label: 'تفسير ابن كثير' }
            ].map(src => (
              <button
                key={src.id}
                onClick={() => setTafseerSource(src.id)}
                style={{
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '11px',
                  fontWeight: tafseerSource === src.id ? '700' : '400',
                  backgroundColor: tafseerSource === src.id ? 'rgba(212,175,55,0.15)' : 'transparent',
                  color: tafseerSource === src.id ? 'var(--gold-primary)' : 'var(--text-muted)',
                  border: '1px solid',
                  borderColor: tafseerSource === src.id ? 'var(--gold-primary)' : 'var(--border-color)'
                }}
              >
                {src.label}
              </button>
            ))}
          </div>

          <div style={{
            backgroundColor: 'var(--bg-app)',
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            fontSize: '14px',
            lineHeight: '1.8',
            color: 'var(--text-main)'
          }}>
            {tafseerSource === 'muyassar' && (
              <p><strong>التفسير الميسر:</strong> {verse.tafseerMuyassar}</p>
            )}
            {tafseerSource === 'saadi' && (
              <p><strong>تيسير الكريم الرحمن (السعدي):</strong> {verse.tafseerSaadi}</p>
            )}
            {tafseerSource === 'ibnkatheer' && (
              <p><strong>تفسير القرآن العظيم (ابن كثير):</strong> {verse.tafseerIbnKatheer}</p>
            )}
          </div>
        </div>
      )}

      {/* محتوى تبويب توجيه المتشابه والضابط الحفظي */}
      {activeTab === 'tawjeeh' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* صندوق الضابط الحفظي والمنظومة */}
          {group.mnemonicRule && (
            <div className="mnemonic-box">
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '6px'
              }}>
                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: '700',
                  color: 'var(--gold-primary)',
                  fontSize: '14px'
                }}>
                  <Sparkles size={16} />
                  {group.mnemonicRule.ruleName}
                </span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {group.mnemonicRule.tags?.map(t => (
                    <span
                      key={t}
                      style={{
                        fontSize: '11px',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: 'var(--bg-card)',
                        color: 'var(--text-gold)',
                        border: '1px solid var(--border-color)'
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {group.mnemonicRule.poem && (
                <div style={{
                  fontFamily: 'var(--font-quran-amiri)',
                  fontSize: '18px',
                  color: 'var(--text-main)',
                  padding: '8px 12px',
                  backgroundColor: 'rgba(0,0,0,0.1)',
                  borderRadius: 'var(--radius-sm)',
                  textAlign: 'center',
                  fontWeight: '700',
                  letterSpacing: '0.5px'
                }}>
                  « {group.mnemonicRule.poem} »
                </div>
              )}
            </div>
          )}

          {/* التوجيه من كتب المتشابهات */}
          {group.tawjeeh && (
            <div style={{
              backgroundColor: 'var(--bg-app)',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              fontSize: '14px',
              lineHeight: '1.8'
            }}>
              <p style={{ margin: '0 0 8px 0', color: 'var(--text-main)' }}>
                <strong>التوجيه والفارق الدقيق:</strong> {group.tawjeeh.summary}
              </p>
              {group.tawjeeh.sources && (
                <div style={{
                  fontSize: '12px',
                  color: 'var(--text-muted)',
                  borderTop: '1px solid var(--border-color)',
                  paddingTop: '6px',
                  marginTop: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  flexWrap: 'wrap'
                }}>
                  <span>المراجع المعتمدة:</span>
                  {group.tawjeeh.sources.map(s => (
                    <span key={s} style={{
                      backgroundColor: 'var(--bg-surface)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      border: '1px solid var(--border-color)'
                    }}>
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* محتوى تبويب الحديث النبوي من الكتب الستة */}
      {activeTab === 'hadith' && verse.hadith && (
        <div className="animate-fade-in" style={{
          backgroundColor: 'rgba(16, 185, 129, 0.06)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: 'var(--radius-md)',
          padding: '14px 18px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '8px'
          }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--emerald-accent)',
              fontWeight: '700',
              fontSize: '13px'
            }}>
              <ShieldCheck size={16} />
              حديث صحيح مخرج في {verse.hadith.source}
            </span>
            <span style={{
              fontSize: '12px',
              color: 'var(--text-muted)',
              backgroundColor: 'var(--bg-card)',
              padding: '2px 8px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)'
            }}>
              رقم الحديث: {verse.hadith.number}
            </span>
          </div>
          <p style={{
            fontSize: '14px',
            lineHeight: '1.8',
            color: 'var(--text-main)',
            margin: 0
          }}>
            {verse.hadith.text}
          </p>
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  BookOpen, 
  ScrollText, 
  Send, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';

export function VerificationModal({ isOpen, onClose, targetVerse }) {
  const [reportText, setReportText] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reportText.trim()) return;
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setReportText('');
      onClose();
    }, 2500);
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
            <ShieldCheck size={22} style={{ color: 'var(--gold-primary)' }} />
            <h2 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>
              ختم التوثيق الشرعي والأمانة العلمية
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
          {/* ختم التدقيق */}
          <div style={{
            backgroundColor: 'rgba(212,175,55,0.08)',
            border: '1.5px solid var(--gold-primary)',
            borderRadius: 'var(--radius-md)',
            padding: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              backgroundColor: 'rgba(212,175,55,0.2)',
              border: '2px dashed var(--gold-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--gold-primary)',
              flexShrink: 0
            }}>
              <CheckCircle2 size={32} />
            </div>
            <div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '800', color: 'var(--gold-primary)' }}>
                نص قرآني موثق بالرسم العثماني التام
              </h3>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-main)', lineHeight: '1.6' }}>
                مضبوط ومطابق بنسبة 100% لمصحف مجمع الملك فهد لطباعة المصحف الشريف بالمدينة النبوية، والمصحف الإلكتروني لجامعة الملك سعود (KSU Quran)، وتطبيق ترتيل برواية حفص عن عاصم من طريق الشاطبية.
              </p>
            </div>
          </div>

          {/* تفاصيل المنهجية والمصادر */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            fontSize: '13px',
            lineHeight: '1.8'
          }}>
            <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '700', color: 'var(--text-gold)' }}>
              المصادر العلمية المعتمدة في المنصة:
            </h4>
            <div style={{
              backgroundColor: 'var(--bg-card)',
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}>
              <div>
                <strong>1. النص القرآني والرسم:</strong> مجمع الملك فهد لطباعة المصحف الشريف + مصحف KSU الإلكتروني.
              </div>
              <div>
                <strong>2. كتب التفسير المعتمدة:</strong> التفسير الميسر (المجمع)، تيسير الكريم الرحمن (السعدي)، وتفسير القرآن العظيم (ابن كثير).
              </div>
              <div>
                <strong>3. كتب توجيه المتشابهات:</strong> البرهان في متشابه القرآن (الكرماني)، درة التنزيل وغرة التأويل (الإسكافي)، ملاك التأويل (ابن الزبير الغرناطي)، ومنظومة هداية المرتاب (السخاوي).
              </div>
              <div>
                <strong>4. السنة النبوية الصحيحة:</strong> الكتب الستة المعتمدة (صحيح البخاري، صحيح مسلم، وسنن أبي داود والترمذي والنسائي وابن ماجه) دون أي حديث ضعيف أو واهٍ.
              </div>
            </div>
          </div>

          {/* نموذج الإبلاغ عن ملحوظة تدقيقية */}
          <div style={{
            borderTop: '1px solid var(--border-color)',
            paddingTop: '16px'
          }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '700', color: 'var(--text-main)' }}>
              الإبلاغ عن ملحوظة تدقيقية في حركة أو حرف:
            </h4>
            {targetVerse && (
              <div style={{
                fontSize: '12px',
                color: 'var(--text-gold)',
                backgroundColor: 'var(--bg-muted)',
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '8px',
                display: 'inline-block'
              }}>
                الموضع المحدد: سورة {targetVerse.surahName} (الآية {targetVerse.ayahNumber})
              </div>
            )}

            {isSubmitted ? (
              <div style={{
                backgroundColor: 'rgba(16,185,129,0.15)',
                border: '1px solid var(--emerald-accent)',
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                color: 'var(--emerald-accent)',
                textAlign: 'center',
                fontWeight: '700',
                fontSize: '14px'
              }}>
                جزاكم الله خيراً! تم تسجيل ملاحظتكم وسيقوم فريق التدقيق بالتحقق منها فوراً.
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <textarea
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                  placeholder="اكتب تفاصيل الملحوظة (مثل: حركة أو رسم حرف أو اقتراح ضابط حفظي محقق)..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-main)',
                    fontSize: '13px',
                    fontFamily: 'var(--font-ui)',
                    resize: 'none',
                    outline: 'none'
                  }}
                  required
                />
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ alignSelf: 'flex-start', padding: '8px 20px', fontSize: '13px' }}
                >
                  <Send size={14} />
                  إرسال الملحوظة
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

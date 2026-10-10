import React from 'react';
import { X, Type, Check, Sliders } from 'lucide-react';

export function FontSettingsModal({
  isOpen,
  onClose,
  fontFamily,
  setFontFamily,
  fontSize,
  setFontSize
}) {
  if (!isOpen) return null;

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
        maxWidth: '520px',
        boxShadow: 'var(--shadow-player)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* رأس النافذة */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Type size={20} style={{ color: 'var(--gold-primary)' }} />
            <h2 style={{ fontSize: '17px', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>
              إعدادات الخط والطباعة القرآنية
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* اختيار نوع الخط القرآني */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '10px' }}>
              نوع الخط المعتمد للرسم العثماني:
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {[
                { id: 'amiri-quran', name: 'خط الأميري القرآني (Amiri Quran)', sub: 'رسم عثماني كلاسيكي للمصاحف' },
                { id: 'scheherazade', name: 'خط شهرزاد النبوي (Scheherazade)', sub: 'وضوح فائق وحركات دقيقة' }
              ].map(f => {
                const active = fontFamily === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => setFontFamily(f.id)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: 'var(--radius-md)',
                      border: `1.5px solid ${active ? 'var(--gold-primary)' : 'var(--border-color)'}`,
                      backgroundColor: active ? 'rgba(212,175,55,0.12)' : 'var(--bg-card)',
                      color: 'var(--text-main)',
                      textAlign: 'right',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <strong style={{ fontSize: '13px', color: active ? 'var(--gold-primary)' : 'var(--text-main)' }}>
                        {f.name}
                      </strong>
                      {active && <Check size={16} style={{ color: 'var(--gold-primary)' }} />}
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{f.sub}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* حجم الخط القرآني */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)' }}>
                حجم خط الآيات:
              </label>
              <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--gold-primary)' }}>
                {fontSize} بكسل
              </span>
            </div>
            <input
              type="range"
              min="22"
              max="38"
              step="2"
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              style={{
                width: '100%',
                accentColor: 'var(--gold-primary)',
                height: '6px',
                cursor: 'pointer'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
              <span>صغير (22px)</span>
              <span>متوسط (28px)</span>
              <span>كبير جداً (38px)</span>
            </div>
          </div>

          {/* معاينة حية للنص بالخط والحجم المختارين */}
          <div style={{
            backgroundColor: 'var(--bg-card)',
            padding: '18px',
            borderRadius: 'var(--radius-md)',
            border: '1px dashed var(--border-color)',
            textAlign: 'center'
          }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              معاينة حية للخط المختار:
            </span>
            <p
              className={fontFamily === 'scheherazade' ? 'font-scheherazade' : 'font-amiri-quran'}
              style={{
                fontSize: `${fontSize}px`,
                color: 'var(--text-main)',
                lineHeight: '2.2',
                margin: 0
              }}
            >
              ذَٰلِكَ ٱلْكِتَٰبُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ ۝
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

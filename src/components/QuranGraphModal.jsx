import React, { useState } from 'react';
import { 
  X, 
  Network, 
  Sparkles, 
  Layers, 
  HelpCircle, 
  BookOpen, 
  ArrowLeftRight 
} from 'lucide-react';
import { MUTASHABIHAT_GROUPS } from '../data/quranData';

export function QuranGraphModal({ isOpen, onClose, onSelectGroup }) {
  const [selectedGroupIdx, setSelectedGroupIdx] = useState(0);
  const [activeNode, setActiveNode] = useState(null);

  if (!isOpen) return null;

  const currentGroup = MUTASHABIHAT_GROUPS[selectedGroupIdx];

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
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1.5px solid var(--border-strong)',
        width: '100%',
        maxWidth: '820px',
        maxHeight: '92vh',
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
            <Network size={22} style={{ color: 'var(--gold-primary)' }} />
            <h2 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>
              خريطة المتشابهات الذهنية التفاعلية (Mind Map Graph)
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
          {/* اختيار موضوع الخريطة الذهنية */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)' }}>
              موضوع الترابط الذهني:
            </label>
            <select
              value={selectedGroupIdx}
              onChange={(e) => { setSelectedGroupIdx(parseInt(e.target.value)); setActiveNode(null); }}
              style={{
                flex: 1,
                padding: '8px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-card)',
                color: 'var(--text-main)',
                border: '1px solid var(--border-color)',
                fontSize: '13px',
                fontFamily: 'var(--font-ui)',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              {MUTASHABIHAT_GROUPS.map((g, idx) => (
                <option key={g.id} value={idx}>
                  {idx + 1}. {g.title} ({g.verses.map(v => v.surahName).join(' ↔ ')})
                </option>
              ))}
            </select>
          </div>

          {/* لوحة الرسم البياني التفاعلي (Interactive SVG Graph) */}
          <div style={{
            backgroundColor: 'var(--bg-app)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px',
            minHeight: '340px',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}>
            <svg viewBox="0 0 700 320" style={{ width: '100%', height: '100%', maxHeight: '320px' }}>
              <defs>
                <linearGradient id="gradGold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#d4af37" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#aa820a" stopOpacity="0.8" />
                </linearGradient>
                <linearGradient id="gradEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#047857" stopOpacity="0.8" />
                </linearGradient>
              </defs>

              {/* خطوط الوصلات التفاعلية */}
              {currentGroup.verses.map((v, i) => {
                const total = currentGroup.verses.length;
                const coords = total === 2 
                  ? { x: i === 0 ? 150 : 550, y: 160 }
                  : {
                      x: Math.round(350 + Math.cos((i * 2 * Math.PI) / total - Math.PI / 2) * 220),
                      y: Math.round(160 + Math.sin((i * 2 * Math.PI) / total - Math.PI / 2) * 95)
                    };

                return (
                  <g key={v.id}>
                    <line
                      x1="350"
                      y1="160"
                      x2={coords.x}
                      y2={coords.y}
                      stroke="var(--gold-primary)"
                      strokeWidth="2.5"
                      strokeDasharray="5 3"
                      opacity={activeNode === v.id || !activeNode ? 0.7 : 0.2}
                    />
                    <circle
                      cx={(350 + coords.x) / 2}
                      cy={(160 + coords.y) / 2}
                      r="4"
                      fill="var(--gold-primary)"
                    />
                  </g>
                );
              })}

              {/* العقدة المركزية: موضوع المتشابهات */}
              <g 
                onClick={() => setActiveNode(null)}
                style={{ cursor: 'pointer' }}
              >
                <circle cx="350" cy="160" r="54" fill="url(#gradGold)" filter="drop-shadow(0 4px 10px rgba(0,0,0,0.5))" />
                <circle cx="350" cy="160" r="46" fill="var(--bg-surface)" stroke="var(--gold-primary)" strokeWidth="2" />
                <text x="350" y="155" textAnchor="middle" fill="var(--gold-primary)" fontSize="12" fontWeight="bold">
                  أصل المتشابه
                </text>
                <text x="350" y="172" textAnchor="middle" fill="var(--text-main)" fontSize="10" fontWeight="600">
                  {currentGroup.category}
                </text>
              </g>

              {/* عقد السور والآيات المتفرعة */}
              {currentGroup.verses.map((v, i) => {
                const total = currentGroup.verses.length;
                const coords = total === 2 
                  ? { x: i === 0 ? 150 : 550, y: 160 }
                  : {
                      x: Math.round(350 + Math.cos((i * 2 * Math.PI) / total - Math.PI / 2) * 220),
                      y: Math.round(160 + Math.sin((i * 2 * Math.PI) / total - Math.PI / 2) * 95)
                    };
                const isSelected = activeNode === v.id;

                return (
                  <g 
                    key={v.id}
                    onClick={() => setActiveNode(isSelected ? null : v.id)}
                    style={{ cursor: 'pointer', transition: 'all 0.3s' }}
                  >
                    <circle 
                      cx={coords.x} 
                      cy={coords.y} 
                      r={isSelected ? 44 : 38} 
                      fill="var(--bg-card)" 
                      stroke={isSelected ? "var(--emerald-accent)" : "var(--border-strong)"} 
                      strokeWidth={isSelected ? 3 : 1.5}
                      filter="drop-shadow(0 3px 6px rgba(0,0,0,0.4))"
                    />
                    <text x={coords.x} y={coords.y - 6} textAnchor="middle" fill="var(--text-gold)" fontSize="12" fontWeight="bold">
                      {v.surahName}
                    </text>
                    <text x={coords.x} y={coords.y + 12} textAnchor="middle" fill="var(--text-muted)" fontSize="10">
                      آية {v.ayahNumber}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* معلومات العقدة المحددة */}
          <div style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            fontSize: '13px',
            lineHeight: '1.8'
          }}>
            {activeNode ? (
              (() => {
                const verse = currentGroup.verses.find(v => v.id === activeNode);
                return (
                  <div className="animate-fade-in">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--emerald-accent)' }}>
                        سورة {verse.surahName} [آية {verse.ayahNumber}]
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        الجزء {verse.juz} • صفحة {verse.page}
                      </span>
                    </div>
                    <p style={{
                      fontFamily: 'var(--font-quran-amiri)',
                      fontSize: '18px',
                      color: 'var(--text-main)',
                      margin: '0 0 10px 0'
                    }}>
                      {verse.textUthmani}
                    </p>
                    <div style={{ fontSize: '12px', color: 'var(--text-gold)' }}>
                      <strong>اللفظ المائز:</strong> {verse.diffTokens?.find(t => t.isDiff)?.note || 'موضع المقارنة'}
                    </div>
                  </div>
                );
              })()
            ) : (
              <div>
                <strong style={{ color: 'var(--gold-primary)' }}>الضابط الحفظي للرابط الذهني:</strong>{' '}
                {currentGroup.mnemonicRule?.poem || currentGroup.tawjeeh?.summary}
                <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
                  💡 انقر على إحدى عقد السور في الخريطة أعلاه لعزل الآية ومعاينة لفظها المنفرد!
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => { onSelectGroup(currentGroup); onClose(); }}
            className="btn-primary"
            style={{ padding: '10px 20px', alignSelf: 'center', fontSize: '13px' }}
          >
            الانتقال للمقارنة الكاملة في الواجهة الرئيسية
          </button>
        </div>
      </div>
    </div>
  );
}

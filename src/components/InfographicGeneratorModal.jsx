import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Image as ImageIcon, 
  Download, 
  Copy, 
  Check, 
  Share2, 
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { MUTASHABIHAT_GROUPS } from '../data/quranData';

export function InfographicGeneratorModal({ isOpen, onClose, initialGroup }) {
  const [selectedGroupIdx, setSelectedGroupIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const [canvasUrl, setCanvasUrl] = useState('');
  const canvasRef = useRef(null);

  const currentGroup = initialGroup || MUTASHABIHAT_GROUPS[selectedGroupIdx];

  // رسم وتوليد البطاقة الدعوية على الكانفاس بدقة فائقة 1080x1350
  const renderCard = () => {
    const canvas = canvasRef.current;
    if (!canvas || !currentGroup) return;

    const ctx = canvas.getContext('2d');
    const width = 1080;
    const height = 1350;
    canvas.width = width;
    canvas.height = height;

    // 1. خلفية إسلامية فخمة داكنة
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#071618');
    bgGrad.addColorStop(0.5, '#0c2225');
    bgGrad.addColorStop(1, '#051113');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. إطار ذهبي مزخرف مزدوج
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 6;
    ctx.strokeRect(30, 30, width - 60, height - 60);

    ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
    ctx.lineWidth = 2;
    ctx.strokeRect(42, 42, width - 84, height - 84);

    // زوايا مذهبة
    const drawCorner = (x, y, angle) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(0, 25);
      ctx.lineTo(25, 25);
      ctx.lineTo(25, 0);
      ctx.stroke();
      ctx.restore();
    };
    drawCorner(50, 50, 0);
    drawCorner(width - 50, 50, Math.PI / 2);
    drawCorner(width - 50, height - 50, Math.PI);
    drawCorner(50, height - 50, (3 * Math.PI) / 2);

    // 3. الترويسة والشعار
    ctx.textAlign = 'center';
    ctx.fillStyle = '#d4af37';
    ctx.font = 'bold 36px Alexandria, sans-serif';
    ctx.fillText('مُتَشَابِهَاتُ القُرْآنِ الكَرِيمِ', width / 2, 110);

    ctx.fillStyle = 'rgba(240, 247, 247, 0.7)';
    ctx.font = '24px Alexandria, sans-serif';
    ctx.fillText('لتيسير الحفظ والتثبيت بالرسم العثماني والتوجيه السلفي', width / 2, 155);

    // خط فاصل مذهب
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 250, 185);
    ctx.lineTo(width / 2 + 250, 185);
    ctx.stroke();

    // 4. عنوان الموضوع ونوعه
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 44px Alexandria, sans-serif';
    ctx.fillText(currentGroup.title, width / 2, 250);

    ctx.fillStyle = '#d4af37';
    ctx.font = 'bold 24px Alexandria, sans-serif';
    ctx.fillText(`[ ${currentGroup.category} • ${currentGroup.scope} ]`, width / 2, 295);

    // 5. بطاقات الآيات المتشابهة
    let currentY = 360;
    currentGroup.verses.slice(0, 2).forEach((v, idx) => {
      // خلفية بطاقة الآية
      ctx.fillStyle = 'rgba(19, 43, 49, 0.85)';
      ctx.beginPath();
      ctx.roundRect(80, currentY, width - 160, 240, 16);
      ctx.fill();

      ctx.strokeStyle = idx === 0 ? 'rgba(212, 175, 55, 0.6)' : 'rgba(16, 185, 129, 0.6)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // عنوان السورة
      ctx.textAlign = 'right';
      ctx.fillStyle = idx === 0 ? '#d4af37' : '#10b981';
      ctx.font = 'bold 28px Alexandria, sans-serif';
      ctx.fillText(`سورة ${v.surahName} [آية ${v.ayahNumber}]`, width - 120, currentY + 45);

      // نص الآية مع الالتفاف الذكي للنصوص الطويلة
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 32px "Amiri Quran", serif';
      
      const maxWidth = width - 240;
      const words = v.textUthmani.split(' ');
      let line = '';
      let lines = [];
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
          lines.push(line);
          line = words[n] + ' ';
        } else {
          line = testLine;
        }
      }
      lines.push(line);

      const lineHeight = 50;
      const startTextY = currentY + 115 - ((lines.length - 1) * lineHeight) / 2;
      lines.forEach((l, i) => {
        const isLast = i === lines.length - 1;
        ctx.fillText(isLast ? `${l.trim()} ۝ »` : (i === 0 ? `« ${l.trim()}` : l.trim()), width / 2, startTextY + (i * lineHeight));
      });

      currentY += 270;
    });

    // 6. صندوق الضابط الحفظي والمنظومة
    if (currentGroup.mnemonicRule?.poem) {
      ctx.fillStyle = 'rgba(212, 175, 55, 0.12)';
      ctx.beginPath();
      ctx.roundRect(80, currentY + 20, width - 160, 150, 16);
      ctx.fill();

      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.textAlign = 'center';
      ctx.fillStyle = '#d4af37';
      ctx.font = 'bold 26px Alexandria, sans-serif';
      ctx.fillText(`الضابط الحفظي: ${currentGroup.mnemonicRule.ruleName}`, width / 2, currentY + 65);

      ctx.fillStyle = '#fde68a';
      ctx.font = 'bold 34px "Amiri Quran", serif';
      ctx.fillText(`« ${currentGroup.mnemonicRule.poem} »`, width / 2, currentY + 125);
    }

    // 7. التذييل والأمانة العلمية
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(240, 247, 247, 0.6)';
    ctx.font = '22px Alexandria, sans-serif';
    ctx.fillText('المصادر: مجمع الملك فهد لطباعة المصحف • مصحف KSU الإلكتروني • صحاح السنن', width / 2, height - 70);

    setCanvasUrl(canvas.toDataURL('image/png'));
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(renderCard, 200);
    }
  }, [isOpen, selectedGroupIdx, currentGroup]);

  const handleDownload = () => {
    if (!canvasUrl) return;
    const link = document.createElement('a');
    link.download = `متشابهات-${currentGroup.title}.png`;
    link.href = canvasUrl;
    link.click();
  };

  const handleCopyImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      canvas.toBlob(async (blob) => {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    } catch (err) {
      console.log('Copy image failed, falling back:', err);
    }
  };

  if (!isOpen) return null;

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
        maxWidth: '720px',
        maxHeight: '94vh',
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
            <ImageIcon size={22} style={{ color: 'var(--gold-primary)' }} />
            <h2 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>
              مولّد بطاقات الصور الدعوية (Card Infographic)
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
          {/* اختيار الموضع */}
          <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
              اختر الموضع:
            </label>
            <select
              value={selectedGroupIdx}
              onChange={(e) => setSelectedGroupIdx(parseInt(e.target.value))}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-card)',
                color: 'var(--text-main)',
                border: '1px solid var(--border-color)',
                fontSize: '13px',
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
            <button onClick={renderCard} className="btn-outline" style={{ padding: '8px' }} title="إعادة توليد">
              <RefreshCw size={16} />
            </button>
          </div>

          {/* معاينة الكانفاس المصغر */}
          <div style={{
            maxWidth: '380px',
            width: '100%',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
            border: '2px solid var(--gold-primary)'
          }}>
            <canvas ref={canvasRef} style={{ width: '100%', height: 'auto', display: 'block' }} />
          </div>

          {/* أزرار التحميل والمشاركة */}
          <div style={{ display: 'flex', gap: '12px', width: '100%', maxWidth: '420px', flexWrap: 'wrap' }}>
            <button
              onClick={handleDownload}
              className="btn-primary"
              style={{ flex: 1, padding: '10px 16px', fontSize: '13px' }}
            >
              <Download size={16} />
              <span>تحميل الصورة (PNG)</span>
            </button>

            <button
              onClick={handleCopyImage}
              className="btn-outline"
              style={{ flex: 1, padding: '10px 16px', fontSize: '13px' }}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span>{copied ? 'تم النسخ بنجاح!' : 'نسخ للحافظة'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

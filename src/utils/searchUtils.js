/**
 * أدوات البحث القرآني الذكي - بالتشكيل وبدون تشكيل مع معالجة الرسم العثماني
 */

// إزالة التشكيل وعلامات الضبط العثماني للبحث المجرد
export function stripTashkeel(text) {
  if (!text) return '';
  return text
    // إزالة الحركات والتنوين والسكون والشدة
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '')
    // توحيد الألفات
    .replace(/[إأآٱ]/g, 'ا')
    // توحيد الياء والألف المقصورة
    .replace(/[ىي]/g, 'ي')
    // توحيد التاء المربوطة والهاء
    .replace(/ة/g, 'ه')
    // إزالة علامات الوقف والزخارف العثمانية
    .replace(/[ۖۗۘۙۚۛۜ۝]/g, '')
    .trim();
}

// دالة فحص مطابقة البحث الذكي
export function matchVerseSearch(group, searchQuery) {
  if (!searchQuery || !searchQuery.trim()) return true;

  const rawQuery = searchQuery.trim();
  const normalizedQuery = stripTashkeel(rawQuery);

  // 1. البحث في عنوان المجموعة أو قاعدتها أو وسومها
  const groupTitle = stripTashkeel(group.title);
  const ruleName = stripTashkeel(group.mnemonicRule?.ruleName || '');
  const tags = (group.mnemonicRule?.tags || []).map(t => stripTashkeel(t)).join(' ');

  if (
    groupTitle.includes(normalizedQuery) ||
    ruleName.includes(normalizedQuery) ||
    tags.includes(normalizedQuery)
  ) {
    return true;
  }

  // 2. البحث داخل نصوص الآيات المتشابهة (بالنص المجرد أو الأصلي)
  return group.verses.some(v => {
    const rawText = v.textUthmani;
    const cleanText = stripTashkeel(rawText);
    const surah = stripTashkeel(v.surahName);

    return (
      cleanText.includes(normalizedQuery) ||
      rawText.includes(rawQuery) ||
      surah.includes(normalizedQuery)
    );
  });
}

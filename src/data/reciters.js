// قراء مصحف جامعة الملك سعود الإلكتروني (KSU Quran) المعتمدون للتلاوة
export const RECITERS = [
  {
    id: 'husary',
    name: 'محمود خليل الحصري',
    description: 'المصحف المرتل (شيخ عموم المقارئ - أدق رواية)',
    subfolder: 'Husary_128kbps',
    bitrate: '128kbps',
    isDefault: true
  },
  {
    id: 'hudhaify',
    name: 'علي بن عبد الرحمن الحذيفي',
    description: 'إمام المسجد النبوي (ترتيل هادئ متقن للأحكام)',
    subfolder: 'Hudhaify_128kbps',
    bitrate: '128kbps'
  },
  {
    id: 'minshawy',
    name: 'محمد صديق المنشاوي',
    description: 'المصحف المرتل (خشوع وإتقان بالغ لمخارج الحروف)',
    subfolder: 'Minshawy_Murattal_128kbps',
    bitrate: '128kbps'
  },
  {
    id: 'ayman_sowaid',
    name: 'أيمن رشدي سويد',
    description: 'رئيس المجلس العلمي لمجمع المعلمين (بيان دقيق لمخارج الحروف)',
    subfolder: 'Ayman_Sowaid_64kbps',
    bitrate: '64kbps'
  },
  {
    id: 'alafasy',
    name: 'مشاري بن راشد العفاسي',
    description: 'المصحف المرتل برواية حفص عن عاصم',
    subfolder: 'Alafasy_128kbps',
    bitrate: '128kbps'
  },
  {
    id: 'maher',
    name: 'ماهر المعيقلي',
    description: 'إمام الحرم المكي الشريف',
    subfolder: 'MaherAlMuaiqly128kbps',
    bitrate: '128kbps'
  },
  {
    id: 'abdulbasit',
    name: 'عبد الباسط عبد الصمد',
    description: 'المصحف المرتل المحقق',
    subfolder: 'Abdul_Basit_Murattal_192kbps',
    bitrate: '192kbps'
  },
  {
    id: 'sudais',
    name: 'عبد الرحمن السديس',
    description: 'إمام وخطيب المسجد الحرام',
    subfolder: 'Abdurrahmaan_As-Sudais_192kbps',
    bitrate: '192kbps'
  },
  {
    id: 'shuraym',
    name: 'سعود بن إبراهيم الشريم',
    description: 'إمام الحرم المكي الأسبق',
    subfolder: 'Saood_ash-Shuraym_128kbps',
    bitrate: '128kbps'
  },
  {
    id: 'ayyoub',
    name: 'محمد أيوب',
    description: 'إمام المسجد النبوي الأسبق (قراءة حجازية متقنة)',
    subfolder: 'Muhammad_Ayyoub_128kbps',
    bitrate: '128kbps'
  }
];

// دالة توليد رابط التلاوة المباشر للآية بصيغة EveryAyah CDN المطابقة لمصحف KSU
export function getAyahAudioUrl(reciterId, surahNumber, ayahNumber) {
  const reciter = RECITERS.find(r => r.id === reciterId) || RECITERS[0];
  const sStr = String(surahNumber).padStart(3, '0');
  const aStr = String(ayahNumber).padStart(3, '0');
  return `https://everyayah.com/data/${reciter.subfolder}/${sStr}${aStr}.mp3`;
}

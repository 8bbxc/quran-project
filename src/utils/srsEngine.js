/**
 * محرك التكرار المتباعد لتثبيت الحفظ في الذاكرة الدائمة (SRS - Spaced Repetition Engine)
 * مبني على خوارزمية SM-2 المعتمدة في تثبيت العلوم وحفظ المتون
 */

const SRS_STORAGE_KEY = 'mutashabihat_srs_state_v1';

export function getStoredSrsData() {
  try {
    const raw = localStorage.getItem(SRS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load SRS data', e);
  }
  return {}; // { verseId: { interval: 1, reps: 0, easeFactor: 2.5, nextReviewDate: string } }
}

export function saveStoredSrsData(data) {
  try {
    localStorage.setItem(SRS_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save SRS data', e);
  }
}

/**
 * تقييم الحفظ وتحديث موعد المراجعة القادمة
 * @param {string} verseId 
 * @param {number} quality 1: Again (أعد), 2: Hard (صعب), 3: Good (جيد), 4: Easy (متقن)
 */
export function reviewVerseSrs(verseId, quality) {
  const allSrs = getStoredSrsData();
  const current = allSrs[verseId] || {
    interval: 1,
    reps: 0,
    easeFactor: 2.5,
    nextReviewDate: new Date().toISOString()
  };

  let { interval, reps, easeFactor } = current;

  if (quality === 1) {
    // إخفاق في الاستذكار - إعادة الدورة
    reps = 0;
    interval = 1;
  } else if (quality === 2) {
    // استذكار بصعوبة
    reps += 1;
    interval = Math.max(1, Math.round(interval * 1.2));
    easeFactor = Math.max(1.3, easeFactor - 0.15);
  } else if (quality === 3) {
    // استذكار جيد
    if (reps === 0) interval = 1;
    else if (reps === 1) interval = 3;
    else interval = Math.round(interval * easeFactor);
    reps += 1;
  } else if (quality === 4) {
    // إتقان تام وسهل
    if (reps === 0) interval = 2;
    else if (reps === 1) interval = 6;
    else interval = Math.round(interval * easeFactor * 1.3);
    easeFactor += 0.15;
    reps += 1;
  }

  // حساب التاريخ القادم
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + interval);

  const updatedEntry = {
    interval,
    reps,
    easeFactor: Number(easeFactor.toFixed(2)),
    nextReviewDate: nextDate.toISOString(),
    lastReviewedDate: new Date().toISOString()
  };

  allSrs[verseId] = updatedEntry;
  saveStoredSrsData(allSrs);
  return updatedEntry;
}

/**
 * فحص هل الموضع مستحق للمراجعة اليوم
 */
export function isDueToday(verseId) {
  const allSrs = getStoredSrsData();
  const entry = allSrs[verseId];
  if (!entry) return true; // غير مراجع سابقاً
  return new Date(entry.nextReviewDate) <= new Date();
}

/**
 * الحصول على عدد المواضع المستحقة للمراجعة اليوم
 */
export function getDueCount(allVerseIds) {
  const allSrs = getStoredSrsData();
  const now = new Date();
  return allVerseIds.filter(id => {
    const entry = allSrs[id];
    if (!entry) return false;
    return new Date(entry.nextReviewDate) <= now;
  }).length;
}

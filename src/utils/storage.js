/**
 * إدارة التخزين المحلي ومتابعة إتقان الحفظ والملاحظات الشخصية
 */

const STORAGE_KEY = 'mutashabihat_user_state_v1';

export function getStoredUserData() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load user state from localStorage', e);
  }

  return {
    masteredGroupIds: [],
    needsReviewGroupIds: [],
    favoriteGroupIds: [],
    notes: {}, // { groupId: "ملاحظة الحافظ" }
    theme: 'dark', // 'dark' | 'light' | 'sepia'
    fontFamily: 'amiri-quran', // 'amiri-quran' | 'kfgqpc' | 'scheherazade'
    fontSize: 28, // 22 to 38
    selectedReciterId: 'husary',
    audioSpeed: 1.0,
    audioLoopCount: 2,
    smartAlternatePlay: true
  };
}

export function saveStoredUserData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save user state to localStorage', e);
  }
}

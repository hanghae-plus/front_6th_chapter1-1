/**
 * localStorage 관련 유틸리티 함수들
 */

/**
 * localStorage에서 키로 값을 가져오는 함수
 * @param {string} key - localStorage 키
 * @param {*} defaultValue - 키가 없을 때 반환할 기본값
 * @returns {*} 저장된 값 또는 기본값
 */
export const getFromLocalStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);

    if (item === null) {
      return defaultValue;
    }

    try {
      return JSON.parse(item);
    } catch {
      return item;
    }
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
};

/**
 * localStorage에 키-값 쌍을 저장하는 함수
 * @param {string} key - localStorage 키
 * @param {*} value - 저장할 값
 * @returns {boolean} 성공 여부
 */
export const setToLocalStorage = (key, value) => {
  try {
    const serializedValue = typeof value === "string" ? value : JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
    return true;
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error);
    return false;
  }
};

/**
 * localStorage에서 키를 삭제하는 함수
 * @param {string} key - 삭제할 키
 * @returns {boolean} 성공 여부
 */
export const removeFromLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
    return false;
  }
};

/**
 * localStorage에 키가 존재하는지 확인하는 함수
 * @param {string} key - 확인할 키
 * @returns {boolean} 키 존재 여부
 */
export const hasInLocalStorage = (key) => {
  try {
    return localStorage.getItem(key) !== null;
  } catch (error) {
    console.error(`Error checking localStorage key "${key}":`, error);
    return false;
  }
};

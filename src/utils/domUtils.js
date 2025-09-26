/**
 * DOM 조작 관련 유틸리티 함수들
 */

/**
 * 요소 선택
 * @param {string} selector - CSS 선택자
 * @param {Element} parent - 부모 요소 (기본값: document)
 * @returns {Element|null} 선택된 요소
 */
export const $ = (selector, parent = document) => {
  return parent.querySelector(selector);
};

/**
 * 여러 요소 선택
 * @param {string} selector - CSS 선택자
 * @param {Element} parent - 부모 요소 (기본값: document)
 * @returns {NodeList} 선택된 요소들
 */
export const $$ = (selector, parent = document) => {
  return parent.querySelectorAll(selector);
};

/**
 * 요소 생성
 * @param {string} tag - 태그명
 * @param {Object} options - 속성과 내용
 * @returns {Element} 생성된 요소
 */
export const createElement = (tag, options = {}) => {
  const element = document.createElement(tag);

  if (options.className) {
    element.className = options.className;
  }

  if (options.textContent) {
    element.textContent = options.textContent;
  }

  if (options.innerHTML) {
    element.innerHTML = options.innerHTML;
  }

  if (options.attributes) {
    Object.entries(options.attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  }

  return element;
};

/**
 * 스크롤 위치 감지
 * @param {number} threshold - 하단에서의 거리 (px)
 * @returns {boolean} 하단 근처인지 여부
 */
export const isNearBottom = (threshold = 200) => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;

  return scrollTop + windowHeight >= documentHeight - threshold;
};

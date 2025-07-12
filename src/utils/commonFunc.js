export const formatPrice = (price) => {
  if (price === undefined || price === null) {
    return "가격 정보 없음";
  }
  // 숫자로 변환 시도
  const numPrice = Number(price);
  if (isNaN(numPrice)) {
    return "유효하지 않은 가격";
  }
  return `${numPrice.toLocaleString()}원`;
};

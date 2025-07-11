export function pascalToKebabCase(pascalCaseString) {
  if (typeof pascalCaseString !== "string" || pascalCaseString.length === 0) {
    return "";
  }

  return pascalCaseString
    .replace(/([A-Z])/g, "-$1") // 모든 대문자 앞에 '-' 추가
    .toLowerCase() // 전체를 소문자로 변환
    .replace(/^-/, ""); // 첫 글자 앞에 붙은 불필요한 '-' 제거
}

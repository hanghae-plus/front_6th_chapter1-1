class NotFound {
  constructor() {
    this.el = null;
  }

  template() {
    return `
      <main class="max-w-md mx-auto px-4 py-4">
        <div class="text-center my-4 py-20 shadow-md p-6 bg-white rounded-lg">
          <svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#4285f4;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#1a73e8;stop-opacity:1" />
              </linearGradient>
              <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="2" stdDeviation="8" flood-color="#000000" flood-opacity="0.1"/>
              </filter>
            </defs>

            <text x="160" y="85" font-family="Segoe UI, sans-serif" font-size="48" font-weight="600" fill="url(#blueGradient)" text-anchor="middle">404</text>
            <circle cx="80" cy="60" r="3" fill="#e8f0fe" opacity="0.8"/>
            <circle cx="240" cy="60" r="3" fill="#e8f0fe" opacity="0.8"/>
            <circle cx="90" cy="45" r="2" fill="#4285f4" opacity="0.5"/>
            <circle cx="230" cy="45" r="2" fill="#4285f4" opacity="0.5"/>
            <text x="160" y="110" font-family="Segoe UI, sans-serif" font-size="14" font-weight="400" fill="#5f6368" text-anchor="middle">페이지를 찾을 수 없습니다</text>
            <rect x="130" y="130" width="60" height="2" rx="1" fill="url(#blueGradient)" opacity="0.3"/>
          </svg>

          <a href="/" data-link class="inline-block mt-6 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
            홈으로
          </a>
        </div>
      </main>
    `;
  }

  render() {
    const template = document.createElement("template");
    template.innerHTML = this.template().trim();
    this.el = template.content.firstElementChild;
    this.addEvent();
    return this.el;
  }

  addEvent() {
    // 홈으로 돌아가기 링크 처리
    const homeLink = this.el.querySelector('a[href="/"]');
    if (homeLink) {
      homeLink.addEventListener("click", (e) => {
        e.preventDefault();
        history.pushState({}, "", "/");
        window.dispatchEvent(new Event("popstate"));
      });
    }
  }

  async init() {
    return this.render();
  }
}

export default NotFound;

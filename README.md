## 과제 체크포인트

### 배포 링크
[https://jihoon-0330.github.io/front_6th_chapter1-1](https://jihoon-0330.github.io/front_6th_chapter1-1)

### 기본과제

#### 상품목록

**상품 목록 로딩**

- [✅] 페이지 접속 시 로딩 상태가 표시된다
- [✅] 데이터 로드 완료 후 상품 목록이 렌더링된다

**상품 목록 조회**

- [✅] 각 상품의 기본 정보(이미지, 상품명, 가격)가 카드 형태로 표시된다

**한 페이지에 보여질 상품 수 선택**

- [✅] 드롭다운에서 10, 20, 50, 100개 중 선택할 수 있으며 기본 값은 20개 이다.
- [✅] 선택 변경 시 즉시 목록에 반영된다

**상품 정렬 기능**

- [✅] 상품을 가격순/인기순으로 오름차순/내림차순 정렬을 할 수 있다.
- [✅] 드롭다운을 통해 정렬 기준을 선택할 수 있다
- [✅] 정렬 변경 시 즉시 목록에 반영된다

**무한 스크롤 페이지네이션**

- [✅] 페이지 하단 근처 도달 시 다음 페이지 데이터가 자동 로드된다
- [✅] 스크롤에 따라 계속해서 새로운 상품들이 목록에 추가된다
- [✅] 새 데이터 로드 중일 때 로딩 인디케이터와 스켈레톤 UI가 표시된다
- [✅] 홈 페이지에서만 무한 스크롤이 활성화된다

**상품을 장바구니에 담기**

- [✅] 각 상품에 장바구니 추가 버튼이 있다
- [✅] 버튼 클릭 시 해당 상품이 장바구니에 추가된다
- [✅] 추가 완료 시 사용자에게 알림이 표시된다

**상품 검색**

- [✅] 상품명 기반 검색을 위한 텍스트 입력 필드가 있다
- [✅] 검색 버튼 클릭으로 검색이 수행된다
- [✅] Enter 키로 검색이 수행된다
- [✅] 검색어와 일치하는 상품들만 목록에 표시된다

**카테고리 선택**

- [✅] 사용 가능한 카테고리들을 선택할 수 있는 UI가 제공된다
- [✅] 선택된 카테고리에 해당하는 상품들만 표시된다
- [✅] 전체 상품 보기로 돌아갈 수 있다
- [✅] 2단계 카테고리 구조를 지원한다 (1depth, 2depth)

**카테고리 네비게이션**

- [✅] 현재 선택된 카테고리 경로가 브레드크럼으로 표시된다
- [✅] 브레드크럼의 각 단계를 클릭하여 상위 카테고리로 이동할 수 있다
- [✅] "전체" > "1depth 카테고리" > "2depth 카테고리" 형태로 표시된다

**현재 상품 수 표시**

- [✅] 현재 조건에서 조회된 총 상품 수가 화면에 표시된다
- [✅] 검색이나 필터 적용 시 상품 수가 실시간으로 업데이트된다

#### 장바구니

**장바구니 모달**

- [✅] 장바구니 아이콘 클릭 시 모달 형태로 장바구니가 열린다
- [✅] X 버튼이나 배경 클릭으로 모달을 닫을 수 있다
- [✅] ESC 키로 모달을 닫을 수 있다
- [✅] 모달에서 장바구니의 모든 기능을 사용할 수 있다

**장바구니 수량 조절**

- [✅] 각 장바구니 상품의 수량을 증가할 수 있다
- [✅] 각 장바구니 상품의 수량을 감소할 수 있다
- [✅] 수량 변경 시 총 금액이 실시간으로 업데이트된다

**장바구니 삭제**

- [✅] 각 상품에 삭제 버튼이 배치되어 있다
- [✅] 삭제 버튼 클릭 시 해당 상품이 장바구니에서 제거된다

**장바구니 선택 삭제**

- [✅] 각 상품에 선택을 위한 체크박스가 제공된다
- [✅] 선택 삭제 버튼이 있다
- [✅] 체크된 상품들만 일괄 삭제된다

**장바구니 전체 선택**

- [✅] 모든 상품을 한 번에 선택할 수 있는 마스터 체크박스가 있다
- [✅] 전체 선택 시 모든 상품의 체크박스가 선택된다
- [✅] 전체 해제 시 모든 상품의 체크박스가 해제된다

**장바구니 비우기**

- [✅] 장바구니에 있는 모든 상품을 한 번에 삭제할 수 있다

#### 상품 상세

**상품 클릭시 상세 페이지 이동**

- [✅] 상품 목록에서 상품 이미지나 상품 정보 클릭 시 상세 페이지로 이동한다
- [✅] URL이 `/product/{productId}` 형태로 변경된다
- [✅] 상품의 자세한 정보가 전용 페이지에서 표시된다

**상품 상세 페이지 기능**

- [✅] 상품 이미지, 설명, 가격 등의 상세 정보가 표시된다
- [✅] 전체 화면을 활용한 상세 정보 레이아웃이 제공된다

**상품 상세 - 장바구니 담기**

- [✅] 상품 상세 페이지에서 해당 상품을 장바구니에 추가할 수 있다
- [✅] 페이지 내에서 수량을 선택하여 장바구니에 추가할 수 있다
- [✅] 수량 증가/감소 버튼이 제공된다

**관련 상품 기능**

- [✅] 상품 상세 페이지에서 관련 상품들이 표시된다
- [✅] 같은 카테고리(category2)의 다른 상품들이 관련 상품으로 표시된다
- [✅] 관련 상품 클릭 시 해당 상품의 상세 페이지로 이동한다
- [✅] 현재 보고 있는 상품은 관련 상품에서 제외된다

**상품 상세 페이지 내 네비게이션**

- [✅] 상품 상세에서 상품 목록으로 돌아가는 버튼이 제공된다
- [✅] 브레드크럼을 통해 카테고리별 상품 목록으로 이동할 수 있다
- [✅] SPA 방식으로 페이지 간 이동이 부드럽게 처리된다

#### 사용자 피드백 시스템

**토스트 메시지**

- [✅] 장바구니 추가 시 성공 메시지가 토스트로 표시된다
- [✅] 장바구니 삭제, 선택 삭제, 전체 삭제 시 알림 메시지가 표시된다
- [✅] 토스트는 3초 후 자동으로 사라진다
- [✅] 토스트에 닫기 버튼이 제공된다
- [✅] 토스트 타입별로 다른 스타일이 적용된다 (success, info, error)

### 심화과제

#### SPA 네비게이션 및 URL 관리

**페이지 이동**

- [✅] 어플리케이션 내의 모든 페이지 이동(뒤로가기/앞으로가기를 포함)은 하여 새로고침이 발생하지 않아야 한다.

**상품 목록 - URL 쿼리 반영**

- [✅] 검색어가 URL 쿼리 파라미터에 저장된다
- [✅] 카테고리 선택이 URL 쿼리 파라미터에 저장된다
- [✅] 상품 옵션이 URL 쿼리 파라미터에 저장된다
- [✅] 정렬 조건이 URL 쿼리 파라미터에 저장된다
- [✅] 조건 변경 시 URL이 자동으로 업데이트된다
- [✅] URL을 통해 현재 검색/필터 상태를 공유할 수 있다

**상품 목록 - 새로고침 시 상태 유지**

- [✅] 새로고침 후 URL 쿼리에서 검색어가 복원된다
- [✅] 새로고침 후 URL 쿼리에서 카테고리가 복원된다
- [✅] 새로고침 후 URL 쿼리에서 옵션 설정이 복원된다
- [✅] 새로고침 후 URL 쿼리에서 정렬 조건이 복원된다
- [✅] 복원된 조건에 맞는 상품 데이터가 다시 로드된다

**장바구니 - 새로고침 시 데이터 유지**

- [✅] 장바구니 내용이 브라우저에 저장된다
- [✅] 새로고침 후에도 이전 장바구니 내용이 유지된다
- [✅] 장바구니의 선택 상태도 함께 유지된다

**상품 상세 - URL에 ID 반영**

- [✅] 상품 상세 페이지 이동 시 상품 ID가 URL 경로에 포함된다 (`/product/{productId}`)
- [✅] URL로 직접 접근 시 해당 상품의 상세 페이지가 자동으로 로드된다

**상품 상세 - 새로고침시 유지**

- [✅] 새로고침 후에도 URL의 상품 ID를 읽어서 해당 상품 상세 페이지가 유지된다

**404 페이지**

- [✅] 존재하지 않는 경로 접근 시 404 에러 페이지가 표시된다
- [✅] 홈으로 돌아가기 버튼이 제공된다

#### AI로 한 번 더 구현하기

- [⏳] 기존에 구현한 기능을 AI로 다시 구현한다.
- [⏳] 이 과정에서 직접 가공하는 것은 최대한 지양한다.


## 과제 셀프회고

### 요구사항을 만족할 수 있는 구조를 설계하기

요구사항을 만족하지 못해, 컴포넌트, 이벤트 핸들러, 스토어와 같은 중요한 코드를 계속 변경했다. 수정이 빈번했기 때문에 3일 정도는 코드를 계속 갈아치우며 상품목록만 들여다 봤다. 이후에도 장바구니를 구현하며 코드를 수정해야 했다. 처음부터 요구사항을 만족할 수 있는 구조를 생각했다면 시간을 효율적으로 사용할 수 있었을 것이라 느꼈다.


### 우선 순위와 시간 관리하기

과제를 제출하는 것에 목표를 두니 당장 테스트 코드 하나 하나를 통과하는 것에만 집착을 했다 느껴진다. 과제를 하는 목적이 학습을 위한 것이기 때문에, 앞으론 제출에 대한 압박 보다는 중간 중간 학습한 내용을 문서로 정리하는 시간을 가져보는 것도 좋을 것 같다. 하루중 문서화를 위한 시간을 따로 가지는 것도 해보면 좋을 것 같다.


### 기술적 성장

학습한 내용 정리

#### 이벤트 위임

이벤트 위임을 어떻게 효율적으로 할 수 있을지 생각할 수 있는 시간이었다.
개발을 처음 공부할 때 요소별로 이벤트리스너를 설정해 성능 문제를 경험한 적이 있다.
그 이후론 '이벤트는 document 에 달아야지' 라는 생각을 해왔다.
과제를 진행하면서 처음엔 싱글톤을 이용해 document에 이벤트 타입별로 하나의 리스너만 유지할 수 있는 코드를 작성했다.
리스너를 하나로 유지하기 위해, 핸들러 함수를 Set에 저장하고 이벤트가 발생하면 Set에 있는 핸들러를 모두 호출하는 방식이다.
컴포넌트를 벗어나는 이벤트들도 핸들러로 실행되는 문제가 있어 이벤트 위임을 하면서 컴포넌트 안에서 실행이 가능하도록 한다는 고민을 하게 되었다.

#### 이벤트리스너를 어디에 할당할까?

바닐라 자바스크립트로 컴포넌트를 작성한 예시들을 보면 이벤트리스너를 document가 아닌 컴포넌트 요소에 할당하는 예시를 많이 볼 수 있었다.
정보를 더 찾아보니 몇가지 장점이 있었는데, 첫째는 이벤트 핸들러가 실행되는 것을 컴포넌트 하위로 제한하기 때문에 document에 위임하는 것 보다 예측하기 쉬워진다. 둘째는 리렌더링이 발생하면서 요소가 변경 되었을 때 요소가 더이상 존재하지 않기 때문에 GC에 의해 이벤트리스너가 수거될 가능성이 있다. removeEventListener 매서드로 해제하지 않아도 큰 문제가 없을 수 있다는 점이다. 단점도 존재했는데, 첫째는 리렌더링마다 이벤트리스너를 다시 할당해줘야 한다. 둘쨰는 컴포넌트가 많아지면 결국 이벤트리스너 수가 많아진다는 점이다.

#### 이벤트리스너를 최소화 하며 컴포넌트 별로 격리 시키기

이벤트리스너 수를 최소화 하면서 컴포넌트 별로 핸들러를 격리 시키기를 원했다.
처음 생각했던 것 처럼 이벤트리스너를 document로 관리하는 싱글톤 클래스를 활용하고, 컴포넌트 별로 생성자에서 고유한 id를 생성하는 구조를 만들었다. 이벤트리스너를 적게 유지하면서, 컴포넌트가 해제될 때 componentId를 이용해 이벤트도 쉽게 제거 가능한 것이 장점이다.
```
{
  eventType: {
    componentId: [{selector, handler}, {selector, handler}, ...]
  }
}
```
이벤트 타입에 컴포넌트 별로 selector와 handler의 목록을 저장한다.
이벤트가 발생하면 closest 매서드를 활용해 어떤 컴포넌트에서 발생한 이벤트인지 추적하고, closest 매서드를 활용해 가장 먼저 만난 조상 selector의 핸들러만 호출한다.
주의할 점은 자식 컴포넌트가 부모 컴포넌트 보다 먼저 생성자가 호출되어야 하는 것과, selector와 handler를 선언할 때 더 작은 요소를 먼저 배치해야 한다는 점이다.

-> 이 부분은 최종 버전에 적용 못했습니다 ㅠ

#### 반응형 시스템

개인적으로 반응형 시스템을 이해하고 적용하는 것이 가장 어려웠다.
NHN Cloud 게시글인 '0.7KB로 Vue와 같은 반응형 시스템 만들기' 와 준일 코치님 'Vanilla Javascript로 상태관리 시스템 만들기' 게시글을 많이 참고했다.
처음엔 블로그에 있는 코드를 한 줄 씩 따라서 작성하고 실행 시켜가며 동작원리를 파악했다.
반응형 시스템의 원리는 값이 바뀌었을 때, 값을 추적하는 함수를 실행해 알려주는 것이다. Proxy 객체를 사용해 값을 읽는 get과 할당하는 set에 대해 커스텀한 로직을 쉽게 지정할 수 있다. 이것을 활용해 특정한 키 마다 상태 변경을 추적할 수 있다. 주의할 점은 중첩된 속성에 대해선 변경을 감지하지 않는다. 키에 대한 값을 = 연산자를 활용해 할당해 주어야 한다.

#### 최적화 하기

상태 변경시 호출할 함수를 저장하게 되는데, 더이상 상태 변경을 관찰할 필요가 없어지면 저장한 함수를 제거할 필요가 있다. observe 로 관찰을 시작할 떄 메모리 해제를 할 수 있는 함수를 반환할 수 있는 구조를 만들었다. 상태 변경을 추적할 때 queueMicrotask 를 사용해 다음 태스크가 실행되기 전 상태를 추적하는 함수들이 모두 실행될 수 있도록 만들었다.


#### 화면 렌더링 하기

외부로 부터 selector를 주입 받아 렌더링 하는 것이 불편하게 느껴졌다. 컴포넌트의 구조와 스타일을 예측하려면 어떤 요소 하위에 렌더링이 될지 확인하는 과정이 필요했기 때문이다.
외부로 부터 렌더링할 영역을 주입받는 것이 아닌, 컴포넌트 자체로 하나의 영역을 담당하도록 만들고 싶었다. 첫 렌더링에는 컴포넌트가 다룰 범위를 만들고, 이후 업데이트 되는 렌더링에서는 값이 변경되는 부분을 렌더링 하는 방법을 채택했다. 처음 만들 땐 컴포넌트를 편리하게 사용하고자 사용하는 측에서 최소한의 것을 설정하고, 내부에서 정해진 순서로 정해진 로직을 처리하도록 만들었다. 일부 상황에선 편리하게 사용이 가능했지만, 요구사항을 만족하지 못하는 상황에선 족쇄가 되어 버렸다. 이런 경험을 한 뒤 렌더링과 관련된 부분은 사용하는 측에서 자유롭게 설정할 수 있도록 변경을 했다. 구조를 유지하면서 자유도를 높일 수 있는 방법들을 많이 배워야 할 것 같다.

#### 생명주기 관리하기

리소스 관리를 위해 사용하지 않는 자원을 해제해 줘야 한다.
페이지를 이동하면 더이상 리소스가 필요없기 때문에, 페이지 이동시에 자원을 해제할 수 있도록 만들고 싶었다. 컴포넌트 클래스에서 컴포넌트인 값들을 찾고, 컴포넌트들을 연쇄적으로 해제하도록 구조를 만들었다. 지원하지 않는 방법으로 컴포넌트를 생성한다면 자원을 해제할 수 없다는 단점은 있지만, 규칙을 잘 지킨다면 편리하게 자원을 관리할 수 있어서 마음에 들었다.
컴포넌트가 생성될 때 컴포넌트 마다 고유한 아이디를 부여해 자원 관리에도 사용을 했다. 개인적으로 직관적으로 보이는 값을 사용하니 디버깅을 할 때도 유리한 부분이 많은 것 같다고 느꼈다.


### 자랑하고 싶은 코드

```js
const privateClass = Symbol("privateClass");

class Events {
  #events = new Map([
    // ["click", new Map([["componentId", new Set()]])],
    // ["change", new Map([["componentId", new Set()]])],
  ]);
  #abortControllerMap = new Map([
    // ["click", new AbortController()],
    // ["change", new AbortController()],
  ]);

  constructor(symbol) {
    if (privateClass !== symbol) {
      throw new Error("Cannot instantiate directly");
    }
  }

  addEvent({ eventName, comopnentId, callback, selector }) {
    if (this.#events.has(eventName)) {
      const eventMap = this.#events.get(eventName);
      if (eventMap.has(comopnentId)) {
        eventMap.get(comopnentId).add({ callback, selector });
      } else {
        eventMap.set(comopnentId, new Set([{ callback, selector }]));
      }
    } else {
      this.setListener(eventName);
      const eventMap = new Map([[comopnentId, new Set([{ callback, selector }])]]);
      this.#events.set(eventName, eventMap);
    }
  }

  setListener(eventName) {
    const abortController = new AbortController();
    this.#abortControllerMap.get(eventName)?.abort();
    this.#abortControllerMap.set(eventName, abortController);
    document.addEventListener(
      eventName,
      (e) => {
        const eventMap = this.#events.get(eventName);

        if (!eventMap) {
          return;
        }

        for (const [componentId, handlers] of eventMap) {
          if (!e.target.closest(componentId)) {
            continue;
          }

          for (const { callback, selector } of handlers) {
            const $closest = e.target.closest(selector);

            if ($closest) {
              callback(e, $closest);
              break;
            }
          }
        }
      },
      abortController,
    );
  }

  removeEvent({ comopnentId, eventName }) {
    if (!this.#events.has(eventName)) {
      return;
    }

    this.#events.get(eventName).delete(comopnentId);
    if (!this.#events.get(eventName).size) {
      this.#abort(eventName);
    }
  }

  removeComponentEvents(comopnentId) {
    this.#events.forEach((eventMap, eventName) => {
      eventMap.delete(comopnentId);
      if (!eventMap.size) {
        this.#abort(eventName);
      }
    });
  }

  #abort(eventName) {
    this.#abortControllerMap.get(eventName)?.abort();
    this.#abortControllerMap.delete(eventName);
    this.#events.delete(eventName);
  }

  dispose() {
    this.#abortControllerMap.forEach((v) => v.abort());
  }
}

const events = new Events(privateClass);

export class ComponentEvents {
  #componentId;
  constructor(componentId) {
    this.#componentId = componentId;
  }

  addEvent({ eventName, selector, callback }) {
    events.addEvent({
      comopnentId: this.#componentId,
      eventName,
      selector,
      callback,
    });
  }

  removeEvent({ eventName }) {
    events.removeEvent({
      comopnentId: this.#componentId,
      eventName,
    });
  }

  dispose() {
    events.removeComponentEvents(this.#componentId);
  }
}
```

컴포넌트 마다 이벤트리스너를 생성하지 않고 Events 안에서 이벤트의 종류당 하나의 리스너만 생성하도록 만들었다.
처음엔 컴포넌트 아이디와 같은 영역을 구분하는 값이 없어서, 이벤트가 컴포넌트 구분 없이 모두 추적이 되는 문제가 있었다. 이벤트가 발생했을 때 addEvent를 설정한 컴포넌트에만 이벤트 추적이 가능하도록 만들고 싶었다. 이벤트를 컴포넌트 단위로 격리를 시킬 수 있어서 가장 만족스럽다. 아쉬운 점은 배포 버전엔 적용하지 못했다.

### 개선이 필요하다고 생각하는 코드

```js
 class Component {
  state;
  props;
  $el;
  #disposeObserve;

  constructor(props) {
    this.props = props;
    this.id = `${this.constructor.name}-component-${crypto.randomUUID()}`;
    this.dataAttribute = createDataAttribute(this.id);
    this.abortController = null;
  }

  /** 오버라이드 super 필수 */
  setup() {
    this.state = observable(this.initState());
    this.#disposeObserve = observe(this.id, () => {
      this.mounted();
      this.setEvent();
      this.render();
    });
    this.#getComponentInstance().forEach((v) => v.setup());
  }

  initState() {
    return {};
  }

  /** html 템플릿 리터럴로 초기 렌더링용 */
  renderContainer() {}

  /** 상태변화시 렌더링용 */
  render() {}

  /** 오버라이드 super 필수 */
  setEvent() {
    if (this.abortController) {
      this.abortController.abort();
    }
    this.abortController = new AbortController();
  }

  addEvent(eventType, callback) {
    try {
      this.$el.addEventListener(eventType, callback, this.abortController);
    } catch (error) {
      console.warn(error);
    }
  }

  /** 오버라이드 super 필수 */
  mounted() {
    this.$el = document.querySelector(this.dataAttribute.selector);
    if (!this.$el) {
      // throw new Error(`${this.dataAttribute.selector} not found`);
      console.warn(`${this.dataAttribute.selector} not found`);
    }
  }

  /** 오버라이드 super 필수 */
  dispose() {
    if (this.#disposeObserve) {
      this.#disposeObserve();
    }
    this.#getComponentInstance().forEach((v) => v.dispose());
  }

  #getComponentInstance() {
    const properties = Object.values(this).filter((v) => v instanceof Component);
    const props = Object.values(this.props ?? {}).filter((v) => v instanceof Component);
    return [...properties, ...props];
  }
}
```

렌더링과 관련해 좀 더 세부적인 함수들이 많아야 할 것 같다.
innerHTML을 사용하는 것, appendChild를 사용하는 것, insertBefore를 사용하는 것 처럼 다양한 렌더링 상황이 존재하는데, 각 상황을 대응할 수 있는 매서드듣이 있다면 개발자 경험이 향상될 것 깉다.
값이 변경되지 않은 지점은 렌더링을 하지 않는 것 처럼 캐시 기능도 있으면 좋을 것 같다.

### 학습 효과 분석

기능을 직접 구현하다 보니, 새롭게 배운 개념이 많았다.
이번 과제를 통해 SPA 라이브러리를 조금더 이해할 수 있게 된 것 같다.
추가적인 학습을 통해 불필요한 렌더링, 상태 업데이트와 같은 부분들을 최대한으로 최적화를 해보고 싶다.


### 과제 피드백

동영상으로 구현해야 할 기능을 확인할 수 있어서 좋았습니다.

테스트 코드를 맞추는 것이 어렵기도 했지만, 코드를 잘 못 수정해서 발생한 문제를 파악할 수 있어서 좋은 점도 있었습니다.

과제의 양이 많다고 느껴졌습니다.
반대로 양이 많았기 때문에 다양한 상황을 경험하고, 설계나 구조의 결함을 발견한 장점이 있었습니다.

## 리뷰 받고 싶은 내용

`src/core/observer.js` 관련 질문
- `queueMicrotask` 를 사용하는 것을 추천 받았는데, 알맞게 사용되고 있는지 궁금합니다.
- 상태 추적을 해제하는 것을 더 효율적으로 가능한 방법이 있을까요?

`src/core/Component.js` 관련 질문
- `src/pages/products.js` 를 진입점으로 홈 화면 컴포넌트들을 보았을 때 코치님이 해당 `src/core/Component.js` 컴포넌트를 사용해야 한다면 어떤 점을 개선하고 싶으신가요?
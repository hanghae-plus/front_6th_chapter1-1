import { createDataAttribute } from "../utils/data-attributes.js";
import { observable, observe } from "./observer.js";

export class Component {
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

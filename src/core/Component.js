export default class Component {
  $target;
  state;
  params;

  constructor($target, params = {}) {
    this.$target = $target;
    this.params = params;
    this.setup();
    this.render();
  }

  setup() {}

  template() {
    return "";
  }

  render() {
    this.$target.innerHTML = this.template();
    this.setEvent();
  }

  setEvent() {}

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.render();
  }

  addEvent(eventType, selector, callback) {
    this.$target.addEventListener(eventType, (event) => {
      if (!event.target.closest(selector)) return false;
      callback(event);
    });
  }
}

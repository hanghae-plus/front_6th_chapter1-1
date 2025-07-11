import { Component } from "../core/Component";

export function html(strings, ...expressions) {
  const result = [];

  for (let i = 0; i < strings.length; i++) {
    result.push(strings[i]);

    if (i < expressions.length) {
      const value = expressions[i];
      result.push(value instanceof Component ? value.renderContainer() : value);
    }
  }

  return result.join("");
}

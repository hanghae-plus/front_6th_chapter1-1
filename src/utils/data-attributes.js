import { pascalToKebabCase } from "./string";

export function createDataAttribute(value) {
  const name = "data-component";
  const attribute = `${name}="${pascalToKebabCase(value)}"`;

  return {
    attribute,
    selector: `[${attribute}]`,
  };
}

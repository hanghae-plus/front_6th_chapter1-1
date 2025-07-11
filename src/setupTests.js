import "@testing-library/jest-dom";
import { configure } from "@testing-library/dom";
import { afterAll, beforeAll } from "vitest";
import { server } from "./__tests__/mockServerHandler.js";

configure({
  asyncUtilTimeout: 1000,
});

beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });
});

afterAll(() => {
  server.close();
});

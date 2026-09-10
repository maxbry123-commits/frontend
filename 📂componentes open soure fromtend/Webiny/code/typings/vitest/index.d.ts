import "vitest";
import * as matchers from "jest-extended";

type CustomMatchers = typeof matchers;

declare module "vitest" {
    interface Matchers<T = any> extends CustomMatchers {}
}

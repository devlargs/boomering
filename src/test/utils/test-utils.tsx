import { render, RenderOptions } from "@testing-library/react";
import React from "react";
import { AllTheProviders } from "./test-providers";

const customRender = (
  ui: React.ReactElement,
  options: Omit<RenderOptions, "wrapper"> = {}
) => {
  return render(ui, {
    wrapper: ({ children }) => <AllTheProviders>{children}</AllTheProviders>,
    ...options,
  });
};

export {
  fireEvent,
  render as originalRender,
  screen,
  waitFor,
} from "@testing-library/react";
export { customRender as render };

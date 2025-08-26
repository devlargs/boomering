import React from "react";
import { DarkModeProvider } from "../../contexts/DarkModeContext";

export const AllTheProviders: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return <DarkModeProvider>{children}</DarkModeProvider>;
};

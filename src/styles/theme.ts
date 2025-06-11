import "styled-components";
import type { DefaultTheme } from "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    background: string;
    diplayBg: string;
    buttonBg: string;
    buttonColor: string;
    buttonPressed: string;
    text: string;
  }
}

export const lightTheme: DefaultTheme = {
  background: "#dfdfdf",
  diplayBg: "#fff",
  buttonBg: "#fff",
  buttonColor: "#000",
  buttonPressed: "#f1f1f1",
  text: "#000",
};

export const darkTheme: DefaultTheme = {
  background: "#232323",
  diplayBg: "#333",
  buttonBg: "#444",
  buttonColor: "#fff",
  buttonPressed: "#525252",
  text: "#fff",
};

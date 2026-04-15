import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    // Add your theme types here if needed
  }

  // Extend the StyledComponent interface to include the 'as' prop
  export interface StyledComponentBase<C extends keyof JSX.IntrinsicElements, T = {}> {
    (props: any): React.ReactElement<any, any> | null;
    displayName?: string;
  }

  // Add type definitions for HTML elements
  export type StyledHTMLProps<T> = React.HTMLAttributes<T> & {
    as?: string | React.ComponentType<any>;
    forwardedAs?: string | React.ComponentType<any>;
  };

  // Add type definitions for styled components
  export function div<T = {}>(strings: TemplateStringsArray, ...interpolations: any[]): React.ComponentType<StyledHTMLProps<HTMLDivElement> & T>;
  export function main<T = {}>(strings: TemplateStringsArray, ...interpolations: any[]): React.ComponentType<StyledHTMLProps<HTMLElement> & T>;
  export function table<T = {}>(strings: TemplateStringsArray, ...interpolations: any[]): React.ComponentType<StyledHTMLProps<HTMLTableElement> & T>;
  export function button<T = {}>(strings: TemplateStringsArray, ...interpolations: any[]): React.ComponentType<React.ButtonHTMLAttributes<HTMLButtonElement> & T>;
  
  // Keyframes type
  export const keyframes: (strings: TemplateStringsArray, ...interpolations: any[]) => string;

  // Styled components type
  export interface StyledInterface {
    <C extends keyof JSX.IntrinsicElements | React.ComponentType<any>>(
      component: C
    ): ThemedStyledFunction<C, any>;
    [key: string]: any;
  }
}

// Add global type for styled-components
declare const styled: import('styled-components').StyledInterface;

export {};

import type { PropsWithChildren } from "react";

type NavBarProps = PropsWithChildren<object>;
export function NavBar({ children }: NavBarProps) {
  return <nav className="nav-bar">{children}</nav>;
}

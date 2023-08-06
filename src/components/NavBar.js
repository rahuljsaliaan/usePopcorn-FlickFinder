import { Logo } from "../utils/Logo";

// * NavBar Component
export function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}

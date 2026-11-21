import "@fontsource-variable/fraunces/soft.css";
import "@fontsource-variable/fraunces/soft-italic.css";
import "@fontsource-variable/manrope";
import "./domospa.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (<><style>{`html{background:#0f211d}`}</style>{children}</>);
}

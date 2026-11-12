import "@fontsource-variable/syne";
import "@fontsource-variable/jetbrains-mono";
import "@fontsource-variable/instrument-sans";
import "./trading.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (<><style>{`html{background:#06070a}`}</style>{children}</>);
}

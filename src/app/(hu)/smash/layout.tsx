import "@fontsource-variable/archivo/wdth.css";
import "./smash.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`html{background:#0a0a0a}`}</style>
      {children}
    </>
  );
}

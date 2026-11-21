import "@fontsource/gloock/400.css";
import "@fontsource-variable/schibsted-grotesk";
import "./galeria.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`html{background:#e4e0d8;scrollbar-width:none}html::-webkit-scrollbar{display:none}`}</style>
      {children}
    </>
  );
}

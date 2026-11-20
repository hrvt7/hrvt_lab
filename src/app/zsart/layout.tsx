import "@fontsource/birthstone";
import "@fontsource-variable/onest";
import "../galeria/galeria.css";
import "./zsart.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`html{background:#e4e0d8}`}</style>
      {children}
    </>
  );
}

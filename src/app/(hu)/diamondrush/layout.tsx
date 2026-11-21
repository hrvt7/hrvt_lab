import "@fontsource/anton";
import "@fontsource-variable/playfair-display/wght-italic.css";
import "@fontsource-variable/dm-sans";
import "./diamondrush.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`html{background:#0b0709}`}</style>
      {children}
    </>
  );
}

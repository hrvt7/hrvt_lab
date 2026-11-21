import "@fontsource/alfa-slab-one";
import "@fontsource-variable/bricolage-grotesque";
import "./stefri.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`html{background:#f6efe2}`}</style>
      {children}
    </>
  );
}

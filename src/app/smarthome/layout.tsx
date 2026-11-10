import "@fontsource-variable/fraunces";
import "@fontsource-variable/manrope";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`html{background:#0b1220}`}</style>
      {children}
    </>
  );
}

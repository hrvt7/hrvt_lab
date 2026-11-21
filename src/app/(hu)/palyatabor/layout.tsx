import "./palyatabor.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (<><style>{`html{background:#001231}`}</style>{children}</>);
}

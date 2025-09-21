type MainProps = {
  children: React.ReactNode;
};

export function Main({ children }: MainProps) {
  return <main className="main">{children}</main>;
}

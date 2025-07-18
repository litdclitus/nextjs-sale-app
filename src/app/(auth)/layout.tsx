export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <header>Auth Layout</header>
      {children}
    </main>
  );
}

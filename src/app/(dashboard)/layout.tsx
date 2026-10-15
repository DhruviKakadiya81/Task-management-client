export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b px-6 py-4 flex items-center justify-between">
        <div className="font-semibold text-lg">TaskFlow Dashboard</div>
      </header>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}

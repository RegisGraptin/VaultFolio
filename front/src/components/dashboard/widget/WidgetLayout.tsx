export default function WidgetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="bg-white min-h-120 rounded-2xl m-1 p-6 shadow-lg hover:shadow-xl transition-shadow duration-200">
        {children}
      </div>
    </>
  );
}

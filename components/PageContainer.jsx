export default function PageContainer({ children }) {
  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-10 md:px-16 lg:px-20">
      {children}
    </div>
  );
}
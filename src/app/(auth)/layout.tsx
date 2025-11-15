import { Footer } from "@/components/layout/footer";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#020617]">
      <main className="flex flex-grow flex-col items-center justify-center p-4">
        {children}
      </main>
      <Footer />
    </div>
  );
}

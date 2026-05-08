import type { ReactNode } from "react";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

type LayoutProps = {
  children: ReactNode;
};

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

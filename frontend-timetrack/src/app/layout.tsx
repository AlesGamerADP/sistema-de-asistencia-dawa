import type { Metadata } from "next";
import { Toaster } from 'sonner';
import "./globals.css";
import "../styles/login.css";
import "../styles/background-transition.css";
import "../styles/role-switch.css";
import "../styles/admin-tabs.css";
import "../styles/collaborator-animations.css";
import "../styles/dark-mode-fixes.css";

export const metadata: Metadata = {
  title: "TimeTrack - Control de Asistencias",
  description: "Sistema de control de asistencias y gestión de empleados",
};

// Habilitar SSR
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        {children}
        <Toaster
          position="top-right"
          richColors
          closeButton
          duration={3000}
          expand={false}
        />
      </body>
    </html>
  );
}
import { GlobalMenu } from "@/components";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <GlobalMenu>{children}</GlobalMenu>
    </div>
  );
}

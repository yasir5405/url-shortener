import Navbar from "@/components/Header/Navbar";

const RootLayout = ({ children }: { children: Readonly<React.ReactNode> }) => {
  return (
    <div className="min-h-full w-full flex flex-col px-60 relative">
      <div className="absolute inset-y-0 left-58 w-px bg-neutral-200" />
      <div className="absolute inset-y-0 right-58 w-px bg-neutral-200" />

      <Navbar />
      <main className="pt-16">{children}</main>
    </div>
  );
};

export default RootLayout;

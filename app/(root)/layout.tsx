const RootLayout = ({ children }: { children: Readonly<React.ReactNode> }) => {
  return (
    <div>
      Hellow
      <div>{children}</div>
    </div>
  );
};

export default RootLayout;

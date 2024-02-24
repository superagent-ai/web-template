export default function Header() {
  return (
    <div className="flex px-6 py-4 justify-between absolute left-0 right-0 z-[100]">
      <div className="flex space-x-2">
        <p className="font-bold font-mono">DEMO</p>
        <p className="text-muted-foreground font-mono">AI</p>
      </div>
      <div className="flex space-x-4">
        <p className="text-muted-foreground font-mono">v0.0.1rc-1</p>
      </div>
    </div>
  );
}

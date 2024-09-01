import { Button } from '@/components/ui/button';

export default function NavBar() {
  return (
    <nav className="flex items-center justify-between p-4 bg-slate-800 text-white">
      <div className="text-xl font-bold">Oscilloscope Chart</div>
      <div className="flex space-x-4">
        <Button variant="ghost">Option 1</Button>
        <Button variant="ghost">Option 2</Button>
        <Button variant="ghost">Option 3</Button>
        <Button variant="ghost">Settings</Button>
      </div>
    </nav>
  );
}
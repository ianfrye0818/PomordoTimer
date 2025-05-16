import { ThemeToggle } from './ui/ThemeToggle'

export default function Header() {
  return (
    <header className=" container h-16  mx-auto p-4 flex gap-2 justify-between">
      <div>POMORADO TIMER</div>
      <ThemeToggle />
    </header>
  )
}

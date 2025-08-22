export default function Topbar() {
  return (
    <header className="h-16 border-b px-6 flex items-center justify-between bg-white">
      <nav className="space-x-6 font-medium text-sm">
        <a className="text-gray-700 hover:text-blue-600" href="/dashboard">Dashboard</a>
        <a className="text-gray-700 hover:text-blue-600" href="/book">Books</a>
        <a className="text-gray-700 hover:text-blue-600" href="/settings">Settings</a>
      </nav>
      <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
    </header>
  )
}

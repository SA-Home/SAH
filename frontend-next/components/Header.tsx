export default function Header() {
  return (
    <header className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          SA Homeschooling
        </h1>

        <nav className="flex gap-6">
          <a href="/">Home</a>
          <a href="/articles">Blog</a>
          <a href="/magazines">Magazines</a>
          <a href="/directory">Directory</a>
          <a href="/subscribe">Subscribe</a>
        </nav>
      </div>
    </header>
  );
}
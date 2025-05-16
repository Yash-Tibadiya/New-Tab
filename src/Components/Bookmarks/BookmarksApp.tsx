import Bookmarks from "./Bookmarks";

export default function BookmarksApp() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white">
      <div className="container mx-auto py-8 px-4">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Bookmark Manager
          </h1>
          <p className="text-slate-400 max-w-md mx-auto">
            Keep all your favorite websites in one place with this modern
            bookmark manager
          </p>
        </header>

        <Bookmarks />

        <footer className="mt-12 text-center text-sm text-slate-500">
          <p>© 2025 Bookmark Manager. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

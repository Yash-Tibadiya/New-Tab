import Bookmark from "../Bookmark/Bookmark";
import type { BookmarkListProps } from "../types";
import { PlusCircle } from "lucide-react";

const BookmarkList = ({
  bookmarks,
  deleteBookmark,
  openForm,
}: BookmarkListProps) => {
  return (
    <section className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden shadow-xl border border-slate-700/30 backdrop-blur-sm">
      <header className="flex items-center justify-between p-6 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-sm">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">Bookmarks</h2>
        <button
          onClick={openForm}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium transition-all duration-300 shadow-md hover:shadow-blue-500/20 hover:shadow-lg transform hover:-translate-y-0.5"
        >
          <PlusCircle size={18} className="animate-pulse" />
          <span>Add New</span>
        </button>
      </header>
      <div className="p-6 h-[594px] overflow-auto bg-slate-900/50 scrollbar-thin scrollbar-thumb-blue-600/50 scrollbar-track-slate-800/30 backdrop-blur-sm">
        {bookmarks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 animate-fadeIn">
            <div className="bg-gradient-to-br from-slate-700 to-slate-800 p-8 rounded-full mb-6 shadow-lg shadow-blue-500/5 ring-1 ring-slate-700/50 group transition-all duration-500 hover:shadow-blue-500/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-14 w-14 text-blue-400 group-hover:text-blue-300 transition-all duration-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  className="animate-pulse"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-indigo-400 mb-3">
              No bookmarks yet
            </h3>
            <p className="text-slate-400 mb-8 max-w-md mx-auto leading-relaxed">
              Add your first bookmark to get started with your collection
            </p>
            <button
              onClick={openForm}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium transition-all duration-300 shadow-lg hover:shadow-blue-500/20 transform hover:-translate-y-0.5"
            >
              <PlusCircle size={18} />
              <span>Add Bookmark</span>
            </button>
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 animate-fadeIn">
            {bookmarks.map((bm, index) => (
              <div
                key={bm.id}
                className="animate-fadeIn bookmark-glow"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <Bookmark bm={bm} deleteBookmark={deleteBookmark} />
              </div>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default BookmarkList;

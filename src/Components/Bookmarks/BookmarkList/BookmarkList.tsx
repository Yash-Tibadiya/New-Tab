import Bookmark from "../Bookmark/Bookmark";
import type { BookmarkListProps } from "../types";
import { PlusCircle } from "lucide-react";

const BookmarkList = ({
  bookmarks,
  deleteBookmark,
  openForm,
}: BookmarkListProps) => {
  return (
    <section className="bg-slate-900 rounded-2xl shadow-xl overflow-hidden">
      <header className="flex items-center justify-between p-6 border-b border-slate-700">
        <h2 className="text-2xl font-bold text-white">Bookmarks</h2>
        <button
          onClick={openForm}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors shadow-md hover:shadow-lg"
        >
          <PlusCircle size={18} />
          <span>Add New</span>
        </button>
      </header>
      <div className="p-6 h-[550px] overflow-auto bg-slate-900 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800">
        {bookmarks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <div className="bg-slate-800 p-6 rounded-full mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-slate-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-slate-300 mb-2">
              No bookmarks yet
            </h3>
            <p className="text-slate-400 mb-6">
              Add your first bookmark to get started
            </p>
            <button
              onClick={openForm}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
            >
              <PlusCircle size={18} />
              <span>Add Bookmark</span>
            </button>
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {bookmarks.map((bm) => (
              <Bookmark key={bm.id} bm={bm} deleteBookmark={deleteBookmark} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default BookmarkList;

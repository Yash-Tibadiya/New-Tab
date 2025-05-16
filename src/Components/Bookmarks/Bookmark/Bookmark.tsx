import type { BookmarkProps } from "../types";
import { Trash2 } from "lucide-react";

const Bookmark = ({ bm, deleteBookmark }: BookmarkProps) => {
  return (
    <li className="relative group">
      <a
        href={bm.bmLink}
        target="_blank"
        rel="noopener noreferrer"
        className="block p-4 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
      >
        <div className="flex flex-col items-center">
          <div className="bg-slate-200 dark:bg-slate-600 p-3 rounded-full mb-3 shadow-inner">
            <img
              src={`https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${bm.bmLink}&size=32`}
              alt=""
              className="w-8 h-8 object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://placehold.co/32x32/374151/FFFFFF?text=?";
              }}
            />
          </div>
          <span className="text-slate-200 font-medium text-center text-sm tracking-wide line-clamp-2">
            {bm.bmTitle}
          </span>
        </div>
      </a>
      <button
        onClick={() => deleteBookmark(bm.id)}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-slate-400 hover:text-red-400 p-1 rounded-full hover:bg-slate-700"
        aria-label="Delete bookmark"
      >
        <Trash2 size={16} />
      </button>
    </li>
  );
};

export default Bookmark;

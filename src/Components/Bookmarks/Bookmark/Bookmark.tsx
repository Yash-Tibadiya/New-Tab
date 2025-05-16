import type { BookmarkProps } from "../types";
import { Trash2 } from "lucide-react";

const Bookmark = ({ bm, deleteBookmark }: BookmarkProps) => {
  return (
    <li className="relative group">
      <a
        href={bm.bmLink}
        target="_blank"
        rel="noopener noreferrer"
        className="block p-4 rounded-xl bg-gradient-to-br from-slate-700/90 to-slate-800/90 shadow-md hover:shadow-blue-500/10 transform hover:-translate-y-1 transition-all duration-300 border border-slate-700/30 backdrop-blur-sm"
      >
        <div className="flex flex-col items-center">
          <div className="bg-gradient-to-br from-slate-600/80 to-slate-700/80 p-3 rounded-full mb-3 shadow-inner ring-1 ring-slate-500/20 group-hover:ring-blue-500/20 transition-all duration-300">
            <img
              src={`https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${bm.bmLink}&size=32`}
              alt=""
              className="w-8 h-8 object-contain filter drop-shadow-md group-hover:scale-110 transition-transform duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://placehold.co/32x32/374151/FFFFFF?text=?";
              }}
            />
          </div>
          <span className="text-slate-200 font-medium text-center text-sm tracking-wide line-clamp-2 group-hover:text-blue-300 transition-colors duration-300">
            {bm.bmTitle}
          </span>
        </div>
      </a>
      <button
        onClick={() => deleteBookmark(bm.id)}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 text-slate-400 hover:text-red-400 p-1.5 rounded-full hover:bg-slate-700/80 backdrop-blur-sm transform hover:rotate-12"
        aria-label="Delete bookmark"
      >
        <Trash2 size={16} />
      </button>
    </li>
  );
};

export default Bookmark;

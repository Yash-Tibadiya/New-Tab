import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import type { BookmarkFormProps } from "../types";
import { X } from "lucide-react";

const BookmarkForm = ({ addBookmark, closeForm }: BookmarkFormProps) => {
  const [bmTitle, setBmTitle] = useState<string>("");
  const [bmLink, setBmLink] = useState<string>("");
  const [isUrlValid, setIsUrlValid] = useState<boolean>(true);
  const titleRef = useRef<HTMLInputElement>(null);

  const validateUrl = (url: string): boolean => {
    if (!url) return true;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate fields
    if (!bmTitle.trim() || !bmLink.trim()) return;

    // Check if URL is valid
    if (!isUrlValid) return;

    // Ensure URL has a protocol
    let formattedUrl = bmLink;
    if (!bmLink.startsWith("http://") && !bmLink.startsWith("https://")) {
      formattedUrl = "https://" + bmLink;
    }

    addBookmark({
      id: uuidv4(),
      bmTitle: bmTitle.trim(),
      bmLink: formattedUrl,
    });
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBmLink(value);
    setIsUrlValid(
      validateUrl(value.startsWith("http") ? value : `https://${value}`)
    );
  };

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  return (
    <div className="w-full max-w-md p-8 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl border border-slate-700/30 backdrop-blur-sm animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">Add Bookmark</h2>
        <button
          onClick={closeForm}
          className="text-slate-400 hover:text-red-400 transition-all duration-300 transform hover:rotate-90 p-1 rounded-full hover:bg-slate-700/50"
          aria-label="Close form"
        >
          <X size={24} />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="group">
          <label
            htmlFor="bmTitle"
            className="block text-sm font-medium text-slate-300 mb-2 group-focus-within:text-blue-400 transition-colors duration-200"
          >
            Title
          </label>
          <div className="relative">
            <input
              id="bmTitle"
              type="text"
              value={bmTitle}
              onChange={(e) => setBmTitle(e.target.value)}
              ref={titleRef}
              placeholder="Enter a title for your bookmark"
              className="w-full px-4 py-3 bg-slate-700/70 border-b-2 border-slate-600 focus:border-blue-500 text-white rounded-lg focus:outline-none transition-all duration-300 focus:shadow-[0_0_10px_rgba(59,130,246,0.3)] backdrop-blur-sm"
              required
            />
          </div>
        </div>
        <div className="group">
          <label
            htmlFor="bmLink"
            className="block text-sm font-medium text-slate-300 mb-2 group-focus-within:text-blue-400 transition-colors duration-200"
          >
            URL
          </label>
          <div className="relative">
            <input
              id="bmLink"
              type="text"
              value={bmLink}
              onChange={handleUrlChange}
              placeholder="Enter URL (e.g. google.com)"
              className={`w-full px-4 py-3 bg-slate-700/70 border-b-2 ${
                isUrlValid
                  ? "border-slate-600 focus:border-blue-500"
                  : "border-red-500"
              } text-white rounded-lg focus:outline-none transition-all duration-300 focus:shadow-[0_0_10px_rgba(59,130,246,0.3)] backdrop-blur-sm`}
              required
            />
          </div>
          {!isUrlValid && (
            <p className="mt-2 text-xs text-red-400 animate-pulse">
              Please enter a valid URL
            </p>
          )}
        </div>
        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={closeForm}
            className="px-5 py-2.5 text-sm font-medium text-slate-300 hover:text-white transition-colors duration-300 hover:bg-slate-700/50 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!bmTitle.trim() || !bmLink.trim() || !isUrlValid}
            className="px-5 py-2.5 text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg shadow-md hover:shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
          >
            Add Bookmark
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookmarkForm;
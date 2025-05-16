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
    <div className="w-full max-w-md p-6 bg-slate-800 rounded-xl shadow-2xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">Add Bookmark</h2>
        <button
          onClick={closeForm}
          className="text-slate-400 hover:text-white transition-colors"
          aria-label="Close form"
        >
          <X size={24} />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="bmTitle"
            className="block text-sm font-medium text-slate-300 mb-1"
          >
            Title
          </label>
          <input
            id="bmTitle"
            type="text"
            value={bmTitle}
            onChange={(e) => setBmTitle(e.target.value)}
            ref={titleRef}
            placeholder="Enter a title for your bookmark"
            className="w-full px-3 py-2 bg-slate-700 border-b-2 border-slate-600 focus:border-blue-400 text-white rounded-md focus:outline-none transition-colors"
            required
          />
        </div>
        <div>
          <label
            htmlFor="bmLink"
            className="block text-sm font-medium text-slate-300 mb-1"
          >
            URL
          </label>
          <input
            id="bmLink"
            type="text"
            value={bmLink}
            onChange={handleUrlChange}
            placeholder="Enter URL (e.g. google.com)"
            className={`w-full px-3 py-2 bg-slate-700 border-b-2 ${
              isUrlValid
                ? "border-slate-600 focus:border-blue-400"
                : "border-red-500"
            } text-white rounded-md focus:outline-none transition-colors`}
            required
          />
          {!isUrlValid && (
            <p className="mt-1 text-xs text-red-400">
              Please enter a valid URL
            </p>
          )}
        </div>
        <div className="flex justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={closeForm}
            className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!bmTitle.trim() || !bmLink.trim() || !isUrlValid}
            className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Bookmark
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookmarkForm;
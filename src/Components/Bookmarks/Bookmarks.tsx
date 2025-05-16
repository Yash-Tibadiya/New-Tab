import { useEffect, useState } from "react";
import BookmarkForm from "./BookmarkForm/BookmarkForm";
import BookmarkList from "./BookmarkList/BookmarkList";
import type { BookmarkType } from "./types";

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);

  const addBookmark = (bookmark: BookmarkType) => {
    setBookmarks((prevBookmarks) => [
      ...prevBookmarks,
      {
        id: bookmark.id,
        bmTitle: bookmark.bmTitle,
        bmLink: bookmark.bmLink,
      },
    ]);
    setShowForm(false);
  };

  const deleteBookmark = (id: string) => {
    setBookmarks((prevBookmarks) => prevBookmarks.filter((bm) => bm.id !== id));
  };

  const openForm = () => {
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
  };

  useEffect(() => {
    const json = localStorage.getItem("bookmarks");
    const loadedBookmarks = json ? JSON.parse(json) : null;
    if (loadedBookmarks) {
      setBookmarks(loadedBookmarks);
    }
  }, []);

  useEffect(() => {
    const json = JSON.stringify(bookmarks);
    localStorage.setItem("bookmarks", json);
  }, [bookmarks]);

  return (
    <div className="w-[450px] h-[683px] select-none">
      {showForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <BookmarkForm addBookmark={addBookmark} closeForm={closeForm} />
        </div>
      )}
      <BookmarkList
        bookmarks={bookmarks}
        deleteBookmark={deleteBookmark}
        openForm={openForm}
      />
    </div>
  );
};

export default Bookmarks;

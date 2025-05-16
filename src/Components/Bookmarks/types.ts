export interface BookmarkType {
  id: string;
  bmTitle: string;
  bmLink: string;
}

export interface BookmarkProps {
  bm: BookmarkType;
  deleteBookmark: (id: string) => void;
}

export interface BookmarkListProps {
  bookmarks: BookmarkType[];
  deleteBookmark: (id: string) => void;
  openForm: () => void;
}

export interface BookmarkFormProps {
  addBookmark: (bookmark: BookmarkType) => void;
  closeForm: () => void;
}

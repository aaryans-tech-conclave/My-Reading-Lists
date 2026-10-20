export type BookStatus = 'TBR' | 'Currently Reading' | 'Read' | 'DNF';
export type BookFormat = 'Physical' | 'eReader' | 'Audiobook';
export type SeriesStatus = 'Not Started' | 'In Progress' | 'Caught Up' | 'Completed';

export interface Book {
  id: string;
  title: string;
  author_id: string;
  series_id?: string;
  cover_image_url: string;
  status: BookStatus;
  is_owned: boolean;
  purchase_date?: string; // ISO date string
  star_rating: number; // 0.0 to 5.0
  pages_read: number;
  total_pages: number;
  date_started?: string;
  date_finished?: string;
  format: BookFormat;
  genre_tags: string[];
  long_text_review: string;
  spine_color?: string; // Hex color for digital bookcase
  spine_accent?: string; // Gold, silver, copper, cream
  shelf_index?: number; // 0, 1, 2, etc.
  shelf_position?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Author {
  id: string;
  name: string;
  cover_image_url?: string;
  pronouns?: string;
  nationality?: string;
  is_favorite: boolean;
  bio?: string;
  createdAt?: string;
}

export interface SeriesItem {
  id: string;
  title: string;
  author_id: string;
  status: SeriesStatus;
  total_books: number;
  books_read: number;
  overall_rating?: number;
  overall_review?: string;
  createdAt?: string;
}

export interface ReadingGoal {
  id: string;
  year: number;
  target_books: number;
  books_completed_count: number;
}

export interface DailyHabit {
  id: string;
  date: string; // YYYY-MM-DD
  read_physical: boolean;
  read_audio: boolean;
  minutes_read?: number;
}

export interface BookcaseSnapshot {
  id: string;
  title: string;
  created_by_name: string;
  created_by_uid: string;
  created_at: string;
  timestamp: number;
  image_data: string; // Data URL of rendered canvas
  book_count: number;
}

export interface AppSettings {
  id: string;
  banner_image_url: string;
  banner_title: string;
  quote_text: string;
  quote_author: string;
  theme_palette: 'sage' | 'rose' | 'lavender' | 'amber' | 'earth' | 'slate' | 'custom';
  custom_hex?: string;
  card_bg_color?: string;
  widget_order: string[];
}

export type ActiveNavTab =
  | 'dashboard'
  | 'my-library'
  | 'my-authors'
  | 'my-series'
  | 'my-genres'
  | 'my-tbr'
  | 'recently-bought'
  | 'wishlist'
  | 'statistics'
  | 'habits'
  | 'goals';

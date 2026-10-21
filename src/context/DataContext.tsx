import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  getDocs,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Book, Author, SeriesItem, ReadingGoal, DailyHabit, BookcaseSnapshot, AppSettings } from '../types';
import {
  INITIAL_BOOKS,
  INITIAL_AUTHORS,
  INITIAL_SERIES,
  INITIAL_GOAL,
  INITIAL_HABITS,
  INITIAL_SETTINGS,
} from '../data/initialData';
import { useAuth } from './AuthContext';

interface DataContextType {
  books: Book[];
  authors: Author[];
  series: SeriesItem[];
  goal: ReadingGoal;
  habits: DailyHabit[];
  settings: AppSettings;
  snapshots: BookcaseSnapshot[];
  isLoading: boolean;
  selectedBook: Book | null;
  setSelectedBook: (book: Book | null) => void;

  // Actions
  addBook: (book: Omit<Book, 'id'>) => Promise<string>;
  updateBook: (id: string, updates: Partial<Book>) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
  markAsBought: (bookId: string) => Promise<void>;
  updateRatingAndReview: (bookId: string, rating: number, review: string) => Promise<void>;
  updateSeriesReview: (seriesId: string, rating: number, review: string) => Promise<void>;
  addSeries: (series: Omit<SeriesItem, 'id'>) => Promise<string>;
  toggleDailyHabit: (date: string, type: 'physical' | 'audio') => Promise<void>;
  updateGoalTarget: (targetBooks: number) => Promise<void>;
  updateSettings: (updates: Partial<AppSettings>) => Promise<void>;
  saveBookcaseSnapshot: (title: string, imageData: string, bookCount: number) => Promise<void>;
  deleteSnapshot: (snapshotId: string) => Promise<void>;
  resetToDefaultData: () => Promise<void>;
  clearAllBooks: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAdmin } = useAuth();
  const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS);
  const [authors, setAuthors] = useState<Author[]>(INITIAL_AUTHORS);
  const [series, setSeries] = useState<SeriesItem[]>(INITIAL_SERIES);
  const [goal, setGoal] = useState<ReadingGoal>(INITIAL_GOAL);
  const [habits, setHabits] = useState<DailyHabit[]>(INITIAL_HABITS);
  const [settings, setSettings] = useState<AppSettings>(INITIAL_SETTINGS);
  const [snapshots, setSnapshots] = useState<BookcaseSnapshot[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // Firestore Real-time subscriptions
  useEffect(() => {
    // 1. Books
    const unsubBooks = onSnapshot(
      collection(db, 'books'),
      (snapshot) => {
        if (!snapshot.empty) {
          const loaded: Book[] = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() as Omit<Book, 'id'>),
          }));
          setBooks(loaded);
        } else {
          setBooks(INITIAL_BOOKS);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'books');
      }
    );

    // 2. Authors
    const unsubAuthors = onSnapshot(
      collection(db, 'authors'),
      (snapshot) => {
        if (!snapshot.empty) {
          const loaded: Author[] = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() as Omit<Author, 'id'>),
          }));
          setAuthors(loaded);
        } else {
          setAuthors(INITIAL_AUTHORS);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'authors');
      }
    );

    // 3. Series
    const unsubSeries = onSnapshot(
      collection(db, 'series'),
      (snapshot) => {
        if (!snapshot.empty) {
          const loaded: SeriesItem[] = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() as Omit<SeriesItem, 'id'>),
          }));
          setSeries(loaded);
        } else {
          setSeries(INITIAL_SERIES);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'series');
      }
    );

    // 4. Reading Goal
    const unsubGoal = onSnapshot(
      doc(db, 'reading_goals', 'goal-2025'),
      (docSnap) => {
        if (docSnap.exists()) {
          setGoal({ id: docSnap.id, ...(docSnap.data() as Omit<ReadingGoal, 'id'>) });
        } else {
          setGoal(INITIAL_GOAL);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'reading_goals/goal-2025');
      }
    );

    // 5. Daily Habits
    const unsubHabits = onSnapshot(
      collection(db, 'daily_habits'),
      (snapshot) => {
        if (!snapshot.empty) {
          const loaded: DailyHabit[] = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() as Omit<DailyHabit, 'id'>),
          }));
          setHabits(loaded);
        } else {
          setHabits(INITIAL_HABITS);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'daily_habits');
      }
    );

    // 6. Settings
    const unsubSettings = onSnapshot(
      doc(db, 'app_settings', 'primary-settings'),
      (docSnap) => {
        if (docSnap.exists()) {
          setSettings({ id: docSnap.id, ...(docSnap.data() as Omit<AppSettings, 'id'>) });
        } else {
          setSettings(INITIAL_SETTINGS);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'app_settings/primary-settings');
      }
    );

    // 7. Bookcase Snapshots (Ordered by timestamp desc, limit 10)
    const snapQuery = query(collection(db, 'bookcase_snapshots'), orderBy('timestamp', 'desc'), limit(15));
    const unsubSnapshots = onSnapshot(
      snapQuery,
      (snapshot) => {
        const loaded: BookcaseSnapshot[] = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<BookcaseSnapshot, 'id'>),
        }));
        setSnapshots(loaded.slice(0, 10));
        setIsLoading(false);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'bookcase_snapshots');
      }
    );

    return () => {
      unsubBooks();
      unsubAuthors();
      unsubSeries();
      unsubGoal();
      unsubHabits();
      unsubSettings();
      unsubSnapshots();
    };
  }, []);

  // Sync selectedBook with real-time updates
  useEffect(() => {
    if (selectedBook) {
      const refreshed = books.find((b) => b.id === selectedBook.id);
      if (refreshed) {
        setSelectedBook(refreshed);
      }
    }
  }, [books]);

  // Actions
  const addBook = async (newBook: Omit<Book, 'id'>): Promise<string> => {
    const bookId = `book-${Date.now()}`;
    const payload = {
      ...newBook,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    try {
      await setDoc(doc(db, 'books', bookId), payload);
      return bookId;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `books/${bookId}`);
      throw err;
    }
  };

  const updateBook = async (id: string, updates: Partial<Book>) => {
    const payload = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    try {
      await updateDoc(doc(db, 'books', id), payload);
    } catch (err) {
      // If doc doesn't exist yet in firestore (using initial data), write full document
      const current = books.find((b) => b.id === id);
      if (current) {
        try {
          await setDoc(doc(db, 'books', id), { ...current, ...payload });
          return;
        } catch (innerErr) {
          handleFirestoreError(innerErr, OperationType.UPDATE, `books/${id}`);
          throw innerErr;
        }
      }
      handleFirestoreError(err, OperationType.UPDATE, `books/${id}`);
      throw err;
    }
  };

  const deleteBook = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'books', id));
      if (selectedBook?.id === id) {
        setSelectedBook(null);
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `books/${id}`);
      throw err;
    }
  };

  // Crucial Admin Feature: Mark as Bought
  const markAsBought = async (bookId: string) => {
    const today = new Date().toISOString().slice(0, 10);
    const target = books.find((b) => b.id === bookId);
    if (!target) return;

    await updateBook(bookId, {
      is_owned: true,
      purchase_date: today,
      status: target.status === 'Read' ? 'Read' : 'TBR',
    });
  };

  const updateRatingAndReview = async (bookId: string, star_rating: number, long_text_review: string) => {
    await updateBook(bookId, { star_rating, long_text_review });
  };

  const updateSeriesReview = async (seriesId: string, overall_rating: number, overall_review: string) => {
    try {
      await updateDoc(doc(db, 'series', seriesId), {
        overall_rating,
        overall_review,
      });
    } catch (err) {
      const current = series.find((s) => s.id === seriesId);
      if (current) {
        try {
          await setDoc(doc(db, 'series', seriesId), { ...current, overall_rating, overall_review });
          return;
        } catch (innerErr) {
          handleFirestoreError(innerErr, OperationType.UPDATE, `series/${seriesId}`);
          throw innerErr;
        }
      }
      handleFirestoreError(err, OperationType.UPDATE, `series/${seriesId}`);
      throw err;
    }
  };

  const addSeries = async (newSeries: Omit<SeriesItem, 'id'>): Promise<string> => {
    const seriesId = `series-${Date.now()}`;
    const payload = {
      ...newSeries,
      createdAt: new Date().toISOString(),
    };
    try {
      await setDoc(doc(db, 'series', seriesId), payload);
      return seriesId;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `series/${seriesId}`);
      throw err;
    }
  };

  const toggleDailyHabit = async (date: string, type: 'physical' | 'audio') => {
    const habitId = `h-${date}`;
    const existingHabit = habits.find((h) => h.date === date);

    const payload: DailyHabit = {
      id: habitId,
      date,
      read_physical: existingHabit ? existingHabit.read_physical : false,
      read_audio: existingHabit ? existingHabit.read_audio : false,
      minutes_read: existingHabit?.minutes_read || 30,
    };

    if (type === 'physical') {
      payload.read_physical = !payload.read_physical;
    } else {
      payload.read_audio = !payload.read_audio;
    }

    try {
      await setDoc(doc(db, 'daily_habits', habitId), {
        date: payload.date,
        read_physical: payload.read_physical,
        read_audio: payload.read_audio,
        minutes_read: payload.minutes_read,
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `daily_habits/${habitId}`);
      throw err;
    }
  };

  const updateGoalTarget = async (target_books: number) => {
    try {
      await setDoc(
        doc(db, 'reading_goals', 'goal-2025'),
        {
          year: 2025,
          target_books,
          books_completed_count: books.filter((b) => b.status === 'Read').length,
        },
        { merge: true }
      );
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, 'reading_goals/goal-2025');
      throw err;
    }
  };

  const updateSettings = async (updates: Partial<AppSettings>) => {
    try {
      await setDoc(doc(db, 'app_settings', 'primary-settings'), updates, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, 'app_settings/primary-settings');
      throw err;
    }
  };

  // Snapshot with maximum 10 enforcement (overwriting oldest)
  const saveBookcaseSnapshot = async (title: string, imageData: string, bookCount: number) => {
    const snapshotId = `snap-${Date.now()}`;
    const now = Date.now();
    const payload = {
      title: title || `Bookcase arrangement`,
      created_by_name: user?.displayName || (isAdmin ? 'Aaryan (Curator)' : 'Bibliophile Visitor'),
      created_by_uid: user?.uid || 'guest',
      created_at: new Date().toISOString(),
      timestamp: now,
      image_data: imageData,
      book_count: bookCount,
    };

    try {
      await setDoc(doc(db, 'bookcase_snapshots', snapshotId), payload);

      // Enforce the 10-snapshot cap by pruning older documents
      const allSnapsQuery = query(collection(db, 'bookcase_snapshots'), orderBy('timestamp', 'asc'));
      const snapsSnapshot = await getDocs(allSnapsQuery);
      if (snapsSnapshot.size > 10) {
        const excessCount = snapsSnapshot.size - 10;
        const docsToDelete = snapsSnapshot.docs.slice(0, excessCount);
        for (const docToDel of docsToDelete) {
          await deleteDoc(doc(db, 'bookcase_snapshots', docToDel.id));
        }
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `bookcase_snapshots/${snapshotId}`);
      throw err;
    }
  };

  const deleteSnapshot = async (snapshotId: string) => {
    try {
      await deleteDoc(doc(db, 'bookcase_snapshots', snapshotId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `bookcase_snapshots/${snapshotId}`);
      throw err;
    }
  };

  // Seed default data if database is brand new
  const resetToDefaultData = async () => {
    try {
      for (const b of INITIAL_BOOKS) {
        await setDoc(doc(db, 'books', b.id), b);
      }
      for (const a of INITIAL_AUTHORS) {
        await setDoc(doc(db, 'authors', a.id), a);
      }
      for (const s of INITIAL_SERIES) {
        await setDoc(doc(db, 'series', s.id), s);
      }
      await setDoc(doc(db, 'reading_goals', 'goal-2025'), INITIAL_GOAL);
      for (const h of INITIAL_HABITS) {
        await setDoc(doc(db, 'daily_habits', h.id), h);
      }
      await setDoc(doc(db, 'app_settings', 'primary-settings'), INITIAL_SETTINGS);
    } catch (err) {
      console.warn('Seeding note:', err);
    }
  };

  // Clear all mockup books for admin to start clean
  const clearAllBooks = async () => {
    try {
      for (const b of books) {
        await deleteDoc(doc(db, 'books', b.id));
      }
      setBooks([]);
      setSelectedBook(null);
    } catch (err) {
      console.warn('Clear books fallback:', err);
      setBooks([]);
      setSelectedBook(null);
    }
  };

  return (
    <DataContext.Provider
      value={{
        books,
        authors,
        series,
        goal,
        habits,
        settings,
        snapshots,
        isLoading,
        selectedBook,
        setSelectedBook,
        addBook,
        updateBook,
        deleteBook,
        markAsBought,
        updateRatingAndReview,
        updateSeriesReview,
        addSeries,
        toggleDailyHabit,
        updateGoalTarget,
        updateSettings,
        saveBookcaseSnapshot,
        deleteSnapshot,
        resetToDefaultData,
        clearAllBooks,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

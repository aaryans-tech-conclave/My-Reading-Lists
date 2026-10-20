import { Book, Author, SeriesItem, ReadingGoal, DailyHabit, AppSettings } from '../types';

export const INITIAL_AUTHORS: Author[] = [
  {
    id: 'auth-nk-jemisin',
    name: 'N.K. Jemisin',
    cover_image_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
    pronouns: 'she/her',
    nationality: 'American',
    is_favorite: true,
    bio: 'Pioneering speculative fiction author who became the first to win the Hugo Award for Best Novel in three consecutive years for The Broken Earth trilogy.',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'auth-1',
    name: 'Donna Tartt',
    cover_image_url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400',
    pronouns: 'she/her',
    nationality: 'American',
    is_favorite: true,
    bio: 'American novelist known for her richly textured novels exploring youth, art, and obsession.',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'auth-2',
    name: 'Ted Chiang',
    cover_image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    pronouns: 'he/him',
    nationality: 'American',
    is_favorite: true,
    bio: 'Award-winning speculative fiction author masterfully blending philosophical inquiry and emotional resonance.',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'auth-3',
    name: 'Haruki Murakami',
    cover_image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    pronouns: 'he/him',
    nationality: 'Japanese',
    is_favorite: true,
    bio: 'Internationally acclaimed author of surreal, contemplative realism and melancholic urban journeys.',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'auth-4',
    name: 'Ursula K. Le Guin',
    cover_image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    pronouns: 'she/her',
    nationality: 'American',
    is_favorite: true,
    bio: 'Legendary visionary of anthropology, anarchism, feminist science fiction, and Taoist philosophy.',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'auth-5',
    name: 'Kazuo Ishiguro',
    cover_image_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
    pronouns: 'he/him',
    nationality: 'British-Japanese',
    is_favorite: false,
    bio: 'Nobel Prize laureate renowned for delicate restraint, unreliable memory, and emotional undertows.',
    createdAt: '2024-01-01T00:00:00Z',
  },
];

export const INITIAL_SERIES: SeriesItem[] = [
  {
    id: 'series-broken-earth',
    title: 'The Broken Earth Trilogy',
    author_id: 'auth-nk-jemisin',
    status: 'In Progress',
    total_books: 3,
    books_read: 2,
    overall_rating: 4.8,
    overall_review: `### Masterclass in Geological Fantasy & Generational Trauma

N.K. Jemisin creates a world where tectonic catastrophe is a constant pulse of existence. The Broken Earth trilogy is an unparalleled feat of worldbuilding and narrative courage. The second-person perspective in The Fifth Season creates an unmatched sense of intimacy and devastation, expanding outward into an epic reckoning with survival, motherhood, and systemic oppression.

* **Worldcraft**: 5/5 — Father Earth, stone-lore, comms, and the Fifth Seasons feel terrifyingly tangible.
* **Characters**: Essun and Nassun form one of speculative fiction's most aching mother-daughter dualities.
* **Verdict**: Essential modern literature.`,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'series-1',
    title: 'Earthsea Cycle',
    author_id: 'auth-4',
    status: 'In Progress',
    total_books: 6,
    books_read: 3,
    overall_rating: 4.9,
    overall_review: `### Taoist Wisdom, Archipelago Shadows, and True Names

Ursula K. Le Guin's Earthsea remains a foundational pillar of high fantasy. Unlike stories that idolize conquest and destructive might, Earthsea asks: *What does it mean to balance light and shadow?* Ged's journey from arrogant young wizard to humbled dragonlord and silent herdsman is unforgettable.

* **Key Strengths**: Lyrical concision, ethical depth, and a world of winds, currents, and islands.
* **Favorite Volume**: *The Tombs of Atuan* and *The Farthest Shore*.`,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'series-2',
    title: 'Stories of Your Life & Exhalation',
    author_id: 'auth-2',
    status: 'Completed',
    total_books: 2,
    books_read: 2,
    overall_rating: 5.0,
    overall_review: `### Philosophical Wonder & Speculative Perfection

Ted Chiang does not write disposable science fiction; every single short story is a precision-cut gemstone exploring free will, language, entropy, and what it truly means to love finite beings. *Story of Your Life* and *Exhalation* reshaped how I think about time and human memory.`,
    createdAt: '2024-01-01T00:00:00Z',
  },
];

export const INITIAL_BOOKS: Book[] = [
  {
    id: 'book-obelisk-gate',
    title: 'The Obelisk Gate',
    author_id: 'auth-nk-jemisin',
    series_id: 'series-broken-earth',
    cover_image_url: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=600',
    status: 'Currently Reading',
    is_owned: true,
    purchase_date: '2025-01-10',
    star_rating: 4.5,
    pages_read: 205,
    total_pages: 410,
    date_started: '2025-02-01',
    format: 'Physical',
    genre_tags: ['Fantasy', 'Sci-Fi', 'Dystopian'],
    spine_color: '#3b2f2f',
    spine_accent: '#fbbf24',
    shelf_index: 0,
    shelf_position: 0,
    long_text_review: `# The Obelisk Gate — N.K. Jemisin

> "This is what you must remember: the world is what it is, and we are what we are."

The breathtaking continuation of The Broken Earth trilogy. Essun has found shelter in Castrima, while Nassun navigates the harrowing, volatile journey of discovery in the deep South.

### Key Reflections
* **Worldbuilding**: The orogenes and stone-lore reach extraordinary emotional and visceral depth.
* **Themes**: Survival, motherhood, oppression, and geological trauma.`,
    createdAt: '2025-01-10T00:00:00Z',
    updatedAt: '2025-02-18T00:00:00Z',
  },
  {
    id: 'book-city-we-became',
    title: 'The City We Became',
    author_id: 'auth-nk-jemisin',
    cover_image_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=600',
    status: 'Read',
    is_owned: true,
    purchase_date: '2025-01-02',
    star_rating: 4.0,
    pages_read: 448,
    total_pages: 448,
    date_started: '2025-01-04',
    date_finished: '2025-01-18',
    format: 'Physical',
    genre_tags: ['Urban Fantasy', 'Magical Realism'],
    spine_color: '#1e3a5f',
    spine_accent: '#38bdf8',
    shelf_index: 0,
    shelf_position: 1,
    long_text_review: `# The City We Became — N.K. Jemisin

Every great city has a soul. When New York awakens, five avatars rise up across the boroughs to battle an ancient, eldritch threat.`,
    createdAt: '2025-01-02T00:00:00Z',
    updatedAt: '2025-01-18T00:00:00Z',
  },
  {
    id: 'book-stone-sky',
    title: 'The Stone Sky',
    author_id: 'auth-nk-jemisin',
    series_id: 'series-broken-earth',
    cover_image_url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600',
    status: 'Read',
    is_owned: true,
    purchase_date: '2025-01-20',
    star_rating: 5.0,
    pages_read: 416,
    total_pages: 416,
    date_started: '2025-01-22',
    date_finished: '2025-02-05',
    format: 'Physical',
    genre_tags: ['Fantasy', 'Sci-Fi'],
    spine_color: '#2e4a3e',
    spine_accent: '#86efac',
    shelf_index: 0,
    shelf_position: 2,
    long_text_review: `# The Stone Sky — N.K. Jemisin

The monumental conclusion to The Broken Earth trilogy. A masterpiece of tension, reconciliation, and apocalyptic hope.`,
    createdAt: '2025-01-20T00:00:00Z',
    updatedAt: '2025-02-05T00:00:00Z',
  },
  {
    id: 'book-1',
    title: 'The Secret History',
    author_id: 'auth-1',
    cover_image_url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600',
    status: 'Currently Reading',
    is_owned: true,
    purchase_date: '2025-01-12',
    star_rating: 4.5,
    pages_read: 320,
    total_pages: 559,
    date_started: '2025-02-01',
    format: 'Physical',
    genre_tags: ['Dark Academia', 'Mystery', 'Literary Fiction'],
    spine_color: '#1e293b',
    spine_accent: '#fbbf24',
    shelf_index: 0,
    shelf_position: 0,
    long_text_review: `# The Secret History — Donna Tartt

> "Beauty is terror. Whatever we call beautiful, we quiver before it."

Donna Tartt weaves an unforgettable psychological spell in this modern Greek tragedy. Set against the frost-bitten hills of Vermont's Hampden College, the novel unravels the claustrophobic world of six classics students under the mentorship of Julian Morrow.

### Key Reflections
* **Atmosphere**: Pure sensory indulgence — rainy Greek lexicons, cigarette smoke, velvet armchairs, and chilling moral ambiguity.
* **Characterization**: Henry Winter remains one of the most enigmatic figures in contemporary fiction; cold calculation wrapped in high classical aesthetics.
* **Themes**: The fatal allure of transcending ordinary morality in the name of beauty.

A masterpiece of pacing and haunting atmosphere.`,
    createdAt: '2025-01-12T00:00:00Z',
    updatedAt: '2025-02-15T00:00:00Z',
  },
  {
    id: 'book-2',
    title: 'Exhalation',
    author_id: 'auth-2',
    series_id: 'series-2',
    cover_image_url: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?auto=format&fit=crop&q=80&w=600',
    status: 'Read',
    is_owned: true,
    purchase_date: '2025-01-05',
    star_rating: 5.0,
    pages_read: 352,
    total_pages: 352,
    date_started: '2025-01-08',
    date_finished: '2025-01-22',
    format: 'Physical',
    genre_tags: ['Sci-Fi', 'Short Stories', 'Philosophy'],
    spine_color: '#155e75',
    spine_accent: '#38bdf8',
    shelf_index: 0,
    shelf_position: 1,
    long_text_review: `# Exhalation: Stories — Ted Chiang

> "Contemplate the marvel that is existence, and rejoice that you are able to do so."

Ted Chiang operates with the precision of a watchmaker and the tenderness of a philosopher. Each novella in this collection investigates free will, thermodynamic entropy, memory distortion, and the soul.

### Standout Stories
1. **The Merchant and the Alchemist's Gate**: A time-travel fable woven through ancient Baghdad with profound thoughts on destiny and forgiveness.
2. **Exhalation**: An anatomist discovering the mechanical entropy of their universe. Deeply moving meditation on thermodynamics.
3. **Anxiety Is the Dizziness of Freedom**: Using prism-technology to glimpse parallel timelines and what it truly means to make a choice.

An undisputed 5-star collection.`,
    createdAt: '2025-01-05T00:00:00Z',
    updatedAt: '2025-01-22T00:00:00Z',
  },
  {
    id: 'book-3',
    title: 'Klara and the Sun',
    author_id: 'auth-5',
    cover_image_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=600',
    status: 'Read',
    is_owned: true,
    purchase_date: '2024-11-20',
    star_rating: 4.5,
    pages_read: 303,
    total_pages: 303,
    date_started: '2025-01-25',
    date_finished: '2025-02-08',
    format: 'Physical',
    genre_tags: ['Dystopian', 'Literary Fiction', 'Sci-Fi'],
    spine_color: '#b45309',
    spine_accent: '#fef08a',
    shelf_index: 0,
    shelf_position: 2,
    long_text_review: `# Klara and the Sun — Kazuo Ishiguro

A luminous exploration of devotion, innocence, and what constitutes the human heart. Klara, an Artificial Friend with extraordinary observation skills, watches the world through department store windows and later within a fractured family home.

Ishiguro's delicate, understated prose delivers devastating emotional clarity without melodrama.`,
    createdAt: '2024-11-20T00:00:00Z',
    updatedAt: '2025-02-08T00:00:00Z',
  },
  {
    id: 'book-4',
    title: 'Norwegian Wood',
    author_id: 'auth-3',
    cover_image_url: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=600',
    status: 'Read',
    is_owned: true,
    purchase_date: '2024-12-18',
    star_rating: 4.0,
    pages_read: 296,
    total_pages: 296,
    date_started: '2025-02-09',
    date_finished: '2025-02-18',
    format: 'Physical',
    genre_tags: ['Romance', 'Coming-of-Age', 'Classics'],
    spine_color: '#831843',
    spine_accent: '#fbcfe8',
    shelf_index: 1,
    shelf_position: 0,
    long_text_review: `# Norwegian Wood — Haruki Murakami

A poignant, melancholic nostalgia that aches with acoustic guitar chords and autumn rain. Toru Watanabe's reflections on youth, loss, and the choices that anchor us to life.`,
    createdAt: '2024-12-18T00:00:00Z',
    updatedAt: '2025-02-18T00:00:00Z',
  },
  {
    id: 'book-5',
    title: 'A Wizard of Earthsea',
    author_id: 'auth-4',
    series_id: 'series-1',
    cover_image_url: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=600',
    status: 'TBR',
    is_owned: true,
    purchase_date: '2025-02-14',
    star_rating: 0,
    pages_read: 0,
    total_pages: 183,
    format: 'Physical',
    genre_tags: ['Fantasy', 'YA', 'Classics'],
    spine_color: '#166534',
    spine_accent: '#86efac',
    shelf_index: 1,
    shelf_position: 1,
    long_text_review: '',
    createdAt: '2025-02-14T00:00:00Z',
    updatedAt: '2025-02-14T00:00:00Z',
  },
  {
    id: 'book-6',
    title: 'The Left Hand of Darkness',
    author_id: 'auth-4',
    cover_image_url: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=600',
    status: 'TBR',
    is_owned: true,
    purchase_date: '2025-02-10',
    star_rating: 0,
    pages_read: 0,
    total_pages: 304,
    format: 'Physical',
    genre_tags: ['Sci-Fi', 'Feminism', 'Classics'],
    spine_color: '#334155',
    spine_accent: '#cbd5e1',
    shelf_index: 1,
    shelf_position: 2,
    long_text_review: '',
    createdAt: '2025-02-10T00:00:00Z',
    updatedAt: '2025-02-10T00:00:00Z',
  },
  {
    id: 'book-7',
    title: 'Kafka on the Shore',
    author_id: 'auth-3',
    cover_image_url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=600',
    status: 'TBR',
    is_owned: true,
    purchase_date: '2025-02-02',
    star_rating: 0,
    pages_read: 0,
    total_pages: 505,
    format: 'Physical',
    genre_tags: ['Magical Realism', 'Mystery', 'Fiction'],
    spine_color: '#4c1d95',
    spine_accent: '#e9d5ff',
    shelf_index: 1,
    shelf_position: 3,
    long_text_review: '',
    createdAt: '2025-02-02T00:00:00Z',
    updatedAt: '2025-02-02T00:00:00Z',
  },
  {
    id: 'book-8',
    title: 'Pachinko',
    author_id: 'auth-1',
    cover_image_url: 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?auto=format&fit=crop&q=80&w=600',
    status: 'TBR',
    is_owned: false,
    star_rating: 0,
    pages_read: 0,
    total_pages: 496,
    format: 'Physical',
    genre_tags: ['Historical Fiction', 'Family Saga'],
    spine_color: '#854d0e',
    spine_accent: '#fef08a',
    long_text_review: '',
    createdAt: '2025-02-16T00:00:00Z',
    updatedAt: '2025-02-16T00:00:00Z',
  },
  {
    id: 'book-9',
    title: 'Project Hail Mary',
    author_id: 'auth-2',
    cover_image_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600',
    status: 'TBR',
    is_owned: false,
    star_rating: 0,
    pages_read: 0,
    total_pages: 496,
    format: 'Audiobook',
    genre_tags: ['Sci-Fi', 'Space Exploration', 'Humor'],
    spine_color: '#0f766e',
    spine_accent: '#99f6e4',
    long_text_review: '',
    createdAt: '2025-02-18T00:00:00Z',
    updatedAt: '2025-02-18T00:00:00Z',
  },
  {
    id: 'book-10',
    title: 'Tomorrow, and Tomorrow, and Tomorrow',
    author_id: 'auth-1',
    cover_image_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=600',
    status: 'TBR',
    is_owned: false,
    star_rating: 0,
    pages_read: 0,
    total_pages: 416,
    format: 'Physical',
    genre_tags: ['Literary Fiction', 'Video Games', 'Friendship'],
    spine_color: '#be185d',
    spine_accent: '#fbcfe8',
    long_text_review: '',
    createdAt: '2025-02-19T00:00:00Z',
    updatedAt: '2025-02-19T00:00:00Z',
  },
];

export const INITIAL_GOAL: ReadingGoal = {
  id: 'goal-2025',
  year: 2025,
  target_books: 30,
  books_completed_count: 3,
};

export const INITIAL_HABITS: DailyHabit[] = [
  { id: 'h-2025-02-14', date: '2025-02-14', read_physical: true, read_audio: false, minutes_read: 45 },
  { id: 'h-2025-02-15', date: '2025-02-15', read_physical: true, read_audio: true, minutes_read: 60 },
  { id: 'h-2025-02-16', date: '2025-02-16', read_physical: false, read_audio: true, minutes_read: 30 },
  { id: 'h-2025-02-17', date: '2025-02-17', read_physical: true, read_audio: false, minutes_read: 50 },
  { id: 'h-2025-02-18', date: '2025-02-18', read_physical: true, read_audio: true, minutes_read: 75 },
  { id: 'h-2025-02-19', date: '2025-02-19', read_physical: true, read_audio: false, minutes_read: 40 },
  { id: 'h-2025-02-20', date: '2025-02-20', read_physical: true, read_audio: true, minutes_read: 60 },
];

export const INITIAL_SETTINGS: AppSettings = {
  id: 'primary-settings',
  banner_image_url: 'https://images.unsplash.com/photo-1507842229451-7f01be7f7b3a?auto=format&fit=crop&q=80&w=1600',
  banner_title: 'A Life Measured in Pages & Spines',
  quote_text: 'A reader lives a thousand lives before he dies. The man who never reads lives only one.',
  quote_author: 'George R.R. Martin',
  theme_palette: 'sage',
  custom_hex: '#10b981',
  widget_order: ['bookshelf', 'tbr', 'wishlist', 'recently_bought', 'habits', 'goals'],
};

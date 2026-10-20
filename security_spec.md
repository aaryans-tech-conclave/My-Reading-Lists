# FolioRead Security Specification

## 1. Data Invariants
- **Public Read Model**: All book records, authors, series, reading goals, daily habits, app settings, and bookcase snapshots are readable by the public (read-only portfolio).
- **Invisible Admin Write Gate**: Only verified Admin (`kumar.aaryan2003@gmail.com` or documents in `/admins/{adminUid}`) can create, update, or delete books, authors, series, goals, and settings.
- **Snapshot Community Contribution**: Any user can capture and contribute a bookcase snapshot to `/bookcase_snapshots/{snapshotId}` with payload size boundaries (capped to max 500KB image, valid fields), and read existing snapshots.
- **Strict Bounds & Anti-Update Gaps**:
  - `Book` ratings must be numeric between 0.0 and 5.0.
  - Review text size limit (<= 100,000 characters).
  - Status must be in `['TBR', 'Currently Reading', 'Read', 'DNF']`.
  - Format must be in `['Physical', 'eReader', 'Audiobook']`.
  - Genres array must be <= 10 items.
  - No shadow fields permitted.

## 2. The "Dirty Dozen" Payloads (Adversarial Tests)

1. **Unauthenticated Book Creation**: An unauthenticated user attempts to create a book. (Expected: PERMISSION_DENIED)
2. **Unverified Email Admin Spoof**: A user with fake unverified email attempts to update reading goals. (Expected: PERMISSION_DENIED)
3. **Invalid Book Status Bypass**: Attempt to create a book with `status: 'UnknownStatus'`. (Expected: PERMISSION_DENIED)
4. **Rating Boundary Violation**: Attempt to update `star_rating: 9.5` (above 5.0). (Expected: PERMISSION_DENIED)
5. **Denial-of-Wallet Long String**: Attempt to insert 2MB string into `title` or `long_text_review`. (Expected: PERMISSION_DENIED)
6. **Shadow Field Injection**: Attempt to create a book with `{ "title": "Book", "is_admin_override": true }`. (Expected: PERMISSION_DENIED)
7. **Snapshot Huge Payload Attack**: Attempt to submit snapshot with 5MB `image_data`. (Expected: PERMISSION_DENIED)
8. **Public User Attempting Author Delete**: Non-admin user tries to delete an author. (Expected: PERMISSION_DENIED)
9. **Admin Self-Escalation**: Regular user writes themselves into `/admins/{uid}`. (Expected: PERMISSION_DENIED)
10. **Habit Field Tampering**: Attempt to save negative `minutes_read` or shadow properties in daily habit. (Expected: PERMISSION_DENIED)
11. **App Settings Vandalism**: Non-admin attempts to replace banner image and quote. (Expected: PERMISSION_DENIED)
12. **Array Flood Attack**: Attempt to submit 100 tags in `genre_tags` array. (Expected: PERMISSION_DENIED)

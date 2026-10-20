/**
 * Helper to display book status. If status is 'Read', shows the short-form star review
 * like '3.5/5 Star' per user specifications.
 */
export const formatBookStatus = (status: string, starRating?: number): string => {
  if (status === 'Read') {
    const rating = starRating && starRating > 0 ? starRating : 5;
    const formatted = rating % 1 === 0 ? rating.toString() : rating.toFixed(1);
    return `${formatted}/5 Star`;
  }
  return status;
};

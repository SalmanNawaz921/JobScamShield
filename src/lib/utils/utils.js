import {
  formatDistanceToNow,
  isToday,
  isThisWeek,
  format,
  isYesterday,
} from "date-fns";

export const formatFirestoreTimestamp = (timestamp, formatType = "date") => {
  if (!timestamp?.seconds) return "N/A";

  // Convert Firestore timestamp to JS Date
  const date = new Date(
    timestamp.seconds * 1000 + (timestamp.nanoseconds || 0) / 1000000
  );

  // Validate the date
  if (isNaN(date.getTime())) return "Invalid Date";
  switch (formatType) {
    case "date":
      return date.toLocaleDateString();
    case "time":
      return date.toLocaleTimeString();
    case "relative":
      return formatDistanceToNow(date, { addSuffix: true });
    case "group":
      // For grouping purposes
      // More precise grouping logic
      if (isToday(date)) return "Today";
      if (isYesterday(date)) return "Yesterday";
      if (isThisWeek(date)) return "This Week";

      return format(date, "dd MMMM yyyy"); // "March 2023"
    case "full":
    default:
      return date.toLocaleString();
  }
};

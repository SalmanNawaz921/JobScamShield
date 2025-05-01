import { formatDistanceToNow } from 'date-fns';

export const formatFirestoreTimestamp = (timestamp, formatType = 'full') => {
    if (!timestamp?.seconds) return 'N/A';
    
    const date = new Date(timestamp.seconds * 1000);
    
    switch(formatType) {
      case 'date':
        return date.toLocaleDateString();
      case 'time':
        return date.toLocaleTimeString();
      case 'relative':
        return formatDistanceToNow(date, { addSuffix: true });
      case 'full':
      default:
        return date.toLocaleString();
    }
  };
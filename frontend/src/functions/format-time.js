export default function formatDistanceToNow(timeString) {
    const createdAt = new Date(timeString);
    const currentTime = new Date();
    const diffTime = Math.abs(currentTime - createdAt);
    const diffMinutes = Math.floor(diffTime / (1000 * 60)); 
    
    let postedTime;
    if (diffMinutes < 60) {
        postedTime = `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
    } else {
        const diffHours = Math.floor(diffMinutes / 60);
        if (diffHours < 24) {
            postedTime = `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
        } else {
            const diffDays = Math.floor(diffHours / 24);
            postedTime = `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
        }
    }
    return postedTime
}
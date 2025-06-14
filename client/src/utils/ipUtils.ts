
export const getUserIP = async (): Promise<string> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Error fetching IP:', error);
    return 'unknown';
  }
};

export const checkRecentRequest = async (userIP: string): Promise<boolean> => {
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
  
  try {
    const { data, error } = await fetch('/api/check-recent-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userIP, since: thirtyMinutesAgo })
    }).then(res => res.json());
    
    if (error) throw error;
    return data.hasRecentRequest;
  } catch (error) {
    console.error('Error checking recent request:', error);
    return false;
  }
};

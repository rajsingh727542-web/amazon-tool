import { useEffect, useState } from 'react';
import { formatTime } from '../lib/utils';

export function useLiveClock(format: '12h' | '24h') {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return formatTime(now, format);
}

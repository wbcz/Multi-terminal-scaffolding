import dayjs from 'dayjs';

export const formatDate = (date: string | number | Date, format = 'YYYY-MM-DD') => {
  return dayjs(date).format(format);
};

export const formatDateTime = (date: string | number | Date) => {
  return formatDate(date, 'YYYY-MM-DD HH:mm:ss');
};

export const formatTime = (date: string | number | Date) => {
  return formatDate(date, 'HH:mm:ss');
};

export const getRelativeTime = (date: string | number | Date) => {
  const now = dayjs();
  const target = dayjs(date);
  const diffMinutes = now.diff(target, 'minute');
  
  if (diffMinutes < 1) return '刚刚';
  if (diffMinutes < 60) return `${diffMinutes}分钟前`;
  
  const diffHours = now.diff(target, 'hour');
  if (diffHours < 24) return `${diffHours}小时前`;
  
  const diffDays = now.diff(target, 'day');
  if (diffDays < 30) return `${diffDays}天前`;
  
  const diffMonths = now.diff(target, 'month');
  if (diffMonths < 12) return `${diffMonths}个月前`;
  
  return `${now.diff(target, 'year')}年前`;
}; 
import { format, formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

export const formatToKoreanDate = (isoDate) => {
  return format(new Date(isoDate), "yyyy-MM-dd a hh시 mm분", { locale: ko });
};

export const formatTimeAgo = (isoDate) => {
  let timeAgo = formatDistanceToNow(new Date(isoDate), {
    addSuffix: true,
    locale: ko
  });

  timeAgo = timeAgo.replace(' 미만', '').replace('약 ', '');

  return timeAgo;
};

const DateFormatter = {
  formatToKoreanDate,
  formatTimeAgo
};

export default DateFormatter;
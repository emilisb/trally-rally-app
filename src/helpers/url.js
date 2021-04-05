import config from '../config';

export const getStaticUrl = (url) => {
  if (url.startsWith('uploads/')) {
    return `${config.STATIC_URL}/${url}`;
  }

  return url;
};

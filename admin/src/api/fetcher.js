import axiosClient from './axiosClient';

export const fetcher = (url, body = {}) => {
  // If SWR passes an array accidentally
  if (Array.isArray(url)) {
    body = url[1] || {};
    url = url[0];
  }

  if (typeof url !== 'string') {
    throw new Error(`URL must be a string, got: ${typeof url}`);
  }

  // Only POST if body has keys
  if (body) {
    return axiosClient.post(url, body).then((res) => res.data);
  }

  // fallback to GET if no body
  return axiosClient.get(url).then((res) => res.data);
};

import axiosClient from './axiosClient';

export const fetcher = (url) => axiosClient.post(url).then((res) => res.data);

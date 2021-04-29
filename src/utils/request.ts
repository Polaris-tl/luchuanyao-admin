import axios from 'axios';

axios.defaults.timeout = 5000;
axios.defaults.baseURL = 'http://39.104.202.5:8080';
// 添加请求拦截器
// axios.interceptors.request.use(
//   (config) => {
//     const c_token = localStorage.getItem("token");
//     if (c_token) {
//       config.headers.Authorization = "Bearer " + c_token;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// 添加响应拦截器
axios.interceptors.response.use(
  (res) => res.data,
  (error) => Promise.reject(error),
);

export default axios;

export const myGet: <T = any>(
  url: string,
  params?: Record<any, string>,
) => Promise<T> = (url, params) => {
  const searchParams = new URLSearchParams();
  if (params) {
    for (let i in params) {
      searchParams.set(i, params[i]);
    }
  }
  return axios.get(url + '?' + searchParams);
};

export const myPost: <T = any>(url: string, parameter: any) => Promise<T> = (
  url,
  parameter,
) => {
  return axios.post(url, parameter);
};

export const uploadFile: (file: File) => Promise<{ url: string }> = (
  file: File,
) => {
  const param = new FormData();
  param.append('file', file);
  return axios.post('Upload/fileUpload', param);
};

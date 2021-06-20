import axios from 'axios';

axios.defaults.timeout = 5000;
axios.defaults.baseURL = 'http://39.104.202.5:8080';
// 添加请求拦截器
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = 'Bearer ' + token;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

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
export const myPost2: <T = any>(url: string, parameter: any) => Promise<T> = (
  url,
  parameter,
) => {
  return axios.post(url, parameter, {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const uploadFile: (file: File) => Promise<{ url: string }> = (file) => {
  const param = new FormData();
  param.append('file', file);
  return axios.post('Upload/fileUpload', param, { timeout: 0 });
};

// resourceId 1产品技术 2服务案例 3新闻中心 4加入我们 5解决方案 6品牌战略
export const uploadFiles: (
  file: File[],
  resourceId: string,
) => Promise<{ data: Record<any, string>; url: string; msg: string }> = (
  file,
  resourceId,
) => {
  const param = new FormData();
  param.append('resourceId', resourceId);
  file.forEach((item) => param.append('files', item));
  return axios.post('Upload/imgUpload4Banner', param, { timeout: 0 });
};

import axios, { AxiosRequestConfig } from "axios";
import { logger } from "./util.log.js";
import { Logger } from "log4js";

export class HttpError extends Error {
  status?: number;
  statusText?: string;
  code?: string;
  request?: { url: string; method: string; params?: any; data?: any };
  response?: { data: any };
  cause?: any;
  constructor(error: any) {
    if (!error) {
      return;
    }
    super(error.message);
    this.name = error.name;
    this.code = error.code;
    this.cause = error.cause;

    this.status = error.response?.status;
    this.statusText = error.response?.statusText;
    this.request = {
      url: error.config?.url,
      method: error.config?.method,
      params: error.config?.params,
      data: error.config?.data,
    };
    this.response = {
      data: error.response?.data,
    };

    delete error.response;
    delete error.config;
    delete error.request;
    logger.error(error);
  }
}
/**
 * @description 创建请求实例
 */
export function createAxiosService({ logger }: { logger: Logger }) {
  // 创建一个 axios 实例
  const service = axios.create();
  // 请求拦截
  service.interceptors.request.use(
    (config: any) => {
      logger.info(`http request:${config.url}，method:${config.method}，params:${JSON.stringify(config.params)}`);
      return config;
    },
    (error: Error) => {
      // 发送失败
      logger.error("接口请求失败：", error);
      return Promise.reject(error);
    }
  );
  // 响应拦截
  service.interceptors.response.use(
    (response: any) => {
      logger.info("http response:", JSON.stringify(response?.data));
      return response.data;
    },
    (error: any) => {
      // const status = _.get(error, 'response.status')
      // switch (status) {
      //   case 400: error.message = '请求错误'; break
      //   case 401: error.message = '未授权，请登录'; break
      //   case 403: error.message = '拒绝访问'; break
      //   case 404: error.message = `请求地址出错: ${error.response.config.url}`; break
      //   case 408: error.message = '请求超时'; break
      //   case 500: error.message = '服务器内部错误'; break
      //   case 501: error.message = '服务未实现'; break
      //   case 502: error.message = '网关错误'; break
      //   case 503: error.message = '服务不可用'; break
      //   case 504: error.message = '网关超时'; break
      //   case 505: error.message = 'HTTP版本不受支持'; break
      //   default: break
      // }
      logger.error(
        `请求出错：status:${error.response?.status},statusText:${error.response?.statusText},url:${error.config?.url},method:${error.config?.method}。`
      );
      logger.error("返回数据:", JSON.stringify(error.response?.data));

      if (error instanceof AggregateError) {
        logger.error(error);
      }
      const err = new HttpError(error);
      return Promise.reject(err);
    }
  );
  return service;
}

export const http = createAxiosService({ logger }) as HttpClient;
export type HttpClientResponse<R> = any;
export type HttpClient = {
  request<D = any, R = any>(config: AxiosRequestConfig<D>): Promise<HttpClientResponse<R>>;
};

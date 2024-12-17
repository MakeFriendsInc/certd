import { request } from "/src/api/service";

export function createPaymentApi() {
  const apiPrefix = "/sys/suite/payment";
  return {
    async GetList(query: any) {
      return await request({
        url: apiPrefix + "/page",
        method: "post",
        data: query
      });
    },

    async AddObj(obj: any) {
      return await request({
        url: apiPrefix + "/add",
        method: "post",
        data: obj
      });
    },

    async UpdateObj(obj: any) {
      return await request({
        url: apiPrefix + "/update",
        method: "post",
        data: obj
      });
    },

    async DelObj(id: number) {
      return await request({
        url: apiPrefix + "/delete",
        method: "post",
        params: { id }
      });
    },

    async GetObj(id: number) {
      return await request({
        url: apiPrefix + "/info",
        method: "post",
        params: { id }
      });
    },

    async GetOptions(id: number) {
      return await request({
        url: apiPrefix + "/options",
        method: "post"
      });
    },

    async GetSimpleInfo(id: number) {
      return await request({
        url: apiPrefix + "/simpleInfo",
        method: "post",
        params: { id }
      });
    },

    async GetDefineTypes() {
      return await request({
        url: apiPrefix + "/getTypeDict",
        method: "post"
      });
    },

    async GetProviderDefine(type: string) {
      return await request({
        url: apiPrefix + "/define",
        method: "post",
        params: { type }
      });
    }
  };
}

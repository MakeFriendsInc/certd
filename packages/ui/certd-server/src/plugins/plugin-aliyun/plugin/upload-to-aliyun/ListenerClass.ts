// This file is auto-generated, don't edit it
import Alb20200616, * as $Alb20200616 from '@alicloud/alb20200616';
import * as $OpenApi from '@alicloud/openapi-client';
import Util, * as $Util from '@alicloud/tea-util';
import { checkRet } from '../../utils';

export default class Client {
  /**
   * Initialize the Client with the AccessKey of the account
   * @param accessKeyId
   * @param accessKeySecret
   * @return Client
   * @throws Exception
   */
  static createClient(
    accessKeyId: string,
    accessKeySecret: string
  ): Alb20200616 {
    const config = new $OpenApi.Config({
      // Required, your AccessKey ID
      accessKeyId: accessKeyId,
      // Required, your AccessKey secret
      accessKeySecret: accessKeySecret,
    });
    // See https://api.alibabacloud.com/product/Alb.
    config.endpoint = 'https://alb.us-west-1.aliyuncs.com';
    return new Alb20200616(config);
  }

  static async main(
    accessKeyId: string,
    accessKeySecret: string,
    certificateId: string,
    listenerId: string,
    logger: any
  ): Promise<void> {
    // Please ensure that the environment variables ALIBABA_CLOUD_ACCESS_KEY_ID and ALIBABA_CLOUD_ACCESS_KEY_SECRET are set.
    // The project code leakage may result in the leakage of AccessKey, posing a threat to the security of all resources under the account. The following code example is called by using the environment variable to obtain the AccessKey, for reference only. It is recommended to use the more secure STS credential. For more credentials, please refer to: https://www.alibabacloud.com/help/en/alibaba-cloud-sdk-262060/latest/credentials-settings-5
    const client = Client.createClient(accessKeyId, accessKeySecret);
    const certificates0 =
      new $Alb20200616.AssociateAdditionalCertificatesWithListenerRequestCertificates(
        {
          certificateId,
        }
      );
    const associateAdditionalCertificatesWithListenerRequest =
      new $Alb20200616.AssociateAdditionalCertificatesWithListenerRequest({
        listenerId,
        certificates: [certificates0],
      });
    const runtime = new $Util.RuntimeOptions({});
    logger.info('associateAdditionalCertificatesWithListener方法启动');

    try {
      // Copy the code to run, please print the return value of the API by yourself.
      const res =
        await client.associateAdditionalCertificatesWithListenerWithOptions(
          associateAdditionalCertificatesWithListenerRequest,
          runtime
        );

      logger.info('res', res);

      checkRet(res);
      logger.info('关联扩展证书和监听成功');
    } catch (error) {
      // Print error if needed.
      Util.assertAsString(error.message);
      throw new Error('执行失败：' + error.Message);
    }
  }
}

import { App, Autoload, Config, Init, Inject, Scope, ScopeEnum } from '@midwayjs/core';
import { getPlusInfo, isPlus } from '@certd/plus-core';
import { isDev, logger } from '@certd/basic';

import { SysInstallInfo, SysSettingsService } from '@certd/lib-server';
import { getVersion } from '../../utils/version.js';
import dayjs from 'dayjs';
import { Application } from '@midwayjs/koa';
import { httpsServer, HttpsServerOptions } from './https/server.js';

@Autoload()
@Scope(ScopeEnum.Request, { allowDowngrade: true })
export class AutoZPrint {
  @Inject()
  sysSettingsService: SysSettingsService;

  @App()
  app: Application;

  @Config('https')
  httpsConfig: HttpsServerOptions;

  @Init()
  async init() {
    //监听https
    this.startHttpsServer();

    const installInfo: SysInstallInfo = await this.sysSettingsService.getSetting(SysInstallInfo);
    logger.info('=========================================');
    logger.info('当前站点ID:', installInfo.siteId);
    const version = await getVersion();
    logger.info(`当前版本:${version}`);
    const plusInfo = getPlusInfo();
    if (isPlus()) {
      logger.info(`授权信息:${plusInfo.vipType},${dayjs(plusInfo.expireTime).format('YYYY-MM-DD')}`);
    }
    logger.info('Certd已启动');
    logger.info('=========================================');
    if (isDev()) {
      this.startHeapLog();
    }
  }

  startHeapLog() {
    function format(bytes: any) {
      return (bytes / 1024 / 1024).toFixed(2) + ' MB';
    }
    setInterval(() => {
      logger.info(`heapUsed: ${format(process.memoryUsage().heapUsed)}`);
    }, 60000);
  }

  async startHttpsServer() {
    if (!this.httpsConfig.enabled) {
      logger.info('Https server is not enabled');
      return;
    }
    httpsServer.start({
      ...this.httpsConfig,
      app: this.app,
    });
  }
}

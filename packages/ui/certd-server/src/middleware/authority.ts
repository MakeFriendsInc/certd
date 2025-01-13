import { Init, Inject, MidwayWebRouterService, Provide, Scope, ScopeEnum } from '@midwayjs/core';
import { IMidwayKoaContext, IWebMiddleware, NextFunction } from '@midwayjs/koa';
import jwt from 'jsonwebtoken';
import { Constants, SysPrivateSettings, SysSettingsService } from '@certd/lib-server';
import { logger } from '@certd/basic';
import { AuthService } from '../modules/sys/authority/service/auth-service.js';
import { Next } from 'koa';
import { OpenKeyService } from '../modules/open/service/open-key-service.js';

/**
 * 权限校验
 */
@Provide()
@Scope(ScopeEnum.Singleton)
export class AuthorityMiddleware implements IWebMiddleware {
  @Inject()
  webRouterService: MidwayWebRouterService;
  @Inject()
  authService: AuthService;
  @Inject()
  openKeyService: OpenKeyService;
  @Inject()
  sysSettingsService: SysSettingsService;

  secret: string;
  @Init()
  async init() {
    const setting: SysPrivateSettings = await this.sysSettingsService.getSetting(SysPrivateSettings);
    this.secret = setting.jwtKey;
  }

  resolve() {
    return async (ctx: IMidwayKoaContext, next: NextFunction) => {
      // 查询当前路由是否在路由表中注册
      const routeInfo = await this.webRouterService.getMatchedRouterInfo(ctx.path, ctx.method);
      if (routeInfo == null) {
        // 404
        await next();
        return;
      }
      const permission = routeInfo.summary;
      if (permission == null || permission === '') {
        ctx.status = 500;
        ctx.body = Constants.res.serverError('该路由未配置权限控制:' + ctx.path);
        return;
      }

      if (permission === Constants.per.guest) {
        await next();
        return;
      }

      if (permission === Constants.per.open) {
        return this.doOpenHandler(ctx, next);
      }

      let token = ctx.get('Authorization') || '';
      token = token.replace('Bearer ', '').trim();
      if (!token) {
        //尝试从cookie中获取token
        token = ctx.cookies.get('token') || '';
      }
      if (!token) {
        //尝试从query中获取token
        token = (ctx.query.token as string) || '';
      }
      try {
        ctx.user = jwt.verify(token, this.secret);
      } catch (err) {
        logger.error('token verify error: ', err);
        ctx.status = 401;
        ctx.body = Constants.res.auth;
        return;
      }

      if (permission !== Constants.per.authOnly) {
        const pass = await this.authService.checkPermission(ctx, permission);
        if (!pass) {
          logger.info('not permission: ', ctx.req.url);
          ctx.status = 401;
          ctx.body = Constants.res.permission;
          return;
        }
      }
      await next();
    };
  }

  async doOpenHandler(ctx: IMidwayKoaContext, next: Next) {
    //开放接口
    let openKey = ctx.get('Authorization') || '';
    openKey = openKey.replace('Bearer ', '').trim();
    if (!openKey) {
      ctx.status = 401;
      ctx.body = Constants.res.auth;
      return;
    }

    //校验 openKey
    const openKeyRes = await this.openKeyService.verifyOpenKey(openKey);
    ctx.user = { id: openKeyRes.userId };
    ctx.openKey = openKeyRes;
    await next();
  }
}

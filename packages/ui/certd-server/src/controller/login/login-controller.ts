import { Body, Controller, Inject, Post, Provide, ALL } from '@midwayjs/core';
import { LoginService } from '../../modules/login/service/login-service.js';
import { BaseController } from '@certd/lib-server';
import { Constants } from '@certd/lib-server';

/**
 */
@Provide()
@Controller('/api/')
export class LoginController extends BaseController {
  @Inject()
  loginService: LoginService;
  @Post('/login', { summary: Constants.per.guest })
  public async login(
    @Body(ALL)
    user: any
  ) {
    const token = await this.loginService.login(user);

    this.ctx.cookies.set('token', token.token, {
      maxAge: 1000 * token.expire,
    });

    return this.ok(token);
  }

  @Post('/loginBySms', { summary: Constants.per.guest })
  public async loginBySms(
    @Body(ALL)
    body: any
  ) {
    const token = await this.loginService.loginBySmsCode(body);

    this.ctx.cookies.set('token', token.token, {
      maxAge: 1000 * token.expire,
    });

    return this.ok(token);
  }

  @Post('/logout', { summary: Constants.per.authOnly })
  public logout() {}
}

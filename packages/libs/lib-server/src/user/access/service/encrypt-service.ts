import { Init, Inject, Provide, Scope, ScopeEnum } from '@midwayjs/core';
import crypto from 'crypto';
import { SysPrivateSettings, SysSettingsService } from '../../../system/index.js';

/**
 * 授权
 */
@Provide()
@Scope(ScopeEnum.Request, { allowDowngrade: true })
export class EncryptService {
  secretKey: Buffer;

  @Inject()
  sysSettingService: SysSettingsService;

  @Init()
  async init() {
    const privateInfo: SysPrivateSettings = await this.sysSettingService.getSetting(SysPrivateSettings);
    this.secretKey = Buffer.from(privateInfo.encryptSecret, 'base64');
  }

  // 加密函数
  encrypt(text: string) {
    const iv = crypto.randomBytes(16); // 初始化向量
    // const secretKey = crypto.randomBytes(32);
    // const key = Buffer.from(secretKey);
    const cipher = crypto.createCipheriv('aes-256-cbc', this.secretKey, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  }

  // 解密函数
  decrypt(encryptedText: string) {
    const textParts = encryptedText.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encrypted = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(this.secretKey), iv);
    let decrypted = decipher.update(encrypted);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }
}

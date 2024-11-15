import { AbstractTaskPlugin, IsTaskPlugin, pluginGroups, RunStrategy, TaskInput } from '@certd/pipeline';
import { CertInfo, CertReader } from '@certd/plugin-cert';
import { isDev } from '../../../utils/env.js';

@IsTaskPlugin({
  name: 'demoTest',
  title: 'Demo测试插件',
  icon: 'clarity:plugin-line',
  group: pluginGroups.other.key,
  default: {
    strategy: {
      runStrategy: RunStrategy.SkipWhenSucceed,
    },
  },
})
export class DemoTestPlugin extends AbstractTaskPlugin {
  //测试参数
  @TaskInput({
    title: '属性示例',
    value: '默认值',
    component: {
      //前端组件配置，具体配置见组件文档 https://www.antdv.com/components/input-cn
      name: 'a-input',
    },
  })
  text!: string;

  //测试参数
  @TaskInput({
    title: '选择框',
    component: {
      //前端组件配置，具体配置见组件文档 https://www.antdv.com/components/select-cn
      name: 'a-auto-complete',
      vModel: 'value',
      options: [
        { value: '1', label: '选项1' },
        { value: '2', label: '选项2' },
      ],
    },
  })
  select!: string;

  //测试参数
  @TaskInput({
    title: 'switch',
    component: {
      //前端组件配置，具体配置见组件文档 https://www.antdv.com/components/switch-cn
      name: 'a-switch',
      vModel: 'checked',
    },
  })
  switch!: boolean;
  //证书选择，此项必须要有
  @TaskInput({
    title: '域名证书',
    helper: '请选择前置任务输出的域名证书',
    component: {
      name: 'output-selector',
      from: ['CertApply', 'CertApplyLego'],
    },
    // required: true,
  })
  cert!: CertInfo;

  //授权选择框
  @TaskInput({
    title: 'demo授权',
    helper: 'demoAccess授权',
    component: {
      name: 'access-selector',
      type: 'demo', //固定授权类型
    },
    // rules: [{ required: true, message: '此项必填' }],
  })
  accessId!: string;

  async onInstance() {}
  async execute(): Promise<void> {
    const { select, text, cert, accessId } = this;

    try {
      const access = await this.accessService.getById(accessId);
      this.logger.debug('access', access);
    } catch (e) {
      this.logger.error('获取授权失败', e);
    }

    try {
      const certReader = new CertReader(cert);
      this.logger.debug('certReader', certReader);
    } catch (e) {
      this.logger.error('读取crt失败', e);
    }

    this.logger.info('DemoTestPlugin execute');
    this.logger.info('text:', text);
    this.logger.info('select:', select);
    this.logger.info('switch:', this.switch);
    this.logger.info('授权id:', accessId);
  }
}
//TODO 这里实例化插件，进行注册
if (isDev()) {
  //你的实现 要去掉这个if，不然生产环境将不会显示
  new DemoTestPlugin();
}

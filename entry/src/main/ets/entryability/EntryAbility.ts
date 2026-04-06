import UIAbility from '@ohos.app.ability.UIAbility';
import hilog from '@ohos.hilog';
import window from '@ohos.window';
import Want from '@ohos.app.ability.Want';

export default class EntryAbility extends UIAbility {
  onCreate(want: Want, launchParam: Object) {
    hilog.info(0x0000, 'EntryAbility', '%{public}s', 'Ability onCreate - want: ' + JSON.stringify(want ?? {}));
  }

  onDestroy() {
    hilog.info(0x0000, 'EntryAbility', '%{public}s', 'Ability onDestroy');
  }

  async onWindowStageCreate(windowStage: window.WindowStage) {
    hilog.info(0x0000, 'EntryAbility', '%{public}s', 'Ability onWindowStageCreate - loading pages/Index');
    
    // 全局配置沉浸式效果
    try {
      const windowInstance = await windowStage.getMainWindow()
      // 开启全屏布局，内容延伸到系统栏区域
      await windowInstance.setWindowLayoutFullScreen(true)
      // 设置系统栏完全透明
      await windowInstance.setWindowSystemBarProperties({
        statusBarColor: '#00000000',
        navigationBarColor: '#00000000',
        statusBarContentColor: '#000000', // 默认暗色文字，适合浅色背景
        navigationBarContentColor: '#000000'
      })
      hilog.info(0x0000, 'EntryAbility', '%{public}s', '全局沉浸式配置成功')
    } catch (error) {
      hilog.error(0x0000, 'EntryAbility', '全局沉浸式配置失败: %{public}s', JSON.stringify(error))
    }

    windowStage.loadContent('pages/Index', (err) => {
      if (err.code) {
        hilog.error(0x0000, 'EntryAbility', 'Failed to load content. Code: %{public}d, Message: %{public}s', err.code, err.message ?? '');
        return;
      }
      hilog.info(0x0000, 'EntryAbility', '%{public}s', 'Succeeded in loading the content.');
    });
  }

  onWindowStageDestroy() {
    hilog.info(0x0000, 'EntryAbility', '%{public}s', 'Ability onWindowStageDestroy');
  }

  onForeground() {
    hilog.info(0x0000, 'EntryAbility', '%{public}s', 'Ability onForeground');
  }

  onBackground() {
    hilog.info(0x0000, 'EntryAbility', '%{public}s', 'Ability onBackground');
  }
}

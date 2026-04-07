import AbilityConstant from '@ohos.app.ability.AbilityConstant';
import ConfigurationConstant from '@ohos.app.ability.ConfigurationConstant';
import UIAbility from '@ohos.app.ability.UIAbility';
import hilog from '@ohos.hilog';
import Want from '@ohos.app.ability.Want';
import window from '@ohos.window';
import type { Configuration } from '@ohos.app.ability.Configuration';

export default class EntryAbility extends UIAbility {
  private currentWindowStage: window.WindowStage | null = null;

  private async updateSystemBarStyle(windowStage: window.WindowStage, colorMode?: ConfigurationConstant.ColorMode): Promise<void> {
    const activeColorMode: ConfigurationConstant.ColorMode | undefined = colorMode ?? this.context.config.colorMode;
    const barContentColor: string = activeColorMode === ConfigurationConstant.ColorMode.COLOR_MODE_DARK ? '#FFFFFF' : '#000000';
    const navigationBarColor: string = activeColorMode === ConfigurationConstant.ColorMode.COLOR_MODE_DARK ? '#08101B' : '#FAFAFA';
    const windowInstance = await windowStage.getMainWindow();
    await windowInstance.setWindowLayoutFullScreen(true);
    await windowInstance.setWindowSystemBarProperties({
      statusBarColor: '#00000000',
      navigationBarColor: navigationBarColor,
      statusBarContentColor: barContentColor,
      navigationBarContentColor: barContentColor
    });
  }

  onCreate(want: Want, launchParam: AbilityConstant.LaunchParam) {
    hilog.info(
      0x0000,
      'EntryAbility',
      '%{public}s',
      'Ability onCreate - want: ' + JSON.stringify(want ?? {}) + ', launchParam: ' + JSON.stringify(launchParam ?? {})
    );
  }

  onDestroy() {
    hilog.info(0x0000, 'EntryAbility', '%{public}s', 'Ability onDestroy');
  }

  async onWindowStageCreate(windowStage: window.WindowStage) {
    hilog.info(0x0000, 'EntryAbility', '%{public}s', 'Ability onWindowStageCreate - loading pages/Index');
    this.currentWindowStage = windowStage;

    // 在 Ability 级别统一处理主窗口沉浸式配置，避免页面侧重复改写窗口状态。
    try {
      await this.updateSystemBarStyle(windowStage);
      hilog.info(0x0000, 'EntryAbility', '%{public}s', '全局沉浸式配置成功');
    } catch (error) {
      hilog.error(0x0000, 'EntryAbility', '全局沉浸式配置失败: %{public}s', JSON.stringify(error));
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
    this.currentWindowStage = null;
    hilog.info(0x0000, 'EntryAbility', '%{public}s', 'Ability onWindowStageDestroy');
  }

  onConfigurationUpdate(newConfig: Configuration) {
    try {
      if (this.currentWindowStage) {
        this.updateSystemBarStyle(this.currentWindowStage, newConfig.colorMode);
      }
    } catch (error) {
      hilog.warn(0x0000, 'EntryAbility', '配置更新时同步系统栏样式失败: %{public}s', JSON.stringify(error));
    }
  }

  onForeground() {
    hilog.info(0x0000, 'EntryAbility', '%{public}s', 'Ability onForeground');
  }

  onBackground() {
    hilog.info(0x0000, 'EntryAbility', '%{public}s', 'Ability onBackground');
  }
}

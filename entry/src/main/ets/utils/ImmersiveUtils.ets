import window from '@ohos.window'
import UIContext from '@ohos.arkui.UIContext';

/**
 * 沉浸式适配工具类
 */
export class ImmersiveUtils {
  /**
   * 动态设置状态栏样式
   * @param isDarkBackground 页面背景是否为深色
   */
  static async setStatusBarStyle(uiContext: UIContext, isDarkBackground: boolean): Promise<void> {
    try {
      const hostContext = uiContext.getHostContext();
      if (!hostContext) {
        return;
      }
      const windowInstance = await window.getLastWindow(hostContext)
      await windowInstance.setWindowSystemBarProperties({
        statusBarContentColor: isDarkBackground ? '#FFFFFF' : '#000000',
        navigationBarContentColor: isDarkBackground ? '#FFFFFF' : '#000000'
      })
    } catch (error) {
      console.error('设置状态栏样式失败:', JSON.stringify(error))
    }
  }
}

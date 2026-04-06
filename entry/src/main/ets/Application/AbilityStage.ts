import AbilityStage from '@ohos.app.ability.AbilityStage';
import Want from '@ohos.app.ability.Want';
import hilog from '@ohos.hilog';

export default class MyAbilityStage extends AbilityStage {
  onCreate() {
    hilog.info(0x0000, 'MyAbilityStage', '%{public}s', 'AbilityStage onCreate');
  }

  onAcceptWant(want: Want): string {
    return 'MyAbilityStage';
  }
}

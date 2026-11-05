import { Label } from '@/ui/nativewind/label';
import { Switch } from '@/ui/nativewind/switch';
import * as React from 'react';
import { View } from 'react-native';

export function SwitchPreview() {
  const [checked, setChecked] = React.useState(false);

  function onPress() {
    setChecked((prev) => !prev);
  }

  return (
    <View className="flex-row items-center gap-2">
      <Switch
        checked={checked}
        onCheckedChange={setChecked}
        id="airplane-mode"
        nativeID="airplane-mode"
      />
      <Label nativeID="airplane-mode" htmlFor="airplane-mode" onPress={onPress}>
        Airplane Mode
      </Label>
    </View>
  );
}

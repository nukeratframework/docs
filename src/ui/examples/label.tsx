import { Checkbox } from '@/ui/nativewind/checkbox';
import { Label } from '@/ui/nativewind/label';
import * as React from 'react';
import { Platform, View } from 'react-native';

export function LabelPreview() {
  const [checked, setChecked] = React.useState(false);

  return (
    <View className="flex-row items-center gap-2">
      <Checkbox
        aria-labelledby="terms-checkbox"
        id="terms-checkbox"
        checked={checked}
        onCheckedChange={setChecked}
      />
      <Label
        nativeID="terms-checkbox"
        htmlFor="terms-checkbox"
        onPress={Platform.select({
          native: () => {
            setChecked((prev) => !prev);
          },
        })}>
        Accept terms and conditions
      </Label>
    </View>
  );
}

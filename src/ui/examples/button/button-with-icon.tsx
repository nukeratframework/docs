import { Button } from '@/ui/nativewind/button';
import { Icon } from '@/ui/nativewind/icon';
import { Text } from '@/ui/nativewind/text';
import { Mail } from 'lucide-react-native';

export function ButtonWithIconPreview() {
  return (
    <Button>
      <Icon as={Mail} className="text-primary-foreground" />
      <Text>Login with Email</Text>
    </Button>
  );
}

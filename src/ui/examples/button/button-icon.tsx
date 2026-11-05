import { Button } from '@/ui/nativewind/button';
import { Icon } from '@/ui/nativewind/icon';
import { ChevronRight } from 'lucide-react-native';

export function ButtonIconPreview() {
  return (
    <Button variant="outline" size="icon">
      <Icon as={ChevronRight} />
    </Button>
  );
}

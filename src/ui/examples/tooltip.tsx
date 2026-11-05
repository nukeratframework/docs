import { Button } from '@/ui/nativewind/button';
import { Text } from '@/ui/nativewind/text';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/ui/nativewind/tooltip';
import { Platform } from 'react-native';

export function TooltipPreview() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">
          <Text>{Platform.select({ web: 'Hover', default: 'Press' })}</Text>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <Text>Add to library</Text>
      </TooltipContent>
    </Tooltip>
  );
}

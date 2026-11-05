import { DOCS_LOCALE_ITEMS, type DocsLang } from '@/lib/docs-i18n';
import { cn } from '@/ui/cn';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/select';

type DocsLanguageSelectProps = {
  value: DocsLang;
  onValueChange: (locale: string) => void;
  className?: string;
  triggerClassName?: string;
};

export function DocsLanguageSelect({
  value,
  onValueChange,
  className,
  triggerClassName,
}: DocsLanguageSelectProps) {
  const label = DOCS_LOCALE_ITEMS.find((item) => item.locale === value)?.name ?? value;

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger
        aria-label="Language"
        className={cn(
          'border-fd-foreground/10 bg-fd-background/80 text-fd-foreground h-8 min-w-[9.5rem] text-sm shadow-none focus:ring-1 focus:ring-fd-ring',
          triggerClassName,
          className
        )}>
        <SelectValue placeholder={label}>{label}</SelectValue>
      </SelectTrigger>
      <SelectContent align="end" className="z-[200]">
        {DOCS_LOCALE_ITEMS.map((item) => (
          <SelectItem key={item.locale} value={item.locale}>
            {item.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

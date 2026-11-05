import { CodeBlock, Pre } from 'fumadocs-ui/components/codeblock';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';

const MANAGERS = ['npm', 'bun', 'pnpm', 'yarn', 'yarn@berry'] as const;

const COMMAND: Record<(typeof MANAGERS)[number], string[]> = {
  npm: ['npx'],
  bun: ['bunx', '--bun'],
  pnpm: ['pnpm', 'dlx'],
  yarn: ['npx'],
  'yarn@berry': ['yarn', 'dlx'],
};

export const CLI_PACKAGE = '@react-native-reusables/cli@latest';

export function buildCliCommand(
  manager: (typeof MANAGERS)[number] = 'npm',
  args: string[] = ['init']
) {
  return [...COMMAND[manager], CLI_PACKAGE, ...args].join(' ');
}

/** Primary install command shown on /docs/installation (npm tab). */
export const INSTALL_INIT_COMMAND = buildCliCommand('npm', ['init']);

export function CommandTabs({ args }: { args: string[] }) {
  return (
    <div className="dark">
      <Tabs items={MANAGERS as unknown as string[]} groupId="manager" persist>
        {MANAGERS.map((manager) => (
          <Tab key={manager} value={manager} className="dark:text-foreground *:dark">
            <CodeBlock>
              <Pre>
                <code>{buildCliCommand(manager, args)}</code>
              </Pre>
            </CodeBlock>
          </Tab>
        ))}
      </Tabs>
    </div>
  );
}

'use client';

import { cn } from '@/ui/cn';
import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock';
import { useState } from 'react';

type Os = 'windows' | 'linux' | 'macos';
type ImplantBase = 'stageless' | 'loader';

const osOptions: { id: Os; label: string }[] = [
  { id: 'windows', label: 'Windows' },
  { id: 'linux', label: 'Linux' },
  { id: 'macos', label: 'macOS' },
];

const baseOptions: { id: ImplantBase; label: string }[] = [
  { id: 'stageless', label: 'Stageless' },
  { id: 'loader', label: 'Loader' },
];

const formatByOs: Record<Os, string> = {
  windows: 'exe',
  linux: 'elf',
  macos: 'app',
};

const stagelessServer = '127.0.0.1:8443';
const loaderServer = 'http://127.0.0.1:8080/stage.bin';

function buildPayload(os: Os, implantBase: ImplantBase) {
  return {
    type: 'build',
    implant_base: implantBase,
    config: {
      operational_system: os,
      cpu: 'amd',
      arch: 'x64',
      format: formatByOs[os],
      protocol: 'http',
      servers: {
        '0': implantBase === 'stageless' ? stagelessServer : loaderServer,
      },
    },
  };
}

function PillGroup({
  ariaLabel,
  options,
  value,
  onChange,
}: {
  ariaLabel: string;
  options: { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="api-pill-group" role="group" aria-label={ariaLabel}>
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          className="api-pill"
          data-active={value === option.id}
          aria-pressed={value === option.id}
          onClick={() => onChange(option.id)}>
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function ImplantRequestExample({ className }: { className?: string }) {
  const [os, setOs] = useState<Os>('windows');
  const [implantBase, setImplantBase] = useState<ImplantBase>('stageless');
  const json = JSON.stringify(buildPayload(os, implantBase), null, 2);

  return (
    <div className={cn('api-example-picker api-tabs my-4', className)}>
      <div className="api-pill-toolbar">
        <PillGroup
          ariaLabel="Operating system"
          options={osOptions}
          value={os}
          onChange={(id) => setOs(id as Os)}
        />
        <span className="api-pill-divider" aria-hidden="true">|</span>
        <PillGroup
          ariaLabel="Implant type"
          options={baseOptions}
          value={implantBase}
          onChange={(id) => setImplantBase(id as ImplantBase)}
        />
      </div>
      <DynamicCodeBlock
        lang="json"
        code={json}
        options={{
          themes: { light: 'github-dark-default', dark: 'github-dark-default' },
        }}
      />
    </div>
  );
}

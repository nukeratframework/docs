import { Button } from '@/ui/button';
import NRicon from '/images/logo.svg';
import { githubUrl, nukeratRepoUrl } from '@/pages/home/logic';
import NukeRatDemo from '@/pages/home/demo';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { Github } from 'lucide-react';
import { BackgroundPattern } from '@/ui/background-pattern';
// import BorderGlow from '@/ui/border-glow/BorderGlow';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-0 bg-[#080808]">
        <div
          className="absolute inset-0 [mask-image:radial-gradient(ellipse_80%_70%_at_50%_0%,#000_15%,transparent_70%)]">
          <BackgroundPattern />
        </div>
      </div>
      <HomeLayout
        className="relative z-10 bg-transparent"
        githubUrl={githubUrl}
        disableThemeSwitch
        nav={{
          title: (
            <div className="-ml-0.5 flex size-8 items-center justify-center rounded-md">
              {/* <RnrIcon className="w-6" pathClassName="stroke-[1px]" /> */}
              <img src={NRicon} alt="NukeRat Framework" className="w-6" />
            </div>
          ),
        }}
        links={[
          {
            type: 'custom',
            children: (
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="hover:!bg-transparent dark:hover:!bg-transparent -ml-1.5 justify-start sm:ml-0 sm:justify-center">
                <Link to="/docs/armory#catalog">Armory</Link>
              </Button>
            ),
          },
          {
            type: 'custom',
            children: (
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="hover:!bg-transparent dark:hover:!bg-transparent -ml-1.5 justify-start sm:ml-0 sm:justify-center">
                <Link to="/docs">Documentation</Link>
              </Button>
            ),
          },
          {
            type: 'custom',
            children: (
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="hover:!bg-transparent dark:hover:!bg-transparent -ml-1.5 justify-start sm:ml-0 sm:justify-center">
                <Link to="https://github.com/nukeratframework/nukerat">GitHub</Link>
              </Button>
            ),
          },
        ]}>
        <div className="relative flex min-h-0 flex-1 flex-col">
          <main
            id="nd-page"
            className="mx-auto flex w-full flex-1 flex-col items-center gap-4 pt-4 md:pt-0 mb-[-60px]">
            <div className="container relative flex flex-col items-center gap-2 px-6 py-8 text-center md:pt-16 lg:pt-20 xl:gap-4">
              <h1 className="mt-4">
                <span className="!text-[59px] text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">NukeRat Framework</span>
              </h1>
              <p className="mx-auto mt-2 max-w-[47ch] text-pretty text-base text-[#cecece]/65 text-[18px]">
                A post exploitation framework for modern red team operations.
              </p>
              <div className="mt-2 flex flex-col items-center gap-3 sm:flex-row">
                <Button asChild variant="default" className="group gap-2 rounded-full" size="default">
                  <a
                    href={nukeratRepoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'black', backgroundColor: '#e3e3e3' }}>
                    <Github className="size-4" />
                    View on GitHub
                  </a>
                </Button>
                <Button
                  asChild
                  variant="secondary"
                  className="cursor-pointer gap-2 rounded-full bg-[#363636] text-[#cecece] group"
                  size="default">
                  <Link to="/docs">Documentation</Link>
                </Button>
              </div>
            </div>
            <div className="home-shell-width mt-8 origin-top scale-[0.90]">
              {/* <BorderGlow
                backgroundColor="transparent"
                borderRadius={8}
                glowColor="0 0% 100%"
                colors={['#ffffff', '#e5e5e5', '#a3a3a3']}
                glowIntensity={0.4}
                glowRadius={24}
                fillOpacity={0.18}
                edgeSensitivity={24}
                coneSpread={18}
                animated={false}
                alwaysOn
                className="h-[90vh] w-full min-h-0 shadow-none">
                <NukeRatDemo
                  className="h-full min-h-0 w-full overflow-hidden rounded-[8px] border-0 bg-[#0b0b0b] shadow-none"
                  height="100%"
                />
              </BorderGlow> */}
              <NukeRatDemo
                className="pt-2 pl-1 pr-1 pb-2 w-full overflow-hidden rounded-[8px] border border-[#3b3b3b] bg-[#0b0b0b] shadow-none"
              />
            </div>
          </main>

          <footer>
            <div className="flex items-center justify-center px-3 py-2 text-center">
              <span className="text-[#5d5d5d]" style={{ fontWeight: 300 }}>
                Built by Loseys. The source code is available on GitHub.
              </span>
            </div>
          </footer>
        </div>
      </HomeLayout>
    </>
  );
}

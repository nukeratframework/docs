export const nukeratRepoUrl = "https://github.com/nukeratframework/nukerat";

export const terminalInputResponse = `Try it at ${nukeratRepoUrl}\n`;

export const terminalOutput: string[] = [
  "$ armory install seatbelt",
  "Successfully installed.",
  "",
  "$ seatbelt --- OSInfo",
  "",
  `[*] OSInfo

  Hostname                      :  DESKTOP-B08TFNF
  Domain Name                   :  
  Username                      :  DESKTOP-B08TFNF\Lab
  ProductName                   :  Windows 10 Pro
  EditionID                     :  Professional
  ReleaseId                     :  2009
  Build                         :  19045.6466
  BuildBranch                   :  vb_release
  CurrentMajorVersionNumber     :  10
  CurrentVersion                :  6.3
  Architecture                  :  AMD64
  ProcessorCount                :  1
  IsVirtualMachine              :  True
  BootTimeUtc (approx)          :  9/5/2026 2:30:34 AM (Total uptime: 01:15:15:02)
  HighIntegrity                 :  False
  IsLocalAdmin                  :  True

[*] Completed collection in 0.1 seconds`.trim() + "\n",
];

export const terminalCommandHistory: string[] = [
  "armory install seatbelt",
  "seatbelt --- OSInfo",
];

import linuxHostSvg from "@/pages/home/demo/assets/icons/graphs/linux_host.svg";
import macHostSvg from "@/pages/home/demo/assets/icons/graphs/mac_host.svg";
import unknownHostSvg from "@/pages/home/demo/assets/icons/graphs/unknown_host.svg";
import windowsHostSvg from "@/pages/home/demo/assets/icons/graphs/windows_host.svg";

const osIcons = {
  windows: windowsHostSvg,
  linux: linuxHostSvg,
  mac: macHostSvg,
  unknown: unknownHostSvg,
};

export const hostOsIcon = (os: string) => {
  const v = os.toLowerCase();
  if (/\b(win|windows|microsoft)\b/.test(v)) return osIcons.windows;
  if (/\b(mac|macos|osx|os\s*x|darwin)\b/.test(v)) return osIcons.mac;
  if (/\b(linux|gnu|ubuntu|debian|fedora|arch|centos|kali)\b/.test(v)) return osIcons.linux;
  return osIcons.unknown;
};

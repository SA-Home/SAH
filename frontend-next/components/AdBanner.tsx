import type { AdPlacement } from "@/lib/wordpress";
import AdSlot from "./AdSlot";

type AdBannerProps = {
  placement: AdPlacement;
  className?: string;
  idSuffix?: string;
  wrapClassName?: string;
  variant?: string;
};

export default function AdBanner({ placement, className, idSuffix, wrapClassName, variant }: AdBannerProps) {
  return (
    <AdSlot
      placement={placement}
      className={className}
      idSuffix={idSuffix}
      wrapClassName={wrapClassName}
      variant={variant}
    />
  );
}

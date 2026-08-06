import { getAdByPlacement, type AdPlacement } from "@/lib/wordpress";
import GoogleAdUnit from "./GoogleAdUnit";

type AdSlotProps = {
  placement: AdPlacement;
  className?: string;
  idSuffix?: string;
  wrapClassName?: string;
  variant?: string;
};

export default async function AdSlot({ placement, className = "", idSuffix, wrapClassName, variant }: AdSlotProps) {
  const ad = await getAdByPlacement(placement);
  const sizeClass = variant ?? ad.sizeClass;
  const slot = (
    <GoogleAdUnit ad={ad} sizeClass={sizeClass} className={className} idSuffix={idSuffix} />
  );

  if (!wrapClassName) return slot;

  return (
    <div className={wrapClassName} aria-label="Advertisement">
      {slot}
    </div>
  );
}

import { getAdByPlacement, type AdPlacement } from "@/lib/wordpress";

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
  const id = idSuffix ? `${ad.id}-${idSuffix}` : ad.id;
  const slot = (
    <div
      id={id}
      className={["google-ad-slot", sizeClass, className].filter(Boolean).join(" ")}
      data-ad-unit={ad.dataUnit}
      aria-label="Advertisement"
      dangerouslySetInnerHTML={ad.html ? { __html: ad.html } : undefined}
    />
  );

  if (!wrapClassName) return slot;

  return (
    <div className={wrapClassName} aria-label="Advertisement">
      {slot}
    </div>
  );
}

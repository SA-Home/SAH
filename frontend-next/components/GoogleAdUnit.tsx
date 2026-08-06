"use client";

import { useEffect, useId } from "react";
import type { SiteAd } from "@/lib/wordpress";

type GoogleAdUnitProps = {
  ad: SiteAd;
  sizeClass: string;
  className?: string;
  idSuffix?: string;
};

type GoogleSlotSize = [number, number];

type GoogleSlot = {
  addService: (service: GooglePubAdsService) => GoogleSlot;
  defineSizeMapping?: (sizeMapping: unknown) => GoogleSlot;
  getSlotElementId?: () => string;
};

type GoogleSizeMapping = {
  addSize: (viewportSize: GoogleSlotSize, slotSizes: Array<GoogleSlotSize | "fluid">) => GoogleSizeMapping;
  build: () => unknown;
};

type GooglePubAdsService = {
  collapseEmptyDivs: () => void;
  addEventListener?: (eventName: "slotRenderEnded", listener: (event: GoogleSlotRenderEvent) => void) => void;
  enableSingleRequest: () => void;
};

type GoogleSlotRenderEvent = {
  slot: {
    getSlotElementId: () => string;
  };
  isEmpty: boolean;
};

type GoogleTag = {
  cmd: Array<() => void>;
  defineSlot?: (adUnitPath: string, sizes: GoogleSlotSize[], divId: string) => GoogleSlot | null;
  destroySlots?: (slots: GoogleSlot[]) => boolean;
  display?: (divId: string) => void;
  enableServices?: () => void;
  pubads?: () => GooglePubAdsService;
  sizeMapping?: () => GoogleSizeMapping;
};

declare global {
  interface Window {
    googletag?: GoogleTag;
    saHomeschoolingAdSlots?: Record<string, GoogleSlot>;
    saHomeschoolingAdsConfigured?: boolean;
  }
}

const gptScriptId = "google-publisher-tag-script";

function ensureGooglePublisherTag() {
  window.googletag = window.googletag ?? { cmd: [] };

  if (document.getElementById(gptScriptId)) return;

  const script = document.createElement("script");
  script.id = gptScriptId;
  script.async = true;
  script.src = "https://securepubads.g.doubleclick.net/tag/js/gpt.js";
  document.head.appendChild(script);
}

function clientId(baseId: string, generatedId: string, idSuffix?: string) {
  const suffix = idSuffix ?? generatedId.replace(/[^a-zA-Z0-9_-]/g, "");

  return `${baseId}-${suffix}`;
}

function findSize(sizes: GoogleSlotSize[], width: number, height: number) {
  return sizes.find(([sizeWidth, sizeHeight]) => sizeWidth === width && sizeHeight === height);
}

function compactAdSizes(sizes: GoogleSlotSize[]) {
  const compactSizes = sizes.filter(([width, height]) => width <= 728 && height <= 250);

  return compactSizes.length ? compactSizes : sizes;
}

function responsiveAdSizes(sizes: GoogleSlotSize[]) {
  const mobileRectangle = findSize(sizes, 300, 250);
  const compactSizes = compactAdSizes(sizes);
  const wideSizes = sizes.filter(([width]) => width >= 728);
  const desktopSizes = wideSizes.length ? wideSizes : sizes;
  const tabletSizes = wideSizes.filter(([width]) => width <= 728);
  const mobileSizes = mobileRectangle ? [mobileRectangle] : compactSizes.filter(([width]) => width <= 320);

  return {
    desktop: desktopSizes,
    tablet: tabletSizes.length ? tabletSizes : compactSizes,
    mobile: mobileSizes.length ? mobileSizes : compactSizes,
  };
}

function sizesForElement(sizes: GoogleSlotSize[], divId: string) {
  const measuredWidth = Math.floor(document.getElementById(divId)?.getBoundingClientRect().width ?? 0);
  const elementWidth = measuredWidth > 0 ? measuredWidth : window.innerWidth;
  const fittingSizes = sizes.filter(([width]) => width <= elementWidth);

  return fittingSizes.length ? fittingSizes : sizes.filter(([width]) => width <= 320);
}

export default function GoogleAdUnit({ ad, sizeClass, className = "", idSuffix }: GoogleAdUnitProps) {
  const generatedId = useId();
  const divId = clientId(ad.id, generatedId, idSuffix);
  const shouldUseGoogle = Boolean(ad.google);
  const htmlAd = shouldUseGoogle ? undefined : ad.html;
  const hasHtmlAd = Boolean(htmlAd);

  useEffect(() => {
    const google = ad.google;

    if (!google) return undefined;

    ensureGooglePublisherTag();

    let slot: GoogleSlot | null = null;
    const pendingTimeout = window.setTimeout(() => {
      const element = document.getElementById(divId);
      if (!element || element.classList.contains("google-ad-slot--loaded")) return;

      element.classList.remove("google-ad-slot--pending");
      element.classList.add("google-ad-slot--empty");
    }, 3000);
    const adUnitPath = `/${google.networkCode}/${google.adUnitCode}`;

    window.googletag?.cmd.push(() => {
      const googleTag = window.googletag;
      if (!googleTag?.defineSlot || !googleTag.pubads || !googleTag.enableServices || !googleTag.display) return;

      window.saHomeschoolingAdSlots = window.saHomeschoolingAdSlots ?? {};

      const previousSlot = window.saHomeschoolingAdSlots[divId];
      if (previousSlot) {
        googleTag.destroySlots?.([previousSlot]);
        delete window.saHomeschoolingAdSlots[divId];
      }

      const slotSizes = sizesForElement(google.sizes, divId);

      slot = googleTag.defineSlot(adUnitPath, slotSizes.length ? slotSizes : google.sizes, divId);
      if (!slot) return;

      const sizeMapping = googleTag.sizeMapping?.();
      if (sizeMapping && slot.defineSizeMapping) {
        const responsiveSizes = responsiveAdSizes(slotSizes.length ? slotSizes : google.sizes);

        slot.defineSizeMapping(
          sizeMapping
            .addSize([970, 0], responsiveSizes.desktop)
            .addSize([728, 0], responsiveSizes.tablet)
            .addSize([0, 0], responsiveSizes.mobile)
            .build()
        );
      }

      window.saHomeschoolingAdSlots[divId] = slot;
      const pubads = googleTag.pubads();

      slot.addService(pubads);

      if (!window.saHomeschoolingAdsConfigured) {
        pubads.collapseEmptyDivs();
        pubads.enableSingleRequest();
        pubads.addEventListener?.("slotRenderEnded", (event) => {
          const element = document.getElementById(event.slot.getSlotElementId());
          if (!element) return;

          element.classList.remove("google-ad-slot--pending");
          element.classList.toggle("google-ad-slot--loaded", !event.isEmpty);
          element.classList.toggle("google-ad-slot--empty", event.isEmpty);
        });
        window.saHomeschoolingAdsConfigured = true;
      }

      googleTag.enableServices();
      googleTag.display(divId);
    });

    return () => {
      window.clearTimeout(pendingTimeout);

      if (!slot) return;

      window.googletag?.cmd.push(() => {
        window.googletag?.destroySlots?.([slot as GoogleSlot]);
        if (window.saHomeschoolingAdSlots?.[divId] === slot) {
          delete window.saHomeschoolingAdSlots[divId];
        }
      });
    };
  }, [ad.google, ad.html, divId]);

  return (
    <figure className="ad-unit-frame">
      <div
        id={divId}
        className={[
          "google-ad-slot",
          shouldUseGoogle ? "google-ad-slot--live" : "",
          shouldUseGoogle ? "google-ad-slot--pending" : "",
          hasHtmlAd ? "google-ad-slot--html" : "",
          sizeClass,
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        data-ad-unit={ad.dataUnit}
        data-google-ad-unit={ad.google?.adUnitCode}
        aria-label="Advertisement"
        dangerouslySetInnerHTML={htmlAd ? { __html: htmlAd } : undefined}
      />
    </figure>
  );
}

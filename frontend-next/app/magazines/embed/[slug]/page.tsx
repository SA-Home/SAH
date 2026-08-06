import type { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";
import { getMagazineBySlug } from "@/lib/wordpress";

type MagazineEmbedPageProps = {
  params: Promise<{ slug: string }>;
};

const dflipAssetBase = "https://sahomeschooling.com/wp-content/plugins/dflip/assets/";
const dflipCss = `${dflipAssetBase}css/dflip.min.css?ver=2.4.13`;
const dflipScript = `${dflipAssetBase}js/dflip.min.js?ver=2.4.13`;

const dflipGlobalOptions = {
  text: {
    toggleSound: "Turn on/off Sound",
    toggleThumbnails: "Toggle Thumbnails",
    thumbTitle: "Thumbnails",
    outlineTitle: "Table of Contents",
    searchTitle: "Search",
    previousPage: "Previous Page",
    nextPage: "Next Page",
    toggleFullscreen: "Toggle Fullscreen",
    zoomIn: "Zoom In",
    zoomOut: "Zoom Out",
    singlePageMode: "Single Page Mode",
    doublePageMode: "Double Page Mode",
    downloadPDFFile: "Download PDF File",
    share: "Share",
    loading: "Loading",
  },
  viewerType: "slider",
  mobileViewerType: "auto",
  moreControls: "download,pageMode,startPage,endPage,sound",
  leftControls: "outline,thumbnail",
  rightControls: "fullScreen,share,download,more",
  controlsPosition: "bottom",
  controlsFloating: true,
  duration: 800,
  soundEnable: "true",
  showDownloadControl: "true",
  showSearchControl: "false",
  showPrintControl: "false",
  webgl: "true",
  pageScale: "fit",
  maxTextureSize: "1600",
  rangeChunkSize: "524288",
  disableRange: false,
  zoomRatio: 1.5,
  pageMode: "0",
  singlePageMode: "0",
  pageSize: "0",
  linkTarget: "2",
  targetWindow: "_popup",
  sideMenuOverlay: true,
  backgroundColor: "transparent",
};

export const metadata: Metadata = {
  title: "Magazine Viewer",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function MagazineEmbedPage({ params }: MagazineEmbedPageProps) {
  const { slug } = await params;
  const issue = await getMagazineBySlug(slug);

  if (!issue) notFound();

  const dflipId = sanitizeDFlipId(issue.dflipId ?? issue.id);
  const optionName = `df_option_${dflipId}`;
  const dflipOption = {
    ...issue.dflipOption,
    id: issue.dflipOption?.id ?? dflipId,
    slug: issue.dflipOption?.slug ?? issue.slug,
    source: issue.pdfUrl ? getPdfViewerSource(issue.pdfUrl) : issue.dflipOption?.source,
    wpOptions: "true",
  };

  if (!dflipOption.source) {
    return (
      <main className="dflip-embed-page dflip-embed-page--fallback">
        <p>{issue.title}</p>
      </main>
    );
  }

  return (
    <main className="dflip-embed-page">
      <link rel="stylesheet" href={dflipCss} />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dFlipLocation = ${toScriptValue(dflipAssetBase)};
            window.dFlipWPGlobal = ${toScriptValue(dflipGlobalOptions)};
            window.${optionName} = ${toScriptValue(dflipOption)};
          `,
        }}
      />
      <div
        className="_df_book df-container df-loading"
        data-slug={issue.dflipOption?.slug ?? issue.slug}
        data-title={issue.title}
        id={`df_${dflipId}`}
        data-df-option={optionName}
      />
      <Script src={dflipScript} strategy="afterInteractive" />
      <Script
        id={`dflip-start-${dflipId}`}
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.addEventListener("load", function () {
              if (window.DFLIP && window.DFLIP.parseBooks) {
                window.DFLIP.parseBooks();
              }
            });
          `,
        }}
      />
    </main>
  );
}

function sanitizeDFlipId(value: string) {
  return value.replace(/[^a-zA-Z0-9_]/g, "_");
}

function getPdfViewerSource(pdfUrl: string) {
  return pdfUrl.startsWith("/") ? pdfUrl : `/api/magazine-pdf?url=${encodeURIComponent(pdfUrl)}`;
}

function toScriptValue(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

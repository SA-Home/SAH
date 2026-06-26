import type { MagazineIssue } from "@/lib/wordpress";

type MagazineViewerProps = {
  issue: MagazineIssue;
};

export default function MagazineViewer({ issue }: MagazineViewerProps) {
  const viewerUrl = issue.embedUrl || issue.pdfUrl;

  if (!viewerUrl) {
    return (
      <div className="magazine-preview">
        <span className="magazine-preview-fallback">{issue.title}</span>
      </div>
    );
  }

  if (issue.dflipOption && issue.embedUrl) {
    return (
      <div className="magazine-preview magazine-preview--flipbook">
        <iframe src={issue.embedUrl} title={`${issue.title} flipbook preview`} loading="lazy" />
        <span className="magazine-preview-fallback">{issue.title}</span>
      </div>
    );
  }

  return (
    <a className="magazine-preview magazine-open" href={viewerUrl} aria-label={`Open ${issue.title}`} target="_blank" rel="noreferrer">
      <iframe
        src={`${viewerUrl}#page=1&toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
        title={`${issue.title} cover preview`}
        loading="lazy"
      />
      <span className="magazine-preview-fallback">{issue.title}</span>
    </a>
  );
}

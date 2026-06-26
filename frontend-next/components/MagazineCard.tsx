import type { MagazineIssue } from "@/lib/wordpress";
import MagazineViewer from "./MagazineViewer";

type MagazineCardProps = {
  issue: MagazineIssue;
};

export default function MagazineCard({ issue }: MagazineCardProps) {
  const href = issue.embedUrl || issue.pdfUrl || issue.sourcePost?.link;

  return (
    <article className="magazine-card">
      <MagazineViewer issue={issue} />

      {href ? (
        <a className="magazine-toolbar magazine-open" href={href} target="_blank" rel="noreferrer">
          <span>{issue.issueNumber ? `Issue ${issue.issueNumber}` : "Read"}</span>
          <span>{issue.dflipOption ? "Flip" : "PDF"}</span>
          <span>+</span>
          <span>-</span>
          <span>Full</span>
          <span>Share</span>
        </a>
      ) : (
        <div className="magazine-toolbar" aria-label={`${issue.title} viewer unavailable`}>
          <span>{issue.issueNumber ? `Issue ${issue.issueNumber}` : "Archive"}</span>
          <span>PDF unavailable</span>
        </div>
      )}

      <h2>{issue.title}</h2>
      <p>{issue.description}</p>
    </article>
  );
}

import AdBanner from "./AdBanner";
import NewsletterForm from "./NewsletterForm";

type NewsletterAdStackProps = {
  idPrefix: string;
  className?: string;
  formClassName?: string;
  title?: string;
  showKicker?: boolean;
  headingLevel?: "h1" | "h2";
};

export default function NewsletterAdStack({
  idPrefix,
  className = "",
  formClassName = "sidebar-newsletter labeled",
  title,
  showKicker,
  headingLevel,
}: NewsletterAdStackProps) {
  const stackClassName = ["newsletter-ad-stack", className].filter(Boolean).join(" ");

  return (
    <div className={stackClassName}>
      <AdBanner
        placement="article-sidebar"
        idSuffix={`${idPrefix}-newsletter-top`}
        wrapClassName="newsletter-stack-ad newsletter-stack-ad--top"
        variant="google-ad-slot--wide-banner"
      />
      <NewsletterForm
        idPrefix={idPrefix}
        className={formClassName}
        title={title}
        showKicker={showKicker}
        headingLevel={headingLevel}
      />
      <AdBanner
        placement="article-sidebar"
        idSuffix={`${idPrefix}-newsletter-bottom`}
        wrapClassName="newsletter-stack-ad newsletter-stack-ad--bottom"
        variant="google-ad-slot--wide-banner"
      />
    </div>
  );
}

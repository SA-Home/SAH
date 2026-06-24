type Props = {
  title: string;
  excerpt: string;
};

export default function ArticleCard({
  title,
  excerpt,
}: Props) {
  return (
    <article className="border rounded-lg p-6 hover:shadow-lg transition">
      <h2
        className="text-2xl font-semibold mb-3"
        dangerouslySetInnerHTML={{
          __html: title,
        }}
      />

      <div
        className="text-gray-600"
        dangerouslySetInnerHTML={{
          __html: excerpt,
        }}
      />
    </article>
  );
}
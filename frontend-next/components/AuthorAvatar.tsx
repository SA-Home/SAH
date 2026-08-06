import Image from "next/image";
import { getAuthorAvatar, type WPAuthor } from "@/lib/wordpress";

type AuthorAvatarProps = {
  author: WPAuthor | null | undefined;
  size?: number;
};

export default function AuthorAvatar({ author, size = 80 }: AuthorAvatarProps) {
  const avatar = getAuthorAvatar(author);

  if (!avatar) {
    return <div className="author-avatar" aria-hidden="true" style={{ width: size, height: size, borderRadius: "50%" }} />;
  }

  return (
    <Image
      className="author-avatar"
      src={avatar.src}
      alt={avatar.alt}
      width={size}
      height={size}
      style={{ objectFit: "cover", borderRadius: "50%" }}
    />
  );
}

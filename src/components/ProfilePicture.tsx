import { UserRound } from "lucide-react";
import Image from "next/image";

export function ProfilePicture({
  image,
  size,
}: {
  image: string;
  size: number;
}) {
  return (
    <Image
      src={image}
      alt={"User profile picture"}
      width={size}
      height={size}
      className="aspect-square rounded-full border bg-background object-cover shadow-sm"
    />
  );
}

import { ImageResponse } from "next/og";
import {
  SOCIAL_PREVIEW_CONTENT_TYPE,
  SOCIAL_PREVIEW_SIZE,
  SocialPreviewImage,
} from "@repo/ui";
import { WOTORI_SITE_NAME } from "../lib/seo";

export const size = SOCIAL_PREVIEW_SIZE;
export const contentType = SOCIAL_PREVIEW_CONTENT_TYPE;
export const alt = `${WOTORI_SITE_NAME} social preview`;

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <SocialPreviewImage
        badge="Wotori Studio"
        headline="Web3 animation, creator platforms, and Solana-aligned ecosystems."
        description="Wotori builds creator-first products across gaming, media, and digital ownership."
        tags={["Ekza Space", "Omoba", "Web3 Studio"]}
      />
    ),
    size
  );
}

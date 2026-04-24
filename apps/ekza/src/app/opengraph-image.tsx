import { ImageResponse } from "next/og";
import {
  SOCIAL_PREVIEW_CONTENT_TYPE,
  SOCIAL_PREVIEW_SIZE,
  SocialPreviewImage,
} from "@repo/ui";

export const size = SOCIAL_PREVIEW_SIZE;
export const contentType = SOCIAL_PREVIEW_CONTENT_TYPE;
export const alt = "Ekza Space social preview";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <SocialPreviewImage
        badge="Ekza Space"
        headline="Open source Solana startup for collaborative 3D assets."
        description="Creator-owned royalties, SDK-powered integrations, and modular web3 ecosystems."
        tags={["3D Creation", "Game SDK", "Royalties"]}
        background="radial-gradient(circle at 20% 20%, rgba(6, 182, 212, 0.35), transparent 36%), radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.3), transparent 32%), linear-gradient(135deg, #04070f 0%, #0b1021 45%, #050913 100%)"
        badgeTextColor="#a5f3fc"
        badgeBorderColor="rgba(34,211,238,0.45)"
        badgeBackground="rgba(34,211,238,0.12)"
        descriptionColor="rgba(226,232,240,0.92)"
        tagTextColor="#e0f2fe"
        tagBorderColor="rgba(125,211,252,0.4)"
        tagBackground="rgba(125,211,252,0.12)"
      />
    ),
    size
  );
}

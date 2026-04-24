import { ImageResponse } from "next/og";
import {
  SOCIAL_PREVIEW_CONTENT_TYPE,
  SOCIAL_PREVIEW_SIZE,
  SocialPreviewImage,
} from "@repo/ui";

export const size = SOCIAL_PREVIEW_SIZE;
export const contentType = SOCIAL_PREVIEW_CONTENT_TYPE;
export const alt = "Omoba social preview";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <SocialPreviewImage
        badge="Omoba"
        headline="Open source Solana startup building an open MOBA ecosystem."
        description="Creator-owned assets, custom avatars, and web3-native game economies."
        tags={["Open MOBA", "Solana Gaming", "Creator Assets"]}
        background="radial-gradient(circle at 18% 20%, rgba(250, 204, 21, 0.3), transparent 34%), radial-gradient(circle at 82% 78%, rgba(99, 102, 241, 0.28), transparent 32%), linear-gradient(135deg, #05060a 0%, #111827 45%, #030712 100%)"
        badgeTextColor="#fde68a"
        badgeBorderColor="rgba(251,191,36,0.42)"
        badgeBackground="rgba(251,191,36,0.14)"
        descriptionColor="rgba(226,232,240,0.9)"
        tagTextColor="#fef9c3"
        tagBorderColor="rgba(250,204,21,0.4)"
        tagBackground="rgba(250,204,21,0.12)"
      />
    ),
    size
  );
}

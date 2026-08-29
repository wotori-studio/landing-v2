import { ImageResponse } from "next/og";
import {
  SOCIAL_PREVIEW_CONTENT_TYPE,
  SOCIAL_PREVIEW_SIZE,
  SocialPreviewImage,
} from "@repo/ui";

export const size = SOCIAL_PREVIEW_SIZE;
export const contentType = SOCIAL_PREVIEW_CONTENT_TYPE;
export const alt = "Ekza Mirror social preview";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <SocialPreviewImage
        badge="Ekza Mirror"
        headline="Wear the universe."
        description="Point the camera at a friend. They become an Ekza avatar. Hit record. On-device AR on iPhone."
        tags={["Point", "Wear", "Record"]}
        background="radial-gradient(circle at 16% 18%, rgba(182, 255, 26, 0.2), transparent 36%), radial-gradient(circle at 84% 80%, rgba(110, 242, 68, 0.15), transparent 34%), radial-gradient(circle at 62% 8%, rgba(231, 255, 176, 0.12), transparent 30%), linear-gradient(135deg, #07080A 0%, #131813 48%, #07080A 100%)"
        headlineColor="#EDF2E9"
        badgeTextColor="#B6FF1A"
        badgeBorderColor="rgba(182,255,26,0.45)"
        badgeBackground="rgba(182,255,26,0.12)"
        descriptionColor="rgba(154,167,154,0.95)"
        tagTextColor="#E7FFB0"
        tagBorderColor="rgba(231,255,176,0.34)"
        tagBackground="rgba(231,255,176,0.08)"
      />
    ),
    size
  );
}

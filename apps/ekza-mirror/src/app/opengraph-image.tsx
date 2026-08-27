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
        background="radial-gradient(circle at 16% 18%, rgba(124, 92, 255, 0.38), transparent 36%), radial-gradient(circle at 84% 80%, rgba(53, 232, 255, 0.26), transparent 34%), radial-gradient(circle at 62% 8%, rgba(255, 95, 162, 0.24), transparent 30%), linear-gradient(135deg, #07070C 0%, #14141F 48%, #07070C 100%)"
        headlineColor="#E9ECF5"
        badgeTextColor="#D7CCFF"
        badgeBorderColor="rgba(124,92,255,0.45)"
        badgeBackground="rgba(124,92,255,0.16)"
        descriptionColor="rgba(168,176,196,0.95)"
        tagTextColor="#FFD9E9"
        tagBorderColor="rgba(255,95,162,0.42)"
        tagBackground="rgba(255,95,162,0.12)"
      />
    ),
    size
  );
}

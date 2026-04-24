import { ImageResponse } from "next/og";
import {
  SOCIAL_PREVIEW_CONTENT_TYPE,
  SOCIAL_PREVIEW_SIZE,
  SocialPreviewImage,
} from "@repo/ui";

export const size = SOCIAL_PREVIEW_SIZE;
export const contentType = SOCIAL_PREVIEW_CONTENT_TYPE;
export const alt = "Dev hub social preview";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <SocialPreviewImage
        badge="Dev Hub"
        headline="Fast local access to all landing-v2 apps."
        description="Single entry point for Ekza, Omoba, Wotori, and shared tooling in the monorepo."
        tags={["Wotori", "Ekza", "Omoba"]}
        background="radial-gradient(circle at 16% 20%, rgba(59, 130, 246, 0.32), transparent 34%), radial-gradient(circle at 84% 80%, rgba(45, 212, 191, 0.25), transparent 32%), linear-gradient(135deg, #020617 0%, #0f172a 45%, #111827 100%)"
        badgeTextColor="#bfdbfe"
        badgeBorderColor="rgba(96,165,250,0.45)"
        badgeBackground="rgba(59,130,246,0.14)"
        descriptionColor="rgba(226,232,240,0.9)"
        tagTextColor="#ccfbf1"
        tagBorderColor="rgba(45,212,191,0.4)"
        tagBackground="rgba(45,212,191,0.12)"
      />
    ),
    size
  );
}

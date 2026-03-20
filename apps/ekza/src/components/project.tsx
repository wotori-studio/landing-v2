"use client";

import { useI18n } from "../lib/i18n-provider";

interface ProjectContentProps {
  projectName: string;
  text: string;
  link: string;
}

interface ProjectProps {
  projectName: string;
  imgPath: string;
  imgPath2?: string | null;
  text: string;
  link: string;
  isFlip?: boolean;
}

function ProjectContent({ projectName, text, link }: ProjectContentProps) {
  const { t } = useI18n();

  return (
    <div className="p-2">
      <p className="pt-4 w-auto py-2 text-2xl lg:text-5xl font-audiowide text-center">
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="link"
        >
          <span>{projectName}</span>
          <span className="block text-xs font-sans">
            {t("common.projectOpenHint")}
          </span>
        </a>
      </p>
      <p className="lg:text-base text-justify">{text}</p>
    </div>
  );
}

export function Project({
  projectName,
  imgPath,
  imgPath2 = null,
  text,
  link,
  isFlip = false,
}: ProjectProps) {
  return (
    <div className="bg-gray-100 lg:mx-8 sm:m-4 m-4 rounded-lg md:p-0">
      {isFlip ? (
        <>
          <div className="relative">
            <img src={imgPath} className="w-full rounded-lg" alt={projectName} />
            {imgPath2 && (
              <img
                src={imgPath2}
                className="absolute inset-0 w-full h-auto opacity-0 transition-opacity duration-300 hover:opacity-100"
                alt={`${projectName} hover`}
              />
            )}
          </div>

          <ProjectContent projectName={projectName} text={text} link={link} />
        </>
      ) : (
        <>
          <ProjectContent projectName={projectName} text={text} link={link} />
          <div className="relative">
            <img src={imgPath} className="w-full" alt={projectName} />
            {imgPath2 && (
              <img
                src={imgPath2}
                className="absolute inset-0 w-full h-auto opacity-0 transition-opacity duration-300 hover:opacity-100"
                alt={`${projectName} hover`}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}

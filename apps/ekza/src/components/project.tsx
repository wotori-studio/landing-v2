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
      <p className="w-auto py-2 text-center text-2xl font-audiowide lg:text-5xl">
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="link"
        >
          <span>{projectName}</span>
          <span className="block text-xs font-sans font-normal text-ekza-on-muted dark:text-white/55">
            {t("common.projectOpenHint")}
          </span>
        </a>
      </p>
      <p className="text-justify text-sm leading-relaxed text-ekza-on-muted dark:text-white/80 lg:text-base">
        {text}
      </p>
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
    <div className="m-4 overflow-hidden rounded-2xl border border-ekza-border/25 bg-ekza-elevated/95 shadow-ekza-card transition hover:border-ekza-primary/30 dark:border-white/10 dark:bg-white/[0.05] dark:shadow-ekza-card-dark sm:m-4 md:p-0 lg:mx-8">
      {isFlip ? (
        <>
          <div className="relative">
            <img
              src={imgPath}
              className="w-full rounded-t-2xl object-cover"
              alt={projectName}
            />
            {imgPath2 && (
              <img
                src={imgPath2}
                className="absolute inset-0 h-full w-auto opacity-0 transition-opacity duration-300 hover:opacity-100"
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
                className="absolute inset-0 h-full w-auto opacity-0 transition-opacity duration-300 hover:opacity-100"
                alt={`${projectName} hover`}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}

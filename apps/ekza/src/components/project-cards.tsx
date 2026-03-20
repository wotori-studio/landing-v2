import React from "react";
import { Project } from "./project";

interface ProjectData {
  projectName: string;
  imgPath: string;
  imgPath2: string;
  text: string;
  link: string;
  isFlip: boolean;
  showOnMobile?: boolean;
  showOnDesktop?: boolean;
}

interface ProjectCardsProps {
  projects: ProjectData[];
}

const ProjectCards: React.FC<ProjectCardsProps> = ({ projects }) => {
  return (
    <div className="grid gap-6 pt-4 lg:mx-8 md:grid-cols-2 lg:grid-cols-3 items-start">
      {projects.map((project, index) => {
        const className = project.showOnMobile
          ? "md:hidden"
          : project.showOnDesktop
            ? "hidden lg:block md:block"
            : "";

        return (
          <div key={index} className={className}>
            <Project
              projectName={project.projectName}
              imgPath={project.imgPath}
              imgPath2={project.imgPath2}
              text={project.text}
              link={project.link}
              isFlip={project.isFlip}
            />
          </div>
        );
      })}
    </div>
  );
};

export default ProjectCards;

/* eslint-disable @next/next/no-img-element */
"use client";
import { getProjectDetails } from "@/api/project";
import CommonLayout from "@/app/components/layout/CommonLayout";
import ProjectTabs from "@/app/components/project/Tabs";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useParams } from "next/navigation";
import { BsThreeDots } from "react-icons/bs";
interface Project {
  id: string;
  name: string;
  image: string;
}
const ProjectPage = () => {
  const searchParams = useParams();
  const project = {
    id: "1",
    name: "Project 1",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSioUd0qWL9XkRAGsjyeMDJ5N6nK0uJ0zzjtg&s",
  };

  const params = useParams();
  const projectId = params.id as string;

  const { data: projectDetails, isLoading } = useQuery({
    queryKey: ["project-details", projectId],
    queryFn: () => getProjectDetails(projectId),
    enabled: !!projectId,
  });

  return (
    <CommonLayout activeProjectId={(searchParams.id as string) || undefined}>
      <div className="w-full min-h-screen flex flex-col gap-4">
        <div className="flex items-center gap-2  p-[16px] pb-0">
          <img
            className="rounded-md object-cover object-center w-[40px] h-[40px] border border-neutral-400"
            src={projectDetails?.coverImage}
            alt={projectDetails?.name}
          />
          <h3 className="text-xl font-medium">{projectDetails?.name}</h3>
          <BsThreeDots size={20} className="ml-4" />
        </div>
        {isLoading ? (
          <>loader</>
        ) : (
          <ProjectTabs projectDetails={projectDetails} />
        )}
      </div>
    </CommonLayout>
  );
};

export default ProjectPage;

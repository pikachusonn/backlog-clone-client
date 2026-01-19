/* eslint-disable @next/next/no-img-element */
import { useState, useCallback, useMemo, useEffect } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  BackgroundVariant,
  Background,
  MarkerType,
  BezierEdge,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getTaskStatusesOfProject } from "@/api/taskStatus";
import { getProjectTransitions } from "@/api/transition";
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa6";
import { TaskStatus } from "@/interface/setting";
import CreateStatusDialog from "./CreateStatusDialog";
import { IoChatbubblesOutline, IoTrashOutline } from "react-icons/io5";
import { Input } from "@/components/ui/input";
const edgeTypes = {
  default: BezierEdge,
  //   custom: CustomEdge,
};
// const initialNodes = [
//   { id: "n1", position: { x: 0, y: 0 }, data: { label: "Node 1" } },
//   { id: "n2", position: { x: 0, y: 100 }, data: { label: "Node 2" } },
// ];
// const initialEdges = [
//   {
//     id: "n1-n2",
//     source: "n1",
//     target: "n2",
//     markerEnd: {
//       type: MarkerType.ArrowClosed,
//       width: 20,
//       height: 20,
//     },
//   },
// ];

const ProjectSetting = () => {
  const { fitView } = useReactFlow();
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [openAddNewStatusDialog, setOpenAddNewStatusDialog] = useState(false);
  const param = useParams();
  const projectId = param.id as string;
  const { data: taskStatuses } = useQuery({
    queryKey: ["taskStatuses", projectId],
    queryFn: () => getTaskStatusesOfProject(projectId),
    enabled: !!projectId,
  });
  const { data: transitions } = useQuery({
    queryKey: ["transitions", projectId],
    queryFn: () => getProjectTransitions(projectId),
    enabled: !!projectId,
  });

  const initialNodes = useMemo(() => {
    return (
      taskStatuses
        ?.sort((a, b) => a.statusOrder - b.statusOrder)
        ?.map((taskStatus) => {
          return {
            id: taskStatus.id,
            position: { x: taskStatus?.statusOrder * 200, y: 0 },
            data: {
              label: taskStatus.text,
              color: taskStatus.color,
            },
            style: {
              backgroundColor: `${taskStatus.color}26`,
              border: `1px solid ${taskStatus.color}`,
            },
          };
        }) || []
    );
  }, [taskStatuses]);

  const initialEdges = useMemo(() => {
    return (
      transitions?.map((transition) => {
        return {
          id: transition.id,
          source: transition.fromTaskStatusId,
          target: transition.toTaskStatusId,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 20,
            height: 20,
          },
        };
      }) ?? []
    );
  }, [transitions]);

  useEffect(() => {
    if (initialNodes && initialNodes?.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNodes(initialNodes as any);
      requestAnimationFrame(() => {
        fitView({ padding: 0.2 });
      });
    }

    if (initialEdges && initialEdges?.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEdges(initialEdges);
    }
  }, [initialNodes, initialEdges, fitView]);

  const onNodesChange = useCallback(
    (changes) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );
  const onEdgesChange = useCallback(
    (changes) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );
  const onConnect = useCallback(
    (params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    []
  );
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between pr-[17px]">
          <span className="font-medium">Manage Access</span>
          <Button variant="outline">Add people</Button>
        </div>
        <div className="pr-[17px]">
          <Input type="text" placeholder="Search member" />
        </div>
        <div className="flex flex-wrap gap-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div className="border rounded-md w-[24%]" key={index}>
              <div className="flex items-center p-4 justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={
                      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDFIdaeXdrXia74BpoVqeS13Mg3YnBMdBi8A&s"
                    }
                    alt="avatar"
                    className="w-[30px] aspect-square rounded-full object-cover object-center"
                  />
                  <div className="flex flex-col text-sm">
                    <span>john.doe@example.com</span>
                    <span className="text-muted-foreground">Project Owner</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon">
                    <IoChatbubblesOutline size={25} />
                  </Button>
                  <Button variant="outline" size="icon">
                    <IoTrashOutline size={25} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <span className="font-medium">Manage Workflow</span>
        <div
          style={{ width: "70%", height: "calc(100dvh - 300px)" }}
          className="relative border rounded-md"
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            edgeTypes={edgeTypes}
            fitView
          >
            <Background variant={BackgroundVariant.Dots} />
          </ReactFlow>
          <Button
            className="absolute bottom-[40px] right-[40px] cursor-pointer"
            onClick={() => setOpenAddNewStatusDialog(true)}
          >
            <FaPlus size={20} />
          </Button>
          {openAddNewStatusDialog && (
            <CreateStatusDialog
              open={openAddNewStatusDialog}
              onOpenChange={setOpenAddNewStatusDialog}
              onCancel={() => setOpenAddNewStatusDialog(false)}
              onSave={() => setOpenAddNewStatusDialog(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectSetting;

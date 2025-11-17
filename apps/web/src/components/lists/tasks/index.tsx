import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  defaultAnimateLayoutChanges,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { api } from "@sunday/monday/api";
import type { Id } from "@sunday/monday/data-model";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@sunday/ui/components/alert-dialog";
import { Button } from "@sunday/ui/components/button";
import { Checkbox } from "@sunday/ui/components/checkbox";
import { useMutation, useQuery } from "convex/react";
import { generateKeyBetween } from "jittered-fractional-indexing";
import { GripVerticalIcon, ListTodoIcon, TrashIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { toast } from "sonner";

export default function TasksList() {
  const { houseId } = useParams<{ houseId: string }>();

  const updateTask = useMutation(api.tasks.updateTask).withOptimisticUpdate(
    (localStore, args) => {
      const { id, sortOrder, status, houseId } = args;
      if (!id || !houseId) return;

      const current = localStore.getQuery(api.tasks.getTasksByHouseId, { houseId });
      if (!current) return;

      const updated = current.map((t) =>
        t._id === id ? { ...t, ...(sortOrder ? { sortOrder } : {}), ...(status ? { status } : {}) } : t,
      );

      localStore.setQuery(api.tasks.getTasksByHouseId, { houseId }, updated);
    },
  );

  const tasks = useQuery(api.tasks.getTasksByHouseId, {
    houseId: houseId as Id<"houses">,
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { delay: 100, tolerance: 5 } }),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  // Split + sort inside each group
  const { pending, completed } = useMemo(() => {
    const list = tasks ?? [];
    const byKey = (a: any, b: any) => (a.sortOrder ?? "").localeCompare(b.sortOrder ?? "");
    return {
      pending: [...list.filter((t) => t.status !== "done")].sort(byKey),
      completed: [...list.filter((t) => t.status === "done")].sort(byKey),
    };
  }, [tasks]);

  if (!tasks) return <LoadingState />;
  if (tasks.length === 0) return <EmptyState />;

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    // Which container did we come from / go to
    const activeContainer = active.data.current?.sortable?.containerId as "pending" | "completed" | undefined;
    const overContainer = over.data.current?.sortable?.containerId as "pending" | "completed" | undefined;
    if (!activeContainer || !overContainer) return;

    const fromList = activeContainer === "pending" ? pending : completed;
    const toList = overContainer === "pending" ? pending : completed;

    const oldIndex = fromList.findIndex((t) => t._id === active.id);
    const newIndex = toList.findIndex((t) => t._id === over.id);

    // Index guards
    const validOld = oldIndex >= 0;
    const validNew = newIndex >= 0;
    if (!validOld || !validNew) return;

    // Build a preview list to compute neighbors at insertion point
    const moving = fromList[oldIndex];
    const preview =
      activeContainer === overContainer
        ? arrayMove(fromList, oldIndex, newIndex)
        : [...toList.slice(0, newIndex), moving, ...toList.slice(newIndex)];

    const prevItem = preview[newIndex - 1];
    const nextItem = preview[newIndex + 1];
    const newSortOrder = generateKeyBetween(prevItem?.sortOrder ?? null, nextItem?.sortOrder ?? null);

    toast.promise(
      updateTask({
        id: active.id as Id<"tasks">,
        houseId: houseId as Id<"houses">,
        sortOrder: newSortOrder,
        ...(activeContainer !== overContainer
          ? { status: overContainer === "completed" ? "done" : "pending" }
          : {}),
      }),
      { loading: "Updating task...", success: "Task updated", error: "Failed to update task" },
    );
  }

  return (
    <div className="mx-auto">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <div className="space-y-6">
          {/* Pending */}
          <section>
            <h3 className="mb-2 text-sm font-semibold text-muted-foreground">Pending</h3>
            <ol className="space-y-2">
              <SortableContext items={pending.map((t) => t._id)} strategy={verticalListSortingStrategy}>
                {pending.map((task) => (
                  <SortableItem key={task._id} task={task} />
                ))}
              </SortableContext>
            </ol>
          </section>

          {/* Completed */}
          <section>
            <h3 className="mb-2 text-sm font-semibold text-muted-foreground">Completed</h3>
            <ol className="space-y-2">
              <SortableContext items={completed.map((t) => t._id)} strategy={verticalListSortingStrategy}>
                {completed.map((task) => (
                  <SortableItem key={task._id} task={task} />
                ))}
              </SortableContext>
            </ol>
          </section>
        </div>
      </DndContext>
    </div>
  );
}


type SortableItemProps = {
  task: typeof api.tasks.getTasksByHouseId._returnType[number];
};

function SortableItem({ task }: SortableItemProps) {
  const { houseId } = useParams<{ houseId: string }>();
  const updateTask = useMutation(api.tasks.updateTask).withOptimisticUpdate(
    (localStore, args) => {
      const { id, status, houseId, sortOrder } = args;
      if (!id || !status || !houseId) return;
      const currentTasks = localStore.getQuery(api.tasks.getTasksByHouseId, {
        houseId,
      });
      if (!currentTasks) return;
      const updated = currentTasks.map((t) =>
        t._id === id ? { ...t, status, ...(sortOrder && { sortOrder }) } : t
      );
      localStore.setQuery(api.tasks.getTasksByHouseId, { houseId }, updated);
    }
  );

  const tasks = useQuery(api.tasks.getTasksByHouseId, {
    houseId: houseId as Id<"houses">,
  });

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    index,
  } = useSortable({ id: task._id, animateLayoutChanges: defaultAnimateLayoutChanges });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleCheckChange = async () => {
    const newStatus = task.status === "done" ? "pending" : "done";

    if (!tasks) return;

    let newSortOrder = task.sortOrder;

    if (newStatus === "done") {
      // Moving to completed - place at end of completed tasks
      const completedTasks = tasks.filter((t) => t.status === "done");
      const lastCompleted = completedTasks
        .sort((a, b) => a.sortOrder?.localeCompare(b.sortOrder ?? "") ?? 0)
        .pop();

      newSortOrder = generateKeyBetween(lastCompleted?.sortOrder || null, null);
    } else {
      // Moving to pending - place at end of pending tasks
      const pendingTasks = tasks.filter((t) => t.status !== "done");
      const lastPending = pendingTasks
        .sort((a, b) => a.sortOrder?.localeCompare(b.sortOrder ?? "") ?? 0)
        .pop();

      newSortOrder = generateKeyBetween(lastPending?.sortOrder || null, null);
    }

    toast.promise(
      updateTask({
        id: task._id,
        status: newStatus,
        sortOrder: newSortOrder,
        houseId: task.houseId,
      }),
      {
        loading: "Updating task...",
        success: "Task updated",
        error: "Failed to update task",
      }
    );
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center justify-between rounded-sm p-2 bg-muted/50 data-[is-dragging=true]:bg-muted data-[is-dragging=true]:z-[100] data-[is-dragging=true]:ring-2 data-[is-dragging=true]:ring-ring transition-[color,box-shadow,scale] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring data-[is-dragging=true]:scale-[101%] duration-300 ease-in-out"
      data-is-dragging={isDragging}
      data-index={index}
    >
      <div className="flex items-center gap-3">
        <GripVerticalIcon className="size-4 cursor-grab select-none text-muted-foreground" />
        <Checkbox
          checked={task.status === "done"}
          onCheckedChange={handleCheckChange}
        />
        <p
          className="text-sm font-medium text-foreground data-[state=checked]:line-through data-[state=checked]:text-muted-foreground"
          data-state={task.status === "done" ? "checked" : "unchecked"}
        >
          {task.title}
        </p>
      </div>
      <DeleteTaskButton taskId={task._id} />
    </li>
  );
}

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-5 py-14 px-6">
      <div className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-green-500/20 bg-green-500/10 text-green-500">
        <ListTodoIcon className="size-8" />
      </div>
      <div className="space-y-1.5 max-w-sm">
        <p className="text-foreground font-semibold text-xl">No tasks</p>
        <p className="text-sm text-muted-foreground">
          Add a task to get started.
        </p>
      </div>
    </div>
  );
}

export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-5 py-14 px-6">
      <div className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-green-500/20 bg-green-500/10 text-green-500">
        <ListTodoIcon className="size-8" />
      </div>
      <div className="space-y-1.5 max-w-sm">
        <p className="text-foreground font-semibold text-xl">Loading tasks...</p>
        <p className="text-sm text-muted-foreground">
          Please wait while we load your tasks.
        </p>
      </div>
    </div>
  );
}

type Props = {
  taskId: Id<"tasks">;
};

export function DeleteTaskButton({ taskId }: Props) {
  const { houseId } = useParams<{ houseId: Id<"houses"> }>();
  const deleteTask = useMutation(api.tasks.deleteTask).withOptimisticUpdate(
    (localStore, args) => {
      const { taskId } = args;
      if (!taskId) return;
      const currentTasks = localStore.getQuery(api.tasks.getTasksByHouseId, {
        houseId,
      });
      if (!currentTasks) return;
      const updated = currentTasks.filter((t) => t._id !== taskId);
      localStore.setQuery(api.tasks.getTasksByHouseId, { houseId }, updated);
    }
  );

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="z-10">
          <TrashIcon className="h-5 w-5 cursor-pointer text-muted-foreground" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete task</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this task?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => deleteTask({ taskId })}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
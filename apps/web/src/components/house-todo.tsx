"use client";

import { Badge } from "@sunday/ui/components/badge";
import { Button } from "@sunday/ui/components/button";
import { Checkbox } from "@sunday/ui/components/checkbox";
import { Input } from "@sunday/ui/components/input";
import { motion, Reorder } from "framer-motion";
import { Archive, GripVertical, Plus } from "lucide-react";
import { useState } from "react";

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export default function Component() {
  const [activeTasks, setActiveTasks] = useState<Task[]>([
    { id: "1", text: "Review project proposal", completed: false },
    { id: "2", text: "Update website content", completed: false },
    { id: "3", text: "Schedule team meeting", completed: false },
    { id: "4", text: "Prepare presentation slides", completed: false },
  ]);

  const [archivedTasks, setArchivedTasks] = useState<Task[]>([
    { id: "5", text: "Complete quarterly report", completed: true },
    { id: "6", text: "Send client emails", completed: true },
  ]);

  const [newTask, setNewTask] = useState("");

  const addTask = () => {
    if (newTask.trim() !== "") {
      const task: Task = {
        id: Date.now().toString(),
        text: newTask,
        completed: false,
      };
      setActiveTasks([...activeTasks, task]);
      setNewTask("");
    }
  };

  const toggleTaskCompletion = (taskId: string) => {
    const task = activeTasks.find((t) => t.id === taskId);
    if (task) {
      // Remove from active tasks
      setActiveTasks(activeTasks.filter((t) => t.id !== taskId));
      // Add to beginning of archived tasks (most recent first)
      setArchivedTasks([{ ...task, completed: true }, ...archivedTasks]);
    }
  };

  const restoreTask = (taskId: string) => {
    const task = archivedTasks.find((t) => t.id === taskId);
    if (task) {
      // Remove from archived tasks
      setArchivedTasks(archivedTasks.filter((t) => t.id !== taskId));
      // Add to active tasks
      setActiveTasks([...activeTasks, { ...task, completed: false }]);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Add new task */}
      <div className="flex gap-2">
        <Input
          placeholder="Add a new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addTask();
            }
          }}
          className=""
        />
        <Button onClick={addTask}>
          Add task
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Active Tasks */}
      <div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <span>Active Tasks</span>
            <Badge variant="secondary">{activeTasks.length}</Badge>
          </h2>
        </div>
        <div className="space-y-2">
          {activeTasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No active tasks. Add one above!</p>
            </div>
          ) : (
            <Reorder.Group
              axis="y"
              values={activeTasks}
              onReorder={setActiveTasks}
            >
              {activeTasks.map((task) => (
                <Reorder.Item key={task.id} value={task}>
                  <motion.div
                    layout
                    className="flex items-center gap-2 p-2 hover:bg-muted/50 transition-all duration-200 cursor-grab active:cursor-grabbing group rounded-lg"
                    whileDrag={{
                      scale: 1.02,
                      boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
                    }}
                  >
                    <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-200 -ml-4 group-hover:ml-0" />
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => toggleTaskCompletion(task.id)}
                      className="flex-shrink-0 rounded-full transition-all duration-200 group-hover:ml-0"
                    />
                    <span className="flex-1 text-sm font-medium">
                      {task.text}
                    </span>
                  </motion.div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          )}
        </div>
      </div>

      {/* Archived Tasks */}
      {archivedTasks.length > 0 && (
        <>
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute inset-0 flex items-center"
            >
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-start">
              <span className="bg-white pr-2 text-sm text-gray-500 flex items-center gap-2">
                <Archive className="h-4 w-4" />
                Archived Tasks
                <Badge variant="outline">{archivedTasks.length}</Badge>
              </span>
            </div>
          </div>
          <div className="space-y-2 mt-4">
            {archivedTasks.map((task) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg"
              >
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => restoreTask(task.id)}
                  className="flex-shrink-0 rounded-full"
                />
                <span className="flex-1 text-sm text-muted-foreground line-through">
                  {task.text}
                </span>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

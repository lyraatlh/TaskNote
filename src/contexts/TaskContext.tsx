"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Task, TaskContextType } from "../types"

const TaskContext = createContext<TaskContextType | undefined>(undefined)

export const useTask = () => {
  const context = useContext(TaskContext)
  if (!context) {
    throw new Error("useTask must be used within a TaskProvider")
  }
  return context
}

interface TaskProviderProps {
  children: ReactNode
}

export const TaskProvider = ({ children }: TaskProviderProps) => {
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks")
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks))
  }, [tasks])

  const addTask = (taskData: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setTasks((prev) => [...prev, newTask])
  }

  const updateTask = (id: string, taskData: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...taskData, updatedAt: new Date().toISOString() } : task)),
    )
  }

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  const getTask = (id: string) => {
    return tasks.find((task) => task.id === id)
  }

  const toggleTask = (id: string) => {
    updateTask(id, { completed: !tasks.find((task) => task.id === id)?.completed })
  }

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        deleteTask,
        getTask,
        toggleTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  )
}

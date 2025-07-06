"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { useTask } from "../contexts/TaskContext"

const TodoList = () => {
  const { tasks, deleteTask, toggleTask } = useTask()
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all")
  const [sortBy, setSortBy] = useState<"date" | "priority" | "title">("date")

  const filteredTasks = tasks.filter((task) => {
    if (filter === "pending") return !task.completed
    if (filter === "completed") return task.completed
    return true
  })

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "priority") {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    }
    if (sortBy === "title") {
      return a.title.localeCompare(b.title)
    }
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  })

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteTask(id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
        <Link
          to="/todos/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Add New Task
        </Link>
      </div>

      {/* Filters and Sort */}
      <div className="bg-white p-4 rounded-lg shadow flex flex-wrap gap-4 items-center">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Filter:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as "all" | "pending" | "completed")}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm"
          >
            <option value="all">All Tasks</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "date" | "priority" | "title")}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm"
          >
            <option value="date">Date</option>
            <option value="priority">Priority</option>
            <option value="title">Title</option>
          </select>
        </div>
        <div className="text-sm text-gray-500">
          {filteredTasks.length} of {tasks.length} tasks
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {sortedTasks.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-gray-500">No tasks found</p>
            <Link to="/todos/new" className="text-blue-600 hover:text-blue-800 mt-2 inline-block">
              Create your first task
            </Link>
          </div>
        ) : (
          sortedTasks.map((task) => (
            <div key={task.id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3
                        className={`text-lg font-medium ${
                          task.completed ? "line-through text-gray-500" : "text-gray-900"
                        }`}
                      >
                        {task.title}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          task.priority === "high"
                            ? "bg-red-100 text-red-800"
                            : task.priority === "medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                        }`}
                      >
                        {task.priority}
                      </span>
                    </div>
                    {task.description && (
                      <p className={`text-gray-600 mb-2 ${task.completed ? "line-through" : ""}`}>{task.description}</p>
                    )}
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                      {task.dueDate && (
                        <span
                          className={`${
                            new Date(task.dueDate) < new Date() && !task.completed ? "text-red-600 font-medium" : ""
                          }`}
                        >
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <Link to={`/todos/edit/${task.id}`} className="text-blue-600 hover:text-blue-800 p-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </Link>
                  <button onClick={() => handleDelete(task.id)} className="text-red-600 hover:text-red-800 p-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default TodoList

"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Note, NoteContextType } from "../types"

const NoteContext = createContext<NoteContextType | undefined>(undefined)

export const useNote = () => {
  const context = useContext(NoteContext)
  if (!context) {
    throw new Error("useNote must be used within a NoteProvider")
  }
  return context
}

interface NoteProviderProps {
  children: ReactNode
}

export const NoteProvider = ({ children }: NoteProviderProps) => {
  const [notes, setNotes] = useState<Note[]>([])

  useEffect(() => {
    const savedNotes = localStorage.getItem("notes")
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes))
  }, [notes])

  const addNote = (noteData: Omit<Note, "id" | "createdAt" | "updatedAt">) => {
    const newNote: Note = {
      ...noteData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setNotes((prev) => [...prev, newNote])
  }

  const updateNote = (id: string, noteData: Partial<Note>) => {
    setNotes((prev) =>
      prev.map((note) => (note.id === id ? { ...note, ...noteData, updatedAt: new Date().toISOString() } : note)),
    )
  }

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id))
  }

  const getNote = (id: string) => {
    return notes.find((note) => note.id === id)
  }

  return (
    <NoteContext.Provider
      value={{
        notes,
        addNote,
        updateNote,
        deleteNote,
        getNote,
      }}
    >
      {children}
    </NoteContext.Provider>
  )
}

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { TaskProvider } from "./contexts/TaskContext"
import { NoteProvider } from "./contexts/NoteContext"
import Layout from "./components/Layout"
import Dashboard from "./pages/Dashboard"
import TodoList from "./pages/TodoList"
import TodoForm from "./pages/TodoForm"
import Notes from "./pages/Notes"
import NoteForm from "./pages/NoteForm"
import "./App.css"

function App() {
  return (
    <Router>
      <TaskProvider>
        <NoteProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/todos" element={<TodoList />} />
              <Route path="/todos/new" element={<TodoForm />} />
              <Route path="/todos/edit/:id" element={<TodoForm />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/notes/new" element={<NoteForm />} />
              <Route path="/notes/edit/:id" element={<NoteForm />} />
            </Routes>
          </Layout>
        </NoteProvider>
      </TaskProvider>
    </Router>
  )
}

export default App

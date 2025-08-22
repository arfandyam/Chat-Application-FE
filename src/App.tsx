import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import LoginPage from './pages/LoginPage'
import { PrivateRoute } from './PrivateRoute'
import DashboardPage from './pages/DashboardPage'
import ChatPage from './pages/ChatPage'

function App() {

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <PrivateRoute>
            <Route path="/dashboard" element={<DashboardPage />} />
          </PrivateRoute>
          <PrivateRoute>
            <Route path="/chat/:roomId" element={<ChatPage />} />
          </PrivateRoute>
        </Routes>
      </div>
    </Router>
  )
}

export default App

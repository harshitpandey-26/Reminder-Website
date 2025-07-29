import { Route, Routes } from "react-router-dom"
import Register from "./pages/Register"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import { ToastContainer } from "react-toastify"
import ProtectedRoutes from './components/ProtectedRoutes';
import ReminderForm from "./pages/ReminderForm"

function App() {

  return (
    <div>
      <ToastContainer/>
      <Routes>
        <Route path="/" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>

        <Route path="/dashboard" 
        element={ 
          <ProtectedRoutes>
              <Dashboard />
            </ProtectedRoutes>
          }
        />

        <Route path="/form" 
        element={ 
          <ProtectedRoutes>
              <ReminderForm/>
            </ProtectedRoutes>
          }
        />


      </Routes>
    </div>
  )
}

export default App

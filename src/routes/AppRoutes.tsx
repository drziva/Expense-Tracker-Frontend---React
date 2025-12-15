import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import ProtectedRoute from "./ProtectedRoute";
import AppLayout from "../layout/AppLayout";
import ExpensesPage from "../pages/ExpensesPage";
import IncomesPage from "../pages/IncomesPage";

export default function AppRoutes() {
  return(
    <Routes>
      <Route path="/login" element={<LoginPage/>}/>

      <Route element={<ProtectedRoute/>}>
        <Route path="/app" element={<AppLayout/>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage/>} />
          <Route path="expenses" element={<ExpensesPage/>} />
          <Route path="incomes" element={<IncomesPage/>}/>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/app" replace />} />
    </Routes>
  )
}
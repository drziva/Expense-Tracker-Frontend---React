import { Routes, Route, Navigate } from "react-router-dom";
import { lazy } from "react";
import LoginPage from "../pages/LoginPage"; // eager (correct)
import ProtectedRoute from "./ProtectedRoute";
import AppLayout from "../layout/AppLayout";
import { ReportsPage } from "../pages/ReportsPage";

const DashboardPage = lazy(() => import("../pages/DashboardPage"));
const ExpensesPage = lazy(() => import("../pages/ExpensesPage"));
const IncomesPage = lazy(() => import("../pages/IncomesPage"));
const ExpenseGroupsPage = lazy(() => import("../pages/ExpenseGroupsPage"));
const IncomeGroupsPage = lazy(() => import("../pages/IncomeGroupsPage"));
const ScheduledTransactionsPage = lazy(() => import("../pages/ScheduledTransactionsPage"))
const RemindersPage = lazy(() => import("../pages/RemindersPage"));

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
          <Route path="expense-groups" element={<ExpenseGroupsPage/>}/>
          <Route path="income-groups" element={<IncomeGroupsPage/>}/> 
          <Route path="income-groups" element={<IncomeGroupsPage/>}/> 
          <Route path="reports" element={<ReportsPage/>}/>       
          <Route path="scheduled-transactions" element={<ScheduledTransactionsPage/>}/> 
          <Route path="reminders" element={<RemindersPage/>}/>              
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/app" replace />} />
    </Routes>
  )
}
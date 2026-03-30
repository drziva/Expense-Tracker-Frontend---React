import { Routes, Route, Navigate } from "react-router-dom";
import { lazy } from "react";
import LoginPage from "@/features/auth/pages/LoginPage";
import  SignUpPage from "@/features/auth/pages/SignUpPage";
import ProtectedRoute from "@/app/routes/ProtectedRoute";
import AppLayout from "@/app/layout/AppLayout";
import { ReportsPage } from "@/features/reports/ReportsPage";
import OnboardingWelcome from "@/features/onboarding/pages/OnboardingWelcome";

const DashboardPage = lazy(() => import("@/features/dashboard/DashboardPage"));
const ExpensesPage = lazy(() => import("@/features/expenses/ExpensesPage"));
const IncomesPage = lazy(() => import("@/features/incomes/IncomesPage"));
const ExpenseGroupsPage = lazy(() => import("@/features/expense-groups/ExpenseGroupsPage"));
const IncomeGroupsPage = lazy(() => import("@/features/income-groups/IncomeGroupsPage"));
const ScheduledTransactionsPage = lazy(() => import("@/features/scheduled-transactions/ScheduledTransactionsPage"))
const RemindersPage = lazy(() => import("@/features/reminders/pages/RemindersPage"));

export default function AppRoutes() {
  return(
    <Routes>
      <Route path="/login" element={<LoginPage/>}/>
      <Route path="/signup" element={<SignUpPage/>}/>

      
      <Route path="onboarding" element={<OnboardingWelcome/>} />

      <Route element={<ProtectedRoute/>}>
        <Route path="/app" element={<AppLayout/>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage/>} />
          <Route path="expenses" element={<ExpensesPage/>} />
          <Route path="incomes" element={<IncomesPage/>}/>
          <Route path="expense-groups" element={<ExpenseGroupsPage/>}/>
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

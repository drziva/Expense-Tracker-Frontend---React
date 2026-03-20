import { BrowserRouter } from 'react-router-dom';
import AppRoutes from '@/app/routes/AppRoutes';
import { ErrorListener } from './providers/error/ErrorListener';

export default function App() {
  return (
    <BrowserRouter>
      <ErrorListener />
      <AppRoutes />
    </BrowserRouter>
  )
}

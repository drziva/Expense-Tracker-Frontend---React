import { BrowserRouter } from 'react-router-dom';
import AppRoutes from '@/app/routes/AppRoutes';
import { useEffect } from 'react';
import { initPushNotifications, setupForegroundMessageListener } from '@/shared/firebase/firebase-app';
import { useAuth } from '@/features/auth/context/AuthProvider';

export default function App() {
  const user = useAuth().user;

  useEffect(() => {
    if(!user) return;

    initPushNotifications();
    const unsubscribe = setupForegroundMessageListener();
    return () => {
      unsubscribe();
    };
  }, [user])

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

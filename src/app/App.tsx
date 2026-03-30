import { BrowserRouter } from "react-router-dom";
import AppRoutes from "@/app/routes/AppRoutes";
import { ErrorListener } from "./providers/error/ErrorListener";

import VoiceAssistant from "@/features/eleven-labs/VoiceAgent";


export default function App() {

  return (
      <VoiceAssistant>

        <ErrorListener />

        <AppRoutes />

      </VoiceAssistant>
  );

}
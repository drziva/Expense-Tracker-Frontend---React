import { useConversation } from "@elevenlabs/react";
import { useState, createContext, useContext } from "react";

import {
  Fab,
  Paper,
  Typography,
  IconButton,
  Stack,
  Fade
} from "@mui/material";

import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";
import GraphicEqIcon from "@mui/icons-material/GraphicEq";
import { useNavigate } from "react-router-dom";


// CONTEXT
const ConversationContext = createContext<any>(null);

export const useVoiceConversation = () => useContext(ConversationContext);


export default function VoiceAssistant({ children }: any) {

  const [open, setOpen] = useState(false);

  const navigate = useNavigate();


  const conversation = useConversation({

    onConnect: () => setOpen(true),

    onDisconnect: () => setOpen(false),

    onError: console.error,


    tools: [
      {
        name: "navigate",
        description: "Navigate user to another page",
        parameters: {
          type: "object",
          properties: {
            route: {
              type: "string"
            }
          },
          required: ["route"]
        }
      }
    ],


    toolHandlers: {

      navigate: async ({ route }: { route: string }) => {

        console.log("AI navigating to:", route);

        navigate(route);

      }

    }

  });


  const startConversation = async () => {

    await navigator.mediaDevices.getUserMedia({ audio: true });

    await conversation.startSession({
      agentId: "agent_4301kmjga3n4fkkvtxqcnw1n99zh",
      connectionType: "webrtc",
    });

  };


  const stopConversation = () => conversation.endSession();


  const getStatusText = () => {

    if (conversation.status === "connecting")
      return "Connecting…";

    if (conversation.isSpeaking)
      return "AI speaking…";

    if (conversation.status === "connected")
      return "Listening…";

    return "Ready";
  };


  const isActive =
    conversation.status === "connected" ||
    conversation.status === "connecting";


  return (

    <ConversationContext.Provider value={conversation}>

      {children}


      <Fab
        onClick={startConversation}
        color="primary"
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 1200
        }}
      >
        <MicIcon />
      </Fab>


      <Fade in={isActive}>

        <Paper
          elevation={6}
          sx={{
            position: "fixed",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",

            px: 2,
            py: 1.5,

            borderRadius: 3,

            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",

            width: 420,
            maxWidth: "90vw",

            bgcolor: "background.paper",

            zIndex: 1200
          }}
        >

          <Stack direction="row" spacing={1.5} alignItems="center">

            {conversation.isSpeaking
              ? <GraphicEqIcon color="primary" />
              : <MicIcon color="primary" />
            }

            <Typography variant="body2">
              {getStatusText()}
            </Typography>

          </Stack>


          <IconButton
            onClick={stopConversation}
            size="small"
            color="inherit"
          >
            <StopIcon />
          </IconButton>

        </Paper>

      </Fade>

    </ConversationContext.Provider>

  );

}
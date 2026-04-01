import { useConversation } from "@elevenlabs/react";
import {
  useState,
  createContext,
  useContext,
  useMemo,
  useCallback,
} from "react";

import {
  Fab,
  Paper,
  Typography,
  IconButton,
  Stack,
  Fade,
  TextField,
} from "@mui/material";

import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";
import GraphicEqIcon from "@mui/icons-material/GraphicEq";
import SendIcon from "@mui/icons-material/Send";

import { useNavigate } from "react-router-dom";

// context
const ConversationContext = createContext<any>(null);

export const useVoiceConversation = () => useContext(ConversationContext);

export default function VoiceAssistant({ children }: any) {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");

  // ElevenLabs client tools
  const clientTools = useMemo(
    () => ({

      navigate: async (parameters: { route?: string }) => {

        const route = parameters?.route;

        if (!route) return;

        navigate(route);

        return `navigated to ${route}`;
      },

      onboarding_next: async () => {

        window.dispatchEvent(
          new Event("onboarding_next")
        );

        return "moved to next onboarding step";
      },


      onboarding_prev: async () => {

        window.dispatchEvent(
          new Event("onboarding_prev")
        );

        return "moved to previous onboarding step";
      },


      onboarding_finish: async () => {

        window.dispatchEvent(
          new Event("onboarding_finish")
        );

        return "finished onboarding";
      }

    }),
    [navigate]
  );

  const conversation = useConversation({
    clientTools,

    onConnect: () => {
      setOpen(true);
      console.log("CONNECTED");
    },

    onDisconnect: () => {
      setOpen(false);
      console.log("DISCONNECTED");
    },

    onError: (err) => {
      console.error("ELEVEN ERROR:", err);
    },

    onMessage: (msg) => {
      console.log("MESSAGE:", msg);
    },
  });

  // start voice
  const startConversation = useCallback(async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });

      await conversation.startSession({
        agentId: "agent_4301kmjga3n4fkkvtxqcnw1n99zh",
        connectionType: "webrtc",
      });
    } catch (err) {
      console.error(err);
    }
  }, [conversation]);

  const stopConversation = useCallback(() => {
    conversation.endSession();
  }, [conversation]);

  // send text message
  const sendMessage = useCallback(() => {
    const trimmed = input.trim();

    if (!trimmed) return;

    conversation.sendUserMessage(trimmed);

    setInput("");
  }, [conversation, input]);

  // UI helpers
  const getStatusText = () => {
    if (conversation.status === "connecting") return "Connecting…";
    if (conversation.isSpeaking) return "AI speaking…";
    if (conversation.status === "connected") return "Listening…";
    return "Ready";
  };

  const isActive =
    conversation.status === "connected" ||
    conversation.status === "connecting";

  return (
    <ConversationContext.Provider value={conversation}>
      {children}

      {/* mic button */}
      <Fab
        onClick={startConversation}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          background:
            "linear-gradient(135deg, rgb(12,216,199), rgb(8,170,160))",
          boxShadow: "0 12px 30px rgba(12,216,199,0.4)",
          zIndex: 124400,
        }}
      >
        <MicIcon />
      </Fab>

      {/* assistant panel */}
      <Fade in={isActive}>
        <Paper
          elevation={8}
          sx={{
            position: "fixed",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            width: 600,
            maxWidth: "94vw",
            borderRadius: 3,
            backdropFilter: "blur(16px)",
            background: "rgba(15,18,24,0.9)",
            border: "1px solid rgba(255,255,255,0.05)",
            overflow: "hidden",
            zIndex: 1200,
          }}
        >
          <Stack spacing={1.5} p={1.5}>
            {/* status row */}
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Stack direction="row" spacing={1.2} alignItems="center">
                {conversation.isSpeaking ? (
                  <GraphicEqIcon sx={{ color: "rgb(12,216,199)" }} />
                ) : (
                  <MicIcon sx={{ color: "rgb(12,216,199)" }} />
                )}

                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255,255,255,0.7)" }}
                >
                  {getStatusText()}
                </Typography>
              </Stack>

              <IconButton onClick={stopConversation} size="small">
                <StopIcon />
              </IconButton>
            </Stack>

            {/* text input */}
            <Stack direction="row" spacing={1} zIndex={149992}>
              <TextField
                fullWidth
                size="small"
                placeholder="Type a message…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    color: "white",
                    background: "rgba(255,255,255,0.03)",
                  },
                }}
              />

              <IconButton
                onClick={sendMessage}
                sx={{
                  background:
                    "linear-gradient(135deg, rgb(12,216,199), rgb(8,170,160))",
                  color: "white",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, rgb(12,216,199), rgb(8,170,160))",
                  },
                }}
              >
                <SendIcon />
              </IconButton>
            </Stack>
          </Stack>
        </Paper>
      </Fade>
    </ConversationContext.Provider>
  );
}
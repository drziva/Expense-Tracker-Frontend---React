import { Button, Typography, Stack } from "@mui/material";
import { useVoiceConversation } from "@/features/eleven-labs/VoiceAgent";

export default function OnboardingWelcome() {

  const conversation = useVoiceConversation();

  return (

    <Stack spacing={3} sx={{ p: 4 }}>

      <Typography variant="h5">

        Welcome

      </Typography>


      <Typography>

        I will help you set up your finances.

      </Typography>


      <Button
        variant="contained"
        onClick={() => {

          conversation.sendUserMessage(
            "continue onboarding"
          );

        }}
      >

        OK

      </Button>


    </Stack>

  );

}

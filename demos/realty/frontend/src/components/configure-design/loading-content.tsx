import { Box, Typography, CircularProgress } from "@mui/material";

type LoadingContentProps = {
  step: "validating" | "generating" | "exporting";
};

export const LoadingContent = ({ step }: LoadingContentProps) => {
  const steps = [
    { key: "validating", icon: "🔍", label: "Validate" },
    { key: "generating", icon: "✨", label: "Generate" },
    { key: "exporting", icon: "🎨", label: "Export" },
  ];

  const stepConfig = {
    validating: {
      text: "Validating template fields...",
    },
    generating: {
      text: "Generating your design...",
    },
    exporting: {
      text: "Preparing your design...",
    },
  };

  const config = stepConfig[step];
  const currentStepIndex = steps.findIndex((s) => s.key === step);

  return (
    <Box textAlign="center" py={4}>
      {/* Step indicators */}
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        gap={2}
        mb={3}
      >
        {steps.map((stepItem, index) => (
          <Box key={stepItem.key} display="flex" alignItems="center">
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.5rem",
                backgroundColor:
                  index <= currentStepIndex ? "#6366f1" : "#e5e7eb",
                color: index <= currentStepIndex ? "white" : "#9ca3af",
                transition: "all 0.3s ease",
                ...(index === currentStepIndex && {
                  animation: "bounce 2s ease-in-out infinite",
                  "@keyframes bounce": {
                    "0%, 20%, 50%, 80%, 100%": { transform: "translateY(0)" },
                    "40%": { transform: "translateY(-8px)" },
                    "60%": { transform: "translateY(-4px)" },
                  },
                }),
              }}
            >
              {stepItem.icon}
            </Box>
            {index < steps.length - 1 && (
              <Box
                sx={{
                  width: 24,
                  height: 2,
                  backgroundColor:
                    index < currentStepIndex ? "#6366f1" : "#e5e7eb",
                  mx: 1,
                  transition: "all 0.3s ease",
                }}
              />
            )}
          </Box>
        ))}
      </Box>

      <Typography
        variant="h6"
        sx={{
          mb: 1,
          animation: "fade 3s ease-in-out infinite",
          "@keyframes fade": {
            "0%, 100%": { opacity: 1 },
            "50%": { opacity: 0.6 },
          },
        }}
      >
        {config.text}
      </Typography>

      <Box sx={{ mb: 2 }}>
        <CircularProgress
          size={40}
          sx={{
            color: "#6366f1",
          }}
        />
      </Box>
    </Box>
  );
};

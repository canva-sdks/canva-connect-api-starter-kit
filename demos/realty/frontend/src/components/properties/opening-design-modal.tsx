import { Box, Modal, CircularProgress, Typography, Paper } from "@mui/material";

/**
 * Props for the OpeningDesignModal component
 */
type OpeningDesignModalProps = {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Function to close the modal */
  onClose: () => void;
  /** Whether the user is being redirected to Canva */
  isRedirecting: boolean;
};

/**
 * Modal displayed when creating a design or redirecting to Canva
 * Shows a loading indicator with appropriate message
 */
export const OpeningDesignModal = ({
  isOpen,
  onClose,
  isRedirecting,
}: OpeningDesignModalProps): JSX.Element => {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="design-modal-title"
      aria-describedby="design-modal-description"
    >
      <Paper
        elevation={6}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 400,
          borderRadius: 2,
          p: 6,
          transform: "translate(-50%, -50%)",
          outline: "none", // Remove default focus outline
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="center">
          <CircularProgress size={24} color="primary" sx={{ mr: 2 }} />
          <Typography variant="body1" id="design-modal-title" fontWeight={500}>
            {isRedirecting
              ? "Opening your design in Canva..."
              : "Your design is being created..."}
          </Typography>
        </Box>
      </Paper>
    </Modal>
  );
};

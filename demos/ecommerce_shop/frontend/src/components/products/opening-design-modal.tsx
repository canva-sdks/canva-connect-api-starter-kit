import { Box, Modal, CircularProgress, Typography } from "@mui/material";

export const OpeningDesignModal = ({
  isOpen,
  onClose,
  isRedirecting,
}: {
  isOpen: boolean;
  onClose: () => void;
  isRedirecting: boolean;
}) => {
  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        position="absolute"
        top="50%"
        left="50%"
        width={400}
        bgcolor="background.paper"
        border="2px solid black"
        boxShadow={24}
        p={6}
        sx={{
          transform: "translate(-50%, -50%)",
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="center">
          <CircularProgress
            size={24}
            color="primary"
            style={{ marginRight: 8 }}
          />
          {isRedirecting ? (
            <Typography variant="body1">Opening your design...</Typography>
          ) : (
            <Typography variant="body1">
              Your design is being created...
            </Typography>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

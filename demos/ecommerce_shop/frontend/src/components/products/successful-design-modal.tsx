import type { Design } from "@canva/connect-api-ts/types.gen";
import { Box, Modal, CircularProgress, Typography, Link } from "@mui/material";

export const SuccessfulDesignModal = ({
  isOpen,
  isLoading,
  createdDesign,
  onClose,
}: {
  isOpen: boolean;
  isLoading: boolean;
  createdDesign?: Design;
  onClose: () => void;
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
        {isLoading && (
          <Box display="flex" alignItems="center" justifyContent="center">
            <CircularProgress
              size={24}
              color="primary"
              style={{ marginRight: 8 }}
            />
            <Typography variant="body1">
              Your design is being created...
            </Typography>
          </Box>
        )}
        {createdDesign && (
          <Typography variant="body1">
            Hooray! Your design <strong>{createdDesign.title}</strong> has been
            successfully created. You can now view it{" "}
            <Link
              href={createdDesign.urls.edit_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              here
            </Link>
            .
          </Typography>
        )}
      </Box>
    </Modal>
  );
};

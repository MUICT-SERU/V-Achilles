import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

interface AlertDialogProps {
  open: boolean;
  title: string;
  content: string;
  firstButton: { text: string; action: () => void };
  secondButton?: { text: string; action: () => void };
  handleClose?: () => void;
}

const AlertDialog: React.FC<AlertDialogProps> = ({
  open,
  title,
  content,
  firstButton,
  secondButton,
  handleClose,
}) => {
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="xs"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {firstButton && (
            <Button onClick={firstButton.action} color="primary">
              {firstButton.text}
            </Button>
          )}
          {secondButton && (
            <Button onClick={secondButton.action} color="primary">
              {secondButton.text}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AlertDialog;

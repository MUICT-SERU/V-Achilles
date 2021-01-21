import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@material-ui/core";
import { CyanButton, WhiteButton } from "../CustomButton";

interface AlertDialogProps {
  open: boolean;
  title: string;
  content?: string;
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
            <WhiteButton onClick={firstButton.action}>
              {firstButton.text}
            </WhiteButton>
          )}
          {secondButton && (
            <CyanButton onClick={secondButton.action} color="primary">
              {secondButton.text}
            </CyanButton>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AlertDialog;

import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Divider from '@mui/joy/Divider';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import Typography from '@mui/joy/Typography';
import { Container } from './App.style';
import { useState } from 'react';
import {
  AsyncRenderProps,
  useAsyncRenderContext,
} from './npm-module/AsyncRenderProvider';

export type ConfirmationDialogProps = {
  title: string;
};

export enum ConfirmationDialogOutcome {
  Cancel = 'Cancel',
  Confirm = 'Confirm',
}

function ConfirmationDialog(
  props: AsyncRenderProps<ConfirmationDialogProps, ConfirmationDialogOutcome>
) {
  const { resolve, reject, title } = props;

  const [open, setOpen] = useState(true);

  const cancel = () => {
    reject();
    setOpen(false);
  };

  const confirm = () => {
    resolve(ConfirmationDialogOutcome.Confirm);
    setOpen(false);
  };

  return (
    <Modal
      open={open}
      aria-labelledby="alert-dialog-modal-title"
      aria-describedby="alert-dialog-modal-description"
      onClose={cancel}
    >
      <ModalDialog variant="outlined" role="alertdialog">
        <Typography
          id="alert-dialog-modal-title"
          component="h2"
          level="inherit"
          fontSize="1.25em"
          mb="0.25em"
          startDecorator={<WarningRoundedIcon />}
        >
          {title}
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
          <Button variant="plain" color="neutral" onClick={cancel}>
            Cancel
          </Button>
          <Button variant="solid" color="danger" onClick={confirm}>
            Continue
          </Button>
        </Box>
      </ModalDialog>
    </Modal>
  );
}

function App() {
  const { asyncRender } = useAsyncRenderContext();

  return (
    <Container>
      <Button
        variant="solid"
        color="danger"
        onClick={() => {
          asyncRender(ConfirmationDialog, { title: 'Are you sure?' })
            .then(() =>
              asyncRender(ConfirmationDialog, {
                title: 'Ok, but are you really sure?',
              })
            )
            .then(() =>
              asyncRender(ConfirmationDialog, {
                title: 'I have to check just once more...',
              })
            )
            .then(() => {
              console.log('do the destructive action...');
            })
            .catch((e) => {
              if (e) {
                console.error(e);
              } else {
                // operation cancelled by user, do nothing.
              }
            });
        }}
      >
        Destruction
      </Button>
    </Container>
  );
}

export default App;

import { Dialog, DialogProps } from '@material-ui/core';

export function MyDialog(props: DialogProps) {
  return (
    <Dialog
      {...props}
      BackdropProps={{ style: { backgroundColor: 'rgba(0,0,0,0.1)' } }}
      PaperProps={{
        style: {
          backgroundColor: '#12234F',
          borderRadius: 20,
        },
      }}
    >
      {props.children}
    </Dialog>
  );
}

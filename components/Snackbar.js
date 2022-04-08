import * as React from 'react';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function SnackbarComponent({ snackbarData, setSnackbarData }) {


    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setSnackbarData({ ...snackbarData, open: false })
    };

    return (
        <Stack spacing={2} sx={{ width: '100%' }}>
            <Snackbar open={snackbarData.open} autoHideDuration={snackbarData.time} onClose={handleClose}>
                <Alert onClose={handleClose} severity={snackbarData.severity} sx={{ width: '100%' }}>
                    {snackbarData.message}
                </Alert>
            </Snackbar>

        </Stack>
    );
}

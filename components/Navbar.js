import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import DoneAllRoundedIcon from '@mui/icons-material/DoneAllRounded';


const ResponsiveAppBar = ({ isMetamask, connectWallet, ethersObj, setSnackbarData }) => {

    const [copied, setCopied] = React.useState(false)

    const handleCopeButtonClick = (currentAccount) => {
        navigator.clipboard.writeText(currentAccount);
        setCopied(true)
        setSnackbarData({
            open: true,
            message: 'Wallet Address Copied!',
            severity: 'success',
            time: 3000
        })
    }

    return (
        <AppBar position="sticky" color='primary' >
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Box
                        sx={{ mr: 10, ml: 4, display: { xs: 'none', md: 'flex' } }}
                    >
                        <img src="uber-logo.png" alt="" style={{
                            width: 80,
                        }} />
                    </Box>


                    <Box
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' }, position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}
                    >
                        <img src="uber-logo.png" alt="" style={{
                            width: 80,
                        }} />
                    </Box>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex', alignItems: 'center' } }}>

                        <div className='text-[15px]' >
                            {
                                ethersObj.currentAccount ? ethersObj.currentAccount.slice(0, 10) + '...' + ethersObj.currentAccount.slice(32) : 'No Wallet Connected'
                            }

                        </div>
                        {
                            ethersObj.currentAccount ? <IconButton size='small' sx={{
                                marginLeft: '0.35rem',
                                marginBottom: '0.2rem',
                                color: 'white'
                            }} onClick={() => handleCopeButtonClick(ethersObj.currentAccount)} >
                                {
                                    copied ? <DoneAllRoundedIcon sx={{
                                        fontSize: '1.3rem'
                                    }} /> : <ContentCopyRoundedIcon sx={{
                                        fontSize: '1.3rem'
                                    }} />
                                }
                            </IconButton> : <></>
                        }




                    </Box>

                    <Box sx={{ flexGrow: 0 }}>

                        {
                            isMetamask ? <Button onClick={connectWallet}  sx={{ p: 0, mr: -1, color: '#85ffa5', px: 1, py: 0.5, fontSize: '0.8rem', textTransform: 'capitalize', width: '70px', lineHeight: 1.2 }} className="md:w-[140px] md:text-[13px] md:py-2 "  >
                                {
                                    ethersObj.currentAccount ? 'Wallet Connected' : 'Connect Wallet'
                                }

                            </Button> : <Button
                                sx={{ p: 0, mr: -1, color: 'white', px: 1, py: 0.5, fontSize: '0.8rem', textTransform: 'capitalize', width: '70px', lineHeight: 1.2 }}
                                className="md:w-[140px] md:text-[13px] md:py-2 "
                                onClick={() => window.location.href = "https://metamask.io/"}
                            >
                                Install Metamask
                            </Button>
                        }
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};
export default ResponsiveAppBar;

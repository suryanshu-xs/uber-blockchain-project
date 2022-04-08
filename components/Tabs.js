import * as React from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded';
import RestoreRoundedIcon from '@mui/icons-material/RestoreRounded';
import Ride from './Ride'
import Recent from './Recent'

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

export default function Options({ geojson,setGeojson,sendEthereum,ethersObj,setSnackbarData,value, setValue }) {
    const theme = useTheme();

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeIndex = (index) => {
        setValue(index);
    };
    //   .css-hip9hq-MuiPaper-root-MuiAppBar-root
    return (
        <div className='flex-1 ' >
            <AppBar position="static"  >
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="secondary"
                    textColor="inherit"
                    variant="fullWidth"
                    aria-label="full width tabs example"
                    sx={{
                        background: 'white',
                        color: 'black'
                    }}

                >
                    <Tab icon={<DirectionsCarRoundedIcon />} label="Ride" {...a11yProps(0)} iconPosition="start" />
                    <Tab icon={<RestoreRoundedIcon />} label="Recent" {...a11yProps(1)} iconPosition="start" />

                </Tabs>
            </AppBar>
            <SwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={value}
                onChangeIndex={handleChangeIndex}

            >
                <TabPanel value={value} index={0} dir={theme.direction}  >
                    <Ride geojson={geojson} setGeojson={setGeojson} sendEthereum={sendEthereum} ethersObj={ethersObj} setValue={setValue} />
                </TabPanel>
                <TabPanel value={value} index={1} dir={theme.direction}>
                    <Recent ethersObj={ethersObj} setSnackbarData={setSnackbarData}  />
                </TabPanel>

            </SwipeableViews>
        </div>
    );
}

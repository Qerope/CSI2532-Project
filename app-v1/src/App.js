import React, { useState } from 'react';
import { Tab, Tabs, Box, Drawer, Button } from '@mui/material';

import RoomSearch from './components/RoomSearch';
import Management from './components/Management';


const App = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <div className="App">
      <Box sx={{ position: 'fixed', top: 20, right: 20, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', zIndex: 999 }}>
        {/* First Hovering Button */}
        <Button
          sx={{
            mb: 1,
            backgroundColor: 'primary.main',
            color: 'white',
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
          }}
          onClick={() => handleTabChange(null, 0)}
        >
          Booking
        </Button>

        {/* Second Hovering Button */}
        <Button
          sx={{
            backgroundColor: 'secondary.main',
            color: 'white',
            '&:hover': {
              backgroundColor: 'secondary.dark',
            },
          }}
          onClick={() => handleTabChange(null, 1)}
        >
          Management
        </Button>
      </Box>
      <Box>
        {activeTab === 0 && (
          <RoomSearch />
        )}
        {activeTab === 1 && (
          <Management />
        )}
      </Box>
    </div>
  );
};

export default App;

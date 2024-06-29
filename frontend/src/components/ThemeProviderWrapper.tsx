import React from 'react';
import { useState, ReactNode, useContext, createContext } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { teal } from '@mui/material/colors';
import { Button } from '@mui/material';


interface ThemeProviderWrapperProps {
    children: ReactNode;
  }

export const ThemeContext = React.createContext<any>(true);
export const FilterContext = React.createContext<any>(false);

const ThemeProviderWrapper: React.FC<ThemeProviderWrapperProps> = ({ children }) => {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [filterShow, setFilterShow] = useState<boolean>(false);
  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };
  const toggleFilterShow = () => {
    setFilterShow((prevShow) => !prevShow);
  }

  const darkTheme = createTheme({
    palette: {
      background: {
        // default: '#007A73',
        // default: teal[900],
        default: '#1e3030',
      },
      mode: 'dark',
    },
  });

  const lightTheme = createTheme({
    palette: {
      background: {
        default: teal[50],
      },
      mode: 'light',
    },
  });

  return (
    <ThemeContext.Provider value={[darkMode, toggleDarkMode]}>
      <FilterContext.Provider value={[filterShow, toggleFilterShow]}>
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
    </FilterContext.Provider>
    </ThemeContext.Provider>
  );
};

export default ThemeProviderWrapper;

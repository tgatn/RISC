import React, { useContext } from 'react'
import Box from '@mui/material/Box'
import GoogleGeminiSmallIcon from "../assets/Gemini_Star_Logo-removebg-preview.png"
import PersonIcon from '@mui/icons-material/Person';
import { blueGrey, grey } from '@mui/material/colors'
import { ThemeContext } from './ThemeProviderWrapper';

const UserMessage = ({ text }) => {

  const [darkMode] = useContext(ThemeContext);

  return (
            <Box sx={{display: "flex", justifyContent: "flex-end", marginBottom: "8px", gap: "4px"}}>
            <div style={darkMode ? {backgroundColor: blueGrey[600], padding: "6px", borderRadius: "6px", fontSize: "14px"} : {backgroundColor: "#fff", padding: "6px", borderRadius: "6px", fontSize: "14px"}}>{text}</div>
            {/* <img style={{alignSelf: "flex-start"}} src={PersonIcon} width="24px" /> */}
            <PersonIcon sx={{width: "24px"}}/>
            </Box>
  )
}

export default UserMessage
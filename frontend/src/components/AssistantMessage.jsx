import React, { useContext } from 'react'
import Box from '@mui/material/Box'
import GoogleGeminiSmallIcon from "../assets/Gemini_Star_Logo-removebg-preview.png"
import { blueGrey, grey } from '@mui/material/colors'
import Markdown from 'markdown-to-jsx'
import { ThemeContext } from './ThemeProviderWrapper'

const AssistantMessage = ({ text }) => {

  const [darkMode] = useContext(ThemeContext);

  return (
            <Box sx={{display: "flex", marginBottom: "8px", gap: "4px"}}>
            <img style={{alignSelf: "flex-start"}} src={GoogleGeminiSmallIcon} width="24px" />
            <div style={darkMode ? {backgroundColor: blueGrey[800], padding: "6px", borderRadius: "6px", fontSize: "14px"} : {backgroundColor: "#eee", padding: "6px", borderRadius: "6px", fontSize: "14px"}}><Markdown>{text}</Markdown></div>
            </Box>
  )
}

export default AssistantMessage
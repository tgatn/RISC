import React, { useContext, useEffect, useRef, useState } from 'react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box'
import GoogleGeminiFullLogo from "../assets/Google_Gemini_logo.png"
import GoogleGeminiSmallIcon from "../assets/Gemini_Star_Logo-removebg-preview.png"
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import Button from '@mui/material/Button';
import { grey, teal, blueGrey } from '@mui/material/colors';
import "./styles/AssistantChatBox.css"
import { Divider, Grid, Slide } from '@mui/material';
import AssistantMessage from './AssistantMessage';
import UserMessage from './UserMessage';
import ChatService from '../services/ChatService';
import LinearProgress from '@mui/material/LinearProgress';
import { ThemeContext } from './ThemeProviderWrapper';

const AssistantChatBox = ({routes}) => {

  const scrollRef = useRef(null);

  const [darkMode] = useContext(ThemeContext);


    const [messages, setMessages] = useState([]);
    const [currentMessage, setCurrentMessage] = useState("")

        const generateResponse = async (routeId, option) => {

        try {

        setLinearProgress(true);

        const response = await ChatService.generative_ai(routeId, option);
        const newMessage = response.data;
        setCurrentMessage(newMessage);
        messages.push({type: "assistant", text: newMessage});
        setCurrentMessage("")
        setLinearProgress(false);

        } catch (err) {
          messages.push({type: "assistant", text: "**Error:** " + err.message});
          setCurrentMessage("")
          setLinearProgress(false);
        }

        // scrollRef.current.scrollIntoView({ behavior: "smooth" });
      }


    const [showChat, setShowChat] = useState(false);
    const [currentRouteId, setCurrentRouteId] = useState("");

    // State
    const [hasRouteSelected, setHasRouteSelected] = useState(false);
    const [linearProgress, setLinearProgress] = useState(false);
    const [fullscreen, setFullscreen] = useState(false);

    useEffect(() => {
      messages.push({type: "assistant", text: "Hi, welcome to RISCs. I am here to give you information on disruptions and historical risks of your routes."})
      messages.push({type: "assistant", text: "Please select which route you want more information about:"})
    }, [])


  return (
    <div className='no-transition' style={fullscreen && showChat ? {position: "absolute", bottom: "50%", left: "50%", transform: "translate(-50%, 50%)", width: "75%", zIndex: "999"}: { position: "absolute", bottom: "0", right: "40px", width: "340px"}}>
        {showChat ? <Slide direction="up" in={showChat}>
        <Card className="no-transition" sx={fullscreen && showChat ? {height: "700px"}:{height: "500px", border: "1px solid #444"}}>
            <Box className="no-transition" sx={{display: "flex", alignItems: "center", padding: "4px 8px", cursor: "pointer"}} onClick={() => setShowChat(!showChat)}>
            <img alt="gemini full logo" className="no-transition" src={GoogleGeminiFullLogo} width="100px"/>
            {fullscreen ? <FullscreenExitIcon sx={{marginLeft: "auto"}} onClick={(e) => {
              e.stopPropagation();
              setFullscreen(!fullscreen)
            }}/>: <FullscreenIcon sx={{marginLeft: "auto"}} onClick={(e) => {
              e.stopPropagation();
              setFullscreen(!fullscreen)
            }}/>}
            
            <KeyboardArrowDownIcon className="no-transition" />
            </Box>
            <Box className="no-transition" sx={darkMode ? {height: "100%", backgroundColor: blueGrey[900], padding: "4px"} : {height: "100%", backgroundColor: blueGrey[100], padding: "4px"}}>
                <Box sx={{ overflowY: "scroll", height: "60%", padding: "4px", scrollbarWidth: "thin"}}>
            {messages.map(message => {
              if (message.type === "assistant") {
                return <AssistantMessage key={message.text + Math.random()} text={message.text} />
              } else {
                // user
                return <UserMessage key={message.text + Math.random()} text={message.text} />
              }
            })}

            {linearProgress ? <LinearProgress /> : ""}
            <div ref={scrollRef} />

            </Box>

            <Divider sx={{marginBottom: "6px"}}/>
            <Box sx={{height: "30%", overflowY: "scroll"}}>
            
            <Grid container sx={fullscreen ? {padding: "4px", width: "60%", margin: "0 auto"} : {padding: "4px"}}>
            {!hasRouteSelected ? routes.map((route) => {
                return <Grid xs={6} item sx={{padding: "2px"}}><Button fullWidth key={route._id} onClick={() => {
                    setHasRouteSelected(true);
                    setCurrentRouteId(route._id);
                    // generateResponse(route._id, "tell me about the weather in the locations");
                    messages.push({type: "user", text: route.name})
                    messages.push({type: "assistant", text: "What would you like to know about " + route.name + "?"})
                }} variant="outlined" sx={{textTransform: "none", height: "100%"}}>{route.name}</Button></Grid>
            }) : <>
              <Grid xs={6} item sx={{padding: "2px"}}>
            <Button fullWidth onClick={() => {
              messages.push({type: "user", text: "Historical Risks"})
              // scrollRef.current.scrollIntoView({ behavior: "smooth" });
              generateResponse(currentRouteId, "historical supply risk factors of locations")
            }} variant="outlined" sx={{textTransform: "none"}}>Historical Risks</Button>
            </Grid>
            <Grid xs={6} item sx={{padding: "2px"}}>
            <Button fullWidth onClick={() => {
              messages.push({type: "user", text: "Recent Risks"})
              generateResponse(currentRouteId, "most recent risk factors associated to locations")
            }} variant="outlined" sx={{textTransform: "none"}}>Recent Risks</Button>
            </Grid>
            <Grid xs={6} item sx={{padding: "2px"}}>
            <Button fullWidth onClick={() => {
              messages.push({type: "user", text: "Current Weather"})
              generateResponse(currentRouteId, "tell me about the weather in the locations")
            }} variant="outlined" sx={{textTransform: "none"}}>Current Weather</Button>
            </Grid>
            <Grid xs={6} item sx={{padding: "2px"}}>
            <Button fullWidth onClick={() => {
              messages.push({type: "user", text: "Current Events"})
              generateResponse(currentRouteId, "tell me about current events in the locations")
            } } variant="outlined" sx={{textTransform: "none"}}>Current Events</Button>
            </Grid>
            <Grid xs={6} item sx={{padding: "2px"}}>
            <Button fullWidth onClick={() => {
              messages.push({type: "user", text: "Start Location"})
              generateResponse(currentRouteId, "tell me more about start location")
            }} variant="outlined" sx={{textTransform: "none"}}>Start Location</Button>
            </Grid>
            <Grid xs={6} item sx={{padding: "2px"}}>
            <Button fullWidth onClick={() => {
              messages.push({type: "user", text: "End Location"})
              generateResponse(currentRouteId, "tell me more about end location")
            }} variant="outlined" sx={{textTransform: "none"}}>End Location</Button>
            </Grid>
            <Grid xs={6} item sx={{padding: "2px"}}>
            <Button fullWidth onClick={() => {
              messages.push({type: "user", text: "Route Risks"})
              generateResponse(currentRouteId, "tell me location near and between the route that have risk")
            }} variant="outlined" sx={{textTransform: "none"}}>Route Risks</Button>
            </Grid>
            <Grid xs={6} item sx={{padding: "2px"}}>
            <Button fullWidth onClick={() => {
              messages.push({type: "user", text: "General Info"})
              generateResponse(currentRouteId, "tell me about the route")
            }} variant="outlined" sx={{textTransform: "none"}}>General Info</Button>
            </Grid>
            <Grid xs={12} item sx={{padding: "2px"}}>
            <Button fullWidth onClick={() => {
              setHasRouteSelected(false)
              setCurrentRouteId("")
              messages.push({type: "assistant", text: "Please select which route you want more information about:"})
            }} variant="outlined" color="error" sx={{textTransform: "none"}}>Back to Routes</Button>
            </Grid>
            </>
            }
            </Grid>
            </Box>
            </Box>
        </Card>
        </Slide> : ""}
        {showChat ? "" : <Card className="no-transition" sx={{border: "1px solid #444"}}>
            <Box className="no-transition" sx={{display: "flex", alignItems: "center", padding: "4px 8px", cursor: "pointer"}} onClick={() => setShowChat(!showChat)}>
                <img alt="gemini full logo" className="no-transition" src={GoogleGeminiFullLogo} width="100px"/>
                <KeyboardArrowUpIcon sx={{marginLeft: "auto"}}className="no-transition"/>
            </Box>
        </Card>
        }
    </div>
  )
}

export default AssistantChatBox
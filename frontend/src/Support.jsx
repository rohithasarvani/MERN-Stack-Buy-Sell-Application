import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import MenuAppBar from "./components/navbar.jsx";
const Support = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, newMessage]);

    try {
      const response = await axios.post("http://localhost:5000/api/support", { message: input });
      const botMessage = { text: response.data.reply, sender: "bot" };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error getting response:", error);
      setMessages((prev) => [...prev, { text: "Error contacting support", sender: "bot" }]);
    }

    setInput("");
  };

  return (
    <>
    <MenuAppBar/>
    <Box sx={{ maxWidth: 500, margin: "auto", mt: 4 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Support Chat
      </Typography>
      <Paper sx={{ p: 2, height: 400, overflowY: "auto", display: "flex", flexDirection: "column" }}>
        {messages.map((msg, index) => (
          <Box
            key={index}
            sx={{
              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
              bgcolor: msg.sender === "user" ? "primary.light" : "grey.300",
              color: msg.sender === "user" ? "white" : "black",
              p: 1,
              borderRadius: 1,
              mb: 1,
              maxWidth: "80%",
            }}
          >
            {msg.text}
          </Box>
        ))}
        <div ref={chatEndRef} />
      </Paper>
      <Box sx={{ display: "flex", mt: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />
        <Button onClick={sendMessage} variant="contained" sx={{ ml: 2 }}>
          Send
        </Button>
      </Box>
    </Box></>
    
  );
};

export default Support;

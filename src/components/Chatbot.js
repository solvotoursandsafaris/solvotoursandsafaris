import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, Button, Typography, IconButton } from '@mui/material';
import { Close as CloseIcon, AttachFile as AttachFileIcon, EmojiEmotions as EmojiEmotionsIcon } from '@mui/icons-material';
import Tooltip from '@mui/material/Tooltip';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import Avatar from '@mui/material/Avatar';
import { grey } from '@mui/material/colors';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import Picker from 'emoji-picker-react';
import MicIcon from '@mui/icons-material/Mic';
import { useTheme } from '@mui/material/styles';
import FAQ from './FAQ';
import { useNavigate } from 'react-router-dom';

const botAvatar = '/images/bot-avatar.png'; // Use a local or remote image for the bot avatar
const translations = {
  en: {
    greeting: {
      friendly: "Hi! 👋 Please enter your email to start chatting with us.",
      adventurous: "Jambo! 🦁 Ready for an adventure? Enter your email to begin!",
      formal: "Welcome. Please provide your email to start our conversation."
    },
    quickReplies: [
      { label: 'Safari Packages', value: 'Tell me about safari packages' },
      { label: 'Pricing', value: 'What are your prices?' },
      { label: 'Contact Agent', value: 'I want to talk to an agent' },
    ],
    bookNow: 'Book Now',
    faqPlaceholder: 'Search FAQs...',
    send: 'Send',
    typeMessage: 'Type a message...'
  },
  sw: {
    greeting: {
      friendly: "Habari! 👋 Tafadhali weka barua pepe kuanza mazungumzo.",
      adventurous: "Karibu! 🦁 Tayari kwa safari? Weka barua pepe kuanza!",
      formal: "Karibu. Tafadhali toa barua pepe kuanza mazungumzo."
    },
    quickReplies: [
      { label: 'Paketiza Safari', value: 'Niambie kuhusu paketiza safari' },
      { label: 'Bei', value: 'Bei zenu ni zipi?' },
      { label: 'Wasiliana na Wakala', value: 'Nataka kuzungumza na wakala' },
    ],
    bookNow: 'Weka Nafasi',
    faqPlaceholder: 'Tafuta Maswali...',
    send: 'Tuma',
    typeMessage: 'Andika ujumbe...'
  },
  fr: {
    greeting: {
      friendly: "Salut! 👋 Veuillez entrer votre e-mail pour commencer à discuter.",
      adventurous: "Bonjour! 🦁 Prêt pour l'aventure? Entrez votre e-mail pour commencer!",
      formal: "Bienvenue. Veuillez fournir votre e-mail pour commencer la conversation."
    },
    quickReplies: [
      { label: 'Safaris', value: 'Parlez-moi des safaris' },
      { label: 'Tarifs', value: 'Quels sont vos prix?' },
      { label: 'Contacter un agent', value: 'Je veux parler à un agent' },
    ],
    bookNow: 'Réserver',
    faqPlaceholder: 'Rechercher dans la FAQ...',
    send: 'Envoyer',
    typeMessage: 'Tapez un message...'
  }
};

const Chatbot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false); // State to control visibility
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [emailError, setEmailError] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [windowPos, setWindowPos] = useState({ bottom: 100, right: 32 });
  const chatWindowRef = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [language, setLanguage] = useState('en');
  const [personality, setPersonality] = useState('friendly');
  const [themeMode, setThemeMode] = useState('light');
  const theme = useTheme();
  const [faqSearch, setFaqSearch] = useState('');
  const [faqResults, setFaqResults] = useState([]);
  const navigate = useNavigate();

  const questions = [
    "When are you planning to travel?",
    "What type of safari are you interested in?",
    "How many people will be traveling?",
    "Do you have any specific destinations in mind?",
    "What is your budget range for the safari?",
  ];

  // Persistent chat history
  useEffect(() => {
    const saved = localStorage.getItem('chatbot-messages');
    if (saved) setMessages(JSON.parse(saved));
  }, []);
  useEffect(() => {
    localStorage.setItem('chatbot-messages', JSON.stringify(messages));
  }, [messages]);

  // FAQ search logic
  useEffect(() => {
    if (faqSearch.trim()) {
      const faqs = [
        {
          question: "What is the best time to go on a safari?",
          answer: "The best time to visit is during the dry season, from June to October, when wildlife is more active."
        },
        {
          question: "What should I pack for a safari?",
          answer: "We recommend bringing comfortable clothing, sunscreen, a hat, and a good camera to capture the moments."
        },
        {
          question: "Are the safaris family-friendly?",
          answer: "Yes, we offer family-friendly safari packages that cater to all ages."
        },
        {
          question: "What is your cancellation policy?",
          answer: "You can cancel your booking up to 48 hours in advance for a full refund. Please check our website for more details."
        },
        {
          question: "Do you provide meals during the safari?",
          answer: "Yes, meals are included in most of our safari packages. Please check the specific package details for more information."
        },
      ];
      setFaqResults(
        faqs.filter(faq =>
          faq.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
          faq.answer.toLowerCase().includes(faqSearch.toLowerCase())
        )
      );
    } else {
      setFaqResults([]);
    }
  }, [faqSearch]);

  // Booking quick reply handler
  const handleQuickBooking = () => {
    setMessages((prev) => [
      ...prev,
      { text: 'Let’s start your booking! Please provide your name, email, and preferred safari date.', sender: 'bot' }
    ]);
    // Optionally, open booking page with pre-filled info
    setTimeout(() => navigate('/booking'), 2000);
  };

  const handleSend = () => {
    if (!emailSubmitted) {
      if (validateEmail(email)) {
        setEmailSubmitted(true);
        const emailMessage = { text: `Email: ${email}`, sender: 'user' };
        setMessages([...messages, emailMessage]);
        
        // Send email message to backend
        fetch('/api/chat/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(emailMessage),
        });

        setMessages((prev) => [...prev, { text: "Thanks! Let's get started.", sender: 'bot' }]);
        setMessages((prev) => [...prev, { text: questions[currentQuestion], sender: 'bot' }]);
        setEmailError(false);
      } else {
        setEmailError(true);
      }
    } else if (input.trim()) {
      const userMessage = { text: input, sender: 'user' };
      setMessages([...messages, userMessage]);

      // Send user message to backend
      fetch('/api/chat/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userMessage),
      });

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setMessages((prev) => [...prev, { text: questions[currentQuestion + 1], sender: 'bot' }]);
      } else {
        setMessages((prev) => [...prev, { text: "Thank you for your responses!", sender: 'bot' }]);
      }
      setInput('');
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Replace quickReplies with language/personality aware version
  const quickReplies = translations[language].quickReplies;

  // Update greeting on open
  const handleOpen = () => {
    setIsOpen(true);
    if (messages.length === 0) {
      setMessages([{ text: translations[language].greeting[personality], sender: 'bot' }]);
    }
  };

  // Emoji picker handler
  const handleEmojiClick = (event, emojiObject) => {
    setInput(input + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  // File upload handler (images/docs)
  const handleAttachment = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileType = file.type.startsWith('image/') ? 'image' : 'file';
        setMessages((prev) => [...prev, { text: file.name, sender: 'user', file: e.target.result, fileType }]);
      };
      reader.readAsDataURL(file);
    }
  };

  // Voice input (speech-to-text)
  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser.');
      return;
    }
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = language;
    recognition.onresult = (event) => {
      setInput(input + event.results[0][0].transcript);
    };
    recognition.start();
  };

  // Audio message recording (optional)
  const handleStartRecording = async () => {
    if (!navigator.mediaDevices) return;
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new window.MediaRecorder(stream);
    setMediaRecorder(recorder);
    setAudioChunks([]);
    recorder.ondataavailable = (e) => setAudioChunks((prev) => [...prev, e.data]);
    recorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      const audioUrl = URL.createObjectURL(audioBlob);
      setMessages((prev) => [...prev, { sender: 'user', audio: audioUrl, fileType: 'audio' }]);
    };
    recorder.start();
    setRecording(true);
  };
  const handleStopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  const getResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('hours')) {
      return "We're open from 9 AM to 5 PM.";
    } else if (lowerMessage.includes('location')) {
      return "Our office is located at 123 Safari Road, Nairobi, Kenya.";
    } else if (lowerMessage.includes('safari packages')) {
      return "We offer various safari packages, including the Great Migration Safari, Amboseli Elephants and Mountain, and Sandy White Beach Experience.";
    } else if (lowerMessage.includes('best time to visit')) {
      return "The best time to visit is during the dry season, from June to October, when wildlife is more active.";
    } else if (lowerMessage.includes('what to bring')) {
      return "We recommend bringing comfortable clothing, sunscreen, a hat, and a good camera to capture the moments.";
    } else if (lowerMessage.includes('payment options')) {
      return "We accept various payment options, including credit cards, PayPal, and bank transfers.";
    } else if (lowerMessage.includes('cancellation policy')) {
      return "You can cancel your booking up to 48 hours in advance for a full refund. Please check our website for more details.";
    } else {
      return "I'm sorry, I don't understand that. Can you please rephrase your question?";
    }
  };

  // Drag handlers
  const handleDragStart = (e) => {
    setIsDragging(true);
    const rect = chatWindowRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.right,
      y: e.clientY - rect.bottom,
    });
    document.body.style.userSelect = 'none';
  };
  const handleDrag = (e) => {
    if (!isDragging) return;
    setWindowPos({
      bottom: window.innerHeight - e.clientY - dragOffset.y,
      right: window.innerWidth - e.clientX - dragOffset.x,
    });
  };
  const handleDragEnd = () => {
    setIsDragging(false);
    document.body.style.userSelect = '';
  };
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDrag);
      window.addEventListener('mouseup', handleDragEnd);
    } else {
      window.removeEventListener('mousemove', handleDrag);
      window.removeEventListener('mouseup', handleDragEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleDrag);
      window.removeEventListener('mouseup', handleDragEnd);
    };
  }, [isDragging]);

  // Scroll to latest message
  const messagesEndRef = useRef(null);
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Typing indicator
  const [botTyping, setBotTyping] = useState(false);
  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].sender === 'user') {
      setBotTyping(true);
      const timeout = setTimeout(() => setBotTyping(false), 1200);
      return () => clearTimeout(timeout);
    }
  }, [messages]);

  return (
    <Box>
      {/* Floating Chatbot and WhatsApp Buttons */}
      <Box sx={{ position: 'fixed', bottom: 32, right: 32, zIndex: 1300, display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-end' }}>
        <Tooltip title="Chat with us!" placement="left">
          <IconButton
            aria-label="Open chatbot"
            onClick={() => setMinimized(false) || handleOpen()}
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #003366 60%, #1976d2 100%)',
              color: 'white',
              boxShadow: 4,
              animation: 'pulse 2s infinite',
              '&:hover, &:focus': {
                background: 'linear-gradient(135deg, #1976d2 60%, #003366 100%)',
                transform: 'rotate(-8deg) scale(1.08)',
                animation: 'none',
                outline: '2px solid #FFA000',
                outlineOffset: 2,
              },
              transition: 'transform 0.2s, background 0.2s',
            }}
          >
            <Typography variant="h6" aria-hidden="true">💬</Typography>
          </IconButton>
        </Tooltip>
        <Tooltip title="Chat on WhatsApp" placement="left">
      <IconButton
            aria-label="Open WhatsApp chat"
            component="a"
            href="https://wa.me/254741106404?text=Hello%20Solvo%20Tours!%20I%20have%20a%20question."
            target="_blank"
            rel="noopener noreferrer"
        sx={{
          width: 56,
          height: 56,
          borderRadius: '50%',
              background: '#25D366',
          color: 'white',
              boxShadow: 4,
              '&:hover, &:focus': {
                background: '#1ebe57',
                transform: 'scale(1.08)',
                outline: '2px solid #FFA000',
                outlineOffset: 2,
              },
              transition: 'transform 0.2s, background 0.2s',
            }}
          >
            <WhatsAppIcon sx={{ fontSize: 32 }} aria-hidden="true" />
      </IconButton>
        </Tooltip>
      </Box>
      <style>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(0,51,102,0.7); }
          70% { box-shadow: 0 0 0 16px rgba(0,51,102,0); }
          100% { box-shadow: 0 0 0 0 rgba(0,51,102,0); }
        }
        .chatbot-bg {
          background-image: url('/images/chatbot-bg-pattern.png');
          background-size: cover;
          background-repeat: repeat;
        }
        @media (max-width: 600px) {
          .MuiIconButton-root[aria-label="Open chatbot"],
          .MuiIconButton-root[aria-label="Open WhatsApp chat"] {
            width: 44px !important;
            height: 44px !important;
          }
          .MuiBox-root[style*='position: fixed'][style*='bottom: 32px'] {
            bottom: 12px !important;
            right: 12px !important;
            gap: 8px !important;
          }
        }
      `}</style>

      {/* Chatbot Interface */}
      {isOpen && !minimized && (
        <Box
          role="dialog"
          aria-label="Chatbot window"
          tabIndex={-1}
          sx={{ outline: 'none' }}
          ref={chatWindowRef}
          sx={{
            position: 'fixed',
            bottom: windowPos.bottom,
            right: windowPos.right,
            width: 430,
            maxWidth: '98vw',
            height: 620,
            maxHeight: '98vh',
            bgcolor: themeMode === 'dark' ? '#222' : 'background.paper',
            borderRadius: 4,
            boxShadow: 8,
            zIndex: 1400,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            border: '2px solid #1976d2',
            transition: 'background 0.3s',
          }}
        >
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1.5, bgcolor: '#003366', borderBottom: '2px solid #1976d2', minHeight: 52 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar src={botAvatar} sx={{ width: 34, height: 34, bgcolor: '#fff', border: '2px solid #1976d2' }} />
              <Typography variant="h6" sx={{ color: '#fff', fontWeight: 800, letterSpacing: 0.5 }}>Chat with us</Typography>
            </Box>
            <IconButton size="small" onClick={() => setIsOpen(false)} sx={{ color: '#fff' }} aria-label="Close chatbot"><CloseIcon /></IconButton>
          </Box>

          {/* Messages Area */}
          <Box sx={{ flex: 1, p: 2, overflowY: 'auto', background: themeMode === 'dark' ? '#222' : '#f7fafd', display: 'flex', flexDirection: 'column', gap: 1 }}>
            {messages.map((msg, idx) => (
              <Box key={idx} sx={{ display: 'flex', mb: 0.5, flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-end' }}>
                {msg.sender === 'bot' && <Avatar src={botAvatar} sx={{ mr: 1, width: 28, height: 28 }} />}
                <Box
                  sx={{
                    bgcolor: msg.sender === 'user' ? '#1976d2' : '#fff',
                    color: msg.sender === 'user' ? '#fff' : '#222',
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    maxWidth: '70%',
                    boxShadow: 2,
                    position: 'relative',
                    animation: 'bubbleIn 0.4s',
                    fontSize: 15,
                  }}
                >
                  {msg.fileType === 'image' && (
                    <img src={msg.file} alt={msg.text} style={{ maxWidth: 120, borderRadius: 8, marginBottom: 4 }} />
                  )}
                  {msg.fileType === 'file' && (
                    <a href={msg.file} download={msg.text} style={{ color: '#1976d2' }}>{msg.text}</a>
                  )}
                  {msg.fileType === 'audio' && (
                    <audio controls src={msg.audio} style={{ width: '100%' }} />
                  )}
                  {!msg.fileType && msg.text}
                </Box>
                {msg.sender === 'user' && <Avatar sx={{ ml: 1, width: 28, height: 28, bgcolor: grey[400] }}>U</Avatar>}
              </Box>
            ))}
            {botTyping && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Avatar src={botAvatar} sx={{ mr: 1, width: 28, height: 28 }} />
                <Box sx={{ bgcolor: '#fff', color: '#222', px: 2, py: 1, borderRadius: 2, boxShadow: 2, fontStyle: 'italic' }}>
                  Typing...
                </Box>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Email Step or Chat Input Row */}
            {!emailSubmitted ? (
            <Box sx={{ p: 2, borderTop: '1px solid #eee', bgcolor: themeMode === 'dark' ? '#232a3a' : '#fff', display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email to start"
                size="medium"
                sx={{ flex: 1, mx: 1, bgcolor: '#f7fafd', borderRadius: 2, fontSize: 18 }}
                inputProps={{ style: { fontSize: 18, padding: '14px 12px' } }}
                error={emailError}
                helperText={emailError ? 'Please enter a valid email address.' : ''}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleSend(); } }}
                aria-label="Email input field"
              />
              <Button variant="contained" onClick={handleSend} aria-label="Start chat" sx={{ minWidth: 64, fontWeight: 700, fontSize: 16 }}>Start</Button>
            </Box>
          ) : (
            <Box sx={{ p: 2, borderTop: '1px solid #eee', bgcolor: themeMode === 'dark' ? '#232a3a' : '#fff', display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton onClick={() => setShowEmojiPicker((v) => !v)} aria-label="Open emoji picker"><EmojiEmotionsIcon /></IconButton>
              {showEmojiPicker && (
                <Box sx={{ position: 'absolute', bottom: 120, right: 80, zIndex: 2000 }}>
                  <Picker onEmojiClick={handleEmojiClick} disableAutoFocus native />
                </Box>
              )}
              <IconButton component="label" aria-label="Attach file"><AttachFileIcon /></IconButton>
              <input type="file" hidden onChange={handleAttachment} />
              <IconButton onClick={handleVoiceInput} aria-label="Start voice input"><MicIcon /></IconButton>
              <TextField
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder={translations[language].typeMessage}
                size="medium"
                sx={{ flex: 1, mx: 1, bgcolor: '#f7fafd', borderRadius: 2, fontSize: 18 }}
                inputProps={{ style: { fontSize: 18, padding: '14px 12px' } }}
                aria-label="Chat input field"
              />
              <Button variant="contained" onClick={handleSend} aria-label="Send message" sx={{ minWidth: 64, fontWeight: 700, fontSize: 16 }}>{translations[language].send}</Button>
            </Box>
          )}

          {/* Minimal Selectors Row */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1, bgcolor: themeMode === 'dark' ? '#232a3a' : '#fff' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                select
                value={language}
                onChange={e => setLanguage(e.target.value)}
                size="small"
                SelectProps={{ native: true }}
                sx={{ minWidth: 90, bgcolor: '#f7fafd', borderRadius: 2 }}
                aria-label="Select language"
              >
                <option value="en">English</option>
                <option value="sw">Swahili</option>
                <option value="fr">French</option>
              </TextField>
              <TextField
                select
                value={personality}
                onChange={e => setPersonality(e.target.value)}
                size="small"
                SelectProps={{ native: true }}
                sx={{ minWidth: 110, bgcolor: '#f7fafd', borderRadius: 2 }}
                aria-label="Select personality"
              >
                <option value="friendly">Friendly</option>
                <option value="adventurous">Adventurous</option>
                <option value="formal">Formal</option>
              </TextField>
            </Box>
            <Button size="small" onClick={() => setThemeMode(themeMode === 'light' ? 'dark' : 'light')} aria-label="Toggle theme" sx={{ fontWeight: 600, color: '#1976d2', textTransform: 'none' }}>{themeMode === 'light' ? 'Dark Mode' : 'Light Mode'}</Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Chatbot;
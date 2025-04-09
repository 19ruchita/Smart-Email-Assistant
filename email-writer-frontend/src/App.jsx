import { useState } from 'react'
import './App.css'
import { Box, Button, CircularProgress, Container, FormControl, Input, InputLabel, MenuItem, Select, TextField, Typography, Paper } from '@mui/material';
import axios from 'axios';
import { ThemeProvider } from './context/ThemeContext';
import { useTheme } from './context/ThemeContext';

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();
  
  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 p-2 rounded-full"
      style={{
        backgroundColor: isDark ? '#374151' : '#f3f4f6',
        color: isDark ? '#f3f4f6' : '#1f2937',
      }}
    >
      {isDark ? '🌞' : '🌙'}
    </button>
  );
};

function App() {
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post("https://auto-compose.onrender.com/api/email/generate", {
        emailContent,
        tone 
      });
      setGeneratedReply(typeof response.data === 'string' ? response.data : JSON.stringify(response.data));
    } catch (error) {
      setError('Failed to generate email reply. Please try again');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{py:4}}>
      <Typography variant='h3' component="h1" gutterBottom>
        Email Reply Generator
      </Typography>

      <Box sx={{ mx: 3 }}>
        <TextField 
          fullWidth
          multiline
          rows={6}
          variant='outlined'
          label="Original Email Content"
          value={emailContent || ''}
          onChange={(e) => setEmailContent(e.target.value)}
          sx={{ mb:2 }}/>

          <FormControl fullWidth sx={{ mb:2 }}>
            <InputLabel>Tone (Optional)</InputLabel>
            <Select
              value={tone || ''}
              label={"Tone (Optional)"}
              onChange={(e) => setTone(e.target.value)}>
                <MenuItem value="">None</MenuItem>
                <MenuItem value="professional">Professional</MenuItem> 
                <MenuItem value="casual">Casual</MenuItem>
                <MenuItem value="friendly">Friendly</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant='contained'
            onClick={handleSubmit}
            disabled={!emailContent || loading}
            fullWidth>
            {loading ? <CircularProgress size={24}/> : "Generate Reply"}
          </Button>
      </Box>

      {error && (
        <Typography color='error' sx={{ mb:2 }}>
          {error}
        </Typography>
      )}

      <Box sx={{ mt: 4 }}>
        <Typography variant='h6' gutterBottom sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Live Preview
          {generatedReply && (
            <Button
              variant='outlined'
              size="small"
              onClick={() => navigator.clipboard.writeText(generatedReply)}>
              Copy to Clipboard
            </Button>
          )}
        </Typography>
        
        <Paper 
          elevation={3} 
          sx={{ 
            p: 3,
            backgroundColor: '#fff',
            borderRadius: 2,
            minHeight: '200px',
            display: 'flex',
            alignItems: loading ? 'center' : 'flex-start',
            justifyContent: loading ? 'center' : 'flex-start',
            '& pre': {
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
              margin: 0,
              fontFamily: 'inherit',
              fontSize: '1rem',
              width: '100%'
            }
          }}
        >
          {loading ? (
            <CircularProgress />
          ) : generatedReply ? (
            <pre>{generatedReply}</pre>
          ) : (
            <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>
              Your generated reply will appear here...
            </Typography>
          )}
        </Paper>
      </Box>
    </Container>
  )
}

export default App
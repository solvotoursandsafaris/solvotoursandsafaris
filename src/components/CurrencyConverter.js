import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Select, MenuItem, Button, InputLabel, FormControl, Paper } from '@mui/material';

const API_BASE = 'https://api.exchangerate.host';

const CurrencyConverter = ({ compact = false }) => {
  const [currencies, setCurrencies] = useState([]);
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('KES');
  const [amount, setAmount] = useState(1);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/symbols`)
      .then(res => res.json())
      .then(data => setCurrencies(Object.keys(data.symbols)))
      .catch(() => setCurrencies(['USD', 'KES', 'EUR', 'GBP']));
  }, []);

  const handleConvert = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/convert?from=${from}&to=${to}&amount=${amount}`);
      const data = await res.json();
      if (typeof data.result === 'number' && !isNaN(data.result)) {
        setResult(data.result);
      } else {
        setError('Conversion failed. Please try again.');
      }
    } catch {
      setError('Network error. Please try again.');
    }
    setLoading(false);
  };

  return (
    <Paper elevation={compact ? 1 : 3} sx={{
      p: compact ? 1 : 3,
      maxWidth: compact ? 320 : 400,
      mx: 'auto',
      mb: compact ? 0 : 4,
      backgroundColor: compact ? 'rgba(255,255,255,0.1)' : 'background.paper',
      boxShadow: compact ? 0 : undefined,
    }}>
      <Typography variant={compact ? 'subtitle2' : 'h6'} gutterBottom align="center" sx={{ fontSize: compact ? '1rem' : undefined }}>
        Currency Converter
      </Typography>
      <Box
        component="form"
        onSubmit={handleConvert}
        sx={{
          display: 'flex',
          flexDirection: compact ? 'row' : 'column',
          gap: compact ? 1 : 2,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <TextField
          label="Amount"
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          inputProps={{ min: 0, step: 'any', style: { fontSize: compact ? 12 : undefined, width: compact ? 60 : undefined } }}
          size={compact ? 'small' : 'medium'}
          required
          sx={{ width: compact ? 70 : '100%' }}
        />
        <FormControl fullWidth={!compact} sx={{ minWidth: compact ? 70 : undefined }} size={compact ? 'small' : 'medium'}>
          <InputLabel>From</InputLabel>
          <Select value={from} label="From" onChange={e => setFrom(e.target.value)}>
            {currencies.map(cur => (
              <MenuItem key={cur} value={cur}>{cur}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth={!compact} sx={{ minWidth: compact ? 70 : undefined }} size={compact ? 'small' : 'medium'}>
          <InputLabel>To</InputLabel>
          <Select value={to} label="To" onChange={e => setTo(e.target.value)}>
            {currencies.map(cur => (
              <MenuItem key={cur} value={cur}>{cur}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button type="submit" variant="contained" disabled={loading} size={compact ? 'small' : 'medium'} sx={{ minWidth: compact ? 80 : undefined }}>
          {loading ? '...' : 'Convert'}
        </Button>
      </Box>
      {error && (
        <Typography variant="caption" color="error" align="center" sx={{ mt: 1, display: 'block' }}>
          {error}
        </Typography>
      )}
      {result !== null && !loading && !error && (
        <Typography variant="caption" align="center" sx={{ mt: 1, fontSize: compact ? '0.9rem' : undefined, display: 'block' }}>
          {amount} {from} = {result} {to}
        </Typography>
      )}
    </Paper>
  );
};

export default CurrencyConverter; 
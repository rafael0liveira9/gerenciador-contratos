const express = require('express');
const cors = require('cors');
const clauseRoutes = require('./routes/clauses');
const contractRoutes = require('./routes/contracts');
const contractBlockRoutes = require('./routes/contractBlocks');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/clauses', clauseRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/contract-blocks', contractBlockRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

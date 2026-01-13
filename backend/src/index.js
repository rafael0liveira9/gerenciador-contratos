const express = require('express');
const cors = require('cors');
const empresasRoutes = require('./routes/empresas');
const clausulasRoutes = require('./routes/clausulas');
const cabecalhosRoutes = require('./routes/cabecalhos');
const rodapesRoutes = require('./routes/rodapes');
const templatesRoutes = require('./routes/templates');
const paginasRoutes = require('./routes/paginas');
const blocosRoutes = require('./routes/blocos');
const contratosRoutes = require('./routes/contratos');
const variaveisRoutes = require('./routes/variaveis');
const responsaveisRoutes = require('./routes/responsaveis');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/empresas', empresasRoutes);
app.use('/api/clausulas', clausulasRoutes);
app.use('/api/cabecalhos', cabecalhosRoutes);
app.use('/api/rodapes', rodapesRoutes);
app.use('/api/templates', templatesRoutes);
app.use('/api/paginas', paginasRoutes);
app.use('/api/blocos', blocosRoutes);
app.use('/api/contratos', contratosRoutes);
app.use('/api/variaveis', variaveisRoutes);
app.use('/api/responsaveis', responsaveisRoutes);

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

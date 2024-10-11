const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Conecte ao MongoDB
mongoose.connect('mongodb://localhost/simon_game', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Defina um schema para os usuários
const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    scoreHistory: [{ score: Number, date: Date }]
});

const User = mongoose.model('User', UserSchema);

// Rota para cadastrar um novo usuário
app.post('/register', async (req, res) => {
    const { username, email } = req.body;
    const newUser = new User({ username, email, scoreHistory: [] });
    await newUser.save();
    res.json(newUser);
});

// Rota para salvar a pontuação
app.post('/save-score', async (req, res) => {
    const { username, score } = req.body;
    const user = await User.findOne({ username });
    if (user) {
        user.scoreHistory.push({ score, date: new Date() });
        await user.save();
        res.json(user);
    } else {
        res.status(404).json({ message: 'Usuário não encontrado' });
    }
});

// Rota para obter o ranking
app.get('/ranking', async (req, res) => {
    const users = await User.find().sort({ 'scoreHistory.score': -1 });
    res.json(users);
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});

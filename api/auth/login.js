const pool = require('../../db');

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }
    if (req.method !== 'POST') {
        return res.status(405).json({ detail: 'Method not allowed' });
    }

    try {
        const { username, password } = req.body;
        const result = await pool.query(
            'SELECT * FROM usuarios WHERE nome = $1 AND senha = $2 AND ativo = true',
            [username, password]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ detail: 'Usuário ou senha inválidos' });
        }

        const user = result.rows[0];
        let userModules = [];
        try {
            userModules = user.modules ? JSON.parse(user.modules) : [];
        } catch { userModules = []; }

        if (user.role === 'publi' && userModules.length === 0) {
            userModules = ['dashboard', 'producao-cientifica'];
        }

        return res.status(200).json({
            id: user.id,
            username: user.nome,
            nome_completo: user.nome,
            role: user.role || 'admin',
            can_edit_db: user.role === 'admin',
            modules: user.role === 'admin' ? [] : userModules
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ detail: 'Erro interno no servidor' });
    }
};

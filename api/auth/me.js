const pool = require('../../db');

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-User-Id');

    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }
    if (req.method !== 'GET') {
        return res.status(405).json({ detail: 'Method not allowed' });
    }

    const userId = req.query.id || req.headers['x-user-id'];

    if (!userId) {
        return res.status(401).json({ detail: 'Não autenticado' });
    }

    try {
        const result = await pool.query('SELECT * FROM usuarios WHERE id = $1 AND ativo = true', [userId]);
        if (result.rows.length > 0) {
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
        }
    } catch (err) {
        console.error(err);
    }

    return res.status(401).json({ detail: 'Não autenticado' });
};

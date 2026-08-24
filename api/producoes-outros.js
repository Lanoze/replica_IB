const pool = require('../db');

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(204).end();

    const { id } = req.query;

    if (req.method === 'GET') {
        try {
            if (id) {
                const result = await pool.query('SELECT * FROM producoes_outros WHERE id = $1', [id]);
                if (result.rows.length === 0) return res.status(404).json({ detail: 'Não encontrado' });
                return res.status(200).json(result.rows[0]);
            }
            const { ano, natureza } = req.query;
            let query = 'SELECT * FROM producoes_outros WHERE 1=1';
            let params = [];
            let i = 1;
            if (ano) { query += ` AND ano = $${i++}`; params.push(parseInt(ano)); }
            if (natureza) { query += ` AND LOWER(natureza) = LOWER($${i++})`; params.push(natureza); }
            query += ' ORDER BY id DESC';
            const result = await pool.query(query, params);
            return res.status(200).json(result.rows);
        } catch {
            return res.status(500).json({ detail: 'Erro ao buscar' });
        }
    }

    if (req.method === 'POST') {
        try {
            const d = req.body;
            const ano = parseInt(d.ano, 10);
            const result = await pool.query(
                `INSERT INTO producoes_outros (titulo,descricao,natureza,autores,instituicao,projeto,conformidade_ib,ano)
                 VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
                [String(d.titulo).trim(), d.descricao ? String(d.descricao).trim() : '',
                 String(d.natureza).trim(), String(d.autores).trim(),
                 String(d.instituicao).trim(), String(d.projeto).trim(),
                 String(d.conformidade_ib).trim(),
                 isNaN(ano) ? new Date().getFullYear() : ano]
            );
            return res.status(201).json(result.rows[0]);
        } catch {
            return res.status(400).json({ detail: 'Erro ao criar' });
        }
    }

    if (req.method === 'PUT' && id) {
        try {
            const d = req.body;
            const ano = parseInt(d.ano, 10);
            const result = await pool.query(
                `UPDATE producoes_outros SET titulo=$1,descricao=$2,natureza=$3,autores=$4,instituicao=$5,projeto=$6,conformidade_ib=$7,ano=$8
                 WHERE id=$9 RETURNING *`,
                [String(d.titulo).trim(), d.descricao ? String(d.descricao).trim() : '',
                 String(d.natureza).trim(), String(d.autores).trim(),
                 String(d.instituicao).trim(), String(d.projeto).trim(),
                 String(d.conformidade_ib).trim(),
                 isNaN(ano) ? new Date().getFullYear() : ano, id]
            );
            if (result.rows.length === 0) return res.status(404).json({ detail: 'Não encontrado' });
            return res.status(200).json(result.rows[0]);
        } catch {
            return res.status(400).json({ detail: 'Erro ao atualizar' });
        }
    }

    if (req.method === 'DELETE' && id) {
        try {
            const result = await pool.query('DELETE FROM producoes_outros WHERE id=$1 RETURNING *', [id]);
            if (result.rows.length === 0) return res.status(404).json({ detail: 'Não encontrado' });
            return res.status(200).json({ success: true });
        } catch {
            return res.status(500).json({ detail: 'Erro ao deletar' });
        }
    }

    return res.status(405).json({ detail: 'Method not allowed' });
};

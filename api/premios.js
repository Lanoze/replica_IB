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
                const result = await pool.query('SELECT * FROM premios WHERE id = $1', [id]);
                if (result.rows.length === 0) return res.status(404).json({ detail: 'Não encontrado' });
                return res.status(200).json(result.rows[0]);
            }
            const { ano, natureza } = req.query;
            let query = 'SELECT * FROM premios WHERE 1=1';
            let params = [];
            let i = 1;
            if (ano) { query += ` AND EXTRACT(YEAR FROM data_concessao) = $${i++}`; params.push(parseInt(ano)); }
            if (natureza) { query += ` AND LOWER(natureza_area) = LOWER($${i++})`; params.push(natureza); }
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
            const result = await pool.query(
                `INSERT INTO premios (nome,trabalho,natureza_area,integrantes,instituicao,projeto,conformidade_ib,data_concessao)
                 VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
                [String(d.nome).trim(), d.trabalho ? String(d.trabalho).trim() : '',
                 String(d.natureza_area).trim(), String(d.integrantes).trim(),
                 String(d.instituicao).trim(), String(d.projeto).trim(),
                 String(d.conformidade_ib).trim(), String(d.data_concessao).trim()]
            );
            return res.status(201).json(result.rows[0]);
        } catch {
            return res.status(400).json({ detail: 'Erro ao criar' });
        }
    }

    if (req.method === 'PUT' && id) {
        try {
            const d = req.body;
            const result = await pool.query(
                `UPDATE premios SET nome=$1,trabalho=$2,natureza_area=$3,integrantes=$4,instituicao=$5,projeto=$6,conformidade_ib=$7,data_concessao=$8
                 WHERE id=$9 RETURNING *`,
                [String(d.nome).trim(), d.trabalho ? String(d.trabalho).trim() : '',
                 String(d.natureza_area).trim(), String(d.integrantes).trim(),
                 String(d.instituicao).trim(), String(d.projeto).trim(),
                 String(d.conformidade_ib).trim(), String(d.data_concessao).trim(), id]
            );
            if (result.rows.length === 0) return res.status(404).json({ detail: 'Não encontrado' });
            return res.status(200).json(result.rows[0]);
        } catch {
            return res.status(400).json({ detail: 'Erro ao atualizar' });
        }
    }

    if (req.method === 'DELETE' && id) {
        try {
            const result = await pool.query('DELETE FROM premios WHERE id=$1 RETURNING *', [id]);
            if (result.rows.length === 0) return res.status(404).json({ detail: 'Não encontrado' });
            return res.status(200).json({ success: true });
        } catch {
            return res.status(500).json({ detail: 'Erro ao deletar' });
        }
    }

    return res.status(405).json({ detail: 'Method not allowed' });
};

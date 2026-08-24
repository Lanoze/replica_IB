const pool = require('../db');

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    const { id } = req.query;

    // GET
    if (req.method === 'GET') {
        try {
            if (id) {
                const result = await pool.query('SELECT * FROM publicacoes WHERE id = $1', [id]);
                if (result.rows.length === 0) return res.status(404).json({ detail: 'Não encontrado' });
                return res.status(200).json(result.rows[0]);
            }
            const { ano, status } = req.query;
            let query = 'SELECT * FROM publicacoes WHERE 1=1';
            let params = [];
            let i = 1;
            if (ano) { query += ` AND ano = $${i++}`; params.push(parseInt(ano)); }
            if (status) { query += ` AND LOWER(status) = LOWER($${i++})`; params.push(status); }
            query += ' ORDER BY id DESC';
            const result = await pool.query(query, params);
            return res.status(200).json(result.rows);
        } catch {
            return res.status(500).json({ detail: 'Erro ao buscar publicações' });
        }
    }

    // POST
    if (req.method === 'POST') {
        try {
            const d = req.body;
            const ano = parseInt(d.ano, 10);
            const result = await pool.query(
                `INSERT INTO publicacoes (titulo, natureza, status, veiculo, projeto, conformidade_ib, ano)
                 VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
                [String(d.titulo).trim(), String(d.natureza).trim(), String(d.status).trim(),
                 String(d.veiculo).trim(), String(d.projeto).trim(), String(d.conformidade_ib).trim(),
                 isNaN(ano) ? new Date().getFullYear() : ano]
            );
            return res.status(201).json(result.rows[0]);
        } catch {
            return res.status(400).json({ detail: 'Erro ao criar publicação' });
        }
    }

    // PUT
    if (req.method === 'PUT' && id) {
        try {
            const d = req.body;
            const ano = parseInt(d.ano, 10);
            const result = await pool.query(
                `UPDATE publicacoes SET titulo=$1,natureza=$2,status=$3,veiculo=$4,projeto=$5,conformidade_ib=$6,ano=$7
                 WHERE id=$8 RETURNING *`,
                [String(d.titulo).trim(), String(d.natureza).trim(), String(d.status).trim(),
                 String(d.veiculo).trim(), String(d.projeto).trim(), String(d.conformidade_ib).trim(),
                 isNaN(ano) ? new Date().getFullYear() : ano, id]
            );
            if (result.rows.length === 0) return res.status(404).json({ detail: 'Não encontrado' });
            return res.status(200).json(result.rows[0]);
        } catch {
            return res.status(400).json({ detail: 'Erro ao atualizar' });
        }
    }

    // DELETE
    if (req.method === 'DELETE' && id) {
        try {
            const result = await pool.query('DELETE FROM publicacoes WHERE id=$1 RETURNING *', [id]);
            if (result.rows.length === 0) return res.status(404).json({ detail: 'Não encontrado' });
            return res.status(200).json({ success: true });
        } catch {
            return res.status(500).json({ detail: 'Erro ao deletar' });
        }
    }

    return res.status(405).json({ detail: 'Method not allowed' });
};

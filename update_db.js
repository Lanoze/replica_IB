const pool = require('./db');

async function run() {
    try {
        await pool.query("ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'admin';");
        await pool.query("ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS modules TEXT;");
        await pool.query("UPDATE usuarios SET role = 'admin' WHERE nome = 'admin' OR email LIKE '%admin%';");
        await pool.query("UPDATE usuarios SET role = 'publi' WHERE nome = 'lorenzo' OR nome LIKE '%lorenzo%';");
        console.log("Banco de dados atualizado com colunas de role com sucesso!");
    } catch (err) {
        console.error("Erro:", err);
    } finally {
        pool.end();
    }
}

run();

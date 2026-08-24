const pool = require('./db');

async function run() {
    try {
        // Lorenzo: Dashboard e Produção Científica
        await pool.query(
            "UPDATE usuarios SET role = 'publi', modules = $1 WHERE nome ILIKE '%lorenzo%';",
            [JSON.stringify(["dashboard", "producao-cientifica"])]
        );

        // Zé: Diretoria, Cadastro e Patrimônio
        await pool.query(
            "UPDATE usuarios SET ativo = true, role = 'publi', modules = $1 WHERE nome ILIKE '%ze%';",
            [JSON.stringify(["diretoria", "cadastro", "patrimonio"])]
        );

        console.log("Permissões de módulos atualizadas com sucesso!");
    } catch (err) {
        console.error("Erro:", err);
    } finally {
        pool.end();
    }
}

run();

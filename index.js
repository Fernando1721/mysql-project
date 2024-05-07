const express = require("express");
const mysql = require("mysql2");
require("dotenv").config();
const app = express();
app.use(express.json());

const { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE } = process.env;

const pool = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

app.get("/medicos", (req, res) => {
  

  pool.query("select * from tb_medico", (err, results, fields) => {
    // console.log(results)
    // console.log(fields)
    res.json(results);
  });
});

app.post("/medicos", (req, res) => {
  const crm = req.body.crm;
  const nome = req.body.nome;

  pool.query(
    "insert into tb_medico (crm, nome) values (?, ?);",
    [crm, nome],
    (err, results, fields) => {
      console.log(fields);
      console.log(err);
      res.json(results);
    }
  );
});

app.get("/pacientes", (req, res) => {
  pool.query("select * from tb_paciente", (err, results, fields) => {
    res.json(results);
  });
});

app.get("/consultas", (req, res) => {
  const sql = ` SELECT m.nome as nome_medico, c.data_hora, p.nome as nome_paciente FROM
                  tb_medico m, tb_consulta c, tb_paciente p WHERE m.crm = c.crm AND c.cpf = p.cpf
                  `
 pool.query(sql, (err, results, fields) => {
    res.json(results);
  });
});

app.listen(3000, () => console.log("Executando na porta 3000"));

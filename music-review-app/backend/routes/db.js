const { MongoClient, ServerApiVersion } = require('mongodb');

// Sua string de conexão para a base de dados 'musicrate'
const uri = "mongodb+srv://jcosta_dev:r2NgeBG4vnUiUqmz@cluster24778.gay4h.mongodb.net/musicrate?retryWrites=true&w=majority&appName=Cluster24778";

// Criação do cliente MongoDB
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Conecta ao cliente MongoDB e usa a base de dados 'musicrate'
    await client.connect();
    
    // Acessa a base de dados 'musicrate' e a coleção 'users'
    const db = client.db("musicrate");
    const collection = db.collection("users");  // Operando na coleção "users"

    // Aqui você pode realizar qualquer operação, como inserir um novo usuário
    const result = await collection.insertOne({
      name: "Exemplo Nome",
      email: "exemplo@dominio.com",
      password: "senhaCriptografada",
    });

    console.log("Usuário inserido com sucesso:", result);

    // Confirma a conexão
    await client.db().command({ ping: 1 });
    console.log("Pingado com sucesso. Conectado ao MongoDB!");
  } catch (err) {
    console.log("Erro:", err);
  } finally {
    // Garante que o cliente será fechado após a execução
    await client.close();
  }
}

run().catch(console.dir);

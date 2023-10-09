const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://apeprustandi:ApRi191099@webdev.7zh3ygg.mongodb.net/?retryWrites=true&w=majority";
const dbName = "Panwas";

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const database = client.db(dbName);
const aksesData = database.collection('userPws');

(async () => {
    const doc = { nama: "Apep Rustandi", jabatan: "Staf Divisi" };
    const result = await aksesData.insertOne(doc);
    console.log(`the _id: ${result.insertedId}`);
    client.close();
})();
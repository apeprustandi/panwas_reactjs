const express = require('express');
const fs = require('fs');
const app = express();
const generateDocument = require('./komponen/documentGenerator'); // Ganti dengan path yang sesuai

// View engine setup
app.use('/css', express.static(__dirname + '/src/css'));
app.set('view engine', 'ejs');

// Define your routes
app.get('/', (req, res) => {
    const fileku = fs.readFileSync('src/api/dataUser.json', 'utf-8')
    const dataUser = JSON.parse(fileku)
    res.render('index', { dataUser, title: 'Panwaslu Cibinong' })
});

app.get('/pengaduan', (req, res) => {
    const fileku = fs.readFileSync('src/api/pkdUser.json', 'utf-8')
    const dataUsers = JSON.parse(fileku)
    res.render('pengaduan', { dataUsers, title: 'Panwaslu Cibinong' })
});

app.get('/jadwal-piket', (req, res) => {
    const fileku = fs.readFileSync('src/api/jadwalPiket.json', 'utf-8')
    const jadwalPkt = JSON.parse(fileku)
    res.render('jadwal-piket', { jadwalPkt, title: 'Jadwal Piket' })
});

app.get('/absen', (req, res) => {
    const fileku = fs.readFileSync('src/api/dataUser.json', 'utf-8')
    const dataUser = JSON.parse(fileku)
    res.render('absen', { dataUser, title: 'Absen Piket' })
});

app.get('/data-absen', async (req, res) => {
    try {
        const fileku = fs.readFileSync('src/api/dataUser.json', 'utf-8')
        const dataUser = JSON.parse(fileku)
        const getDataAbsen = await fetch('https://script.google.com/macros/s/AKfycbzxHDQuvGqSSAPwOuOtvMzIXOwdbhFsDUTehsjD-mOucNJICrt1u8ee3Qkw-iEHWsJ4/exec');
        const dataAbsen = await getDataAbsen.json();
        res.render('data-absen', { dataUser, dataAbsen, title: 'Data Absen Piket' });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data');
    }
});

app.get('/buat-lhp', async (req, res) => {
    const fileku = fs.readFileSync('src/api/pkdUser.json', 'utf-8')
    const dataUsers = JSON.parse(fileku)
    res.render('buat-lhp', { dataUsers, title: 'Panwaslu Cibinong' })
});

app.get('/profil', async (req, res) => {
    const fileku = fs.readFileSync('src/api/panwascam.json', 'utf-8')
    const dataUser = JSON.parse(fileku);
    const dataKu = dataUser
    res.render('profil', { dataKu, title: 'Panwaslu Cibinong' })
});

app.get('/lhp-pkd', async (req, res) => {
    try {
        const fileku = fs.readFileSync('src/api/pkdUser.json', 'utf-8')
        const dataPkd = JSON.parse(fileku)
        const response = await fetch('https://script.google.com/macros/s/AKfycbynbL7MuIswAwuhcCBGn7K06cyRXWjX7mDGg0aLt7D7qYtoUirxu7-hP072G9U4FwSx/exec');
        const dataLHP = await response.json();
        res.render('lhp-pkd', { dataPkd, dataLHP, title: 'LHP PKD' });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data');
    }
});

app.get('/detail/:id', async (req, res) => {
    try {
        const idLap = req.params.id;
        const getLhpCetak = await fetch(`https://script.google.com/macros/s/AKfycbyiEQnpPIap0e8D__oGpy8O2BeVvKIR8qFTa3Xs-0HmGswr4WVeX7lv8wc67289GZou/exec?ID=${idLap}`);

        if (!getLhpCetak.ok) {
            throw new Error(`Failed to fetch data from Google Script. Status: ${getLhpCetak.status}`);
        }

        const lhpCetak = await getLhpCetak.json();
        generateDocument(lhpCetak)
            .then(() => {
                res.render('detail', { lhpCetak, title: 'Generated Document' });
            })
            .catch((error) => {
                console.error('Error generating document:', error);
                res.status(500).send('Error generating document');
            });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send(`Error fetching data: ${error.message}`);
    }
});



app.get('/download-document/:fileName', (req, res) => {
    const filePath = 'output.docx';
    const fileName = req.params.fileName;
    res.download(filePath, `LHP ${fileName}.docx`, (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error downloading document');
        } else {
            console.log('Document downloaded successfully');
        }
    });
});


app.use((req, res) => {
    res.status(404).send('<h1>404</h1>');
});

app.listen(process.env.PORT || 3000, () => {
    console.clear();
    console.log("Aplikasi Dijalankan");
});

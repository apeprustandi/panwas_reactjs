const fs = require('fs');
const Docxtemplater = require('docxtemplater');
const PizZip = require('pizzip');

const generateDocument = (lhpCetak) => {
    return new Promise((resolve, reject) => {
        const filePath = 'template.docx';
        fs.readFile(filePath, (err, content) => {
            if (err) {
                reject(err);
                return;
            }
            var zip = new PizZip(content);
            var doc = new Docxtemplater(zip, {
                paragraphLoop: true,
                linebreaks: true,
            });
            tanggal = lhpCetak.data['Waktu Dan Tempat Pengawasan'].split(' ')[1],
                bulan = lhpCetak.data['Waktu Dan Tempat Pengawasan'].split(' ')[2],
                tahun = lhpCetak.data['Waktu Dan Tempat Pengawasan'].split(' ')[3],
                doc.setData({
                    no_lhp: lhpCetak.data['Nomor LHP'],
                    pelaksana: lhpCetak.data['Pelaksana Tugas'],
                    tahapan: lhpCetak.data['Tahapan Yang Diawasi'],
                    jabatan: lhpCetak.data['Jabatan'],
                    surat_tugas: lhpCetak.data['Nomor Surat Tugas'],
                    bentuk: lhpCetak.data['Bentuk Pengawasan'],
                    tujuan: lhpCetak.data['Tujuan Pengawasan'],
                    sasaran: lhpCetak.data['Sasaran'],
                    waktu_tempat: lhpCetak.data['Waktu Dan Tempat Pengawasan'],
                    uraian_pengawasan: lhpCetak.data['Uraian Hasil Pengawasan'],
                    dokumentasi: lhpCetak.data['Dokumentasi Kegiatan'],
                    titimangsa: `${tanggal} ${bulan} ${tahun}`,
                });
            try {
                doc.render();
            } catch (error) {
                function replaceErrors(key, value) {
                    if (value instanceof Error) {
                        return Object.getOwnPropertyNames(value).reduce(function (
                            error,
                            key
                        ) {
                            error[key] = value[key];
                            return error;
                        }, {});
                    }
                    return value;
                }
                console.log(JSON.stringify({ error: error }, replaceErrors));

                if (error.properties && error.properties.errors instanceof Array) {
                    const errorMessages = error.properties.errors
                        .map(function (error) {
                            return error.properties.explanation;
                        })
                        .join('\n');
                    console.log('errorMessages', errorMessages);
                }
                throw error;
            }
            var out = doc.getZip().generate({
                type: 'nodebuffer', // Use nodebuffer to get a Buffer object
                mimeType:
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            });

            // Save the generated document using fs.writeFile
            fs.writeFile('output.docx', out, (writeErr) => {
                if (writeErr) {
                    reject(writeErr);
                } else {
                    resolve();
                }
            });
        });
    });
};

module.exports = generateDocument;

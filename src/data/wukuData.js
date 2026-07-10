// src/data/wukuData.js
//
// 30 Wuku dalam siklus Pawukon (210 hari = 30 wuku × 7 hari).
// Urutan tetap: Sinta → Watugunung, lalu kembali ke Sinta.
// Tiap wuku dilindungi oleh dewa tertentu dan membawa watak/energi khas.
//
// Anchor perhitungan: 7 September 2025 (Minggu Pahing) = hari pertama Wuku Sinta.
// Referensi: kalender Kementerian Agama RI.

export const WUKU_DATA = [
  {
    nama: 'Sinta',
    dewa: 'Bathara Yamadipati',
    watak: 'Berwibawa, pencemburu, hati tertutup namun bertanggung jawab.',
    deskripsi: 'Wuku pertama. Orangnya berwibawa dan disegani, namun cenderung menyimpan perasaan dan mudah cemburu. Kuat dalam memegang tanggung jawab.',
  },
  {
    nama: 'Landep',
    dewa: 'Bathara Mahadewa',
    watak: 'Tajam pikiran, cerdas, waspada, dan berhati bersih.',
    deskripsi: 'Landep berarti "tajam". Pemiliknya memiliki ketajaman pikir dan intuisi, cepat menangkap maksud orang lain, serta berhati suci.',
  },
  {
    nama: 'Wukir',
    dewa: 'Bathara Mahayekti',
    watak: 'Teguh bagai gunung, tinggi cita-cita, mudah tersinggung.',
    deskripsi: 'Wukir berarti "gunung". Berpendirian teguh dan bercita-cita tinggi, namun perasaannya halus dan mudah tersinggung.',
  },
  {
    nama: 'Kurantil',
    dewa: 'Bathara Langsur',
    watak: 'Gesit, tidak tenang, pemberani, mudah berubah pikiran.',
    deskripsi: 'Berwatak lincah dan penuh energi, tetapi kurang tenang dan cepat berubah keputusan. Pemberani dalam menghadapi tantangan.',
  },
  {
    nama: 'Tolu',
    dewa: 'Bathara Bayu',
    watak: 'Ramah, pandai bicara, berpendirian, kadang keras kepala.',
    deskripsi: 'Dilindungi Dewa Angin. Pandai berbicara dan mudah bergaul, memiliki pendirian kuat yang kadang berujung keras kepala.',
  },
  {
    nama: 'Gumbreg',
    dewa: 'Bathara Cakra',
    watak: 'Berpikir keras, teguh, penyayang, tanggap terhadap keadaan.',
    deskripsi: 'Memiliki kemauan keras dan pikiran yang tegas. Penyayang kepada keluarga dan tanggap membaca situasi.',
  },
  {
    nama: 'Warigalit',
    dewa: 'Bathara Asmara',
    watak: 'Menarik, penuh cinta, cemburu, mudah gelisah.',
    deskripsi: 'Dilindungi Dewa Cinta. Berparas dan berperangai menarik, penuh kasih, namun mudah gelisah dan cemburu.',
  },
  {
    nama: 'Warigagung',
    dewa: 'Bathara Maharesi',
    watak: 'Suka menolong, boros, berjiwa besar, mudah iba.',
    deskripsi: 'Berjiwa besar dan gemar menolong sesama, kadang sampai boros. Hatinya mudah iba melihat penderitaan orang lain.',
  },
  {
    nama: 'Julungwangi',
    dewa: 'Bathara Sambu',
    watak: 'Berbudi harum, disukai banyak orang, halus perasaan.',
    deskripsi: 'Julungwangi berarti "harum". Nama baiknya semerbak, disukai banyak orang, dan memiliki perasaan yang halus.',
  },
  {
    nama: 'Sungsang',
    dewa: 'Bathara Gana',
    watak: 'Pekerja keras, tegas, kadang berubah-ubah pendirian.',
    deskripsi: 'Dilindungi Bathara Gana (Ganesha). Ulet dan tegas dalam bekerja, meski kadang pendiriannya berubah-ubah.',
  },
  {
    nama: 'Galungan',
    dewa: 'Bathara Kamajaya',
    watak: 'Tegas, berani, menang dalam perselisihan, berwibawa.',
    deskripsi: 'Melambangkan kemenangan dharma atas adharma. Berwatak tegas, berani, dan sering unggul dalam perselisihan.',
  },
  {
    nama: 'Kuningan',
    dewa: 'Bathara Indra',
    watak: 'Bercita-cita tinggi, waspada, ingin dihormati, cekatan.',
    deskripsi: 'Dilindungi Raja Para Dewa. Berambisi tinggi dan cekatan, selalu waspada, dan ingin dihormati orang lain.',
  },
  {
    nama: 'Langkir',
    dewa: 'Bathara Kala',
    watak: 'Keras, pemberani, pemarah, sulit dinasehati.',
    deskripsi: 'Dilindungi Dewa Waktu/Kematian. Berwatak keras dan pemberani, namun mudah marah dan sulit menerima nasihat.',
  },
  {
    nama: 'Mandasiya',
    dewa: 'Bathara Brahma',
    watak: 'Berjiwa panas, teguh, tahan uji, penuh semangat.',
    deskripsi: 'Dilindungi Dewa Api. Bersemangat dan teguh, tahan menghadapi cobaan, meski jiwanya mudah membara.',
  },
  {
    nama: 'Julungpujut',
    dewa: 'Bathara Guritna',
    watak: 'Ambisius, tak mau kalah, gigih mengejar keinginan.',
    deskripsi: 'Berkeinginan kuat dan gigih, tidak mau kalah, dan pantang menyerah dalam mengejar cita-cita.',
  },
  {
    nama: 'Pahang',
    dewa: 'Bathara Tantra',
    watak: 'Setia, kuat lahir batin, licik bila terdesak.',
    deskripsi: 'Memiliki ketahanan lahir dan batin serta setia kawan, namun bisa menjadi licik bila merasa terdesak.',
  },
  {
    nama: 'Kuruwelut',
    dewa: 'Bathara Wisnu',
    watak: 'Bijaksana, halus budi, cerdas, penuh perhitungan.',
    deskripsi: 'Dilindungi Dewa Pemelihara. Bijaksana, cerdas, dan halus budi pekerti, selalu penuh perhitungan matang.',
  },
  {
    nama: 'Marakeh',
    dewa: 'Bathara Surya',
    watak: 'Berpindah-pindah, pekerja keras, hati mudah gundah.',
    deskripsi: 'Suka berpindah tempat dan pekerja keras, namun hatinya kerap gundah dan sulit merasa puas.',
  },
  {
    nama: 'Tambir',
    dewa: 'Bathara Siwa',
    watak: 'Berpenampilan tenang, berbeda lahir dan batin, ulet.',
    deskripsi: 'Dilindungi Dewa Pelebur. Tampak tenang di luar namun bergejolak di dalam; ulet dan pantang menyerah.',
  },
  {
    nama: 'Medangkungan',
    dewa: 'Bathara Basuki',
    watak: 'Rendah hati, suka menolong, kadang ceroboh.',
    deskripsi: 'Berhati rendah dan gemar menolong sesama, disukai lingkungan, meski kadang bertindak kurang hati-hati.',
  },
  {
    nama: 'Maktal',
    dewa: 'Bathara Sakri',
    watak: 'Teguh, mandiri, cekatan, pandai memikat hati.',
    deskripsi: 'Berpendirian teguh dan mandiri, cekatan dalam bekerja, serta pandai mengambil hati orang lain.',
  },
  {
    nama: 'Wuye',
    dewa: 'Bathara Kwera',
    watak: 'Mudah berubah, pandai bergaul, penuh siasat.',
    deskripsi: 'Pandai bergaul dan luwes, penuh siasat, namun pendirian dan suasana hatinya mudah berubah.',
  },
  {
    nama: 'Manahil',
    dewa: 'Bathara Cakra',
    watak: 'Waspada, pandai bicara, teguh, kadang ragu.',
    deskripsi: 'Selalu waspada dan pandai berbicara, berpendirian teguh, meski kadang dilanda keraguan.',
  },
  {
    nama: 'Prangbakat',
    dewa: 'Bathara Bisma',
    watak: 'Tegas, terampil, bertanggung jawab, mudah tersinggung.',
    deskripsi: 'Terampil dan bertanggung jawab dalam tugas, tegas mengambil sikap, namun perasaannya mudah tersinggung.',
  },
  {
    nama: 'Bala',
    dewa: 'Bathari Durga',
    watak: 'Keras hati, pemberani, teguh, sulit dikendalikan.',
    deskripsi: 'Dilindungi Bathari Durga. Berkemauan keras dan pemberani, teguh pendirian, namun sulit dikendalikan.',
  },
  {
    nama: 'Wugu',
    dewa: 'Bathara Singajanma',
    watak: 'Pandai, welas asih, pandai menyimpan rahasia.',
    deskripsi: 'Cerdas dan penuh welas asih, dapat dipercaya, serta pandai menjaga rahasia orang lain.',
  },
  {
    nama: 'Wayang',
    dewa: 'Bathari Sri',
    watak: 'Berbudi luhur, penuh kasih, pengayom, berwibawa.',
    deskripsi: 'Dilindungi Dewi Kemakmuran. Berbudi luhur dan penuh kasih, menjadi pengayom, serta berwibawa.',
  },
  {
    nama: 'Kulawu',
    dewa: 'Bathara Sadana',
    watak: 'Berpikir luas, tabah, teguh, kadang tinggi hati.',
    deskripsi: 'Berwawasan luas dan tabah menghadapi hidup, teguh pendirian, meski kadang bersikap tinggi hati.',
  },
  {
    nama: 'Dukut',
    dewa: 'Bathara Sakri',
    watak: 'Setia, teguh, pemberani, mudah tersinggung.',
    deskripsi: 'Setia dan teguh pada prinsip, pemberani dalam bertindak, namun perasaannya mudah terluka.',
  },
  {
    nama: 'Watugunung',
    dewa: 'Bathara Anantaboga',
    watak: 'Berwibawa, pandai, penuh kasih, akhir perjalanan.',
    deskripsi: 'Wuku terakhir, lambang penutup siklus. Berwibawa dan cerdas, penuh kasih, serta dihormati banyak orang.',
  },
];

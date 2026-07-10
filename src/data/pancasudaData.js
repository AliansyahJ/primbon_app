// src/data/pancasudaData.js
//
// Pancasuda — ramalan nasib & watak berdasarkan jumlah neptu weton.
// Salah satu sistem horoskop Jawa untuk menilai "bibit-bebet-bobot" seseorang.
// 7 kategori, dihitung dari total neptu (neptu dina + neptu pasaran).
// Panduan tradisi primbon Jawa, bukan kepastian.

export const PANCASUDA_INFO = [
  {
    nama: 'Wasesa Segara',
    ikon: '🌊',
    makna: 'Kekuasaan samudra',
    watak: 'Berjiwa luas bagai lautan, pemaaf, sabar, dan berwibawa. Mampu menampung segala persoalan tanpa mudah goyah. Disegani karena kebesaran hatinya.',
    nasib: 'Hidupnya cenderung mulia dan dihormati. Rezeki datang dari kewibawaan dan kepercayaan orang banyak.',
    saran: 'Jaga kebesaran hati dan jangan sampai kesombongan menutupi kearifan.',
    baik: true,
  },
  {
    nama: 'Tunggak Semi',
    ikon: '🌱',
    makna: 'Tunggul yang bertunas',
    watak: 'Ulet dan penuh daya hidup. Seperti tunggul pohon yang selalu bertunas kembali, tak pernah benar-benar habis meski berkali-kali jatuh.',
    nasib: 'Rezekinya selalu tumbuh kembali. Meski sempat kekurangan, selalu ada jalan pulih dan bangkit.',
    saran: 'Jangan mudah putus asa — sifat pantang menyerah adalah keberuntungan terbesarmu.',
    baik: true,
  },
  {
    nama: 'Satria Wibawa',
    ikon: '👑',
    makna: 'Ksatria berwibawa',
    watak: 'Berwibawa, mulia, dan berbudi luhur. Memiliki aura kepemimpinan alami dan dihormati di lingkungannya. Teguh memegang prinsip.',
    nasib: 'Cenderung memperoleh kemuliaan, kehormatan, dan kedudukan. Jalan hidupnya terang oleh nama baik.',
    saran: 'Gunakan wibawa untuk mengayomi, bukan menekan orang lain.',
    baik: true,
  },
  {
    nama: 'Sumur Sinaba',
    ikon: '⛲',
    makna: 'Sumur tempat menimba',
    watak: 'Berilmu dan bijaksana, menjadi tempat orang lain menimba pengetahuan dan nasihat. Dermawan membagi ilmu, dituakan meski usia muda.',
    nasib: 'Menjadi rujukan dan panutan. Rezeki mengalir dari ilmu, wawasan, dan jasa kepada sesama.',
    saran: 'Terus berbagi ilmu dengan ikhlas; di situlah letak keberkahanmu.',
    baik: true,
  },
  {
    nama: 'Satria Wirang',
    ikon: '⚔️',
    makna: 'Ksatria menanggung malu',
    watak: 'Berjiwa ksatria namun kerap menghadapi ujian yang mempermalukan. Sensitif terhadap harga diri dan mudah terluka oleh cela.',
    nasib: 'Sering menghadapi rintangan dan rasa malu. Dalam tradisi, dianjurkan ruwatan/sedekah untuk menolak sial.',
    saran: 'Perbanyak sedekah dan sabar; ujian adalah jalan menempa jiwa menjadi tangguh.',
    baik: false,
  },
  {
    nama: 'Bumi Kapetak',
    ikon: '⛰️',
    makna: 'Bumi terpendam',
    watak: 'Pekerja keras, tahan derita, dan kuat memikul beban. Namun sering memendam perasaan sendiri dan kurang pandai menunjukkan jasanya.',
    nasib: 'Berhasil lewat kerja keras, tetapi sering kurang dihargai. Cocok pada bidang yang menuntut ketekunan.',
    saran: 'Belajar terbuka dan menghargai diri sendiri; jasamu layak diakui.',
    baik: false,
  },
  {
    nama: 'Lebu Katiup Angin',
    ikon: '💨',
    makna: 'Debu tertiup angin',
    watak: 'Bercita-cita tinggi namun mudah goyah dan terombang-ambing keadaan. Kurang teguh pendirian sehingga rencana sering berubah arah.',
    nasib: 'Rezeki sulit terkumpul dan cita-cita kerap tertunda. Perlu keteguhan dan fokus untuk mengubah nasib.',
    saran: 'Tetapkan satu tujuan dan tekuni; keteguhan adalah kunci mengubah nasibmu.',
    baik: false,
  },
];

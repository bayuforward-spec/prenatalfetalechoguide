/*
 * content.js — Mesin konten The Quran Lens.
 *
 * Skema baku per ayat (6 lapisan + sorotan visual):
 *   teks         : arab + latin + arti
 *   asbabunNuzul : sebab/latar turunnya ayat (jujur bila tak ada riwayat khusus)
 *   tafsir       : makna ringkas
 *   hikmah       : pelajaran/ibrah (DIPERDALAM)
 *   linguistik   : keajaiban bahasa i'jaz/balaghah (DIPERDALAM)  ← pembeda utama
 *   sorotan      : visual besar "kenapa kata/huruf ini, bukan yang lain?"
 *                  { dipilih, lain|null, labelDipilih, labelLain, hikmah }
 *   amalan       : ARRAY poin-poin penerapan keseharian
 *   sumber       : rujukan tafsir
 *
 * Urutan array = tertib mushaf. `gratis:true` membuka semua lapisan tanpa Premium.
 */
const AYAT = [
  /* ============ SURAH AL-FĀTIḤAH (1) ============ */
  {
    id: 'al-fatihah-1', surah: 'Al-Fātiḥah', surahNo: 1, ayatNo: '1', juz: 1,
    tema: ['Pembuka', 'Rahmat', 'Nama Allah'], gratis: true,
    arab: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    latin: 'Bismillāhir-raḥmānir-raḥīm.',
    arti: 'Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang.',
    asbabunNuzul:
      'Tidak ada asbabun nuzul khusus untuk basmalah. Al-Fatihah dikenal sebagai "Ummul Kitab" (induk Al-Qur’an) dan "As-Sab‘ul Maṡāni" (tujuh ayat yang diulang), dibaca pada setiap rakaat salat. Basmalah menjadi pembuka hampir seluruh surah, mengajarkan memulai segala sesuatu dengan nama Allah.',
    tafsir:
      'Memulai dengan menyebut nama Allah, memohon pertolongan dan keberkahan-Nya, sekaligus menegaskan bahwa segala aktivitas dilakukan karena dan dengan-Nya. Dua sifat rahmat disebut sejak kata pertama untuk menanamkan harap kepada kasih sayang Allah.',
    hikmah:
      'Hidup yang diawali "Bismillah" adalah hidup yang disandarkan pada Allah, bukan pada kekuatan diri — ini melahirkan ketenangan sekaligus keberkahan. Lebih dalam lagi, basmalah mendidik niat: pekerjaan sekecil apa pun bisa bernilai ibadah bila dimulai karena Allah, dan otomatis kita terhalang dari memulai hal yang kita malu menyebut nama-Nya di atasnya. Maka basmalah bukan sekadar ucapan pembuka, tapi saringan moral dan penanam ketergantungan kepada Allah dalam tiap langkah.',
    linguistik:
      'Allah memilih dua nama dari satu akar yang sama (raḥmah) namun beda pola, dan ini disengaja. «Ar-Raḥmān» berpola «فَعْلَان» (fa‘lān) yang dalam bahasa Arab menunjukkan keluasan, kepenuhan, dan kuantitas yang memuncak — maka ia adalah rahmat yang MELIPUTI seluruh makhluk (mukmin & kafir) di dunia. «Ar-Raḥīm» berpola «فَعِيل» (fa‘īl) yang menunjukkan sifat melekat & berkesinambungan — maka ia rahmat yang TERUS-MENERUS, khusus bagi orang beriman, terutama di akhirat. Bila hanya disebut "Rahman", seakan rahmat itu luas tapi tak menjamin kelanjutan; bila hanya "Rahim", seakan terus-menerus tapi tak tergambar keluasannya. Disandingkan, keduanya merangkum rahmat Allah yang luas (ruang) sekaligus kekal (waktu) — kesempurnaan yang mustahil diwakili satu kata.',
    sorotan: {
      dipilih: 'الرَّحْمَٰن', labelDipilih: 'Pola فَعْلَان — luas memenuhi',
      lain: 'الرَّحِيم', labelLain: 'Pola فَعِيل — terus-menerus',
      hikmah: 'Bukan dipilih salah satu, tapi keduanya disandingkan: «Rahmān» melukiskan rahmat yang LUAS meliputi semua makhluk, «Raḥīm» melukiskan rahmat yang KEKAL bagi mukmin. Satu mencakup ruang, satu mencakup waktu.',
    },
    amalan: [
      'Ucapkan "Bismillah" sebelum makan, masuk rumah, bekerja, dan menyalakan kendaraan.',
      'Sebelum memulai tugas berat, mulai dengan basmalah agar hati lebih ringan dan yakin ditolong.',
      'Jadikan basmalah saringan: jika kamu malu menyebut nama Allah atas suatu perbuatan, tinggalkan.',
      'Saat butuh kasih sayang/ketenangan, renungi makna "Ar-Rahman Ar-Rahim" — rahmat-Nya luas & tak putus.',
    ],
    sumber: ['Tafsir Ibnu Katsir', 'Tafsir As-Sa‘di', 'Tafsir Al-Qurthubi'],
  },
  {
    id: 'al-fatihah-2', surah: 'Al-Fātiḥah', surahNo: 1, ayatNo: '2', juz: 1,
    tema: ['Syukur', 'Pujian', 'Tauhid Rububiyah'], gratis: false,
    arab: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
    latin: 'Al-ḥamdu lillāhi rabbil-‘ālamīn.',
    arti: 'Segala puji bagi Allah, Tuhan seluruh alam.',
    asbabunNuzul:
      'Tidak ada asbabun nuzul khusus. Ayat ini pujian pembuka yang Allah ajarkan kepada hamba. Dalam hadis qudsi (HR. Muslim), saat hamba membaca ayat ini, Allah menjawab: "Hamba-Ku telah memuji-Ku."',
    tafsir:
      'Segala bentuk pujian — atas zat, nikmat, dan perbuatan-Nya — milik Allah semata. Dia "Rabb" seluruh alam: yang menciptakan, memiliki, memelihara, dan mengatur segala sesuatu.',
    hikmah:
      'Kesadaran bahwa segala pujian kembali kepada Allah membersihkan hati dari ujub: setiap kelebihan yang kita miliki hakikatnya pinjaman dari-Nya. Lebih jauh, ayat ini mendidik cara pandang — orang yang terbiasa memuji Allah akan melihat dunia penuh nikmat, bukan penuh kekurangan, sehingga lebih bahagia dan bersyukur. Memuji Allah juga adalah pengakuan posisi: Dia Pemberi, kita penerima; ini menundukkan kesombongan sebelum kita meminta apa pun pada-Nya di ayat-ayat berikutnya.',
    linguistik:
      'Dipilih «الْحَمْد» dengan alif-lam istighrāq — artinya SEGALA jenis pujian, mutlak & menyeluruh, hanya milik Allah; seandainya tanpa "al-", maknanya menyempit jadi "suatu pujian". Lalu dipilih «ḥamd», bukan «madḥ»: «madḥ» sekadar menyanjung (bisa tanpa cinta, bahkan untuk benda mati atau karena pamrih), sedangkan «ḥamd» adalah pujian yang LAHIR dari cinta & pengagungan atas kebaikan yang disengaja — pas untuk Allah. Lalu «Rabb»: satu kata padat yang mencakup Pencipta + Pemilik + Pemelihara + Pengatur sekaligus; jauh lebih luas dari "Tuhan". Ditutup «al-‘ālamīn» (seluruh alam) agar rububiyah-Nya tak dibatasi pada manusia.',
    sorotan: {
      dipilih: 'الْحَمْد', labelDipilih: 'Pujian + cinta & pengagungan',
      lain: 'الْمَدْح', labelLain: 'Sekadar sanjungan',
      hikmah: 'Allah memilih «ḥamd» bukan «madḥ». Madḥ bisa diucapkan tanpa cinta, bahkan karena pamrih; «ḥamd» wajib lahir dari cinta & kekaguman. Maka memuji Allah bukan formalitas lisan, tapi gerak hati.',
    },
    amalan: [
      'Jadikan "Alhamdulillah" refleks atas nikmat kecil: napas, makanan, kesehatan.',
      'Tulis "jurnal syukur": 3 nikmat tiap malam sebelum tidur.',
      'Saat mulai mengeluh, berhenti — hitung dulu yang sudah Allah beri.',
      'Latih melihat dunia sebagai "penuh nikmat", bukan "penuh kurang".',
    ],
    sumber: ['Tafsir Ibnu Katsir', 'Sahih Muslim no. 395', 'Tafsir As-Sa‘di'],
  },
  {
    id: 'al-fatihah-3', surah: 'Al-Fātiḥah', surahNo: 1, ayatNo: '3', juz: 1,
    tema: ['Rahmat', 'Harap', 'Nama Allah'], gratis: false,
    arab: 'الرَّحْمَٰنِ الرَّحِيمِ',
    latin: 'Ar-raḥmānir-raḥīm.',
    arti: 'Yang Maha Pengasih lagi Maha Penyayang.',
    asbabunNuzul:
      'Tidak ada asbabun nuzul khusus. Penyebutan ulang dua nama rahmat tepat setelah "Rabbil ‘ālamīn" memiliki peran retoris penting dalam susunan surah.',
    tafsir:
      'Setelah menegaskan Allah sebagai Penguasa & Pengatur seluruh alam, Dia menyebut kembali rahmat-Nya agar keagungan tidak melahirkan rasa takut berlebihan, melainkan diimbangi harap pada kasih sayang-Nya.',
    hikmah:
      'Mengenal Allah harus seimbang: mengagungkan keperkasaan-Nya sekaligus mengharap rahmat-Nya — inilah jalan tengah khauf (takut) dan rajā’ (harap). Bila berat ke takut saja, hati putus asa; bila berat ke harap saja, hati lalai & meremehkan dosa. Ayat ini menata jiwa di titik seimbang: cukup takut untuk menjaga diri, cukup berharap untuk tak pernah berputus asa dari ampunan-Nya.',
    linguistik:
      'Keajaibannya ada pada PENEMPATAN, bukan sekadar kata. Dua nama ini sudah disebut di basmalah, lalu diulang di sini — tepat setelah «Rabbil ‘ālamīn» yang menonjolkan kekuasaan & keagungan (yang bisa membangkitkan rasa gentar). Pengulangan di posisi ini berfungsi menyeimbangkan emosi pembaca: begitu hati membesarkan keagungan Allah, ia langsung ditenangkan oleh rahmat-Nya. Lalu disusul «Māliki yaumid-dīn» (penguasa hari pembalasan) yang kembali menumbuhkan rasa tanggung jawab. Jadi urutannya: agung → sayang → tanggung jawab — sebuah tata letak (naẓm) yang menata hati naik-turun secara sempurna; bukan kebetulan, melainkan rancangan retoris ilahi.',
    sorotan: {
      dipilih: 'الرَّحْمَٰنِ الرَّحِيمِ', labelDipilih: 'Diletakkan setelah "Rabbil ‘ālamīn"',
      lain: null, labelLain: '',
      hikmah: 'Keajaibannya pada POSISI: tepat setelah menyebut kekuasaan Allah yang bisa menimbulkan rasa gentar, rahmat-Nya disebut lagi untuk menenangkan hati. Susunan ini menata emosi: agung lalu sayang.',
    },
    amalan: [
      'Saat merasa dosa menumpuk hingga putus asa, ingat: Penguasa semesta itu Maha Pengasih.',
      'Saat merasa terlalu aman & meremehkan dosa, ingat ayat berikutnya: ada hari pembalasan.',
      'Latih doa dengan dua sayap: takut akan siksa-Nya, berharap penuh rahmat-Nya.',
      'Jangan biarkan rasa takut menjauhkanmu dari Allah — justru datang & memohon ampun.',
    ],
    sumber: ['Tafsir Ibnu Katsir', 'Tafsir As-Sa‘di', 'Tafsir Al-Qurthubi'],
  },
  {
    id: 'al-fatihah-4', surah: 'Al-Fātiḥah', surahNo: 1, ayatNo: '4', juz: 1,
    tema: ['Akhirat', 'Hisab', 'Tanggung jawab'], gratis: false,
    arab: 'مَالِكِ يَوْمِ الدِّينِ',
    latin: 'Māliki yaumid-dīn.',
    arti: 'Pemilik (Raja) hari pembalasan.',
    asbabunNuzul:
      'Tidak ada asbabun nuzul khusus. Ayat ini mengalihkan kesadaran pembaca dari rahmat ke pertanggungjawaban, menyeimbangkan harap dengan rasa tanggung jawab.',
    tafsir:
      'Allah satu-satunya Penguasa mutlak pada hari pembalasan — hari ketika setiap jiwa menerima balasan amalnya, tanpa ada kekuasaan lain yang berbagi otoritas dengan-Nya.',
    hikmah:
      'Keyakinan akan hari pembalasan adalah rem moral terkuat manusia: ia menjaga kita tetap jujur justru saat tidak ada yang melihat, karena sadar semua dihisab. Ayat ini juga sumber keadilan & harapan bagi yang terzalimi — di dunia kezaliman bisa lolos, tapi di "yaumid-dīn" tak ada yang luput. Maka beriman pada hari ini sekaligus menumbuhkan integritas (takut hisab) dan kesabaran (yakin keadilan pasti datang).',
    linguistik:
      'Ada dua bacaan mutawatir yang keduanya sahih & justru saling memperkaya: «مَالِك» (Pemilik) dan «مَلِك» (Raja). «Mālik» menekankan KEPEMILIKAN penuh atas hari itu — segalanya milik-Nya untuk ditindak sekehendak-Nya; «Malik» menekankan KEDAULATAN & otoritas memerintah — Dia raja yang perintah-Nya berlaku mutlak. Seorang pemilik belum tentu raja, dan raja belum tentu pemilik; tapi Allah keduanya sekaligus. Dipilih pula «yaumid-dīn» — kata «dīn» di sini bermakna "balasan/perhitungan", bukan "agama" — menegaskan hari itu adalah hari KEADILAN sempurna, bukan sekadar hari berakhirnya dunia.',
    sorotan: {
      dipilih: 'مَالِك', labelDipilih: 'Pemilik mutlak hari itu',
      lain: 'مَلِك', labelLain: 'Raja yang berdaulat',
      hikmah: 'Dua qira’at sahih, dan keduanya benar sekaligus: Allah «Mālik» (pemilik penuh) DAN «Malik» (raja berdaulat) atas hari pembalasan. Pemilik belum tentu raja, raja belum tentu pemilik — Allah keduanya.',
    },
    amalan: [
      'Sebelum keputusan saat tak ada yang melihat (transaksi, ujian, janji), hadirkan: ada hari ini dihisab.',
      'Saat terzalimi & tak bisa menuntut, tenangkan hati: keadilan pasti di "yaumid-dīn".',
      'Jadikan ingatan akan hisab sebagai sumber integritas dari dalam, bukan takut manusia.',
      'Evaluasi amal harianmu seolah hari ini sedang ditimbang.',
    ],
    sumber: ['Tafsir Ibnu Katsir', 'Tafsir Al-Qurthubi', 'Kitab qira’at mutawatir'],
  },
  {
    id: 'al-fatihah-5', surah: 'Al-Fātiḥah', surahNo: 1, ayatNo: '5', juz: 1,
    tema: ['Tauhid', 'Ibadah', 'Tawakal'], gratis: false,
    arab: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
    latin: 'Iyyāka na‘budu wa iyyāka nasta‘īn.',
    arti: 'Hanya kepada Engkau kami menyembah dan hanya kepada Engkau kami memohon pertolongan.',
    asbabunNuzul:
      'Tidak ada asbabun nuzul khusus. Ayat ini poros Al-Fatihah: peralihan dari memuji Allah (ayat 1–4) menuju ikrar penghambaan & permohonan (ayat 5–7). Dalam hadis qudsi, Allah menyebut ayat ini "antara Aku dan hamba-Ku".',
    tafsir:
      'Pengakuan bahwa ibadah hanya ditujukan kepada Allah, dan pertolongan hanya dimohon dari-Nya. Ibadah didahulukan atas permohonan: tunaikan dulu hak Allah, baru sampaikan kebutuhan diri.',
    hikmah:
      'Ayat ini merangkum dua sumbu agama: «iyyāka na‘budu» (hanya menyembah Allah) menolak segala bentuk syirik & penghambaan pada makhluk; «iyyāka nasta‘īn» (hanya minta tolong pada-Nya) menolak ketergantungan batin pada selain Allah. Inilah kemerdekaan sejati jiwa: tidak diperbudak gengsi, atasan, harta, atau makhluk mana pun. Lebih dalam, urutannya mendidik adab — kita beribadah BUKAN sebagai transaksi agar dibantu, tapi karena Allah memang layak disembah; pertolongan datang sebagai buah penghambaan, bukan syarat di depannya.',
    linguistik:
      'Inilah lapisan yang sering membuat orang merinding. Kata «إِيَّاكَ» (objek: "hanya kepada-Mu") DIDAHULUKAN sebelum kata kerja «نَعْبُد» (menyembah). Susunan normal mestinya "na‘buduka" (kami menyembah-Mu). Dalam balaghah, mendahulukan objek (taqdīmul ma‘mūl) menghasilkan «ḥaṣr» — pembatasan mutlak: "hanya Engkau, tidak yang lain." Maka satu pergeseran urutan kata mengubah makna dari sekadar "kami menyembah-Mu" menjadi "HANYA kepada-Mu kami menyembah". Lebih menakjubkan, terjadi «iltifāt» (peralihan gaya): dari membicarakan Allah sebagai orang ketiga ("Dia, Tuhan semesta") menjadi menyapa langsung orang kedua ("Engkau") — seolah setelah memuji-Nya, hamba menjadi begitu dekat hingga berani berbicara langsung di hadapan-Nya. Dan «na‘budu» didahulukan dari «nasta‘īn»: hak Allah sebelum kebutuhan diri.',
    sorotan: {
      dipilih: 'إِيَّاكَ نَعْبُد', labelDipilih: 'Objek didahulukan → "HANYA pada-Mu"',
      lain: 'نَعْبُدُكَ', labelLain: 'Susunan biasa → "kami menyembah-Mu"',
      hikmah: 'Dengan mendahulukan objek «Iyyāka» sebelum kata kerja, maknanya berubah jadi pembatasan (ḥaṣr): "HANYA kepada-Mu". Bila disusun biasa «na‘buduka», hilanglah makna eksklusif itu. Satu pergeseran kata = inti tauhid.',
    },
    amalan: [
      'Resapi ayat ini tiap salat sebagai pembaruan ikrar: aku hanya mengabdi pada Allah.',
      'Saat ada masalah, datangi Allah lebih dulu (doa, salat hajat) sebelum bergantung pada manusia.',
      'Periksa hati: apakah ada yang kamu sembah diam-diam — gengsi, jabatan, pengakuan orang?',
      'Latih tawakal: ikhtiar maksimal, lalu sandarkan hasil hanya pada Allah.',
    ],
    sumber: ['Tafsir Ibnu Katsir', 'Sahih Muslim no. 395 (hadis qudsi)', 'Tafsir As-Sa‘di'],
  },
  {
    id: 'al-fatihah-6', surah: 'Al-Fātiḥah', surahNo: 1, ayatNo: '6', juz: 1,
    tema: ['Hidayah', 'Doa', 'Istiqamah'], gratis: false,
    arab: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
    latin: 'Ihdinaṣ-ṣirāṭal-mustaqīm.',
    arti: 'Tunjukilah kami jalan yang lurus.',
    asbabunNuzul:
      'Tidak ada asbabun nuzul khusus. Inilah inti permohonan dalam Al-Fatihah; karena itu kita memintanya minimal 17 kali sehari dalam salat fardu.',
    tafsir:
      'Permohonan agar Allah membimbing ke jalan lurus — yaitu Islam, kebenaran, jalan para nabi & orang saleh — sekaligus diteguhkan di atasnya hingga akhir hayat.',
    hikmah:
      'Meski sudah muslim, kita tetap memohon hidayah setiap hari — karena hidayah bukan status sekali jadi, melainkan bimbingan yang terus dibutuhkan di tiap keputusan. Permintaan ini juga mendidik kerendahan hati: orang yang merasa sudah "paling benar" justru berhenti memintanya. Lebih dalam, ia mengajarkan bahwa istiqamah lebih sulit daripada memulai; banyak yang menemukan kebenaran lalu tergelincir darinya, maka kita memohon bukan hanya ditunjukkan jalan, tapi DITEGUHKAN di atasnya.',
    linguistik:
      'Dipilih «الصِّرَاط» (jalan) dalam bentuk TUNGGAL & definitif (ma‘rifah) — satu jalan lurus yang jelas. Bandingkan: di ayat lain Al-Qur’an menyebut jalan-jalan kesesatan dengan «سُبُل» (jamak) karena memang bercabang banyak; sedangkan kebenaran hanya satu. «Al-mustaqīm» berarti lurus tanpa belok — yakni jalur TERPENDEK ke tujuan (garis lurus selalu jarak terdekat). Menariknya, doa ini memakai fi‘il amr «اهْدِنَا» (bimbinglah kami) padahal diucapkan orang yang sudah beriman — isyarat bahwa hidayah berlapis: hidayah menuju kebenaran DAN hidayah keteguhan di atasnya. Dipakai pula «-nā» (kami), bukan "ku" — mendidik kita mendoakan kebaikan untuk umat, bukan hanya diri sendiri.',
    sorotan: {
      dipilih: 'الصِّرَاط', labelDipilih: 'Tunggal & "al-" → satu jalan lurus',
      lain: 'السُّبُل', labelLain: 'Jamak → jalan-jalan menyimpang',
      hikmah: 'Kebenaran disebut tunggal-definitif «aṣ-ṣirāṭ» (satu jalan), sedang kesesatan disebut jamak «subul» (banyak cabang). Lurus itu satu; menyimpang punya tak terhitung arah. Maka kita minta yang satu itu.',
    },
    amalan: [
      'Saat membaca ayat ini dalam salat, hadirkan benar-benar permohonannya — jangan otomatis.',
      'Jadikan doa saat bingung keputusan besar (karier, jodoh, hijrah): "Ya Allah, tunjukkan jalan lurus."',
      'Iringi dengan ikhtiar: belajar ilmu yang benar & salat istikharah.',
      'Doakan juga keluarga & umat agar diteguhkan di jalan lurus (pakai "kami", bukan "aku").',
    ],
    sumber: ['Tafsir Ibnu Katsir', 'Tafsir As-Sa‘di', 'Tafsir Al-Qurthubi'],
  },
  {
    id: 'al-fatihah-7', surah: 'Al-Fātiḥah', surahNo: 1, ayatNo: '7', juz: 1,
    tema: ['Teladan', 'Adab', 'Jalan keselamatan'], gratis: false,
    arab: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
    latin: 'Ṣirāṭal-lażīna an‘amta ‘alaihim gairil-magḍūbi ‘alaihim wa laḍ-ḍāllīn.',
    arti: '(Yaitu) jalan orang-orang yang telah Engkau beri nikmat, bukan (jalan) mereka yang dimurkai, dan bukan (pula jalan) mereka yang sesat.',
    asbabunNuzul:
      'Tidak ada asbabun nuzul khusus. Nabi ﷺ menjelaskan tiga golongan: yang diberi nikmat (para nabi, shiddiqin, syuhada, saleh); yang dimurkai & yang sesat sebagai dua bentuk penyimpangan (tahu kebenaran lalu meninggalkannya, dan beramal tanpa ilmu).',
    tafsir:
      'Jalan lurus diperjelas sebagai jalan orang-orang yang Allah beri nikmat hidayah, bukan jalan dua golongan menyimpang: yang meninggalkan kebenaran yang diketahui, dan yang beramal tanpa ilmu.',
    hikmah:
      'Keselamatan menuntut DUA hal sekaligus: ilmu yang benar DAN amal yang lurus. Golongan "dimurkai" adalah yang berilmu tapi tak mengamalkan; golongan "sesat" adalah yang beramal tanpa ilmu — keduanya tergelincir dari sisi berbeda. Ayat ini juga menanamkan pentingnya teladan: kita tidak meniti jalan sendirian, tapi mengikuti jejak para nabi & orang saleh yang sudah terbukti selamat. Maka memilih siapa yang kita ikuti & jadikan panutan adalah keputusan yang menentukan arah hidup.',
    linguistik:
      'Perhatikan ADAB luar biasa dalam pemilihan bentuk kata. Saat menyebut nikmat, Allah memakai kalimat AKTIF yang langsung disandarkan kepada diri-Nya: «أَنْعَمْتَ عَلَيْهِم» (Engkau yang memberi nikmat). Namun saat menyebut murka, dipakai bentuk PASIF «الْمَغْضُوبِ عَلَيْهِم» (mereka yang dimurkai) — TIDAK dikatakan "yang Engkau murkai". Penyandaran nikmat langsung kepada Allah, dan penghindaran penyandaran murka secara langsung, adalah puncak adab berbicara tentang Allah: kebaikan dinisbatkan kepada-Nya, sedangkan keburukan/murka tidak dilekatkan langsung pada-Nya karena ia lahir dari perbuatan hamba sendiri. Satu pilihan antara bentuk aktif vs pasif menyimpan pelajaran tauhid & tata krama yang dalam.',
    sorotan: {
      dipilih: 'الْمَغْضُوبِ عَلَيْهِمْ', labelDipilih: 'Pasif → murka tak disandarkan ke Allah',
      lain: 'غَضِبْتَ عَلَيْهِمْ', labelLain: 'Aktif (tidak dipakai)',
      hikmah: 'Untuk nikmat, dipakai aktif «an‘amta» (Engkau memberi). Untuk murka, dipakai pasif «al-magḍūb» (yang dimurkai), bukan "Engkau murkai". Adab tertinggi: kebaikan dinisbatkan ke Allah, keburukan tidak dilekatkan langsung pada-Nya.',
    },
    amalan: [
      'Setelah membaca ayat ini, ucapkan "āmīn" dengan penuh harap.',
      'Padukan ilmu & amal: jangan menunda mengamalkan kebaikan yang sudah kamu tahu.',
      'Jangan beribadah/bermuamalah tanpa belajar dasarnya lebih dulu.',
      'Pilih panutan & lingkungan yang menuntunmu ke jalan orang-orang saleh.',
    ],
    sumber: ['Tafsir Ibnu Katsir', 'Jami‘ at-Tirmidzi (riwayat tiga golongan)', 'Tafsir As-Sa‘di'],
  },

  /* ============ SURAH AL-BAQARAH (2) ============ */
  {
    id: 'al-baqarah-1', surah: 'Al-Baqarah', surahNo: 2, ayatNo: '1', juz: 1,
    tema: ['Mukjizat', "Tantangan i'jaz", 'Tawadu ilmu'], gratis: false,
    arab: 'الم',
    latin: 'Alif Lām Mīm.',
    arti: 'Alif Lām Mīm.',
    asbabunNuzul:
      'Tidak ada asbabun nuzul khusus. "Alif Lām Mīm" termasuk «al-ḥurūf al-muqaṭṭa‘ah» (huruf-huruf terpisah) yang membuka 29 surah. Ulama berbeda pendapat soal maknanya; sikap paling selamat: "Allah lebih tahu maksudnya" sembari merenungi hikmah penempatannya.',
    tafsir:
      'Huruf-huruf terpotong yang mengawali sebagian surah. Banyak ulama salaf menyerahkan maknanya kepada Allah, namun sepakat ada hikmah besar di baliknya, terutama kaitannya dengan kemukjizatan Al-Qur’an.',
    hikmah:
      'Tidak semua hal harus kita pahami tuntas untuk kita imani — ada wilayah ilmu yang justru menuntut ketundukan & kerendahan hati di hadapan Allah. Ini melatih sikap ilmiah yang sehat: berani berkata "saya belum tahu" alih-alih memaksakan tafsir. Lebih dalam, huruf-huruf ini menjadi pengingat permanen tentang kemukjizatan Al-Qur’an di setiap awal surah — bahwa kitab agung ini, meski tersusun dari huruf yang sama dengan yang manusia pakai, mustahil ditandingi.',
    linguistik:
      'Inilah salah satu isyarat i‘jāz paling memukau. Surah-surah berhuruf muqaṭṭa‘ah hampir selalu disusul penyebutan tentang Al-Qur’an (di sini langsung: «Żālikal-kitāb…»). Seolah Allah menantang: Al-Qur’an ini tersusun dari huruf-huruf yang SAMA PERSIS dengan yang kalian (bangsa Arab, ahli bahasa & syair terhebat) kuasai dan banggakan — alif, lām, mīm — namun kalian tetap tak mampu menyusun satu surah pun yang menyamainya. Tantangan i‘jāz disampaikan justru lewat "bahan baku" yang paling dikenal lawan, membungkam mereka dengan senjata mereka sendiri. Sampai hari ini tantangan «buatlah satu surah yang semisal» belum pernah terjawab.',
    sorotan: {
      dipilih: 'الم', labelDipilih: 'Huruf yang dikuasai bangsa Arab',
      lain: null, labelLain: '',
      hikmah: 'Al-Qur’an dibangun dari huruf yang sama persis dengan yang dipakai para ahli bahasa Arab — alif, lām, mīm. Tantangannya: "Kalian punya hurufnya, susunlah yang semisal." Hingga kini tak terjawab. Inilah bukti i‘jāz.',
    },
    amalan: [
      'Saat menemui hal dalam agama yang belum kau pahami, jangan terburu menolak — akui keterbatasan ilmu.',
      'Latih kejujuran ilmiah: berani berkata "saya belum tahu, perlu belajar".',
      'Renungi bahwa Al-Qur’an mustahil dikarang manusia — jadikan penguat iman saat ragu.',
      'Saat iman melemah, baca & dengar Al-Qur’an dengan tadabbur untuk merasakan keagungannya.',
    ],
    sumber: ['Tafsir Ibnu Katsir', 'Tafsir Al-Qurthubi', 'Tafsir As-Sa‘di'],
  },
  {
    id: 'al-baqarah-2', surah: 'Al-Baqarah', surahNo: 2, ayatNo: '2', juz: 1,
    tema: ['Petunjuk', 'Takwa', 'Keyakinan'], gratis: false,
    arab: 'ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ',
    latin: 'Żālikal-kitābu lā raiba fīh, hudal lil-muttaqīn.',
    arti: 'Kitab (Al-Qur’an) ini tidak ada keraguan padanya; petunjuk bagi mereka yang bertakwa.',
    asbabunNuzul:
      'Tidak ada asbabun nuzul khusus. Ayat ini menegaskan kedudukan Al-Qur’an sebagai kitab yang pasti benar & menjadi petunjuk, tepat setelah isyarat kemukjizatan pada "Alif Lām Mīm".',
    tafsir:
      'Al-Qur’an adalah kitab yang sama sekali tak mengandung keraguan tentang asal (dari Allah) maupun isinya. Ia petunjuk yang benar-benar membimbing — khususnya berbuah pada orang bertakwa, karena merekalah yang membuka hati menerimanya.',
    hikmah:
      'Petunjuk Al-Qur’an bersifat objektif & sempurna, tetapi yang MEMETIK manfaatnya adalah hati yang siap (bertakwa) — seperti matahari yang menyinari semua, tapi hanya bermanfaat bagi yang membuka mata. Ini menjelaskan kenapa dua orang membaca ayat sama tapi satu tersentuh & satu tidak: bedanya di kesiapan hati. Maka hidayah butuh dua hal — kitab yang benar (tersedia) dan ketakwaan (kita usahakan). Semakin bersih hati, semakin banyak petunjuk yang terbuka.',
    linguistik:
      'Dipilih kata tunjuk «ذَٰلِكَ» (itu — untuk yang JAUH), bukan «هَٰذَا» (ini — untuk yang dekat), padahal kitab itu ada di hadapan. Pemakaian isyarat "jauh" justru untuk MENGAGUNGKAN: menunjuk ketinggian & keluhuran derajat kitab ini, seakan kedudukannya jauh tinggi di atas jangkauan. Lalu «لَا رَيْبَ فِيه» — peniadaan dengan «lā» yang menafikan JENIS: tidak ada keraguan apa pun, sekecil apa pun, dari sisi mana pun. Dan «هُدًى» (petunjuk) dibuat nakirah untuk mengisyaratkan keagungan & keluasan petunjuk yang tak terbatas. Tiga pilihan kata ini bersama-sama menegaskan kemuliaan sekaligus kepastian mutlak kitab — dalam kalimat yang sangat ringkas.',
    sorotan: {
      dipilih: 'ذَٰلِكَ', labelDipilih: 'Isyarat "jauh" → mengagungkan',
      lain: 'هَٰذَا', labelLain: 'Isyarat "dekat" (biasa)',
      hikmah: 'Kitab ada di hadapan (dekat), tapi Allah memilih kata tunjuk untuk yang JAUH «żālika». Tujuannya bukan jarak, tapi pengagungan: menunjuk ketinggian derajat Al-Qur’an yang jauh di atas.',
    },
    amalan: [
      'Bangun hubungan harian dengan Al-Qur’an meski sedikit (satu ayat + maknanya).',
      'Tingkatkan takwa — makin bertakwa, makin terbuka pintu memahami petunjuknya.',
      'Saat ragu dalam hidup, kembalikan standar pada Al-Qur’an yang "lā raiba fīh".',
      'Jika membaca tapi tak tersentuh, periksa hati — bersihkan dari dosa yang menghalangi.',
    ],
    sumber: ['Tafsir Ibnu Katsir', 'Tafsir As-Sa‘di', 'Tafsir Al-Qurthubi'],
  },
  {
    id: 'al-baqarah-3-4', surah: 'Al-Baqarah', surahNo: 2, ayatNo: '3–4', juz: 1,
    tema: ['Iman', 'Salat', 'Sedekah'], gratis: false,
    arab: 'الَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ وَيُقِيمُونَ الصَّلَاةَ وَمِمَّا رَزَقْنَاهُمْ يُنفِقُونَ ۝ وَالَّذِينَ يُؤْمِنُونَ بِمَا أُنزِلَ إِلَيْكَ وَمَا أُنزِلَ مِن قَبْلِكَ وَبِالْآخِرَةِ هُمْ يُوقِنُونَ',
    latin: 'Allażīna yu’minūna bil-gaibi wa yuqīmūnaṣ-ṣalāta wa mimmā razaqnāhum yunfiqūn. Wallażīna yu’minūna bimā unzila ilaika wa mā unzila min qablika wa bil-ākhirati hum yūqinūn.',
    arti: '(Yaitu) mereka yang beriman kepada yang gaib, menegakkan salat, dan menginfakkan sebagian rezeki yang Kami berikan. Dan mereka yang beriman kepada (Al-Qur’an) yang diturunkan kepadamu dan (kitab-kitab) yang diturunkan sebelummu, serta yakin akan adanya akhirat.',
    asbabunNuzul:
      'Tidak ada asbabun nuzul khusus. Ayat ini merinci sifat "al-muttaqīn" yang disebut sebelumnya — siapa sebenarnya mereka yang memperoleh petunjuk Al-Qur’an.',
    tafsir:
      'Allah menyebut ciri orang bertakwa: beriman pada yang gaib, menegakkan salat, berinfak, beriman pada seluruh wahyu (kepada Nabi ﷺ & para nabi sebelumnya), serta yakin penuh akan akhirat. Iman batin diwujudkan dalam ibadah (salat) & kepedulian sosial (infak).',
    hikmah:
      'Takwa bukan klaim di hati saja; ia terbukti dalam tiga ranah: ibadah ritual (salat), kepedulian harta (infak), dan keyakinan yang utuh (pada wahyu & akhirat). Susunannya bertahap dari yang batin (iman pada gaib) ke yang tampak (salat) lalu ke yang sosial (infak) — menunjukkan iman sejati selalu turun jadi tindakan nyata. Lebih dalam, "iman pada yang gaib" adalah ujian inti manusia: percaya pada Allah, malaikat, akhirat yang tak terlihat justru menjadi pembeda antara yang tunduk pada wahyu & yang hanya percaya pada indra.',
    linguistik:
      'Beberapa pilihan kata yang sarat makna. Pertama «يُقِيمُون» (menegakkan), bukan «يُصَلُّون» (sekadar mengerjakan/salat): «iqāmah» berarti menegakkan dengan SEMPURNA syarat, rukun, kekhusyukan & keajegannya — salat yang tegak lurus, bukan asal gugur kewajiban. Kedua, pada infak dipilih «مِمَّا رَزَقْنَاهُم» — huruf «min» di sini bermakna sebagian (tab‘īḍ): Allah hanya minta SEBAGIAN, tidak semuanya — sebuah keringanan; dan "rezeki dari KAMI" mengingatkan harta itu titipan Allah, sehingga berinfak hakikatnya mengembalikan sebagian pemberian-Nya. Ketiga, pada keyakinan akhirat, kata «هُم» didahulukan («hum yūqinūn») untuk «ḥaṣr»: merekalah yang benar-benar yakin, bukan sekadar tahu.',
    sorotan: {
      dipilih: 'يُقِيمُونَ الصَّلَاة', labelDipilih: 'Menegakkan dengan sempurna',
      lain: 'يُصَلُّونَ', labelLain: 'Sekadar mengerjakan salat',
      hikmah: 'Allah memilih «yuqīmūna» (menegakkan), bukan «yuṣallūna» (sekadar salat). «Iqāmah» = menegakkan lengkap dengan rukun, kekhusyukan & keajegannya — salat yang tegak lurus, bukan asal gugur kewajiban.',
    },
    amalan: [
      'Audit kualitas salatmu: khusyuk & tegak, atau sekadar gugur kewajiban?',
      'Mulai sedekah rutin dari nominal kecil tapi konsisten — ingat harta itu titipan.',
      'Kuatkan iman pada yang gaib lewat ilmu & tadabbur, bukan hanya logika indra.',
      'Pilih satu ciri yang paling lemah pada dirimu, perbaiki pekan ini.',
    ],
    sumber: ['Tafsir Ibnu Katsir', 'Tafsir As-Sa‘di', 'Tafsir Al-Qurthubi'],
  },
  {
    id: 'al-baqarah-5', surah: 'Al-Baqarah', surahNo: 2, ayatNo: '5', juz: 1,
    tema: ['Keberuntungan', 'Hidayah', 'Optimisme'], gratis: false,
    arab: 'أُولَٰئِكَ عَلَىٰ هُدًى مِّن رَّبِّهِمْ ۖ وَأُولَٰئِكَ هُمُ الْمُفْلِحُونَ',
    latin: 'Ulā’ika ‘alā hudam mir rabbihim, wa ulā’ika humul-mufliḥūn.',
    arti: 'Merekalah yang mendapat petunjuk dari Tuhannya, dan merekalah orang-orang yang beruntung.',
    asbabunNuzul:
      'Tidak ada asbabun nuzul khusus. Ayat ini kesimpulan & kabar gembira bagi orang-orang dengan sifat takwa pada ayat 3–4.',
    tafsir:
      'Orang-orang dengan sifat tersebut benar-benar berada di atas petunjuk dari Tuhan mereka, dan merekalah peraih keberuntungan hakiki — kemenangan di dunia & keselamatan di akhirat.',
    hikmah:
      'Keberuntungan sejati (falāḥ) tidak diukur dari harta atau jabatan, melainkan dari hidayah & keselamatan akhirat — inilah definisi "sukses" dalam Al-Qur’an, yang sering terbalik dari ukuran dunia. Banyak orang tampak beruntung secara materi tapi merugi secara hakikat, dan sebaliknya. Ayat ini juga menanam optimisme & rasa cukup: bila kamu di atas hidayah, kamu sudah "menang" apa pun kondisi duniamu, sehingga tak perlu iri pada gemerlap yang fana.',
    linguistik:
      'Dipilih ungkapan «عَلَىٰ هُدًى» — dengan kata «‘alā» (di ATAS) — bukan sekadar "mendapat" petunjuk. Gambarannya: mereka seakan BERADA DI ATAS & ditopang oleh petunjuk, kokoh & mantap, seperti penunggang yang menguasai kendaraannya — bukan sekadar tersentuh hidayah sesekali. Lalu «أُولَٰئِكَ» (mereka itu) diulang dua kali untuk menegaskan & memuliakan kedudukan mereka. Penutupnya «هُمُ الْمُفْلِحُون» memakai «hum» (kata ganti pemisah) yang berfungsi «ḥaṣr»: HANYA merekalah orang-orang yang beruntung — keberuntungan sejati dikhususkan bagi mereka. «Al-falāḥ» sendiri berakar makna "membelah/menembus": meraih yang diharapkan & selamat dari yang ditakuti.',
    sorotan: {
      dipilih: 'عَلَىٰ هُدًى', labelDipilih: '"DI ATAS" petunjuk → kokoh menunggangi',
      lain: 'بِهُدًى', labelLain: '"dengan" petunjuk (biasa)',
      hikmah: 'Dipilih «‘alā hudan» (di ATAS petunjuk), bukan sekadar "mendapat" petunjuk. Maknanya: mereka kokoh menunggangi hidayah seperti penunggang menguasai kendaraannya — mapan & terkendali, bukan tersentuh sesekali.',
    },
    amalan: [
      'Definisikan ulang "sukses" hidupmu memakai standar ayat ini, bukan standar dunia.',
      'Saat membandingkan diri dengan pencapaian materi orang di medsos, ingat: yang beruntung = yang di atas hidayah.',
      'Tetapkan satu target "keberuntungan akhirat" (mis. konsistensi ibadah) sepenting target karier.',
      'Syukuri hidayah sebagai kemenangan terbesar yang sudah kamu pegang.',
    ],
    sumber: ['Tafsir Ibnu Katsir', 'Tafsir As-Sa‘di', 'Tafsir Al-Qurthubi'],
  },
  {
    id: 'al-baqarah-255', surah: 'Al-Baqarah', surahNo: 2, ayatNo: '255 (Ayat Kursi)', juz: 3,
    tema: ['Tauhid', 'Perlindungan', 'Keagungan Allah'], gratis: false,
    arab: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ',
    latin: 'Allāhu lā ilāha illā huw, al-ḥayyul-qayyūm. Lā ta’khużuhū sinatuw wa lā naum…',
    arti: 'Allah, tidak ada tuhan selain Dia, Yang Maha Hidup lagi terus-menerus mengurus (makhluk-Nya). Tidak mengantuk dan tidak tidur… Kursi-Nya meliputi langit dan bumi, dan Dia tidak merasa berat memelihara keduanya. Dialah Yang Maha Tinggi lagi Maha Besar.',
    asbabunNuzul:
      'Ayat Kursi tidak memiliki riwayat asbabun nuzul khusus yang sahih — ia bagian Surah Al-Baqarah (Madaniyah). Namun keutamaannya masyhur: Nabi ﷺ menyebutnya ayat teragung dalam Al-Qur’an (HR. Muslim), dan membacanya menjadi pelindung (kisah Abu Hurairah, HR. Bukhari).',
    tafsir:
      'Ayat ini merangkum keagungan Allah: keesaan-Nya, kehidupan-Nya yang sempurna, pengaturan-Nya yang tak pernah lalai, kepemilikan-Nya atas isi langit-bumi, luasnya ilmu & kekuasaan-Nya, hingga Kursi-Nya yang meliputi semesta — semua tanpa membuat-Nya lelah.',
    hikmah:
      'Mengenal keagungan Allah membuahkan ketenangan & keberanian: jika Dzat yang mengurus seluruh alam tidak pernah mengantuk menjaga kita, untuk apa kita gelisah berlebihan atau takut pada makhluk yang lemah? Ayat ini juga "obat" rasa sendiri — ada Penjaga yang tak pernah lengah sedetik pun. Inilah sebabnya ia menjadi benteng perlindungan: bukan sekadar bacaan ajaib, tapi karena maknanya menanamkan tauhid yang mengusir rasa takut & was-was dari hati.',
    linguistik:
      'Perhatikan urutan «سِنَة» (sinah, kantuk ringan) lalu «نَوْم» (naum, tidur lelap). Sinah adalah AWAL/pendahulu tidur, naum puncaknya. Allah menafikan keduanya dengan urutan MENAIK — dari yang paling ringan ke yang paling berat: bahkan kantuk paling samar pun tak menyentuh-Nya, apalagi tidur. Bila disebut "tidak tidur dan tidak mengantuk", efek penegasannya lebih lemah; dengan urutan "tidak mengantuk DAN tidak tidur", ditutup total dari pintu terkecilnya. Ini menegaskan kesempurnaan «Al-Qayyūm» (yang terus mengurus tanpa jeda). Dua nama agung dirangkai: «Al-Ḥayy» (sumber kehidupan) & «Al-Qayyūm» (penegak segala sesuatu) — padanya ulama menyebut tersimpan «ismullāhil a‘ẓam».',
    sorotan: {
      dipilih: 'سِنَةٌ وَلَا نَوْمٌ', labelDipilih: 'Kantuk dulu, baru tidur (menaik)',
      lain: 'نَوْمٌ وَلَا سِنَةٌ', labelLain: 'Tidur dulu (kurang menutup)',
      hikmah: 'Disebut «sinah» (kantuk) lebih dulu, baru «naum» (tidur). Kantuk itu pintu menuju tidur; dengan menafikan pintunya dulu, tertutup total — bahkan setitik kantuk pun mustahil pada Allah, apalagi tidur. Urutan yang sempurna.',
    },
    amalan: [
      'Baca Ayat Kursi setelah tiap salat fardu & menjelang tidur (sunnah & benteng perlindungan).',
      'Saat takut, cemas, atau merasa sendiri, resapi artinya: Penjaga semestamu tidak pernah tidur.',
      'Ajarkan & biasakan pada anak/keluarga sebagai zikir penenang.',
      'Renungi keagungan Allah saat gelisah agar masalah terasa kecil di hadapan-Nya.',
    ],
    sumber: ['Tafsir Ibnu Katsir', 'Sahih Muslim no. 810', 'Sahih Bukhari (kisah Abu Hurairah)'],
  },
  {
    id: 'al-baqarah-286', surah: 'Al-Baqarah', surahNo: 2, ayatNo: '286', juz: 3,
    tema: ['Kelapangan', 'Doa', 'Tanggung jawab'], gratis: false,
    arab: 'لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا ۚ لَهَا مَا كَسَبَتْ وَعَلَيْهَا مَا اكْتَسَبَتْ ۗ رَبَّنَا لَا تُؤَاخِذْنَا إِن نَّسِينَا أَوْ أَخْطَأْنَا',
    latin: 'Lā yukallifullāhu nafsan illā wus‘ahā, lahā mā kasabat wa ‘alaihā maktasabat. Rabbanā lā tu’ākhiżnā in nasīnā au akhṭa’nā…',
    arti: 'Allah tidak membebani seseorang melainkan sesuai kesanggupannya. Ia mendapat (pahala) dari kebajikan yang dikerjakannya dan ia mendapat (siksa) dari kejahatan yang diperbuatnya. (Mereka berdoa): Ya Tuhan kami, janganlah Engkau hukum kami jika kami lupa atau salah…',
    asbabunNuzul:
      'Ketika turun ayat sebelumnya — "jika kamu nyatakan apa yang ada dalam hatimu atau kamu sembunyikan, Allah memperhitungkannya" — para sahabat sangat berat, seakan lintasan hati pun dihisab. Mereka mengadu kepada Nabi ﷺ. Maka turun ayat ini yang melapangkan: beban hanya sebatas kesanggupan, & lintasan hati yang tak disengaja dimaafkan (HR. Muslim).',
    tafsir:
      'Allah menetapkan prinsip rahmat: tak ada beban di luar kemampuan. Setiap jiwa memikul hasil amalnya sendiri. Lalu Allah mengajarkan rangkaian doa indah memohon ampun atas kelupaan, keringanan beban, & pertolongan menghadapi musuh.',
    hikmah:
      'Agama ini tidak memberatkan — rasa cemas berlebihan terhadap dosa kecil yang tak disengaja justru bertentangan dengan kelapangan yang Allah tetapkan sendiri. Ayat ini "obat" bagi jiwa yang dilanda was-was (overthinking dosa): Allah sendiri yang menjamin beban tak melampaui kesanggupan. Lebih dalam, ia menegaskan keadilan individual — tiap jiwa hanya menanggung amalnya sendiri, tak ada yang memikul dosa orang lain, sehingga kita bebas dari beban "dosa warisan" & fokus memperbaiki diri.',
    linguistik:
      'Dipilih kata «وُسْعَهَا» (kesanggupan/kelapangan), BUKAN «طَاقَتَهَا» (batas maksimal tenaga). «Wus‘» adalah kadar yang masih LAPANG & nyaman dijangkau, di BAWAH batas akhir kekuatan; «ṭāqah» adalah batas maksimal yang menguras. Maka Allah sengaja membebani jauh lebih ringan dari batas kemampuan kita — ruang lapang, bukan titik kritis. Lebih halus lagi: kebaikan disebut «كَسَبَتْ» (bentuk sederhana), sedangkan keburukan «اكْتَسَبَتْ» (bentuk if‘ti‘āl yang menyiratkan usaha & kesengajaan lebih). Isyaratnya: kebaikan dicatat dengan mudah meski niat ringan, sementara keburukan baru "membebani" bila diupayakan & disengaja — gambaran luasnya rahmat yang tersembunyi dalam satu pilihan bentuk kata kerja.',
    sorotan: {
      dipilih: 'وُسْعَهَا', labelDipilih: 'Kadar LAPANG (di bawah batas)',
      lain: 'طَاقَتَهَا', labelLain: 'Batas MAKSIMAL (menguras)',
      hikmah: 'Allah memilih «wus‘» (kelapangan), bukan «ṭāqah» (batas maksimal tenaga). Beban yang Allah berikan sengaja diletakkan di kadar yang masih lapang & nyaman — jauh di bawah titik kritis kekuatan kita. Inilah bukti rahmat-Nya.',
    },
    amalan: [
      'Jika terjebak rasa bersalah berlebihan/was-was, kembalikan: Allah hanya menuntut yang lapang bagimu.',
      'Hafalkan rangkaian doa di ujung ayat ini sebagai penutup ibadah (doa para sahabat yang dikabulkan).',
      'Berhenti memikul "dosa" orang lain — fokus perbaiki amalmu sendiri.',
      'Saat target terasa mustahil, pecah jadi langkah kecil yang masih "wus‘" (lapang) untukmu.',
    ],
    sumber: ['Tafsir Ibnu Katsir', 'Sahih Muslim no. 125', 'Tafsir As-Sa‘di'],
  },

  /* ============ JUZ 30 — Ayat masyhur ============ */
  {
    id: 'al-insyirah-5-6', surah: 'Asy-Syarh', surahNo: 94, ayatNo: '5–6', juz: 30,
    tema: ['Sabar', 'Harapan', 'Ujian'], gratis: true,
    arab: 'فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا ۝ إِنَّ مَعَ ٱلْعُسْرِ يُسْرًا',
    latin: 'Fa inna ma‘al-‘usri yusrā. Inna ma‘al-‘usri yusrā.',
    arti: 'Maka sesungguhnya bersama kesulitan ada kemudahan. Sesungguhnya bersama kesulitan ada kemudahan.',
    asbabunNuzul:
      'Surah Asy-Syarh turun di Makkah untuk menenangkan hati Nabi ﷺ di tengah beratnya tekanan dakwah, penolakan Quraisy, & kemiskinan kaum muslimin awal. Ayat ini penutup penghibur: setelah Allah mengingatkan nikmat melapangkan dada beliau, Dia menjanjikan kesempitan yang dihadapi pasti diiringi jalan keluar.',
    tafsir:
      'Allah menegaskan satu sunnatullah: tidak ada kesulitan yang berdiri sendiri tanpa disertai kemudahan. Bukan sekadar "kemudahan datang nanti", tetapi kemudahan itu menyertai kesulitan itu sendiri. Pengulangan dua kali adalah penegasan (taukid) bahwa janji ini pasti.',
    hikmah:
      'Saat berada di titik terberat, justru di situlah benih kemudahan sedang tumbuh — tugas hamba bukan menunggu badai reda, melainkan terus bergerak dengan yakin pertolongan Allah sedang dalam perjalanan. Ayat ini juga mengubah cara pandang terhadap ujian: kesulitan bukan tanda Allah meninggalkanmu, tapi paket yang SUDAH disertai kemudahan di dalamnya. Maka optimisme di sini bukan sekadar motivasi, tapi keyakinan teologis: matematika langit memastikan kemudahan selalu lebih banyak daripada kesulitan.',
    linguistik:
      'Inilah keajaiban yang membuat para ulama takjub. Kata «الْعُسْر» (kesulitan) memakai alif-lam (ma‘rifah/definitif) & diulang dua kali — dalam kaidah Arab, isim ma‘rifah yang diulang menunjuk benda yang SAMA. Sebaliknya «يُسْرًا» (kemudahan) tanpa alif-lam (nakirah/indefinitif) & diulang — isim nakirah yang diulang menunjuk dua hal BERBEDA. Maka maknanya: satu kesulitan, tetapi DUA kemudahan. Ibnu ‘Abbas menyimpulkan: «Satu kesulitan tidak akan pernah mengalahkan dua kemudahan.» Tambahan: dipakai «مَعَ» (bersama), bukan «بَعْدَ» (sesudah) — kemudahan itu MENEMPEL pada kesulitan, hadir bersamanya, bukan menunggu di kejauhan.',
    sorotan: {
      dipilih: 'يُسْرًا', labelDipilih: 'Nakirah (tanpa "al-") → DUA kemudahan',
      lain: 'الْعُسْرِ', labelLain: 'Ma‘rifah (dengan "al-") → SATU kesulitan',
      hikmah: 'Kesulitan «al-‘usr» pakai "al-" (ma‘rifah) & diulang → benda yang SAMA: satu kesulitan. Kemudahan «yusran» tanpa "al-" (nakirah) & diulang → dua hal BERBEDA: dua kemudahan. Kaidah Arab ini menegaskan: satu kesulitan tak akan mengalahkan dua kemudahan.',
    },
    amalan: [
      'Saat menghadapi masalah berat, tulis 1 kesulitanmu, lalu daftar 2 kemudahan/jalan keluar yang mungkin Allah siapkan.',
      'Jadikan ayat ini zikir penenang saat cemas — ucapkan & resapi maknanya.',
      'Latih otak melihat peluang di tengah kesulitan, bukan terpaku pada masalahnya.',
      'Terus bergerak & ikhtiar; jangan menunggu badai reda untuk bertindak.',
    ],
    sumber: ['Tafsir Ibnu Katsir', 'Tafsir As-Sa‘di', 'Riwayat Ibnu ‘Abbas (atsar masyhur)'],
  },
  {
    id: 'al-asr-1-3', surah: 'Al-‘Aṣr', surahNo: 103, ayatNo: '1–3', juz: 30,
    tema: ['Waktu', 'Amal', 'Nasihat'], gratis: false,
    arab: 'وَالْعَصْرِ ۝ إِنَّ الْإِنْسَانَ لَفِي خُسْرٍ ۝ إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ',
    latin: 'Wal-‘aṣr. Innal-insāna lafī khusr. Illal-lażīna āmanū wa ‘amiluṣ-ṣāliḥāti wa tawāṣau bil-ḥaqqi wa tawāṣau biṣ-ṣabr.',
    arti: 'Demi masa. Sungguh, manusia berada dalam kerugian. Kecuali orang-orang yang beriman dan mengerjakan kebajikan, serta saling menasihati untuk kebenaran dan saling menasihati untuk kesabaran.',
    asbabunNuzul:
      'Tidak ada riwayat asbabun nuzul khusus untuk surah Makkiyah ini; ia universal. Imam Asy-Syāfi‘i berkata: "Seandainya manusia merenungkan surah ini saja, niscaya cukup bagi mereka" — karena ia merangkum jalan keselamatan dalam tiga ayat.',
    tafsir:
      'Allah bersumpah demi waktu bahwa semua manusia merugi — modal umurnya habis terpakai — kecuali yang memenuhi empat syarat: beriman, beramal saleh, saling menasihati dalam kebenaran, & saling menasihati dalam kesabaran.',
    hikmah:
      'Waktu adalah modal yang terus berkurang & tak bisa dibeli kembali — tiap detik yang lewat adalah kekayaan yang hilang permanen. Keselamatan menuntut bukan hanya kebaikan pribadi (iman + amal), tetapi juga kepedulian sosial (saling menasihati) — sehingga seseorang tak cukup selamat sendiri, ia juga bertanggung jawab menyelamatkan sekitarnya. Inilah kenapa Imam Syafi‘i menganggap surah ini cukup: ia memetakan seluruh formula sukses akhirat dalam empat poin ringkas.',
    linguistik:
      'Allah bersumpah «وَالْعَصْر» — demi waktu/masa — karena pada waktulah tersingkap untung-rugi manusia. Kata «الْإِنْسَان» dengan alif-lam jenis (istighrāq) mencakup SELURUH manusia tanpa kecuali. Lalu «لَفِي خُسْر»: huruf «la» penegas + «فِي» (di DALAM) menggambarkan manusia seolah TENGGELAM, terbenam di dalam kerugian — bukan sekadar "merugi" yang menyentuh permukaan; «khusr» nakirah menyiratkan kerugian besar tak terkira. Setelah vonis menyeluruh itu, datang «إِلَّا» (kecuali) — satu-satunya pintu keluar — diikuti empat sifat yang tersusun rapi dari individual (iman, amal) ke komunal (saling menasihati). Struktur "vonis umum lalu pengecualian" ini menghentak & menancap kuat.',
    sorotan: {
      dipilih: 'لَفِي خُسْر', labelDipilih: '"DI DALAM" kerugian → tenggelam',
      lain: 'لَخَاسِر', labelLain: '"merugi" → sekadar menyentuh',
      hikmah: 'Dipakai «fī khusr» (DI DALAM kerugian), bukan sekadar «khāsir» (orang yang merugi). «Fī» menggambarkan manusia seolah tenggelam & terbenam di dalam kerugian dari segala sisi — penegasan yang jauh lebih kuat.',
    },
    amalan: [
      'Audit waktumu seperti audit keuangan: catat ke mana jam-jammu pergi hari ini.',
      'Tetapkan satu amal saleh harian yang konsisten.',
      'Lakukan satu "saling menasihati": ingatkan kebaikan ke orang lain dengan lembut.',
      'Jadikan surah ini bacaan penutup hari untuk evaluasi diri.',
    ],
    sumber: ['Tafsir Ibnu Katsir', 'Tafsir As-Sa‘di', 'Ucapan Imam Asy-Syāfi‘i (riwayat masyhur)'],
  },
  {
    id: 'al-kautsar-1-3', surah: 'Al-Kauṡar', surahNo: 108, ayatNo: '1–3', juz: 30,
    tema: ['Syukur', 'Penghiburan', 'Optimisme'], gratis: false,
    arab: 'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ ۝ فَصَلِّ لِرَبِّكَ وَانْحَرْ ۝ إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ',
    latin: 'Innā a‘ṭainākal-kauṡar. Faṣalli lirabbika wanḥar. Inna syāni’aka huwal-abtar.',
    arti: 'Sesungguhnya Kami telah memberimu (nikmat) yang banyak. Maka laksanakan salat karena Tuhanmu dan berkurbanlah. Sesungguhnya orang yang membencimu, dialah yang terputus (dari kebaikan).',
    asbabunNuzul:
      'Ketika putra Nabi ﷺ wafat, kaum musyrikin — di antaranya Al-‘Āṣ bin Wā’il — mengejek beliau sebagai "abtar" (terputus keturunan, tanpa penerus). Maka Allah menurunkan surah ini: bukan beliau yang terputus, justru beliau diberi «al-kauṡar» (kebaikan melimpah), & si pencemoohlah yang sejatinya terputus dari segala kebaikan.',
    tafsir:
      'Allah menghibur Nabi ﷺ dengan kabar pemberian melimpah — termasuk telaga Al-Kauṡar di surga — lalu memerintahkan syukur lewat salat & kurban, serta menutup ejekan musuh dengan bantahan telak.',
    hikmah:
      'Penghinaan manusia tidak menentukan nilaimu di sisi Allah — yang mengejek justru bisa jadi dialah yang "terputus" dari kebaikan. Balasan terbaik atas cemoohan bukan dendam, melainkan menambah ketaatan & syukur (salat & kurban), sehingga energi sakit hati diubah menjadi ibadah. Lebih dalam, ayat ini mengajarkan sumber harga diri seorang mukmin: bukan dari pengakuan manusia yang fana, tapi dari pemberian Allah yang melimpah & kekal.',
    linguistik:
      'Kata «الْكَوْثَر» mengikuti wazan «فَوْعَل» (fau‘al) yang menunjukkan INTENSITAS berlebih — berasal dari «كَثْرَة» (banyak), sehingga maknanya bukan sekadar "banyak", tapi "kebaikan yang melimpah-ruah tak terhingga". Seandainya dipakai «كَثِير» (banyak biasa), hilanglah nuansa "meluap tanpa batas" itu. Balaghah-nya makin memukau: musuh menuduh Nabi «أَبْتَر» (terputus), lalu Allah menutup surah dengan kata yang SAMA «الْأَبْتَر» — membalikkan tuduhan tepat ke pelakunya (gaya «radd al-‘ajuz ‘alā al-ṣadr»). Ditambah «إِنَّا أَعْطَيْنَا» (Kami telah memberi) dengan bentuk LAMPAU yang pasti + kata ganti keagungan — pemberian yang sudah terjamin, bukan janji yang masih ditunggu. Surah terpendek dalam Al-Qur’an, namun menumbangkan ejekan terbesar.',
    sorotan: {
      dipilih: 'الْكَوْثَر', labelDipilih: 'Pola فَوْعَل → melimpah tak terhingga',
      lain: 'كَثِير', labelLain: '"banyak" biasa',
      hikmah: 'Dipilih «al-Kauṡar» (pola fau‘al yang intensif), bukan «kaṡīr» (banyak biasa). Polanya menyiratkan kebaikan yang MELUAP tak terhingga — bukan sekadar banyak. Jawaban melimpah atas ejekan "terputus".',
    },
    amalan: [
      'Saat direndahkan/dibully/merasa "tak punya apa-apa", hitung ulang nikmatmu yang melimpah.',
      'Respons hinaan dengan menambah ibadah, bukan membalas — ubah sakit hati jadi salat.',
      'Jadikan salat tempat mengadu, bukan media sosial.',
      'Tanam harga diri dari pemberian Allah, bukan dari pengakuan manusia.',
    ],
    sumber: ['Tafsir Ibnu Katsir', 'Asbabun Nuzul Al-Wahidi', 'Tafsir Al-Qurthubi'],
  },
  {
    id: 'al-ikhlas-1-4', surah: 'Al-Ikhlāṣ', surahNo: 112, ayatNo: '1–4', juz: 30,
    tema: ['Tauhid', 'Mengenal Allah'], gratis: false,
    arab: 'قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
    latin: 'Qul huwallāhu aḥad. Allāhuṣ-ṣamad. Lam yalid wa lam yūlad. Wa lam yakul lahū kufuwan aḥad.',
    arti: 'Katakanlah: Dialah Allah, Yang Maha Esa. Allah tempat bergantung segala sesuatu. Dia tidak beranak dan tidak diperanakkan. Dan tidak ada sesuatu pun yang setara dengan Dia.',
    asbabunNuzul:
      'Diriwayatkan kaum musyrikin (dalam riwayat lain orang Yahudi) berkata kepada Nabi ﷺ: "Gambarkan kepada kami Tuhanmu, dari apa Dia tercipta?" Maka turun surah ini sebagai jawaban menyeluruh tentang hakikat Allah (HR. Tirmidzi & Ahmad). Surah ini setara sepertiga Al-Qur’an karena memuat inti akidah.',
    tafsir:
      'Empat ayat ringkas menjawab pertanyaan terbesar manusia: siapa Tuhan? Dia Esa tanpa sekutu, tempat bergantung seluruh makhluk, tidak berasal-usul & tidak melahirkan, serta tidak ada yang menyamai-Nya dalam bentuk apa pun.',
    hikmah:
      'Akidah yang bersih adalah fondasi seluruh amal — tanpa mengenal Allah dengan benar, ibadah bisa salah arah. Memahami bahwa hanya Allah tempat bergantung («Aṣ-Ṣamad») membebaskan hati dari menggantungkan harap pada makhluk yang lemah & fana. Lebih dalam, surah ini menjawab kebutuhan terdalam manusia akan kepastian tentang Tuhannya: di tengah kebingungan banyak agama & konsep ketuhanan, Al-Ikhlas memberi definisi yang jernih, ringkas, & tak tergoyahkan — itulah kenapa nilainya sepertiga Al-Qur’an.',
    linguistik:
      'Dipilih kata «أَحَد», BUKAN «وَاحِد». «Wāḥid» (satu) adalah bilangan yang bisa diikuti dua, tiga, & seterusnya, serta bisa terbagi; sedangkan «Aḥad» menunjuk keesaan MUTLAK yang tak dapat dibagi, ditambah, atau disusun — keunikan yang khusus bagi Allah & tak dipakai untuk makhluk dalam makna ini. Lalu «الصَّمَد»: tuan sempurna yang menjadi TUMPUAN seluruh kebutuhan makhluk, sementara Dia sendiri tak butuh apa pun — sebuah kata padat yang nyaris mustahil diterjemahkan dengan satu kata. Frasa «لَمْ يَلِدْ وَلَمْ يُولَدْ» menafikan keturunan dari DUA arah sekaligus (tidak menurunkan & tidak diturunkan), menutup seluruh celah penyimpangan akidah. Dan surah dibuka «Aḥad» & ditutup «Aḥad» — bingkai (framing) yang sempurna.',
    sorotan: {
      dipilih: 'أَحَد', labelDipilih: 'Esa MUTLAK, tak terbagi',
      lain: 'وَاحِد', labelLain: '"satu" yang bisa diikuti dua, tiga…',
      hikmah: 'Dipilih «Aḥad», bukan «Wāḥid». «Wāḥid» (satu) bisa diikuti angka lain & bisa terbagi; «Aḥad» adalah keesaan mutlak yang tak dapat dibagi, ditambah, atau disusun — keunikan yang hanya milik Allah.',
    },
    amalan: [
      'Jadikan Al-Ikhlas wirid harian; membacanya 3x menyamai pahala khatam sepertiga Al-Qur’an.',
      'Saat hati mulai bergantung berlebihan pada atasan/pasangan/harta, ulangi «Allāhuṣ-ṣamad».',
      'Perbaiki niat ibadah agar murni untuk Allah Yang Esa, bukan untuk pujian makhluk.',
      'Pelajari & ajarkan makna tauhid yang bersih kepada keluarga.',
    ],
    sumber: ['Tafsir Ibnu Katsir', 'Jami‘ at-Tirmidzi no. 3364', 'Sahih Bukhari (keutamaan Al-Ikhlas)'],
  },
];

// Ayat Hari Ini — berputar stabil berdasarkan tanggal (sama untuk semua dalam satu hari)
function ayatHariIni() {
  const epoch = Date.UTC(2024, 0, 1);
  const hari = Math.floor((Date.now() - epoch) / 86400000);
  return AYAT[((hari % AYAT.length) + AYAT.length) % AYAT.length];
}

function cariAyat(id) { return AYAT.find(a => a.id === id) || null; }

window.AYAT = AYAT;
window.ayatHariIni = ayatHariIni;
window.cariAyat = cariAyat;

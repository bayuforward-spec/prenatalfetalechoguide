/*
 * content.js — Mesin konten The Quran Lens.
 *
 * Setiap ayat mengikuti SATU skema baku berisi 6 lapisan tadabbur:
 *   1. Teks  : arab + latin (transliterasi) + arti (terjemah)
 *   2. asbabunNuzul : sebab/latar turunnya ayat (jujur bila tidak ada riwayat khusus)
 *   3. tafsir       : penjelasan makna ringkas
 *   4. hikmah       : pelajaran/ibrah inti
 *   5. linguistik   : keajaiban bahasa (i'jaz/balaghah) — "kenapa kata ini?"  ← pembeda utama
 *   6. amalan       : contoh penerapan & kasus keseharian
 *   + sumber        : rujukan tafsir agar kredibel
 *
 * Urutan array mengikuti tertib mushaf. CARA MENAMBAH AYAT BARU: salin satu objek,
 * ganti isinya, tempel pada posisi yang sesuai. `gratis: true` membuka seluruh
 * lapisan tanpa Premium (untuk etalase/teaser).
 */
const AYAT = [
  /* ============ SURAH AL-FĀTIḤAH (1) ============ */
  {
    id: 'al-fatihah-1',
    surah: 'Al-Fātiḥah',
    surahNo: 1,
    ayatNo: '1',
    juz: 1,
    tema: ['Pembuka', 'Rahmat', 'Nama Allah'],
    gratis: true, // etalase — terbuka penuh sebagai contoh kualitas
    arab: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    latin: 'Bismillāhir-raḥmānir-raḥīm.',
    arti: 'Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang.',
    asbabunNuzul:
      'Tidak ada riwayat asbabun nuzul khusus untuk basmalah sebagai pembuka Al-Fatihah. Al-Fatihah dikenal sebagai "Ummul Kitab" (induk Al-Qur’an) dan "As-Sab‘ul Maṡāni" (tujuh ayat yang diulang), dibaca pada setiap rakaat salat. Basmalah menjadi pembuka hampir seluruh surah, mengajarkan memulai segala hal dengan nama Allah.',
    tafsir:
      'Memulai dengan menyebut nama Allah, memohon pertolongan dan keberkahan-Nya, sekaligus menegaskan bahwa segala aktivitas dilakukan karena dan dengan-Nya. Dua sifat rahmat disebut untuk menanamkan harap kepada kasih sayang Allah sejak kata pertama.',
    hikmah:
      'Hidup yang diawali "Bismillah" adalah hidup yang disandarkan pada Allah, bukan pada kekuatan diri. Membiasakannya menjadikan aktivitas biasa bernilai ibadah.',
    linguistik:
      'Dua nama dipilih dari akar yang sama (raḥmah): «Ar-Raḥmān» dan «Ar-Raḥīm». «Ar-Raḥmān» berpola «fa‘lān» yang menunjukkan keluasan dan kepenuhan — rahmat yang meliputi SELURUH makhluk, mukmin maupun kafir, di dunia. «Ar-Raḥīm» berpola «fa‘īl» yang menunjukkan kesinambungan & kekhususan — rahmat yang terus-menerus, khusus bagi orang beriman di akhirat. Maka berpasangan keduanya merangkum rahmat Allah yang luas (kuantitas) sekaligus kekal (kontinuitas) — keseimbangan yang tak terwakili satu kata saja.',
    amalan:
      'Biasakan ucapkan "Bismillah" saat makan, masuk rumah, bekerja, hingga menyalakan kendaraan. Saat merasa berat memulai sesuatu (tugas, taubat, langkah baru), mulailah dengan menyebut nama Allah agar hati lebih ringan dan yakin ditolong.',
    sumber: ['Tafsir Ibnu Katsir', 'Tafsir As-Sa‘di', 'Tafsir Al-Qurthubi'],
  },
  {
    id: 'al-fatihah-2',
    surah: 'Al-Fātiḥah',
    surahNo: 1,
    ayatNo: '2',
    juz: 1,
    tema: ['Syukur', 'Pujian', 'Tauhid Rububiyah'],
    gratis: false,
    arab: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
    latin: 'Al-ḥamdu lillāhi rabbil-‘ālamīn.',
    arti: 'Segala puji bagi Allah, Tuhan seluruh alam.',
    asbabunNuzul:
      'Tidak ada asbabun nuzul khusus. Ayat ini adalah pujian pembuka yang Allah ajarkan kepada hamba-Nya. Dalam hadis qudsi (HR. Muslim), saat hamba membaca "Alhamdulillāhi rabbil ‘ālamīn", Allah menjawab: "Hamba-Ku telah memuji-Ku."',
    tafsir:
      'Segala bentuk pujian — atas zat, nikmat, dan perbuatan-Nya — adalah milik Allah semata. Dia "Rabb" seluruh alam: yang menciptakan, memiliki, memelihara, dan mengatur segala sesuatu, dari manusia, jin, hingga seluruh makhluk.',
    hikmah:
      'Kesadaran bahwa segala pujian kembali kepada Allah membersihkan hati dari ujub dan menumbuhkan syukur. Setiap kebaikan yang kita miliki hakikatnya pemberian-Nya.',
    linguistik:
      'Dipilih «al-ḥamd» (dengan alif-lam istighrāq) bukan «ḥamd» — maknanya SEGALA jenis pujian, mutlak dan menyeluruh, hanya milik Allah. «Ḥamd» pun berbeda dari «madḥ»: ḥamd adalah pujian yang disertai cinta dan pengagungan, sedangkan madḥ bisa sekadar sanjungan tanpa rasa. Lalu «Rabb» — satu kata padat yang mencakup Pencipta, Pemilik, Pemelihara, sekaligus Pengatur; jauh lebih luas dari sekадar "Tuhan". «Al-‘ālamīn» (seluruh alam) menegaskan rububiyah-Nya tak terbatas pada manusia saja.',
    amalan:
      'Jadikan "Alhamdulillah" refleks atas nikmat kecil sekalipun (napas, makanan, kesehatan). Latih "jurnal syukur" — tulis 3 nikmat tiap malam. Saat mengeluh, hentikan dan ganti dengan menghitung yang sudah Allah beri.',
    sumber: ['Tafsir Ibnu Katsir', 'Sahih Muslim no. 395', 'Tafsir As-Sa‘di'],
  },
  {
    id: 'al-fatihah-3',
    surah: 'Al-Fātiḥah',
    surahNo: 1,
    ayatNo: '3',
    juz: 1,
    tema: ['Rahmat', 'Harap', 'Nama Allah'],
    gratis: false,
    arab: 'الرَّحْمَٰنِ الرَّحِيمِ',
    latin: 'Ar-raḥmānir-raḥīm.',
    arti: 'Yang Maha Pengasih lagi Maha Penyayang.',
    asbabunNuzul:
      'Tidak ada asbabun nuzul khusus. Penyebutan ulang dua nama rahmat setelah "Rabbil ‘ālamīn" punya peran retoris penting dalam susunan surah.',
    tafsir:
      'Setelah menegaskan Allah sebagai Penguasa & Pengatur seluruh alam, Dia menyebut kembali rahmat-Nya agar pengagungan tidak melahirkan rasa takut yang berlebihan, melainkan diimbangi harap pada kasih sayang-Nya.',
    hikmah:
      'Mengenal Allah harus seimbang antara mengagungkan keperkasaan-Nya dan mengharap rahmat-Nya. Inilah jalan tengah antara takut dan harap (khauf wa rajā’).',
    linguistik:
      'Perhatikan penempatannya. Setelah «Rabbil ‘ālamīn» yang menonjolkan kekuasaan dan keagungan (bisa membangkitkan rasa gentar), Allah segera mengulang «Ar-Raḥmānir-Raḥīm». Susunan ini menyeimbangkan jiwa: tepat saat hati membesarkan keagungan-Nya, ia langsung ditenangkan oleh rahmat-Nya. Pengulangan di sini bukan sekadar penegasan, tapi penataan emosi pembaca — sebuah keindahan struktur (naẓm) yang khas Al-Qur’an.',
    amalan:
      'Saat merasa dosa terlalu banyak hingga putus asa dari ampunan, ingat ayat ini: Penguasa semesta itu Maha Pengasih. Jangan biarkan rasa takut menjauhkanmu dari-Nya; justru datang dan memohon ampun adalah wujud beriman pada rahmat-Nya.',
    sumber: ['Tafsir Ibnu Katsir', 'Tafsir As-Sa‘di', 'Tafsir Al-Qurthubi'],
  },
  {
    id: 'al-fatihah-4',
    surah: 'Al-Fātiḥah',
    surahNo: 1,
    ayatNo: '4',
    juz: 1,
    tema: ['Akhirat', 'Hisab', 'Tanggung jawab'],
    gratis: false,
    arab: 'مَالِكِ يَوْمِ الدِّينِ',
    latin: 'Māliki yaumid-dīn.',
    arti: 'Pemilik (Raja) hari pembalasan.',
    asbabunNuzul:
      'Tidak ada asbabun nuzul khusus. Ayat ini mengalihkan kesadaran pembaca dari rahmat ke pertanggungjawaban, menyeimbangkan harap dengan rasa tanggung jawab.',
    tafsir:
      'Allah satu-satunya Penguasa mutlak pada hari pembalasan — hari ketika setiap jiwa menerima balasan amalnya, tanpa ada kekuasaan lain yang berbagi otoritas dengan-Nya.',
    hikmah:
      'Keyakinan akan hari pembalasan adalah rem moral terkuat: ia menjaga manusia tetap jujur saat sendirian, karena sadar semua dipertanggungjawabkan.',
    linguistik:
      'Ada dua qira’at mutawatir yang keduanya sahih: «Māliki» (Pemilik) dan «Māliki» dibaca «Māliki/Māaliki» (Raja/Penguasa). Keindahannya, kedua bacaan saling melengkapi makna: «Mālik» menekankan kepemilikan penuh atas hari itu, sedangkan «Malik» menekankan kedaulatan & otoritas memerintah. Dipilih pula «yaumid-dīn» (hari pembalasan) — kata «dīn» di sini bermakna "balasan/perhitungan", menegaskan bahwa hari itu adalah hari keadilan sempurna, bukan sekadar akhir kehidupan.',
    amalan:
      'Sebelum mengambil keputusan saat tidak ada yang melihat (transaksi, ujian, janji), hadirkan kesadaran "Māliki yaumid-dīn" — ada hari ketika ini semua dihisab. Ini melatih integritas dari dalam, bukan karena takut manusia.',
    sumber: ['Tafsir Ibnu Katsir', 'Tafsir Al-Qurthubi', 'Kitab qira’at mutawatir'],
  },
  {
    id: 'al-fatihah-5',
    surah: 'Al-Fātiḥah',
    surahNo: 1,
    ayatNo: '5',
    juz: 1,
    tema: ['Tauhid', 'Ibadah', 'Tawakal'],
    gratis: false,
    arab: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
    latin: 'Iyyāka na‘budu wa iyyāka nasta‘īn.',
    arti: 'Hanya kepada Engkau kami menyembah dan hanya kepada Engkau kami memohon pertolongan.',
    asbabunNuzul:
      'Tidak ada asbabun nuzul khusus. Ayat ini adalah poros Al-Fatihah: peralihan dari memuji Allah (ayat 1–4) menuju ikrar penghambaan dan permohonan (ayat 5–7). Dalam hadis qudsi, Allah menyebut ayat ini "antara Aku dan hamba-Ku".',
    tafsir:
      'Pengakuan bahwa ibadah hanya ditujukan kepada Allah, dan pertolongan hanya dimohon dari-Nya. Ibadah didahulukan atas permohonan: tunaikan dulu hak Allah, baru sampaikan kebutuhan diri.',
    hikmah:
      'Tauhid sejati: tidak menyembah selain Allah dan tidak menggantungkan harap pada selain-Nya. Inilah inti kemerdekaan jiwa dari perbudakan kepada makhluk.',
    linguistik:
      'Inilah keajaiban yang sering membuat orang merinding. Kata «iyyāka» (objek: "hanya kepada-Mu") didahulukan sebelum kata kerja «na‘budu» (menyembah). Dalam kaidah balaghah, mendahulukan objek (taqdīmul ma‘mūl) berfungsi sebagai «ḥaṣr» — pembatasan mutlak: "hanya kepada-Mu, tidak kepada yang lain." Lebih menakjubkan lagi, terjadi «iltifāt» (peralihan gaya): dari membicarakan Allah sebagai orang ketiga ("Dia, Tuhan semesta alam") menjadi menyapa-Nya langsung sebagai orang kedua ("Engkau"). Seolah, setelah memuji-Nya, hamba menjadi begitu dekat hingga berani berbicara langsung di hadapan-Nya. Dan «na‘budu» didahulukan dari «nasta‘īn»: hak Allah (ibadah) sebelum kepentingan diri (pertolongan).',
    amalan:
      'Resapi ayat ini di setiap salat sebagai pembaruan ikrar: aku tak mengabdi pada gengsi, atasan, atau harta — hanya pada Allah. Saat menghadapi masalah, datangi Allah lebih dulu (doa, salat hajat) sebelum bergantung pada manusia.',
    sumber: ['Tafsir Ibnu Katsir', 'Sahih Muslim no. 395 (hadis qudsi)', 'Tafsir As-Sa‘di'],
  },
  {
    id: 'al-fatihah-6',
    surah: 'Al-Fātiḥah',
    surahNo: 1,
    ayatNo: '6',
    juz: 1,
    tema: ['Hidayah', 'Doa', 'Istiqamah'],
    gratis: false,
    arab: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
    latin: 'Ihdinaṣ-ṣirāṭal-mustaqīm.',
    arti: 'Tunjukilah kami jalan yang lurus.',
    asbabunNuzul:
      'Tidak ada asbabun nuzul khusus. Inilah inti permohonan dalam Al-Fatihah; karena itu kita memintanya minimal 17 kali sehari dalam salat fardu.',
    tafsir:
      'Permohonan agar Allah membimbing kepada jalan yang lurus — yaitu Islam, kebenaran, dan jalan para nabi serta orang saleh — sekaligus diteguhkan di atasnya hingga akhir hayat.',
    hikmah:
      'Meski sudah muslim, kita tetap memohon hidayah setiap hari, karena hidayah bukan sekadar status, melainkan bimbingan yang terus dibutuhkan di setiap langkah dan keputusan.',
    linguistik:
      'Dipilih «aṣ-ṣirāṭ» (jalan) dalam bentuk tunggal-definitif (ma‘rifah): satu jalan lurus yang jelas, berlawanan dengan ayat lain yang menyebut «subul» (jalan-jalan, jamak) untuk jalan-jalan sesat yang bercabang. «Al-mustaqīm» berarti lurus tanpa belok — jalan terdekat menuju tujuan. Menariknya, doa ini memakai kata kerja perintah «ihdinā» (bimbinglah kami) padahal diucapkan oleh orang yang sudah beriman — menyiratkan bahwa hidayah berlapis: hidayah menuju kebenaran DAN hidayah keteguhan di atasnya.',
    amalan:
      'Saat membaca ayat ini dalam salat, hadirkan benar-benar permohonannya — jangan otomatis. Jadikan ia doa saat bingung mengambil keputusan besar (karier, jodoh, hijrah): "Ya Allah, tunjukkan jalan yang lurus." Lalu ikhtiar dengan ilmu dan istikharah.',
    sumber: ['Tafsir Ibnu Katsir', 'Tafsir As-Sa‘di', 'Tafsir Al-Qurthubi'],
  },
  {
    id: 'al-fatihah-7',
    surah: 'Al-Fātiḥah',
    surahNo: 1,
    ayatNo: '7',
    juz: 1,
    tema: ['Teladan', 'Adab', 'Jalan keselamatan'],
    gratis: false,
    arab: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
    latin: 'Ṣirāṭal-lażīna an‘amta ‘alaihim gairil-magḍūbi ‘alaihim wa laḍ-ḍāllīn.',
    arti: '(Yaitu) jalan orang-orang yang telah Engkau beri nikmat, bukan (jalan) mereka yang dimurkai, dan bukan (pula jalan) mereka yang sesat.',
    asbabunNuzul:
      'Tidak ada asbabun nuzul khusus. Nabi ﷺ menjelaskan tiga golongan ini: yang diberi nikmat adalah para nabi, shiddiqin, syuhada, dan saleh; yang dimurkai dan yang sesat disebutkan dalam beberapa riwayat sebagai gambaran umum dua bentuk penyimpangan (mengetahui kebenaran lalu meninggalkannya, dan beramal tanpa ilmu).',
    tafsir:
      'Jalan lurus diperjelas sebagai jalan orang-orang yang Allah beri nikmat hidayah, bukan jalan dua golongan yang menyimpang: yang menyimpang karena meninggalkan kebenaran yang diketahui, dan yang menyimpang karena beramal tanpa ilmu.',
    hikmah:
      'Keselamatan menuntut dua hal sekaligus: ilmu yang benar DAN amal yang lurus. Ilmu tanpa amal dan amal tanpa ilmu sama-sama tergelincir.',
    linguistik:
      'Perhatikan keindahan adab dalam pemilihan kata. Saat menyebut nikmat, Allah memakai kalimat aktif yang menyandarkan langsung kepada diri-Nya: «an‘amta ‘alaihim» (Engkau yang memberi nikmat). Namun saat menyebut murka, dipakai bentuk pasif «al-magḍūbi ‘alaihim» (mereka yang dimurkai) — TIDAK dikatakan "yang Engkau murkai". Penyandaran nikmat kepada Allah dan penghindaran penyandaran murka secara langsung adalah puncak adab dalam berbicara tentang Allah: kebaikan dinisbatkan kepada-Nya, sedangkan keburukan tidak dilekatkan langsung pada-Nya, sebab murka itu lahir dari perbuatan hamba sendiri.',
    amalan:
      'Setelah membaca ayat ini, ucapkan "āmīn" dengan penuh harap. Jadikan ia pengingat untuk selalu memadukan ilmu dan amal: jangan menunda mengamalkan kebaikan yang sudah diketahui, dan jangan beribadah/bermuamalah tanpa belajar dasarnya lebih dulu.',
    sumber: ['Tafsir Ibnu Katsir', 'Jami‘ at-Tirmidzi (riwayat tiga golongan)', 'Tafsir As-Sa‘di'],
  },

  /* ============ SURAH AL-BAQARAH (2) ============ */
  {
    id: 'al-baqarah-1',
    surah: 'Al-Baqarah',
    surahNo: 2,
    ayatNo: '1',
    juz: 1,
    tema: ['Mukjizat', 'Tantangan i\'jaz', 'Tawadu ilmu'],
    gratis: false,
    arab: 'الم',
    latin: 'Alif Lām Mīm.',
    arti: 'Alif Lām Mīm.',
    asbabunNuzul:
      'Tidak ada asbabun nuzul khusus. "Alif Lām Mīm" termasuk «al-ḥurūf al-muqaṭṭa‘ah» (huruf-huruf terpisah) yang membuka 29 surah. Para ulama berbeda pendapat tentang maknanya; sikap paling selamat: "Allah lebih tahu maksudnya" sembari merenungkan hikmah penempatannya.',
    tafsir:
      'Huruf-huruf terpotong yang mengawali sebagian surah. Banyak ulama salaf menyerahkan maknanya kepada Allah, namun sepakat akan adanya hikmah besar di baliknya, terutama kaitannya dengan kemukjizatan Al-Qur’an.',
    hikmah:
      'Tidak semua hal harus kita pahami tuntas untuk kita imani. Ada wilayah ilmu yang menuntut ketundukan dan kerendahan hati di hadapan Allah.',
    linguistik:
      'Inilah salah satu isyarat i‘jāz yang paling memukau. Surah-surah berhuruf muqaṭṭa‘ah hampir selalu disusul penyebutan tentang Al-Qur’an (di sini: «Żālikal-kitāb…»). Seolah Allah menantang: Al-Qur’an ini tersusun dari huruf-huruf yang SAMA PERSIS dengan yang kalian (bangsa Arab) kuasai dan banggakan — alif, lām, mīm — namun kalian tetap tak mampu menyusun yang menyamainya. Tantangan «i‘jāz» disampaikan justru lewat bahan baku yang paling dikenal lawan, membungkam mereka dengan "senjata" mereka sendiri. Para ahli bahasa Arab terbaik pun tak sanggup menjawabnya.',
    amalan:
      'Saat menemui hal dalam agama yang belum kau pahami, jangan terburu menolak; akui keterbatasan ilmu dan teruslah belajar. Jadikan huruf-huruf ini pengingat untuk merenungi betapa Al-Qur’an mustahil dikarang manusia — penguat iman saat ragu.',
    sumber: ['Tafsir Ibnu Katsir', 'Tafsir Al-Qurthubi', 'Tafsir As-Sa‘di'],
  },
  {
    id: 'al-baqarah-2',
    surah: 'Al-Baqarah',
    surahNo: 2,
    ayatNo: '2',
    juz: 1,
    tema: ['Petunjuk', 'Takwa', 'Keyakinan'],
    gratis: false,
    arab: 'ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ',
    latin: 'Żālikal-kitābu lā raiba fīh, hudal lil-muttaqīn.',
    arti: 'Kitab (Al-Qur’an) ini tidak ada keraguan padanya; petunjuk bagi mereka yang bertakwa.',
    asbabunNuzul:
      'Tidak ada asbabun nuzul khusus. Ayat ini menegaskan kedudukan Al-Qur’an sebagai kitab yang pasti benar dan menjadi petunjuk, tepat setelah isyarat kemukjizatan pada "Alif Lām Mīm".',
    tafsir:
      'Al-Qur’an adalah kitab yang sama sekali tidak mengandung keraguan tentang asal (dari Allah) maupun isinya. Ia menjadi petunjuk yang benar-benar membimbing — khususnya berbuah pada orang yang bertakwa, karena merekalah yang membuka hati untuk menerimanya.',
    hikmah:
      'Petunjuk Al-Qur’an bersifat objektif & sempurna, tetapi yang memetik manfaatnya adalah hati yang siap (bertakwa). Hidayah butuh kitab yang benar sekaligus hati yang terbuka.',
    linguistik:
      'Dipilih kata tunjuk «żālika» (itu — untuk yang jauh), bukan «hāżā» (ini — untuk yang dekat), padahal Al-Qur’an ada di hadapan. Pemakaian isyarat "jauh" di sini justru untuk MENGAGUNGKAN: menunjuk ketinggian dan keluhuran derajat kitab ini, seakan kedudukannya jauh tinggi di atas. Lalu «lā raiba fīh» — peniadaan keraguan dengan «lā» yang menafikan jenis (tidak ada keraguan apa pun, sekecil apa pun). Dan «hudan» (petunjuk) berbentuk nakirah untuk mengisyaratkan keagungan dan keluasan petunjuk itu. Susunan ini menegaskan kepastian mutlak sekaligus kemuliaan kitab dalam beberapa kata ringkas.',
    amalan:
      'Bangun hubungan harian dengan Al-Qur’an meski sedikit (satu ayat dengan maknanya). Tingkatkan takwa — sebab makin bertakwa, makin terbuka pintu memahami petunjuknya. Saat ragu dalam hidup, kembalikan standar pada Al-Qur’an yang "lā raiba fīh".',
    sumber: ['Tafsir Ibnu Katsir', 'Tafsir As-Sa‘di', 'Tafsir Al-Qurthubi'],
  },
  {
    id: 'al-baqarah-3-4',
    surah: 'Al-Baqarah',
    surahNo: 2,
    ayatNo: '3–4',
    juz: 1,
    tema: ['Iman', 'Salat', 'Sedekah'],
    gratis: false,
    arab: 'الَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ وَيُقِيمُونَ الصَّلَاةَ وَمِمَّا رَزَقْنَاهُمْ يُنفِقُونَ ۝ وَالَّذِينَ يُؤْمِنُونَ بِمَا أُنزِلَ إِلَيْكَ وَمَا أُنزِلَ مِن قَبْلِكَ وَبِالْآخِرَةِ هُمْ يُوقِنُونَ',
    latin: 'Allażīna yu’minūna bil-gaibi wa yuqīmūnaṣ-ṣalāta wa mimmā razaqnāhum yunfiqūn. Wallażīna yu’minūna bimā unzila ilaika wa mā unzila min qablika wa bil-ākhirati hum yūqinūn.',
    arti: '(Yaitu) mereka yang beriman kepada yang gaib, menegakkan salat, dan menginfakkan sebagian rezeki yang Kami berikan. Dan mereka yang beriman kepada (Al-Qur’an) yang diturunkan kepadamu dan (kitab-kitab) yang diturunkan sebelummu, serta yakin akan adanya akhirat.',
    asbabunNuzul:
      'Tidak ada asbabun nuzul khusus. Ayat ini merinci sifat "al-muttaqīn" yang disebut pada ayat sebelumnya — siapa sebenarnya mereka yang memperoleh petunjuk Al-Qur’an.',
    tafsir:
      'Allah menyebut lima ciri orang bertakwa: beriman pada yang gaib, menegakkan salat, berinfak, beriman pada seluruh wahyu (yang diturunkan kepada Nabi ﷺ dan para nabi sebelumnya), serta yakin penuh akan akhirat. Iman batin diwujudkan dalam ibadah (salat) dan kepedulian sosial (infak).',
    hikmah:
      'Takwa bukan klaim di hati saja; ia terbukti dalam ibadah ritual (salat), kepedulian harta (infak), dan keyakinan yang utuh pada wahyu dan akhirat.',
    linguistik:
      'Cermati pilihan kata «yu’minūna bil-gaib» — beriman pada yang GAIB; inilah hakikat iman: membenarkan apa yang tak terindra karena percaya pada sumbernya (wahyu). Lalu «yuqīmūna» (menegakkan), bukan sekadar "mengerjakan" salat — «iqāmah» berarti menunaikannya dengan sempurna syarat, rukun, dan kekhusyukannya. Pada infak dipilih «mimmā razaqnāhum» (SEBAGIAN dari rezeki yang KAMI berikan): kata "sebagian" (huruf «min» yang menunjukkan tab‘īḍ) meringankan — tak diminta semuanya; dan "rezeki dari Kami" mengingatkan bahwa harta itu titipan Allah, sehingga berinfak sejatinya mengembalikan sebagian pemberian-Nya. Pada keyakinan akhirat, kata «hum» didahulukan («hum yūqinūn») untuk menegaskan kekhususan: merekalah yang benar-benar yakin.',
    amalan:
      'Audit lima ciri ini pada dirimu: kualitas imanmu pada yang gaib, kekhusyukan salatmu (bukan sekadar gugur kewajiban), rutinitas sedekahmu (mulai dari nominal kecil tapi konsisten), dan kesungguhan menyiapkan bekal akhirat. Pilih satu yang paling lemah untuk diperbaiki pekan ini.',
    sumber: ['Tafsir Ibnu Katsir', 'Tafsir As-Sa‘di', 'Tafsir Al-Qurthubi'],
  },
  {
    id: 'al-baqarah-5',
    surah: 'Al-Baqarah',
    surahNo: 2,
    ayatNo: '5',
    juz: 1,
    tema: ['Keberuntungan', 'Hidayah', 'Optimisme'],
    gratis: false,
    arab: 'أُولَٰئِكَ عَلَىٰ هُدًى مِّن رَّبِّهِمْ ۖ وَأُولَٰئِكَ هُمُ الْمُفْلِحُونَ',
    latin: 'Ulā’ika ‘alā hudam mir rabbihim, wa ulā’ika humul-mufliḥūn.',
    arti: 'Merekalah yang mendapat petunjuk dari Tuhannya, dan merekalah orang-orang yang beruntung.',
    asbabunNuzul:
      'Tidak ada asbabun nuzul khusus. Ayat ini adalah kesimpulan & "kabar gembira" bagi orang-orang yang memiliki sifat takwa pada ayat 3–4.',
    tafsir:
      'Orang-orang dengan sifat di atas itulah yang benar-benar berada di atas petunjuk dari Tuhan mereka, dan merekalah yang meraih keberuntungan hakiki — kemenangan di dunia dan keselamatan di akhirat.',
    hikmah:
      'Keberuntungan sejati (falāḥ) bukan diukur dari harta atau jabatan, melainkan dari hidayah dan keselamatan akhirat. Inilah definisi sukses dalam pandangan Al-Qur’an.',
    linguistik:
      'Dipilih ungkapan «‘alā hudan» — dengan kata «‘alā» (di atas) — bukan sekadar "mendapat petunjuk". Gambarannya: mereka seakan BERADA DI ATAS dan ditopang oleh petunjuk, kokoh dan mantap, seperti penunggang yang menguasai kendaraannya — bukan sekadar tersentuh hidayah sesekali. Lalu pengulangan «ulā’ika» (mereka itu) dua kali menegaskan dan memuliakan kedudukan mereka. Penutupnya «humul-mufliḥūn» memakai «hum» (kata ganti pemisah) yang berfungsi «ḥaṣr»: HANYA merekalah orang-orang yang beruntung — keberuntungan sejati dikhususkan bagi mereka, bukan yang lain. «Al-falāḥ» sendiri berasal dari makna "membelah/menembus", yakni meraih yang diharapkan dan selamat dari yang ditakuti.',
    amalan:
      'Definisikan ulang "sukses" dalam hidupmu memakai standar ayat ini. Saat membandingkan diri dengan pencapaian dunia orang lain di media sosial, ingat: «al-mufliḥūn» adalah mereka yang di atas hidayah. Tetapkan satu target "keberuntungan akhirat" (mis. konsistensi ibadah) sepenting target karier.',
    sumber: ['Tafsir Ibnu Katsir', 'Tafsir As-Sa‘di', 'Tafsir Al-Qurthubi'],
  },
  {
    id: 'al-baqarah-255',
    surah: 'Al-Baqarah',
    surahNo: 2,
    ayatNo: '255 (Ayat Kursi)',
    juz: 3,
    tema: ['Tauhid', 'Perlindungan', 'Keagungan Allah'],
    gratis: false,
    arab: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ',
    latin: 'Allāhu lā ilāha illā huw, al-ḥayyul-qayyūm. Lā ta’khużuhū sinatuw wa lā naum…',
    arti: 'Allah, tidak ada tuhan selain Dia, Yang Maha Hidup lagi terus-menerus mengurus (makhluk-Nya). Tidak mengantuk dan tidak tidur… Kursi-Nya meliputi langit dan bumi, dan Dia tidak merasa berat memelihara keduanya. Dialah Yang Maha Tinggi lagi Maha Besar.',
    asbabunNuzul:
      'Ayat Kursi tidak memiliki riwayat asbabun nuzul khusus yang sahih — ia bagian dari Surah Al-Baqarah yang turun di Madinah. Namun keutamaannya sangat masyhur: Nabi ﷺ menyebutnya ayat teragung dalam Al-Qur’an (HR. Muslim), dan membacanya menjadi pelindung, sebagaimana kisah Abu Hurairah dengan setan yang mencuri zakat (HR. Bukhari).',
    tafsir:
      'Ayat ini merangkum keagungan Allah: keesaan-Nya, kehidupan-Nya yang sempurna, pengaturan-Nya yang tak pernah lalai, kepemilikan-Nya atas segala isi langit-bumi, luasnya ilmu dan kekuasaan-Nya, hingga Kursi-Nya yang meliputi semesta — semua tanpa membuat-Nya lelah.',
    hikmah:
      'Mengenal keagungan Allah membuat hati tenang dan tidak takut pada makhluk. Jika Dzat yang mengurus seluruh alam tidak pernah mengantuk menjaga kita, untuk apa kita gelisah berlebihan?',
    linguistik:
      'Perhatikan urutan «sinah» (سِنَة, kantuk ringan) lalu «naum» (نَوْم, tidur lelap). Sinah adalah awal/pendahulu tidur, naum puncaknya. Allah menafikan keduanya dengan urutan menaik: bahkan kantuk paling samar pun tidak menyentuh-Nya, apalagi tidur — penegasan kesempurnaan «Al-Qayyūm» (Yang terus-menerus mengurus tanpa jeda). Dua nama agung dirangkai: «Al-Ḥayy» (sumber kehidupan) dan «Al-Qayyūm» (penegak segala sesuatu); para ulama menyebut padanya tersimpan «ismullāhil a‘ẓam». Kata «ya’ūduhū» (memberatkan-Nya) dipilih untuk menegaskan: menjaga semesta sama sekali tak membebani-Nya.',
    amalan:
      'Biasakan membaca Ayat Kursi setelah tiap salat fardu dan menjelang tidur — sunnah yang menjadi benteng perlindungan. Saat dilanda rasa takut, cemas, atau merasa sendiri menghadapi masalah, baca dan resapi artinya: Penjaga semestamu tidak pernah tidur.',
    sumber: ['Tafsir Ibnu Katsir', 'Sahih Muslim no. 810', 'Sahih Bukhari (kisah Abu Hurairah)'],
  },
  {
    id: 'al-baqarah-286',
    surah: 'Al-Baqarah',
    surahNo: 2,
    ayatNo: '286',
    juz: 3,
    tema: ['Kelapangan', 'Doa', 'Tanggung jawab'],
    gratis: false,
    arab: 'لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا ۚ لَهَا مَا كَسَبَتْ وَعَلَيْهَا مَا اكْتَسَبَتْ ۗ رَبَّنَا لَا تُؤَاخِذْنَا إِن نَّسِينَا أَوْ أَخْطَأْنَا',
    latin: 'Lā yukallifullāhu nafsan illā wus‘ahā, lahā mā kasabat wa ‘alaihā maktasabat. Rabbanā lā tu’ākhiżnā in nasīnā au akhṭa’nā…',
    arti: 'Allah tidak membebani seseorang melainkan sesuai kesanggupannya. Ia mendapat (pahala) dari kebajikan yang dikerjakannya dan ia mendapat (siksa) dari kejahatan yang diperbuatnya. (Mereka berdoa): Ya Tuhan kami, janganlah Engkau hukum kami jika kami lupa atau salah…',
    asbabunNuzul:
      'Ketika turun ayat sebelumnya — "jika kamu nyatakan apa yang ada dalam hatimu atau kamu sembunyikan, Allah memperhitungkannya" — para sahabat merasa sangat berat, seakan lintasan hati pun dihisab. Mereka mengadu kepada Nabi ﷺ. Maka turunlah ayat ini yang melapangkan: beban hanya sebatas kesanggupan, dan lintasan hati yang tak disengaja dimaafkan (HR. Muslim).',
    tafsir:
      'Allah menetapkan prinsip rahmat: tak ada beban di luar kemampuan. Setiap jiwa memikul hasil amalnya sendiri. Lalu Allah mengajarkan rangkaian doa indah memohon ampun atas kelupaan, keringanan beban, dan pertolongan menghadapi musuh.',
    hikmah:
      'Agama ini tidak memberatkan. Rasa cemas berlebihan terhadap dosa kecil yang tak disengaja justru bertentangan dengan kelapangan yang Allah tetapkan sendiri.',
    linguistik:
      'Dipilih kata «wus‘ahā» (kesanggupan/kelapangan) — bukan «ṭāqatahā» (batas maksimal kemampuan). Wus‘ adalah kadar yang masih lapang dan nyaman dijangkau, DI BAWAH batas maksimal — menunjukkan Allah membebani jauh lebih ringan dari batas akhir kekuatan kita. Lebih halus lagi: kebaikan disebut «kasabat» (bentuk sederhana), sedangkan keburukan «iktasabat» (bentuk if‘ti‘āl yang menyiratkan usaha & kesengajaan lebih). Isyaratnya: kebaikan dicatat dengan mudah meski niat ringan, sementara keburukan baru "membebani" bila diupayakan dan disengaja — gambaran luasnya rahmat Allah yang tersembunyi dalam satu pilihan kata kerja.',
    amalan:
      'Jika kamu terjebak rasa bersalah berlebihan (overthinking dosa, was-was), kembalikan pada prinsip ayat: Allah hanya menuntut sekadar wus‘ (yang lapang) bagimu. Hafalkan rangkaian doa di ujung ayat ini sebagai penutup ibadah; ia doa para sahabat yang dijawab "qad fa‘altu" (sudah Aku kabulkan) oleh Allah.',
    sumber: ['Tafsir Ibnu Katsir', 'Sahih Muslim no. 125', 'Tafsir As-Sa‘di'],
  },

  /* ============ JUZ 30 — Ayat masyhur ============ */
  {
    id: 'al-insyirah-5-6',
    surah: 'Asy-Syarh',
    surahNo: 94,
    ayatNo: '5–6',
    juz: 30,
    tema: ['Sabar', 'Harapan', 'Ujian'],
    gratis: true,
    arab: 'فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا ۝ إِنَّ مَعَ ٱلْعُسْرِ يُسْرًا',
    latin: 'Fa inna ma‘al-‘usri yusrā. Inna ma‘al-‘usri yusrā.',
    arti: 'Maka sesungguhnya bersama kesulitan ada kemudahan. Sesungguhnya bersama kesulitan ada kemudahan.',
    asbabunNuzul:
      'Surah Asy-Syarh turun di Makkah untuk menenangkan hati Nabi ﷺ di tengah beratnya tekanan dakwah, penolakan kaum Quraisy, dan kemiskinan kaum muslimin awal. Ayat ini menjadi penutup penghibur: setelah Allah mengingatkan nikmat melapangkan dada beliau, Dia menjanjikan bahwa kesempitan yang sedang dihadapi pasti diiringi jalan keluar.',
    tafsir:
      'Allah menegaskan satu sunnatullah: tidak ada kesulitan yang berdiri sendiri tanpa disertai kemudahan. Bukan sekadar "kemudahan akan datang nanti", tetapi kemudahan itu menyertai kesulitan itu sendiri. Pengulangan kalimat dua kali adalah penekanan (taukid) bahwa janji ini pasti dan tidak main-main.',
    hikmah:
      'Saat berada di titik terberat, justru di situlah benih kemudahan sedang tumbuh. Tugas hamba bukan menunggu badai reda, melainkan terus bergerak dengan yakin bahwa pertolongan Allah sedang dalam perjalanan.',
    linguistik:
      'Inilah keajaiban yang membuat para ulama takjub. Kata «al-‘usr» (kesulitan) memakai alif-lam (ma‘rifah/definitif) dan diulang dua kali — dalam kaidah Arab, isim ma‘rifah yang diulang menunjuk benda yang SAMA. Sebaliknya «yusrā» (kemudahan) tanpa alif-lam (nakirah/indefinitif) dan diulang — isim nakirah yang diulang menunjuk dua hal BERBEDA. Maka maknanya: satu kesulitan, tetapi DUA kemudahan. Ibnu ‘Abbas pun menyimpulkan: «Satu kesulitan tidak akan pernah mengalahkan dua kemudahan.» Tambahan: dipakai kata «ma‘a» (bersama), bukan «ba‘da» (sesudah) — kemudahan itu menempel pada kesulitan, bukan menunggu di kejauhan.',
    amalan:
      'Ketika menghadapi masalah berat — utang, sakit, pekerjaan, atau kegagalan — tuliskan satu kesulitanmu di kertas, lalu daftar dua kemudahan/jalan keluar yang mungkin Allah siapkan. Ini melatih otak melihat peluang, sekaligus mengamalkan keyakinan ayat. Jadikan kalimat ini zikir penenang saat cemas.',
    sumber: ['Tafsir Ibnu Katsir', 'Tafsir As-Sa‘di', 'Riwayat Ibnu ‘Abbas (atsar masyhur)'],
  },
  {
    id: 'al-asr-1-3',
    surah: 'Al-‘Aṣr',
    surahNo: 103,
    ayatNo: '1–3',
    juz: 30,
    tema: ['Waktu', 'Amal', 'Nasihat'],
    gratis: false,
    arab: 'وَالْعَصْرِ ۝ إِنَّ الْإِنْسَانَ لَفِي خُسْرٍ ۝ إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ',
    latin: 'Wal-‘aṣr. Innal-insāna lafī khusr. Illal-lażīna āmanū wa ‘amiluṣ-ṣāliḥāti wa tawāṣau bil-ḥaqqi wa tawāṣau biṣ-ṣabr.',
    arti: 'Demi masa. Sungguh, manusia berada dalam kerugian. Kecuali orang-orang yang beriman dan mengerjakan kebajikan, serta saling menasihati untuk kebenaran dan saling menasihati untuk kesabaran.',
    asbabunNuzul:
      'Tidak ada riwayat asbabun nuzul khusus untuk surah Makkiyah ini; ia bersifat universal. Imam Asy-Syāfi‘i berkata tentangnya: "Seandainya manusia merenungkan surah ini saja, niscaya cukup bagi mereka" — karena ia merangkum jalan keselamatan dalam tiga ayat.',
    tafsir:
      'Allah bersumpah demi waktu bahwa semua manusia merugi — modal umurnya habis terpakai — kecuali yang memenuhi empat syarat: beriman, beramal saleh, saling menasihati dalam kebenaran, dan saling menasihati dalam kesabaran.',
    hikmah:
      'Waktu adalah modal yang terus berkurang dan tak bisa dibeli kembali. Keselamatan menuntut bukan hanya kebaikan pribadi (iman + amal), tetapi juga kepedulian sosial (saling menasihati).',
    linguistik:
      'Allah memilih bersumpah «wal-‘aṣr» — demi waktu/masa — karena padanya tersingkap untung-rugi manusia. Kata «al-insān» dengan alif-lam jenis (istighrāq) mencakup SELURUH manusia tanpa kecuali. Lalu «lafī khusr»: huruf «la» penegas + «fī» (di dalam) menggambarkan manusia seolah tenggelam, terbenam DI DALAM kerugian, bukan sekadar menyentuhnya; «khusr» nakirah menyiratkan kerugian yang besar dan tak terkira. Setelah vonis menyeluruh itu, datang «illā» (kecuali) — satu-satunya pintu keluar — diikuti empat sifat yang tersusun rapi dari individual ke komunal. Struktur "vonis umum lalu pengecualian" ini menghentak dan menancap kuat.',
    amalan:
      'Audit waktumu seperti audit keuangan: catat ke mana jam-jammu pergi hari ini. Tetapkan satu amal saleh harian dan satu "saling menasihati" (mengingatkan kebaikan ke orang lain dengan lembut). Jadikan surah ini bacaan saat menutup hari untuk evaluasi diri.',
    sumber: ['Tafsir Ibnu Katsir', 'Tafsir As-Sa‘di', 'Ucapan Imam Asy-Syāfi‘i (riwayat masyhur)'],
  },
  {
    id: 'al-kautsar-1-3',
    surah: 'Al-Kauṡar',
    surahNo: 108,
    ayatNo: '1–3',
    juz: 30,
    tema: ['Syukur', 'Penghiburan', 'Optimisme'],
    gratis: false,
    arab: 'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ ۝ فَصَلِّ لِرَبِّكَ وَانْحَرْ ۝ إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ',
    latin: 'Innā a‘ṭainākal-kauṡar. Faṣalli lirabbika wanḥar. Inna syāni’aka huwal-abtar.',
    arti: 'Sesungguhnya Kami telah memberimu (nikmat) yang banyak. Maka laksanakan salat karena Tuhanmu dan berkurbanlah. Sesungguhnya orang yang membencimu, dialah yang terputus (dari kebaikan).',
    asbabunNuzul:
      'Ketika putra Nabi ﷺ wafat, kaum musyrikin — di antaranya disebut Al-‘Āṣ bin Wā’il — mengejek beliau sebagai "abtar" (terputus keturunan, tanpa penerus). Maka Allah menurunkan surah ini: bukan beliau yang terputus, justru beliau diberi «al-kauṡar» (kebaikan melimpah), dan si pencemoohlah yang sejatinya terputus dari segala kebaikan.',
    tafsir:
      'Allah menghibur Nabi ﷺ dengan kabar pemberian yang melimpah — termasuk telaga Al-Kauṡar di surga — lalu memerintahkan syukur lewat salat dan kurban, serta menutup ejekan musuh dengan bantahan telak.',
    hikmah:
      'Penghinaan manusia tidak menentukan nilaimu di sisi Allah. Balasan terbaik atas cemoohan bukan dendam, melainkan menambah ketaatan dan syukur.',
    linguistik:
      'Kata «al-Kauṡar» mengikuti wazan (pola) «fau‘al» yang menunjukkan intensitas berlebih — berasal dari «kaṡrah» (banyak), sehingga maknanya bukan sekadar "banyak", tapi "kebaikan yang melimpah-ruah tak terhingga". Balaghah-nya memukau: musuh menuduh Nabi «abtar» (terputus), lalu Allah menutup surah dengan kata yang sama «al-abtar» — membalikkan tuduhan tepat ke pelakunya. Ditambah «innā a‘ṭainā» (Kami telah memberi) dengan bentuk lampau yang pasti dan kata ganti keagungan — pemberian yang sudah terjamin, bukan janji yang masih ditunggu. Surah terpendek dalam Al-Qur’an, namun menumbangkan ejekan terbesar.',
    amalan:
      'Saat direndahkan, dibully, atau merasa "tak punya apa-apa", hitung ulang nikmat yang melimpah padamu (kesehatan, iman, keluarga), lalu respons dengan menambah ibadah — bukan membalas hinaan. Jadikan salat sebagai tempat mengadu, bukan media sosial.',
    sumber: ['Tafsir Ibnu Katsir', 'Asbabun Nuzul Al-Wahidi', 'Tafsir Al-Qurthubi'],
  },
  {
    id: 'al-ikhlas-1-4',
    surah: 'Al-Ikhlāṣ',
    surahNo: 112,
    ayatNo: '1–4',
    juz: 30,
    tema: ['Tauhid', 'Mengenal Allah'],
    gratis: false,
    arab: 'قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
    latin: 'Qul huwallāhu aḥad. Allāhuṣ-ṣamad. Lam yalid wa lam yūlad. Wa lam yakul lahū kufuwan aḥad.',
    arti: 'Katakanlah: Dialah Allah, Yang Maha Esa. Allah tempat bergantung segala sesuatu. Dia tidak beranak dan tidak diperanakkan. Dan tidak ada sesuatu pun yang setara dengan Dia.',
    asbabunNuzul:
      'Diriwayatkan kaum musyrikin (dan dalam riwayat lain orang Yahudi) berkata kepada Nabi ﷺ: "Gambarkan kepada kami Tuhanmu, dari apa Dia tercipta?" Maka turunlah surah ini sebagai jawaban menyeluruh tentang hakikat Allah (HR. Tirmidzi dan Ahmad). Surah ini setara sepertiga Al-Qur’an karena memuat inti akidah.',
    tafsir:
      'Empat ayat ringkas yang menjawab pertanyaan terbesar manusia: siapa Tuhan? Dia Esa tanpa sekutu, tempat bergantung seluruh makhluk, tidak berasal-usul dan tidak melahirkan, serta tidak ada yang menyamai-Nya dalam bentuk apa pun.',
    hikmah:
      'Akidah yang bersih adalah fondasi seluruh amal. Memahami bahwa hanya Allah tempat bergantung membebaskan hati dari menggantungkan harap pada makhluk yang lemah.',
    linguistik:
      'Dipilih kata «Aḥad» bukan «Wāḥid». «Wāḥid» (satu) bisa diikuti dua, tiga, dan seterusnya; sedangkan «Aḥad» menunjuk keesaan mutlak yang tak dapat dibagi, ditambah, atau disusun — keunikan yang khusus bagi Allah. Lalu «Aṣ-Ṣamad»: tuan yang menjadi tumpuan seluruh kebutuhan makhluk, sementara Dia tidak butuh apa pun — sebuah kata padat yang sulit diterjemahkan satu kata. Frasa «lam yalid wa lam yūlad» menafikan keturunan dari dua arah sekaligus (tidak menurunkan & tidak diturunkan), menutup celah penyimpangan akidah. Surah dibuka «Aḥad» dan ditutup «Aḥad» — bingkai sempurna.',
    amalan:
      'Jadikan Al-Ikhlas wirid harian; membacanya 3x menyamai khataman sepertiga Al-Qur’an. Saat hatimu mulai bergantung berlebihan pada atasan, pasangan, atau harta, ulangi «Allāhuṣ-ṣamad» — hanya Allah tempat bergantung sejati.',
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

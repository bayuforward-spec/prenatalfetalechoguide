/*
 * content.js — Mesin konten Tadabbur.
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
 * CARA MENAMBAH AYAT BARU:
 *   Salin satu objek, ganti isinya, tempel ke array AYAT. Tidak perlu sentuh kode lain.
 *   `gratis: true` berarti seluruh lapisan terbuka tanpa Premium (untuk umpan/teaser).
 */
const AYAT = [
  {
    id: 'al-insyirah-5-6',
    surah: 'Asy-Syarh',
    surahNo: 94,
    ayatNo: '5–6',
    juz: 30,
    tema: ['Sabar', 'Harapan', 'Ujian'],
    gratis: true, // ayat etalase — terbuka penuh sebagai contoh kualitas
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
    sumber: ['Tafsir Ibnu Katsir', 'Tafsir As-Sa‘di', 'Riwayat Ibnu ‘Abbas (Al-Muwaththa’/atsar masyhur)'],
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

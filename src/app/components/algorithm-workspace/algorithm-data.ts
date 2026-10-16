export interface AlgorithmTask {
  id: number;
  gradeLabel: string;
  difficultyRank: number;
  shortLabel: string;
  title: string;
  description: string;
  taskDescription: string;
  inputValues: string[];
  learningGoal: string;
  difficulty: string;
  lessonContent: string[];
  miniExamples: MiniExample[];
  requirements: string[];
  hint: string;
  starterCode: string;
  solutionCode: string;
  expectedOutput: string;
}

export interface MiniExample {
  title: string;
  explanation: string;
  code: string;
  output: string;
  image?: string;
}

export const ALGORITHM_TASKS: AlgorithmTask[] = [

{
  id: 1,
  gradeLabel: '9. osztály',
  difficultyRank: 3,
  shortLabel: 'Útvesztő',
  title: 'A robot kijáratot keres',
  description: 'A robot kijárathoz vezető útja több elágazáson is átvezethet. Találd meg a legrövidebb utat úgy, hogy közben ne járd be újra ugyanazt a mezőt!',
  taskDescription: 'A robot a "+" jellel megadott mezőről indul. A cél az "O" betűvel jelölt kijárat.\nA "#" falat, a "." szabadon bejárható mezőt jelent.\nA robot egy lépésben csak fel, le, jobbra vagy balra haladhat.\nEgészítsd ki a programot úgy, hogy kiszámolja a legrövidebb út hosszát! Ha a kijárat nem érhető el, ezt is jelezze.',
  inputValues: [
    'terkep = [',
    '    "+...#..",',
    '    ".##.#..",',
    '    "...##..",',
    '    ".#.....",',
    '    "...##.O"',
    ']',
  ],
  learningGoal: 'Kétdimenziós listák és sorok használata, szélességi bejárás (BFS), valamint legrövidebb út keresése.',
  difficulty: 'Nehéz',
  lessonContent: [
    'Nézd meg a térképet: ha egy elágazásnál egyszerre több irány is járható, hogyan tudod biztosítani, hogy a robot ne egy hosszabb zsákutcát válasszon elsőként?',
    'Próbáld rétegenként feljegyezni, mely mezőket érheti el 0, majd 1, majd 2 lépésből. A rácson egy mezőt a sor- és oszlopindexe azonosít.',
  ],
  requirements: [
    'A program már megkeresi a kezdőmező (+) és a kijárat (O) koordinátáját.',
    'Vizsgáld meg a szomszédos mezőket szélességi bejárással! A falra nem léphetsz!',
    'Minden elért mezőhöz tárold el, hány lépésre van a kezdőponttól.',
    'Írd ki a legrövidebb út hosszát, vagy jelezd, ha a kijárat nem érhető el. (Ez adott)',
    '(Plusz feladat) Módosítsd a térképet úgy, hogy a kijárathoz ne vezessen út, és próbáld ki így is a programot.',
  ],
  miniExamples: [
    {
      title: 'Melyik mező következik?',
      explanation: 'Egy közeli mező sem kaphat nagyobb távolságot, mint egy távolabbi. Figyeld meg, hogy a feldolgozási lista végére kerülő új mezőket csak a korábban felvett mezők után vizsgáljuk meg.',
      code: 'feldolgozando = [("start", 0)]\nkovetkezo = 0\n\nwhile kovetkezo < len(feldolgozando):\n    mezo, tavolsag = feldolgozando[kovetkezo]\n    kovetkezo += 1\n    print(mezo, tavolsag)\n    if mezo == "start":\n        feldolgozando.append(("bal", tavolsag + 1))\n        feldolgozando.append(("jobb", tavolsag + 1))',
      output: 'start 0\nbal 1\njobb 1',
    },
  ],
  hint: 'A széleken könnyű kilépni a rácsból: mielőtt a térkép új koordinátáját használnád, ellenőrizd külön a sor- és az oszlopindex határát. A távolságot csak akkor írd be, amikor egy járható mezőt először fedezel fel, ezzel az ismételt bejárást is elkerülöd.',
  starterCode: 'terkep = [\n    "+...#..",\n    ".##.#..",\n    "...##..",\n    ".#.....",\n    "...##.O"\n]\n\nkezdo = None\nkijarat = None\nfor sor in range(len(terkep)):\n    for oszlop in range(len(terkep[sor])):\n        if terkep[sor][oszlop] == "+":\n            kezdo = (sor, oszlop)\n        elif terkep[sor][oszlop] == "O":\n            kijarat = (sor, oszlop)\n\nfeldolgozando = [kezdo]\nkovetkezo = 0\ntavolsagok = [[-1 for oszlop_index in range(len(terkep[sor_index]))] for sor_index in range(len(terkep))]\ntavolsagok[kezdo[0]][kezdo[1]] = 0\nlepesek = [(-1, 0), (1, 0), (0, -1), (0, 1)]\n\nwhile kovetkezo < len(feldolgozando):\n    aktualis_sor, aktualis_oszlop = feldolgozando[kovetkezo]\n    kovetkezo += 1\n\n    # Állítsd meg a keresést, ha elérted a kijáratot.\n    pass\n\n    for sorvaltozas, oszlopvaltozas in lepesek:\n        # Vizsgáld meg a szomszédos mezőt,\n        # és ha járható és még nem láttad, add a sorhoz.\n        pass\n\nif tavolsagok[kijarat[0]][kijarat[1]] >= 0:\n    print("Legrovidebb ut hossza:", tavolsagok[kijarat[0]][kijarat[1]], "lepes")\nelse:\n    print("A kijarat nem erheto el.")',
  solutionCode: 'terkep = [\n    "+...#..",\n    ".##.#..",\n    "...##..",\n    ".#.....",\n    "...##.O"\n]\n\nkezdo = None\nkijarat = None\nfor sor in range(len(terkep)):\n    for oszlop in range(len(terkep[sor])):\n        if terkep[sor][oszlop] == "+":\n            kezdo = (sor, oszlop)\n        elif terkep[sor][oszlop] == "O":\n            kijarat = (sor, oszlop)\n\ntavolsagok = [[-1 for oszlop_index in range(len(terkep[sor_index]))] for sor_index in range(len(terkep))]\ntavolsagok[kezdo[0]][kezdo[1]] = 0\nfeldolgozando = [kezdo]\nkovetkezo = 0\nlepesek = [(-1, 0), (1, 0), (0, -1), (0, 1)]\n\nwhile kovetkezo < len(feldolgozando):\n    aktualis_sor, aktualis_oszlop = feldolgozando[kovetkezo]\n    kovetkezo += 1\n\n    if (aktualis_sor, aktualis_oszlop) == kijarat:\n        break\n\n    for sorvaltozas, oszlopvaltozas in lepesek:\n        uj_sor = aktualis_sor + sorvaltozas\n        uj_oszlop = aktualis_oszlop + oszlopvaltozas\n        ervenyes_mezo = 0 <= uj_sor < len(terkep) and 0 <= uj_oszlop < len(terkep[uj_sor])\n\n        if ervenyes_mezo and terkep[uj_sor][uj_oszlop] != "#" and tavolsagok[uj_sor][uj_oszlop] == -1:\n            tavolsagok[uj_sor][uj_oszlop] = tavolsagok[aktualis_sor][aktualis_oszlop] + 1\n            feldolgozando.append((uj_sor, uj_oszlop))\n\nif tavolsagok[kijarat[0]][kijarat[1]] >= 0:\n    print("Legrovidebb ut hossza:", tavolsagok[kijarat[0]][kijarat[1]], "lepes")\nelse:\n    print("A kijarat nem erheto el.")',
  expectedOutput: 'Legrovidebb ut hossza: 10 lepes',
},
{
    id: 2,
    gradeLabel: '9. osztály',
    difficultyRank: 2,
    shortLabel: 'Terembeosztás',
    title: 'Hány terem kell az órákhoz?',
    description: 'Hat iskolai órát kell beosztani. Az ütköző órák ne kerüljenek egy terembe, és próbálj meg minél kevesebb termet használni.',
    taskDescription: 'Az iskola órarendjében ez a hat foglalkozás vár teremre. Két óra nem fér el ugyanott, ha az egyik még tart a másik kezdetekor. Ha az első pontban ér véget, a terem már szabad.\nÍrd ki, melyik óra melyik terembe kerül, majd a végén azt is, hány terem kellett. Az órák kezdés szerint rendezettek; az időpontok éjféltől számított percek.',
    inputValues: [
        'orak = [',
        '    {"nev": "Matek", "kezdes": 480, "vege": 540},',
        '    {"nev": "Magyar", "kezdes": 510, "vege": 570},',
        '    {"nev": "Kemia", "kezdes": 540, "vege": 600},',
        '    {"nev": "Rajz", "kezdes": 560, "vege": 620},',
        '    {"nev": "Fizika", "kezdes": 600, "vege": 660},',
        '    {"nev": "Enek", "kezdes": 610, "vege": 640}',
        ']',
    ],
    learningGoal: 'Időintervallumok összehasonlítása, ütközések vizsgálata, listák bejárása és mohó algoritmussal történő teremkiosztás.',
    difficulty: 'Középhaladó',
    lessonContent: [
        'A Matek 8:00-kor kezdődik, a Magyar 8:30-kor. Nézd meg az időpontokat a listában: mikor ér véget a Matek, és miért nem jó nekik ugyanaz a terem?',
        'Az időket percekben kapod meg, például 8:00 = 480. A teremszámokat a program válassza ki; a végén ellenőrizd, hogy egyik átfedő órapár sem került egy helyre.',
    ],
    requirements: [
        'Írj egy utkozik() függvényt, amely két óra kezdési és befejezési idejéből eldönti, hogy fedik-e egymást. Próbáld ki a 8:00–9:00 és a 9:00–10:00 időpontokkal is.',
        'A terem_utolso_oraja listában tartsd számon, meddig foglaltak a termek. Menj végig az órákon a megadott sorrendben, és keress szabad helyet az aktuálisnak.',
        'Mentsd el a beosztást, majd írd ki minden óra nevét és teremszámot. A végén a termek számát  listázd ki. (Ez adott)',
        'Plusz feladat: Ha tudnánk, hogy minden óra 60 perces, hogyan módosulna a szkript?'
    ],
    miniExamples: [
        {
            title: 'Két egymást követő foglalás',
            explanation: 'A könyvtári gépet 9:00-re visszaadják, a következő diák is 9:00-ra foglalta le. Nem kell közéjük üres perc.',
            code: 'elozo_vege = 9 * 60\nkovetkezo_kezdes = 9 * 60\nprint("Szabad a gep:", elozo_vege <= kovetkezo_kezdes)',
            output: 'Szabad a gep: True',
        },
    ],
    hint: 'A határesetnél ne használj szigorú kisebb-nagyobb jelet: a 9:00-kor végződő óra után a terem már felszabadult. Nézd meg, mit ad vissza a szkript ekkor.',
    starterCode: 'orak = [\n    {"nev": "Matek", "kezdes": 480, "vege": 540},\n    {"nev": "Magyar", "kezdes": 510, "vege": 570},\n    {"nev": "Kemia", "kezdes": 540, "vege": 600},\n    {"nev": "Rajz", "kezdes": 560, "vege": 620},\n    {"nev": "Fizika", "kezdes": 600, "vege": 660},\n    {"nev": "Enek", "kezdes": 610, "vege": 640}\n]\n\ndef utkozik(kezdes_a, vege_a, kezdes_b, vege_b):\n    #Segitseg: fentebb reszletezve van az atfedes\n    pass\n\nif __name__ == "__main__":\n    teremek_utolso_orai = []\n    beosztas = []\n\n    for ora in orak:\n        talalt_terem = -1\n        for index in range(len(teremek_utolso_orai)):\n            elozo_kezdes, elozo_vege = teremek_utolso_orai[index]\n            if not utkozik(ora["kezdes"], ora["vege"], elozo_kezdes, elozo_vege):\n                #Segitseg: valasszd ki a talalt, szabad terem indexet\n                pass\n\n        if talalt_terem == -1:\n            #Segitseg: hozz letre uj termet, es tarold el hogy mettol-meddig foglalt\n            pass\n        else:\n            teremek_utolso_orai[talalt_terem] = (ora["kezdes"], ora["vege"])\n\n        #Segitseg: ide kelleni fog a terem szama\n        pass\n\n    for nev, terem in beosztas:\n        print(nev, "->", str(terem) + ".terem")\n    print("Szukseges termek szama:", len(teremek_utolso_orai))',
    solutionCode: 'orak = [\n    {"nev": "Matek", "kezdes": 480, "vege": 540},\n    {"nev": "Magyar", "kezdes": 510, "vege": 570},\n    {"nev": "Kemia", "kezdes": 540, "vege": 600},\n    {"nev": "Rajz", "kezdes": 560, "vege": 620},\n    {"nev": "Fizika", "kezdes": 600, "vege": 660},\n    {"nev": "Enek", "kezdes": 610, "vege": 640}\n]\n\ndef utkozik(kezdes_a, vege_a, kezdes_b, vege_b):\n    return kezdes_a < vege_b and kezdes_b < vege_a\n\nterem_utolso_oraja = []\nbeosztas = []\n\nfor ora in orak:\n    talalt_terem = -1\n    for index in range(len(terem_utolso_oraja)):\n        elozo_kezdes, elozo_vege = terem_utolso_oraja[index]\n        if not utkozik(ora["kezdes"], ora["vege"], elozo_kezdes, elozo_vege):\n            talalt_terem = index\n            break\n\n    if talalt_terem == -1:\n        talalt_terem = len(terem_utolso_oraja)\n        terem_utolso_oraja.append((ora["kezdes"], ora["vege"]))\n    else:\n        terem_utolso_oraja[talalt_terem] = (ora["kezdes"], ora["vege"])\n\n    beosztas.append((ora["nev"], talalt_terem + 1))\n\nfor nev, terem in beosztas:\n    print(nev, "->", str(terem) + ".terem")\nprint("Szukseges termek szama:", len(terem_utolso_oraja))',
    expectedOutput: 'Matek -> 1.terem\nMagyar -> 2.terem\nKemia -> 1.terem\nRajz -> 3.terem\nFizika -> 1.terem\nZene -> 2.terem\nSzukseges termek szama: 3',
},
{
    id: 3,
    gradeLabel: '9. osztály',
    difficultyRank: 1,
    shortLabel: 'Üzenettömörítő',
    title: 'Rövidebb üzenet, visszaállíthatóan',
    description: 'A megadott üzenetben több hosszú betűsorozat is van. Rövidítsd le, aztán ellenőrizd, hogy vissza tudod-e állítani az eredetit.',
    taskDescription: 'A `AAAAABBBCCAAAAAAAAAAAA` üzenetben egymás mellett ismétlődő betűket találsz. Tárold az ilyen sorozatokat betű és darabszám formájában: például az `AAAA` legyen `A4`.\nÍrd meg a `kodol()` és a `dekodol()` függvényt. Futtatás után nézd meg, hogy a visszaállított szöveg pontosan megegyezik-e a bemenettel.\nA bemenet nagybetűs angol betűkből áll, szóköz és számjegy nincs benne.',
    inputValues: ['uzenet = "AAAAABBBCCAAAAAAAAAAAA"'],
    learningGoal: 'Karakterláncok bejárása, futamok számlálása, kódolás és dekódolás (Run-Length Encoding)',
    difficulty: 'Közepes',
    lessonContent: [
        'Jelöld be az üzenetben, hol vált egyik betű a másikra. Szerinted az A-k mind egyetlen sorozatot alkotnak, vagy lesz köztük megszakítás?',
        'Próbáld meg előre megjósolni, hogy a kódolt üzenet rövidebb lesz-e az eredetinél. Mit gondolsz?Mi történik, ha minden betű csak egyszer szerepel egymás után?',
    ],
    requirements: [
        'Készítsd el a kodol() és a dekodol() függvényt.',
        'A dekódolás kezelje a többjegyű darabszámot is, például az A12 tizenkét A betűt jelentsen.',
        'Írd ki a kódolt és a visszaállított üzenetet, majd ellenőrizd, hogy az eredeti és a visszaállított szöveg megegyezik-e.',
        'Próbálj ki egy olyan üzenetet is, amelyben nincs ismétlődő betű. Hasonlítsd össze a két szöveg hosszát.'
    ],
    miniExamples: [
        {
            title: 'A megszakítás számít?',
            explanation: 'Az A betű kétszer szerepel az `AABAA` szövegben, de egy megszakítással. Kövesd végig, hol kell lezárni az aktuális csoportot.',
            code: 'uzenet = "AABAA"\nelozo_betu = uzenet[0]\nismetlodes_szama = 1\n\nfor betu in uzenet[1:]:\n    if betu == elozo_betu:\n        ismetlodes_szama += 1\n    else:\n        print(elozo_betu, ismetlodes_szama)\n        elozo_betu = betu\n        ismetlodes_szama = 1\nprint(elozo_betu, ismetlodes_szama)',
            output: 'A 2\nB 1\nA 2'
        },
        {
            title: 'A12 nem A1',
            explanation: 'A szám a betű után addig tart, amíg el nem érsz egy el egy másik, különböző betűt. Itt a darabszám 12, nem 1.',
            code: 'kodolt_uzenet = "A12B3"\nindex = 1\nismetlodes_szama  = ""\nwhile index < len(kodolt_uzenet) and kodolt_uzenet[index].isdigit():\n    ismetlodes_szama += kodolt_uzenet[index]\n    index += 1\nprint("Darab:", int(ismetlodes_szama))\nprint("Visszaallitott A-k:", "A" * int(ismetlodes_szama))',
            output: 'Darab: 12\nVisszaallitott A-k: AAAAAAAAAAAA'
        }
    ],
    hint: 'A kódolás utolsó csoportja a ciklus befejeződésekor még nincs hozzáfűzve az eredményhez; ezt külön kezeld. Dekódoláskor az index könnyen egy karakterrel lemarad: próbáld végigkövetni az `A12B3` feldolgozását.',
    starterCode: 'def kodol(szoveg):\n    eredmeny = ""\n\n    #Segitseg: jard be a szoveget,\n# szamold meg az egymas melletti azonos betuket,\n# es fuzd az eredmenyhez a betut es a darabszamot,\n# az utolso ciklust se felejtsd el\n    pass\n\n    return eredmeny\n\ndef dekodol(kodolt):\n    eredmeny = ""\n    index = 0\n    while index < len(kodolt):\n        betu = kodolt[index]\n        index += 1\n        szamjegyek = ""\n\n        #Segitseg: olvasd be a szamjegyeket, majd leptesd az indexet\n        pass\n\n        if szamjegyek == "":\n            print("A dekodolo resz meg nincs kesz.")\n            return ""\n        darab = int(szamjegyek)\n        eredmeny += betu * darab\n    return eredmeny\n\nuzenet = "AAAAABBBCCAAAAAAAAAAAA"\nkodolt = kodol(uzenet)\nvisszaallitott = dekodol(kodolt)\nprint("Eredeti uzenet:", uzenet)\nprint("Kodolt uzenet:", kodolt)\nprint("Visszaallitott uzenet:", visszaallitott)\nprint("Egyezik:", uzenet == visszaallitott)\nprint("Eredeti hossz:", len(uzenet))\nprint("Kodolt hossz:", len(kodolt))\nprint("Megtakaritott karakterek:", len(uzenet) - len(kodolt))',
    solutionCode: 'def kodol(szoveg):\n    if szoveg == "":\n        return ""\n\n    eredmeny = ""\n    elozo_betu = szoveg[0]\n    darab = 1\n\n    for betu in szoveg[1:]:\n        if betu == elozo_betu:\n            darab += 1\n        else:\n            eredmeny += elozo_betu + str(darab)\n            elozo_betu = betu\n            darab = 1\n\n    eredmeny += elozo_betu + str(darab)\n    return eredmeny\n\ndef dekodol(kodolt):\n    eredmeny = ""\n    index = 0\n    while index < len(kodolt):\n        betu = kodolt[index]\n        index += 1\n        szamjegyek = ""\n\n        while index < len(kodolt) and kodolt[index].isdigit():\n            szamjegyek += kodolt[index]\n            index += 1\n\n        eredmeny += betu * int(szamjegyek)\n    return eredmeny\n\nuzenet = "AAAAABBBCCAAAAAAAAAAAA"\nkodolt = kodol(uzenet)\nvisszaallitott = dekodol(kodolt)\nprint("Eredeti uzenet:", uzenet)\nprint("Kodolt uzenet:", kodolt)\nprint("Visszaallitott uzenet:", visszaallitott)\nprint("Egyezik:", uzenet == visszaallitott)\nprint("Eredeti hossz:", len(uzenet))\nprint("Kodolt hossz:", len(kodolt))\nprint("Megtakaritott karakterek:", len(uzenet) - len(kodolt))',
    expectedOutput: 'Eredeti uzenet: AAAAABBBCCAAAAAAAAAAAA\nKodolt uzenet: A5B3C2A12\nVisszaallitott uzenet: AAAAABBBCCAAAAAAAAAAAA\nEgyezik: True\nEredeti hossz: 22\nKodolt hossz: 9\nMegtakaritott karakterek: 13'
},
];

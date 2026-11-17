# Blue Hotel · Planer sedenja

Samostalna prva verzija aplikacije u jednom HTML fajlu. Nije pronađen postojeći repozitorijum, sajt, framework, hosting ili backend u radnom prostoru, pa ovo nije povezano sa bluehotelbend.com niti koristi Supabase.

## Pokretanje

Otvorite `index.html` u savremenom pregledaču. Planovi se automatski čuvaju u lokalnoj memoriji tog pregledača na tom uređaju. CSV uvoz, raspoređivanje, upravljanje stolovima i štampa rade bez instalacije dodatnih paketa. Za PDF izvoz izaberite opciju štampe u prozoru pregledača i zatim „Sačuvaj kao PDF“.

## Uključeno

- Premium osvežen vizuelni sistem sa Deep Teal navigacijom, toplom krem pozadinom, jasnim panelima i narandžastim primarnim akcijama.
- Prilagodljiv raspored: tamna bočna lista gostiju, centralno platno sa diskretnom mrežom i odvojeni panel svojstava; na mobilnom se platno prikazuje prvo.
- Brzi izbor iz bočne trake za okrugli sto, pravougaoni sto i mladenački sto, uz postojeći dijalog za ostale elemente sale.
- Uređivač koristi skoro punu širinu i visinu prozora, a bočni paneli mogu da se sklope kako bi se platno proširilo. Na tabletima se paneli otvaraju preko platna; na telefonima su dostupni kroz donju navigaciju i klizne panele.
- Grupisana traka alata sadrži poništavanje/ponavljanje, kontrole zumiranja, automatsko uklapanje sale i izvoz; na telefonu su ređi izvozi u meniju „Više“.
- Elementi sale mogu da se izaberu i podese u panelu svojstava; položaji su relativni u odnosu na salu i ostaju isti pri promeni veličine prozora. Platno podržava dodirno prevlačenje, pomeranje i pinch zum.
- Gosta je moguće dodeliti stolu iz njegovog obrasca, pored postojećeg prevlačenja i izbora iz svojstava stola. Poništi/Ponovi obuhvataju izmene plana tokom tekuće sesije.
- Kontrolna tabla sa kreiranjem, uređivanjem, kopiranjem i brisanjem planova.
- Višekoračno kreiranje proslave i podešavanje oblika i dimenzija sale.
- Okrugli, pravougaoni i banket stolovi sa kapacitetom, rotacijom, pomeranjem i brisanjem.
- Precizno prevlačenje i X/Y polja u pikselima; koordinate se čuvaju relativno u odnosu na salu i prilagođavaju promeni veličine prozora.
- Zum 25%, 33%, 50%, 67%, 75%, 100%, 125% i 150%, automatsko uklapanje, pomeranje platna i vraćanje stolova na početni raspored.
- Novi stolovi se postavljaju u razmaknutu mrežu; kod većih rasporeda sala se proširuje, a prikaz automatski odzumira. Ručno pomereni i postojeći stolovi ostaju van automatskog preslaganja.
- Ručni unos i izmena gostiju, pretraga i filteri.
- UTF-8 CSV uvoz sa mapiranjem kolona, pregledom redova, proverom obaveznih polja i upozorenjem na duplikate; primer CSV datoteke za preuzimanje.
- Prevlačenje gostiju na stolove, provera kapaciteta i automatska raspodela koja čuva postojeće dodele.
- Elementi sale: bina/bend, plesni podijum, ulaz, bife i izdvojeni horizontalni „Mladenački sto“.
- Zaseban izvoz rasporeda i spiska gostiju, plus objedinjeni izvoz celog plana u PDF.

Kliknite „Preuzmi ceo plan (PDF)“ i u prozoru za štampu izaberite „Sačuvaj kao PDF“. Objedinjeni izvoz sadrži detalje događaja, skicu sale i stolova, pregled kapaciteta, spisak gostiju i napomene.

Testove pokrenite komandom `node --test *.test.cjs` iz ovog direktorijuma.

## Ograničenje ove verzije

Podaci su privatni samo u okviru lokalnog pregledača i nisu sinhronizovani ili zaštićeni nalogom. Ne koristite ovu verziju kao deljeni ili višekorisnički servis za stvarne podatke o gostima. Za objavu na `/smart-seating` potrebno je povezati je sa postojećim sajtom i uvesti autentifikaciju i autorizaciju na serveru (na primer Supabase Auth, RLS i privatni pristup događajima), nakon što su dostupni repozitorijum i konfiguracija okruženja.

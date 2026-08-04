export interface TourStepText {
  title: string;
  body: string;
}

export interface Localized {
  tutorialTitle: string;
  tutorialIntro: string;
  tutorialSwipeNew: string;
  tutorialManualPick: string;
  tutorialStart: string;
  tutorialOpenManual: string;
  tutorialStartTour: string;
  tourSkip: string;
  tourNext: string;
  tourDone: string;
  tourSteps: TourStepText[];
  manualTitle: string;
  manualIntro: string;
  manualHow: string;
  manualSteps: [string, string, string, string];
  manualSwipe: string;
  manualSwipeBody: string;
  manualLibrary: string;
  manualLibraryBody: string;
  manualByo: string;
  manualByoBody: string;
  manualLookup: string;
  manualLookupBody: string;
}

export const EU_LANGUAGES: { code: string; name: string; countries: string[] }[] = [
  { code: "en", name: "English", countries: ["IE"] },
  { code: "fr", name: "Français", countries: ["FR", "BE", "LU"] },
  { code: "de", name: "Deutsch", countries: ["DE", "AT"] },
  { code: "it", name: "Italiano", countries: ["IT"] },
  { code: "es", name: "Español", countries: ["ES"] },
  { code: "pt", name: "Português", countries: ["PT"] },
  { code: "nl", name: "Nederlands", countries: ["NL", "BE"] },
  { code: "pl", name: "Polski", countries: ["PL"] },
  { code: "cs", name: "Čeština", countries: ["CZ"] },
  { code: "sk", name: "Slovenčina", countries: ["SK"] },
  { code: "sl", name: "Slovenščina", countries: ["SI"] },
  { code: "hr", name: "Hrvatski", countries: ["HR"] },
  { code: "bg", name: "Български", countries: ["BG"] },
  { code: "ro", name: "Română", countries: ["RO"] },
  { code: "hu", name: "Magyar", countries: ["HU"] },
  { code: "el", name: "Ελληνικά", countries: ["GR", "CY"] },
  { code: "sv", name: "Svenska", countries: ["SE"] },
  { code: "da", name: "Dansk", countries: ["DK"] },
  { code: "fi", name: "Suomi", countries: ["FI"] },
  { code: "et", name: "Eesti", countries: ["EE"] },
  { code: "lv", name: "Latviešu", countries: ["LV"] },
  { code: "lt", name: "Lietuvių", countries: ["LT"] },
  { code: "ga", name: "Gaeilge", countries: ["IE"] },
  { code: "mt", name: "Malti", countries: ["MT"] },
];

const COUNTRY_TO_LANG: Record<string, string> = {
  AT: "de",
  BE: "nl",
  BG: "bg",
  HR: "hr",
  CY: "el",
  CZ: "cs",
  DK: "da",
  EE: "et",
  FI: "fi",
  FR: "fr",
  DE: "de",
  GR: "el",
  HU: "hu",
  IE: "en",
  IT: "it",
  LV: "lv",
  LT: "lt",
  LU: "fr",
  MT: "mt",
  NL: "nl",
  PL: "pl",
  PT: "pt",
  RO: "ro",
  SK: "sk",
  SI: "sl",
  ES: "es",
  SE: "sv",
};

export function euLanguageForCountry(countryCode?: string | null): string | null {
  if (!countryCode) return null;
  return COUNTRY_TO_LANG[countryCode.toUpperCase()] ?? null;
}

export const FALLBACK_LOCALE = "en";

const TRANSLATIONS: Record<string, Localized> = {
  en: {
    tutorialTitle: "Welcome to WInspo",
    tutorialIntro: "Here you'll go through picking the designs you like.",
    tutorialSwipeNew:
      "This is new — a swipe mode. Flip through the sites like a deck of cards and like the ones you like.",
    tutorialManualPick:
      "You can also come back to the full library and pick manually.",
    tutorialStart: "Start browsing",
    tutorialOpenManual: "Open the manual",
    tutorialStartTour: "Take the quick tour",
    tourSkip: "Skip",
    tourNext: "Next",
    tourDone: "Done",
    tourSteps: [
      {
        title: "Pick references",
        body: "Tap any reference card to select it — it gets a checkmark. Tap it again to undo.",
      },
      {
        title: "Search",
        body: "Type a word like “portfolio” here to filter the gallery instantly.",
      },
      {
        title: "Bigger preview",
        body: "Click “Full page” on a card to open a large screenshot with details.",
      },
      {
        title: "Swipe mode",
        body: "Click “Swipe” at the top to go through sites one by one, like cards. Swipe right or press → to like, left or ← to skip.",
      },
      {
        title: "Finish",
        body: "After you pick at least one reference, this bar appears at the bottom. Click Finish when you're done.",
      },
      {
        title: "Your selection code",
        body: "WInspo turns your picks into a short code. Copy it and send it to your designer together with the link — they'll see exactly what you chose, plus an automatic design profile.",
      },
    ],
    manualTitle: "The WInspo manual",
    manualIntro:
      "WInspo turns your client's design picks into a short shareable code.",
    manualHow: "How it works",
    manualSteps: [
      "Browse a gallery of website and app references.",
      "Select the ones that feel right for the project.",
      "Share the short code with your designer.",
      "The designer pastes the code to see exactly what was picked, plus an automatic design profile.",
    ],
    manualSwipe: "Swipe mode",
    manualSwipeBody:
      "The fastest way to pick: flip through the sites one by one, like a deck of cards. Like the ones you like and skip the rest. Your likes are added to the same selection.",
    manualLibrary: "Manual mode",
    manualLibraryBody:
      "Prefer browsing the whole library at once? Use the grid view to search and tap the references you want.",
    manualByo: "Bring your own dataset",
    manualByoBody:
      "Any public GitHub repo with a winspo.json at its root can become a dataset.",
    manualLookup: "Lookup",
    manualLookupBody:
      "Paste any code into the lookup page to see the selection and its design profile.",
  },
  fr: {
    tutorialTitle: "Bienvenue sur WInspo",
    tutorialIntro: "Ici, vous allez choisir les designs qui vous plaisent.",
    tutorialSwipeNew:
      "C'est nouveau — un mode swipe. Parcourez les sites comme un jeu de cartes et aimez ceux que vous aimez.",
    tutorialManualPick:
      "Vous pouvez aussi revenir à la bibliothèque complète et choisir manuellement.",
    tutorialStart: "Commencer",
    tutorialOpenManual: "Ouvrir le manuel",
    tutorialStartTour: "Faire la visite guidée",
    tourSkip: "Passer",
    tourNext: "Suivant",
    tourDone: "Terminer",
    tourSteps: [
      {
        title: "Choisir des références",
        body: "Touchez une carte de référence pour la sélectionner — elle reçoit une coche. Touchez à nouveau pour annuler.",
      },
      {
        title: "Recherche",
        body: "Tapez un mot comme « portfolio » ici pour filtrer instantanément la galerie.",
      },
      {
        title: "Aperçu agrandi",
        body: "Cliquez sur « Full page » sur une carte pour ouvrir une grande capture avec les détails.",
      },
      {
        title: "Mode swipe",
        body: "Cliquez sur « Swipe » en haut pour parcourir les sites un par un, comme des cartes. Balayez à droite ou appuyez sur → pour aimer, à gauche ou sur ← pour passer.",
      },
      {
        title: "Terminer",
        body: "Après avoir choisi au moins une référence, cette barre apparaît en bas. Cliquez sur « Terminer » quand vous avez fini.",
      },
      {
        title: "Votre code de sélection",
        body: "WInspo transforme vos choix en un code court. Copiez-le et envoyez-le à votre designer avec le lien — il verra exactement ce que vous avez choisi, plus un profil de design automatique.",
      },
    ],
    manualTitle: "Le manuel WInspo",
    manualIntro:
      "WInspo transforme les choix de design de votre client en un code court et partageable.",
    manualHow: "Comment ça marche",
    manualSteps: [
      "Parcourez une galerie de références de sites web et d'applications.",
      "Sélectionnez celles qui correspondent au projet.",
      "Partagez le code court avec votre designer.",
      "Le designer colle le code pour voir exactement ce qui a été choisi, plus un profil de design automatique.",
    ],
    manualSwipe: "Mode swipe",
    manualSwipeBody:
      "La façon la plus rapide de choisir : parcourez les sites un par un, comme un jeu de cartes. Aimez ceux qui vous plaisent et passez les autres. Vos likes rejoignent la même sélection.",
    manualLibrary: "Mode manuel",
    manualLibraryBody:
      "Vous préférez parcourir toute la bibliothèque d'un coup ? Utilisez la vue en grille pour rechercher et toucher les références souhaitées.",
    manualByo: "Apportez votre propre dataset",
    manualByoBody:
      "Tout dépôt GitHub public contenant un winspo.json à sa racine peut devenir un dataset.",
    manualLookup: "Lookup",
    manualLookupBody:
      "Collez n'importe quel code dans la page de lookup pour voir la sélection et son profil de design.",
  },
  de: {
    tutorialTitle: "Willkommen bei WInspo",
    tutorialIntro: "Hier gehst du die Designs durch und wählst aus, was dir gefällt.",
    tutorialSwipeNew:
      "Das ist neu – ein Wisch-Modus. Blättere die Websites wie einen Kartenstapel durch und like, was dir gefällt.",
    tutorialManualPick:
      "Du kannst auch zurück zur gesamten Bibliothek gehen und manuell auswählen.",
    tutorialStart: "Loslegen",
    tutorialOpenManual: "Handbuch öffnen",
    tutorialStartTour: "Tour starten",
    tourSkip: "Überspringen",
    tourNext: "Weiter",
    tourDone: "Fertig",
    tourSteps: [
      {
        title: "Referenzen auswählen",
        body: "Tippe auf eine Referenzkarte, um sie auszuwählen – sie bekommt einen Haken. Tippe erneut, um die Auswahl rückgängig zu machen.",
      },
      {
        title: "Suchen",
        body: "Gib hier ein Wort wie „Portfolio“ ein, um die Galerie sofort zu filtern.",
      },
      {
        title: "Große Vorschau",
        body: "Klicke auf einer Karte auf „Full page“, um einen großen Screenshot mit Details zu öffnen.",
      },
      {
        title: "Swipe-Modus",
        body: "Klicke oben auf „Swipe“, um die Websites einzeln durchzublättern, wie Karten. Wische nach rechts oder drücke → zum Liken, nach links oder ← zum Überspringen.",
      },
      {
        title: "Abschließen",
        body: "Sobald du mindestens eine Referenz ausgewählt hast, erscheint diese Leiste unten. Klicke auf „Fertig“, wenn du fertig bist.",
      },
      {
        title: "Dein Auswahlcode",
        body: "WInspo packt deine Auswahl in einen kurzen Code. Kopiere ihn und schicke ihn zusammen mit dem Link an deinen Designer – er sieht genau, was du gewählt hast, plus ein automatisches Design-Profil.",
      },
    ],
    manualTitle: "Das WInspo-Handbuch",
    manualIntro:
      "WInspo verwandelt die Design-Auswahl deines Kunden in einen kurzen, teilbaren Code.",
    manualHow: "So funktioniert's",
    manualSteps: [
      "Durchstöbere eine Galerie mit Website- und App-Referenzen.",
      "Wähle die aus, die zum Projekt passen.",
      "Teile den kurzen Code mit deinem Designer.",
      "Der Designer fügt den Code ein und sieht genau, was ausgewählt wurde – plus ein automatisch erstelltes Design-Profil.",
    ],
    manualSwipe: "Wisch-Modus",
    manualSwipeBody:
      "Der schnellste Weg zur Auswahl: Blättere die Websites einzeln durch, wie einen Kartenstapel. Like, was dir gefällt, und überspringe den Rest. Deine Likes fließen in dieselbe Auswahl ein.",
    manualLibrary: "Manueller Modus",
    manualLibraryBody:
      "Lieber die ganze Bibliothek auf einmal durchsuchen? Nutze die Rasteransicht zum Suchen und tippe die gewünschten Referenzen an.",
    manualByo: "Eigenes Dataset mitbringen",
    manualByoBody:
      "Jedes öffentliche GitHub-Repository mit einer winspo.json im Root-Verzeichnis kann ein Dataset werden.",
    manualLookup: "Lookup",
    manualLookupBody:
      "Füge einen beliebigen Code in die Lookup-Seite ein, um die Auswahl und ihr Design-Profil zu sehen.",
  },
  it: {
    tutorialTitle: "Benvenuto su WInspo",
    tutorialIntro: "Qui sceglierai i design che ti piacciono.",
    tutorialSwipeNew:
      "Questa è una novità — una modalità swipe. Scorri i siti come un mazzo di carte e metti mi piace a quelli che ti piacciono.",
    tutorialManualPick:
      "Puoi anche tornare all'intera libreria e scegliere manualmente.",
    tutorialStart: "Inizia",
    tutorialOpenManual: "Apri il manuale",
    tutorialStartTour: "Avvia il tour",
    tourSkip: "Salta",
    tourNext: "Avanti",
    tourDone: "Fine",
    tourSteps: [
      {
        title: "Scegli le referenze",
        body: "Tocca una scheda di referenza per selezionarla: riceve un segno di spunta. Tocca di nuovo per annullare.",
      },
      {
        title: "Cerca",
        body: "Scrivi qui una parola come «portfolio» per filtrare subito la galleria.",
      },
      {
        title: "Anteprima più grande",
        body: "Clicca su «Full page» su una scheda per aprire un grande screenshot con i dettagli.",
      },
      {
        title: "Modalità swipe",
        body: "Clicca su «Swipe» in alto per scorrere i siti uno a uno, come carte. Scorri a destra o premi → per mettere mi piace, a sinistra o ← per saltare.",
      },
      {
        title: "Fine",
        body: "Dopo aver scelto almeno una referenza, questa barra appare in basso. Clicca su «Fine» quando hai finito.",
      },
      {
        title: "Il tuo codice di selezione",
        body: "WInspo trasforma le tue scelte in un codice breve. Copialo e invialo al tuo designer insieme al link: vedrà esattamente cosa hai scelto, più un profilo di design automatico.",
      },
    ],
    manualTitle: "Il manuale di WInspo",
    manualIntro:
      "WInspo trasforma le scelte di design del tuo cliente in un codice breve e condivisibile.",
    manualHow: "Come funziona",
    manualSteps: [
      "Sfoglia una galleria di riferimenti di siti web e app.",
      "Seleziona quelli che si adattano al progetto.",
      "Condividi il codice breve con il tuo designer.",
      "Il designer incolla il codice per vedere esattamente cosa è stato scelto, più un profilo di design automatico.",
    ],
    manualSwipe: "Modalità swipe",
    manualSwipeBody:
      "Il modo più veloce per scegliere: scorri i siti uno per uno, come un mazzo di carte. Metti mi piace a quelli che ti piacciono e salta il resto. I tuoi like confluiscono nella stessa selezione.",
    manualLibrary: "Modalità manuale",
    manualLibraryBody:
      "Preferisci sfogliare tutta la libreria in una volta? Usa la vista a griglia per cercare e tocca i riferimenti che vuoi.",
    manualByo: "Porta il tuo dataset",
    manualByoBody:
      "Qualsiasi repository GitHub pubblico con un winspo.json alla radice può diventare un dataset.",
    manualLookup: "Lookup",
    manualLookupBody:
      "Incolla qualsiasi codice nella pagina di lookup per vedere la selezione e il suo profilo di design.",
  },
  es: {
    tutorialTitle: "Bienvenido a WInspo",
    tutorialIntro: "Aquí elegirás los diseños que te gustan.",
    tutorialSwipeNew:
      "Esto es nuevo — un modo de deslizar. Recorre los sitios como una baraja de cartas y dale me gusta a los que te gusten.",
    tutorialManualPick:
      "También puedes volver a la biblioteca completa y elegir manualmente.",
    tutorialStart: "Empezar",
    tutorialOpenManual: "Abrir el manual",
    tutorialStartTour: "Iniciar el recorrido",
    tourSkip: "Saltar",
    tourNext: "Siguiente",
    tourDone: "Listo",
    tourSteps: [
      {
        title: "Elegir referencias",
        body: "Toca una tarjeta de referencia para seleccionarla: recibe una marca de verificación. Toca de nuevo para deshacer.",
      },
      {
        title: "Buscar",
        body: "Escribe aquí una palabra como «portfolio» para filtrar la galería al instante.",
      },
      {
        title: "Vista previa grande",
        body: "Haz clic en «Full page» en una tarjeta para abrir una captura grande con detalles.",
      },
      {
        title: "Modo deslizar",
        body: "Haz clic en «Swipe» arriba para recorrer los sitios uno a uno, como cartas. Desliza a la derecha o pulsa → para dar me gusta, a la izquierda o ← para saltar.",
      },
      {
        title: "Terminar",
        body: "Después de elegir al menos una referencia, esta barra aparece abajo. Haz clic en «Listo» cuando termines.",
      },
      {
        title: "Tu código de selección",
        body: "WInspo convierte tus elecciones en un código corto. Cópialo y envíalo a tu diseñador junto con el enlace: verá exactamente lo que elegiste, más un perfil de diseño automático.",
      },
    ],
    manualTitle: "El manual de WInspo",
    manualIntro:
      "WInspo convierte las elecciones de diseño de tu cliente en un código corto y compartible.",
    manualHow: "Cómo funciona",
    manualSteps: [
      "Explora una galería de referencias de sitios web y aplicaciones.",
      "Selecciona las que encajen con el proyecto.",
      "Comparte el código corto con tu diseñador.",
      "El diseñador pega el código para ver exactamente lo elegido, más un perfil de diseño automático.",
    ],
    manualSwipe: "Modo de deslizar",
    manualSwipeBody:
      "La forma más rápida de elegir: recorre los sitios uno a uno, como una baraja de cartas. Dale me gusta a los que te gusten y salta el resto. Tus me gusta se suman a la misma selección.",
    manualLibrary: "Modo manual",
    manualLibraryBody:
      "¿Prefieres recorrer toda la biblioteca de una vez? Usa la vista de cuadrícula para buscar y toca las referencias que quieras.",
    manualByo: "Trae tu propio dataset",
    manualByoBody:
      "Cualquier repositorio público de GitHub con un winspo.json en su raíz puede convertirse en un dataset.",
    manualLookup: "Lookup",
    manualLookupBody:
      "Pega cualquier código en la página de lookup para ver la selección y su perfil de diseño.",
  },
  pt: {
    tutorialTitle: "Bem-vindo ao WInspo",
    tutorialIntro: "Aqui vai escolher os designs de que gosta.",
    tutorialSwipeNew:
      "Isto é novo — um modo de deslizar. Percorra os sites como um baralho de cartas e curta os de que gostar.",
    tutorialManualPick:
      "Também pode voltar à biblioteca completa e escolher manualmente.",
    tutorialStart: "Começar",
    tutorialOpenManual: "Abrir o manual",
    tutorialStartTour: "Iniciar a visita guiada",
    tourSkip: "Saltar",
    tourNext: "Seguinte",
    tourDone: "Concluir",
    tourSteps: [
      {
        title: "Escolher referências",
        body: "Toque num cartão de referência para o selecionar — fica com uma marca de verificação. Toque novamente para anular.",
      },
      {
        title: "Pesquisar",
        body: "Escreva aqui uma palavra como «portfolio» para filtrar a galeria instantaneamente.",
      },
      {
        title: "Pré-visualização maior",
        body: "Clique em «Full page» num cartão para abrir uma captura grande com detalhes.",
      },
      {
        title: "Modo de deslizar",
        body: "Clique em «Swipe» no topo para percorrer os sites um a um, como cartas. Deslize para a direita ou prima → para gostar, para a esquerda ou ← para saltar.",
      },
      {
        title: "Concluir",
        body: "Depois de escolher pelo menos uma referência, esta barra aparece na parte inferior. Clique em «Concluir» quando terminar.",
      },
      {
        title: "O seu código de seleção",
        body: "O WInspo transforma as suas escolhas num código curto. Copie-o e envie-o ao seu designer juntamente com o link — ele verá exatamente o que escolheu, além de um perfil de design automático.",
      },
    ],
    manualTitle: "O manual do WInspo",
    manualIntro:
      "O WInspo transforma as escolhas de design do seu cliente num código curto e partilhável.",
    manualHow: "Como funciona",
    manualSteps: [
      "Explore uma galeria de referências de sites e aplicações.",
      "Selecione as que se adequam ao projeto.",
      "Partilhe o código curto com o seu designer.",
      "O designer cola o código para ver exatamente o que foi escolhido, mais um perfil de design automático.",
    ],
    manualSwipe: "Modo de deslizar",
    manualSwipeBody:
      "A forma mais rápida de escolher: percorra os sites um a um, como um baralho de cartas. Curta os de que gostar e salte os restantes. Os seus gostos somam-se à mesma seleção.",
    manualLibrary: "Modo manual",
    manualLibraryBody:
      "Prefere percorrer toda a biblioteca de uma vez? Use a vista em grelha para pesquisar e toque nas referências que quiser.",
    manualByo: "Traga o seu próprio dataset",
    manualByoBody:
      "Qualquer repositório público do GitHub com um winspo.json na raiz pode tornar-se um dataset.",
    manualLookup: "Lookup",
    manualLookupBody:
      "Cole qualquer código na página de lookup para ver a seleção e o seu perfil de design.",
  },
  nl: {
    tutorialTitle: "Welkom bij WInspo",
    tutorialIntro: "Hier kies je de designs die je mooi vindt.",
    tutorialSwipeNew:
      "Dit is nieuw — een veegmodus. Blader door de sites als een stapel kaarten en liker wat je mooi vindt.",
    tutorialManualPick:
      "Je kunt ook terug naar de hele bibliotheek en handmatig kiezen.",
    tutorialStart: "Starten",
    tutorialOpenManual: "Handleiding openen",
    tutorialStartTour: "Start de rondleiding",
    tourSkip: "Overslaan",
    tourNext: "Volgende",
    tourDone: "Klaar",
    tourSteps: [
      {
        title: "Referenties kiezen",
        body: "Tik op een referentiekaart om deze te selecteren — hij krijgt een vinkje. Tik opnieuw om ongedaan te maken.",
      },
      {
        title: "Zoeken",
        body: "Typ hier een woord zoals 'portfolio' om de galerij direct te filteren.",
      },
      {
        title: "Grotere preview",
        body: "Klik op 'Full page' op een kaart om een grote schermafbeelding met details te openen.",
      },
      {
        title: "Veegmodus",
        body: "Klik bovenaan op 'Swipe' om de sites een voor een door te bladeren, als kaarten. Veeg naar rechts of druk op → om te liken, naar links of ← om over te slaan.",
      },
      {
        title: "Afronden",
        body: "Nadat je minstens één referentie hebt gekozen, verschijnt deze balk onderaan. Klik op 'Klaar' als je klaar bent.",
      },
      {
        title: "Jouw selectiecode",
        body: "WInspo verpakt jouw keuzes in een korte code. Kopieer hem en stuur hem samen met de link naar je designer — hij ziet precies wat je koos, plus een automatisch designprofiel.",
      },
    ],
    manualTitle: "De WInspo-handleiding",
    manualIntro:
      "WInspo zet de designkeuzes van je klant om in een korte, deelbare code.",
    manualHow: "Zo werkt het",
    manualSteps: [
      "Blader door een galerij met verwijzingen naar websites en apps.",
      "Kies de verwijzingen die bij het project passen.",
      "Deel de korte code met je designer.",
      "De designer plakt de code om precies te zien wat er gekozen is, plus een automatisch designprofiel.",
    ],
    manualSwipe: "Veegmodus",
    manualSwipeBody:
      "De snelste manier om te kiezen: blader de sites één voor één door, als een stapel kaarten. Liker wat je mooi vindt en sla de rest over. Je likes komen in dezelfde selectie terecht.",
    manualLibrary: "Handmatige modus",
    manualLibraryBody:
      "Blader je liever in één keer door de hele bibliotheek? Gebruik de rasterweergave om te zoeken en tik de verwijzingen aan die je wilt.",
    manualByo: "Eigen dataset meebrengen",
    manualByoBody:
      "Elke openbare GitHub-repository met een winspo.json in de root kan een dataset worden.",
    manualLookup: "Lookup",
    manualLookupBody:
      "Plak een willekeurige code op de lookup-pagina om de selectie en het designprofiel te zien.",
  },
  pl: {
    tutorialTitle: "Witamy w WInspo",
    tutorialIntro: "Tutaj przejdziesz przez wybieranie projektów, które Ci się podobają.",
    tutorialSwipeNew:
      "To nowość — tryb przesuwania. Przeglądaj strony jak talię kart i polub te, które Ci się podobają.",
    tutorialManualPick:
      "Możesz też wrócić do całej biblioteki i wybrać ręcznie.",
    tutorialStart: "Zaczynaj",
    tutorialOpenManual: "Otwórz instrukcję",
    tutorialStartTour: "Rozpocznij przewodnik",
    tourSkip: "Pomiń",
    tourNext: "Dalej",
    tourDone: "Gotowe",
    tourSteps: [
      {
        title: "Wybierz odniesienia",
        body: "Dotknij karty odniesienia, aby ją wybrać — dostanie znacznik wyboru. Dotknij ponownie, aby cofnąć.",
      },
      {
        title: "Szukaj",
        body: "Wpisz tutaj słowo, np. „portfolio”, aby natychmiast przefiltrować galerię.",
      },
      {
        title: "Większy podgląd",
        body: "Kliknij „Full page” na karcie, aby otworzyć duży zrzut ekranu ze szczegółami.",
      },
      {
        title: "Tryb przesuwania",
        body: "Kliknij „Swipe” u góry, aby przeglądać strony jedna po drugiej, jak karty. Przesuń w prawo lub naciśnij →, aby polubić, w lewo lub ←, aby pominąć.",
      },
      {
        title: "Zakończ",
        body: "Po wybraniu co najmniej jednego odniesienia ten pasek pojawi się na dole. Kliknij „Gotowe”, gdy skończysz.",
      },
      {
        title: "Twój kod wyboru",
        body: "WInspo zamienia Twoje wybory w krótki kod. Skopiuj go i wyślij projektantowi razem z linkiem — zobaczy dokładnie, co wybrałeś, oraz automatyczny profil projektu.",
      },
    ],
    manualTitle: "Instrukcja WInspo",
    manualIntro:
      "WInspo zamienia wybory projektowe Twojego klienta w krótki, łatwy do udostępnienia kod.",
    manualHow: "Jak to działa",
    manualSteps: [
      "Przeglądaj galerię odniesień do stron i aplikacji.",
      "Wybierz te, które pasują do projektu.",
      "Podziel się krótkim kodem z projektantem.",
      "Projektant wkleja kod i widzi dokładnie, co zostało wybrane, oraz automatyczny profil projektu.",
    ],
    manualSwipe: "Tryb przesuwania",
    manualSwipeBody:
      "Najszybszy sposób wyboru: przeglądaj strony jedna po drugiej, jak talię kart. Polub te, które Ci się podobają, i pomiń resztę. Twoje polubienia trafiają do tej samej selekcji.",
    manualLibrary: "Tryb ręczny",
    manualLibraryBody:
      "Wolisz przeglądać całą bibliotekę naraz? Użyj widoku siatki, aby szukać, i dotknij wybranych odniesień.",
    manualByo: "Przynieś własny zbiór danych",
    manualByoBody:
      "Każde publiczne repozytorium GitHub z plikiem winspo.json w katalogu głównym może stać się zbiorem danych.",
    manualLookup: "Lookup",
    manualLookupBody:
      "Wklej dowolny kod na stronie lookup, aby zobaczyć selekcję i jej profil projektu.",
  },
  cs: {
    tutorialTitle: "Vítejte ve WInspo",
    tutorialIntro: "Tady si projdete výběr návrhů, které se vám líbí.",
    tutorialSwipeNew:
      "To je novinka — režim přejíždění. Prolistujte weby jako balíček karet a lajkujte ty, které se vám líbí.",
    tutorialManualPick:
      "Můžete se také vrátit do celé knihovny a vybírat ručně.",
    tutorialStart: "Začít",
    tutorialOpenManual: "Otevřít příručku",
    tutorialStartTour: "Spustit prohlídku",
    tourSkip: "Přeskočit",
    tourNext: "Další",
    tourDone: "Hotovo",
    tourSteps: [
      {
        title: "Vybrat reference",
        body: "Klepněte na referenční kartu a vyberte ji – dostane zatržítko. Klepněte znovu pro zrušení.",
      },
      {
        title: "Hledat",
        body: "Zde napište slovo jako „portfolio“, abyste galerii okamžitě vyfiltrovali.",
      },
      {
        title: "Větší náhled",
        body: "Klikněte na „Full page“ na kartě a otevřete velký snímek s detaily.",
      },
      {
        title: "Režim přejíždění",
        body: "Klikněte nahoře na „Swipe“, abyste procházeli weby jeden po druhém jako karty. Přejíždějte vpravo nebo stiskněte → pro lajk, vlevo nebo ← pro přeskočení.",
      },
      {
        title: "Dokončit",
        body: "Po výběru alespoň jedné reference se tato lišta objeví dole. Až budete hotovi, klikněte na „Hotovo“.",
      },
      {
        title: "Váš kód výběru",
        body: "WInspo promění vaše výběry v krátký kód. Zkopírujte jej a pošlete designérovi spolu s odkazem – uvidí přesně, co jste zvolili, plus automatický designový profil.",
      },
    ],
    manualTitle: "Příručka WInspo",
    manualIntro:
      "WInspo mění výběr návrhů vašeho klienta na krátký kód, který lze sdílet.",
    manualHow: "Jak to funguje",
    manualSteps: [
      "Prohlédněte si galerii referencí webů a aplikací.",
      "Vyberte ty, které se hodí k projektu.",
      "Pošlete krátký kód svému designérovi.",
      "Designér vloží kód a uvidí přesně, co bylo vybráno, plus automatický designový profil.",
    ],
    manualSwipe: "Režim přejíždění",
    manualSwipeBody:
      "Nejrychlejší způsob výběru: prolistujte weby jeden po druhém jako balíček karet. Lajkujte ty, které se vám líbí, a ostatní přeskočte. Vaše lajky se přidávají do stejného výběru.",
    manualLibrary: "Ruční režim",
    manualLibraryBody:
      "Raději prohlížíte celou knihovnu najednou? Použijte mřížkové zobrazení pro vyhledávání a ťukněte na reference, které chcete.",
    manualByo: "Přineste si vlastní datovou sadu",
    manualByoBody:
      "Jakékoli veřejné úložiště GitHub s winspo.json v kořenu se může stát datovou sadou.",
    manualLookup: "Lookup",
    manualLookupBody:
      "Vložte libovolný kód na stránku lookup, abyste viděli výběr a jeho designový profil.",
  },
  sk: {
    tutorialTitle: "Vitajte vo WInspo",
    tutorialIntro: "Tu si prejdete výberom návrhov, ktoré sa vám páčia.",
    tutorialSwipeNew:
      "Toto je novinka — režim posúvania. Prelistujte weby ako balíček kariet a lajkujte tie, ktoré sa vám páčia.",
    tutorialManualPick:
      "Môžete sa tiež vrátiť do celej knižnice a vybrať manuálne.",
    tutorialStart: "Začať",
    tutorialOpenManual: "Otvoriť príručku",
    tutorialStartTour: "Spustiť prehliadku",
    tourSkip: "Preskočiť",
    tourNext: "Ďalej",
    tourDone: "Hotovo",
    tourSteps: [
      {
        title: "Vybrať referencie",
        body: "Klepnutím na referenčnú kartu ju vyberiete – dostane začiarknutie. Klepnite znova pre zrušenie.",
      },
      {
        title: "Hľadať",
        body: "Sem napíšte slovo ako „portfolio“, aby ste galériu okamžite vyfiltrovali.",
      },
      {
        title: "Väčší náhľad",
        body: "Kliknite na „Full page“ na karte a otvoríte veľkú snímku s detailmi.",
      },
      {
        title: "Režim posúvania",
        body: "Kliknite hore na „Swipe“ a prechádzajte weby jeden po druhom ako karty. Posuňte doprava alebo stlačte → pre lajk, doľava alebo ← pre preskočenie.",
      },
      {
        title: "Dokončiť",
        body: "Po výbere aspoň jednej referencie sa táto lišta objaví dole. Keď budete hotoví, kliknite na „Hotovo“.",
      },
      {
        title: "Váš výberový kód",
        body: "WInspo zmení vaše výbery na krátky kód. Skopírujte ho a pošlite dizajnérovi spolu s odkazom – uvidí presne, čo ste vybrali, plus automatický dizajnový profil.",
      },
    ],
    manualTitle: "Príručka WInspo",
    manualIntro:
      "WInspo mení výber návrhov vášho klienta na krátky kód, ktorý možno zdieľať.",
    manualHow: "Ako to funguje",
    manualSteps: [
      "Prezrite si galériu referencií webov a aplikácií.",
      "Vyberte tie, ktoré sa hodia k projektu.",
      "Pošlite krátky kód svojmu dizajnérovi.",
      "Dizajnér vloží kód a uvidí presne, čo bolo vybrané, plus automatický dizajnový profil.",
    ],
    manualSwipe: "Režim posúvania",
    manualSwipeBody:
      "Najrýchlejší spôsob výberu: prelistujte weby jeden po druhom ako balíček kariet. Lajkujte tie, ktoré sa vám páčia, a ostatné preskočte. Vaše lajky sa pridávajú do rovnakého výberu.",
    manualLibrary: "Manuálny režim",
    manualLibraryBody:
      "Radšej prezeráte celú knižnicu naraz? Použite mriežkové zobrazenie na vyhľadávanie a ťuknite na referencie, ktoré chcete.",
    manualByo: "Prineste si vlastný dátový súbor",
    manualByoBody:
      "Akékoľvek verejné úložisko GitHub so súborom winspo.json v koreni sa môže stať dátovým súborom.",
    manualLookup: "Lookup",
    manualLookupBody:
      "Vložte ľubovoľný kód na stránku lookup, aby ste videli výber a jeho dizajnový profil.",
  },
  sl: {
    tutorialTitle: "Dobrodošli v WInspo",
    tutorialIntro: "Tu boste izbrali dizajne, ki so vam všeč.",
    tutorialSwipeNew:
      "To je novost — način podrsavanja. Preletite spletišča kot kup kart in všečkajte tista, ki so vam všeč.",
    tutorialManualPick:
      "Lahko se tudi vrnete na celotno knjižnico in izbirate ročno.",
    tutorialStart: "Začni",
    tutorialOpenManual: "Odpri priročnik",
    tutorialStartTour: "Začni ogled",
    tourSkip: "Preskoči",
    tourNext: "Naprej",
    tourDone: "Končano",
    tourSteps: [
      {
        title: "Izberi reference",
        body: "Tapnite referenčno kartico, da jo izberete – dobi kljukico. Tapnite znova za razveljavitev.",
      },
      {
        title: "Iskanje",
        body: "Vnesite besedo, na primer »portfolio«, za takojšnje filtriranje galerije.",
      },
      {
        title: "Večji predogled",
        body: "Kliknite »Full page« na kartici, da odprete velik posnetek s podrobnostmi.",
      },
      {
        title: "Način podrsavanja",
        body: "Kliknite »Swipe« zgoraj, da preletite spletišča eno za drugim, kot karte. Podrsajte desno ali pritisnite → za všeček, levo ali ← za preskok.",
      },
      {
        title: "Zaključi",
        body: "Ko izberete vsaj eno referenco, se ta vrstica prikaže spodaj. Kliknite »Končano«, ko končate.",
      },
      {
        title: "Vaša izbirna koda",
        body: "WInspo spremeni vaše izbire v kratko kodo. Kopirajte jo in jo pošljite oblikovalcu skupaj s povezavo – videl bo točno, kaj ste izbrali, plus samodejni dizajnerski profil.",
      },
    ],
    manualTitle: "Priročnik WInspo",
    manualIntro:
      "WInspo spremeni dizajnerske izbire vaše stranke v kratek, deljiv kod.",
    manualHow: "Kako deluje",
    manualSteps: [
      "Prebrskajte galerijo referenc za spletišča in aplikacije.",
      "Izberite tiste, ki ustrezajo projektu.",
      "Delite kratek kod s svojim oblikovalcem.",
      "Oblikovalec prilepi kod in vidi točno, kaj je bilo izbrano, plus samodejni dizajnerski profil.",
    ],
    manualSwipe: "Način podrsavanja",
    manualSwipeBody:
      "Najhitrejši način izbire: preletite spletišča eno za drugim, kot kup kart. Všečkajte tista, ki so vam všeč, ostale pa preskočite. Vaši všečki se dodajo v isti izbor.",
    manualLibrary: "Ročni način",
    manualLibraryBody:
      "Raje brskate po celotni knjižnici naenkrat? Uporabite mrežni pogled za iskanje in tapnite reference, ki jih želite.",
    manualByo: "Prinesite svoj nabor podatkov",
    manualByoBody:
      "Vsako javno skladišče GitHub z datoteko winspo.json v korenu lahko postane nabor podatkov.",
    manualLookup: "Lookup",
    manualLookupBody:
      "Prilepite poljuben kod na strani lookup, da vidite izbor in njegov dizajnerski profil.",
  },
  hr: {
    tutorialTitle: "Dobrodošli u WInspo",
    tutorialIntro: "Ovdje ćete birati dizajne koji vam se sviđaju.",
    tutorialSwipeNew:
      "Ovo je novost — način prijevoza (swipe). Prođite kroz stranice kao kroz špil karata i lajkajte one koje vam se sviđaju.",
    tutorialManualPick:
      "Također se možete vratiti u cijelu biblioteku i birati ručno.",
    tutorialStart: "Započni",
    tutorialOpenManual: "Otvori priručnik",
    tutorialStartTour: "Pokreni obilazak",
    tourSkip: "Preskoči",
    tourNext: "Dalje",
    tourDone: "Gotovo",
    tourSteps: [
      {
        title: "Odaberi reference",
        body: "Dodirnite karticu reference da biste je odabrali – dobiva kvačicu. Dodirnite ponovno za poništavanje.",
      },
      {
        title: "Pretraživanje",
        body: "Ovdje upišite riječ poput „portfolio“ za trenutačno filtriranje galerije.",
      },
      {
        title: "Veći pregled",
        body: "Kliknite „Full page“ na kartici da biste otvorili veliku snimku s detaljima.",
      },
      {
        title: "Način prijevoza",
        body: "Kliknite „Swipe“ na vrhu da biste prolazili kroz stranice jednu po jednu, kao karte. Povucite udesno ili pritisnite → za lajk, ulijevo ili ← za preskakanje.",
      },
      {
        title: "Završi",
        body: "Nakon što odaberete barem jednu referencu, ova se traka pojavljuje na dnu. Kliknite „Gotovo“ kada završite.",
      },
      {
        title: "Vaš kod odabira",
        body: "WInspo pretvara vaše odabire u kratki kod. Kopirajte ga i pošaljite dizajneru zajedno s poveznicom – vidjet će točno što ste odabrali, plus automatski dizajnerski profil.",
      },
    ],
    manualTitle: "WInspo priručnik",
    manualIntro:
      "WInspo pretvara dizajnerske izbore vašeg klijenta u kratki, djeljivi kod.",
    manualHow: "Kako funkcionira",
    manualSteps: [
      "Pregledajte galeriju referenci za web stranice i aplikacije.",
      "Odaberite one koje odgovaraju projektu.",
      "Podijelite kratki kod sa svojim dizajnerom.",
      "Dizajner zalijepi kod i vidi točno što je odabrano, plus automatski dizajnerski profil.",
    ],
    manualSwipe: "Način prijevoza",
    manualSwipeBody:
      "Najbrži način odabira: prođite kroz stranice jednu po jednu, kao kroz špil karata. Lajkajte one koje vam se sviđaju, a ostale preskočite. Vaši lajkovi ulaze u isti odabir.",
    manualLibrary: "Ručni način",
    manualLibraryBody:
      "Radije pregledavate cijelu biblioteku odjednom? Koristite mrežni prikaz za pretraživanje i dodirnite reference koje želite.",
    manualByo: "Donesite vlastiti skup podataka",
    manualByoBody:
      "Svako javno GitHub spremište s winspo.json u korijenu može postati skup podataka.",
    manualLookup: "Lookup",
    manualLookupBody:
      "Zalijepite bilo koji kod na stranicu lookup da vidite odabir i njegov dizajnerski profil.",
  },
  bg: {
    tutorialTitle: "Добре дошли в WInspo",
    tutorialIntro: "Тук ще изберете дизайните, които харесвате.",
    tutorialSwipeNew:
      "Това е новост — режим на плъзгане. Прегледайте сайтовете като тесте карти и харесайте тези, които ви харесват.",
    tutorialManualPick:
      "Можете също да се върнете към цялата библиотека и да изберете ръчно.",
    tutorialStart: "Започни",
    tutorialOpenManual: "Отвори ръководството",
    tutorialStartTour: "Започнете обиколката",
    tourSkip: "Пропусни",
    tourNext: "Напред",
    tourDone: "Готово",
    tourSteps: [
      {
        title: "Изберете референции",
        body: "Докоснете референтна карта, за да я изберете – получава отметка. Докоснете отново, за да отмените.",
      },
      {
        title: "Търсене",
        body: "Въведете тук дума като „portfolio“, за да филтрирате галерията веднага.",
      },
      {
        title: "По-голям преглед",
        body: "Кликнете върху „Full page“ на карта, за да отворите голям екран със подробности.",
      },
      {
        title: "Режим на плъзгане",
        body: "Кликнете върху „Swipe“ в горната част, за да преглеждате сайтовете един по един, като карти. Плъзнете надясно или натиснете → за харесване, наляво или ← за пропускане.",
      },
      {
        title: "Завършване",
        body: "След като изберете поне една референция, тази лента се появява в долната част. Кликнете върху „Готово“, когато приключите.",
      },
      {
        title: "Вашият код за избор",
        body: "WInspo превръща изборите ви в кратък код. Копирайте го и го изпратете на дизайнера заедно с връзката – той ще види точно какво сте избрали, плюс автоматичен дизайнерски профил.",
      },
    ],
    manualTitle: "Ръководство за WInspo",
    manualIntro:
      "WInspo превръща дизайнерските избори на клиента ви в кратък, лесен за споделяне код.",
    manualHow: "Как работи",
    manualSteps: [
      "Разгледайте галерия от референции за уебсайтове и приложения.",
      "Изберете тези, които подхождат на проекта.",
      "Споделете краткия код с вашия дизайнер.",
      "Дизайнерът поставя кода и вижда точно какво е избрано, плюс автоматичен дизайнерски профил.",
    ],
    manualSwipe: "Режим на плъзгане",
    manualSwipeBody:
      "Най-бързият начин за избор: преглеждайте сайтовете един по един, като тесте карти. Харесвайте тези, които ви харесват, и пропускайте останалите. Вашите харесвания влизат в същата селекция.",
    manualLibrary: "Ръчен режим",
    manualLibraryBody:
      "Предпочитате ли да разглеждате цялата библиотека наведнъж? Използвайте мрежов изглед за търсене и докоснете референциите, които искате.",
    manualByo: "Донесете свой набор от данни",
    manualByoBody:
      "Всяко публично GitHub хранилище с winspo.json в корена може да стане набор от данни.",
    manualLookup: "Lookup",
    manualLookupBody:
      "Поставете произволен код на страницата lookup, за да видите селекцията и нейния дизайнерски профил.",
  },
  ro: {
    tutorialTitle: "Bine ați venit la WInspo",
    tutorialIntro: "Aici veți trece prin alegerea designurilor care vă plac.",
    tutorialSwipeNew:
      "Aceasta este o noutate — un mod de glisare. Parcurgeți site-urile ca un pachet de cărți și dați like celor care vă plac.",
    tutorialManualPick:
      "De asemenea, vă puteți întoarce la întreaga bibliotecă și puteți alege manual.",
    tutorialStart: "Începe",
    tutorialOpenManual: "Deschide manualul",
    tutorialStartTour: "Începeți turul",
    tourSkip: "Sari peste",
    tourNext: "Înainte",
    tourDone: "Gata",
    tourSteps: [
      {
        title: "Alegeți referințe",
        body: "Atingeți o carte de referință pentru a o selecta – primește o bifă. Atingeți din nou pentru a anula.",
      },
      {
        title: "Căutare",
        body: "Scrieți aici un cuvânt precum „portfolio“ pentru a filtra galeria instantaneu.",
      },
      {
        title: "Previzualizare mai mare",
        body: "Faceți clic pe „Full page“ pe o carte pentru a deschide o captură mare cu detalii.",
      },
      {
        title: "Mod de glisare",
        body: "Faceți clic pe „Swipe“ în partea de sus pentru a parcurge site-urile unul câte unul, ca niște cărți. Glisați la dreapta sau apăsați → pentru a da like, la stânga sau ← pentru a sări.",
      },
      {
        title: "Finalizare",
        body: "După ce alegeți cel puțin o referință, această bară apare în partea de jos. Faceți clic pe „Gata“ când ați terminat.",
      },
      {
        title: "Codul dvs. de selecție",
        body: "WInspo transformă alegerile dvs. într-un cod scurt. Copiați-l și trimiteți-l designerului împreună cu linkul – va vedea exact ce ați ales, plus un profil de design automat.",
      },
    ],
    manualTitle: "Manualul WInspo",
    manualIntro:
      "WInspo transformă alegerile de design ale clientului dvs. într-un cod scurt, ușor de partajat.",
    manualHow: "Cum funcționează",
    manualSteps: [
      "Răsfoiți o galerie de referințe pentru site-uri și aplicații.",
      "Selectați-le pe cele potrivite pentru proiect.",
      "Împărtășiți codul scurt cu designerul dvs.",
      "Designerul lipește codul și vede exact ce a fost ales, plus un profil de design automat.",
    ],
    manualSwipe: "Mod de glisare",
    manualSwipeBody:
      "Cel mai rapid mod de a alege: parcurgeți site-urile unul câte unul, ca un pachet de cărți. Dați like celor care vă plac și săriți peste restul. Like-urile dvs. se adaugă la aceeași selecție.",
    manualLibrary: "Mod manual",
    manualLibraryBody:
      "Preferați să răsfoiți toată biblioteca deodată? Folosiți vizualizarea în grilă pentru căutare și atingeți referințele dorite.",
    manualByo: "Aduceți propriul set de date",
    manualByoBody:
      "Orice depozit public GitHub cu un winspo.json în rădăcină poate deveni un set de date.",
    manualLookup: "Lookup",
    manualLookupBody:
      "Lipiți orice cod în pagina lookup pentru a vedea selecția și profilul ei de design.",
  },
  hu: {
    tutorialTitle: "Üdvözöljük a WInspo-ban",
    tutorialIntro: "Itt kiválasztja azokat a dizájnokat, amelyek tetszenek.",
    tutorialSwipeNew:
      "Ez új — egy pöccintéses mód. Lapozzon a weboldalakon, mint egy kártyapakli, és lájkolja, ami tetszik.",
    tutorialManualPick:
      "Visszatérhet a teljes könyvtárhoz, és manuálisan is választhat.",
    tutorialStart: "Kezdés",
    tutorialOpenManual: "Kézikönyv megnyitása",
    tutorialStartTour: "Indítsa el a túrát",
    tourSkip: "Kihagyás",
    tourNext: "Tovább",
    tourDone: "Kész",
    tourSteps: [
      {
        title: "Referenciák kiválasztása",
        body: "Érintsen meg egy referencia kártyát a kiválasztáshoz – pipát kap. Érintse meg újra a visszavonáshoz.",
      },
      {
        title: "Keresés",
        body: "Írjon be itt egy szót, például „portfolio“, hogy azonnal szűrje a galériát.",
      },
      {
        title: "Nagyobb előnézet",
        body: "Kattintson a „Full page“ gombra egy kártyán a nagy, részletes képernyőkép megnyitásához.",
      },
      {
        title: "Pöccintéses mód",
        body: "Kattintson a fenti „Swipe“ gombra, hogy a webhelyeket egyenként lapozhassa, mint a kártyákat. Pöccintsen jobbra vagy nyomja meg a → gombot a lájkhoz, balra vagy a ← gombot az átugráshoz.",
      },
      {
        title: "Befejezés",
        body: "Miután legalább egy referenciát kiválasztott, ez a sáv alul jelenik meg. Ha kész, kattintson a „Kész“ gombra.",
      },
      {
        title: "Az Ön választási kódja",
        body: "A WInspo rövid kóddá alakítja a választásait. Másolja ki, és küldje el tervezőjének a hivatkozással együtt – pontosan látni fogja, mit választott, plusz egy automatikus dizájnprofilt.",
      },
    ],
    manualTitle: "A WInspo kézikönyv",
    manualIntro:
      "A WInspo rövid, megosztható kóddá alakítja ügyfele dizájnválasztásait.",
    manualHow: "Hogyan működik",
    manualSteps: [
      "Böngésszen weboldal- és alkalmazásreferenciák galériájában.",
      "Válassza ki azokat, amelyek illenek a projekthez.",
      "Ossza meg a rövid kódot a tervezőjével.",
      "A tervező beilleszti a kódot, és pontosan látja, mi lett kiválasztva, plusz egy automatikus dizájnprofilt.",
    ],
    manualSwipe: "Pöccintéses mód",
    manualSwipeBody:
      "A leggyorsabb választási mód: lapozzon a weboldalakon egyenként, mint egy kártyapakli. Lájkolja, ami tetszik, és hagyja ki a többit. A lájkok ugyanabba a kijelölésbe kerülnek.",
    manualLibrary: "Manuális mód",
    manualLibraryBody:
      "Inkább egyszerre böngészi a teljes könyvtárat? Használja a rácsnézetet a kereséshez, és érintse meg a kívánt referenciákat.",
    manualByo: "Hozza el saját adatkészletét",
    manualByoBody:
      "Bármely nyilvános GitHub-tárhely winspo.json fájllal a gyökerében adatkészletté válhat.",
    manualLookup: "Lookup",
    manualLookupBody:
      "Illesszen be bármilyen kódot a lookup oldalba, hogy lássa a kijelölést és a dizájnprofilját.",
  },
  el: {
    tutorialTitle: "Καλώς ήρθατε στο WInspo",
    tutorialIntro: "Εδώ θα επιλέξετε τα σχέδια που σας αρέσουν.",
    tutorialSwipeNew:
      "Αυτό είναι νέο — μια λειτουργία swipe. Ξεφυλλίστε τους ιστότοπους σαν τράπουλα και κάντε like σε όσους σας αρέσουν.",
    tutorialManualPick:
      "Μπορείτε επίσης να επιστρέψετε σε ολόκληρη τη βιβλιοθήκη και να επιλέξετε χειροκίνητα.",
    tutorialStart: "Ξεκινήστε",
    tutorialOpenManual: "Άνοιγμα εγχειριδίου",
    tutorialStartTour: "Ξεκινήστε την ξενάγηση",
    tourSkip: "Παράβλεψη",
    tourNext: "Επόμενο",
    tourDone: "Τέλος",
    tourSteps: [
      {
        title: "Επιλέξτε αναφορές",
        body: "Πατήστε μια κάρτα αναφοράς για να την επιλέξετε — λαμβάνει ένα τικ. Πατήστε ξανά για ακύρωση.",
      },
      {
        title: "Αναζήτηση",
        body: "Πληκτρολογήστε εδώ μια λέξη όπως «portfolio» για να φιλτράρετε αμέσως τη συλλογή.",
      },
      {
        title: "Μεγαλύτερη προεπισκόπηση",
        body: "Κάντε κλικ στο «Full page» σε μια κάρτα για να ανοίξετε μια μεγάλη εικόνα με λεπτομέρειες.",
      },
      {
        title: "Λειτουργία swipe",
        body: "Κάντε κλικ στο «Swipe» στην κορυφή για να περιηγηθείτε στους ιστότοπους έναν έναν, σαν κάρτες. Σύρετε δεξιά ή πατήστε → για like, αριστερά ή ← για παράλειψη.",
      },
      {
        title: "Τέλος",
        body: "Αφού επιλέξετε τουλάχιστον μία αναφορά, αυτή η γραμμή εμφανίζεται κάτω. Κάντε κλικ στο «Τέλος» όταν τελειώσετε.",
      },
      {
        title: "Ο κωδικός επιλογής σας",
        body: "Το WInspo μετατρέπει τις επιλογές σας σε έναν σύντομο κωδικό. Αντιγράψτε τον και στείλτε τον στον σχεδιαστή σας μαζί με τον σύνδεσμο — θα δει ακριβώς τι επιλέξατε, συν ένα αυτόματο προφίλ σχεδιασμού.",
      },
    ],
    manualTitle: "Το εγχειρίδιο του WInspo",
    manualIntro:
      "Το WInspo μετατρέπει τις σχεδιαστικές επιλογές του πελάτη σας σε έναν σύντομο, κοινόχρηστο κωδικό.",
    manualHow: "Πώς λειτουργεί",
    manualSteps: [
      "Περιηγηθείτε σε μια συλλογή αναφορών για ιστότοπους και εφαρμογές.",
      "Επιλέξτε εκείνες που ταιριάζουν στο έργο.",
      "Μοιραστείτε τον σύντομο κωδικό με τον σχεδιαστή σας.",
      "Ο σχεδιαστής επικολλά τον κωδικό και βλέπει ακριβώς τι επιλέχθηκε, συν ένα αυτόματο προφίλ σχεδιασμού.",
    ],
    manualSwipe: "Λειτουργία swipe",
    manualSwipeBody:
      "Ο γρηγορότερος τρόπος επιλογής: ξεφυλλίστε τους ιστότοπους έναν έναν, σαν τράπουλα. Κάντε like σε όσους σας αρέσουν και προσπεράστε τους υπόλοιπους. Τα likes σας προστίθενται στην ίδια επιλογή.",
    manualLibrary: "Χειροκίνητη λειτουργία",
    manualLibraryBody:
      "Προτιμάτε να περιηγηθείτε σε ολόκληρη τη βιβλιοθήκη ταυτόχρονα; Χρησιμοποιήστε την προβολή πλέγματος για αναζήτηση και πατήστε τις αναφορές που θέλετε.",
    manualByo: "Φέρτε το δικό σας σύνολο δεδομένων",
    manualByoBody:
      "Οποιοδήποτε δημόσιο αποθετήριο GitHub με winspo.json στη ρίζα μπορεί να γίνει σύνολο δεδομένων.",
    manualLookup: "Lookup",
    manualLookupBody:
      "Επικολλήστε οποιονδήποτε κωδικό στη σελίδα lookup για να δείτε την επιλογή και το προφίλ σχεδιασμού της.",
  },
  sv: {
    tutorialTitle: "Välkommen till WInspo",
    tutorialIntro: "Här går du igenom och väljer de designer du gillar.",
    tutorialSwipeNew:
      "Det här är nytt — ett svepläge. Bläddra igenom webbplatserna som en kortlek och gilla dem du gillar.",
    tutorialManualPick:
      "Du kan också gå tillbaka till hela biblioteket och välja manuellt.",
    tutorialStart: "Sätt igång",
    tutorialOpenManual: "Öppna handboken",
    tutorialStartTour: "Starta rundturen",
    tourSkip: "Hoppa över",
    tourNext: "Nästa",
    tourDone: "Klar",
    tourSteps: [
      {
        title: "Välj referenser",
        body: "Tryck på ett referenskort för att välja det – det får en bock. Tryck igen för att ångra.",
      },
      {
        title: "Sök",
        body: "Skriv ett ord som „portfolio“ här för att filtrera galleriet direkt.",
      },
      {
        title: "Större förhandsvisning",
        body: "Klicka på „Full page“ på ett kort för att öppna en stor skärmbild med detaljer.",
      },
      {
        title: "Svepläge",
        body: "Klicka på „Swipe“ högst upp för att gå igenom webbplatserna en i taget, som kort. Svep åt höger eller tryck på → för att gilla, åt vänster eller ← för att hoppa över.",
      },
      {
        title: "Avsluta",
        body: "När du har valt minst en referens visas den här listen längst ner. Klicka på „Klar“ när du är klar.",
      },
      {
        title: "Din valkod",
        body: "WInspo packar dina val i en kort kod. Kopiera den och skicka den till din designer tillsammans med länken – de ser exakt vad du valde, plus en automatisk designprofil.",
      },
    ],
    manualTitle: "WInspo-handboken",
    manualIntro:
      "WInspo förvandlar din kunds designval till en kort, delbar kod.",
    manualHow: "Så här fungerar det",
    manualSteps: [
      "Bläddra i ett galleri med referenser till webbplatser och appar.",
      "Välj de som passar projektet.",
      "Dela den korta koden med din designer.",
      "Designern klistrar in koden och ser exakt vad som valdes, plus en automatisk designprofil.",
    ],
    manualSwipe: "Svepläge",
    manualSwipeBody:
      "Det snabbaste sättet att välja: bläddra igenom webbplatserna en i taget, som en kortlek. Gilla dem du gillar och hoppa över resten. Dina gillningar läggs till i samma urval.",
    manualLibrary: "Manuellt läge",
    manualLibraryBody:
      "Föredrar du att bläddra i hela biblioteket på en gång? Använd rutnätsvyn för att söka och tryck på de referenser du vill ha.",
    manualByo: "Ta med ditt eget dataset",
    manualByoBody:
      "Alla offentliga GitHub-repon med en winspo.json i roten kan bli ett dataset.",
    manualLookup: "Lookup",
    manualLookupBody:
      "Klistra in valfri kod på lookupsidan för att se urvalet och dess designprofil.",
  },
  da: {
    tutorialTitle: "Velkommen til WInspo",
    tutorialIntro: "Her gennemgår du valget af de designs, du kan lide.",
    tutorialSwipeNew:
      "Det her er nyt — en swipe-tilstand. Bladr gennem siderne som et sæt kort, og like dem, du kan lide.",
    tutorialManualPick:
      "Du kan også vende tilbage til hele biblioteket og vælge manuelt.",
    tutorialStart: "Kom i gang",
    tutorialOpenManual: "Åbn manualen",
    tutorialStartTour: "Start rundvisningen",
    tourSkip: "Spring over",
    tourNext: "Næste",
    tourDone: "Færdig",
    tourSteps: [
      {
        title: "Vælg referencer",
        body: "Tryk på et referencekort for at vælge det – det får et flueben. Tryk igen for at fortryde.",
      },
      {
        title: "Søg",
        body: "Skriv et ord som „portfolio“ her for at filtrere galleriet med det samme.",
      },
      {
        title: "Større forhåndsvisning",
        body: "Klik på „Full page“ på et kort for at åbne et stort skærmbillede med detaljer.",
      },
      {
        title: "Swipe-tilstand",
        body: "Klik på „Swipe“ øverst for at bladre gennem siderne én ad gangen, som kort. Stryg til højre eller tryk på → for at like, til venstre eller ← for at springe over.",
      },
      {
        title: "Afslut",
        body: "Når du har valgt mindst én reference, vises denne bjælke nederst. Klik på „Færdig“, når du er færdig.",
      },
      {
        title: "Din udvalgskode",
        body: "WInspo pakker dine valg i en kort kode. Kopier den, og send den til din designer sammen med linket – de ser præcis, hvad du valgte, plus en automatisk designprofil.",
      },
    ],
    manualTitle: "WInspo-manualen",
    manualIntro:
      "WInspo omdanner din kundes designvalg til en kort, delbar kode.",
    manualHow: "Sådan fungerer det",
    manualSteps: [
      "Bladr gennem et galleri med referencer til hjemmesider og apps.",
      "Vælg dem, der passer til projektet.",
      "Del den korte kode med din designer.",
      "Designeren indsætter koden og ser præcis, hvad der blev valgt, plus en automatisk designprofil.",
    ],
    manualSwipe: "Swipe-tilstand",
    manualSwipeBody:
      "Den hurtigste måde at vælge på: bladr gennem siderne én ad gangen, som et sæt kort. Like dem, du kan lide, og spring resten over. Dine likes bliver en del af det samme udvalg.",
    manualLibrary: "Manuel tilstand",
    manualLibraryBody:
      "Foretrækker du at bladre i hele biblioteket på én gang? Brug gittervisningen til at søge, og tryk på de referencer, du vil have.",
    manualByo: "Medbring dit eget datasæt",
    manualByoBody:
      "Ethvert offentligt GitHub-repo med en winspo.json i roden kan blive et datasæt.",
    manualLookup: "Lookup",
    manualLookupBody:
      "Indsæt en hvilken som helst kode på lookup-siden for at se udvalget og dets designprofil.",
  },
  fi: {
    tutorialTitle: "Tervetuloa WInspoon",
    tutorialIntro: "Täällä käyt läpi suunnitteluja, joista pidät, ja valitset niitä.",
    tutorialSwipeNew:
      "Tämä on uutta — pyyhkäisytila. Selaa sivustoja kuin korttipakkaa ja tykkää niistä, joista pidät.",
    tutorialManualPick:
      "Voit myös palata koko kirjastoon ja valita manuaalisesti.",
    tutorialStart: "Aloita",
    tutorialOpenManual: "Avaa käsikirja",
    tutorialStartTour: "Aloita opastettu kierros",
    tourSkip: "Ohita",
    tourNext: "Seuraava",
    tourDone: "Valmis",
    tourSteps: [
      {
        title: "Valitse viittaukset",
        body: "Napauta viitekorttia valitaksesi sen – se saa valintamerkin. Napauta uudelleen peruaksesi.",
      },
      {
        title: "Haku",
        body: "Kirjoita tähän sana, kuten „portfolio“, suodattaaksesi gallerian heti.",
      },
      {
        title: "Suurempi esikatselu",
        body: "Klikkaa kortin „Full page“ -painiketta avataksesi suuren kuvakaappauksen tiedoineen.",
      },
      {
        title: "Pyyhkäisytila",
        body: "Klikkaa ylhäältä „Swipe“-painiketta selataksesi sivustoja yksi kerrallaan, kuin kortteja. Pyyhkäise oikealle tai paina → tykkääksesi, vasemmalle tai ← ohittaaksesi.",
      },
      {
        title: "Viimeistele",
        body: "Kun olet valinnut vähintään yhden viittauksen, tämä palkki ilmestyy alas. Klikkaa „Valmis“, kun olet valmis.",
      },
      {
        title: "Valintakoodisi",
        body: "WInspo pakkaa valintasi lyhyeksi koodiksi. Kopioi se ja lähetä se suunnittelijallesi linkin kanssa – hän näkee tarkalleen, mitä valitsit, sekä automaattisen suunnitteluprofiilin.",
      },
    ],
    manualTitle: "WInspo-käsikirja",
    manualIntro:
      "WInspo muuttaa asiakkaasi suunnitteluvalinnat lyhyeksi, jaettavaksi koodiksi.",
    manualHow: "Näin se toimii",
    manualSteps: [
      "Selaa verkkosivusto- ja sovellusviittausten galleriaa.",
      "Valitse ne, jotka sopivat projektiin.",
      "Jaa lyhyt koodi suunnittelijallesi.",
      "Suunnittelija liittää koodin ja näkee tarkalleen, mitä valittiin, sekä automaattisen suunnitteluprofiilin.",
    ],
    manualSwipe: "Pyyhkäisytila",
    manualSwipeBody:
      "Nopein tapa valita: selaa sivustoja yksi kerrallaan kuin korttipakkaa. Tykkää niistä, joista pidät, ja ohita loput. Tykkäyksesi päätyvät samaan valintaan.",
    manualLibrary: "Manuaalinen tila",
    manualLibraryBody:
      "Haluatko mieluummin selata koko kirjastoa kerralla? Käytä ruudukkonäkymää hakemiseen ja napauta haluamiasi viittauksia.",
    manualByo: "Tuo oma tietoaineistosi",
    manualByoBody:
      "Mikä tahansa julkinen GitHub-arkisto, jonka juuressa on winspo.json, voi muuttua tietoaineistoksi.",
    manualLookup: "Lookup",
    manualLookupBody:
      "Liitä mikä tahansa koodi lookup-sivulle nähdäksesi valinnan ja sen suunnitteluprofiilin.",
  },
  et: {
    tutorialTitle: "Tere tulemast WInsposse",
    tutorialIntro: "Siin käid läbi meelepäraste disainide valiku.",
    tutorialSwipeNew:
      "See on uudne — pühkimisrežiim. Lehitse veebisaite nagu kaardipakk ja like neid, mis meeldivad.",
    tutorialManualPick:
      "Võid ka minna tagasi kogu raamatukogu juurde ja valida käsitsi.",
    tutorialStart: "Alusta",
    tutorialOpenManual: "Ava juhend",
    tutorialStartTour: "Alusta ringkäik",
    tourSkip: "Jäta vahele",
    tourNext: "Järgmine",
    tourDone: "Valmis",
    tourSteps: [
      {
        title: "Vali viited",
        body: "Puudutage viitekaarti, et see valida – see saab linnukese. Puudutage uuesti tühistamiseks.",
      },
      {
        title: "Otsing",
        body: "Sisestage siia sõna, näiteks „portfolio“, et galeriid kohe filtreerida.",
      },
      {
        title: "Suurem eelvaade",
        body: "Klõpsake kaardil „Full page“, et avada suur ekraanipilt üksikasjadega.",
      },
      {
        title: "Pühkimisrežiim",
        body: "Klõpsake üleval „Swipe“, et sirvida saite ükshaaval nagu kaarte. Pühkige paremale või vajutage →, et meeldida, vasakule või ←, et vahele jätta.",
      },
      {
        title: "Lõpeta",
        body: "Kui olete valinud vähemalt ühe viite, ilmub see riba alla. Kui olete lõpetanud, klõpsake „Valmis“.",
      },
      {
        title: "Teie valikukood",
        body: "WInspo pakib teie valikud lühikeseks koodiks. Kopeerige see ja saatke see koos lingiga oma disainerile – ta näeb täpselt, mida valisite, pluss automaatne disainiprofiil.",
      },
    ],
    manualTitle: "WInspo juhend",
    manualIntro:
      "WInspo muudab kliendi disainivalikud lühikeseks, jagatavaks koodiks.",
    manualHow: "Kuidas see töötab",
    manualSteps: [
      "Sirvi veebisaitide ja rakenduste viidete galeriid.",
      "Vali need, mis projekti sobivad.",
      "Jaga lühikest koodi oma disaineriga.",
      "Disainer kleepib koodi ja näeb täpselt, mis valiti, pluss automaatne disainiprofiil.",
    ],
    manualSwipe: "Pühkimisrežiim",
    manualSwipeBody:
      "Kõige kiirem viis valimiseks: lehitse veebisaite ükshaaval nagu kaardipakki. Like neid, mis meeldivad, ja jäta ülejäänud vahele. Sinu like'd lisatakse samasse valikusse.",
    manualLibrary: "Käsitsi režiim",
    manualLibraryBody:
      "Eelistad kogu raamatukogu korraga sirvida? Kasuta otsimiseks ruudustikuvaadet ja puuduta soovitud viiteid.",
    manualByo: "Too oma andmekogum",
    manualByoBody:
      "Iga avalik GitHub-i hoidla, mille juurtes on winspo.json, võib saada andmekogumiks.",
    manualLookup: "Lookup",
    manualLookupBody:
      "Kleebi suvaline kood lookup-lehele, et näha valikut ja selle disainiprofiili.",
  },
  lv: {
    tutorialTitle: "Laipni lūdzam WInspo",
    tutorialIntro: "Šeit jūs izvēlēsieties dizainus, kas jums patīk.",
    tutorialSwipeNew:
      "Tas ir jaunums — vilkšanas režīms. Pāršķiriet vietnes kā kāršu kavu un atzīmējiet ar like tās, kas jums patīk.",
    tutorialManualPick:
      "Varat arī atgriezties visā bibliotēkā un izvēlēties manuāli.",
    tutorialStart: "Sākt",
    tutorialOpenManual: "Atvērt rokasgrāmatu",
    tutorialStartTour: "Sākt ekskursiju",
    tourSkip: "Izlaist",
    tourNext: "Tālāk",
    tourDone: "Gatavs",
    tourSteps: [
      {
        title: "Izvēlieties atsauces",
        body: "Pieskarieties atsauces kartei, lai to atlasītu – tā iegūst atzīmi. Pieskarieties vēlreiz, lai atceltu.",
      },
      {
        title: "Meklēšana",
        body: "Šeit ierakstiet vārdu, piemēram, „portfolio“, lai uzreiz filtrētu galeriju.",
      },
      {
        title: "Lielāks priekšskatījums",
        body: "Noklikšķiniet uz „Full page“ kartē, lai atvērtu lielu ekrānuzņēmumu ar detaļām.",
      },
      {
        title: "Vilkšanas režīms",
        body: "Noklikšķiniet uz „Swipe“ augšpusē, lai pāršķirstītu vietnes pa vienai, kā kārtis. Velciet pa labi vai nospiediet →, lai atzīmētu, pa kreisi vai ←, lai izlaistu.",
      },
      {
        title: "Pabeigt",
        body: "Pēc vismaz vienas atsauces izvēles šī josla parādās apakšā. Kad esat pabeiguši, noklikšķiniet uz „Gatavs“.",
      },
      {
        title: "Jūsu atlases kods",
        body: "WInspo pārvērš jūsu izvēles īsā kodā. Kopējiet to un nosūtiet savam dizainerim kopā ar saiti – viņš redzēs tieši, ko izvēlējāties, plus automātisku dizaina profilu.",
      },
    ],
    manualTitle: "WInspo rokasgrāmata",
    manualIntro:
      "WInspo pārvērš jūsu klienta dizaina izvēles īsā, koplietojamā kodā.",
    manualHow: "Kā tas darbojas",
    manualSteps: [
      "Pārlūkojiet vietņu un lietotņu atsauču galeriju.",
      "Izvēlieties tās, kas atbilst projektam.",
      "Kopīgojiet īso kodu ar savu dizaineri.",
      "Dizaineris ielīmē kodu un redz tieši, kas tika izvēlēts, plus automātisks dizaina profils.",
    ],
    manualSwipe: "Vilkšanas režīms",
    manualSwipeBody:
      "Ātrākais izvēles veids: pāršķiriet vietnes pa vienai kā kāršu kavu. Atzīmējiet ar like tās, kas patīk, un izlaidiet pārējās. Jūsu like tiek pievienoti tai pašai izlasei.",
    manualLibrary: "Manuālais režīms",
    manualLibraryBody:
      "Vai dodat priekšroku visas bibliotēkas pārlūkošanai uzreiz? Izmantojiet režģa skatu, lai meklētu, un pieskarieties vēlamajām atsaucēm.",
    manualByo: "Ņemiet līdzi savu datu kopu",
    manualByoBody:
      "Jebkurš publisks GitHub krātuve ar winspo.json saknē var kļūt par datu kopu.",
    manualLookup: "Lookup",
    manualLookupBody:
      "Ielīmējiet jebkuru kodu lookup lapā, lai redzētu izlasi un tās dizaina profilu.",
  },
  lt: {
    tutorialTitle: "Sveiki atvykę į WInspo",
    tutorialIntro: "Čia pasirinksite dizainus, kurie jums patinka.",
    tutorialSwipeNew:
      "Tai naujiena — braukimo režimas. Vartykite svetaines kaip kortų kaladę ir pažymėkite patikusias.",
    tutorialManualPick:
      "Taip pat galite grįžti į visą biblioteką ir pasirinkti rankiniu būdu.",
    tutorialStart: "Pradėti",
    tutorialOpenManual: "Atidaryti vadovą",
    tutorialStartTour: "Pradėti apžvalgą",
    tourSkip: "Praleisti",
    tourNext: "Toliau",
    tourDone: "Baigta",
    tourSteps: [
      {
        title: "Pasirinkti nuorodas",
        body: "Paspauskite nuorodos kortelę, kad ją pasirinktumėte – ji gauna varnelę. Paspauskite dar kartą, kad atšauktumėte.",
      },
      {
        title: "Paieška",
        body: "Čia įveskite žodį, pvz., „portfolio“, kad iš karto filtruotumėte galeriją.",
      },
      {
        title: "Didesnė peržiūra",
        body: "Kortelėje spustelėkite „Full page“, kad atidarytumėte didelę ekrano kopiją su detalėmis.",
      },
      {
        title: "Braukimo režimas",
        body: "Spustelėkite „Swipe“ viršuje, kad peržiūrėtumėte svetaines po vieną, kaip kortas. Braukite dešinėn arba spauskite →, kad pažymėtumėte, kairėn arba ←, kad praleistumėte.",
      },
      {
        title: "Užbaigti",
        body: "Pasirinkus bent vieną nuorodą, apačioje atsiranda ši juosta. Kai baigsite, spustelėkite „Baigta“.",
      },
      {
        title: "Jūsų pasirinkimo kodas",
        body: "WInspo paverčia jūsų pasirinkimus trumpu kodu. Nukopijuokite jį ir nusiųskite savo dizaineriui kartu su nuoroda – jis matys tiksliai, ką pasirinkote, ir automatinį dizaino profilį.",
      },
    ],
    manualTitle: "WInspo vadovas",
    manualIntro:
      "WInspo paverčia jūsų kliento dizaino pasirinkimus trumpu, dalijamu kodu.",
    manualHow: "Kaip tai veikia",
    manualSteps: [
      "Naršykite svetainių ir programėlių nuorodų galeriją.",
      "Pasirinkite tas, kurios tinka projektui.",
      "Pasidalykite trumpu kodu su savo dizaineriu.",
      "Dizaineris įklijuoja kodą ir mato tiksliai, kas buvo pasirinkta, bei automatinį dizaino profilį.",
    ],
    manualSwipe: "Braukimo režimas",
    manualSwipeBody:
      "Greičiausias pasirinkimo būdas: vartykite svetaines po vieną, kaip kortų kaladę. Pažymėkite tas, kurios patinka, o likusias praleiskite. Jūsų pasirinkimai patenka į tą pačią atranką.",
    manualLibrary: "Rankinis režimas",
    manualLibraryBody:
      "Mieliau naršote visą biblioteką iš karto? Naudokite tinklelio rodinį paieškai ir palieskite norimas nuorodas.",
    manualByo: "Atsineškite savo duomenų rinkinį",
    manualByoBody:
      "Bet koks viešas GitHub saugykla su winspo.json šaknyje gali tapti duomenų rinkiniu.",
    manualLookup: "Lookup",
    manualLookupBody:
      "Įklijuokite bet kurį kodą į lookup puslapį, kad pamatytumėte atranką ir jos dizaino profilį.",
  },
  ga: {
    tutorialTitle: "Fáilte go WInspo",
    tutorialIntro: "Anseo rachaidh tú trí na dearaí is maith leat a roghnú.",
    tutorialSwipeNew:
      "Is nuacht é seo — mód swipe. Smeach trí na suíomhanna mar mhacas de chártaí agus cuir isteach iad a thaitníonn leat.",
    tutorialManualPick:
      "Is féidir leat freisin dul ar ais go dtí an leabharlann iomlán agus roghnú de láimh.",
    tutorialStart: "Tosaigh",
    tutorialOpenManual: "Oscail an lámhleabhar",
    tutorialStartTour: "Tosaigh an tur",
    tourSkip: "Scipeáil",
    tourNext: "Ar aghaidh",
    tourDone: "Déanta",
    tourSteps: [
      {
        title: "Roghnaigh tagairtí",
        body: "Tapaigh cárta tagartha chun é a roghnú – faigheann sé tic. Tapaigh arís chun cealú.",
      },
      {
        title: "Cuardach",
        body: "Clóscríobh focal mar „portfolio“ anseo chun an gailearaí a scagadh láithreach.",
      },
      {
        title: "Réamhamharc níos mó",
        body: "Cliceáil ar „Full page“ ar chárta chun grianghraf mór a oscailt le sonraí.",
      },
      {
        title: "Mód swipe",
        body: "Cliceáil ar „Swipe“ ag barr chun na suíomhanna a smeach tríod ceann ar cheann, cosúil le cártaí. Smeach ar dheis nó brúigh → le grá a thabhairt, ar chlé nó ← le léim thar.",
      },
      {
        title: "Críochnaigh",
        body: "Tar éis duit tagairt amháin ar a laghad a roghnú, feictear an barra seo ag bun. Cliceáil ar „Déanta“ nuair a bheidh tú réidh.",
      },
      {
        title: "Do chód roghnaithe",
        body: "Cuireann WInspo do roghanna i gcód gairid. Cóipeáil é agus seol chuig do dhearthóir é le chéile leis an nasc – feicfidh siad go díreach cad a roghnaigh tú, móide próifíl deartha uathoibríoch.",
      },
    ],
    manualTitle: "Lámhleabhar WInspo",
    manualIntro:
      "Athraíonn WInspo roghanna deartha do chliaint go cód gairid comhroinnte.",
    manualHow: "Conas a oibríonn sé",
    manualSteps: [
      "Brabhsáil gailearaí de thagairtí do shuíomhanna gréasáin agus aipeanna.",
      "Roghnaigh na cinn a oireann don tionscadal.",
      "Roinn an cód gairid le do dhearthóir.",
      "Greamaíonn an dearthóir an cód isteach agus feiceann sé go díreach cad a roghnaíodh, móide próifíl deartha uathoibríoch.",
    ],
    manualSwipe: "Mód swipe",
    manualSwipeBody:
      "An bealach is tapúla le roghnú: smeach trí na suíomhanna ceann ar cheann, mar mhacas de chártaí. Cuir isteach iad a thaitníonn leat agus léim thar an gcuid eile. Téann do roghanna isteach sa roghnú céanna.",
    manualLibrary: "Mód láimhe",
    manualLibraryBody:
      "B'fhearr leat an leabharlann iomlán a bhrabhsáil ag an am céanna? Úsáid an radharc greille le cuardach a dhéanamh agus tapáil na tagairtí is mian leat.",
    manualByo: "Tabhair leat do thacar sonraí féin",
    manualByoBody:
      "Is féidir le haon stór poiblí GitHub le winspo.json ag a fhréamh a bheith ina thacar sonraí.",
    manualLookup: "Lookup",
    manualLookupBody:
      "Greamaigh aon chód sa leathanach lookup chun an roghnú agus a phróifíl deartha a fheiceáil.",
  },
  mt: {
    tutorialTitle: "Merħba f'WInspo",
    tutorialIntro: "Hawnhekk se tagħżel id-disinji li jogħġbuk.",
    tutorialSwipeNew:
      "Dan hu ġdid — mod ta' swiping. Aqleb is-siti bħal pakkett karti u agħti like lil dawk li jogħġbuk.",
    tutorialManualPick:
      "Tista' wkoll tmur lura għal-librerija kollha u tagħżel manwalment.",
    tutorialStart: "Ibda",
    tutorialOpenManual: "Iftaħ il-manwal",
    tutorialStartTour: "Ibda l-ħidma",
    tourSkip: "Aqbeż",
    tourNext: "Li jmiss",
    tourDone: "Lest",
    tourSteps: [
      {
        title: "Agħżel referenzi",
        body: "Mess karta ta' referenza biex tagħżelha – tieħu marka ta' kontroll. Mess mill-ġdid biex tħassar.",
      },
      {
        title: "Fittex",
        body: "Ikteb kelma bħal „portfolio“ hawn biex tiffiltra l-gallerija minnufih.",
      },
      {
        title: "Ħarsa ikbar",
        body: "Ikklikkja fuq „Full page“ fuq karta biex tiftaħ stampa kbira bid-dettalji.",
      },
      {
        title: "Mod ta' swiping",
        body: "Ikklikkja fuq „Swipe“ fil-quċċata biex tgħaddi mis-siti wieħed wieħed, bħal karti. Aqleb lejn il-lemin jew agħfas → biex tagħti like, lejn ix-xellug jew ← biex taqbeż.",
      },
      {
        title: "Lesti",
        body: "Wara li tagħżel mill-inqas referenza waħda, dan il-bar jidher fil-qiegħ. Ikklikkja fuq „Lest“ meta tkun lest.",
      },
      {
        title: "Il-kodiċi tal-għażla tiegħek",
        body: "WInspo jpoġġi l-għażliet tiegħek f'kodiċi qasir. Ikkupjah u ibagħtu lid-disinjatur tiegħek flimkien mal-link – se jaraw eżattament dak li għażilt, flimkien ma' profil tad-disinn awtomatiku.",
      },
    ],
    manualTitle: "Il-manwal ta' WInspo",
    manualIntro:
      "WInspo jibdel l-għażliet tad-disinn tal-klijent tiegħek f'kodiċi qasir u kondiviżibbli.",
    manualHow: "Kif jaħdem",
    manualSteps: [
      "Fittex gallerija ta' referenzi għal websajts u apps.",
      "Agħżel dawk li jaqblu mal-proġett.",
      "Aqsam il-kodiċi qasir mad-disinjatur tiegħek.",
      "Id-disinjatur iwaħħal il-kodiċi u jara eżattament x'inħatar, flimkien ma' profil tad-disinn awtomatiku.",
    ],
    manualSwipe: "Mod ta' swiping",
    manualSwipeBody:
      "L-iqsar mod biex tagħżel: aqleb is-siti wieħed wieħed, bħal pakkett karti. Agħti like lil dawk li jogħġbuk u aqbeż il-bqija. Il-likes tiegħek jingħaqdu mal-istess għażla.",
    manualLibrary: "Mod manwali",
    manualLibraryBody:
      "Tippreferi tfittex il-librerija kollha f'daqqa? Uża l-ħarsa ta' grilja biex tfittex u tektek ir-referenzi li trid.",
    manualByo: "Ġib id-dataset tiegħek stess",
    manualByoBody:
      "Kull repo pubbliku ta' GitHub b'winspo.json fil-għerq tiegħu jista' jsir dataset.",
    manualLookup: "Lookup",
    manualLookupBody:
      "Waħħal kwalunkwe kodiċi fil-paġna lookup biex tara l-għażla u l-profil tad-disinn tagħha.",
  },
};

export function getTranslations(locale: string | null | undefined): Localized {
  if (locale && TRANSLATIONS[locale]) return TRANSLATIONS[locale];
  return TRANSLATIONS[FALLBACK_LOCALE];
}

export function isEuLocale(locale: string): boolean {
  return Boolean(TRANSLATIONS[locale]);
}

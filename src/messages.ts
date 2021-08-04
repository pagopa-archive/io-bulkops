const cashbackIBAN1 = {
  subject: "Inserisci l'IBAN: il primo periodo del Cashback è finito!",
  markdown:
    '---\nit:\n    cta_1: \n        text: "Inserisci IBAN"\n        action: "ioit://CTA_BPD_IBAN_EDIT"\nen:\n    cta_1: \n        text: "Add IBAN"\n        action: "ioit://CTA_BPD_IBAN_EDIT"\n---\n\n\nL\'Extra Cashback di Natale è finito il 31 Dicembre!\n\nSembra che tu **non abbia ancora inserito un IBAN** valido per l\'accredito dell\'eventuale rimborso sul tuo conto.\n\n**Inserisci il tuo IBAN entro il 9 gennaio 2021** per essere sicuro di ricevere il relativo bonifico.\n\nIl calcolo definitivo delle transazioni e dei rimborsi si concluderà l\'11 gennaio 2021, per avere il tempo di raccogliere tutte le transazioni valide.\n\nTi ricordiamo che solo se hai totalizzato un numero di almeno 10 transazioni valide, riceverai un rimborso pari all\'importo mostrato in app, direttamente sull\'IBAN che ci hai comunicato, fino a un massimo di 150 euro.\n\nIl Cashback continua: sarai automaticamente iscritto al nuovo periodo 1 gennaio - 30 giugno 2021!\n\nGrazie per aver partecipato all\'Extra Cashaback di Natale!\n\n',
};

const cashbackTransaction1 = {
  subject: 'Importante: verifica le tue transazioni per il Cashback',
  markdown:
    'Ciao! Stiamo effettuando delle verifiche su alcune **transazioni anomale** rilevate nell’ambito del Cashback: si tratta di transazioni **ricorrenti di importo irrisorio**, effettuate in numero elevato **presso lo stesso esercente, lo stesso giorno** e che, pertanto, appaiono **non qualificabili come "acquisti"** di beni o servizi, ai sensi del Programma.\n\nQueste transazioni, se legate a condotte abusive, non darebbero diritto ad alcun tipo di rimborso. Per questo, abbiamo provveduto a **stornare le operazioni “sospette”** dal sistema: puoi visualizzarle con il segno "–" nel dettaglio della tua card del Cashback.\n\n**Se pensi si tratti di un errore e le tue transazioni sono in regola, hai 7 giorni dalla data di invio di questo messaggio per provare che ci stiamo sbagliando!** Usa [questo modulo online](https://forms.gle/mHwWGUeCpb3WY6qK9) per dichiarare l’oggetto effettivo dell’acquisto a cui corrisponde ciascuna delle transazioni stornate.\n\nSe sei già stato oggetto di controlli e hai compilato il modulo in precedenza, utilizzalo soltanto per giustificare le nuove transazioni.\n\nRicevuto il tuo modulo, le tue transazioni - **se ritenute valide** ai fini del Cashback - **torneranno a essere conteggiate** ai fini del rimborso. Al contrario, saranno eliminate definitivamente dal Programma; questo accadrà anche in mancanza di un tuo riscontro a questa comunicazione entro i 7 giorni dall’invio.\n\n',
};

const cashbackEndPeriod1trxmin50 = {
  subject: 'Spiacenti, non hai diritto al Cashback accumulato!',
  markdown:
    "Ti informiamo che il conteggio per i rimborsi del primo semestre 2021 del programma Cashback si è concluso.\n\nNon hai raggiunto le 50 transazioni necessarie per ottenere il rimborso.\n\nIl [Decreto Legge 30 giugno 2021](https://www.gazzettaufficiale.it/atto/serie_generale/caricaDettaglioAtto/originario?atto.dataPubblicazioneGazzetta=2021-06-30&atto.codiceRedazionale=21G00110&elenco30giorni=true), n.99 ha previsto **la sospensione del secondo semestre 2021** del Cashback.\nIl prossimo periodo, quindi, inizierà l'**1 gennaio 2022**: se desideri continuare a partecipare al Programma, l'iscrizione avverrà in automatico e potrai disiscriverti in qualsiasi momento.\n\nGrazie per aver partecipato!\n\n",
};

const cashbackEndPeriod1ErrataCorrigetrxmin50 = {
  subject: 'Errata Corrige - Non hai diritto al Cashback accumulato!',
  markdown:
    "Ti informiamo che il conteggio per i rimborsi del primo semestre 2021 del programma Cashback si è concluso.\n\nNon hai raggiunto le 50 transazioni necessarie per ottenere il rimborso.\n\nIl [Decreto Legge 30 giugno 2021](https://www.gazzettaufficiale.it/atto/serie_generale/caricaDettaglioAtto/originario?atto.dataPubblicazioneGazzetta=2021-06-30&atto.codiceRedazionale=21G00110&elenco30giorni=true), n.99 ha previsto **la sospensione del secondo semestre 2021** del Cashback.\nIl prossimo periodo, quindi, inizierà l'**1 gennaio 2022**: se desideri continuare a partecipare al Programma, l'iscrizione avverrà in automatico e potrai disiscriverti in qualsiasi momento.\n\nGrazie per aver partecipato!\n\n",
};

const cashbackEndPeriod1Win = {
  subject: 'Congratulazioni, hai diritto al Cashback accumulato!',
  markdown:
    "Ti informiamo che il conteggio per i rimborsi del primo semestre 2021 del programma Cashback si è concluso.\n\nComplimenti!\nIl rimborso ti sarà accreditato **entro 60 giorni dalla fine del periodo** (concluso il 30 giugno 2021). Riceverai un messaggio quando verrà effettuato il bonifico all'IBAN da te scelto.\n\nLa classifica per il Super Cashback **non è ancora definitiva**.\n\nCome stabilito dal [Decreto Legge 30 giugno 2021](https://www.gazzettaufficiale.it/atto/serie_generale/caricaDettaglioAtto/originario?atto.dataPubblicazioneGazzetta=2021-06-30&atto.codiceRedazionale=21G00110&elenco30giorni=true), la graduatoria verrà consolidata al termine delle operazioni relative ai reclami, in carico alla società CONSAP.\n\nSe avrai diritto al Super Cashback di € 1500, l'importo ti sarà accreditato **entro il 30 novembre 2021**. Riceverai un messaggio quando verrà effettuato il bonifico all'IBAN da te scelto.\n\nLo stesso Decreto Legge ha previsto **la sospensione del secondo semestre 2021** del Cashback.\n\nIl prossimo periodo, quindi, inizierà l'**1 gennaio 2022**: se desideri continuare a partecipare al Programma, l'iscrizione avverrà in automatico e potrai disiscriverti in qualsiasi momento.\n\nGrazie per aver partecipato!\n\n",
};

const cashbackMissingIBAN1 = {
  subject: 'Inserisci un IBAN per ricevere il rimborso',
  markdown:
    '---\nit:\n    cta_1: \n        text: "Vai al Cashback"\n        action: "ioit://CTA_BPD_IBAN_EDIT"\nen:\n    cta_1: \n        text: "Go to Cashback"\n        action: "ioit://CTA_BPD_IBAN_EDIT"\n---\n\n\nCiao!\nSembra che tu **non abbia ancora inserito un IBAN** valido per l\'accredito del rimborso sul tuo conto.\n\nSe non l\'hai già fatto, **inserisci il tuo IBAN al più presto** per ricevere il relativo bonifico:\n\n1. premi il pulsante "Vai al Cashback" in basso;\n\n2. nel dettaglio del tuo Cashback, scorri in basso e premi il pulsante "Imposta IBAN";\n\n3. inserisci un IBAN valido e conferma l\'operazione.\n\nRiceverai un messaggio in app non appena verrà effettuato il bonifico.\n\n',
};

const bonusvacanzeStart1 = {
  subject: "E' arrivato il Bonus Vacanze!",
  markdown:
    '---\nit:\n    cta_1: \n        text: "Richiedi il Bonus Vacanze"\n        action: "ioit://BONUS_AVAILABLE_LIST"\nen:\n    cta_1: \n        text: "Claim the Bonus Vacanze"\n        action: "ioit://BONUS_AVAILABLE_LIST"\n---\n\n\nDal 1 luglio puoi richiedere il **Bonus Vacanze**, istituito dal Decreto Rilancio per incentivare il turismo dopo il lockdown dovuto all\'emergenza Coronavirus.\n\nIl bonus può valere **fino a 500 euro**, a seconda della numerosità del nucleo familiare, ed è spendibile per **soggiorni in Italia**, presso imprese turistiche ricettive, agriturismi e bed & breakfast, **dal 1 luglio al 31 dicembre 2020**.\n\n**Possono ottenere il contributo i nuclei familiari con ISEE fino a 40.000 euro.**\n\nSe non l’hai ancora chiesto o attivato e sei maggiorenne, scopri come funziona e richiedilo adesso.\n\nPer poter richiedere il Bonus Vacanze, devi avere aggiornato IO all\'ultima versione disponibile.\n\n[App Store](https://apps.apple.com/it/app/io/id1501681835)\n\n[Play Store](https://play.google.com/store/apps/details?id=it.pagopa.io.app)\n\n',
};

const customMessageUser1 = {
  subject: 'Anomalie riscontrate sul Cashback',
  markdown:
    "Gentile utente,\n\nstiamo riscontrando un comportamento anomalo rispetto al progetto Cashback ed effettuando delle verifiche sugli importi e il numero delle transazioni che hai effettuato.\n\nPer qualsiasi chiarimento contatta il **servizio clienti** tramite le relative icone che trovi in alto a destra nell'App IO.\n\n",
};

const cgnStart1 = {
  subject: "E' arrivata la Carta Giovani Nazionale!",
  markdown:
    '---\nit:\n    cta_1: \n        text: "Richiedi la Carta Giovani"\n        action: "ioit://CTA_START_CGN"\nen:\n    cta_1: \n        text: "Claim the Carta Giovani"\n        action: "ioit://CTA_START_CGN"\n---\n\n\nDa oggi i **cittadini italiani ed europei residenti in Italia, dai 18 ai 35** anni di età possono richiedere la **Carta Giovani Nazionale**, istituita dal Dipartimento per le Politiche Giovanili e il Servizio Civile Universale della Presidenza del Consiglio dei Ministri, per favorire la partecipazione ad attività culturali, sportive e ricreative, anche con finalità formative.\n\nLa Carta Giovani Nazionale **consente ai beneficiari di ottenere agevolazioni per accedere a beni e servizi di carattere culturale, sportivo e legato al benessere su tutto il territorio nazionale**.\n\nPuoi attivare la Carta Giovani tramite IO, oppure visualizzare maggiori dettagli sul sito dedicato alla Carta Giovani Nazionale.\n\nAttivala adesso!\n\nPer poter richiedere la tua Carta Giovani Nazionale, devi avere aggiornato IO all\'ultima versione disponibile.\n\n[App Store](https://apps.apple.com/it/app/io/id1501681835)\n\n[Play Store](https://play.google.com/store/apps/details?id=it.pagopa.io.app)\n\n',
};

export function GetMessageContent(messageContent: string) {
  let content = undefined;

  switch (messageContent) {
    case 'cashbackIBAN1': {
      content = cashbackIBAN1;
      break;
    }
    case 'cashbackTransaction1': {
      content = cashbackTransaction1;
      break;
    }
    case 'cashbackEndPeriod1trxmin50': {
      content = cashbackEndPeriod1trxmin50;
      break;
    }
    case 'cashbackEndPeriod1ErrataCorrigetrxmin50': {
      content = cashbackEndPeriod1ErrataCorrigetrxmin50;
      break;
    }
    case 'cashbackEndPeriod1Win': {
      content = cashbackEndPeriod1Win;
      break;
    }
    case 'cashbackMissingIBAN1': {
      content = cashbackMissingIBAN1;
      break;
    }
    case 'bonusvacanzeStart1': {
      content = bonusvacanzeStart1;
      break;
    }
    case 'customMessageUser1': {
      content = customMessageUser1;
      break;
    }
    case 'cgnStart1': {
      content = cgnStart1;
      break;
    }
    default: {
      //statements;
      break;
    }
  }

  return content;
}

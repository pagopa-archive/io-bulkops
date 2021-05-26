const cashbackIBAN1 = {
  subject: "Inserisci l'IBAN: il primo periodo del Cashback è finito!",
  markdown:
    '---\nit:\n    cta_1: \n        text: "Inserisci IBAN"\n        action: "ioit://CTA_BPD_IBAN_EDIT"\nen:\n    cta_1: \n        text: "Add IBAN"\n        action: "ioit://CTA_BPD_IBAN_EDIT"\n---\n\n\nL\'Extra Cashback di Natale è finito il 31 Dicembre!\n\nSembra che tu **non abbia ancora inserito un IBAN** valido per l\'accredito dell\'eventuale rimborso sul tuo conto.\n\n**Inserisci il tuo IBAN entro il 9 gennaio 2021** per essere sicuro di ricevere il relativo bonifico.\n\nIl calcolo definitivo delle transazioni e dei rimborsi si concluderà l\'11 gennaio 2021, per avere il tempo di raccogliere tutte le transazioni valide.\n\nTi ricordiamo che solo se hai totalizzato un numero di almeno 10 transazioni valide, riceverai un rimborso pari all\'importo mostrato in app, direttamente sull\'IBAN che ci hai comunicato, fino a un massimo di 150 euro.\n\nIl Cashback continua: sarai automaticamente iscritto al nuovo periodo 1 gennaio - 30 giugno 2021!\n\nGrazie per aver partecipato all\'Extra Cashaback di Natale!\n\n',
};

const cashbackTransaction1 = {
  subject: 'Importante: verifica le tue transazioni per il Cashback',
  markdown:
    '\n\n\nCiao! Stiamo effettuando delle verifiche su alcune **transazioni anomale** rilevate nell’ambito del Cashback: si tratta di transazioni **ricorrenti di importo irrisorio**, effettuate in numero elevato **presso lo stesso esercente, lo stesso giorno** e che, pertanto, appaiono **non qualificabili come "acquisti"** di beni o servizi, ai sensi del Programma.\n\nQueste transazioni, se legate a condotte abusive, non darebbero diritto al alcun tipo di rimborso. Per questo, abbiamo provveduto a **stornare le operazioni “sospette”** dal sistema: puoi visualizzarle con il segno "–" nel dettaglio della tua card del Cashback.\n\n**Se pensi si tratti di un errore e le tue transazioni sono in regola, hai 7 giorni dalla data di invio di questo messaggio per provare che ci stiamo sbagliando!** Usa [questo modulo online](https://forms.gle/mHwWGUeCpb3WY6qK9) per dichiarare l’oggetto effettivo dell’acquisto a cui corrisponde ciascuna delle transazioni stornate.\n\nRicevuto il tuo modulo, le tue transazioni - **se ritenute valide** ai fini del Cashback - **torneranno a essere conteggiate** ai fini del rimborso. Al contrario, saranno eliminate definitivamente dal Programma; questo accadrà anche in mancanza di un tuo riscontro a questa comunicazione entro i 7 giorni dall’invio.\n\n',
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

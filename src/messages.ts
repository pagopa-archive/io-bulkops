const cashbackIBAN1 = {
  subject: "Inserisci l'IBAN: il primo periodo del Cashback sta per finire!",
  markdown:
    '---\nit:\n    cta_1: \n        text: "Inserisci IBAN"\n        action: "ioit://WALLET_HOME"\nen:\n    cta_1: \n        text: "Add IBAN"\n        action: "ioit://WALLET_HOME"\n---\n\n\nL\'ExtraCashback di Natale sta per finire!\n\nSembra che tu **non abbia ancora inserito un IBAN** valido per l\'accredito dell\'eventuale rimborso sul tuo conto.\n\n**Inserisci il tuo IBAN** al più presto per essere sicuro di ricevere il relativo bonifico.\n\nIl calcolo definitivo delle transazioni e dei rimborsi si concluderà l\'11 Gennaio 2021, per avere il tempo di raccogliere tutte le transazioni valide.\n\nTi ricordiamo che solo se hai totalizzato un numero di almeno 10 transazioni valide, riceverai un rimborso pari all\'importo mostrato in app, direttamente sull\'IBAN che ci hai comunicato, fino a un massimo di 150 euro.\n\nIl Cashback continua: sarai automaticamente iscritto al nuovo periodo 1 Gennaio-30 Giugno 2021!\n\nGrazie per aver partecipato all\'Extra Cashaback di Natale!\n\n',
};

const cashbackIBAN2 = {
  subject: "Inserisci l'IBAN: il primo periodo del Cashback è finito!",
  markdown:
    '---\nit:\n    cta_1: \n        text: "Inserisci IBAN"\n        action: "ioit://WALLET_HOME"\nen:\n    cta_1: \n        text: "Add IBAN"\n        action: "ioit://WALLET_HOME"\n---\n\n\nL\'ExtraCashback di Natale è finito il 31 Dicembre!\n\nSembra che tu **non abbia ancora inserito un IBAN** valido per l\'accredito dell\'eventuale rimborso sul tuo conto.\n\n**Inserisci il tuo IBAN** al più presto per essere sicuro di ricevere il relativo bonifico.\n\nIl calcolo definitivo delle transazioni e dei rimborsi si concluderà l\'11 Gennaio 2021, per avere il tempo di raccogliere tutte le transazioni valide.\n\nTi ricordiamo che solo se hai totalizzato un numero di almeno 10 transazioni valide, riceverai un rimborso pari all\'importo mostrato in app, direttamente sull\'IBAN che ci hai comunicato, fino a un massimo di 150 euro.\n\nIl Cashback continua: sarai automaticamente iscritto al nuovo periodo 1 Gennaio-30 Giugno 2021!\n\nGrazie per aver partecipato all\'Extra Cashaback di Natale!\n\n',
};

const bonusvacanzeStart1 = {
  subject: "E' arrivato il Bonus Vacanze!",
  markdown:
    '---\nit:\n    cta_1: \n        text: "Richiedi il Bonus Vacanze"\n        action: "ioit://BONUS_AVAILABLE_LIST"\nen:\n    cta_1: \n        text: "Claim the Bonus Vacanze"\n        action: "ioit://BONUS_AVAILABLE_LIST"\n---\n\n\nDal 1 luglio puoi richiedere il **Bonus Vacanze**, istituito dal Decreto Rilancio per incentivare il turismo dopo il lockdown dovuto all\'emergenza Coronavirus.\n\nIl bonus può valere **fino a 500 euro**, a seconda della numerosità del nucleo familiare, ed è spendibile per **soggiorni in Italia**, presso imprese turistiche ricettive, agriturismi e bed & breakfast, **dal 1 luglio al 31 dicembre 2020**.\n\n**Possono ottenere il contributo i nuclei familiari con ISEE fino a 40.000 euro.**\n\nSe non l’hai ancora chiesto o attivato e sei maggiorenne, scopri come funziona e richiedilo adesso.\n\nPer poter richiedere il Bonus Vacanze, devi avere aggiornato IO all\'ultima versione disponibile.\n\n[App Store](https://apps.apple.com/it/app/io/id1501681835)\n\n[Play Store](https://play.google.com/store/apps/details?id=it.pagopa.io.app)\n\n',
};

export function GetMessageContent(messageContent: string) {
  let content = undefined;

  switch (messageContent) {
    case 'cashbackIBAN1': {
      content = cashbackIBAN1;
      break;
    }
    case 'cashbackIBAN2': {
      content = cashbackIBAN2;
      break;
    }
    case 'bonusvacanzeStart1': {
      content = bonusvacanzeStart1;
      break;
    }
    default: {
      //statements;
      break;
    }
  }

  return content;
}

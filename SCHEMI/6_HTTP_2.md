Vediamo in dettaglio i punti principali di **HTTP/2** e come si confronta con **HTTP/1.1**.

---

### **Cos'è HTTP/2?**

**HTTP/2** è la seconda versione principale del protocollo HTTP, sviluppata per migliorare l'efficienza e le prestazioni rispetto a HTTP/1.1.

**Caratteristiche principali:**

1. **Multiplexing**: consente di inviare più richieste e risposte contemporaneamente su una singola connessione TCP, evitando il problema del "head-of-line blocking" di HTTP/1.1, dove una richiesta lenta può bloccare le altre.
2. **Codifica binaria**: invece di usare un formato basato su testo come HTTP/1.1, HTTP/2 usa una codifica binaria più efficiente per scambiare i dati.
3. **Compressione delle intestazioni**: utilizza algoritmi di compressione per ridurre la dimensione delle intestazioni HTTP, velocizzando le richieste.
4. **Push del server**: il server può inviare risorse al client senza che queste vengano richieste esplicitamente.
5. **Prioritizzazione delle richieste**: le richieste possono essere ordinate in base alla priorità per ottimizzare la gestione delle risorse.

---

### **Differenze tra HTTP/2 e HTTP/1.1**

| **Caratteristica**                  | **HTTP/2**                 | **HTTP/1.1**                |
| ----------------------------------- | -------------------------- | --------------------------- |
| **Codifica dei dati**               | Binaria                    | Basata su testo             |
| **Multiplexing**                    | Su una singola connessione | Su più connessioni separate |
| **Compressione delle intestazioni** | Intestazioni e corpo       | Solo corpo                  |
| **Push del server**                 | Sì                         | No                          |

---

### **Concetti chiave in HTTP/2**

#### **1. Frame e Stream**

- **Frame**: unità base dei dati in HTTP/2, è un messaggio binario scambiato tra client e server.
- **Stream**: una sequenza bidirezionale e indipendente di frame all'interno di una connessione TCP.

Ogni stream può rappresentare una richiesta/risposta o un'operazione logica come il push del server. Grazie al multiplexing, più stream possono coesistere sulla stessa connessione TCP senza interferenze.

---

#### **2. Server Push**

Il server può inviare risorse (es. CSS, JavaScript, immagini) al client prima che il client le richieda esplicitamente. Ad esempio:

- Una pagina web include riferimenti a file CSS e immagini.
- Con HTTP/1.1, il server aspetta che il client richieda ogni risorsa.
- Con HTTP/2, il server invia direttamente le risorse, riducendo la latenza complessiva.

---

#### **3. Early Hints**

- Funzionalità introdotta per migliorare la velocità di caricamento delle pagine.
- Il server invia un codice di stato **103 Early Hints**, suggerendo al client quali risorse esterne caricare in anticipo.
- Esempio: prima di inviare la risposta completa di una pagina HTML, il server può dire al browser di iniziare a scaricare un file CSS o uno script.

---

### **Vantaggi di HTTP/2**

1. **Efficienza nella comunicazione binaria**: più veloce rispetto al formato testuale di HTTP/1.1.
2. **Prestazioni migliorate**: multiplexing e compressione riducono il tempo di caricamento.
3. **Supporto per gRPC**: gRPC utilizza HTTP/2 per lo streaming bidirezionale e per sfruttare la comunicazione binaria.

---

### **Perché scegliere HTTP/2?**

1. Ideale per applicazioni moderne (es. microservizi, gRPC).
2. Riduce il carico della rete e migliora l'efficienza.
3. Ottimizza il caricamento delle pagine web con molte risorse esterne.

### Avvio, Negoziazione e Aggiornamento della Connessione HTTP/2

#### **Avvio della connessione**

Quando un client è a conoscenza del supporto HTTP/2 del server, la comunicazione si avvia con i seguenti passi:

1. **Connessione TCP**: Il client stabilisce una connessione TCP al server.
2. **Prefazione iniziale**: Il client invia una stringa fissa di 24 byte (`PRI * HTTP/2.0\r\n\r\nSM\r\n\r\n`) per dichiarare l'intenzione di usare HTTP/2.
3. **Frame SETTINGS**: Il client invia un frame di tipo `SETTINGS`, che include parametri iniziali della connessione.
4. **Risposta del server**: Il server risponde con la sua prefazione e un frame `SETTINGS`, confermando l'avvio della comunicazione HTTP/2.

#### **Negoziazione della connessione**

Quando il client non sa se il server supporta HTTP/2, entra in gioco un processo di negoziazione, che può avvenire in due modi:

1. **Basata su TLS (ALPN)**:

   - Durante l'handshake TLS, il client utilizza l'Application Layer Protocol Negotiation (ALPN) per indicare i protocolli supportati, incluso HTTP/2.
   - Il server seleziona il protocollo (es. HTTP/2) e lo comunica al client.
   - Una volta stabilito l'uso di HTTP/2, il processo di avvio descritto sopra (prefazione e frame `SETTINGS`) viene eseguito.

2. **Basata su HTTP/1.1 (Upgrade)**:
   - Il client invia una richiesta HTTP/1.1 con l'intestazione `Upgrade: h2`, chiedendo il passaggio a HTTP/2.
   - Se il server accetta, risponde con lo stato 101 (`Switching Protocols`) e conferma il cambio.
   - Successivamente, il client e il server seguono il processo di avvio di HTTP/2.

#### **Aggiornamento della connessione**

L'aggiornamento da HTTP/1.1 a HTTP/2 è utile per garantire compatibilità con server che supportano entrambi i protocolli, ma è meno comune rispetto alla negoziazione ALPN, che avviene direttamente a livello TLS.

---

### Gestione degli Errori in HTTP/2

HTTP/2 offre meccanismi avanzati per segnalare e gestire errori rispetto a HTTP/1.1, sia a livello di flusso che di connessione.

#### **Errori a livello di flusso**

Questi errori riguardano problemi in flussi specifici (es. una richiesta non completata):

- Il protocollo utilizza il frame `RST_STREAM` per chiudere un flusso con un errore, specificando un codice che identifica il tipo di problema.
- Ad esempio, il codice `REFUSED_STREAM` indica che il server non ha elaborato il flusso, consentendo al client di ritentare la richiesta.

#### **Errori a livello di connessione**

Riguardano problemi che coinvolgono l'intera connessione TCP:

- Viene utilizzato il frame `GOAWAY` per informare il client che la connessione verrà chiusa.
- Il frame include il numero del flusso più alto elaborato correttamente, permettendo al client di identificare quali richieste possono essere ritentate.

#### **Meccanismi utili**

1. **Frame GOAWAY**:

   - Specifica il numero massimo di flussi elaborati dal server.
   - Tutte le richieste con numeri di flusso superiori possono essere ritentate senza rischi.

2. **Codice di errore REFUSED_STREAM**:
   - Inviato tramite `RST_STREAM`, indica che il flusso è stato chiuso senza essere elaborato.
   - Il client può riproporre in sicurezza la richiesta associata.

### Gestione della Chiusura della Connessione in HTTP

La **chiusura della connessione** in HTTP dipende dalla versione del protocollo e dal comportamento specifico definito dal client e dal server. Vediamo come viene gestita la chiusura in HTTP/1.1 e HTTP/2:

#### In HTTP/1.0

- Ogni richiesta/risposta è gestita separatamente, il che significa che, per ogni richiesta, il server apre una nuova connessione TCP.
- Dopo che una risposta è stata inviata, la connessione viene **chiusa** dal server, a meno che non venga esplicitamente indicato il contrario tramite l'header `Connection: keep-alive`.

  Se l'header non è presente, la connessione viene chiusa automaticamente.

  Esempio:

  ```
  Connection: close
  ```

#### In HTTP/1.1

- **Keep-Alive**: HTTP/1.1 mantiene per default la connessione aperta tra client e server per più richieste. Questo significa che il client può inviare più richieste senza dover ristabilire una connessione TCP per ciascuna.
- Per chiudere la connessione esplicitamente, il server o il client deve inviare l'header `Connection: close`.

  **Comportamento tipico**:

  1. Il client invia una richiesta.
  2. Il server elabora la richiesta e invia una risposta.
  3. Se è presente l'header `Connection: close`, la connessione viene chiusa dopo la risposta.
  4. Se non c'è `Connection: close`, la connessione rimane aperta per ulteriori richieste.

  Esempio di risposta con connessione chiusa:

  ```
  HTTP/1.1 200 OK
  Connection: close
  ```

#### In HTTP/2

- HTTP/2 **migliora ulteriormente la gestione delle connessioni** rispetto a HTTP/1.1 e introduce il concetto di **multiplexing**, che consente di inviare più richieste e risposte simultaneamente attraverso una sola connessione.
- Una volta stabilita una connessione, essa **rimane aperta** per tutto il ciclo di vita della sessione tra client e server.
- La chiusura della connessione avviene attraverso l'invio di un frame di **GOAWAY** che indica la fine della comunicazione.
- Il **frame GOAWAY** informa l'altra parte che la connessione sta per essere chiusa e che non verranno più inviate nuove richieste.

  Esempio di chiusura in HTTP/2:

  - Quando un client o server vuole chiudere la connessione, invia un **frame GOAWAY**.
  - Dopo aver ricevuto il frame GOAWAY, entrambe le parti possono chiudere la connessione in modo ordinato.

#### Riassunto della Chiusura della Connessione:

- **HTTP/1.0**: La connessione è chiusa dopo ogni richiesta/risposta a meno che non sia specificato `Connection: keep-alive`.
- **HTTP/1.1**: La connessione rimane aperta per più richieste/risposte tramite `keep-alive`, ma può essere chiusa esplicitamente tramite l'header `Connection: close`.
- **HTTP/2**: La connessione è mantenuta aperta per il ciclo di vita della sessione, e la chiusura avviene tramite il frame **GOAWAY**.

---

### Differenze Tra HTTP/1.1 e HTTP/2

Le differenze tra **HTTP/1.1** e **HTTP/2** sono significative, poiché HTTP/2 è stato progettato per risolvere molte limitazioni di HTTP/1.1, specialmente per migliorare la **velocità di caricamento delle pagine web** e ridurre la latenza. Vediamo le principali differenze:

#### 1. **Multiplexing**

- **HTTP/1.1**: Le richieste e le risposte sono **sincrone**. Una volta che un client invia una richiesta, deve aspettare la risposta prima di poter inviare un'altra richiesta sulla stessa connessione. Questo causa il fenomeno della **head-of-line blocking** (quando una richiesta in testa blocca le altre).
- **HTTP/2**: Supporta **multiplexing**, cioè consente di inviare più richieste e risposte **simultaneamente** attraverso una singola connessione TCP. Ogni richiesta e risposta è suddivisa in piccoli "frame" e questi frame vengono inviati in parallelo.

**Vantaggio di HTTP/2**: Non c'è più il blocco della linea principale, e più risorse possono essere scaricate in parallelo, migliorando le prestazioni.

#### 2. **Header Compression**

- **HTTP/1.1**: Gli header HTTP sono inviati in chiaro ad ogni richiesta. Questo può portare a inefficienze, specialmente con richieste ripetitive che contengono gli stessi header.
- **HTTP/2**: Usa **HPACK**, un algoritmo di compressione degli header che riduce la dimensione dei dati inviati. Questo migliora l'efficienza e riduce la latenza.

**Vantaggio di HTTP/2**: Risparmio di banda grazie alla compressione degli header.

#### 3. **Prioritizzazione delle Richieste**

- **HTTP/1.1**: Le richieste sono gestite in modo sequenziale sulla stessa connessione, senza alcuna possibilità di **prioritizzazione**.
- **HTTP/2**: Supporta la **prioritizzazione delle richieste**. Un client può segnare alcune richieste come più urgenti e il server può trattarle con maggiore priorità.

**Vantaggio di HTTP/2**: Maggiore efficienza nella gestione delle risorse e miglioramento nell’ordinamento delle richieste.

#### 4. **Single Connection**

- **HTTP/1.1**: Per caricare più risorse (ad esempio, immagini, script, fogli di stile), è necessario aprire più connessioni TCP al server. Questo può portare a un sovraccarico di connessioni.
- **HTTP/2**: Utilizza **una sola connessione TCP** per gestire tutte le richieste e risposte. Questo riduce il sovraccarico di connessioni e migliora la latenza complessiva.

**Vantaggio di HTTP/2**: Riduzione del numero di connessioni TCP aperte e gestione semplificata.

#### 5. **Infrastruttura di Connessione**

- **HTTP/1.1**: Ogni richiesta richiede un round-trip completo della connessione TCP, il che significa che la latenza è più alta quando ci sono molte risorse da caricare.
- **HTTP/2**: Riduce la latenza grazie al multiplexing e alla gestione più efficiente delle connessioni.

#### 6. **Compatibilità**

- **HTTP/1.1**: È il protocollo standard supportato da tutti i browser e server.
- **HTTP/2**: È retrocompatibile con HTTP/1.1. Questo significa che, anche se un server o un client non supporta HTTP/2, la connessione può cadere automaticamente a HTTP/1.1.

---

### Conclusione

In sintesi, **HTTP/2** offre molte **migliorie rispetto a HTTP/1.1**, come il multiplexing, la compressione degli header e la gestione delle priorità delle richieste, che lo rendono molto più efficiente e veloce, soprattutto per il caricamento di pagine web moderne con molte risorse. Tuttavia, **HTTP/1.1** rimane ancora ampiamente utilizzato, poiché è compatibile con tutti i sistemi e non richiede la configurazione aggiuntiva necessaria per abilitare HTTP/2.

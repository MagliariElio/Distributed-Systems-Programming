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
| **Caratteristica**          | **HTTP/2**                   | **HTTP/1.1**                  |
|-----------------------------|-----------------------------|------------------------------|
| **Codifica dei dati**        | Binaria                     | Basata su testo              |
| **Multiplexing**             | Su una singola connessione  | Su più connessioni separate  |
| **Compressione delle intestazioni** | Intestazioni e corpo       | Solo corpo                   |
| **Push del server**          | Sì                          | No                           |

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



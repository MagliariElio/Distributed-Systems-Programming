# Sockets TCP/IP

## Definizione
- Metodo di comunicazione tra due dispositivi o programmi su una rete.
- Un socket è una combinazione di:
  - **Indirizzo IP**
  - **Numero di porta**
- Rappresenta un punto finale di una comunicazione di rete.

## Tipi di socket TCP/IP
- **Stream Socket**:
  - Flusso bidirezionale di dati affidabile, ordinato e controllato da errori.
- **Datagram Socket**:
  - Consegna di dati inaffidabile, non ordinata e non controllata.
- **Raw Socket**:
  - Accesso diretto ai servizi dei protocolli di livello 2-3.

## Fasi della comunicazione TCP/IP
### 1. Handshake
- Allocazione delle risorse locali.
- Specificazione degli endpoint.
- Apertura connessione (client).
- Attesa connessione (server).

### 2. Scambio di messaggi
- Invio e ricezione di dati (compresi dati urgenti).
- Notifica di arrivo dei dati.

### 3. Chiusura
- Terminazione graziosa della connessione.
- Risposta alle richieste di terminazione.
- Rilascio delle risorse.

## Parametri del socket
- **Dominio**: IPv4, IPv6.
- **Tipo**: STREAM, DGRAM.
- **Protocollo**: TCP, UDP.
- **Opzioni configurabili**:
  - Dimensione buffer invio/ricezione.
  - Messaggi di controllo (keepalive).

## Comunicazione TCP
### Ruoli
- **Server**:
  - Crea un `ServerSocket`.
  - Resta in attesa di connessioni (`accept()`).
  - Gestisce lo scambio dati con un oggetto `Socket`.
- **Client**:
  - Avvia una connessione usando un oggetto `Socket`.
  - Specifica l'indirizzo e la porta del server.

### Operazioni principali
- Invio e ricezione di dati.
- Terminazione della connessione.
- Rilascio delle risorse.

### API Socket in Java
- Contenuta nel pacchetto `java.net`.
- Classi principali:
  - **`Socket`**: connessioni STREAM.
  - **`ServerSocket`**: server passivi.
  - **`DatagramSocket`**: gestione datagrammi.
- Uso di flussi di input/output per semplificare lettura/scrittura:
  - **InputStream**
  - **OutputStream**

### Operazioni bloccanti e timeout
- Operazioni bloccanti:
  - `accept()`
  - Creazione di un nuovo `Socket`.
  - Lettura su `InputStream`.
  - Scrittura su `OutputStream`.
- Soluzioni:
  - Esecuzione in thread separati.
  - Impostazione del timeout con `SO_TIMEOUT`.

## Server sequenziali e concorrenti
### Server sequenziale
- Elabora richieste una alla volta.
- Limiti:
  - Ritardi in caso di carico elevato.
  - Timeout per i client.

### Server concorrente
- Serve richieste contemporaneamente.
- Implementazioni:
  - **Creazione di thread su richiesta**:
    - `Master Thread` accetta connessioni.
    - `Slave Thread` gestisce ogni richiesta.
  - **Pool di thread**:
    - Thread pre-creati all'avvio.
    - Uso della libreria `java.util.concurrent`.
    - Configurazione tramite `Executors`.

## Comunicazione UDP
- Protocollo senza connessione.
- Adatto a trasmissioni rapide e leggere.
- Classi principali in Java:
  - **`DatagramSocket`**:
    - Specifica porta e IP locale.
    - Metodo `connect()` per indirizzo remoto.
    - Metodo `close()` per distruggere il socket.
  - **`DatagramPacket`**:
    - Specifica buffer dati, lunghezza, indirizzo e porta destinazione.

## Codifica dei dati
- TCP/UDP trasportano byte.
- Responsabilità del programmatore:
  - Codifica/decodifica (marshalling/unmarshalling).
  - Uso di librerie standard (es. JSON, XML).
  - Uso di classi Java:
    - **`DataInputStream`**
    - **`DataOutputStream`**
    - **`String`**
- Attenzione a:
  - Endianness degli interi.
  - Charset.

## Perché TCP non è adatto per rilevare crash di peer process?
### Limiti
1. **TCP monitora la connessione, non il processo applicativo.**
2. **Timeout lenti**:
   - Messaggi `keepalive`: disabilitati di default, intervalli lunghi.
   - Timeout di ritrasmissione: inefficaci in periodi di inattività.
3. **Difficoltà nel distinguere cause di problemi**:
   - Crash del processo.
   - Interruzione temporanea della rete.

### Soluzione
- **Heartbeat a livello applicativo**:
  - Invio periodico di messaggi per verificare la risposta del peer.
  - Timeout applicativi per rilevare crash.

# gRPC - Chiamate di Procedura Remota su HTTP/2

gRPC è un framework RPC che utilizza **HTTP/2** come protocollo di trasporto, sfruttandone le funzionalità avanzate (messaggi binari, multiplexing, compressione delle intestazioni). La serializzazione dei dati è gestita tramite **Protocol Buffers** (Protobuf), un formato binario compatto ed efficiente.

---

## Caratteristiche Chiave

### 1. **Supporto Multilingue**

- Permette la comunicazione tra client e server scritti in linguaggi diversi.
- Supporta binding per linguaggi come **Java**, **Python**, **Go**, **C++**, e altri.

### 2. **Semantica "At Most Once"**

- Ogni procedura remota viene eseguita **al massimo una volta**, garantendo affidabilità.
- Evita duplicazioni durante la comunicazione.

### 3. **Sicurezza**

- Supporta **TLS** (Transport Layer Security) per comunicazioni sicure.
- Offre autenticazione, crittografia e integrità dei dati.

### 4. **Modalità di Comunicazione**

- **Sincrona**: Il client attende la risposta del server.
- **Asincrona**: Il client invia richieste senza bloccarsi.
- **Streaming**: Supporta flussi di dati in tempo reale tra client e server.

---

## Protocol Buffers: Meccanismo di Serializzazione in gRPC

### 1. **Indipendenza dal Sistema**

- Permette la definizione dei messaggi una sola volta, con binding per vari linguaggi.

### 2. **Rappresentazione Binaria**

- Più efficiente di JSON o XML.
- Riduce la dimensione dei dati e migliora le prestazioni.

### 3. **Struttura dei Messaggi**

- Ogni messaggio è composto da campi numerati (ad esempio: `isbn`, `titolo`, `autori`).
- Campi opzionali o ripetuti, con valori predefiniti in caso di assenza.

---

## Tipi di RPC Supportati in gRPC

### 1. **RPC Sincrono Classico**

- Comunicazione tradizionale:
  - Il client invia una richiesta e attende la risposta.

### 2. **RPC Asincrono a Due Vie**

- Il client invia una richiesta e continua l'esecuzione senza aspettare.
- Il server risponde separatamente.

### 3. **Modalità Streaming**

#### a) **Streaming del Server (Response Streaming)**

- Il server invia un flusso continuo di risposte al client.
- Utile per inviare dati progressivi o aggiornamenti in tempo reale.

#### b) **Streaming del Client (Request Streaming)**

- Il client invia un flusso continuo di richieste al server.
- Utilizzato per caricare grandi quantità di dati.

#### c) **Streaming Bidirezionale**

- Entrambi (client e server) inviano e ricevono flussi di dati in parallelo.
- Adatto per applicazioni come chat o monitoraggio in tempo reale.

---

## StreamObserver: Gestione dello Streaming

- Strumento per lo streaming asincrono, sia lato client che server.

### Ruoli di StreamObserver

1. **Response Streaming (Server-Side)**

   - **Produttore**: Il server invia dati in streaming al client.
   - **Consumatore**: La libreria gRPC gestisce i dati ricevuti.

2. **Request Streaming (Server-Side)**

   - **Produttore**: La libreria gRPC gestisce l'invio di dati.
   - **Consumatore**: Il server riceve e processa il flusso di richieste.

3. **Client-Side Streaming**
   - **Response Streaming**: Il client è il consumatore dei dati inviati dal server.
   - **Request Streaming**: Il client invia dati in streaming al server.

---

## Vantaggi di gRPC

- **Efficienza**: Uso di protocolli binari e HTTP/2 riduce latenza e overhead.
- **Flessibilità**: Supporto per vari modelli di comunicazione (sincrono, asincrono, streaming).
- **Interoperabilità**: Adatto per sistemi eterogenei e architetture a microservizi.
- **Sicurezza Integrata**: Protezione dei dati con TLS.

---

## Applicazioni Tipiche

- Architetture **microservizi**.
- Sistemi distribuiti con requisiti di **alta efficienza**.
- Applicazioni **realtime** (monitoraggio, chat, streaming video).

# Chiamata di Procedura Remota (RPC)

La **chiamata di procedura remota** (RPC) è un protocollo di comunicazione che consente a un programma di eseguire una procedura o funzione su un altro computer/server come se fosse locale. È utilizzata in sistemi distribuiti per abilitare l'interazione tra processi o macchine diverse.

---

## Funzionamento Generale

1. **Invocazione del client**:

   - Il client chiama una procedura come fosse locale.
   - I parametri vengono **marshallizzati** (serializzati).

2. **Stub client**:

   - Intercetta la chiamata, converte i parametri in un messaggio e lo invia al server remoto.

3. **Comunicazione di rete**:

   - Utilizza protocolli come TCP/IP per trasmettere il messaggio.

4. **Stub server (o skeleton)**:

   - Riceve il messaggio, deserializza i dati e chiama la funzione server corrispondente.

5. **Esecuzione del server**:

   - Esegue l'operazione richiesta.

6. **Risposta del server**:

   - I risultati vengono inviati al client.

7. **Stub client**:
   - Riceve i risultati e li restituisce al chiamante originale.

---

## Caratteristiche Principali

- **Trasparenza**: Il client non gestisce direttamente i dettagli di rete.
- **Compatibilità**: Client e server possono utilizzare linguaggi e piattaforme differenti.
- **Architettura client-server**: Il client invoca operazioni; il server le esegue.

---

## Middleware RPC

### Implementazioni

1. **Supporto basato sul linguaggio**:

   - Ad esempio, **Java RMI**.
   - Limitato a un unico linguaggio.

2. **Generazione di stub**:
   - Basata su un **IDL (Interface Definition Language)**.
   - Genera stub client e server per linguaggi diversi.

### Sfide

- **Eterogeneità**: Conversione tra rappresentazioni di dati diverse.
- **Comunicazione client-server**: Sincronizzazione e determinazione della posizione del server.
- **Passaggio per riferimento**: Gestione memoria tra spazi di indirizzi separati.
- **Fallimenti parziali**: Rilevamento e gestione di guasti.

---

## Semantiche di Chiamata

1. **At Least Once**:

   - Garantisce l'esecuzione della procedura almeno una volta.
   - Rischio di duplicati → necessario che le procedure siano idempotenti.

2. **At Most Once**:

   - Garantisce al massimo una esecuzione.
   - Evita duplicati tramite identificatori univoci delle richieste.

3. **Exactly Once**:
   - Garantisce una sola esecuzione.
   - Difficile da implementare, richiede coordinamento rigoroso.

---

## Meccanismi di Richiesta/Risposta

1. **RPC Classico (Sincrono)**:

   - Il client invia una richiesta e attende una risposta.
   - Include:
     - **Richiesta**: Identificazione procedura, parametri.
     - **Risposta**: Successo/fallimento, valore di ritorno.

2. **RPC a una via (Asincrono)**:

   - Il client invia una richiesta ma non attende risposta.

3. **RPC a due vie (Asincrono)**:
   - Simile a quello sincrono, ma il client non si blocca.

---

## Altri Problemi

1. **Sicurezza**:

   - Controllo accessi, autenticazione, riservatezza, integrità.

2. **Prestazioni**:
   - Le chiamate remote sono molto più lente rispetto a quelle locali.

---

## Framework RPC Diffusi

- **gRPC**
- **Apache Thrift**
- **CORBA**
- **Java RMI**

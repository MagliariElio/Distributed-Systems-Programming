## **MQTT: Protocollo di Messaggistica**

### **Definizione**

MQTT (Message Queuing Telemetry Transport) è un protocollo leggero per il trasporto di messaggi basato su TCP, progettato per la comunicazione tra dispositivi con risorse limitate o in reti instabili. È particolarmente utilizzato nell'IoT (Internet of Things) e nel M2M (Machine-to-Machine).

---

### **Caratteristiche Principali**

1. **Leggerezza**: Minimizza l'overhead di rete.
2. **Efficienza**: Ideale per connessioni a banda limitata e dispositivi a basso consumo.
3. **Semplicità**: Architettura chiara basata sul modello publish-subscribe.
4. **Affidabilità**: Supporta diversi livelli di QoS (Quality of Service).
5. **Scalabilità**: Progettato per supportare un numero elevato di dispositivi.
6. **Sicurezza**: Supporta TLS/SSL per crittografia e autenticazione.

---

### **Architettura**

#### **Modello Publish-Subscribe**

- **Broker**: Nodo centrale che gestisce la comunicazione tra i client.
  - Esempi: Mosquitto, HiveMQ, RabbitMQ.
- **Client**: Può pubblicare o sottoscriversi ai messaggi.
- **Topics**: Canali logici attraverso cui i messaggi vengono indirizzati.

#### **Sessione MQTT**

1. **Connessione**: Un client si connette al broker via TCP o TCP+TLS.
2. **Handshake**:
   - **Clean Start**: Avvio di una nuova sessione o recupero di una esistente.
   - **Keep-Alive**: Intervallo massimo tra due messaggi di ping.
3. **Persistenza**:
   - I messaggi possono essere memorizzati per garantire la consegna a client non connessi.

---

### **Topics e Filtri**

#### **Topics**

- Identificatori gerarchici, separati da `/`.
  - Esempio: `casa/sala/temperatura`.
- I topics non esistono fisicamente: sono definiti dinamicamente dai client.

#### **Filtri con Caratteri Jolly**

- `+` (livello singolo):
  - Esempio: `casa/+/temperatura` (matcha `casa/sala/temperatura`).
- `#` (multilivello):
  - Esempio: `casa/#` (matcha `casa/sala/temperatura`, `casa/sala/umidità`).

#### **Topics Speciali**

- `$SYS`: Informazioni sul broker.
  - Esempio: `$SYS/broker/uptime` (tempo di attività del broker).

---

### **Messaggi MQTT**

#### **Struttura**

- **Topic**: Identifica il canale del messaggio.
- **Payload**: Contenuto del messaggio (può essere in qualsiasi formato).
- **QoS**: Garantisce il livello di consegna del messaggio.

#### **Operazioni**

1. **Publish**: Invia un messaggio su un topic.
2. **Subscribe**: Richiede messaggi da uno o più topics.
3. **Unsubscribe**: Annulla una sottoscrizione.
4. **Ping**: Mantiene attiva la connessione.
5. **Disconnect**: Chiude la sessione.

---

### **Quality of Service (QoS)**

#### **Livelli di QoS**

1. **QoS 0 (At Most Once)**
   - Best effort: il messaggio potrebbe non arrivare.
   - Nessuna conferma dal destinatario.
2. **QoS 1 (At Least Once)**
   - Il messaggio arriva almeno una volta.
   - Potrebbero verificarsi duplicati.
3. **QoS 2 (Exactly Once)**
   - Consegna garantita una sola volta.
   - Utilizza un handshake in 4 fasi.

---

### **Sottoscrizioni e Disiscrizioni**

- **Sottoscrizione**:
  - Filtri per topic con caratteri jolly (`+`, `#`).
  - QoS richiesto può essere declassato dal broker.
- **Disiscrizione**:
  - Interruzione della ricezione dei messaggi per i topics indicati.

---

### **Sicurezza in MQTT**

- **Autenticazione**:
  - Basata su username e password.
- **Crittografia**:
  - Supporto per TLS/SSL.
- **Autorizzazione**:
  - Controllo degli accessi ai topics tramite ACL (Access Control List).

---

### **Broker MQTT**

#### **Esempi**

1. **Mosquitto**: Open source, leggero.
2. **HiveMQ**: Scalabile, ideale per ambienti aziendali.
3. **EMQX**: Supporta milioni di connessioni simultanee.

---

#### **Archiviazione Persistente**

1. **Sessioni Persistenti**
   - Conservano sottoscrizioni e operazioni QoS 1 e QoS 2 per client disconnessi.
2. **Flag Retained**
   - Gli editori possono contrassegnare messaggi come conservati.
   - Il broker invia il messaggio conservato al client che si iscrive al topic.
3. **Informazioni sullo Stato del Client**
   - I client conservano informazioni per garantire la consegna affidabile dei messaggi QoS 1 e QoS 2.

---

#### **Last Will (Testament)**

1. **Topic del Testamento**
   - Specifica dove pubblicare il messaggio in caso di disconnessione inaspettata.
2. **Messaggio Testamentario**
   - Contenuto del messaggio da inviare.
3. **QoS del Testamento**
   - Livello di affidabilità per il messaggio.
4. **Flag Retain**
   - Se attivo, il messaggio è conservato dal broker.

---

#### **MQTT over WebSocket**

- Consente ai browser di agire come client MQTT, utilizzando WebSocket per comunicazioni in tempo reale.
- **Vantaggi**:
  - Compatibilità con ambienti web.
  - Comunicazione bidirezionale e persistente senza plugin aggiuntivi.

---

### **Linee Guida per l'Interfaccia Pub/Sub**

#### **1. Livello di Granularità dei Topic**

- **Granularità fine**: Controllo preciso, ma complessità maggiore.
- **Granularità grossolana**: Semplicità, ma possibili messaggi irrilevanti.

#### **2. Gestione degli Errori**

- Strutturare topic di errore (es. `error/system`, `error/device/{deviceId}`).
- Dettagliare tipo, impatto e azioni correttive nei messaggi di errore.

#### **3. Operazioni Idempotenti**

- Garantire che i messaggi duplicati non causino effetti collaterali indesiderati.
- Progettare stati espliciti e operazioni ripetibili.

#### **4. Documentazione**

- **Topic**: Lista completa e descrittiva.
- **Struttura dei Messaggi**: Specificare campi, formati e variabili.

---

### **Linee Guida Specifiche per MQTT**

#### **1. Nomi dei Topic**

- Usare solo caratteri ASCII semplici.
- Nomi chiari, descrittivi e gerarchici (es. `sensor/temperature/room1`).

#### **2. Metadati nei Topic**

- Includere informazioni contestuali nei nomi dei topic (es. tipo sensore, posizione).

#### **3. Estensione e Versionamento**

- Mantenere flessibilità nella struttura dei topic.
- Usare versioni nei topic per aggiornamenti futuri (es. `sensor/v1/temperature`).

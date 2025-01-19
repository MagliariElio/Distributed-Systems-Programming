### **1. Introduzione ai WebSocket**
- **Caratteristiche principali**:  
  - Comunicazione affidabile, bidirezionale e a bassa latenza.
  - Ideale per applicazioni interattive e in tempo reale.
  - Utilizzo in: lavoro cooperativo, interfacce utente interattive, giochi, videoconferenze, notifiche asincrone.

- **Limiti delle tecniche tradizionali**:  
  - **Richiesta-risposta**: inefficiente per notifiche push in tempo reale.
  - **Polling e long polling**: elevati costi e ritardi.
  - **COMET (HTTP streaming e subscription)**: non ottimale per comunicazione bidirezionale e richiede che il client simuli un server.

---

### **2. Caratteristiche tecniche dei WebSocket**
- **Protocollo**: Progettato per canali affidabili, bidirezionali e a bassa latenza.
- **Vantaggi**:
  - Riutilizzo delle porte HTTP (80, 443).
  - Compatibilità con proxy e intermediari.
  - Coesistenza con comunicazioni HTTP.
  - Modello di sicurezza basato sulla SOP (Same-Origin Policy).
  - Comunicazione basata su messaggi con frame binari.

---

### **3. Differenze tra WebSocket e TCP**
- **WebSocket aggiunge**:  
  - Modello di sicurezza per browser basato sull'origine.  
  - Supporto per più endpoint su una porta e più host su un IP.  
  - Meccanismo di frame e messaggistica senza limiti di lunghezza.  
  - Meccanismo di chiusura in banda compatibile con proxy.  

---

### **4. URI dei WebSocket**
- **Identificazione degli endpoint**:
  - **Schema "ws"**: connessioni su TCP.
  - **Schema "wss"**: connessioni su TLS (TCP sicuro).

---

### **5. Struttura dei frame**
- **Tipologie**:
  - **Frame di controllo**:  
    - Chiusura connessione.  
    - Operazioni di ping/pong.
  - **Frame di dati**:  
    - Carico utile dei messaggi.  
    - Tipi: binari, di testo (UTF-8), di continuazione.

---

### **6. Gestione dei messaggi**
- **Tipologie**:  
  - **Non frammentati**: singolo frame (bit FIN = 1).  
  - **Frammentati**: suddivisi in più frame (FIN = 1 solo nell’ultimo frame).  

- **Chiusura**:  
  - Entrambi gli endpoint possono avviare l’handshake di chiusura.  
  - Dopo il frame di chiusura:  
    - Non vengono più scambiati dati.  
    - La connessione TCP sottostante viene chiusa.  
  - Differenza da TCP: chiusura sincronizzata bidirezionale.

---

### **7. Utilizzo e sottoprotocolli**
- **Base per protocolli di livello superiore**:  
  - Definiscono tipi di messaggi, metadati e procedure.  
  - Utilizzati per esigenze applicative specifiche.  

- **Sottoprotocolli**:  
  - Protocolli costruiti su WebSocket.  
  - Aggiungono funzionalità e struttura alla comunicazione.

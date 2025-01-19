### Tolleranza ai Guasti nei Sistemi Distribuiti: Guida Dettagliata

---

## 1. **Definizione di Tolleranza ai Guasti**

La tolleranza ai guasti è la capacità di un sistema di continuare a funzionare anche in presenza di guasti, errori o fallimenti, garantendo che le sue prestazioni siano accettabili e che i servizi essenziali siano disponibili. È un elemento cruciale per i sistemi distribuiti, dove la natura della distribuzione introduce numerosi punti di vulnerabilità.

---

## 2. **Componenti Chiave della Tolleranza ai Guasti**

### 2.1 **Guasti, errori e fallimenti**

- **Guasto (Fault)**: Una condizione anomala che causa il malfunzionamento di un componente del sistema.

  - _Tipi di guasto_:
    - **Transitorio**: Temporaneo, scompare senza interventi (es. disturbi di rete).
    - **Intermittente**: Si manifesta sporadicamente.
    - **Permanente**: Persiste fino a quando non viene risolto manualmente.

- **Errore (Error)**: La manifestazione di un guasto. Può propagarsi attraverso il sistema causando un malfunzionamento.

- **Fallimento (Failure)**: Quando il sistema non riesce a fornire il servizio richiesto.

---

### 2.2 **Tipi di Guasti nei Sistemi Distribuiti**

1. **Guasto per arresto (Crash)**: Il componente smette di funzionare completamente.
2. **Guasto per omissione**: Fallimento nel ricevere o inviare un messaggio.
3. **Guasto di temporizzazione**: Operazioni eseguite al di fuori delle tempistiche previste.
4. **Guasto di risposta errata**: Output errato in risposta a un input corretto.
5. **Guasto arbitrario (Byzantine)**: Comportamento imprevedibile, come l’invio di dati corrotti o incoerenti.

---

## 3. **Proprietà Fondamentali per la Tolleranza ai Guasti**

- **Disponibilità**: Percentuale di tempo in cui il sistema è operativo e accessibile.
- **Affidabilità**: Capacità di funzionare senza errori per un determinato periodo.
- **Sicurezza**: Prevenzione di comportamenti dannosi dovuti a guasti.
- **Manutenibilità**: Facilità di rilevazione e correzione dei guasti.

---

## 4. **Tecniche di Tolleranza ai Guasti**

### 4.1 **Rilevamento dei guasti**

Il primo passo per tollerare un guasto è rilevarlo. Nei sistemi distribuiti, i ritardi di rete e la natura asincrona rendono questo compito complesso.

- **Heartbeat**: Invia segnali periodici per confermare il funzionamento di un componente.
- **Timeout**: Considera un componente guasto se non risponde entro un certo intervallo.

---

### 4.2 **Recupero dai guasti**

- **Ripristino a caldo (Hot Restart)**: Il sistema riprende da uno stato consistente memorizzato.
- **Ripristino a freddo (Cold Restart)**: Il sistema riparte da zero, perdendo gli stati precedenti.

---

### 4.3 **Ridondanza**

- **Ridondanza temporale**: Ripetizione delle operazioni per correggere errori transitori.
- **Ridondanza fisica**: Duplicazione dei componenti hardware per garantire la continuità operativa.
- **Ridondanza software**: Replica di processi o servizi distribuiti.

---

## 5. **Organizzazione dei Sistemi Tolleranti ai Guasti**

### 5.1 **Gruppi di processo**

Un gruppo di processi coopera per garantire la resilienza del sistema:

- **Gestione dell'appartenenza**: Controllo dell’ingresso e uscita di membri nel gruppo.
- **Replica**: Copie ridondanti di dati e processi per prevenire perdite.
- **Coordinamento**: Designazione di un leader per evitare conflitti.

### 5.2 **Tipi di organizzazione**

1. **Hierarchical**:
   - Struttura gerarchica, coordinatore principale.
   - La struttura è organizzata a livelli con un coordinatore principale (leader o master) che gestisce e supervisiona gli altri nodi (worker o slave).
   - I nodi subordinati si affidano al coordinatore per decisioni critiche, come l'assegnazione dei compiti, la sincronizzazione e la gestione dei guasti.
   - Primary Based Protocols.
2. **Flat**:
   - Tutti i nodi hanno lo stesso ruolo e collaborano senza una gerarchia fissa.
   - Ogni nodo è responsabile delle proprie operazioni, ma collabora con gli altri per garantire la consistenza e la tolleranza ai guasti.
   - Struttura simmetrica.
   - Protocolli complessi come quorum, replica attiva.

---

### 5.2 **k-Fault Tolerance**

Un sistema è **k-fault tolerant** se può tollerare fino a \(k\) guasti simultanei.

- **Regola dei 2k + 1**: Sono necessari almeno \(2k + 1\) processi per garantire la tolleranza a \(k\) guasti.
- _Esempio_: Per tollerare 1 guasto, sono necessari almeno 3 processi.


Il requisito di **2k + 1 processi** per ottenere una tolleranza ai guasti di grado \(k\) nei sistemi distribuiti si basa sulla necessità di garantire la corretta operatività del sistema, anche in presenza di \(k\) processi guasti. Ecco il motivo in dettaglio:

### **Garanzia di Maggioranza**
Per mantenere la coerenza e il consenso in un sistema distribuito:
- È necessario che i processi **funzionanti** (non guasti) costituiscano una **maggioranza** nel gruppo.
- In un sistema con **2k + 1** processi totali, se fino a \(k\) processi guastano, i **processi rimanenti** saranno almeno \(k + 1\), che rappresentano la **maggioranza assoluta**.

Questo consente ai processi funzionanti di:
- Raggiungere il consenso.
- Evitare che i processi guasti influenzino il corretto funzionamento del sistema.

### **Protocolli di Consenso e Sicurezza**

#### a. **Quorum**
Un protocollo di consenso spesso richiede che la maggioranza dei processi risponda per validare un'operazione:
- Con **2k + 1** processi totali, anche se \(k\) processi non rispondono (guasti), ci sono ancora \(k + 1\) processi disponibili per formare il quorum.

#### b. **Protezione contro guasti arbitrari (Byzantine)**
Nel caso di guasti più complessi, come quelli **Byzantine** (dove i processi guasti possono comportarsi in modo imprevedibile o malevolo), è necessaria una maggioranza qualificata. 
- In questi scenari, servono almeno **3k + 1** processi totali per tollerare \(k\) guasti byzantine, poiché è necessario un consenso più forte per isolare i comportamenti malevoli.

### **Esempio Pratico**
Supponiamo di avere un sistema con \(k = 1\) (tolleranza a un guasto):
- Totale richiesto: \(2k + 1 = 3\) processi.
- Anche se un processo guasta, rimangono **2 processi funzionanti**, che costituiscono la maggioranza.

Per \(k = 2\) (tolleranza a due guasti):
- Totale richiesto: \(2k + 1 = 5\) processi.
- Anche se due processi guastano, rimangono **3 processi funzionanti**, ancora una maggioranza.

---

## 6. **Teorema CAP nei Sistemi Distribuiti**

Il **teorema CAP** (Consistency, Availability, Partition Tolerance) è un principio fondamentale dei sistemi distribuiti, formulato da Eric Brewer. Esso stabilisce che un sistema distribuito non può garantire contemporaneamente tutti e tre i seguenti aspetti:

1. **Consistenza** (Consistency): Tutti i nodi vedono gli stessi dati nello stesso momento.
2. **Disponibilità** (Availability): Ogni richiesta riceve una risposta, anche in caso di guasti.
3. **Tolleranza alle partizioni** (Partition Tolerance): Il sistema funziona correttamente nonostante la perdita di connessione tra i nodi.

### **Spiegazione del Teorema CAP**

Il teorema afferma che, in presenza di una partizione di rete, un sistema distribuito deve fare una scelta tra **coerenza** e **disponibilità**:  
- Se si privilegia la **coerenza**, il sistema potrebbe rifiutare alcune richieste per evitare dati incoerenti.  
- Se si privilegia la **disponibilità**, il sistema potrebbe fornire dati non aggiornati per garantire una risposta.  

Non è possibile ottenere tutti e tre gli aspetti contemporaneamente in presenza di partizioni.

---

### Critiche

1. **Eccessiva semplificazione**:
   - Non considera latenza, scalabilità, durabilità.
2. **Variazioni del mondo reale**:
   - Diverse gestioni delle partizioni.
3. **CAP come filosofia progettuale**:
   - Priorità su proprietà in base ai requisiti.

---

### **Strategie per Superare le Limitazioni del CAP**

Anche se il teorema CAP impone dei vincoli, è possibile progettare sistemi che bilanciano i compromessi in base alle esigenze specifiche. Ecco alcune strategie:

#### **Compromesso tra Coerenza e Disponibilità**  
- **Eventual Consistency** (Coerenza Eventuale):  
  I dati possono essere temporaneamente incoerenti, ma alla fine tutti i nodi convergeranno a uno stato consistente. È una scelta comune in sistemi come Amazon DynamoDB e Cassandra.  
  - *Esempio*: Durante un'interruzione, le scritture vengono accodate e sincronizzate successivamente.

- **Tunable Consistency** (Coerenza Regolabile):  
  Alcuni sistemi consentono di configurare il livello di coerenza desiderato per ogni operazione, bilanciando coerenza e disponibilità.  
  - *Esempio*: In Cassandra, si può specificare il numero di nodi che devono confermare una scrittura (quorum).

#### **Replica dei Dati e Failover**  
- **Replica Attiva**:  
  I dati vengono replicati su più nodi. Se uno di essi diventa inaccessibile, un altro nodo può rispondere alla richiesta.  
  - *Esempio*: MongoDB utilizza repliche primarie e secondarie per garantire disponibilità, sacrificando temporaneamente la coerenza.

- **Sharding con Partition Recovery**:  
  I dati vengono divisi in partizioni e distribuiti tra i nodi. Durante una partizione di rete, i nodi inaccessibili possono essere recuperati successivamente.

#### **Utilizzo di Protocolli di Consenso**  
- **Paxos o Raft**:  
  Questi protocolli garantiscono la coerenza in sistemi distribuiti tolleranti alle partizioni, accettando ritardi nelle risposte per mantenere l'integrità dei dati.

#### **Hybrid Systems**  
- Alcuni sistemi adottano un approccio ibrido, scegliendo **alta coerenza** per dati critici e **alta disponibilità** per dati meno sensibili.  
  - *Esempio*: Facebook utilizza un modello ibrido con Cassandra per messaggi (coerenza eventuale) e MySQL per dati sensibili (coerenza forte).

### **Scenari pratici**

- **CP (Consistenza e Partizioni)**: Sistemi di database fortemente consistenti, come HBase.
- **AP (Disponibilità e Partizioni)**: Sistemi di tipo DynamoDB, ottimizzati per la disponibilità.
- **CA (Consistenza e Disponibilità)**: Possibile solo in ambienti senza partizioni, quindi non realistico nei sistemi distribuiti.

---

## 7. **Protocolli di Consenso**

I protocolli di consenso sono essenziali per garantire la consistenza tra repliche. I principali protocolli includono:

1. **Paxos**: Protocolo robusto per raggiungere il consenso in presenza di guasti.
2. **Raft**: Alternativa più semplice da implementare rispetto a Paxos.

---

## 8. **Conclusione**

La tolleranza ai guasti nei sistemi distribuiti richiede una combinazione di rilevamento, ripristino e ridondanza, bilanciando le esigenze di consistenza, disponibilità e tolleranza alle partizioni. Con una progettazione accurata, è possibile costruire sistemi affidabili e resilienti, fondamentali per applicazioni critiche come cloud computing e reti di dati globali.

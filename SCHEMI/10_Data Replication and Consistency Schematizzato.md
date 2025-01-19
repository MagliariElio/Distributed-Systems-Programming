# Data Replication and Consistency

La replica dei dati migliora l'**affidabilità** e le **prestazioni di un sistema**, ma introduce sfide legate alla **consistency**. Idealmente, la replica dei dati dovrebbe essere trasparente per l'utente. Quando i dati replicati cambiano, possono sorgere stati incoerenti, rendendo temporaneamente le repliche non identiche e interrompendo la trasparenza. Tuttavia, possiamo cercare di nascondere queste incoerenze al costo di una latenza aggiuntiva e di un sovraccarico di prestazioni.

---

### Replica dei dati e prestazioni
- **Obiettivo**: Scalabilità dimensionale e geografica.
  - La scalabilità dimensionale permette di aggiungere risorse per aumentare la capacità di elaborazione del sistema.
  - La scalabilità geografica consente l'accesso rapido ai dati da diverse posizioni geografiche.
- **Sfida**: Quando i dati replicati cambiano, possono verificarsi stati incoerenti tra le repliche.
  - Questo avviene perché le operazioni di scrittura e lettura possono non essere sincronizzate immediatamente.
- **Soluzione**:
  - Nascondere le incoerenze è possibile mediante tecniche di buffering o caching, ma ciò comporta un aumento della latenza e del sovraccarico delle prestazioni.
  - Strategie come l'utilizzo di quorum o di protocolli di coerenza possono mitigare i problemi di inconsistenza.

---

### Cost of Consistency
- **Risoluzione delle incoerenze**:
  - Le modifiche ai dati vengono propagate a tutte le repliche per garantire la coerenza.
  - Questo processo richiede:
    - **Sovraccarico di banda**: La trasmissione di aggiornamenti consuma risorse di rete.
    - **Sovraccarico di calcolo**: Ogni replica deve elaborare gli aggiornamenti ricevuti.
    - **Aumento della latenza**: Il tempo necessario per sincronizzare tutte le repliche cresce con il numero di nodi e la distanza geografica.
- **Equilibrio**: Dipende dai requisiti specifici di coerenza (consistency requirements), che possono variare da applicazioni strettamente consistenti a scenari che tollerano incoerenze temporanee.

---

### Consistency Model
- **Definizione**: Un consistency model rappresenta un contratto tra i processi e l'archivio dati che definisce le proprietà di consistenza garantite.
- **Coerenza rigorosa (Strict Consistency)**:
  - Ogni scrittura è immediatamente visibile a tutte le repliche.
  - Nessuna lettura di dati obsoleti, garantendo che tutte le letture successive riflettano l'ultima scrittura.
  - **Pro**: Modello semplice e intuitivo.
  - **Contro**: Richiede sincronizzazione immediata tra tutte le repliche, comportando un costo elevato in termini di prestazioni e latenza.

---

## Data-Centric Consistency Models
Le proprietà di coerenza possono essere espresse in **termini di comportamento delle operazioni di lettura/scrittura sull'archivio dati globale**.

### Continuous Consistency
- **Obiettivo**: Bilanciare prestazioni e coerenza consentendo deviazioni limitate tra le repliche.
- **Tipi di deviazione**:
  1. **Numeric Deviation**: Differenza nei valori tra le repliche. Ad esempio, in un sistema finanziario, i saldi dei conti tra repliche possono differire temporaneamente.
  2. **Deviazione di stallo**: Differenza nel tempo dell'ultimo aggiornamento tra le repliche, indicando quanto una replica è "indietro" rispetto alle altre.
  3. **Deviation in the order of writes**: Ordine incoerente delle operazioni di scrittura su diverse repliche, che può influenzare il risultato finale.
- **Unità di consistenza (Conits)**:
  - Conits grandi: Coprono grandi insiemi di dati, rendendo più semplice mantenere la coerenza globale, ma aumentano il rischio di incoerenze significative.
  - Conits piccoli: Coprono insiemi di dati più ridotti, migliorando la coerenza, ma aumentando i costi di coordinamento e sincronizzazione.

### Sequential Consistency (Lamport)
- **Condizioni chiave**:
  1. **Sequenzialità globale**: Esiste un ordine unico e deterministico di esecuzione per tutte le operazioni su tutte le repliche.
  2. **Ordine per processo**: Ogni processo osserva le proprie operazioni nell'ordine in cui le ha eseguite.
- **Proprietà**:
  - Garantisce che tutte le operazioni siano osservate nello stesso ordine da tutti i processi.
  - Offre un compromesso tra prestazioni e consistenza.
  - È meno costoso della coerenza rigorosa, ma più complesso da implementare.

### Causal Consistency
- **Definizione**: Le scritture causalmente correlate devono essere osservate nello stesso ordine da tutti i processi.
  - Ad esempio, se un processo scrive un valore "A" e successivamente un valore "B", ogni altro processo che legge "B" deve aver letto prima "A".
- **Caratteristiche**:
  - Le scritture indipendenti, non correlate causalmente, possono essere osservate in ordini differenti su macchine diverse.
  - È più debole della consistenza sequenziale, ma offre maggiori prestazioni.
  - Adatto a sistemi distribuiti dove le latenze di rete sono elevate.

### **Eventual Consistency**  
- **Definizione:** Le copie dei dati non sono immediatamente sincronizzate, ma convergono verso uno stato consistente nel tempo, se non ci sono ulteriori aggiornamenti.  
- **Caratteristiche:**  
  - Molte più letture rispetto alle scritture.  
  - Alta disponibilità e velocità di accesso ai dati a costo di temporanea incoerenza.  
  - Problematiche con la mobilità dei processi.

---

## **Client-centered consistency models**  
- **Obiettivo:** Fornire garanzie di consistenza per ogni singolo processo o client.  
- **Modelli:**  
  1. **Letture monotone (Monotonic Reads):** Le letture successive restituiscono lo stesso valore o uno più aggiornato.  
  2. **Scritture monotone (Monotonic Writes):** Una scrittura deve essere completata prima di effettuare una nuova scrittura sullo stesso dato.  
  3. **Read Your Writes:** Una lettura successiva riflette sempre la scrittura effettuata dallo stesso processo.  
  4. **Writes Follow Reads:** Le scritture successive a una lettura riflettono sempre quel valore o uno più aggiornato.  

---

## **Gestione delle repliche**  
- **Replicazione dei server:**  
  - Decide quali server replicare e dove collocarli.  
  - Obiettivo: bilanciamento del carico e tolleranza ai guasti.  
- **Replicazione dei contenuti:**  
  - Decide quali contenuti replicare e dove collocarli.  
  - Obiettivo: ottimizzare disponibilità e ridurre latenza.  

### **Strategie di propagazione degli aggiornamenti**  
1. **Notifica degli aggiornamenti (Invalidation):** Invia notifiche di aggiornamento alle repliche (basso rapporto lettura-aggiornamento).  
2. **Propagazione dei dati:** Propaga i dati aggiornati alle repliche (alto rapporto lettura-aggiornamento).  
3. **Propagazione delle operazioni:** Propaga direttamente le operazioni di aggiornamento (replica attiva).

### **Protocolli Push e Pull**  
- **Push (basato su server):**  
  - Avviato dal server, adatto a forte consistenza.  
  - Ideale per alto rapporto lettura-aggiornamento.  
- **Pull (basato su client):**  
  - Avviato dal client, accettabile per consistenza debole.  
  - Funziona bene in scenari con basso rapporto lettura-aggiornamento.

---

## **Protocolli per la coerenza**  
1. **Continuous Consistency:**  
   - Scritture provvisorie locali, con conflitti rilevati e risolti tramite propagazione.  
2. **Sequential Consistency:**  
   - Ordine sequenziale di letture/scritture:  
     - **Primary Based Protocols:**  
       - *Scrittura remota:* il dato rimane nel server primario.  
       - *Scrittura locale:* il dato viene trasferito al processo che scrive.  
     - **Replicated Write Protocols:**  
       - *Replica attiva:* operazioni applicate nello stesso ordine su tutte le repliche.  
       - *Quorum:* operazioni eseguite solo con consenso della maggioranza.

---

## **Cache Coherence Protocols**  
- **Strategie di coerenza:**  
  1. **Convalida pre-transazione:** Il client convalida i dati prima di procedere.  
  2. **Convalida durante la transazione (approccio ottimistico):** La consistenza viene verificata mentre la transazione è in corso.  
  3. **Convalida post-transazione:** La consistenza viene verificata alla fine.  

### **Strategie di applicazione**  
1. **Cache di sola lettura:**  
   - **Push:** Aggiornamenti inviati dal server.  
   - **Pull:** Aggiornamenti richiesti dal client.  
2. **Cache di lettura e scrittura:**  
   - Utilizza *Primary Based Protocols* con blocco del dato da parte del client per evitare conflitti.  
   - La cache del client diventa "primaria temporanea" per modifiche sicure.


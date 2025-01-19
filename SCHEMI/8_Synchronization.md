# Sincronizzazione nei Sistemi Distribuiti

## Introduzione

In un sistema distribuito, i processi operano in modo asincrono, il che significa che possono avanzare a velocità diverse e subire ritardi variabili. Tuttavia, ci sono scenari in cui la sincronizzazione diventa necessaria per imporre l'ordine degli eventi o per soddisfare specifici requisiti temporali.

### Due approcci comuni:

1. **Sincronizzazione degli orologi fisici**

   - Sincronizza gli orologi dei processi per ottenere una nozione comune di tempo.
   - Tecniche: Network Time Protocol (NTP), ricevitori UTC.

2. **Orologi logici**
   - Forniscono sincronizzazione basata su timestamp logici e relazioni causali.
   - Utili per mantenere la coerenza nei sistemi distribuiti senza affidarsi al tempo fisico.

## Sincronizzazione dell'orologio fisico

### Metodi:

1. **Ricevitori UTC**

   - Precisione: fino a 50ns
   - Svantaggio: costosi da implementare

2. **NTP (Network Time Protocol)**

   - Soluzione economica con buona precisione.
   - Precisione varia in base alla rete:

   | Tipo di rete                      | Precisione |
   | --------------------------------- | ---------- |
   | LAN                               | < 1ms      |
   | Internet pubblico                 | 10-50ms    |
   | Internet pubblico con congestione | > 100ms    |

## Orologi Logici nei Sistemi Distribuiti

Nei sistemi distribuiti, ottenere un accordo sull'ordine degli eventi è spesso sufficiente ai fini della sincronizzazione. Gli **orologi logici** rappresentano algoritmi distribuiti utilizzati per stabilire un ordine parziale degli eventi senza sincronizzazione degli orologi fisici.

**Gli orologi logici forniscono un ordine parziale degli eventi senza basarsi sulla sincronizzazione fisica**.

Ogni processo mantiene un proprio orologio logico, che si incrementa al verificarsi di eventi. L'ordine degli eventi è determinato dai valori di questi orologi logici.

## Algoritmi per Orologi Logici

Alcuni algoritmi chiave per implementare gli orologi logici includono:

- **Orologi di Lamport**
- **Orologi Vettoriali**

Questi algoritmi assegnano timestamp o valori vettoriali agli eventi, consentendo di determinare relazioni di causalità.

---

## Orologi di Lamport

Gli **orologi di Lamport** permettono di tenere traccia dell'ordine degli eventi in un sistema distribuito, stabilendo una relazione causale tra di essi. L'obiettivo è identificare se un evento in un processo ha causato un altro evento in un altro processo.

### Relazione "Happens-Before"

La relazione `happens-before (→)` determina l'ordine degli eventi:

1. **Eventi locali**: Se l'evento `a` si verifica prima dell'evento `b` nello stesso processo, allora `a → b`.
2. **Eventi correlati da messaggi**: Se un processo invia un messaggio (evento `a`) e un altro processo lo riceve (evento `b`), allora `a → b`.

> Nota: Gli orologi di Lamport forniscono un **ordine parziale** degli eventi.

### Algoritmo

L'algoritmo funziona come segue:

1. Ogni processo `Pᵢ` mantiene un contatore locale `Cᵢ`.
2. Per ogni evento locale `a`:
   - Incrementa `Cᵢ`.
   - Marca l'evento con il valore `Cᵢ(a)`.
3. Per ogni messaggio inviato:
   - Allegare il valore `Cᵢ` corrente al messaggio.
4. Per ogni messaggio ricevuto con timestamp `Cᵣ`:
   - Aggiorna `Cᵢ = max(Cᵢ, Cᵣ)`.
   - Incrementa `Cᵢ` e marca l'evento di ricezione.

Questo approccio garantisce che il contatore locale di un processo sia sempre sincronizzato rispetto ai timestamp ricevuti.

### Considerazioni e Limiti

- **Timestamp univoci**: Per evitare timestamp uguali, si può includere l'ID del processo nel timestamp, rappresentandolo come `<Cᵢ(a), i>`.
- **Limite principale**: Gli orologi di Lamport forniscono solo un **ordine parziale**, non totale. Due eventi non correlati causalmente possono avere timestamp diversi senza alcuna relazione temporale diretta.

---

## Ordinamento Totale

Per ottenere un **ordine totale**, è necessario introdurre un criterio aggiuntivo. Ad esempio, includendo l'ID del processo, ogni evento avrà un timestamp univoco. Questo permette di confrontare sempre due eventi e stabilire un ordine totale.

---

## Multicast Totalmente Ordinato

In scenari come server replicati, è necessario garantire che tutti i messaggi multicast siano consegnati nello stesso ordine a ciascun ricevitore. Questo approccio è cruciale per:

- **Tolleranza ai guasti**
- **Riduzione della latenza**
- **Coerenza tra repliche**

### Algoritmo di Multicast a Ordinamento Totale

1. Ogni processo mantiene un orologio di Lamport.
2. Per ogni messaggio inviato in multicast:
   - Marca il messaggio con il timestamp corrente.
3. Alla ricezione di un messaggio:
   - Inserisci il messaggio in una coda ordinata per timestamp.
4. Ogni processo invia un acknowledgment per ogni messaggio ricevuto.
5. Quando tutti i ricevitori hanno confermato un messaggio in testa alla coda:
   - Rimuovi il messaggio dalla coda.
   - Consegna il messaggio all'applicazione.

### Vantaggi

- **Ordine coerente**: Garantisce che i messaggi siano elaborati nello stesso ordine su tutti i processi.
- **Sincronizzazione**: Fornisce coerenza tra repliche, riducendo i conflitti.

### Vector Clocks

#### **Definizione e Caratteristiche**

- **Problema degli orologi di Lamport:** Forniscono un ordinamento totale, ma non garantiscono la causalità tra gli eventi.
- **Orologi vettoriali:** Forniscono un **ordinamento parziale** che cattura la causalità.
  - **Proprietà di causalità:**
    - \( C(a) < C(b) \): \( a \) precede causalmente \( b \).
    - \( C(a) > C(b) \): \( b \) precede causalmente \( a \).
    - \( C(a) \) e \( C(b) \) non comparabili: eventi concomitanti (indipendenti).
  - Utilizzati per ordinamento, istantanee distribuite, protocolli di coerenza.

### **Catturare la causalità: un esempio**

Immaginiamo tre processi \(P_1\), \(P_2\), e \(P_3\):

1. \(P_1\) esegue un evento \(a\): il suo vettore diventa \(V = [1, 0, 0]\).
2. \(P_1\) invia un messaggio a \(P_2\) con il vettore \(V = [1, 0, 0]\).
3. \(P_2\) riceve il messaggio e aggiorna il proprio vettore a \(V = [1, 1, 0]\), indicando che l'evento di \(P_1\) è noto e causalmente precedente a qualunque evento futuro in \(P_2\).

Se un altro evento \(b\) si verifica in \(P_3\) con un vettore \(V = [0, 0, 1]\), i vettori mostrano che \(b\) non è causalmente correlato con \(a\), perché i vettori non si dominano a vicenda.

#### **Algoritmo Vector Clocks**

1. **Ogni processo mantiene un vettore di orologi** con tanti elementi quanti sono i processi (\( VC[i] \) = stato logico del processo \( P_i \)).
2. **Inizializzazione:** Tutti i valori inizializzati a 0 (\( [0, 0, ..., 0] \)).
3. **Aggiornamento locale:**
   - Quando \( P_i \) esegue un evento locale, incrementa \( VC[i] \).
4. **Invio messaggi:**
   - Invia il proprio vettore \( VC \) con ogni messaggio.
5. **Ricezione messaggi:**
   - Aggiorna \( VC \) combinando i valori massimi elemento per elemento tra il proprio vettore e quello ricevuto.
   - Marca l'evento di ricezione con il nuovo valore di \( VC \).

#### **Applicazione: Multicast Ordinato Causale**

- **Scopo:** Garantire che i messaggi causalmente correlati siano consegnati nell'ordine corretto.
- **Procedura:**
  1. Il mittente include \( VC \) nel messaggio.
  2. Il destinatario aggiorna il proprio \( VC \) con il massimo elemento per elemento tra il proprio vettore e quello ricevuto.
  3. I messaggi sono consegnati solo se rispettano le dipendenze di causalità.

#### **Limiti degli orologi vettoriali**

1. **Complessità:**
   - Maggiore utilizzo di memoria e banda (ogni processo invia un vettore completo).
2. **Gestione dei conflitti:**
   - Non risolvono conflitti tra eventi concorrenti; richiedono protocolli come **Paxos** o **Raft**.

#### **Vantaggi**

- Identificazione delle relazioni causali in sistemi distribuiti.
- Efficienza nel catturare la causalità per applicazioni distribuite.

---

## Conclusioni

Gli orologi logici, e in particolare gli orologi di Lamport, rappresentano strumenti fondamentali nei sistemi distribuiti per stabilire relazioni causali tra eventi. L'integrazione di algoritmi per l'ordinamento totale, come il multicast a ordinamento totale, è essenziale per applicazioni critiche che richiedono coerenza e sincronizzazione tra processi.

# **Esempio pratico per spiegare perché gli orologi di Lamport non distinguono eventi concorrenti, ma i vector clocks sì**

Immaginiamo un sistema distribuito con **tre processi**: P1, P2 e P3. Gli eventi rappresentano azioni nei processi (es. invio/ricezione di messaggi). Gli eventi concorrenti sono quelli che non hanno una relazione causale diretta.

---

#### **Scenario**

1. **Eventi indipendenti**:

   - P1 esegue un evento \( A \).
   - P2 esegue un evento \( B \).
   - Questi eventi non si influenzano a vicenda (sono **concorrenti**).

2. **Eventi correlati**:
   - P1 invia un messaggio a P2.
   - P2 esegue un evento \( C \) dopo aver ricevuto il messaggio.
   - In questo caso, c'è una relazione causale (\( A \rightarrow C \)).

---

### **Orologi di Lamport**

Ogni processo tiene un **numero scalare** come timestamp:

1. **Esecuzione degli eventi**:

   - \( A \): P1 incrementa il proprio orologio a **1** → Timestamp: \( A = 1 \).
   - \( B \): P2 incrementa il proprio orologio a **1** → Timestamp: \( B = 1 \).

2. **Causalità tramite messaggi**:

   - P1 invia un messaggio a P2 con il timestamp **1**.
   - P2 riceve il messaggio, confronta il timestamp, e aggiorna il proprio orologio al massimo tra i due valori incrementandolo di 1:
     - \( C = \max(1, 1) + 1 = 2 \).

3. **Risultato degli orologi di Lamport**:
   - \( A = 1 \), \( B = 1 \), \( C = 2 \).
   - **Problema**: Gli orologi di Lamport non possono distinguere tra \( A \) e \( B \) perché entrambi hanno timestamp **1**. Non è chiaro se sono concorrenti o meno.

---

### **Vector Clocks**

Ogni processo tiene un **vettore** di dimensione pari al numero di processi:

1. **Esecuzione degli eventi**:

   - \( A \): P1 incrementa il proprio contatore locale → Vector: \( [1, 0, 0] \).
   - \( B \): P2 incrementa il proprio contatore locale → Vector: \( [0, 1, 0] \).

2. **Causalità tramite messaggi**:

   - P1 invia un messaggio con il vettore \( [1, 0, 0] \).
   - P2 riceve il messaggio, confronta il vettore e aggiorna ciascun elemento al massimo:
     - \( [\max(1, 0), \max(0, 1), \max(0, 0)] = [1, 1, 0] \).
     - Incrementa il proprio contatore locale: \( C = [1, 2, 0] \).

3. **Risultato dei vector clocks**:
   - \( A = [1, 0, 0] \), \( B = [0, 1, 0] \), \( C = [1, 2, 0] \).
   - Confronto:
     - \( A \) e \( B \): Nessun vettore domina l'altro (\( [1, 0, 0] \) vs \( [0, 1, 0] \)) → Sono **concorrenti**.
     - \( A \rightarrow C \): Il vettore di \( A \) domina quello di \( C \) (\( [1, 0, 0] \leq [1, 2, 0] \)) → C'è causalità.

---

### **Differenza chiave**

- **Orologi di Lamport**: Non possono distinguere \( A \) e \( B \) (entrambi hanno timestamp **1**) → Non rilevano la concorrenza.
- **Vector Clocks**: Rilevano che \( A \) e \( B \) sono concorrenti perché i loro vettori non si dominano a vicenda (\( [1, 0, 0] \) vs \( [0, 1, 0] \)).

---

### **Punto chiave**

Negli **orologi di Lamport**, avere lo stesso timestamp **non implica necessariamente una relazione causale** tra eventi.

Negli orologi di Lamport:

- Se due eventi \( A \) e \( B \) hanno lo stesso timestamp o timestamp differenti, **non puoi sapere se sono concorrenti o meno**.
- La relazione causale (`A → B`) è garantita **solo se un timestamp è maggiore di un altro** (ad esempio, \( L(A) < L(B) \)).

Se due eventi hanno lo stesso timestamp, il meccanismo degli orologi di Lamport **non offre informazioni aggiuntive** per stabilire se esiste una relazione causale oppure no.

---

### **Esempio dettagliato**

Immagina un sistema con **due processi**, \( P1 \) e \( P2 \), e i seguenti eventi:

1. \( P1 \): Evento \( A \).

   - P1 incrementa il proprio orologio locale: \( L(A) = 1 \).

2. \( P2 \): Evento \( B \).
   - P2 incrementa il proprio orologio locale: \( L(B) = 1 \).

**Situazione**: Gli eventi \( A \) e \( B \) non sono correlati (cioè, non si sono influenzati a vicenda). Sono **concorrenti**.

- **Orologio di Lamport**:  
  Entrambi gli eventi \( A \) e \( B \) hanno lo stesso timestamp (\( L(A) = L(B) = 1 \)).  
  Però:
  - Gli orologi di Lamport non registrano **chi ha generato l'evento** o **quali processi sono coinvolti**.
  - Non c’è modo di sapere se \( A \) e \( B \) sono correlati causalmente o se sono concorrenti.

---

### **Cosa succede nei vector clocks?**

Nei vector clocks:

- \( P1 \): Evento \( A \): Vector \( [1, 0] \).
- \( P2 \): Evento \( B \): Vector \( [0, 1] \).

Confrontando:

- \( [1, 0] \) non domina \( [0, 1] \) e viceversa.
- Questo significa che \( A \) e \( B \) sono chiaramente **concorrenti**.

---

### **Conclusione**

Gli **orologi di Lamport**:

1. Usano un singolo numero scalare come timestamp.
2. Non registrano informazioni su quali processi sono coinvolti o su come gli eventi si influenzano.
3. Quindi, non distinguono eventi concorrenti, perché non possono verificare se esiste o meno una relazione causale tra due eventi con lo stesso timestamp.

I **vector clocks**, invece, tracciano informazioni dettagliate su tutti i processi, permettendo di rilevare chiaramente sia la causalità che la concorrenza.

## **Total Ordering negli Orologi di Lamport**

Il **total ordering** è un meccanismo che si applica agli orologi di Lamport per garantire un ordine totale tra tutti gli eventi, anche se questi sono concorrenti. Tuttavia, **non risolve il problema della distinzione tra eventi concorrenti**; semplicemente impone un **ordine arbitrario** per tutti gli eventi nel sistema.

---

# Applicazioni

## Applicazione degli Orologi di Lamport

Gli **orologi di Lamport** sono utilizzati per garantire un **ordinamento totale** degli eventi in un sistema distribuito. Una loro applicazione classica è nei **sistemi di gestione delle transazioni distribuite**, dove è necessario stabilire un ordine tra operazioni concorrenti per mantenere la coerenza dei dati.

#### Esempio:

In un database distribuito, due transazioni che aggiornano lo stesso dato devono essere ordinate per evitare conflitti. Utilizzando gli orologi di Lamport, ogni operazione può essere assegnata un timestamp logico per stabilire un ordine globale, garantendo che le modifiche siano applicate in modo coerente.

---

## Applicazione del Total Ordering

**Total ordering** garantisce che tutti i processi in un sistema distribuito vedano gli eventi nello stesso ordine, indipendentemente da dove gli eventi siano generati. Un'applicazione pratica è nei **sistemi di replica**, come in un servizio di chat distribuita.

#### Esempio:

In un'applicazione di messaggistica istantanea, i messaggi inviati da diversi utenti devono apparire nello stesso ordine per tutti i partecipanti, indipendentemente dalla latenza della rete. Il total ordering assicura che l'ordine dei messaggi sia mantenuto in modo coerente.

---

## Applicazione del Total Ordering Multicast

**Total ordering multicast** è un'estensione del concetto di total ordering specificamente progettata per i sistemi di **multicast**. Qui, i messaggi inviati da un processo devono essere consegnati a tutti i destinatari nello stesso ordine.

#### Esempio:

In un sistema di replica consistente, come Apache Kafka o sistemi di file distribuiti (es. Google File System), i messaggi relativi agli aggiornamenti devono essere consegnati nello stesso ordine a tutte le repliche per mantenere la coerenza.

**Differenza tra Total Ordering e Total Ordering Multicast**:

- **Total Ordering** si applica a qualsiasi insieme di eventi o messaggi in un sistema distribuito, garantendo che tutti i processi vedano un unico ordine globale.
- **Total Ordering Multicast** si concentra esclusivamente sui messaggi multicast, garantendo che i destinatari di uno specifico gruppo multicast ricevano i messaggi nello stesso ordine.

---

## Applicazione degli Orologi Vettoriali

Gli **orologi vettoriali** sono usati per catturare le relazioni di **causalità** tra gli eventi in un sistema distribuito. A differenza degli orologi di Lamport, gli orologi vettoriali possono determinare se due eventi sono **contemporanei**, cioè non hanno una relazione causale.

#### Esempio:

In un sistema di versionamento distribuito, come Git, gli orologi vettoriali possono essere utilizzati per tracciare le versioni dei file modificate da utenti diversi. Questo permette di rilevare conflitti tra modifiche concorrenti e di risolverli in modo appropriato.

---

### Riassunto delle Applicazioni

| **Concetto**             | **Applicazione**                                                                            |
| ------------------------ | ------------------------------------------------------------------------------------------- |
| Orologi di Lamport       | Ordinamento totale delle operazioni nei sistemi distribuiti (es. gestione transazioni).     |
| Total Ordering           | Coerenza nei sistemi replicati (es. chat distribuite, applicazioni di log).                 |
| Total Ordering Multicast | Ordinamento coerente nei sistemi multicast (es. aggiornamenti distribuiti in Apache Kafka). |
| Orologi vettoriali       | Rilevamento della causalità negli eventi (es. versionamento distribuito).                   |

# Coordination Algorithm
Nei sistemi distribuiti, il coordinamento tra più processi è fondamentale per garantire un corretto utilizzo delle risorse e un'esecuzione ordinata. Gli **algoritmi di coordinamento** svolgono un ruolo fondamentale per ottenere la **sincronizzazione**, la **mutua esclusione**, l'**elezione del leader** e il **consenso tra i processi**. Questi algoritmi **consentono** ai **processi** di **collaborare** in **modo efficiente**, **mantenere** la **coerenza** e **prendere decisioni collettive** in un ambiente distribuito.

### Mutua Esclusione
La mutua esclusione garantisce l'accesso esclusivo alle risorse condivise da parte dei processi. Gli algoritmi principali includono:
- **Basato su Token**: Un token circola tra i processi, consentendo l'accesso alla risorsa solo al possessore del token.
- **Basato su Permessi**: I processi richiedono e ottengono permessi da un gestore centrale o dai propri pari per accedere alla risorsa.
    - **Centralizzato**: Un gestore centrale controlla l'accesso alle risorse condivise.
    - **Distribuito (Decentralizzato)**: Gli algoritmi decentralizzati, come quelli basati su orologi di Lamport, gestiscono l'accesso usando un protocollo di accordo tra i processi.

### Algoritmo di Mutua Esclusione a Anello (Token Ring)
- Organizza i processi in un anello virtuale dove un token circola.
- Per accedere alla risorsa, un processo deve possedere il token.
- Vantaggi: Minimo overhead di comunicazione, efficace in reti affidabili.
- Svantaggi: Problemi in reti instabili, rischio di perdita del token.

### Centralized Mutual Exclusion (Permission-Based)

**Descrizione**  
Un singolo gestore centrale (denotato come **C**) è responsabile della gestione delle richieste per accedere a una risorsa condivisa. Questo processo funziona come segue:
1. Quando un processo **P** vuole accedere a una risorsa, invia una **richiesta** al gestore centrale.
2. Il gestore centrale tiene traccia dello stato della risorsa:
   - Se la risorsa è **libera**, invia un **permesso** al processo richiedente.
   - Se la risorsa è **occupata**, mette in coda la richiesta e risponde solo quando la risorsa diventa disponibile.
3. Quando il processo **P** termina l'uso della risorsa, invia un **rilascio** al gestore centrale, che assegna la risorsa al prossimo processo in coda.

**Vantaggi**:
- **Semplicità**: La logica è concentrata nel gestore centrale.
- **Efficienza**: Solo tre messaggi per accesso (richiesta, permesso, rilascio).

**Svantaggi**:
- **Single Point of Failure**: Se il gestore centrale fallisce, l'intero sistema si blocca.
- **Collo di bottiglia**: Il gestore può diventare un collo di bottiglia con molte richieste.

---

### Decentralized Mutual Exclusion (Permission-Based)

**Descrizione**  
Questo algoritmo utilizza gli **orologi logici di Lamport** per garantire un ordine totale delle richieste:
1. Quando un processo vuole accedere a una risorsa, invia un **messaggio di richiesta** (contenente il proprio timestamp) a tutti gli altri processi, inclusa una copia a se stesso.
2. Ogni processo che riceve una richiesta:
   - Risponde immediatamente se non sta utilizzando la risorsa e non ha una richiesta concorrente con un timestamp più basso.
   - Ritarda la risposta se sta già utilizzando la risorsa o se ha una richiesta concorrente con timestamp inferiore.
3. Il processo richiedente può accedere alla risorsa solo dopo aver ricevuto una **risposta positiva da tutti** i processi.

**Vantaggi**:
- **Nessun token necessario**: Non c'è rischio di perdita del token.
- **Distribuzione del carico**: Non esiste un singolo punto di fallimento.

**Svantaggi**:
- **Overhead elevato**: Ogni richiesta richiede **2(n-1)** messaggi (n-1 richieste e n-1 risposte).
- **Latenza maggiore** rispetto agli algoritmi token-based.
- **Rischio di deadlock o starvation** in caso di errori di comunicazione o processi malfunzionanti.

---

### Elezione del Leader
L'elezione determina un coordinatore o leader tra i processi attivi. Algoritmi comuni sono:
- **Bully Algorithm**: I processi con id più alti dominano l'elezione, con rinuncia da parte dei processi meno potenti.
- **Ring Algorithm**: Usa un anello logico per eleggere il leader, inoltrando messaggi tra i processi fino a determinare il vincitore.

---

### Consenso
Il consenso richiede che tutti i processi concordino su un valore comune. È fondamentale per decisioni collettive e include il problema della mutua esclusione e dell'elezione del leader come casi particolari.

---

### Prestazioni degli Algoritmi di Coordinamento
- **Complessità dei messaggi**: Si riferisce al numero di messaggi scambiati tra i processi durante l'esecuzione dell'algoritmo.
- **Complessità temporale** (o complessità computazionale): Misura il tempo richiesto per eseguire l'algoritmo in relazione alla dimensione del sistema (numero di processi, nodi o risorse).
- **Complessità spaziale**: Rappresenta la quantità di memoria necessaria per eseguire l'algoritmo, inclusi i dati di stato e le strutture ausiliarie.
- **Resilienza ai guasti**: Indica la capacità dell'algoritmo di continuare a funzionare correttamente nonostante guasti di processi o della rete (es. crash di nodi, perdita di messaggi).
- Scalabilità: Rappresenta la capacità dell'algoritmo di mantenere buone prestazioni man mano che il numero di processi o risorse cresce.
- Latency (latenza): Misura il tempo che intercorre tra l'invio di una richiesta e la sua risposta.
- Fairness (Equità): Riguarda la distribuzione equa delle risorse o dei diritti di accesso tra i processi.
- **Overhead**: Indica il carico extra imposto dall'algoritmo sui processi, sia in termini di calcolo che di comunicazione.
- Robustezza: La capacità dell'algoritmo di gestire situazioni impreviste o eccezionali, come messaggi duplicati, timeout, o cambiamenti dinamici nella topologia della rete.
- **Convergenza**: Per algoritmi come quelli di consenso, la convergenza indica il tempo necessario per raggiungere uno stato stabile in cui tutti i processi concordano su una decisione.

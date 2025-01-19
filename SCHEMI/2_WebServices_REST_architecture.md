## Richardson Maturity Model

Il **Richardson Maturity Model** (RMM) è un modello ideato da **Leonard Richardson** per classificare le API web in base al livello di aderenza ai principi REST. Questo modello suddivide l'evoluzione delle API in quattro livelli (da 0 a 3), valutando quanto siano RESTful.

L'obiettivo principale è migliorare l'interoperabilità e l'efficienza delle API seguendo i principi fondamentali di REST.

---

### Livelli del Richardson Maturity Model:

#### **Livello 0: The Swamp of POX**

- **Descrizione**: API che utilizza un singolo endpoint per tutte le operazioni, spesso con richieste POST.
- **Caratteristiche**:
  - Non utilizza concetti REST.
  - I dati sono spesso inviati in formati generici come XML o JSON.
  - Non sfrutta metodi HTTP semantici (GET, POST, PUT, DELETE).
- **Esempio**:
  - Endpoint: `/api`
  - Richiesta: `POST` con un payload che specifica l'azione (ad esempio, "createUser").

---

#### **Livello 1: Risorse**

- **Descrizione**: Introduzione delle risorse con endpoint distinti per ciascun tipo di entità.
- **Caratteristiche**:
  - Ogni risorsa è identificata da un URL univoco.
  - Non c'è ancora un uso semantico dei metodi HTTP.
- **Esempio**:
  - Endpoint: `/users`, `/products`
  - Richiesta: `POST /users/create`, `POST /products/delete`.

---

#### **Livello 2: Verbi HTTP**

- **Descrizione**: Utilizzo corretto dei metodi HTTP (GET, POST, PUT, DELETE) per interagire con le risorse.
- **Caratteristiche**:
  - L'API è più RESTful.
  - I metodi HTTP riflettono le operazioni CRUD:
    - **GET** per leggere.
    - **POST** per creare.
    - **PUT** o **PATCH** per aggiornare.
    - **DELETE** per eliminare.
- **Esempio**:
  - Endpoint: `/users/1`
  - Operazioni:
    - `GET /users/1` → Ottieni i dettagli dell'utente con ID 1.
    - `PUT /users/1` → Aggiorna l'utente con ID 1.
    - `DELETE /users/1` → Elimina l'utente con ID 1.

---

#### **Livello 3: Hypermedia Controls (HATEOAS)**

- **Descrizione**: Le risorse includono collegamenti ipertestuali (Hypermedia as the Engine of Application State - HATEOAS), che guidano i client su come interagire con l'API.
- **Caratteristiche**:
  - Le risposte dell'API includono link che il client può seguire per accedere a risorse correlate o eseguire altre azioni.
  - Questo rende l'API auto-descrittiva e facile da navigare.
- **Esempio**:
  - Risposta di `GET /users/1`:
    ```json
    {
      "id": 1,
      "name": "Mario Rossi",
      "links": {
        "self": "/users/1",
        "update": "/users/1",
        "delete": "/users/1",
        "orders": "/users/1/orders"
      }
    }
    ```

---

### Riepilogo del RMM:

| **Livello** | **Caratteristiche**                              | **Principi RESTful seguiti** |
| ----------- | ------------------------------------------------ | ---------------------------- |
| **0**       | Endpoint unico, nessun uso di risorse            | Nessuno                      |
| **1**       | Risorse distinte, identificabili con URL univoci | Identificazione di risorse   |
| **2**       | Uso corretto dei metodi HTTP                     | Metodi HTTP semantici        |
| **3**       | Hypermedia Controls (HATEOAS)                    | Navigazione tramite link     |

---

### Vantaggi di seguire il modello:

1. **Standardizzazione**: Ogni livello migliora la comprensione e l'uso corretto delle API.
2. **Evoluzione graduale**: Le API possono progredire attraverso i livelli con miglioramenti incrementali.
3. **Interoperabilità**: Un'API conforme al livello 3 è altamente auto-descrittiva e interattiva.

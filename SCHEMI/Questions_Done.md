# Distributed Systems Programming

## Questions from past years

7. SOAP vs REST
8. differenza tra Lamport clock e Vector clock
9. Consistency models, con esempi, e come replicare gli status codes di HTTP usando gRPC
10. Validation Schema limitations
11. Principi base quando si esegue il design di un DS con MQTT

12. what parameters can be negotiated while performing the MQTT handshake
13. websocket vs tcp socket from a security standpoint
14. Close procedure Websocket
15. TCP/IP socket vs Websocket
16. Confronto tra architetture client-server e P2P, cosa caratterizza gRPC e per cosa è principalmente impiegato
17. Algoritmi per l'elezione di un coordinator, perché esistono e come funzionano. Relazione trawebsockets e http, proprietà di sicurezza dei websockets
18. Differenza tra Websocket e TCP/IP socket. Perché Websocket è reliable?
19. Differenze fra clock virtuali e clock fisici
20. How failures can be detected in WebSockets
21. Election algorithms, which assumptions were made to define the algorithms and what you can do if the assumptions cannot be made
22. C/s vs p2p
23. how to obtain fault tolerance in a c/s architecture (process groups)
24. what dependencies do in json schemas (with a schema to comment)
25. distribution transparency, what it is and techniques to achieve it
26. Data replication and consistency models
27. mqtt: who are the clients and who acts as the server part, what happens if a message is delivered to the broker and the client is disconnected (retained value and qos 2)
28. Explain what CAP theorem states and why it isn't exactly correct
29. What is Ping/pong mechanism in WebSockets and what is it used for
30. How to detect crashes in distributed systems
31. KeepAlive mechanism
32. Election Algorithms and how to measure their efficiency
33. what is idempotence and how POST and PUT requests differ in this property
34. QoS in mqtt, why in the QoS 1 the semantic is "at least one"
35. Explain the bully algorithm
36. difference between lamport and vector clocks
37. why in MQTT QoS 2 we need 3 acknowledgment messages
38. when aren't you able to detect errors in websockets connections?
39. why is http/2 very good in environment like datacenters?
40. cap theorem (he also asked me to explain what I can do in case of dynamic system that change the combination of Consistency, Availability and Partition Tolerance based on events)
41. Fault tolerance in incorrect response cases
42. gRPC and http2 channels
43. which of the apis that I’ve implemented could be turned into a PUT operation (talk about idempotence, and that POST operations imply that there could be duplicate objects being posted etc. whereas PUT operations only updates the same instance), how would I implement it (if then header)
44. mutual exclusion methods (token-based, permission-based)
45. what are the differences between websocket and tcp/ip socket
46. differences between C/S and P2P in general and with a focus on the security point of view
47. idempotent operations should be preferred in RPC and why it's important to use them even if we have a reliable transport channel like TCP
48. differences between http1.1 and http2 and 3 and how the last will in MQTT works and how it can be used
49. why isn’t tcp suitable enough to detect peer process crashes
50. advantages of websockets over TCP sockets
51. Which mechanism to end a connection do websockets have that TCP does not
52. how a broker in mqtt can know when a client disconnects and what's happens next
53. Tell me about CAP Theorem and how to be network partition tolerant
54. Tell me about a RPC stub, what is the purpose and which generation from and IDL template you may exploit: static or dynamic
55. what is stub in RPC and difference between stub generation in JS and Java
56. qos in MQTT
57. CAP theorem and how we can overcome its limitations
58. Vector Clocks, he gave me 2 tuples asking whether they were causally related or not

59. Quando e perché usare gli stream gRPC dal punto di vista del programmatore
    Usare gli stream gRPC quando si ha bisogno di comunicazione continua o frequente tra client e server, come nel caso di aggiornamenti in tempo reale, trasferimenti di dati grandi o interazioni bidirezionali. È ideale per ridurre latenza e overhead rispetto a richieste discrete.

60. security in rpc
    La sicurezza in RPC riguarda l'autenticazione, la cifratura dei dati (per la confidenzialità), l'integrità dei messaggi (per prevenire modifiche non autorizzate), e la protezione contro attacchi come man-in-the-middle. Tecnologie come gRPC offrono funzionalità integrate come SSL/TLS per proteggere la comunicazione e metodi di autenticazione tramite certificati.

## Keepalive

### Come Funziona il Keepalive

    - Invio di Pacchetti Keepalive:
        Un sistema (il client o il server) invia periodicamente piccoli pacchetti chiamati keepalive messages all'altra parte della connessione.
        Questi pacchetti non trasportano dati significativi, ma servono esclusivamente per verificare che la connessione sia ancora attiva.

    - Ricezione e Risposta:
        L'altra parte della connessione risponde con un acknowledgment (ACK) per confermare che la connessione è ancora valida.
        In caso di mancata risposta entro un certo intervallo di tempo, il sistema considererà la connessione interrotta.

    - Timeout e Retry:
        Se non viene ricevuta una risposta, il sistema può tentare di inviare nuovamente il pacchetto keepalive.
        Dopo un certo numero di tentativi falliti, la connessione viene considerata non più valida e chiusa.

### Come il Keepalive rileva i Process Crash

    - Nessuna Risposta al Keepalive:
        Se un processo si interrompe o va in crash, non risponderà ai messaggi keepalive inviati da un'altra entità (client o server).
        Il mancato invio di un acknowledgment entro un intervallo di tempo configurato (timeout) farà scattare un allarme sulla connessione.

    - Timeout della Connessione:
        Dopo un numero configurato di tentativi falliti (retry count), il sistema che ha inviato i keepalive può dedurre che il processo remoto non è più operativo o che la connessione è stata interrotta.

### Limitazioni nel Rilevamento dei Crash

- Il keepalive rileva indirettamente il crash di un processo, in quanto verifica la disponibilità della connessione. Tuttavia:
  - Se il processo è attivo ma bloccato (ad esempio in un deadlock o in uno stato di loop infinito), potrebbe non rispondere ai keepalive, inducendo comunque il sistema a considerarlo non operativo.
  - Se un middleware o un load balancer è presente, potrebbe rispondere ai keepalive al posto del processo, impedendo il rilevamento del crash reale.

# Distributed Systems Programming

## Questions from past years

1. Separazione dei ruoli (?)
2. Vantaggi e svantaggi di architetture multi-tier.
3. Perché gRPC usa HTTP/2?
4. A me ha chiesto rpc, nello specifico cosa sono e cosa fanno gli stubs, ed mqtt, con domanda sul retain
5. A me ha chiesto cosa è il consistency model e cosa è l’election protocol
6. He asked me CAP theorem and types of application which take some advantages from websockets and the difference with TCP/IP socket.
7. SOAP vs REST
8. Un esempio in cui ha senso usare un election algorithm
9. Comunque mi ha chiesto l'handshake di mqtt e la differenza tra consistency model data-centric e client-centric
10. A me tutte le novità di http 2 e la differenza tra Lamport clock e Vector clock
11. COMET (?)
12. Long polling (?)
13. differenze tra http2 e http1; Differenze (con relativi pro e contro) tra architetture client server e p2p
14. Richardson maturity model + REST
15. Consistency model  + choose 1 and explain
16. what is the advantage of gRPC over REST
17. what is the streaming functionality of HTTP/2
18. what parameters can be negotiated while performing the MQTT handshake
19. what is the "retained" flag of MQTT
20. Proprietà rest (stateless and self-describe)
21. Principi base quando si esegue il design di un DS con MQTT
22. scaling out vs scaling up (with real  life example)
23. how to achieve mutual exclusion
24. how does websockets protocol work (what does it mean that it's compatible/can run side by side with http)
25. scaling verticale delle architetture client sever
26. Lamport clock
27. websocket vs tcp socket from a security standpoint
28. mutual exclusion, bully and ring
29. MQTT testament
30. Bully Algorithm
31. Close procedure Websocket
32. Validation Schema limitations
33. TCP/IP socket vs Websocket
34. Consistency models, con esempi, e come replicare gli status codes di HTTP usando gRPC
35. Confronto tra architetture client-server e P2P, cosa caratterizza gRPC e per cosa è principalmente impiegato
36. Algoritmi per l'elezione di un coordinator, perché esistono e come funzionano. Relazione trawebsockets e http, proprietà di sicurezza dei websockets
37. Differenza tra Websocket e TCP/IP socket. Perché Websocket è reliable?
38. Differenze fra clock virtuali e clock fisici
39. How failures can be detected in WebSockets
40. Election algorithms, which assumptions were made to define the algorithms and what you can do if the assumptions cannot be made
41. C/s vs p2p
42. how to obtain fault tolerance in a c/s architecture (process groups)
43. what dependencies do in json schemas (with a schema to comment)
44. distribution transparency, what it is and techniques to achieve it
45. Data replication and consistency models
46. QoS 2 in MQTT, what are the 4 messages exchanged
47. mqtt: who are the clients and who acts as the server part, what happens if a message is delivered to the broker and the client is disconnected (retained value and qos 2)
48. grpc streaming: how it works and why it is used
49. Explain what CAP theorem states and why it isn't exactly correct
50. What is Ping/pong mechanism in WebSockets and what is it used for
51. http/2 uses streams, describe it
52. difference between lamport and vector clock
53. multiplexing in http/2
54. How to detect crashes in distributed systems
55. KeepAlive mechanism
56. Validation Schema, how to use the fields :OneOf , allOf...
57. Election Algorithms and how to measure their efficiency
58. what is idempotence and how POST and PUT requests differ in this property
59. QoS in mqtt, why in the QoS 1 the semantic is "at least one"
60. Explain the bully algorithm
61. difference between lamport and vector clocks
62. why in MQTT QoS 2 we need 3 acknowledgment messages
63. when aren't you able to detect errors in websockets connections?
64. why is http/2 very good in environment like datacenters?
65. cap theorem (he also asked me to explain what I can do in case of dynamic system that change the combination of Consistency, Availability and Partition Tolerance based on events)
66. Fault tolerance in incorrect response cases
67. GRPC and http2 channels
68. which of the apis that I’ve implemented could be turned into a PUT operation (talk about idempotence, and that POST operations imply that there could be duplicate objects being posted etc. whereas PUT operations only updates the same instance), how would I implement it (if then header) 
69. mutual exclusion methods (token-based, permission-based)
70. what are the differences between websocket and tcp/ip socket
71. differences between C/S and P2P in general and with a focus on the security point of view
72. idempotent operations should be preferred in RPC and why it's important to use them even if we have a reliable transport channel like TCP
73. differences between http1.1 and http2 and 3 and how the last will in MQTT works and how it can be used
74. HTTP2 STREAM
75. MUTUAL EXCLUSION and how works
76. differences between scale out/up
77. why isn’t tcp suitable enough to detect peer process crashes
78. advantages of websockets over TCP sockets
79. Which mechanism to end a connection do websockets have that TCP does not
80. scaling out, in particular geography scaling
81. how a broker in mqtt can know when a client disconnects and what's happens next
82. security in rpc
83. consistency model
84. CAP theorem
85. Lamport clock algorithm
86. Which creteria do we take into account when evaluate algorithms performance (Coordination algorithms).
87. MQTT last will
88. Tell me about CAP Theorem and how to be network partition tolerant
89. Tell me about a RPC stub, what is the purpose and which generation from and IDL template  you may exploit: static or dynamic
90. what is stub in RPC and différence between stub génération in JS and Java 
91. qos in MQTT
92. Lamport clocks
93. CAP theorem and how we can overcome its limitations
94. grpc streaming
95. bully
96. difference between C/S and P2P
97. what can you express with protobuf and what the stream option do?
98. differences between scale up and scale out
99. consistency models + examples
100. MQTT handshake, explain a field of my choice in the request
101. MQTT retained flag and why broker manages only one retained message for each topic
102. Vector Clocks, he gave me 2 tuples asking whether they were causally related or not

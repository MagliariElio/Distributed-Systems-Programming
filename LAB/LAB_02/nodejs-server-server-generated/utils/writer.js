var ResponsePayload = function(code, payload) {
  this.code = code;
  this.payload = payload;
}

exports.respondWithCode = function(code, payload) {
  return new ResponsePayload(code, payload);
}

var writeJson = exports.writeJson = function(response, arg1, arg2) {
  var code;
  var payload;

  // Se il primo argomento è una ResponsePayload, chiama ricorsivamente writeJson
  if(arg1 && arg1 instanceof ResponsePayload) {
    writeJson(response, arg1.payload, arg1.code);
    return;
  }

  // Impostare il codice di stato se è passato come secondo argomento
  if(arg2 && Number.isInteger(arg2)) {
    code = arg2;
  } else {
    if(arg1 && Number.isInteger(arg1)) {
      code = arg1;
    }
  }

  // Impostare il payload se disponibile
  if(code && arg1) {
    payload = arg1;
  } else if(arg1) {
    payload = arg1;
  }

  // Se non viene fornito un codice, usare 200 come predefinito
  if(!code) {
    code = 200;
  }

  // Assicurarsi che il payload sia in formato JSON
  if(typeof payload === 'object') {
    payload = JSON.stringify(payload, null, 2);
  }

  // Rispondere con Express, usando res.status().json() invece di writeHead
  response.status(code).json(JSON.parse(payload)); // Converting back to object if needed
}

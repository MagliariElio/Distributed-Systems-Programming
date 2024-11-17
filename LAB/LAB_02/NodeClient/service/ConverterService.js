

const PROTO_PATH = __dirname + '/../proto/conversion.proto';
const REMOTE_URL = "localhost:50051";
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const fs = require('fs');

let packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const conversionProto = grpc.loadPackageDefinition(packageDefinition).conversion;
let client = new conversionProto.Converter(REMOTE_URL, grpc.credentials.createInsecure());

/**
 * Convert an image from one type to another via gRPC.
 * 
 * @param {string} pathOriginFile - The path to the original image file.
 * @param {string} pathTargetFile - The path where the converted file will be saved.
 * @param {string} originType - The MIME type of the original image (e.g., 'image/jpg').
 * @param {string} targetType - The MIME type of the target image (e.g., 'image/png').
 * @returns {Promise} - Resolves when the conversion is done, or rejects with an error.
 */
exports.convertImage = async function convertImage(pathOriginFile, pathTargetFile, originType, targetType) {
    return new Promise((resolve, reject) => {

        // Open the gRPC call with the gRPC server
        let call = client.fileConvert();

        // Create a write stream for the converted file
        const wstream = fs.createWriteStream(pathTargetFile);

        let success = false;
        let error = '';

        // Handle incoming data (both meta and file chunks)
        call.on('data', (data) => {
            // Handle meta data (success or failure)
            if (data.meta !== undefined) {
                success = data.meta.success;

                if (!success) {
                    error = data.meta.error;
                    reject(new Error(`Conversion failed: ${error}`)); // Reject the promise if the conversion failed
                    call.end();  // Close the stream if an error occurs
                }
            }

            // Handle file chunk data (write to the target file)
            if (data.file !== undefined) {
                wstream.write(data.file);
            }
        });

        // Once the gRPC stream ends, close the write stream
        call.on('end', () => {
            wstream.end();
            resolve(); // Resolve the promise when the stream ends successfully
        });

        // Send the meta data (file types) to the server
        call.write({
            meta: {
                file_type_origin: originType,
                file_type_target: targetType
            }
        });

        // Send the file in chunks (using a read stream)
        const maxChunkSize = 1024; // 1KB chunks
        const imageDataStream = fs.createReadStream(pathOriginFile, { highWaterMark: maxChunkSize });

        imageDataStream.on('data', (chunk) => {
            call.write({ file: chunk });
        });

        // When all chunks are sent, close the stream
        imageDataStream.on('end', () => {
            call.end();
        });

        // Handle errors in the file read stream
        imageDataStream.on('error', (err) => {
            reject(new Error(`Error reading the file: ${err.message}`)); // Reject the promise if there's a file read error
            call.end();  // Close the gRPC call on error
        });

        // Ensure the promise is rejected if there's a gRPC call error
        call.on('error', (err) => {
            reject(new Error(`gRPC call error: ${err.message}`));
        });
    });
}
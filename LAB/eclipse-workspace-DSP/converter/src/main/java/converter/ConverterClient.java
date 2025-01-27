package converter;

import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.File;
import java.io.IOException;
import java.net.Socket;
import java.net.UnknownHostException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

public class ConverterClient {
	public ConverterClient(String server, int port, String filePath, String sourceFormat, String targetFormat)
			throws UnknownHostException, IOException {
		File file = new File(filePath);
		if (!file.exists() || !file.isFile()) {
			System.err.println("Il file specificato non esiste: " + filePath);
			return;
		}

		try (Socket socket = new Socket(server, port)) {
			DataOutputStream output = new DataOutputStream(socket.getOutputStream());
			DataInputStream input = new DataInputStream(socket.getInputStream());

			System.out.println("Connected to server.");

			// Invio del formato sorgente e del formato target
			output.write(sourceFormat.getBytes("ASCII"));
			output.write(targetFormat.getBytes("ASCII"));

			// Creiamo un array di 4 byte per memorizzare il numero
			byte[] fileData = Files.readAllBytes(file.toPath());
			int fileLengthOriginal = fileData.length;
			byte[] lengthBytes = new byte[4];

			// Convertiamo la lunghezza in ordine di byte di rete (big-endian)
			lengthBytes[0] = (byte) ((fileLengthOriginal >> 24) & 0xFF); // Byte più significativo
			lengthBytes[1] = (byte) ((fileLengthOriginal >> 16) & 0xFF);
			lengthBytes[2] = (byte) ((fileLengthOriginal >> 8) & 0xFF);
			lengthBytes[3] = (byte) (fileLengthOriginal & 0xFF); // Byte meno significativo

			// Mostriamo i byte generati
			System.out.println("Lunghezza in byte (big-endian):");
			for (byte b : lengthBytes) {
				System.out.printf("0x%02X ", b);
			}
			System.out.println();

			output.write(lengthBytes);
			output.write(fileData);

			byte responseCode = input.readByte();
			if (responseCode == '0') {
				// Operazione riuscita: leggi il file convertito
				int fileLength = input.readInt();
				byte[] convertedData = new byte[fileLength];
				input.readFully(convertedData);

				// Salvataggio del file convertito
				File directory = new File("./image");
				if (!directory.exists()) {
					directory.mkdir();
				}

				Path outputPath = Paths.get("image/converted." + targetFormat);
				Files.write(outputPath, convertedData);
				System.out.println("File convertito salvato in: " + outputPath.toAbsolutePath());

			} else if (responseCode == '1' || responseCode == '2') {
				// Errore: leggi il messaggio di errore
				int errorMessageLength = input.readInt();
				byte[] errorMessageBytes = new byte[errorMessageLength];
				input.readFully(errorMessageBytes);
				String errorMessage = new String(errorMessageBytes, "ASCII");
				System.err.println("Errore dal server (Codice: " + responseCode + "): " + errorMessage);
			} else {
				System.err.println("Risposta sconosciuta dal server: " + responseCode);
			}

		} catch (IOException e) {
			System.err.println("Errore durante la comunicazione con il server: " + e.getMessage());
		}

	}

	public static void main(String[] args) {
		String sourceFormat = "JPG";
		String targetFormat = "PNG";
		String filePath = "IMAGE PATH";
		String serverAddress = "localhost";
		int port = 2001;

		try {
			System.out.println("server: " + serverAddress + " Port: " + port);
			new ConverterClient(serverAddress, port, filePath, sourceFormat, targetFormat);
		} catch (NumberFormatException e) {
			throw new IllegalArgumentException("Port number must be an integer");
		} catch (UnknownHostException e) {
			System.err.println("Unknown host");
		} catch (IOException e) {
			System.err.println("I/O Exception");
			e.printStackTrace();
		}
	}
}

package converter;

import java.awt.image.BufferedImage;
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.File;
import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.imageio.ImageIO;

public class ConverterServer {
	Logger logger;

	public ConverterServer(int port, Logger logger) throws IOException {

		try (ServerSocket serverSocket = new ServerSocket(port)) {
			System.out.println("Server in ascolto sulla porta " + port);

			while (true) {
				Socket clientSocket = serverSocket.accept();
				System.out.println("Connessione accettata: " + clientSocket.getInetAddress());
				new Thread(new ClientHandler(clientSocket, logger)).start();
			}
		} catch (IOException e) {
			System.err.println("Errore del server: " + e.getMessage());
		}
	}

	public static void main(String[] args) {
		Logger logger = Logger.getLogger("it.polito.dsp.echo.TcpEchoServer0");
		int port = 2001;
		try {
			new ConverterServer(port, logger);
		} catch (Exception e) {
			logger.log(Level.SEVERE, "Server error", e);
		}

	}
}

class ClientHandler implements Runnable {
	private Socket clientSocket;
	private Logger logger;

	public ClientHandler(Socket clientSocket, Logger logger) {
		this.clientSocket = clientSocket;
		this.logger = logger;
	}

	@Override
	public void run() {
		DataOutputStream output = null;
		try (DataInputStream input = new DataInputStream(clientSocket.getInputStream())) {

			try {
				output = new DataOutputStream(clientSocket.getOutputStream());

				// Legge i parametri inviati dal client
				byte[] sourceFormatBytes = new byte[3];
				input.readFully(sourceFormatBytes);
				String sourceFormat = new String(sourceFormatBytes, "ASCII");

				byte[] targetFormatBytes = new byte[3];
				input.readFully(targetFormatBytes);
				String targetFormat = new String(targetFormatBytes, "ASCII");

				int fileLength = input.readInt();
				byte[] fileData = new byte[fileLength];
				input.readFully(fileData);

				// Salva il file temporaneamente
				Path tempFile = Files.createTempFile("image", "." + sourceFormat);
				Files.write(tempFile, fileData);

				// Conversione del file immagine
				Path convertedFile = Files.createTempFile("image-converted", "." + targetFormat);
				convertImage(tempFile.toFile(), convertedFile.toFile(), sourceFormat, targetFormat);

				// Invia il file convertito al client
				byte[] convertedData = Files.readAllBytes(convertedFile);
				output.writeByte('0'); // success
				output.writeInt(convertedData.length);
				output.write(convertedData);

				// Pulisce i file temporanei
				Files.deleteIfExists(tempFile);
				Files.deleteIfExists(convertedFile);

				System.out.println(sourceFormat);
				System.out.println(targetFormat);
				System.out.println(fileLength);

			} catch (IllegalArgumentException e) {
				sendErrorResponse(output, '1', e.getMessage());
			}
		} catch (Exception e) {
			try {
				if (output != null) {
					// Invio dell'errore al client
					sendErrorResponse(output, '2', e.getMessage());
				}
			} catch (Exception eio) {
				logger.log(Level.SEVERE, "Errore nell'invio della risposta", eio);
			}
		} finally {
			try {
				clientSocket.close();
			} catch (IOException e) {
				logger.log(Level.SEVERE, "Errore nella chiusura del socket", e);
			}
		}
	}

	private void convertImage(File inputFile, File outputFile, String sourceFormat, String targetFormat)
			throws IOException {
		if (!sourceFormat.matches("PNG|JPG|GIF") || !targetFormat.matches("PNG|JPG|GIF")) {
			logger.log(Level.INFO, "media type not supported!");
			throw new IOException("Formato immagine non supportato.");
		}

		BufferedImage image = ImageIO.read(inputFile);
		if (image != null) {
			ImageIO.write(image, sourceFormat, outputFile);
		} else {
			throw new IOException("Formato immagine non supportato.");
		}
	}

	private void sendErrorResponse(DataOutputStream output, char errorCode, String errorMessage) throws IOException {
		output.writeByte(errorCode); // Codice errore ('1' o '2')
		byte[] errorBytes = errorMessage.getBytes("ASCII");
		output.writeInt(errorBytes.length); // Lunghezza del messaggio
		output.write(errorBytes); // Contenuto del messaggio
	}
}

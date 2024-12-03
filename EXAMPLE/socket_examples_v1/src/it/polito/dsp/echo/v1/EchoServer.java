package it.polito.dsp.echo.v1;

import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;
import java.net.SocketAddress;
import java.util.logging.Level;
import java.util.logging.Logger;

public class EchoServer implements Runnable {
	EchoService service;
	ServerSocket socket;
	Logger logger;

	public EchoServer(ServerSocket socket, Logger logger) {
		this.socket = socket;
		this.logger = logger;
	}

	@Override
	public void run() {
		logger.log(Level.INFO, "Thread ready ");
		Socket s = null;
		try {
			while (true) {
				s = socket.accept();
				SocketAddress remoteAddress = s.getRemoteSocketAddress();		
				logger.log(Level.INFO, "Accepted connection from "+remoteAddress);
				service = new EchoService(s, logger);
				try {
					service.service();
				} catch (Exception e) {
					logger.log(Level.SEVERE, "Could not complete service", e);
				} finally {
					if (s!=null && !s.isClosed())
						try {
							s.close();
						} catch (IOException e) {
							logger.log(Level.SEVERE, "Could not close socket", e);;
						}
				}	
			}
		} catch (Exception e) {
			logger.log(Level.SEVERE, "Accept could not be completed", e);
		}
	}
}

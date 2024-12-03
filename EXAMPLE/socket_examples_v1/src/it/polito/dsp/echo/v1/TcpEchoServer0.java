package it.polito.dsp.echo.v1;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.ServerSocket;
import java.net.Socket;
import java.net.SocketAddress;
import java.util.logging.Level;
import java.util.logging.Logger;

public class TcpEchoServer0 {
	
	private static final int BUFSIZE = 32;
	Logger logger;

	public TcpEchoServer0(int port, Logger logger) throws IOException {
		this.logger = logger;
		
		ServerSocket ss = new ServerSocket(port);
		logger.log(Level.INFO, "Listening to port "+port);
		Socket s=null;
		try {
			while (true) {
				s = ss.accept();
				SocketAddress remoteAddress = s.getRemoteSocketAddress();		
				logger.log(Level.INFO, "Accepted connection from "+remoteAddress);
				try {
					service(s);
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

	private void service(Socket s) throws IOException {
		byte[] rBuf = new byte[BUFSIZE];
		int rsize;
		s.setSoTimeout(5000);
		InputStream in = s.getInputStream();
		OutputStream out = s.getOutputStream();
		while ((rsize = in.read(rBuf)) != -1) {
			out.write(rBuf, 0, rsize);
		}
		s.close();
	}

	public static void main(String[] args) {
		Logger logger = Logger.getLogger("it.polito.dsp.echo.TcpEchoServer0");
		if (args.length > 2) {
			logger.log(Level.SEVERE, "Wrong number of parameters");
		} else {
			int port = (args.length == 1) ? Integer.parseInt(args[0]) : 7;
			try {
				new TcpEchoServer0(port, logger);
			} catch (Exception e) {
				logger.log(Level.SEVERE, "Server error", e);
			}
		}
	}

}

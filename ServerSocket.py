import socket 
import wave
import numpy as np
import struct


#***Not the final version this code will be refactored 

#create the socket 
server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

host_machine = socket.gethostname()

port = 12345

#bind the socket to the local host name and a port 
server_socket.bind((host_machine,port))

#let the server socket listen for incoming connections
server_socket.listen(5)


while True:

    #accept connections to allow for requests 
    client_socket, address = server_socket.accept()


    #this is where the query is heard and the wav file should be replaced with a variable containing the string for the wav file 
    #Right now it reads a file and gets the frames and the framerate to be passed to the client 
    wave_file = wave.open('Reminiscing.wav' , 'rb')
    songFrames = wave_file.readframes(wave_file.getnframes())
    sample_rate = wave_file.getframerate()
    audioArray = np.frombuffer(songFrames, dtype=np.int16)

    

    #this is for functionality testing 
    print('Connected successfully to the server socket!!! Fetching Data Now')
    message = str(sample_rate).encode()
    client_socket.sendall(message)
  
    
    chunkSize = 1024

    for index in range(0, len(audioArray) , chunkSize):
        #Send each chunk until the entire array of data has been traversed
        chunk = audioArray[index: index+chunkSize]
        client_socket.send(chunk.tobytes())

   # client_socket.send('What Song Would you Like to Hear?'.encode('ascii'))

    #always close the socket after data is sent 
    server_socket.close()
    
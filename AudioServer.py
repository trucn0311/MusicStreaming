import wave 
import socket
import numpy as np


class AudioServer:

    def __init__(self):
        self.server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        host_machine = socket.gethostname()
        port = 8888
        self.server_socket.bind((host_machine,port))
        self.server_socket.listen(10)
        

    def acceptClient(self):
        client_socket, client_address = self.server_socket.accept()
        return client_socket , client_address


    def getSongRequest(self):

        while True: 
            try:  
                client_request_bytes = self.server_socket.recv(1024)
                request_string = client_request_bytes.decode().rstrip('\x00')

                if len(request_string) < 1024:
                    break

            except Exception as e:
                print('Exception occured:' , e)
       
        return request_string + ".wav"




    def sendSampleRate(self , sample_rate):
        try:
            message = str(sample_rate).encode()
            self.client_socket.sendall(message)
        
        except Exception as e: 
            print('Exception occured:', e)



    def sendAudioData(self , wave_file):
       
        while True:
            try:
                self.client_socket , self.client_address = self.server_socket.acceptClient()

                wave_file_data = wave.open(wave_file , 'rb')
                songFrames = wave_file_data.readframes(wave_file.getnframes())
                sample_rate = wave_file_data.getframerate()

                self.server_socket.sendSampleRate(sample_rate)

                audioArray = np.frombuffer(songFrames , dtype=np.int16)

                chunkSize = 1024

                for index in range(0 , len(audioArray) , chunkSize):
                    chunk = audioArray[index: index + chunkSize]
                    self.client_socket.send(chunk.tobytes())

                self.client_socket.close()
                self.server_socket.close()

            except Exception as e:
                print('Exception occured:' , e) 
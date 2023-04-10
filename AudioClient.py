import wave
import sounddevice as sd
import numpy as np
import socket 



class AudioClient: 

    def __init__(self):
        self.client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        host_machine = socket.gethostname()
        port = 8888
        self.client_socket.connect((host_machine,port))


    def sendRequest(self , song_name):
        request_message = song_name.encode('utf-8')
        self.client_socket.send(request_message)


    def getSampleRate(self):
        sample_rate_message = self.client_socket.recv(1024)
        sr_string = sample_rate_message.decode().rstrip('\x00')
        return int(sr_string)
     

    def get_audio_array(self):

        receivedData = bytearray()

        while True:
            try:
                chunk = self.client_socket.recv(1024)

                if not chunk:
                    break
                receivedData += chunk

            except Exception as e:
                print("Exception occured:" , e)
        
        audioArray = np.frombuffer(receivedData , dtype=np.int16)
        audioArray.reshape((-1 , 2))

        return audioArray


    def playAudio(self, audioArray , sample_rate):
        sd.play(audioArray , sample_rate)
        sd.wait()
        self.client_socket.close()
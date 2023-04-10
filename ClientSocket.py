import socket
import numpy as np
import wave
import sounddevice as sd
import struct 



client_socket = socket.socket(socket.AF_INET , socket.SOCK_STREAM)

host_machine = socket.gethostname()
port = 12345
client_socket.connect((host_machine , port))

#Receive the Sample rate for proper audio playback
sample_rate_message = client_socket.recv(1024)
sr_string = sample_rate_message.decode().rstrip('\x00')
sample_rate = int(sr_string)

#Receive the chunks of data and append them into the byte array 
receivedData = bytearray()
while True:
    chunk = client_socket.recv(1024)

    if not chunk: break
    receivedData += chunk


#frames
#print(len(receivedData))

#store the audio data into a numpy array 
audioArray = np.frombuffer(receivedData , dtype=np.int16)



#this would be when action listening happens but for now ill just play it 
#listen for if the user pauses/plays

#this reshapes the array to have the right amount of rows per channel 
audioArray = audioArray.reshape((-1 , 2))

sd.play(audioArray , sample_rate  )


sd.wait()


client_socket.close()



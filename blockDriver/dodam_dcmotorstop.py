from time import sleep
import sys
import serial
ser = serial.Serial('/dev/ttyUSB0', 38400, timeout=1)
ser.close()
ser.open()


def dcMotorStop():
        checkSum = 0
	packet_buff=[0x23,1,0x83,0]
	for i in range (2,3):
		checkSum ^= packet_buff[i]
	packet_buff[3] = checkSum
	arr = bytearray(packet_buff)
	print ser.write(arr)
	return
	
def	main():
	dcMotorStop()

if __name__	== '__main__':
	main()
from time import sleep
import sys
import serial
ser = serial.Serial('/dev/ttyUSB0', 38400, timeout=1)
ser.close()
ser.open()

def dcMotorSpeed(L1, R1, L2, R2):
	if L1 < -100 : L1 = -100
	if R1 < -100 : R1 = -100
	if L1 > 100 : L1 = 100
	if R1 > 100 : R1 = 100
	
	if L2 < -100 : L2 = -100
	if R2 < -100 : R2 = -100
	if L2 > 100 : L2 = 100
	if R2 > 100 : R2 = 100
	
	if L1 < 0 : L1= 256+L1
	if L2 < 0 : L2= 256+L2
	if R1 < 0 : R1= 256+R1
	if R2 < 0 : R2= 256+R2
	
	checkSum = 0
	packet_buff=[0x23,5,0x82,L1,R1,L2,R2,0]
	for i in range (2,7):
		checkSum ^= packet_buff[i]
	packet_buff[7] = checkSum
	arr = bytearray(packet_buff)
	#print(packet_buff)
	print ser.write(arr)
	return

def	 main(argv):
	postion = [0, 0, 0, 0]
	for i, motor_num in enumerate(argv):
            if i > 0:
                postion[i-1] = int(motor_num)
                print("index: %d: position:%d" % (i, int(motor_num)))
	print(postion)
	dcMotorSpeed(postion[0], postion[1], postion[2], postion[3])

if __name__	== '__main__':
	main(sys.argv)

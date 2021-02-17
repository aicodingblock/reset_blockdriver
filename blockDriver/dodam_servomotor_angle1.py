from time import sleep
import sys
import serial
ser = serial.Serial('/dev/ttyUSB0', 38400, timeout=1)
ser.close()
ser.open()

def servoMotorAngle(pinNo, nAngle, nSpeed):
    if(nAngle<-90) : nAngle = -90
    if(nAngle>90) : nAngle = 90
    if(nAngle<0): nAngle = 255+nAngle
    
    if(nSpeed>30) : nSpeed = 30
    if(nSpeed<1) : nSpeed = 1
    
    if pinNo<3 : pinNo = 3
    if pinNo>6 : pinNo = 6
    
    checkSum = 0
    packet_buff=[0x23,4,0x81,pinNo,nAngle,nSpeed,0]
    for i in range (2,6):
        checkSum ^= packet_buff[i]
    packet_buff[6] = checkSum
    arr = bytearray(packet_buff)
    #print(packet_buff)
    print ser.write(arr)
    return

def	main(argv):
	servo = [0, 0, 0]
	for i, arg_para in enumerate(argv):
		if i > 0:
			servo[i-1] = int(arg_para)
			print("index: %d: position:%d" % (i,int(arg_para)))
	print(servo)
	servoMotorAngle(servo[0], servo[1], servo[2])
	

if __name__	== '__main__':
	main(sys.argv)

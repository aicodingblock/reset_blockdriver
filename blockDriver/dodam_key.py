from time import sleep
import sys
import serial
ser = serial.Serial('/dev/ttyUSB0', 38400, timeout=1)

def keyboard(key):
        checkSum = 0
	packet_buff=[0x23,2,0x84,key,0]
	for i in range (2,4):
	    checkSum ^= packet_buff[i]
	packet_buff[4] = checkSum
        #print 'keyboard key:',key
        arr = bytearray(packet_buff)
        print(packet_buff)
        print ser.write(arr)
        return

def     main(argv):
        args = [0]
        for i, arg_para in enumerate(argv):
                if i > 0:
                        args[i-1] = int(arg_para)
        print(args)
        keyboard(args[0])

if __name__     == '__main__':
        main(sys.argv)



import sys
import serial

def     digitalRead(port):
        try :
            ser = serial.Serial('/dev/ttyUSB0', 38400, timeout=1)
            tmp=ser.read(12)
            
            #print ' '.join(x.encode('hex') for x in tmp)
            #print(tmp)
            start=tmp.find(b'\x23\x08\x00')
            checkSum=0
            if tmp is None:
                print(-4) #print('Data error.')
            for i in range (2,10):
                checkSum^=tmp[i]
                #checkSum^=ord(tmp[i])
            #if(checkSum != ord(tmp[10])):
            if(checkSum != tmp[10]):
                print(-4) #print('Data error.')
                return
            if(port<0 or port>6):
                print(-3) #print('Please check your pin number.')
                return
            if(port == 3 or port == 4):
                if(tmp[start+2+port] > 100):
                    print(1)
                else:
                    print(0)
            else:
                print(tmp[start+2+port])
            #print( ord(tmp[start+2+port]) )
            #print(tmp[start+2+port])
        except IndexError as e:
            #print(e)
            print(-2) #print('Please run the meta.')
            return
        except serial.serialutil.SerialException as e:
            #print(e)
            print(-1) #print('Please reconnect the USB.')
            return

def     main(argv):
        args = [0]
        for i, arg_para in enumerate(argv):
                if i > 0:
                        args[i-1] = int(arg_para)
                        #print("index: %d: position:%d" % (i,int(arg_para)))
                        digitalRead(args[0])

if __name__     == '__main__':
        main(sys.argv)



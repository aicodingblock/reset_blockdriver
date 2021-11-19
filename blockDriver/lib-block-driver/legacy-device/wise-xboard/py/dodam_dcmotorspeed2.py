from time import sleep
import sys
import serial

ser = serial.Serial('/dev/ttyUSB0', 38400, timeout=1)
ser.close()
ser.open()


def close_quietly(ser):
    if not ser:
        return
    try:
        ser.close()
    except:
        pass  # ignore error


def flush_quietly(ser):
    if not ser:
        return
    try:
        ser.flush()
    except:
        pass  # ignore error


def write_flush(ser, bytearr):
    if not ser:
        print('serial port not available')
        return
    ser.write(bytearr)
    flush_quietly(ser)


def dcMotorSpeed(L2, R2):
    if L2 < -100: L2 = -100
    if R2 < -100: R2 = -100
    if L2 > 100: L2 = 100
    if R2 > 100: R2 = 100

    if L2 < 0: L2 = 256 + L2
    if R2 < 0: R2 = 256 + R2

    checkSum = 0
    packet_buff = [0x23, 3, 0x86, L2, R2, 0]
    for i in range(2, 5):
        checkSum ^= packet_buff[i]
    packet_buff[5] = checkSum
    write_flush(ser, bytearray(packet_buff))


def main(argv):
    postion = [0, 0]
    try:
        for i, motor_num in enumerate(argv):
            if i > 0:
                postion[i - 1] = int(motor_num)
                print("index: %d: position:%d" % (i, int(motor_num)))
        print(postion)
        dcMotorSpeed(postion[0], postion[1])
    finally:
        close_quietly(ser)


if __name__ == '__main__':
    main(sys.argv)
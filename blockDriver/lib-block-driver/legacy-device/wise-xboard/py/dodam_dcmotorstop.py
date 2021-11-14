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


def dcMotorStop():
    checkSum = 0
    packet_buff = [0x23, 1, 0x83, 0]
    for i in range(2, 3):
        checkSum ^= packet_buff[i]
    packet_buff[3] = checkSum
    write_flush(ser, bytearray(packet_buff))


def main():
    try:
        dcMotorStop()
    finally:
        close_quietly(ser)


if __name__ == '__main__':
    main()

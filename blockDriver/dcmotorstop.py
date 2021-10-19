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


def sendPacketMRTEXE(exeIndex):
    packet_buff = [0xff, 0xff, 0x4c, 0x53, 0x00, 0x00, 0x00, 0x00, 0x30, 0x0c, 0x03, exeIndex, 0x00, 100, 0x00]
    aa = range(6, 14)
    for i in aa:
        packet_buff[14] = packet_buff[14] + packet_buff[i]
    write_flush(ser, bytearray(packet_buff))
    return


def dcMotorStop():
    packet_buff = ['X', 'R', 0, 0, 0, 0, 0, 0, 'S']
    write_flush(ser, bytearray(packet_buff))
    return


def main():
    try:
        dcMotorStop()
        sendPacketMRTEXE(2)
    finally:
        close_quietly(ser)


if __name__ == '__main__':
    main()

from time import sleep
import sys
import serial

ser = serial.Serial('/dev/ttyUSB0', 38400, timeout=1)


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


def digitalWrite2(port, value):
    if value <= 0:
        value = 0
    else:
        value = 1
    if port < 0 or port > 5:
        return
    packet_buff = ['X', 'R', 2, 0, 0, 0, 0, 0, 'S']
    if port == 1:
        packet_buff[3] = value
    elif port == 2:
        packet_buff[4] = value
    elif port == 3:
        packet_buff[5] = value
    elif port == 4:
        packet_buff[6] = value
    elif port == 5:
        packet_buff[7] = value
    print('DigitalWrite : port:', port, ',value:', value)
    write_flush(ser, bytearray(packet_buff))
    return


def main(argv):
    args = [0, 0]
    for i, arg_para in enumerate(argv):
        if i > 0:
            args[i - 1] = int(arg_para)
            print("index: %d: position:%d" % (i, int(arg_para)))
    print(args)
    try:
        digitalWrite2(args[0], args[1])
        # sendPacketMRTEXE(2)
    finally:
        close_quietly(ser)


if __name__ == '__main__':
    main(sys.argv)

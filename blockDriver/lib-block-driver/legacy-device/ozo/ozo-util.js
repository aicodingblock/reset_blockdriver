const {
    BehaviorSubject,
    timer,
    tap,
    debounceTime,
    distinctUntilChanged,
    EMPTY,
    mergeMap,
    Observable,
    of,
    switchMap,
    map
} = require('rxjs')
const { exec } = require('child_process')
const { execAsync } = require("../../process-utils")

const config = require('../../../config')
const DEBUG = config.debug

function _unquote(str, q) {
    if (!str || str.length <= 1) return str
    if (str.charAt(0) === q && str.charAt(str.length - 1) === q) {
        return str.substr(1, str.length - 2)
    }
    return str
}

function unquote(str) {
    if (!str) return ''
    str = str.replace(/\n/g, '')
    str = _unquote(str, "'")
    return _unquote(str, '"')
}

/**
 * ozo_command를 실행하는 함수
 * @param {string} cmd
 * @param  {...any} args
 * @returns Promise {stdout, stderr}
 */
function ozoExec(cmd, ...args) {
    return execAsync('python3 ./ozocommand.py', cmd, ...args).then(it => unquote(it.stdout))
}


function checkObservable() {
    console.log('create check observable')
    return new Observable((emitter) => {
        exec('python3 ./ozocommand.py maru_ocheck', (error, stdout, stderr) => {
            if (error || stderr) {
                console.log('maru_ocheck', { error, stderr })
                emitter.next(stderr)
            } else {
                const result = unquote(stdout)
                if (DEBUG) console.log('result=' + result)
                emitter.next(result)
            }
            emitter.complete()
        })
    })
}

const M_TIMEOUT = 500

class OzoStatusResponder {
    listeners$ = new BehaviorSubject({})
    subscription = undefined

    isRunning() {
        return !!this.subscription
    }

    start() {
        if (this.subscription) {
            console.log('OzoStatusChecker already started')
            return
        }
        this.subscription = this.listeners$
            .pipe(
                tap((listeners) => console.log('listeners changed:', Object.keys(listeners).length)),
                map(listeners => Object.keys(listeners).length > 0),
                distinctUntilChanged(),
                debounceTime(100),
                switchMap(hasListener => {
                    if (!hasListener) {
                        return EMPTY
                    }
                    const checker$ = new BehaviorSubject(100)
                    return checker$.pipe(
                        mergeMap(milli => timer(milli)),
                        mergeMap(() => checkObservable()),
                        mergeMap(status => {
                            if (!this.isRunning()) {
                                return EMPTY
                            }
                            if (status === 'True' || status === 'False') {
                                return of(status)
                            } else {
                                checker$.next(M_TIMEOUT)
                                return EMPTY
                            }
                        }),
                    )
                })
            )
            .subscribe(returnMsgValue => {
                const listeners = this.getAndRemoveListeners()
                listeners.forEach(({ socket, returnMsgType }) => {
                    console.log('SEND:', { Type: returnMsgType, Data: { wait: returnMsgValue } })
                    socket.emit('receiveData', { Type: returnMsgType, Data: { wait: returnMsgValue } })
                })
            })
    }

    stop() {
        this.listeners$.next([])
        if (this.subscription) {
            this.subscription.unsubscribe()
            this.subscription = undefined
            return
        }
    }

    addListener(socket, returnMsgType) {
        const prev = this.listeners$.value
        if (prev[socket.id]) {
            console.log('already registered listener:' + socket.id)
            return
        }
        const newListeners = { ...prev }
        newListeners[socket.id] = {
            socket,
            returnMsgType
        }
        console.log('addListener:', { socketId: socket.id, returnMsgType })
        this.listeners$.next(newListeners)
    }

    getAndRemoveListeners() {
        const ret = Object.values(this.listeners$.value)
        this.listeners$.next({})
        return ret
    }
}

class OzoStatusChecker {
    static statusResponder = new OzoStatusResponder()

    static clearInterval() {
        console.log('All Stop Ozobot Waiting Loop...')
        statusResponder.stopChecker()
    }

    static addListener(socket, ret_msg_str) {
        if (!this.statusResponder.isRunning()) {
            this.statusResponder.start()
        }
        this.statusResponder.addListener(socket, ret_msg_str)
    }

    static stop() {
        this.statusResponder.stop()
    }
}


module.exports = {
    OzoStatusChecker,
    ozoExec,
    unquote
}

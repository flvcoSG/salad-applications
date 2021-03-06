import { action, computed, observable, toJS } from 'mobx'
import * as Storage from '../../Storage'
import { RootStore } from '../../Store'
// import { Machine } from './models/Machine'
import { Profile } from '../profile/models'
import { MachineInfo } from './models'

const getMachineInfo = 'get-machine-info'
const setMachineInfo = 'set-machine-info'
const minimize = 'minimize-window'
const maximize = 'maximize-window'
const close = 'close-window'
const hide = 'hide-window'
// const sendLog = 'send-log'
const getDesktopVersion = 'get-desktop-version'
const setDesktopVersion = 'set-desktop-version'
const enableAutoLaunch = 'enable-auto-launch'
const disableAutoLaunch = 'disable-auto-launch'
const login = 'login'
const logout = 'logout'

const AUTO_LAUNCH = 'AUTO_LAUNCH'
const MINIMIZE_TO_TRAY = 'MINIMIZE_TO_TRAY'

declare global {
  interface Window {
    salad: {
      platform: string
      apiVersion: number
      dispatch: (type: string, payload: any) => void
      onNative: (args: { type: string; payload: any }) => void
    }
  }
}

export class NativeStore {
  private callbacks = new Map<string, Function>()

  private machineInfoRetry?: NodeJS.Timeout

  @observable
  public desktopVersion: string = ''

  @observable
  public loadingMachineInfo: boolean = false

  @observable
  public machineInfo?: MachineInfo

  @observable
  public autoLaunch: boolean = true

  @observable
  public minimizeToTray: boolean = true

  @computed
  get canMinimizeToTray(): boolean {
    return this.isNative && this.apiVersion >= 8
  }

  @computed
  get isNative(): boolean {
    return window.salad && window.salad.platform === 'electron'
  }

  @computed
  get apiVersion(): number {
    return window.salad && window.salad.apiVersion
  }

  @computed
  get canSendLogs(): boolean {
    return this.apiVersion >= 2
  }

  @computed
  get gpuNames(): string[] | undefined {
    if (this.machineInfo?.graphics === undefined) {
      return undefined
    }

    return this.machineInfo.graphics.controllers.map((x) => x.model)
  }

  constructor(private readonly store: RootStore) {
    if (this.isNative) {
      window.salad.onNative = this.onNative

      this.checkAutoLaunch()

      this.on(setDesktopVersion, (version: string) => {
        this.setDesktopVersion(version)
      })

      this.on(setMachineInfo, (info: MachineInfo) => {
        this.setMachineInfo(info)
      })

      this.send(getDesktopVersion)
      this.loadMachineInfo()

      this.machineInfoRetry = setInterval(this.loadMachineInfo, 1000)
    }
  }

  /** Callback function when the app receives a message from native code */
  private onNative = (args: { type: string; payload: any }) => {
    let func = this.callbacks.get(args.type)

    if (func) {
      if (args.type !== 'set-idle-time') {
        console.log('Received message ' + args.type)
      }
      func(args.payload)
    } else {
      console.log('Received unhandled message type ' + args.type)
    }
  }

  /** Registers a callback to listen for native messages */
  public on = (type: string, listener: Function) => {
    this.callbacks.set(type, listener)
  }

  /** Sends a message to the native code */
  public send = (type: string, payload?: any) => {
    if (!this.isNative) {
      return
    }
    window.salad.dispatch(type, payload && toJS(payload))
  }

  @action
  setDesktopVersion = (version: string) => {
    console.log(`Setting desktop version: ${version}`)
    this.desktopVersion = version
    this.store.analytics.trackDesktopVersion(version)
  }

  @action
  loadMachineInfo = () => {
    if (this.machineInfo) {
      console.log('Machine info already loaded. Skipping...')
      if (this.machineInfoRetry) {
        clearInterval(this.machineInfoRetry)
        this.machineInfoRetry = undefined
      }
      return
    }
    console.log('Getting machine info')
    this.loadingMachineInfo = true
    this.send(getMachineInfo)
  }

  @action
  sendLog = () => {
    // this.send(sendLog, this.store.token.machineId)
  }

  @action
  minimizeWindow = () => {
    this.send(minimize)
  }

  @action
  maximizeWindow = () => {
    this.send(maximize)
  }

  @action
  closeWindow = () => {
    if (this.canMinimizeToTray && this.minimizeToTray) {
      this.send(hide)
    } else {
      this.send(close)
    }
  }

  @action
  setMachineInfo = (info: MachineInfo) => {
    console.log('Received machine info')
    if (this.machineInfo) {
      console.log('Already received machine info. Skipping...')

      if (this.machineInfoRetry) {
        clearInterval(this.machineInfoRetry)
        this.machineInfoRetry = undefined
      }
      return
    }

    this.machineInfo = info
    this.loadingMachineInfo = false
  }

  @action
  toggleAutoLaunch = () => {
    if (this.autoLaunch) {
      this.disableAutoLaunch()
    } else {
      this.enableAutoLaunch()
    }
  }

  @action
  toggleMinimizeToTray = () => {
    if (this.minimizeToTray) {
      this.disableMinimizeToTray()
    } else {
      this.enableMinimizeToTray()
    }
  }

  @action
  enableAutoLaunch = () => {
    this.autoLaunch = true
    Storage.setItem(AUTO_LAUNCH, 'true')

    this.send(enableAutoLaunch)
  }

  @action
  disableAutoLaunch = () => {
    this.autoLaunch = false
    Storage.setItem(AUTO_LAUNCH, 'false')

    this.send(disableAutoLaunch)
  }

  @action
  enableMinimizeToTray = () => {
    this.minimizeToTray = true
    Storage.setItem(MINIMIZE_TO_TRAY, 'true')
  }

  @action
  disableMinimizeToTray = () => {
    this.minimizeToTray = false
    Storage.setItem(MINIMIZE_TO_TRAY, 'false')
  }

  @action
  checkAutoLaunch = () => {
    if (window.salad.apiVersion <= 1) {
      this.autoLaunch = false
      return
    }

    this.autoLaunch = Storage.getOrSetDefault(AUTO_LAUNCH, this.autoLaunch.toString()) === 'true'
    this.autoLaunch && this.enableAutoLaunch()
  }

  @action
  login = (profile: Profile) => {
    this.send(login, profile)
  }

  @action
  logout = () => {
    this.send(logout)
  }
}

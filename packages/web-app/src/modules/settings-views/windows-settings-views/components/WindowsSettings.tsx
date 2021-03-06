import React, { Component } from 'react'

// UI
import { CondensedHeader, Divider, Slider, P, ToggleSetting } from '../../../../components'

// Packages
import withStyles, { WithStyles } from 'react-jss'
import { withLogin } from '../../../auth-views'

const styles = {
  container: {
    padding: 20,
  },

  toggler: {
    flex: '0 0 auto',
    margin: '0 1.5rem 0 0',
  },

  description: {
    order: 1,
  },
}

interface Props extends WithStyles<typeof styles> {
  autoLaunch?: boolean
  autoLaunchToggle?: () => void
  autoStart?: boolean
  autoStartToggle?: () => void
  autoStartEnabled?: boolean
  autoStartDelay?: number
  autoStartUpdate?: (value: number) => void
  minimizeToTrayToggle?: () => void
  minimizeToTray?: boolean
  canMinimizeToTray?: boolean
}

class _WindowsSettings extends Component<Props> {
  render() {
    const {
      autoLaunch,
      autoLaunchToggle,
      autoStart,
      autoStartToggle,
      autoStartEnabled,
      autoStartDelay,
      autoStartUpdate,
      minimizeToTrayToggle,
      minimizeToTray,
      canMinimizeToTray,
      classes,
    } = this.props

    return (
      <div className={classes.container}>
        <div className="header">
          <CondensedHeader>Windows Settings</CondensedHeader>
        </div>
        <Divider />
        <ToggleSetting
          title={'Auto Launch'}
          description={
            "Auto Launch opens Salad once you log into Windows, getting the Kitchen warmed up for when you're ready to start chopping."
          }
          toggled={autoLaunch}
          onToggle={autoLaunchToggle}
        />
        {autoStartEnabled && (
          <>
            <Divider />
            <ToggleSetting
              title={'Auto Start'}
              description={
                'Salad will automatically start to run after being AFK a determined amount of time *and* will automatically stop when you return.'
              }
              toggled={autoStart}
              onToggle={autoStartToggle}
            >
              <div style={{ width: 300 }}>
                <P>START AFTER {autoStartDelay ? autoStartDelay / 60 : 10} MINUTES</P>
                <Slider
                  stepSize={10}
                  minimum={10}
                  maximum={60}
                  value={autoStartDelay ? autoStartDelay / 60 : 10}
                  onValueChange={(value: number) => {
                    if (autoStartUpdate) autoStartUpdate(value * 60)
                  }}
                />
              </div>
            </ToggleSetting>
          </>
        )}
        {canMinimizeToTray && (
          <>
            <Divider />
            <ToggleSetting
              title={'Minimize to Tray'}
              description={
                "Salad's minimize to tray feature streamlines your time spent launching the app. With it easily accessible in your computer's tray, you can start your chopping with even more ease."
              }
              toggled={minimizeToTray}
              onToggle={minimizeToTrayToggle}
            />
          </>
        )}
      </div>
    )
  }
}

export const WindowsSettings = withLogin(withStyles(styles)(_WindowsSettings))

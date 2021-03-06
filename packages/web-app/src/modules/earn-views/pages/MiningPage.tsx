import classNames from 'classnames'
import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { Divider, Head, P, Scrollbar, SectionHeader, SmartLink } from '../../../components'
import { SaladTheme } from '../../../SaladTheme'
import { withLogin } from '../../auth-views'
import { PantryContainer, SlicedVeggieContainer } from '../../xp-views'
import { MiningSummary } from '../components'
import { DesktopDownloadContainer } from '../DesktopDownloadContainer'
import { EarningHistoryContainer } from '../EarningHistoryContainer'

const styles = (theme: SaladTheme) => ({
  container: {
    overflow: 'hidden',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    padding: 20,
  },
  splitContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  mainColumn: {
    flex: 1,
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
  },
  startContainer: {
    backgroundColor: theme.darkBlue,
    padding: 30,
    boxShadow: '8px 14px 22px rgba(0, 0, 0, 0.45)',
    display: 'flex',
    justifyContent: 'center',
    alignSelf: 'center',
  },
})

interface Props extends WithStyles<typeof styles> {
  lifetimeXp?: number
}

class _MiningPage extends Component<Props> {
  render() {
    const { lifetimeXp, classes } = this.props

    return (
      <div className={classNames(classes.container, classes.splitContainer)}>
        <Head title="Mining" />
        <Scrollbar>
          <div className={classNames(classes.content, classes.splitContainer)}>
            <div className={classNames(classes.column, classes.mainColumn)}>
              <DesktopDownloadContainer />
              <MiningSummary lifetimeXp={lifetimeXp} />
              <Divider />

              <SectionHeader>Pantry</SectionHeader>
              <PantryContainer />
              <Divider />

              <EarningHistoryContainer />
              <Divider />

              <SectionHeader>More Information</SectionHeader>
              <br />
              <P>
                <SmartLink to="/earn/mine/how-it-works">How It Works</SmartLink>
              </P>
              <P>
                <SmartLink to="https://support.salad.io/hc/en-us/sections/360008458292-Anti-Virus">
                  Having Anti-Virus Issues?
                </SmartLink>
              </P>
              <P>
                <SmartLink to="https://medium.com/@saladchefs/a-gamers-guide-to-blockchain-and-crypto-b76bce353a4d">
                  Gamers Guide to Blockchain
                </SmartLink>
              </P>
              <P>
                <SmartLink to="https://medium.com/@saladchefs/making-money-with-salad-whats-the-catch-f33ad86d1a9c">
                  What's the Catch?
                </SmartLink>
              </P>
              <P>
                <SmartLink to="https://medium.com/@saladchefs/does-mining-for-cryptocurrency-damage-my-gpu-5a74827a0742">
                  Does mining hurt my machine?
                </SmartLink>
              </P>
            </div>
          </div>
        </Scrollbar>
        <div className={classes.column}>
          <SlicedVeggieContainer />
        </div>
      </div>
    )
  }
}

export const MiningPage = withLogin(withStyles(styles)(_MiningPage))

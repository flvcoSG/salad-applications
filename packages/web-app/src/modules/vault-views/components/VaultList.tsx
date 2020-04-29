import React, { Component } from 'react'

// Packages
import withStyles, { WithStyles } from 'react-jss'

import { P } from '../../../components'
import { RewardVaultItem } from '../../vault/models'
import { VaultItem } from './VaultItem'

const styles = {
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: 20,
  },
  listContainer: {
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  innerListContainer: {
    height: '100%',
    width: '100%',
    overflow: 'auto',
    paddingRight: '20px',
  },
}

interface Props extends WithStyles<typeof styles> {
  redemptions?: RewardVaultItem[]
}

class _VaultList extends Component<Props> {
  render() {
    const { redemptions, classes } = this.props
    return (
      <div className={classes.container}>
        <div className={classes.listContainer}>
          <div className={classes.innerListContainer}>
            {redemptions && redemptions.length > 0 && redemptions.map((x) => <VaultItem {...x} />)}
            {(!redemptions || redemptions.length === 0) && <P>Nothing here yet, go redeem something!</P>}
          </div>
        </div>
      </div>
    )
  }
}

export const VaultList = withStyles(styles)(_VaultList)

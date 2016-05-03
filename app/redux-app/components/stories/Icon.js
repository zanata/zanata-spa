import React from 'react'
import { storiesOf } from '@kadira/storybook'
import Icon from '../Icon'

/*
 * name
 * title
 * className
 */
storiesOf('Icon', module)
  // history icon from suggestion panel
  .add('plain', () => (
    <Icon name="history" className="Icon--xsm u-sMR-1-4"/>
  ))

// TODO add more variety of styles. See if there is a stylesheet to compare to

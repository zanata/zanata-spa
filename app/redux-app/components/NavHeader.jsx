import DashboardLink from './DashboardLink'
import DocsDropdown from './DocsDropdown'
import Icon from './Icon'
import LanguagesDropdown from './LanguagesDropdown'
import ProjectVersionLink from './ProjectVersionLink'
import UiLanguageDropdown from './UiLanguageDropdown'
import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import {toggleDropdown} from '../actions'
import {changeUiLocale} from '../actions/headerActions'

const { any, arrayOf, func, object, shape, string } = PropTypes

/**
 * Hideable navigation header across the top of the app.
 */
let NavHeader = React.createClass({

  propTypes: {
    actions: shape({
      changeUiLocale: func.isRequired,
      toggleDropdown: func.isRequired
    }).isRequired,

    data: shape({
      user: shape({
        name: string,
        gravatarUrl: string,
        dashboardUrl: string.isRequired
      }),
      context: shape({
        projectVersion: shape({
          project: shape({
            slug: string.isRequired,
            name: string
          }).isRequired,
          version: string.isRequired,
          url: string,
          docs: arrayOf(string).isRequired,
          locales: object.isRequired
        }).isRequired,
        selectedLocale: string.isRequired
      }).isRequired
    }).isRequired,

    ui: shape({
      // locale id for selected locale
      selectedUiLocale: string,
      // localeId -> { id, name }
      uiLocales: object.isRequired,
      dropdowns: shape({
        current: any,
        docsKey: any.isRequired,
        localeKey: any.isRequired,
        uiLocaleKey: any.isRequired
      }).isRequired
    }).isRequired
  },

  render: function () {
    let props = this.props
    let ctx = props.data.context
    let dropdowns = props.ui.dropdowns

    let docsDropdownProps = {
      context: ctx,
      isOpen: dropdowns.current === dropdowns.docsKey,
      toggleDropdown: props.actions.toggleDropdown(dropdowns.docsKey)
    }

    let langsDropdownProps = {
      context: ctx,
      isOpen: dropdowns.current === dropdowns.localeKey,
      toggleDropdown: props.actions.toggleDropdown(dropdowns.localeKey)
    }

    let uiLangDropdownProps = {
      changeUiLocale: props.actions.changeUiLocale,
      selectedUiLocale: props.ui.selectedUiLocale,
      uiLocales: props.ui.uiLocales,
      isOpen: dropdowns.current === dropdowns.uiLocaleKey,
      toggleDropdown: props.actions.toggleDropdown(dropdowns.uiLocaleKey)
    }

    return (
      <nav role="navigation"
           className="Editor-mainNav u-posRelative u-textCenter">
        <div className="u-posAbsoluteLeft">
          <ProjectVersionLink {...ctx.projectVersion}/>
          <Icon name="chevron-right"
             className="Icon--sm u-sMH-1-4 u-textInvert
                        u-textMuted u-sm-hidden"/>
          <ul className="u-listInline u-inlineBlock">
            <li>
              <DocsDropdown {...docsDropdownProps}/>
            </li>
            <li>
              <LanguagesDropdown {...langsDropdownProps}/>
            </li>
          </ul>
        </div>

        <ul className="u-listHorizontal u-posAbsoluteRight u-sMR-1-2">
          <li>
            <UiLanguageDropdown {...uiLangDropdownProps}/>
          </li>
          {/* A couple of items from the Angular template that were not used
          <li ng-show="appCtrl.PRODUCTION">
            <button class="Link--invert Header-item u-sizeWidth-1_1-2"
              title="{{'More'|translate}}"><icon name="ellipsis"/><span
              class="u-hiddenVisually" translate>More</span></button>
          </li>
          <li ng-show="appCtrl.PRODUCTION">
            <button class="Link--invert Header-item u-sizeWidth-1_1-2"
              title="{{'Notifications'|translate}}">
              <icon name="notification" title="{{'Notifications'|translate}}"/>
            </button>
          </li>
          */}
          <li>
            <DashboardLink {...this.props.data.user}/>
          </li>
        </ul>
      </nav>
    )
  }
})

function mapStateToProps (state) {
  console.log('NavHeader============')
  return {
    ui: state.ui,
    data: state.data
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      toggleDropdown: (key) => {
        return () => dispatch(toggleDropdown(key))
      },
      changeUiLocale: (key) => {
        return () => dispatch(changeUiLocale(key))
      }
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NavHeader)

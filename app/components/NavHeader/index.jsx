import DashboardLink from 'DashboardLink'
import DocsDropdown from 'DocsDropdown'
import Icon from 'Icon'
import LanguagesDropdown from 'LanguagesDropdown'
import ProjectVersionLink from 'ProjectVersionLink'
import UiLanguageDropdown from 'UiLanguageDropdown'
import React from 'react'

/**
 * Hideable navigation header across the top of the app.
 */
let NavHeader = React.createClass({

  propTypes: {
    actions: React.PropTypes.shape({
      changeUiLocale: React.PropTypes.func.isRequired,
      toggleDropdown: React.PropTypes.func.isRequired
    }).isRequired,

    data: React.PropTypes.shape({
      user: React.PropTypes.shape({
        name: React.PropTypes.string,
        gravatarUrl: React.PropTypes.string,
        dashboardUrl: React.PropTypes.string.isRequired
      }),
      context: React.PropTypes.shape({
        projectVersion: React.PropTypes.shape({
          project: React.PropTypes.shape({
            slug: React.PropTypes.string.isRequired,
            name: React.PropTypes.string
          }).isRequired,
          version: React.PropTypes.string.isRequired,
          url: React.PropTypes.string,
          docs: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
          locales: React.PropTypes.object.isRequired
        }).isRequired,
        selectedLocale: React.PropTypes.string.isRequired
      }).isRequired
    }).isRequired,

    ui: React.PropTypes.shape({
      // locale id for selected locale
      selectedUiLocale: React.PropTypes.string,
      // localeId -> { id, name }
      uiLocales: React.PropTypes.object.isRequired,
      dropdowns: React.PropTypes.shape({
        current: React.PropTypes.any,
        docsKey: React.PropTypes.any.isRequired,
        localeKey: React.PropTypes.any.isRequired,
        uiLocaleKey: React.PropTypes.any.isRequired
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

export default NavHeader

import { LitElement, html } from 'lit'
import { property, state } from 'lit/decorators.js'
import { ifDefined } from 'lit/directives/if-defined.js'

import { ApiController, ConnectorController, OptionsController } from '@reown/appkit-controllers'
import { customElement } from '@reown/appkit-ui'
import '@reown/appkit-ui/wui-flex'

import '../../partials/w3m-connect-announced-widget/index.js'
import '../../partials/w3m-connect-custom-widget/index.js'
import '../../partials/w3m-connect-external-widget/index.js'
import '../../partials/w3m-connect-featured-widget/index.js'
import '../../partials/w3m-connect-injected-widget/index.js'
import '../../partials/w3m-connect-multi-chain-widget/index.js'
import '../../partials/w3m-connect-recent-widget/index.js'
import '../../partials/w3m-connect-recommended-widget/index.js'
import '../../partials/w3m-connect-walletconnect-widget/index.js'
import { ConnectorUtil } from '../../utils/ConnectorUtil.js'
import styles from './styles.js'

@customElement('w3m-connector-list')
export class W3mConnectorList extends LitElement {
  public static override styles = styles

  // -- Members ------------------------------------------- //
  private unsubscribe: (() => void)[] = []

  // -- State & Properties -------------------------------- //
  @property() public tabIdx?: number = undefined

  @state() private connectors = ConnectorController.state.connectors

  @state() private recommended = ApiController.state.recommended

  @state() private featured = ApiController.state.featured

  public constructor() {
    super()
    this.unsubscribe.push(
      ConnectorController.subscribeKey('connectors', val => (this.connectors = val)),
      ApiController.subscribeKey('recommended', val => (this.recommended = val)),
      ApiController.subscribeKey('featured', val => (this.featured = val))
    )
  }

  public override disconnectedCallback() {
    this.unsubscribe.forEach(unsubscribe => unsubscribe())
  }

  // -- Render -------------------------------------------- //
  public override render() {
    const { custom, recent, announced, injected, multiChain, recommended, featured, external } =
      ConnectorUtil.getConnectorsByType(this.connectors, this.recommended, this.featured)
    const isConnectedWithWC = ConnectorUtil.getIsConnectedWithWC()
    const isWCEnabled = OptionsController.state.enableWalletConnect

    return html`
      <wui-flex flexDirection="column" gap="xs">
        ${isWCEnabled && !isConnectedWithWC
          ? html`<w3m-connect-walletconnect-widget
              tabIdx=${ifDefined(this.tabIdx)}
            ></w3m-connect-walletconnect-widget>`
          : null}
        ${recent.length
          ? html`<w3m-connect-recent-widget
              tabIdx=${ifDefined(this.tabIdx)}
            ></w3m-connect-recent-widget>`
          : null}
        ${multiChain.length
          ? html`<w3m-connect-multi-chain-widget
              tabIdx=${ifDefined(this.tabIdx)}
            ></w3m-connect-multi-chain-widget>`
          : null}
        ${announced.length
          ? html`<w3m-connect-announced-widget
              tabIdx=${ifDefined(this.tabIdx)}
            ></w3m-connect-announced-widget>`
          : null}
        ${injected.length
          ? html`<w3m-connect-injected-widget
              .connectors=${injected}
              tabIdx=${ifDefined(this.tabIdx)}
            ></w3m-connect-injected-widget>`
          : null}
        ${featured.length
          ? html`<w3m-connect-featured-widget
              .wallets=${featured}
              tabIdx=${ifDefined(this.tabIdx)}
            ></w3m-connect-featured-widget>`
          : null}
        ${custom?.length
          ? html`<w3m-connect-custom-widget
              tabIdx=${ifDefined(this.tabIdx)}
            ></w3m-connect-custom-widget>`
          : null}
        ${external.length
          ? html`<w3m-connect-external-widget
              tabIdx=${ifDefined(this.tabIdx)}
            ></w3m-connect-external-widget>`
          : null}
        ${recommended.length
          ? html`<w3m-connect-recommended-widget
              .wallets=${recommended}
              tabIdx=${ifDefined(this.tabIdx)}
            ></w3m-connect-recommended-widget>`
          : null}
      </wui-flex>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'w3m-connector-list': W3mConnectorList
  }
}

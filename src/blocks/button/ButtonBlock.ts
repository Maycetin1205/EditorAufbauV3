import { css, html, nothing, type TemplateResult } from 'lit'
import { property } from 'lit/decorators.js'
import { BasicBlock } from '../base/BasicBlock'
import type { BlockCategory } from '../../core/blocks/BlockComponent'
import type { PropertyDescription } from '../../core/blocks/PropertyDescription'
import { connectClickAktionen } from '../shared/seAktionen'
import {
  VORMERK_EVENT,
  vormerkStandVon,
  vormerkSumme,
  vormerkText,
  type VormerkZahlen,
} from '../shared/vormerkStand'

export class ButtonBlock extends BasicBlock {
  static readonly blockType = 'button'
  static readonly tagName = 'ff-button'
  static readonly displayName = 'Schaltfläche'
  static readonly category: BlockCategory = 'eingabe'
  static readonly defaultProps = { label: 'Klick mich' }

  static readonly resizableWidth = false

  static readonly blockEvents = [{ key: 'onClick', name: 'Klick' }]

  static readonly raster = { startW: 4, startH: 2, minW: 2, minH: 2 }

  static override readonly customProperties: PropertyDescription[] = []

  static override styles = [
    BasicBlock.styles,
    css`
      button {
        box-sizing: border-box;
        padding: 7px 16px;
        cursor: pointer;
        border-radius: var(--se-r-md);
        border: var(--se-border) solid var(--se-accent);
        background: var(--se-accent);
        color: var(--se-panel);
        font-family: var(--se-font);
        font-size: var(--se-fs);
        font-weight: 600;

        line-height: 1.2;

        transition: background-color var(--se-move), border-color var(--se-move);
      }
      button:hover { background: var(--se-accent-dark); border-color: var(--se-accent-dark); }

      button:active { background: var(--se-accent-dark); border-color: var(--se-ink); }
      button:focus-visible { outline: 2px solid var(--se-accent); outline-offset: 2px; }

      button:disabled { cursor: default; opacity: 0.5; }
      button:disabled:hover { background: var(--se-accent); border-color: var(--se-accent); }

      :host([fuellt]) button { width: 100%; height: 100%; }
    `,
  ]

  @property() label = 'Klick mich'

  // Liest die Kette dieses Knopfs Vormerkungen, steht ihre Zahl im Label und
  // der Knopf ist bei Null aus — er haette nichts zu tun. undefined heisst:
  // gewoehnlicher Knopf. Im Editor bleibt es dabei, dort gibt es keine Daten
  // (Regel 7).
  @property({ attribute: false }) vormerkungen: VormerkZahlen | undefined = undefined

  private readonly zaehleVormerkungen = (): void => {
    this.vormerkungen = vormerkStandVon(this, 'onClick')
  }

  override render(): TemplateResult {
    const zahlen = this.vormerkungen
    const offen = zahlen === undefined ? 0 : vormerkSumme(zahlen)
    return html`<button
      data-ff-editable
      ?disabled=${zahlen !== undefined && offen === 0}
      title=${zahlen === undefined || offen === 0
        ? nothing
        : vormerkText(zahlen.erfasst, zahlen.geaendert, zahlen.geloescht)}
      @dblclick=${(e: MouseEvent) => this.inlineEdit(e, 'label')}
    >${zahlen === undefined ? this.label : `${this.label} (${offen})`}</button>`
  }

  override connectedCallback(): void {
    super.connectedCallback()
    connectClickAktionen(this, 'onClick')
    if (this.hasAttribute('data-ff-editor')) return
    document.addEventListener(VORMERK_EVENT, this.zaehleVormerkungen)
    this.zaehleVormerkungen()
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback()
    document.removeEventListener(VORMERK_EVENT, this.zaehleVormerkungen)
  }
}

BasicBlock.defineAndRegister(ButtonBlock)

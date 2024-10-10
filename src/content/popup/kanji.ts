import { KanjiResult } from '@birchill/jpdict-idb';
import { h, render } from 'preact';
import browser from 'webextension-polyfill';

import { html } from '../../utils/builder';

import { KanjiEntry } from './KanjiEntry';
import { PopupOptionsProvider } from './options-context';
import { getSelectedIndex } from './selected-index';
import { ShowPopupOptions } from './show-popup';

export function renderKanjiEntries({
  entries,
  options,
}: {
  entries: ReadonlyArray<KanjiResult>;
  options: ShowPopupOptions;
}): HTMLElement {
  const bigContainer = html('div');
  const descriptionText = html('div', {
    style:
      'display: flex; justify-content: center; align-items: center; margin: 0.5em',
  });
  descriptionText.textContent = browser.i18n.getMessage(
    'stroke_animation_hint'
  );
  bigContainer.append(descriptionText);

  const container = html('div', { class: 'kanjilist entry-data' });
  bigContainer.append(container);

  const selectedIndex = getSelectedIndex(options.copyState, entries.length);
  for (const [i, entry] of entries.entries()) {
    if (i === 1) {
      container.append(html('div', { class: 'fold-point' }));
    }
    container.append(
      renderKanjiEntry({
        entry,
        index: i,
        options,
        selectState:
          selectedIndex === i
            ? options.copyState.kind === 'active'
              ? 'selected'
              : 'flash'
            : 'unselected',
      })
    );
  }

  return bigContainer;
}

function renderKanjiEntry({
  entry,
  index,
  options,
  selectState,
}: {
  entry: KanjiResult;
  index: number;
  options: ShowPopupOptions;
  selectState: 'unselected' | 'selected' | 'flash';
}): HTMLElement {
  const containerElement = html('div', {
    /* Make sure it's possible to scroll all the way to the bottom of each kanji
     * table. */
    style:
      'scroll-snap-align: start; scroll-margin-bottom: var(--expand-button-allowance);',
  });
  render(
    h(
      PopupOptionsProvider,
      { interactive: options.interactive },
      h(KanjiEntry, {
        entry,
        index,
        kanjiReferences: options.kanjiReferences,
        onStartCopy: options.onStartCopy,
        selectState,
        showComponents: options.showKanjiComponents,
      })
    ),
    containerElement
  );
  return containerElement;
}

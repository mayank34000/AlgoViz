import { qs } from '../utils.js';
import { getAlgorithm } from '../data/algorithmInfo.js';

export function renderDescription(algorithmId) {
  const panel = qs('#description-panel');
  if (!panel) return;

  const info = getAlgorithm(algorithmId);
  if (!info) { panel.innerHTML = ''; return; }

  panel.innerHTML = _buildHTML(info);
}

function _buildHTML(info) {
  return `
    <div class="desc-layout">
      <div class="desc-section">
        <div class="desc-section-title">Overview</div>
        <p class="desc-text">${info.overview}</p>
        <p class="desc-text" style="margin-top:6px">${info.principle}</p>
      </div>

      <div class="desc-section">
        <div class="desc-section-title">Complexity</div>
        <div class="complexity-grid">
          <div class="complexity-row">
            <span class="complexity-case">Best</span>
            <span class="complexity-val">${info.best}</span>
          </div>
          <div class="complexity-row">
            <span class="complexity-case">Average</span>
            <span class="complexity-val">${info.average}</span>
          </div>
          <div class="complexity-row">
            <span class="complexity-case">Worst</span>
            <span class="complexity-val">${info.worst}</span>
          </div>
          <div class="complexity-row">
            <span class="complexity-case">Space</span>
            <span class="complexity-val">${info.space}</span>
          </div>
        </div>
        <div class="desc-tag-row" style="margin-top:8px">
          <span class="desc-tag ${info.stable  ? 'tag-yes' : 'tag-no'}">${info.stable  ? 'Stable'    : 'Unstable'}</span>
          <span class="desc-tag ${info.inPlace ? 'tag-yes' : 'tag-no'}">${info.inPlace ? 'In-Place'  : 'Extra Space'}</span>
        </div>
      </div>

      <div class="desc-section">
        <div class="desc-section-title">Advantages</div>
        ${info.advantages.map(a => `<p class="desc-text">+ ${a}</p>`).join('')}
        <div class="desc-section-title" style="margin-top:8px">Disadvantages</div>
        ${info.disadvantages.map(d => `<p class="desc-text">– ${d}</p>`).join('')}
      </div>

      <div class="desc-section">
        <div class="desc-section-title">Real-world Use</div>
        ${info.applications.map(a => `<span class="desc-tag tag-info">${a}</span>`).join('')}
      </div>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
    // === DOM REFS ===
    const $ = id => document.getElementById(id);
    const widthInput        = $('width');
    const heightInput       = $('height');
    const cutLengthInput    = $('cutLength');
    const cutGapInput       = $('cutGap');
    const webThicknessInput = $('webThickness');
    const staggerOffsetInput= $('staggerOffset');
    const patternTypeInput  = $('patternType');
    const lineWidthInput    = $('lineWidth');
    const materialInput     = $('material');
    const thicknessInput    = $('thickness');
    const cellSizeInput     = $('cellSize');
    const sphereDiameterInput = $('sphereDiameter');
    const numGoresInput     = $('numGores');
    const sphereShapeInput  = $('sphereShape');

    const beachBallParams   = $('beachBallParams');
    const honeycombParams   = $('honeycombParams');
    const recommendBtn      = $('recommendBtn');
    const recommendationBox = $('recommendationBox');
    const downloadBtn       = $('downloadBtn');
    const previewContainer  = $('previewContainer');
    const previewSize       = $('previewSize');
    const previewHint       = $('previewHint');
    const statusChip        = $('statusChip');

    let currentSvgString = '';

    // === MATERIAL RECOMMENDATION DATABASE ===
    const MATERIAL_DB = {
        mdf: {
            name: 'MDF',
            brittle: true,
            recommendations: {
                2:  { pattern: 'straight', cutLength: 12, cutGap: 2,   web: 2.5, stagger: 50, note: 'Thin MDF bends easily. Straight cuts work well.' },
                3:  { pattern: 'straight', cutLength: 15, cutGap: 2.5, web: 3,   stagger: 50, note: 'Standard 3mm MDF. Classic brickwork pattern.' },
                4:  { pattern: 'straight', cutLength: 18, cutGap: 3,   web: 3.5, stagger: 50, note: 'Needs longer cuts and wider gaps for flex.' },
                6:  { pattern: 'straight', cutLength: 25, cutGap: 3,   web: 4,   stagger: 50, note: '6mm MDF is stiff. Use long cuts, handle gently.' },
                9:  { pattern: 'wave',     cutLength: 30, cutGap: 4,   web: 5,   stagger: 50, note: 'Very thick. Wave pattern distributes stress better.' },
            }
        },
        plywood: {
            name: 'Plywood',
            brittle: false,
            recommendations: {
                2:  { pattern: 'straight', cutLength: 10, cutGap: 2,   web: 2,   stagger: 50, note: 'Thin ply is very flexible. Tight spacing works.' },
                3:  { pattern: 'straight', cutLength: 14, cutGap: 2,   web: 2.5, stagger: 50, note: 'Great material for hinges. Very forgiving.' },
                4:  { pattern: 'straight', cutLength: 16, cutGap: 2.5, web: 3,   stagger: 50, note: 'Birch ply recommended for best results.' },
                6:  { pattern: 'wave',     cutLength: 22, cutGap: 3,   web: 3.5, stagger: 50, note: 'Wave pattern reduces snap risk in thick ply.' },
                9:  { pattern: 'wave',     cutLength: 28, cutGap: 3.5, web: 4,   stagger: 50, note: 'Very thick. Consider double-pass cuts.' },
            }
        },
        hardwood: {
            name: 'Hardwood',
            brittle: true,
            recommendations: {
                2:  { pattern: 'straight', cutLength: 12, cutGap: 1.5, web: 2,   stagger: 50, note: 'Thin hardwood veneer. Cuts cleanly.' },
                3:  { pattern: 'wave',     cutLength: 16, cutGap: 2,   web: 3,   stagger: 50, note: 'Wave pattern helps hardwood flex without snapping.' },
                4:  { pattern: 'wave',     cutLength: 20, cutGap: 2.5, web: 3.5, stagger: 50, note: 'Hard to bend. Use slow, multi-pass cuts.' },
                6:  { pattern: 'wave',     cutLength: 28, cutGap: 3,   web: 4,   stagger: 50, note: 'Extremely stiff. Only gentle curves possible.' },
            }
        },
        bamboo: {
            name: 'Bamboo',
            brittle: false,
            recommendations: {
                2:  { pattern: 'straight', cutLength: 10, cutGap: 1.5, web: 2,   stagger: 50, note: 'Bamboo bends beautifully. Tight cuts work great.' },
                3:  { pattern: 'straight', cutLength: 14, cutGap: 2,   web: 2.5, stagger: 50, note: 'Excellent hinge material at this thickness.' },
                4:  { pattern: 'straight', cutLength: 16, cutGap: 2,   web: 3,   stagger: 50, note: 'Very reliable. Cross-grain adds strength.' },
                6:  { pattern: 'wave',     cutLength: 22, cutGap: 2.5, web: 3.5, stagger: 50, note: 'Use wave for better stress distribution.' },
            }
        },
        acrylic: {
            name: 'Acrylic',
            brittle: true,
            recommendations: {
                2:  { pattern: 'straight', cutLength: 14, cutGap: 2,   web: 3,   stagger: 50, note: 'Acrylic snaps easily. Wide webs are critical.' },
                3:  { pattern: 'straight', cutLength: 18, cutGap: 2.5, web: 3.5, stagger: 50, note: 'Only gentle bends. Heat the hinge area first.' },
                4:  { pattern: 'wave',     cutLength: 22, cutGap: 3,   web: 4,   stagger: 50, note: 'Fragile at 4mm. Consider cast acrylic only.' },
                6:  { pattern: 'wave',     cutLength: 28, cutGap: 4,   web: 5,   stagger: 50, note: 'Very fragile. Not recommended for tight bends.' },
            }
        },
        pvc: {
            name: 'PVC / Foam Board',
            brittle: false,
            recommendations: {
                2:  { pattern: 'straight', cutLength: 8,  cutGap: 1.5, web: 2,   stagger: 50, note: 'PVC is very flexible. Tight patterns work.' },
                3:  { pattern: 'straight', cutLength: 10, cutGap: 2,   web: 2,   stagger: 50, note: 'Great for prototyping. Cuts fast.' },
                4:  { pattern: 'straight', cutLength: 12, cutGap: 2,   web: 2.5, stagger: 50, note: 'Still very flexible at this thickness.' },
                6:  { pattern: 'straight', cutLength: 16, cutGap: 2.5, web: 3,   stagger: 50, note: 'Good flex even at 6mm. Reliable material.' },
            }
        },
        fiber: {
            name: 'Fiber Board',
            brittle: true,
            recommendations: {
                2:  { pattern: 'straight', cutLength: 12, cutGap: 2,   web: 2.5, stagger: 50, note: 'Similar to MDF. Standard settings work.' },
                3:  { pattern: 'straight', cutLength: 15, cutGap: 2.5, web: 3,   stagger: 50, note: 'Can be dusty to cut. Good ventilation needed.' },
                4:  { pattern: 'wave',     cutLength: 18, cutGap: 3,   web: 3.5, stagger: 50, note: 'Wave pattern helps at this thickness.' },
                6:  { pattern: 'wave',     cutLength: 24, cutGap: 3,   web: 4,   stagger: 50, note: 'Thick fiberboard is stiff. Use caution bending.' },
            }
        },
        cardboard: {
            name: 'Cardboard / Paperboard',
            brittle: false,
            recommendations: {
                1:  { pattern: 'straight', cutLength: 6,  cutGap: 1,   web: 1.5, stagger: 50, note: 'Thin card. Very tight cuts possible.' },
                2:  { pattern: 'straight', cutLength: 8,  cutGap: 1.5, web: 2,   stagger: 50, note: 'Corrugated works well. Watch for flare-ups.' },
                3:  { pattern: 'straight', cutLength: 10, cutGap: 2,   web: 2,   stagger: 50, note: 'Great for mockups and prototypes.' },
                4:  { pattern: 'straight', cutLength: 12, cutGap: 2,   web: 2.5, stagger: 50, note: 'Heavy cardboard. Low power, high speed.' },
            }
        }
    };

    function getRecommendation(materialKey, thickness) {
        const mat = MATERIAL_DB[materialKey];
        if (!mat) return null;
        const recs = mat.recommendations;
        const thicknesses = Object.keys(recs).map(Number).sort((a, b) => a - b);
        // Find nearest thickness
        let best = thicknesses[0];
        let bestDist = Math.abs(thickness - best);
        for (const t of thicknesses) {
            const d = Math.abs(thickness - t);
            if (d < bestDist) { bestDist = d; best = t; }
        }
        return { ...recs[best], materialName: mat.name, matchedThickness: best, brittle: mat.brittle };
    }

    // === RECOMMENDATION BUTTON ===
    recommendBtn.addEventListener('click', () => {
        const mat = materialInput.value;
        const thick = parseFloat(thicknessInput.value) || 3;
        const rec = getRecommendation(mat, thick);
        if (!rec) return;

        recommendationBox.style.display = 'block';
        recommendationBox.innerHTML = `
            <div class="rec-title">⚡ Recommended for ${rec.materialName} @ ${rec.matchedThickness}mm</div>
            <div class="rec-row"><span class="rec-key">Pattern</span><span class="rec-val">${rec.pattern}</span></div>
            <div class="rec-row"><span class="rec-key">Cut Length</span><span class="rec-val">${rec.cutLength} mm</span></div>
            <div class="rec-row"><span class="rec-key">Cut Gap</span><span class="rec-val">${rec.cutGap} mm</span></div>
            <div class="rec-row"><span class="rec-key">Web Thickness</span><span class="rec-val">${rec.web} mm</span></div>
            <div class="rec-row"><span class="rec-key">Stagger</span><span class="rec-val">${rec.stagger}%</span></div>
            <div class="rec-row" style="border:none; padding-top:0.4rem; color:var(--text-dim); font-style:italic;">${rec.note}</div>
            <button class="rec-apply" id="applyRecBtn">▶ APPLY SETTINGS</button>
        `;
        // Wire up the apply button
        $('applyRecBtn').addEventListener('click', () => {
            patternTypeInput.value = rec.pattern;
            cutLengthInput.value = rec.cutLength;
            cutGapInput.value = rec.cutGap;
            webThicknessInput.value = rec.web;
            staggerOffsetInput.value = rec.stagger;
            toggleConditionalParams();
            generateSVG();
        });
    });

    // === CONDITIONAL PARAMS TOGGLE ===
    function toggleConditionalParams() {
        beachBallParams.style.display = (patternTypeInput.value === 'beachball') ? 'block' : 'none';
        honeycombParams.style.display = (patternTypeInput.value === 'honeycomb') ? 'block' : 'none';
    }
    patternTypeInput.addEventListener('change', () => { toggleConditionalParams(); generateSVG(); });

    // === SVG GENERATION ===
    function generateSVG() {
        let width = parseFloat(widthInput.value) || 100;
        let height = parseFloat(heightInput.value) || 100;
        const cutLength = parseFloat(cutLengthInput.value) || 15;
        const cutGap = parseFloat(cutGapInput.value) || 3;
        const webThickness = parseFloat(webThicknessInput.value) || 3;
        const staggerPct = parseFloat(staggerOffsetInput.value) / 100 || 0.5;
        const patternType = patternTypeInput.value;
        const sphereDiameter = parseFloat(sphereDiameterInput?.value) || 100;
        const numGores = parseInt(numGoresInput?.value, 10) || 6;
        const sphereShape = sphereShapeInput?.value || 'hemisphere';
        const lineWidthVal = lineWidthInput.value;
        const exportStroke = (lineWidthVal === 'hairline') ? '0.001' : lineWidthVal;
        const previewStroke = (lineWidthVal === 'hairline') ? '0.05' : lineWidthVal;

        let equatorLength = 0, goreWidth = 0, goreHeight = 0;
        if (patternType === 'beachball') {
            equatorLength = Math.PI * sphereDiameter;
            goreWidth = equatorLength / numGores;
            goreHeight = (sphereShape === 'full')
                ? (Math.PI * sphereDiameter) / 2
                : (Math.PI * sphereDiameter) / 4;
            width = equatorLength;
            height = goreHeight;
        }

        previewSize.textContent = `${width.toFixed(1)} × ${height.toFixed(1)} mm`;

        let paths = [];
        const stepY = cutLength + cutGap;
        const offsetY = stepY * staggerPct;

        if (patternType === 'beachball') {
            generateBeachBall(paths, width, height, cutLength, cutGap, webThickness, staggerPct, goreWidth, numGores, sphereDiameter);
        } else {
            generateStandardPattern(paths, patternType, width, height, cutLength, cutGap, webThickness, stepY, offsetY);
            // Bounding rectangle
            paths.push(`<rect x="0" y="0" width="${width}" height="${height}" />`);
        }

        const svgPaths = paths.join('\n      ');

        // Export SVG (real stroke-width for laser)
        currentSvgString = buildSvg(width, height, svgPaths, exportStroke);

        // Preview SVG (visible stroke for display)
        previewContainer.innerHTML = buildSvg(width, height, svgPaths, previewStroke);

        previewHint.textContent = `${paths.length} paths generated`;
        statusChip.innerHTML = '<span class="status-dot"></span> READY';
    }

    function buildSvg(w, h, content, sw) {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}mm" height="${h}mm" viewBox="0 0 ${w} ${h}" style="overflow: visible;">
    <g stroke="#FF0000" stroke-width="${sw}" fill="none">
      ${content}
    </g>
</svg>`;
    }

    // === STANDARD PATTERNS (Straight, Wave, Honeycomb, Lattice) ===
    function generateStandardPattern(paths, type, width, height, cutLength, cutGap, webThickness, stepY, offsetY) {
        // Calculate number of columns to fill border edge-to-edge
        const numCols = Math.max(1, Math.floor(width / webThickness));
        // Recalculate actual spacing so columns are evenly distributed within width
        const actualSpacing = width / (numCols + 1);

        for (let col = 1; col <= numCols; col++) {
            const x = col * actualSpacing;
            const isOddCol = col % 2 !== 0;
            const yStart = isOddCol ? 0 : offsetY;

            for (let y = yStart - stepY; y < height + stepY; y += stepY) {
                const y1 = Math.max(0, y);
                const y2 = Math.min(height, y + cutLength);
                if (y1 >= y2) continue;

                if (type === 'straight') {
                    paths.push(`<path d="M ${x.toFixed(2)} ${y1.toFixed(2)} L ${x.toFixed(2)} ${y2.toFixed(2)}" />`);

                } else if (type === 'wave') {
                    const wavePeriod = stepY * 2;
                    const amplitude = actualSpacing * 0.4;
                    let d = '';
                    for (let wy = y1; wy <= y2; wy += 0.5) {
                        const wx = x + Math.sin(wy * Math.PI * 2 / wavePeriod) * amplitude;
                        d += (wy === y1) ? `M ${wx.toFixed(2)} ${wy.toFixed(2)}` : ` L ${wx.toFixed(2)} ${wy.toFixed(2)}`;
                    }
                    const endX = x + Math.sin(y2 * Math.PI * 2 / wavePeriod) * amplitude;
                    d += ` L ${endX.toFixed(2)} ${y2.toFixed(2)}`;
                    paths.push(`<path d="${d}" />`);

                } else if (type === 'honeycomb') {
                    const cellSize = parseFloat(cellSizeInput?.value) || 5;
                    const wavePeriod = cellSize;
                    const amplitude = cellSize * 0.5;
                    let d = '';
                    for (let wy = y1; wy <= y2; wy += 0.5) {
                        const phase = ((wy % wavePeriod) + wavePeriod) % wavePeriod / wavePeriod;
                        let offset;
                        if (phase < 0.25) offset = phase * 4;
                        else if (phase < 0.75) offset = 1 - (phase - 0.25) * 4;
                        else offset = -1 + (phase - 0.75) * 4;
                        const wx = x + offset * amplitude;
                        d += (wy === y1) ? `M ${wx.toFixed(2)} ${wy.toFixed(2)}` : ` L ${wx.toFixed(2)} ${wy.toFixed(2)}`;
                    }
                    const phaseEnd = ((y2 % wavePeriod) + wavePeriod) % wavePeriod / wavePeriod;
                    let offEnd;
                    if (phaseEnd < 0.25) offEnd = phaseEnd * 4;
                    else if (phaseEnd < 0.75) offEnd = 1 - (phaseEnd - 0.25) * 4;
                    else offEnd = -1 + (phaseEnd - 0.75) * 4;
                    d += ` L ${(x + offEnd * amplitude).toFixed(2)} ${y2.toFixed(2)}`;
                    paths.push(`<path d="${d}" />`);

                } else if (type === 'lattice') {
                    // Vertical arm
                    paths.push(`<path d="M ${x.toFixed(2)} ${y1.toFixed(2)} L ${x.toFixed(2)} ${y2.toFixed(2)}" />`);
                    // Horizontal arm — clamped so adjacent crosses never overlap
                    const cy = y1 + cutLength / 2;
                    const armHalf = Math.min(cutLength / 2, (actualSpacing - 0.2) / 2);
                    const hx1 = Math.max(0, x - armHalf);
                    const hx2 = Math.min(width, x + armHalf);
                    if (cy >= 0 && cy <= height) {
                        paths.push(`<path d="M ${hx1.toFixed(2)} ${cy.toFixed(2)} L ${hx2.toFixed(2)} ${cy.toFixed(2)}" />`);
                    }
                }
            }
        }
    }

    // === BEACH BALL PATTERN ===
    function generateBeachBall(paths, width, height, cutLength, cutGap, webThickness, staggerPct, goreWidth, numGores, sphereDiameter) {
        const cutStepX = cutLength + cutGap;
        const offsetX = cutStepX * staggerPct;
        const R = sphereDiameter / 2;

        for (let y = webThickness; y < height; y += webThickness) {
            const rowIndex = Math.round(y / webThickness);
            const xStart = (rowIndex % 2 === 0) ? 0 : offsetX;

            for (let x = xStart - cutStepX; x < width + cutStepX; x += cutStepX) {
                const x1 = x;
                const x2 = x + cutLength;

                for (let g = 0; g < numGores; g++) {
                    const cx = (g + 0.5) * goreWidth;
                    const hw = (goreWidth / 2) * Math.cos(y / R);
                    const gLeft = cx - hw;
                    const gRight = cx + hw;

                    const ix1 = Math.max(x1, gLeft);
                    const ix2 = Math.min(x2, gRight);
                    if (ix1 < ix2) {
                        paths.push(`<path d="M ${ix1.toFixed(2)} ${y.toFixed(2)} L ${ix2.toFixed(2)} ${y.toFixed(2)}" />`);
                    }
                }
            }
        }

        // Gore outlines
        for (let g = 0; g < numGores; g++) {
            const cx = (g + 0.5) * goreWidth;
            let d = '';
            for (let y = 0; y <= height; y += 1) {
                const hw = (goreWidth / 2) * Math.cos(y / R);
                const px = cx - hw;
                d += (y === 0) ? `M ${px.toFixed(2)} ${y.toFixed(2)}` : ` L ${px.toFixed(2)} ${y.toFixed(2)}`;
            }
            for (let y = height; y >= 0; y -= 1) {
                const hw = (goreWidth / 2) * Math.cos(y / R);
                d += ` L ${(cx + hw).toFixed(2)} ${y.toFixed(2)}`;
            }
            d += ' Z';
            paths.push(`<path d="${d}" />`);
        }
    }

    // === DOWNLOAD ===
    function downloadSVG() {
        if (!currentSvgString) return;
        const blob = new Blob([currentSvgString], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `hinge_${patternTypeInput.value}_${widthInput.value}x${heightInput.value}mm.svg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    downloadBtn.addEventListener('click', downloadSVG);

    // === AUTO-UPDATE ON ANY INPUT CHANGE ===
    const allInputs = [
        widthInput, heightInput, cutLengthInput, cutGapInput, webThicknessInput,
        staggerOffsetInput, patternTypeInput, lineWidthInput, cellSizeInput,
        sphereDiameterInput, numGoresInput, sphereShapeInput, materialInput, thicknessInput
    ];
    allInputs.forEach(el => {
        if (el) {
            el.addEventListener('input', generateSVG);
            el.addEventListener('change', generateSVG);
        }
    });

    // Initial render
    generateSVG();
});

function validateKeyPress(event) {
    var charCode = event.charCode || event.keyCode;
    if (charCode === 8 || charCode === 46 || charCode === 37 || charCode === 39 || charCode === 9) {
        return true;
    }
    var charStr = String.fromCharCode(charCode);
    var allowedChars = /[0-9,\[\]\s]/;
    if (allowedChars.test(charStr)) {
        return true;
    } else {
        event.preventDefault();
        return false;
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const inputField = document.getElementById("inputHeights");
    const inputSVGContainer = document.getElementById("inputSVGContainer");
    const outputSVGContainer = document.getElementById("outputSVGContainer");
    const totalWaterMsg = document.getElementById("totalWaterMsg");

    function renderUserInfo(container, title, infoObj) {
        let html = `<h3>${title}</h3>`;
        html += '<div>';
        for (const [key, value] of Object.entries(infoObj)) {
            html += `<strong>${key}:</strong> ${value}<br />`;
        }
        html += '</div>';
        container.innerHTML = html;
    }

    function renderVisualizations() {
        let inputStr = inputField.value || '';
        inputStr = inputStr.replace(/[\[\]\s]/g, '');
        let heights = inputStr.length > 0 ? inputStr.split(',').map(x => parseInt(x)) : [];

        let isValid = heights.length > 0 && heights.every(h => !isNaN(h) && h >= 0);

        if (!isValid) {
            inputSVGContainer.style.display = 'none';
            outputSVGContainer.style.display = 'none';
            totalWaterMsg.textContent = "";
            return;
        }

        const n = heights.length;
        const maxHeight = Math.max(...heights);

        function calculateTrappedWater(height) {
            let left = 0, right = n - 1;
            let leftMax = 0, rightMax = 0;
            let water = new Array(n).fill(0);

            while (left <= right) {
                if (height[left] < height[right]) {
                    if (height[left] >= leftMax) leftMax = height[left];
                    else water[left] = leftMax - height[left];
                    left++;
                } else {
                    if (height[right] >= rightMax) rightMax = height[right];
                    else water[right] = rightMax - height[right];
                    right--;
                }
            }
            return water;
        }

        const waterHeights = calculateTrappedWater(heights);
        const totalWater = waterHeights.reduce((a, b) => a + b, 0);

        inputSVGContainer.style.display = 'block';
        outputSVGContainer.style.display = 'block';

        // Show user info above SVG
        renderUserInfo(
            inputSVGContainer,
            "Input Visualization",
            {
                "Block Heights": `[${heights.join(', ')}]`,
                "Number of Blocks": n,
                "Maximum Block Height": maxHeight
            }
        );
        renderUserInfo(
            outputSVGContainer,
            "Output Visualization",
            {
                "Trapped Water Units": totalWater,
                "Number of Water Bars": waterHeights.filter(h => h > 0).length
            }
        );

        // Append SVGs
        inputSVGContainer.innerHTML += createInputSVG(heights, waterHeights, maxHeight, 30, n);
        outputSVGContainer.innerHTML += createOutputSVG(waterHeights, 30, n);

        // Dynamically update "Total Water Stored"
        totalWaterMsg.textContent = `Total Water Stored: ${totalWater} Units`;
    }

    function createInputSVG(heights, waterHeights, maxHeight, cellSize, n) {
        const svgHeight = cellSize * maxHeight;
        const svgWidth = cellSize * n;
        let svg = `<svg width="${svgWidth}" height="${svgHeight}">`;

        for (let col = 0; col < n; col++) {
            let blockHeight = heights[col];
            let waterHeight = waterHeights[col];

            for (let row = 0; row < maxHeight; row++) {
                let y = svgHeight - (row + 1) * cellSize;
                if (row < blockHeight) {
                    svg += `<rect x="${col * cellSize}" y="${y}" width="${cellSize}" height="${cellSize}" fill="#2980b9" />`;
                } else if (row < (blockHeight + waterHeight)) {
                    svg += `<rect x="${col * cellSize}" y="${y}" width="${cellSize}" height="${cellSize}" fill="#f1c40f" />`;
                }
            }
        }

        for (let i = 0; i <= n; i++) {
            svg += `<line x1="${i * cellSize}" y1="0" x2="${i * cellSize}" y2="${svgHeight}" stroke="#ccc" stroke-width="1"/>`;
        }
        for (let i = 0; i <= maxHeight; i++) {
            svg += `<line x1="0" y1="${svgHeight - i * cellSize}" x2="${svgWidth}" y2="${svgHeight - i * cellSize}" stroke="#ccc" stroke-width="1"/>`;
        }
        svg += `</svg>`;
        return svg;
    }

    function createOutputSVG(waterHeights, cellSize, n) {
        const maxWaterHeight = Math.max(...waterHeights);
        const svgHeight = cellSize * maxWaterHeight;
        const svgWidth = cellSize * n;
        let svg = `<svg width="${svgWidth}" height="${svgHeight}">`;

        for (let col = 0; col < n; col++) {
            let wHeight = waterHeights[col];
            for (let row = 0; row < maxWaterHeight; row++) {
                let y = svgHeight - (row + 1) * cellSize;
                if (row < wHeight) {
                    svg += `<rect x="${col * cellSize}" y="${y}" width="${cellSize}" height="${cellSize}" fill="#2980b9" />`;
                }
            }
        }

        for (let i = 0; i <= n; i++) {
            svg += `<line x1="${i * cellSize}" y1="0" x2="${i * cellSize}" y2="${svgHeight}" stroke="#ccc" stroke-width="1"/>`;
        }
        for (let i = 0; i <= maxWaterHeight; i++) {
            svg += `<line x1="0" y1="${svgHeight - i * cellSize}" x2="${svgWidth}" y2="${svgHeight - i * cellSize}" stroke="#ccc" stroke-width="1"/>`;
        }
        svg += `</svg>`;
        return svg;
    }

    renderVisualizations();
    inputField.addEventListener('input', renderVisualizations);
});

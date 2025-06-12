function generateRandomArray(rows, cols, minVal, maxVal) {
    const arr = [];
    for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < cols; j++) {
            const random = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
            row.push(random);
        }
        arr.push(row);
    }
    return arr;
}

function analyzeArray(arr) {
    let globalMin = Infinity;
    const minRows = new Set();
    const results = [];

    for (let rowIndex = 0; rowIndex < arr.length; rowIndex++) {
        const row = arr[rowIndex];
        let minPositive = Infinity;
        let currentSign = null;
        let currentLength = 0;
        let replacements = 0;

        for (let j = 0; j < row.length; j++) {
            const num = row[j];

            // 1. Обновляем глобальный минимум и строки с ним
            if (num < globalMin) {
                globalMin = num;
                minRows.clear();
                minRows.add(rowIndex+1);
            } else if (num === globalMin) {
                minRows.add(rowIndex+1);
            }

            // 2. Находим минимальное положительное в строке
            if (num > 0 && num < minPositive) {
                minPositive = num;
            }

            // 3. Подсчет замен для последовательностей
            if (num === 0) {
                if (currentSign !== null && currentLength >= 3) {
                    replacements += Math.floor(currentLength / 3);
                }
                currentSign = null;
                currentLength = 0;
            } else {
                const sign = num > 0 ? '+' : '-';
                if (sign === currentSign) {
                    currentLength++;
                } else {
                    if (currentSign !== null && currentLength >= 3) {
                        replacements += Math.floor(currentLength / 3);
                    }
                    currentSign = sign;
                    currentLength = 1;
                }
            }
        }

        // Проверка последовательности в конце строки
        if (currentSign !== null && currentLength >= 3) {
            replacements += Math.floor(currentLength / 3);
        }

        results.push({
            formattedRow: row.map(n => n.toString().padStart(4)).join(' '),
            minPositive: minPositive === Infinity ? '-' : minPositive,
            replacements,
        });
    }

    return { results, globalMin, minRows };
}

// Вывод
function printAnalysis(results, globalMin, minRows) {
    console.log('='.repeat(120));
    console.log('Стр | Массив значений'.padEnd(65) + '| Мин. положит. | Замен для 3+ подряд |');
    console.log('-'.repeat(120));

    results.forEach((res) => {
        const rowStr = res.row.map(n => n.toString().padStart(4)).join(' ');
        const mark = minRows.has(res.rowIndex) ? '*' : ' ';
        console.log(
            `${String(res.rowIndex + 1).padStart(3)} | ${rowStr} ${mark} | ${String(res.minPositive).padStart(14)} | ${String(res.replacements).padStart(22)} |`
        );
    });

    console.log('='.repeat(120));
    console.log(`Глобальный минимум: ${globalMin}`);
    console.log(`Строки с минимумом: ${Array.from(minRows).map(i => i + 1).join(', ')}`);
}

const arr = generateRandomArray(10, 10, -100, 100);


const { results, globalMin, minRows } = analyzeArray(arr);

console.log('='.repeat(80));
results.forEach((res, rowIndex) => {
    console.log(`${res.formattedRow} ${minRows.has(rowIndex+1) ? '* ' : '  '} MinPos: ${res.minPositive} Replacements: ${res.replacements}`);
});
console.log('='.repeat(80));
console.log(`Глобальный минимум: ${globalMin}`);
console.log(`Строки с минимумом: ${Array.from(minRows).join(', ')}`);
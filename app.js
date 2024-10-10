// app.js

document.addEventListener('DOMContentLoaded', () => {
    // 初期状態で結果セクションと「条件を変更」ボタンを非表示にする
    document.getElementById('results').style.display = 'none';
    document.getElementById('modify-conditions').style.display = 'none';

    const ranksDiv = document.getElementById('ranks');
    const addRankBtn = document.getElementById('add-rank');
    const calculateBtn = document.getElementById('calculate');
    const modifyConditionsBtn = document.getElementById('modify-conditions');
    const averageRankDiv = document.getElementById('average-rank');
    const combinationsDiv = document.getElementById('combinations');
    const trashBin = document.getElementById('trash-bin');
    const addRankModal = document.getElementById('add-rank-modal');
    const imageSelectionDiv = document.getElementById('image-selection');
    const confirmAddRankBtn = document.getElementById('confirm-add-rank');
    const cancelAddRankBtn = document.getElementById('cancel-add-rank');
    const modifyBtn = document.querySelector('#results .modify-btn');

    const MAX_COMBINATIONS = 1000; // 表示する組み合わせの最大数

    // ランクごとの画像グループ
    const rankImageGroups = [
        { rank: "レディアント", images: ["rediant.png"] },
        { rank: "イモータル", images: ["imo3.png", "imo2.png", "imo1.png"] },
        { rank: "アセンダント", images: ["ase3.png", "ase2.png", "ase1.png"] },
        { rank: "ダイヤ", images: ["dia3.png", "dia2.png", "dia1.png"] },
        { rank: "プラチナ", images: ["plat3.png", "plat2.png", "plat1.png"] },
        { rank: "ゴールド", images: ["gold3.png", "gold2.png", "gold1.png"] },
        { rank: "シルバー", images: ["silv.png"] },
        { rank: "ブロンズ", images: ["bronz.png"] },
        { rank: "アイアン", images: ["iron.png"] }
    ];

    // 初期ランク名と対応する画像ファイル名のリスト
    const initialRanks = [
        { name: "レディアント", image: "rediant.png" },
        { name: "イモータル", image: "imo1.png" },
        { name: "アセンダント", image: "ase1.png" },
        { name: "ダイヤ", image: "dia1.png" },
        { name: "プラチナ", image: "plat1.png" },
        { name: "ゴールド", image: "gold1.png" },
        { name: "シルバー", image: "silv.png" },
        { name: "ブロンズ", image: "bronz.png" },
        { name: "アイアン", image: "iron.png" }
    ];

    // 追加可能な画像ファイル名のリスト
    const imageFiles = [
        "ase1.png",
        "ase2.png",
        "ase3.png",
        "bronz.png",
        "dia1.png",
        "dia2.png",
        "dia3.png",
        "gold1.png",
        "gold2.png",
        "gold3.png",
        "imo1.png",
        "imo2.png",
        "imo3.png",
        "iron.png",
        "plat1.png",
        "plat2.png",
        "plat3.png",
        "rediant.png",
        "silv.png"
    ];

    // 初期ランクを追加
    initialRanks.forEach(rank => addRankInput(rank.name, `image/${rank.image}`));

    // 「ランクを追加」ボタンのクリックイベント
    addRankBtn.addEventListener('click', () => {
        openAddRankModal();
    });

    // モーダル内の「追加」ボタンのクリックイベント
    confirmAddRankBtn.addEventListener('click', () => {
        const selectedImage = document.querySelector('.image-option.selected');
        if (!selectedImage) {
            alert('画像を選択してください。');
            return;
        }
        const imageName = selectedImage.getAttribute('data-image');
        addRankInput('', `image/${imageName}`);
        closeAddRankModal();
        saveData(); // データを保存
    });

    // モーダル内の「キャンセル」ボタンのクリックイベント
    cancelAddRankBtn.addEventListener('click', () => {
        closeAddRankModal();
    });

    // モーダル外をクリックしたときにモーダルを閉じる
    window.addEventListener('click', (event) => {
        if (event.target === addRankModal) {
            closeAddRankModal();
        }
    });

    // 「条件を変更」ボタン（計算ボタンの下）のクリックイベント
    modifyConditionsBtn.addEventListener('click', () => {
        // 結果セクションを非表示にし、ランク設定セクションを再表示
        document.getElementById('results').style.display = 'none';
        document.getElementById('rank-settings').style.display = 'block';
        modifyConditionsBtn.classList.add('hidden');
    });

    // 「条件を変更」ボタン（結果セクション内）のクリックイベント
    modifyBtn.addEventListener('click', () => {
        // 結果セクションを非表示にし、ランク設定セクションを再表示
        document.getElementById('results').style.display = 'none';
        document.getElementById('rank-settings').style.display = 'block';
        modifyConditionsBtn.classList.add('hidden');
    });

    // モーダルを開く関数
    function openAddRankModal() {
        // 画像選択オプションをクリア
        imageSelectionDiv.innerHTML = '';
        // ランクごとに画像をグループ化して表示
        rankImageGroups.forEach(group => {
            const groupDiv = document.createElement('div');
            groupDiv.classList.add('rank-group');

            const groupTitle = document.createElement('div');
            groupTitle.classList.add('rank-group-title');
            groupTitle.textContent = group.rank;
            groupDiv.appendChild(groupTitle);

            const imagesDiv = document.createElement('div');
            imagesDiv.classList.add('rank-images');

            group.images.forEach(imageName => {
                const img = document.createElement('img');
                img.src = `image/${imageName}`;
                img.alt = imageName;
                img.width = 80;
                img.height = 80;
                img.classList.add('image-option');
                img.setAttribute('data-image', imageName);
                img.addEventListener('click', () => {
                    // 同じランク内の他の画像の選択を解除
                    const siblingImages = imagesDiv.querySelectorAll('.image-option');
                    siblingImages.forEach(image => {
                        image.classList.remove('selected');
                        image.style.border = '2px solid transparent';
                    });
                    // クリックされた画像を選択
                    img.classList.add('selected');
                    img.style.border = '2px solid #007BFF';
                });
                imagesDiv.appendChild(img);
            });

            groupDiv.appendChild(imagesDiv);
            imageSelectionDiv.appendChild(groupDiv);
        });
        addRankModal.style.display = 'flex';
    }

    // モーダルを閉じる関数
    function closeAddRankModal() {
        addRankModal.style.display = 'none';
    }

    // 計算ボタンのクリックイベント
    calculateBtn.addEventListener('click', () => {
        const ranks = getRanks();
        const maxPoint = parseInt(document.getElementById('max-point').value);

        if (!validateInput(ranks, maxPoint)) return;

        const average = calculateAverage(ranks);
        averageRankDiv.innerHTML = `<strong>ランクの平均ポイント:</strong> ${average.toFixed(2)}`;

        const combinations = generateCombinations(ranks, maxPoint);
        displayCombinations(combinations, maxPoint);

        // ランク設定セクションを非表示にし、結果セクションを表示
        document.getElementById('rank-settings').style.display = 'none';
        document.getElementById('results').style.display = 'block';
        modifyConditionsBtn.classList.remove('hidden');

        saveData(); // データを保存
    });

    // ランク入力フィールドを追加する関数
    function addRankInput(initialName = "", imageName = "https://via.placeholder.com/50") {
        const div = document.createElement('div');
        div.className = 'rank-input draggable';
        div.setAttribute('draggable', 'true');

        div.innerHTML = `
            <img src="${imageName !== "" ? `${imageName}` : "https://via.placeholder.com/50"}" alt="ランク画像" class="rank-image">
            <input type="text" class="rank-name" placeholder="ランク名" value="${initialName}">
            <input type="number" class="rank-point" placeholder="ポイント" min="1">
            <div class="limit-section">
                <input type="checkbox" class="limit-checkbox">
                <input type="number" class="limit-number" placeholder="人数制限" min="1" disabled>
            </div>
            <button class="delete-btn">削除</button>
        `;
        ranksDiv.appendChild(div);

        // イベントリスナーの追加
        const img = div.querySelector('.rank-image');
        const deleteBtn = div.querySelector('.delete-btn');
        const limitCheckbox = div.querySelector('.limit-checkbox');
        const limitNumber = div.querySelector('.limit-number');

        img.addEventListener('click', () => {
            // 選択状態の切り替え
            document.querySelectorAll('.rank-image').forEach(image => {
                image.classList.remove('selected');
                image.style.border = '2px solid transparent';
            });
            img.classList.toggle('selected');
            if (img.classList.contains('selected')) {
                img.style.border = '2px solid #007BFF';
            } else {
                img.style.border = '2px solid transparent';
            }
            saveData(); // データを保存
        });

        // 削除ボタンの機能
        deleteBtn.addEventListener('click', () => {
            if (confirm('このランクを削除しますか？')) {
                ranksDiv.removeChild(div);
                saveData(); // データを保存
            }
        });

        // 人数制限のチェックボックスの機能
        limitCheckbox.addEventListener('change', () => {
            if (limitCheckbox.checked) {
                limitNumber.disabled = false;
            } else {
                limitNumber.disabled = true;
                limitNumber.value = '';
            }
            saveData(); // データを保存
        });

        // 入力フィールドの変更時にデータを保存
        div.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', saveData);
        });

        // ドラッグイベントの設定
        div.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', null); // Firefox対応
            div.classList.add('dragging');
        });

        div.addEventListener('dragend', () => {
            div.classList.remove('dragging');
            saveData(); // データを保存
        });
    }

    // ゴミ箱へのドラッグオーバーとドロップイベント
    trashBin.addEventListener('dragover', (e) => {
        e.preventDefault();
        trashBin.classList.add('hover');
    });

    trashBin.addEventListener('dragleave', () => {
        trashBin.classList.remove('hover');
    });

    trashBin.addEventListener('drop', (e) => {
        e.preventDefault();
        trashBin.classList.remove('hover');
        const draggingElement = document.querySelector('.dragging');
        if (draggingElement) {
            ranksDiv.removeChild(draggingElement);
            saveData(); // データを保存
        }
    });

    // ランク情報を取得する関数
    function getRanks() {
        const rankElements = document.querySelectorAll('.rank-input');
        const ranks = [];
        try {
            rankElements.forEach(el => {
                const name = el.querySelector('.rank-name').value.trim();
                const point = parseInt(el.querySelector('.rank-point').value);
                const imageSrc = el.querySelector('.rank-image').src;
                const isLimited = el.querySelector('.limit-checkbox').checked;
                const limitNumber = parseInt(el.querySelector('.limit-number').value);
                if (name && !isNaN(point)) {
                    if (isLimited && (isNaN(limitNumber) || limitNumber <= 0)) {
                        alert(`ランク "${name}" の人数制限が有効ですが、正しい人数を入力してください。`);
                        throw new Error('Invalid limit number');
                    }
                    ranks.push({ 
                        name, 
                        point, 
                        image: imageSrc, 
                        isLimited, 
                        limitNumber: isLimited ? limitNumber : null 
                    });
                }
            });
        } catch (error) {
            return [];
        }

        // ランクをポイントの降順にソート（高ランクから低ランク）
        ranks.sort((a, b) => b.point - a.point);

        return ranks;
    }

    // 入力値を検証する関数
    function validateInput(ranks, maxPoint) {
        // 最低限のランク数の制限を解除
        /*
        if (ranks.length < 5) {
            alert('少なくとも5つのランクを設定してください。');
            return false;
        }
        */
        for (let rank of ranks) {
            if (!rank.name || isNaN(rank.point) || rank.point <= 0) {
                alert('全てのランクに有効な名前とポイントを設定してください。');
                return false;
            }
            if (rank.isLimited && (isNaN(rank.limitNumber) || rank.limitNumber <= 0)) {
                alert(`ランク "${rank.name}" の人数制限が有効ですが、正しい人数を入力してください。`);
                return false;
            }
        }
        if (isNaN(maxPoint) || maxPoint <= 0) {
            alert('有効な最大ポイントを設定してください。');
            return false;
        }
        return true;
    }

    // 平均ポイントを計算する関数
    function calculateAverage(ranks) {
        const total = ranks.reduce((sum, rank) => sum + rank.point, 0);
        return total / ranks.length;
    }

    /**
     * 組み合わせ生成ロジック
     * 各組み合わせのポイント合計がmaxPointに一致する5人の組み合わせを生成
     * 人数制限を考慮
     */
    function generateCombinations(ranks, maxPoint) {
        const combinations = [];

        const N = ranks.length;

        function backtrack(start, selected, currentSum, limits) {
            if (selected.length === 5) {
                if (currentSum === maxPoint) {
                    combinations.push([...selected]);
                }
                return;
            }

            for (let i = start; i < N; i++) {
                const rank = ranks[i];
                
                // 人数制限のチェック
                if (rank.isLimited) {
                    if (!limits[rank.name]) {
                        limits[rank.name] = 0;
                    }
                    if (limits[rank.name] >= rank.limitNumber) {
                        continue; // 制限人数に達している場合はスキップ
                    }
                }

                if (currentSum + rank.point > maxPoint) {
                    continue; // 合計が最大ポイントを超える場合はスキップ
                }

                selected.push(rank);
                if (rank.isLimited) {
                    limits[rank.name]++;
                }
                backtrack(i, selected, currentSum + rank.point, limits);
                selected.pop();
                if (rank.isLimited) {
                    limits[rank.name]--;
                }

                if (combinations.length >= MAX_COMBINATIONS) {
                    return; // 上限に達したら終了
                }
            }
        }

        backtrack(0, [], 0, {});

        return combinations;
    }

    // 組み合わせを表示する関数
    function displayCombinations(combinations, maxPoint) {
        if (combinations.length === 0) {
            combinationsDiv.innerHTML = '<p>有効な組み合わせが見つかりませんでした。</p>';
            return;
        }

        const table = document.createElement('table');
        const header = table.insertRow();
        for (let i = 1; i <= 5; i++) {
            const th = document.createElement('th');
            th.textContent = `プレイヤー ${i}`;
            header.appendChild(th);
        }
        table.appendChild(header);

        combinations.forEach(combo => {
            const row = table.insertRow();
            combo.forEach(player => {
                const cell = row.insertCell();
                cell.innerHTML = `<img src="${player.image}" alt="${player.name}" width="40" height="40"><br>${player.name} (${player.point})`;
            });
            table.appendChild(row);
        });

        // ランクの平均ポイントを計算（maxPoint / 5）
        const averagePoint = maxPoint / 5;
        averageRankDiv.innerHTML = `<strong>ランクの平均ポイント:</strong> ${averagePoint.toFixed(2)}`;
        combinationsDiv.innerHTML = `<p>表示された組み合わせ数: ${combinations.length}</p>`;
        combinationsDiv.appendChild(table);
    }

    // データを保存する関数
    function saveData() {
        const ranks = [];
        const rankElements = document.querySelectorAll('.rank-input');
        rankElements.forEach(el => {
            const name = el.querySelector('.rank-name').value.trim();
            const point = el.querySelector('.rank-point').value;
            const imageSrc = el.querySelector('.rank-image').src;
            const isLimited = el.querySelector('.limit-checkbox').checked;
            const limitNumber = el.querySelector('.limit-number').value;
            if (name && point) {
                ranks.push({
                    name: name,
                    point: point,
                    image: imageSrc,
                    isLimited: isLimited,
                    limitNumber: isLimited ? limitNumber : null
                });
            }
        });

        const maxPoint = document.getElementById('max-point').value;

        const data = {
            ranks: ranks,
            maxPoint: maxPoint
        };

        localStorage.setItem('fpsTeamData', JSON.stringify(data));
    }

    // データをロードする関数
    function loadData() {
        const dataString = localStorage.getItem('fpsTeamData');
        if (dataString) {
            const data = JSON.parse(dataString);
            if (data.ranks && Array.isArray(data.ranks)) {
                ranksDiv.innerHTML = ''; // 既存のランクをクリア
                data.ranks.forEach(rank => {
                    addRankInput(rank.name, rank.image);
                    const lastRank = ranksDiv.lastChild;
                    lastRank.querySelector('.rank-point').value = rank.point;
                    lastRank.querySelector('.limit-checkbox').checked = rank.isLimited;
                    if (rank.isLimited) {
                        lastRank.querySelector('.limit-number').disabled = false;
                        lastRank.querySelector('.limit-number').value = rank.limitNumber;
                    }
                });
            }
            if (data.maxPoint) {
                document.getElementById('max-point').value = data.maxPoint;
            }
        }
    }

    // ページロード時にデータをロード
    loadData();

    // ランク設定セクションを再表示した際に表示を更新
    modifyConditionsBtn.addEventListener('click', () => {
        modifyConditionsBtn.classList.add('hidden');
    });

    modifyBtn.addEventListener('click', () => {
        modifyConditionsBtn.classList.add('hidden');
    });

});

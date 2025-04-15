const LOTTERY_RULES = {
    ssq: {
        name: "双色球",
        main: {
            total: 33,      // 红球总数
            select: 6       // 选6个红球
        },
        extra: {
            total: 16,      // 蓝球总数
            select: 1       // 选1个蓝球
        },
        prizes: [
            { main: 6, extra: 1, level: "一等奖", prize: () => Math.floor(Math.random() * 5000000) + 5000000 },
            { main: 6, extra: 0, level: "二等奖", prize: () => Math.floor(Math.random() * 400000) + 100000 },
            { main: 5, extra: 1, level: "三等奖", prize: 3000 },
            { main: 5, extra: 0, level: "四等奖", prize: 200 },
            { main: 4, extra: 1, level: "四等奖", prize: 200 },
            { main: 4, extra: 0, level: "五等奖", prize: 10 },
            { main: 3, extra: 1, level: "五等奖", prize: 10 },
            { main: 0, extra: 1, level: "六等奖", prize: 5 },
            { main: 1, extra: 1, level: "六等奖", prize: 5 },
            { main: 2, extra: 1, level: "六等奖", prize: 5 }
        ]
    },
    dlt: {
        name: "大乐透",
        main: {
            total: 35,      // 前区总数
            select: 5       // 选5个前区
        },
        extra: {
            total: 12,      // 后区总数
            select: 2       // 选2个后区
        },
        prizes: [
            { main: 5, extra: 2, level: "一等奖", prize: () => Math.floor(Math.random() * 10000000) + 5000000 },
            { main: 5, extra: 1, level: "二等奖", prize: () => Math.floor(Math.random() * 500000) + 200000 },
            { main: 5, extra: 0, level: "三等奖", prize: 10000 },
            { main: 4, extra: 2, level: "四等奖", prize: 3000 },
            { main: 4, extra: 1, level: "五等奖", prize: 300 },
            { main: 3, extra: 2, level: "六等奖", prize: 200 },
            { main: 4, extra: 0, level: "七等奖", prize: 100 },
            { main: 3, extra: 1, level: "八等奖", prize: 15 },
            { main: 2, extra: 2, level: "八等奖", prize: 15 },
            { main: 3, extra: 0, level: "九等奖", prize: 5 },
            { main: 1, extra: 2, level: "九等奖", prize: 5 },
            { main: 2, extra: 1, level: "九等奖", prize: 5 },
            { main: 0, extra: 2, level: "九等奖", prize: 5 }
        ]
    }
};

const domCache = {
    ssq: {
        mainContainer: null,
        extraContainer: null,
        selectedArea: null,
		drawBalls:null
    },
    dlt: {
        mainContainer: null,
        extraContainer: null,
        selectedArea: null,
		drawBalls:null
    },
};

// 显示模拟器
function showSimulator(type) {
	document.getElementById('home').classList.remove('active');
	document.getElementById('ssq-simulator').classList.remove('active');
	document.getElementById('dlt-simulator').classList.remove('active');

	document.getElementById(type + '-simulator').classList.add('active');
}

// 返回首页
function backToHome() {
	document.getElementById('home').classList.add('active');
	document.getElementById('ssq-simulator').classList.remove('active');
	document.getElementById('dlt-simulator').classList.remove('active');
}

// 显示警告信息
function showAlert(type, message) {
	const alert = document.getElementById(`${type}-alert`);
	alert.textContent = message;
	alert.style.display = 'block';
	alert.scrollIntoView({
		behavior:'smooth',
		block:'center'
	});
	setTimeout(() => {
		alert.style.display = 'none';
	}, 3000);
}

// 初始化页面
document.addEventListener('DOMContentLoaded', function() {
	// 双色球
	domCache.ssq.mainContainer = document.getElementById('ssq-red');
	domCache.ssq.extraContainer = document.getElementById('ssq-blue');
	domCache.ssq.selectedArea = document.getElementById('ssq-selected');
	domCache.ssq.drawBalls = document.getElementById('ssq-draw-balls');
	
	// 大乐透
	domCache.dlt.mainContainer = document.getElementById('dlt-front');
	domCache.dlt.extraContainer = document.getElementById('dlt-back');
	domCache.dlt.selectedArea = document.getElementById('dlt-selected');
	domCache.dlt.drawBalls = document.getElementById('dlt-draw-balls');
	
    initBalls('ssq-red', 'ssq');
    initBalls('ssq-blue', 'ssq');
    initBalls('dlt-front', 'dlt');
    initBalls('dlt-back', 'dlt');
	
	document.getElementById('ssq-simulator').addEventListener('click', (e) => {
	    if (e.target.classList.contains('ball')) {
	        const containerId = e.target.parentElement.id;
	        const type = 'ssq';
	        toggleBallSelection(e.target, containerId, type);
	    }
	});
	document.getElementById('dlt-simulator').addEventListener('click', (e) => {
	    if (e.target.classList.contains('ball')) {
	        const containerId = e.target.parentElement.id;
	        const type = 'dlt';
	        toggleBallSelection(e.target, containerId, type);
	    }
	});
});

// 初始化号码球
function initBalls(containerId, type) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    const isMain = containerId.includes('red') || containerId.includes('front');
    const ballType = isMain ? 'main' : 'extra';
    const ballClass = isMain ? 'red-ball' : 'blue-ball';
    const total = LOTTERY_RULES[type][ballType].total;

    for (let i = 1; i <= total; i++) {
        const ball = document.createElement('div');
        ball.className = `ball ${ballClass}`;
        ball.textContent = i < 10 ? '0' + i : i;
        ball.dataset.number = i;
        container.appendChild(ball);
    }
}

// 切换号码球选择状态
function toggleBallSelection(ball, containerId, type) {
    const isMain = containerId.includes('red') || containerId.includes('front');
    const maxSelect = isMain ? LOTTERY_RULES[type].main.select : LOTTERY_RULES[type].extra.select;
    const selectedBalls = document.querySelectorAll(`#${containerId} .selected`);

    if (ball.classList.contains('selected')) {
        ball.classList.remove('selected');
    } else {
        if (selectedBalls.length >= maxSelect) {
            showAlert(type, `该区最多只能选择${maxSelect}个号码`);
            return;
        }
        ball.classList.add('selected');
    }
    updateSelectedNumbers(type);
}

// 更新已选号码显示
function updateSelectedNumbers(type) {
	const mainBalls = Array.from(domCache[type].mainContainer.querySelectorAll('.selected')).map(ball => parseInt(ball.textContent));
	const extraBalls = Array.from(domCache[type].extraContainer.querySelectorAll('.selected')).map(ball => parseInt(ball.textContent));
	const container=document.getElementById(`${type}-container`);
	const drawBalls=domCache[type].drawBalls;
	
	if(drawBalls.classList.length==1){
		renderBalls(drawBalls,mainBalls,extraBalls);
	}else{
		renderBalls(container,mainBalls,extraBalls);
		// 更新确认按钮状态
		const isComplete = mainBalls.length === LOTTERY_RULES[type].main.select && extraBalls.length === LOTTERY_RULES[type].extra.select;
		document.getElementById(`${type}-confirm`).className = isComplete? 'btn' : 'btn content';
	}
}

// 生成球
function renderBalls(container,mainBalls,extraBalls){
	// 清空容器时保留第一个子节点作为模板（减少创建新节点的开销）
	const template = container.firstElementChild?.cloneNode() || document.createElement('div');
	container.innerHTML = '';
	
	mainBalls.forEach(num => {
		const ball = template.cloneNode();
		ball.className = 'ball red-ball';
		ball.textContent = num < 10 ? '0' + num : num;
		container.appendChild(ball);
	});
	
	extraBalls.forEach(num => {
		const ball = template.cloneNode();
		ball.className = 'ball blue-ball';
		ball.textContent = num < 10 ? '0' + num : num;
		container.appendChild(ball);
	});
}

function randomSelect(containerId, type) {
    const container = document.getElementById(containerId);
    const isMain = containerId.includes('red') || containerId.includes('front');
    const maxSelect = isMain ? LOTTERY_RULES[type].main.select : LOTTERY_RULES[type].extra.select;
    const balls = container.querySelectorAll('.ball');

    // 清除已选
    balls.forEach(ball => ball.classList.remove('selected'));

    // 随机选择
    const availableBalls = Array.from(balls);
    for (let i = 0; i < maxSelect; i++) {
        const randomIndex = Math.floor(Math.random() * availableBalls.length);
        availableBalls[randomIndex].classList.add('selected');
        availableBalls.splice(randomIndex, 1);
    }
    updateSelectedNumbers(type);
}

function randomSelectAll(type) {
    randomSelect(`${type}-${type === 'ssq' ? 'red' : 'front'}`, type);
    randomSelect(`${type}-${type === 'ssq' ? 'blue' : 'back'}`, type);
    setTimeout(() => ConfirmNumber(type), 90);
}

// 批量随机选择
function batchRandomSelect(type, count) {
	let i = 0;
	function animate() {
		if (i < count) {
			setTimeout(()=>{
				randomSelectAll(type);
				i++;
				requestAnimationFrame(animate);
			},100)
		}
	}
	requestAnimationFrame(animate);
}

// 生成一注选定号码卡片
function ConfirmNumber(type) {
	const oSelected = domCache[type].selectedArea;
	const oBalls=document.getElementById(`${type}-container`);
	if(oBalls.hasChildNodes()){
		const oCard=oBalls.cloneNode(true);
		oCard.classList=`ball-container card ${type}-card`;
		oCard.addEventListener('dblclick',function(e){
			if(e.target.classList.contains('card')){
				e.target.remove();
				showAlert(type,'已删除一注号码！');
			}else if(e.target.classList.contains('ball')){
				e.target.parentNode.remove();
				showAlert(type,'已删除一注号码！');
			}else{
				return;
			}
			updataBetCount(type);
		})
		oSelected.prepend(oCard);
	}else{
		return;
	}
	
	resetNumber(type);
	updateSelectedNumbers(type);
	updataBetCount(type);
}

//重置选号球选中状态
function resetNumber(type) {
	const { mainContainer, extraContainer } = domCache[type];
	mainContainer.querySelectorAll('.selected').forEach(ball => ball.classList.remove('selected'));
	extraContainer.querySelectorAll('.selected').forEach(ball => ball.classList.remove('selected'));
}
// 更新已选号码注数
function updataBetCount(type) {
	document.getElementById(`${type}-sum-number`).textContent = document.getElementsByClassName(`${type}-card`).length;
}
//重置选号
function resetSelectedCard(type) {
	document.getElementById(`${type}-selected`).textContent = '';
}
// 重置选择
function resetSelection(type) {
	resetNumber(type);
	updateSelectedNumbers(type);
	resetSelectedCard(type);
	updataBetCount(type);
	
	// 重置开奖结果
	document.getElementById(type + '-result').style.display = 'none';
}

// 生成随机号码
function generateRandomNumbers(min, max, count) {
    const arr = Array.from({ length: max }, (_, i) => i + 1);
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.slice(0, count).sort((a, b) => a - b);
}

// 生成随机开奖号码
function drawNumber(type) {
	const { main, extra } = LOTTERY_RULES[type];
	const mainBalls = generateRandomNumbers(1, main.total, main.select);
	const extraBalls = generateRandomNumbers(1, extra.total, extra.select);
	
	domCache[type].drawBalls.textContent = '';
	renderBalls(domCache[type].drawBalls, mainBalls, extraBalls);
	
	return { mainBalls, extraBalls };
}

// 查看开奖号码
function showDraw(dom,type) {
	resetNumber(type);
	updateSelectedNumbers(type);
	
	const { mainContainer, extraContainer,drawBalls } = domCache[type];
	const dB=Array.from(drawBalls.children).map(ball=>ball.textContent);
	const mainDB=dB.slice(0,LOTTERY_RULES[type].main.select);
	const extraDB=dB.slice(LOTTERY_RULES[type].main.select);
	mainContainer.childNodes.forEach(ball=>{
		if(mainDB.includes(ball.textContent)){
			ball.classList.add('selected');
		}
	})
	extraContainer.childNodes.forEach(ball=>{
		if(extraDB.includes(ball.textContent)){
			ball.classList.add('selected');
		}
	})
	
	const oDN = dom.children;
	oDN[1].classList.add('content');
	oDN[2].classList.remove('content');
	oDN[3].classList.remove('content');
}
// 确认开奖号码
function checkNumber(type) {
	const newDrawNumber=domCache[type].drawBalls;
	let R=0,B=0;
	Array.from(newDrawNumber.childNodes).forEach(i=>{
		if(i.classList[1]=='red-ball'){
			R++;
		}
		if(i.classList[1]=='blue-ball'){
			B++;
		}
	})
	if((type=='ssq'&&R==6&&B==1)||(type=='dlt'&&R==5&&B==2)){
		showAlert(type,'保存成功！');
		resetNumber(type);
	}else{
		showAlert(type,'选球不足，修改失败！');
		resetNumber(type);
		newDrawNumber.textContent='';
	}
	const oParent=document.getElementById(`${type}-draw`);
	oParent.children[1].classList.remove('content');
	oParent.children[2].classList.add('content');
	oParent.children[3].classList.add('content');
}

// 开奖
function drawLottery(type) {
	const { drawBalls, selectedArea } = domCache[type];
	
    // 1. 检查是否有选号
        if (selectedArea.children.length === 0) {
            showAlert(type, "请先选择号码！");
            return;
        }

    // 2. 生成或读取开奖号码
    let drawResult;
    if (domCache[type].drawBalls.children.length === 0) {
        drawResult = drawNumber(type);
    } else {
        drawResult = {
            mainBalls: Array.from(domCache[type].drawBalls.querySelectorAll('.red-ball'))
                .map(ball => parseInt(ball.textContent)),
            extraBalls: Array.from(domCache[type].drawBalls.querySelectorAll('.blue-ball'))
                .map(ball => parseInt(ball.textContent))
        };
    }

    // 3. 渲染结果
	const resBalls=document.getElementById(`${type}-result-balls`);
    renderBalls(resBalls, drawResult.mainBalls, drawResult.extraBalls);

    // 4. 计算中奖结果
    const results = Array.from(selectedArea.children).map(card => {
        const user = CardToNumber(card.children);
        return checkPrize(type, user.main, user.extra, drawResult.mainBalls, drawResult.extraBalls);
    });
	
    // 5. 显示结果
    showResult(type, results);
	
	// 6. 清空开奖容器
	domCache[type].drawBalls.textContent = '';
}

function CardToNumber(node){
	const main=[];
	const extra=[];
	Array.from(node).forEach(i=>{
		if(i.classList[1]=='red-ball'){
			main.push(parseInt(i.innerHTML));
		}else{
			extra.push(parseInt(i.innerHTML));
		}
	})
	return {main,extra};
}

// 中奖判断
function checkPrize(type, userMain, userExtra, drawMain, drawExtra) {
    const mainMatch = userMain.filter(num => drawMain.includes(num)).length;
    const extraMatch = userExtra.filter(num => drawExtra.includes(num)).length;

    for (const rule of LOTTERY_RULES[type].prizes) {
        if (mainMatch === rule.main && extraMatch === rule.extra) {
            return {
                level: rule.level,
                prize: typeof rule.prize === 'function' ? rule.prize() : rule.prize
            };
        }
    }
    return { level: "未中奖", prize: 0 };
}

// 显示中奖结果
function showResult(type,result) {
	const resultContainer = document.getElementById(`${type}-result`);
	resultContainer.style.display = 'block';
	const res=processLotteryResults(result);
	resultContainer.lastElementChild.innerHTML=generateResultText(res);
	resultContainer.scrollIntoView({
		behavior:'smooth',
		block:'end'
	});
}

function formatMoney(amount) {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function generateResultText(stats) {
    const lines = ["开奖结果统计："];
    
    // 处理中奖奖项
    Object.entries(stats.prizeLevels)
        .filter(([level]) => level !== "未中奖")
        .forEach(([level, info]) => {
            if (info.count > 0) {
                lines.push(`◎ ${level.padEnd(4)} ${info.count}注 × ${formatMoney(info.prize)}元`);
            }
        });

    // 添加未中奖和总计
    const noWin = stats.prizeLevels["未中奖"] || { count: 0 };
    lines.push(
        `<br/>未中奖：${noWin.count}注`,
        `<br/>总奖金：${formatMoney(stats.totalPrize)}元`
    );

    return lines.join('<br/>');
}

/*
 * 处理彩票开奖结果数据
 * @param {Array} results 开奖结果数组
 * @returns {Object} 包含奖项统计和总金额的对象
 */
function processLotteryResults(results) {
    // 初始化统计对象
    const stats = {
        prizeLevels: {},  // 各奖项统计
        totalPrize: 0     // 总奖金
    };

    // 遍历所有开奖结果
    results.forEach(result => {
        const level = result.level;
        const prize = parseInt(result.prize) || 0;

        // 统计各奖项数量
        if (!stats.prizeLevels[level]) {
            stats.prizeLevels[level] = {
                count: 0,
                prize: prize
            };
        }
        stats.prizeLevels[level].count++;

        // 累加总奖金
        stats.totalPrize += prize;
    });

    return stats;
}
// 显示模拟器
function showSimulator(type) {
	document.getElementById('home').classList.remove('active');
	document.getElementById('ssq-simulator').classList.remove('active');
	document.getElementById('dlt-simulator').classList.remove('active');

	document.getElementById(type + '-simulator').classList.add('active');

	drawNumber(type);
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

	setTimeout(() => {
		alert.style.display = 'none';
	}, 3000);
}

// 初始化号码球
function initBalls(containerId, max, ballClass) {
	const container = document.getElementById(containerId);
	container.innerHTML = '';

	for (let i = 1; i <= max; i++) {
		const ball = document.createElement('div');
		ball.className = `ball ${ballClass}`;
		ball.textContent = i < 10 ? '0' + i : i;
		ball.dataset.number = i;
		ball.addEventListener('click', function() {
			toggleBallSelection(this, containerId);
		});
		container.appendChild(ball);
	}
}

// 更新已选号码显示
function updateSelectedNumbers(type) {
	const redBalls = Array.from(document.querySelectorAll(`#${type}-${type === 'ssq' ? 'red' : 'front'} .selected`))
		.map(b => b.textContent);
	const blueBalls = Array.from(document.querySelectorAll(`#${type}-${type === 'ssq' ? 'blue' : 'back'} .selected`))
		.map(b => b.textContent);
	document.getElementById(`${type}-selected-${type === 'ssq' ? 'red' : 'front'}`).textContent = redBalls.join(' ');
	document.getElementById(`${type}-selected-${type === 'ssq' ? 'blue' : 'back'}`).textContent = blueBalls.join(' ');
	if (redBalls.length == (type === 'ssq' ? 6 : 5) && blueBalls.length == (type === 'ssq' ? 1 : 2)) {
		document.getElementById(`${type}-confirm`).classList.remove('content');
	} else {
		document.getElementById(`${type}-confirm`).classList.add('content');
	}
}

// 切换号码球选择状态
function toggleBallSelection(ball, containerId) {
	const type = containerId.split('-')[0];
	const isFrontOrRed = containerId.includes('front') || containerId.includes('red');
	const maxSelect = isFrontOrRed ? (type === 'ssq' ? 6 : 5) : (type === 'ssq' ? 1 : 2);
	const selectedBalls = document.querySelectorAll(`#${containerId} .selected`);

	if (ball.classList.contains('selected')) {
		ball.classList.remove('selected');
	} else {
		if (selectedBalls.length >= maxSelect) {
			showAlert(type, `最多只能选择${maxSelect}个号码`);
			return;
		}
		ball.classList.add('selected');
	}

	updateSelectedNumbers(type);
}

// 随机选择号码
function randomSelect(containerId, count) {
	const container = document.getElementById(containerId);
	const balls = container.querySelectorAll('.ball');
	const selectedBalls = container.querySelectorAll('.selected');

	// 先清除已选
	selectedBalls.forEach(ball => {
		ball.classList.remove('selected');
	});

	// 随机选择
	const availableBalls = Array.from(balls);
	for (let i = 0; i < count; i++) {
		const randomIndex = Math.floor(Math.random() * availableBalls.length);
		availableBalls[randomIndex].classList.add('selected');
		availableBalls.splice(randomIndex, 1);
	}
	const type = containerId.split('-')[0];
	updateSelectedNumbers(type);
}

// 随机选择一注
function randomSelectAll(type) {
	if (type === 'ssq') {
		randomSelect('ssq-red', 6);
		randomSelect('ssq-blue', 1);
	} else {
		randomSelect('dlt-front', 5);
		randomSelect('dlt-back', 2);
	}
	setTimeout(() => {
		ConfirmNumber(type);
	}, 300);
}

// 批量随机选择
function batchRandomSelect(type, count) {
	for (let i = 0; i < count; i++) {
		setTimeout(() => {
			randomSelectAll(type);
		}, i * 500);
	}
}

// 更新已选号码注数
function SNumber(type) {
	document.getElementById(`${type}-sum-number`).textContent = document.getElementsByClassName(`${type}-card`).length;
}
// 生成一注选定号码卡片
function ConfirmNumber(type) {
	const oCard = document.createElement('p');
	oCard.classList = `card ${type}-card`;
	oCard.addEventListener('dblclick', function(e) {
		e.target.remove();
		showAlert(type, '已删除一注号码！');
		SNumber(type);
	})
	const oSelected = document.getElementById(`${type}-selected`);
	const oRed = document.getElementById(`${type}-selected-${type === 'ssq' ? 'red' : 'front'}`);
	const oBlue = document.getElementById(`${type}-selected-${type === 'ssq' ? 'blue' : 'back'}`);
	if (oRed.textContent == '' || oBlue.textContent == '') {
		return;
	} else {
		oCard.textContent = oRed.textContent + '+' + oBlue.textContent;
		oSelected.appendChild(oCard);
	}
	resetNumber(type);
	updateSelectedNumbers(type);
	SNumber(type);
}

//重置选号球选中状态
function resetNumber(type) {
	if (type === 'ssq') {
		document.querySelectorAll('#ssq-red .selected, #ssq-blue .selected').forEach(ball => {
			ball.classList.remove('selected');
		});
	} else {
		document.querySelectorAll('#dlt-front .selected, #dlt-back .selected').forEach(ball => {
			ball.classList.remove('selected');
		});
	}
}
//重置选号
function resetSelectedCard(type) {
	document.getElementById(`${type}-selected`).innerHTML = '';
}
// 重置选择
function resetSelection(type) {
	resetNumber(type);
	updateSelectedNumbers(type);
	resetSelectedCard(type);
	SNumber(type);
	drawNumber(type);
	
	// 重置开奖结果
	document.getElementById(type + '-result').style.display = 'none';
}

// 初始化页面
document.addEventListener('DOMContentLoaded', function() {
	initBalls('ssq-red', 33, 'red-ball');
	initBalls('ssq-blue', 16, 'blue-ball');
	initBalls('dlt-front', 35, 'red-ball');
	initBalls('dlt-back', 12, 'blue-ball');
});

// 生成随机号码
function generateRandomNumbers(min, max, count) {
	const numbers = [];
	while (numbers.length < count) {
		const num = Math.floor(Math.random() * (max - min + 1)) + min;
		if (!numbers.includes(num)) {
			numbers.push(num);
		}
	}
	return numbers.sort((a, b) => a - b);
}
// 生成球
function Ball(container,mainBalls,extraBalls){
	container.innerHTML='';
	mainBalls.forEach(num => {
		const ball = document.createElement('div');
		ball.className = 'ball red-ball';
		ball.textContent = num < 10 ? '0' + num : num;
		container.appendChild(ball);
	});
	
	extraBalls.forEach(num => {
		const ball = document.createElement('div');
		ball.className = 'ball blue-ball';
		ball.textContent = num < 10 ? '0' + num : num;
		container.appendChild(ball);
	});
}
// 生成初始开奖号码
function drawNumber(type) {
	const mainBalls = generateRandomNumbers(1, (type == 'ssq' ? 33 : 35), (type == 'ssq' ? 6 : 5));
	const extraBalls = generateRandomNumbers(1, (type == 'ssq' ? 16 : 12), (type == 'ssq' ? 1 : 2));
	const drawBalls = document.getElementById(`${type}-draw-balls`);

	drawBalls.innerHTML = '';
	Ball(drawBalls,mainBalls,extraBalls);
	return {mainBalls,extraBalls};
}

// 查看开奖号码
function showDraw(e) {
	const oDN = e.children;
	oDN[1].classList.remove('content');
	oDN[2].classList.add('content');
	oDN[3].classList.remove('content');
}
// 确认开奖号码
function checkNumber(type) {
	showAlert(type, '暂不支持修改！');
	const oParent=document.getElementById(`${type}-draw`);
	oParent.children[1].classList.add('content');
	oParent.children[2].classList.remove('content');
	oParent.children[3].classList.add('content');
}

// 开奖
function drawLottery(type) {
	const oDrawNumber=drawNumber(type);
	const UserNumbers=document.getElementsByClassName(`${type}-card`);
	const res=document.getElementById(`${type}-result-balls`);
	Ball(res,oDrawNumber.mainBalls,oDrawNumber.extraBalls);
	const oRes=[];
	Array.from(UserNumbers).forEach((i,index)=>{
		const User=CardToNumber(i.textContent);
		oRes.push(checkPrize(type,User.main,User.extra,oDrawNumber.mainBalls,oDrawNumber.extraBalls));
		oRes[index].number=User;
	})
	showResult(type,oRes);
}

function CardToNumber(str){
	const main=[];
	const extra=[];
	const arr=str.split('+');
	arr[0].split(' ').forEach(i=>{
		main.push(parseInt(i));
	})
	arr[1].split(' ').forEach(j=>{
		extra.push(parseInt(j));
	})
	return {main,extra};
}
// 检查中奖情况
function checkPrize(type, userMain, userExtra, drawMain, drawExtra) {
	// 计算匹配的主区和附加区号码数量
	const mainMatch = userMain.filter(num => drawMain.includes(num)).length;
	const extraMatch = userExtra.filter(num => drawExtra.includes(num)).length;
	if(type==='ssq'){
		return checkSSQPrize(mainMatch,extraMatch);
	}else{
		return checkDLTPrize(mainMatch,extraMatch);
	}
}
// 显示中奖结果
function showResult(type,result) {
	const resultContainer = document.getElementById(`${type}-result`);
	resultContainer.style.display = 'block';
	const res=processLotteryResults(result);
	resultContainer.lastElementChild.innerHTML=generateResultText(res);
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
        `\n未中奖：${noWin.count}注`,
        `\n总奖金：${formatMoney(stats.totalPrize)}元`
    );

    return lines.join('\n');
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

// 大乐透中奖判断
function checkDLTPrize(mainMatch, extraMatch) {
	if (mainMatch === 5 && extraMatch === 2) return {
		level: "一等奖",
		prize: "浮动"
	};
	if (mainMatch === 5 && extraMatch === 1) return {
		level: "二等奖",
		prize: "浮动"
	};
	if (mainMatch === 5 && extraMatch === 0) return {
		level: "三等奖",
		prize: "10000"
	};
	if (mainMatch === 4 && extraMatch === 2) return {
		level: "四等奖",
		prize: "3000"
	};
	if (mainMatch === 4 && extraMatch === 1) return {
		level: "五等奖",
		prize: "300"
	};
	if (mainMatch === 3 && extraMatch === 2) return {
		level: "六等奖",
		prize: "200"
	};
	if (mainMatch === 4 && extraMatch === 0) return {
		level: "七等奖",
		prize: "100"
	};
	if ((mainMatch === 3 && extraMatch === 1) || (mainMatch === 2 && extraMatch === 2))
		return {
			level: "八等奖",
			prize: "15"
		};
	if ((mainMatch === 3 && extraMatch === 0) ||
		(mainMatch === 1 && extraMatch === 2) ||
		(mainMatch === 2 && extraMatch === 1) ||
		(mainMatch === 0 && extraMatch === 2))
		return {
			level: "九等奖",
			prize: "5"
		};

	return {
		level: "未中奖",
		prize: "0"
	};
}

// 双色球中奖判断
function checkSSQPrize(mainMatch, extraMatch) {
	if (mainMatch === 6 && extraMatch === 1) return {
		level: "一等奖",
		prize: "浮动"
	};
	if (mainMatch === 6 && extraMatch === 0) return {
		level: "二等奖",
		prize: "浮动"
	};
	if (mainMatch === 5 && extraMatch === 1) return {
		level: "三等奖",
		prize: "3000"
	};
	if ((mainMatch === 5 && extraMatch === 0) || (mainMatch === 4 && extraMatch === 1)) return {
		level: "四等奖",
		prize: "200"
	};
	if ((mainMatch === 4 && extraMatch === 0) || (mainMatch === 3 && extraMatch === 1)) return {
		level: "五等奖",
		prize: "10"
	};
	if (extraMatch === 1) return {
		level: "六等奖",
		prize: "5"
	};
	return {
		level: "未中奖",
		prize: "0"
	};
}
// 显示模拟器
function showSimulator(type) {
	document.getElementById('home').classList.remove('active');
	document.getElementById('ssq-simulator').classList.remove('active');
	document.getElementById('dlt-simulator').classList.remove('active');
	
	document.getElementById(type + '-simulator').classList.add('active');
	
	// 重置开奖结果
	// document.getElementById(type + '-result').style.display = 'none';
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

// 更新已选号码显示
function updateSelectedNumbers(type) {
	const redBalls = Array.from(document.querySelectorAll(`#${type}-${type === 'ssq' ? 'red' : 'front'} .selected`)).map(b => b.textContent);
	const blueBalls = Array.from(document.querySelectorAll(`#${type}-${type === 'ssq' ? 'blue' : 'back'} .selected`)).map(b => b.textContent);
	document.getElementById(`${type}-selected-${type === 'ssq' ? 'red' : 'front'}`).textContent = redBalls.join(' ');
	document.getElementById(`${type}-selected-${type === 'ssq' ? 'blue' : 'back'}`).textContent = blueBalls.join(' ');
	if(redBalls.length==(type==='ssq'?6:5)&&blueBalls.length==(type==='ssq'?1:2)){
		document.getElementById(`${type}-confirm`).classList.remove('content');
	}else{
		document.getElementById(`${type}-confirm`).classList.add('content');
	}
}
// 更新已选号码注数
function SNumber(type){
	document.getElementById(`${type}-sum-number`).textContent=document.getElementsByClassName(`${type}-card`).length;
}
function ConfirmNumber(type){
	// 生成一注选定号码卡片
	const oCard=document.createElement('p');
	oCard.classList=`card ${type}-card`;
	oCard.addEventListener('dblclick',function(e){
		e.target.remove();
		showAlert(type,'已删除一注号码！');
		SNumber(type);
	})
	if(type==='ssq'){
		const oSelected=document.getElementById('ssq-selected');
		const oRed=document.getElementById('ssq-selected-red');
		const oBlue=document.getElementById('ssq-selected-blue');
		if(oRed.textContent==''||oBlue.textContent==''){
			return;
		}else{
			oCard.textContent=oRed.textContent+'+'+oBlue.textContent;
			oSelected.appendChild(oCard);
		}
	}else{
		const oSelected=document.getElementById('dlt-selected');
		const oRed=document.getElementById('dlt-selected-front');
		const oBlue=document.getElementById('dlt-selected-back');
		if(oRed.textContent==''||oBlue.textContent==''){
			return;
		}else{
			oCard.textContent=oRed.textContent+'+'+oBlue.textContent;
			oSelected.appendChild(oCard);
		}
	}
	resetSelection(type);
	SNumber(type);
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

//重置选号
function resetNumber(type){
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
// 重置选择
function resetSelection(type) {
	resetNumber(type);
	updateSelectedNumbers(type);
}

// 初始化页面
document.addEventListener('DOMContentLoaded', function() {
	initBalls('ssq-red', 33, 'red-ball');
	initBalls('ssq-blue', 16, 'blue-ball');
	initBalls('dlt-front', 35, 'red-ball');
	initBalls('dlt-back', 12, 'blue-ball');
});






// 开奖
function drawLottery(type) {
	// 检查是否已选号
	const selectedMain = document.querySelectorAll(`#${type}-${type === 'ssq' ? 'red' : 'front'} .selected`);
	const selectedExtra = document.querySelectorAll(`#${type}-${type === 'ssq' ? 'blue' : 'back'} .selected`);
	
	const requiredMain = type === 'ssq' ? 6 : 5;
	const requiredExtra = type === 'ssq' ? 1 : 2;
	
	// if (selectedMain.length !== requiredMain || selectedExtra.length !== requiredExtra) {
	// 	showAlert(type, `请选择${requiredMain}个主区号码和${requiredExtra}个附加区号码`);
	// 	return;
	// }
	
	// 获取开奖号码（如果没有设置则随机生成）
	const drawContainer = document.getElementById(`${type}-draw-balls`);
	let mainBalls, extraBalls;
	
	if (drawContainer.dataset.mainBalls) {
		mainBalls = drawContainer.dataset.mainBalls.split(',').map(Number);
		extraBalls = drawContainer.dataset.extraBalls.split(',').map(Number);
	} else {
		// 随机生成开奖号码
		if (type === 'ssq') {
			mainBalls = generateRandomNumbers(1, 33, 6);
			extraBalls = generateRandomNumbers(1, 16, 1);
		} else {
			mainBalls = generateRandomNumbers(1, 35, 5);
			extraBalls = generateRandomNumbers(1, 12, 2);
		}
		displayDrawNumbers(type, mainBalls, extraBalls);
	}
	
	// 获取用户选择的号码
	const userMainBalls = Array.from(selectedMain).map(b => parseInt(b.textContent));
	const userExtraBalls = Array.from(selectedExtra).map(b => parseInt(b.textContent));
	
	// 比较中奖情况
	const result = checkPrize(type, userMainBalls, userExtraBalls, mainBalls, extraBalls);
	
	// 显示结果
	showResult(type, mainBalls, extraBalls, result);
}

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

// 检查中奖情况
function checkPrize(type, userMain, userExtra, drawMain, drawExtra) {
	// 计算匹配的主区和附加区号码数量
	const mainMatch = userMain.filter(num => drawMain.includes(num)).length;
	const extraMatch = userExtra.filter(num => drawExtra.includes(num)).length;
	
	// 双色球中奖判断
	function checkSSQPrize(ticket, draw) {
	    const matchedReds = ticket.redBalls.filter(num => draw.redBalls.includes(num)).length;
	    const matchedBlues = ticket.blueBalls.filter(num => draw.blueBalls.includes(num)).length;
	    
	    if (matchedReds === 6 && matchedBlues === 1) return "一等奖";
	    if (matchedReds === 6 && matchedBlues === 0) return "二等奖";
	    if (matchedReds === 5 && matchedBlues === 1) return "三等奖";
	    if ((matchedReds === 5 && matchedBlues === 0) || (matchedReds === 4 && matchedBlues === 1)) return "四等奖";
	    if ((matchedReds === 4 && matchedBlues === 0) || (matchedReds === 3 && matchedBlues === 1)) return "五等奖";
	    if (matchedBlues === 1) return "六等奖";
	    return "未中奖";
	}
	
	// 大乐透中奖判断
	function checkDLTPrize(ticket, draw) {
	    const matchedReds = ticket.redBalls.filter(num => draw.redBalls.includes(num)).length;
	    const matchedBlues = ticket.blueBalls.filter(num => draw.blueBalls.includes(num)).length;
	    
	    if (matchedReds === 5 && matchedBlues === 2) return { level: "一等奖", prize: "浮动" };
	    if (matchedReds === 5 && matchedBlues === 1) return { level: "二等奖", prize: "浮动" };
	    if (matchedReds === 5 && matchedBlues === 0) return { level: "三等奖", prize: "10000元" };
	    if (matchedReds === 4 && matchedBlues === 2) return { level: "四等奖", prize: "3000元" };
	    if (matchedReds === 4 && matchedBlues === 1) return { level: "五等奖", prize: "300元" };
	    if (matchedReds === 3 && matchedBlues === 2) return { level: "六等奖", prize: "200元" };
	    if (matchedReds === 4 && matchedBlues === 0) return { level: "七等奖", prize: "100元" };
	    if ((matchedReds === 3 && matchedBlues === 1) || (matchedReds === 2 && matchedBlues === 2)) 
	        return { level: "八等奖", prize: "15元" };
	    if ((matchedReds === 3 && matchedBlues === 0) || 
	        (matchedReds === 1 && matchedBlues === 2) || 
	        (matchedReds === 2 && matchedBlues === 1) || 
	        (matchedReds === 0 && matchedBlues === 2))
	        return { level: "九等奖", prize: "5元" };
	    
	    return { level: "未中奖", prize: "0元" };
	}
}
// 显示中奖结果
function showResult(type, mainBalls, extraBalls, result) {
	const resultContainer = document.getElementById(`${type}-result`);
	const resultBalls = document.getElementById(`${type}-result-balls`);
	
	// 显示开奖号码
	resultBalls.innerHTML = '';
	
	mainBalls.forEach(num => {
		const ball = document.createElement('div');
		ball.className = `ball ${type === 'ssq' ? 'red-ball' : 'red-ball'}`;
		ball.textContent = num < 10 ? '0' + num : num;
		resultBalls.appendChild(ball);
	});
	
	extraBalls.forEach(num => {
		const ball = document.createElement('div');
		ball.className = `ball ${type === 'ssq' ? 'blue-ball' : 'blue-ball'}`;
		ball.textContent = num < 10 ? '0' + num : num;
		resultBalls.appendChild(ball);
	});
	
	// 显示中奖信息
	document.getElementById(`${type}-prize`).textContent = result.prize;
	document.getElementById(`${type}-amount`).textContent = result.amount;
	
	resultContainer.style.display = 'block';
}
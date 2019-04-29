// var turn = 0 ;	//0表示游戏未开始，1表示轮到玩家1，2表示轮到玩家2
// var GridPicture = [];	//全局变量，放在最外面
// var xScale = 7;
// var yScale = 7;
// var ClickedNum = 0;
// var GridPicture = [];

/****************************************************************以下为辅助函数************************************************/
//合理的点击操作：所选方格个数大于等于1，小于等于3，且横坐标或纵坐标完全相同
//根据GridPicture中的clicked属性判断点击是否合理，若合理返回1，否则返回0；
function Is_ValidOperation(){
	if (ClickedNum == 1){
		return 1;
	}

	var i = 0;
	var j = 0;

	while(1){
		if (j >= yScale){
			j = 0;
			i++;
		}
		if (i >= xScale)
			break;
		if (GridPicture[i][j].clicked == 1)
			break;
		j++;

	}

	if (ClickedNum == 2){
		if (i + 1 < xScale){
			if (GridPicture[i + 1][j].clicked == 1){
				return 1;
			}
		}
		if (j + 1 < yScale){
			if (GridPicture[i][j + 1].clicked == 1){
				return 1;
			}
		}
	}

	if (ClickedNum == 3){
		if (i + 2 < xScale){
			if (GridPicture[i + 1][j].clicked == 1 && GridPicture[i + 2][j].clicked == 1){
				return 1;
			}
		}
		if (j + 2 < yScale){
			if (GridPicture[i][j + 1].clicked == 1 && GridPicture[i][j + 2].clicked == 1){
				return 1;
			}
		}
	}

	//其他情况
	return 0;
}



/*******************************************以下为确认取消函数，实现游戏基本逻辑************************************************/


//点击确认按钮
//数组RectClicked存储点击的方格对象
$('#O_Btn').click(function() {
	//若当前方为计算机，应当不响应
	if (turn == 0 || turn == 1){
		ClickedNum = 0;
		return ;
	}	
	var RectClicked = [];
	var RectClickedNum = 0;
	for (var i = 0; i < xScale; i++){
		for (var j = 0; j < yScale; j++){
			if (GridPicture[i][j].clicked == 1){
				RectClicked[RectClickedNum] = GridPicture[i][j];
				RectClickedNum++;
			}
		}
	}

	//以下两种情况均需添加动画效果
	//若玩家操作为合理操作，则将GridPicture中被点击的方格的state设置为"unactive",cliced属性归为0
	turn = 2;
	if (Is_ValidOperation()){
		//音效
		var music = document.getElementById("OBtn");
		music.play();

		ClickedNum = 0;
		console.log("*****************************************");
		console.log("-------------玩家决策前棋局------------");
		for(var i = 0; i < xScale; i++){
			for(var j = 0; j < yScale; j++){
				console.log(i+" "+j+" state:"+GridPicture[i][j].state)
			}
		}
		for (var i = 0; i < RectClicked.length; i++){
			GridPicture[RectClicked[i].x][RectClicked[i].y].clicked = 0;
			GridPicture[RectClicked[i].x][RectClicked[i].y].state = "unactive";			
			$('#'+(RectClicked[i].x*10+RectClicked[i].y)).removeClass('selected');
			$('#'+(RectClicked[i].x*10+RectClicked[i].y)).animate({opacity: '0'}, 500);	//消去
			$('#'+(RectClicked[i].x*10+RectClicked[i].y)).cursor = 'pointer';

			//【显示分值动画】
			// var $i=$("<b>").text("+"+GridPicture[RectClicked[i].x][RectClicked[i].y].value);
			// var x=e.pageX,y=e.pageY;
			// // $i.css({top:y-20,left:x,position:"absolute",color:"#E94F06"});
			// // $("body").append($i);
			// // $i.animate({top:y-180,opacity:0,"font-size":"1.4em"},1500,function(){
			// // 	$i.remove();
			// // });
			// // debugger;
			// var s = "<div style='font-size:1em'>"+GridPicture[RectClicked[i].x][RectClicked[i].y].value+"</div>";
			// $('#'+(RectClicked[i].x*10+RectClicked[i].y)).append(i);
			// $(s).animate({top:y-180,opacity:0,"font-size":"5em"},1500,function(){
			// 	$(s).remove();
			// });

			//【计算积分】
			Score2 += 100*GridPicture[RectClicked[i].x][RectClicked[i].y].value;
			$('.playerScore')[1].innerHTML = Score2;


			console.log("-------------玩家选择------------");
			console.log('palyer takes'+RectClicked[i].x +" "+RectClicked[i].y);
			RestRectNum--;//【】
		}
		console.log("-------------玩家取走后剩余------------");
		console.log(turn+' RestRectNum:'+RestRectNum);
		if(RestRectNum <= 0){
			// setTimeout("gameOver(turn)", 2000);
			gameOver(turn);
			return;
		}


		//********轮到AI**********//
		turn = 1;

		console.log("*****************************************");
		console.log("-------------电脑决策前棋局------------");
		for(var i = 0; i < xScale; i++){
			for(var j = 0; j < yScale; j++){
				console.log(i+" "+j+" state:"+GridPicture[i][j].state)
			}
		}

		setTimeout("downShiftAI()", 1000);			
	}
	//若玩家操作不合理（未选中方格），则将GridPicture中被点击方格的clicked属性归为0,并抛出提示声音
	else{
		$('#X_Btn').click();
	}
});

//点击【取消按钮】实现函数
$('#X_Btn').click(function() {
	//方块被点击清零
	for(var i = 0; i < xScale; i++){
		for(var j = 0; j < yScale; j++){
			if(GridPicture[i][j].clicked == 1){
				//document.getElementById(10*i+j).click(i,j,document.getElementByID(10*i+j));	//点击
				$(document.getElementById(10*i+j)).removeClass('selected');
				GridPicture[i][j].clicked = 0;
				ClickedNum--;
			}
		}
	}	
	//音效
	var music = document.getElementById("XBtn");
	music.play();
	if(ClickedNum != 0)	
		alert('居然clickedNum没清零');	//debug用，理论上可以去掉
});

//让AI思考1s后执行，提高用户体验
function downShiftAI(){
	DecisionMaking();
	for(var i = 0; i < decision.length; i++){
		$('#'+(decision[i].x*10+decision[i].y)).addClass('selected');
	}
	setTimeout("AIisWorking()", 1000);
}
//让AI闪烁1s后执行，提高用户体验
function AIisWorking() {
		
	for(var i = 0; i < decision.length; i++){

		GridPicture[decision[i].x][decision[i].y].state = "unactive";
		$('#'+(decision[i].x*10+decision[i].y)).animate({opacity: '0'}, 2000);

		$('#'+(decision[i].x*10+decision[i].y)).removeClass('selected');	

		//【计算积分】
		Score1 += 100*GridPicture[decision[i].x][decision[i].y].value;			
		$('.playerScore')[0].innerHTML = Score1;

		console.log("-------------电脑选择------------");
		console.log('computer takes'+decision[i].x +" "+decision[i].y);
	}
	RestRectNum -= decision.length;
	console.log("-------------电脑取走后剩余------------");
	console.log(turn+' RestRectNum:'+RestRectNum);//【】	
	if(RestRectNum <= 0){
		gameOver(turn);
		return;
	}
	//为了避免玩家点击太快影响淡出效果，0.5s后才换玩家
	setTimeout("turn = 2", 500);
}



/*******************************************以下为棋盘初始设置函数************************************************/
//设置棋盘，此部分重玩时不必调用
function setChessBoard(){
	var loadGrid = "";
	//创建节点，附上ID(注意xy的方向)
	//$("#chessboard").remove();
	for(var j = 0; j < yScale; j++)	{
		for(var i = 0; i < xScale; i++)	{
			loadGrid += "<div class = 'grid' id = '" + (10*i+j) + "'></div>";
		}
	}
	$("#chessboard").append(loadGrid);

	//绑定函数
	for(var i = 0; i < xScale; i++)	{
		for(var j = 0; j < yScale; j++)	{
			var thisGrid = document.getElementById(10*i+j);
			// debugger;
			(function(col, row, grid) {
				$(grid).click(function() {	

					var x = parseInt(this.id / 10);
					var y = this.id % 10;

					if(turn == 1)	//计算机思考时无法点击
					{
						//alert("debug专用：AI思考中...")
						var music = document.getElementById("incorrectSelect");
						music.volume = 1.0;
						music.play();
						return;
					}
					if(GridPicture[x][y].state != "active"){
						//alert("debug专用：该状态为"+GridPicture[x][y].state+'，不可点击')
					 	return;		//只有active才可点击
					}

					if(GridPicture[x][y].clicked == 0){
						//大于3无法继续点击
						if(ClickedNum >= 3){
							//音效
							var music = document.getElementById("incorrectSelect");
							music.volume = 1.0;
							music.play();
					 		return;
						}

					 	//只能判断用户是否为一条线
					 	GridPicture[x][y].clicked = 1;
					 	ClickedNum++;
					 	if (Is_ValidOperation()){
					 		//音效
					 		var music = document.getElementById("correctSelect");
							music.volume = 1.0;
							music.play();
					 		$(grid).addClass('selected');
					 		return;
					 	}		
						else{
							//音效
							var music = document.getElementById("incorrectSelect");
							music.volume = 1.0;
							music.play();
							GridPicture[x][y].clicked = 0;
							ClickedNum--;
							return;
						}
					}
					else{
						var music = document.getElementById("correctSelect");
						music.volume = 1.0;
						music.play();
						$(grid).removeClass('selected');
						GridPicture[x][y].clicked = 0;
						ClickedNum--;
						return;
					}
				});	
			}) (i, j, thisGrid);
		}
	}
}
//重新随机生成grid数组
function setGridPicture(){
	//初始化二维数组	
	for(var i = 0; i < xScale; i++){
		GridPicture[i] = [];
		for(var j = 0; j < yScale; j++){
			GridPicture[i][j] = {
				x : i,				//横坐标
				y : j,				//纵坐标
				state : "asleep",	//asleep未随机，active为亮，unactive为灭	
				clicked : 0,		//表示是否被玩家点击，0未点击，1为点击
				value : 0			//方块分值，2,4,6（为了简化赋值循环初始为2）
			}
		}
	}
	//生成36个激活方格
	for(var activeNum = 0; activeNum < 36; )
	{
		//生成0~x/yScale-1的整数数值
		RandomX = Math.floor(Math.random()*xScale);
		RandomY = Math.floor(Math.random()*yScale);
		if(GridPicture[RandomX][RandomY].state == "asleep"){
			GridPicture[RandomX][RandomY].state = "active";
			GridPicture[RandomX][RandomY].value = 2;
			activeNum++;
		}
	}
	//生成2,4,6的方格各12个
	for(var activeNum = 0; activeNum < 12; )
	{
		//生成0~x/yScale-1的整数数值
		RandomX = Math.floor(Math.random()*xScale);
		RandomY = Math.floor(Math.random()*yScale);
		if(GridPicture[RandomX][RandomY].state == "active"){
			if(GridPicture[RandomX][RandomY].value == 2 ){
				GridPicture[RandomX][RandomY].value = 4;
				activeNum++;
			}
		}		
	}
	for(var activeNum = 0; activeNum < 12; )
	{
		//生成0~x/yScale-1的整数数值
		RandomX = Math.floor(Math.random()*xScale);
		RandomY = Math.floor(Math.random()*yScale);
		if(GridPicture[RandomX][RandomY].state == "active"){
			if(GridPicture[RandomX][RandomY].value == 2 ){
				GridPicture[RandomX][RandomY].value = 6;
				activeNum++;
			}
		}
	}
	console.log("-------------当前棋局------------");
	console.log(GridPicture);
	console.log("-------------初始棋局------------");
	for(var i = 0; i < xScale; i++){
		for(var j = 0; j < yScale; j++){
			console.log(i+" "+j+" state:"+GridPicture[i][j].state)

		}
	}
}
//将随机生成的数组属性附到节点上
function setChess(){
	RestRectNum = 36;
	for(var i = 0; i < xScale; i++){
		for(var j = 0; j < yScale; j++)
		{
			var thisGrid = document.getElementById(10*i+j);// jquery不支持数字id
			//active
			if(GridPicture[i][j].state == "active"){
				$(thisGrid).animate({opacity: '1'}, 500);
			}
			else{
				$(thisGrid).animate({opacity: '0'}, 500);
			}
			//
			if(GridPicture[i][j].value == 2)
				thisGrid.innerHTML = "<img width='60px' height='60px' src='img/greenGrid.jpg' />";
			else if(GridPicture[i][j].value == 4)
				thisGrid.innerHTML = "<img width='60px' height='60px' src='img/yellowGrid.jpg' />";
			else if(GridPicture[i][j].value == 6)
				thisGrid.innerHTML = "<img width='60px' height='60px' src='img/redGrid.jpg' />";
			else if(GridPicture[i][j].value == 0)
				thisGrid.innerHTML = "<img width='60px' height='60px' src='img/greenGrid.jpg' />";	//随便取反正会隐藏
		}
	}
}
//只有第一轮为电脑才调用（onload和restart函数）
function AIisFirst(){
	DecisionMaking();

	for(var i = 0; i < decision.length; i++){
		$('#'+(decision[i].x*10+decision[i].y)).addClass('selected');
	}
	setTimeout("AIisWorking()", 1000);
}

//得到输入名后进入游戏
function getUserName(){
	//输入框
	if($('.logins_inputtxt')[0].value.length < 9 && $('.logins_inputtxt')[0].value.length > 2){
		
		playerName = $('.logins_inputtxt')[0].value;
		$('.playerName')[1].innerHTML = playerName;
		$('#menu_userName').fadeOut(800);
		setChessBoard();
		//以下为重新加载时也调用的部分
		setGridPicture();
		setChess();
		console.log("rest:"+RestRectNum);
		turn = Math.floor(Math.random()*2+1);	//随机生成1或者2; [0,1)*2+1=[1,3)
		if(turn == 1){
			AIisFirst();
		}
	}
}

/*******************************************游戏初始结束调用函数************************************************/
//轮到turn的时候游戏结束，即第turn个取走了最后的方块
function gameOver(turn){
	//音效
	var music = document.getElementById("SetEnd");
	music.play();
	$('#menu_gameOver').fadeIn(3000);
	if(turn == 1)	//计算机输了
	{
		$('.gameOver_message')[0].innerHTML = 'AI取走了最后的方块，您获胜了';
		$('.gameOver_message')[1].innerHTML = '恭喜你能回地球继续码代码啦^^';
	}
	else		//你输了
	{
		$('.gameOver_message')[0].innerHTML = '你取走了最后的方块，您败北了';
		$('.gameOver_message')[1].innerHTML = '恭喜你能和大帝一起写代码啦^^';
	}
	if (turn == 1){
		Score1 = Math.floor(Score1 / 2);
		Score2 = Score1 + Score2;
	}
	else if (turn == 2){
		Score2 = Math.floor(Score2 / 2);
		Score1 = Score1 + Score2;
	}
	
	$('.playerScore')[0].innerHTML = Score1;
	$('.playerScore')[1].innerHTML = Score2;
	$(".gameOver_Score")[0].innerHTML = Score1;
	$(".gameOver_Score")[1].innerHTML = Score2;
	if (turn == 1)
		updateTop();
}

//游戏结束后更新localStorage
function updateTop(){
	var pos = 0;
	var preNum;

	var a = localStorage.UserName.split(",");
	var b = localStorage.Score.split(",");
	preNum = a.length;
	var c = [];
	for (var i = 0; i < preNum; i++){
		c[i] = 0;
		for (var j = 0; j < b[i].length; j++){
			c[i] = c[i] * 10 + parseInt(b[i][j]);
		}
	}

	for (var i = 0; i < preNum; i++, pos++){
		if (Score2 > c[i]){
			break;
		}
	}

	var currentNum = Math.min(5, preNum + 1);
	for (var i = currentNum - 2; i >= pos; i--){
		a[i + 1] = a[i];
		b[i + 1] = b[i];
	}

	a[pos] = playerName;
	b[pos] = Score2;

	localStorage.UserName = a.join(",");
	localStorage.Score = b.join(",");
	recordNum = a.length - 1;

	showTop();
}

//更新top并显示
function showTop(){
	//更新到积分榜
	var a = localStorage.UserName.split(",");
	var b = localStorage.Score.split(",");

	$(".topRecord").remove();
	// recordNum = a.length - 1;
	if (a.length == 1 && a[0].length == 0){
		recordNum = 0;
	}
	else
		recordNum = a.length;

	if (recordNum == 0){
		var loadTopRecord = '<div class="topRecord"> ';
		loadTopRecord += '暂无记录' + '</div>';
		$(loadTopRecord).appendTo($('#topDiv'));
		return;
	}

	for (var i = 0; i < a.length - 1; i++){
		var loadTopRecord = '<div class="topRecord"> ';
		loadTopRecord += (i + 1) + "   " + a[i] + "   " + b[i] + '</div>';
		$(loadTopRecord).appendTo($('#topDiv'));
	}
}

//游戏结束界面top按钮执行
function gameOverToTop(){
	$('#menuBtn_top').click();
	$('#menu_gameOver').fadeOut(800);	
}

//游戏结束界面restart按钮执行
function gameOverToRestart(){
	//比分重新计算
	Score1 = 0;
	Score2 = 0;
	$('.playerScore')[0].innerHTML = Score1;
	$('.playerScore')[1].innerHTML = Score2;
	//防止狠心抛弃了选中的方格就restart了
	for(var i = 0; i < xScale; i++){
		for(var j = 0; j < yScale; j++){
			if(GridPicture[i][j].clicked == 1){
				GridPicture[i][j].clicked = 0;
				$('#'+(i*10+j)).removeClass('selected');
				ClickedNum--;
			}
		}
	}
	//棋子重置
	setGridPicture();
	setChess();
	turn = Math.floor(Math.random()*2+1);	//随机生成1或者2; [0,1)*2+1=[1,3)
	if(turn == 1){
		setTimeout("AIisFirst()", 1000);	//为了避免电脑太快反应
	}
	$('#menu_gameOver').fadeOut(800);	
}

/***************************************绑定logins_info开场设置函数*****************************************/
$("#logins_info").click(function() {
	infoPictureIndex++;
	if (infoPictureIndex >= 4){
		$(".logins_inputtxt").css('display', 'block');
		$(".logins_inputbtn").css('display', 'block');
	}
	else{
		$("#logins_info").fadeOut(500);
		this.src = "img/info" + infoPictureIndex + ".jpg";
		$("#logins_info").fadeIn(500);
	}
});

/*******************************************about菜单设置函数*****************************************/
$("#logins_info").click(function() {
	infoPictureIndex++;
	if (infoPictureIndex >= 4){
		$(".logins_inputtxt").css('display', 'block');
		$(".logins_inputbtn").css('display', 'block');
	}
	else{
		$("#logins_info").fadeOut(500);
		this.src = "img/info" + infoPictureIndex + ".jpg";
		$("#logins_info").fadeIn(500);
	}
});
//按钮移入高亮
$("[id^=menuBtn_]").css("opacity",0.5).hover(function(){
		$(this).animate({opacity:'1'},1);
	},function(){
		$(this).animate({opacity:'0.5'},10);
});
//点击about按钮出现about菜单
$("#menuBtn_about").click(function() {
	$('.menu').fadeOut(800);			//清空公告
	$('#menu_about').fadeIn(1200);
});
//点击about菜单退出
$('#menu_about').click(function() {
	$('#menu_about').fadeOut(800);
});
//点击rule按钮弹出rule菜单
$("#menuBtn_rule").click(function() {
	$('.menu').fadeOut(800);			//清空公告
	$('#menu_rule').fadeIn(1200);
});
$('#menu_rule').click(function() {
	$('#menu_rule').fadeOut(2800);
});
//点击restart按钮重新开始游戏
$("#menuBtn_restart").click(function() {
	gameOverToRestart();	
});
//点击top按钮暗处积分榜
$("#menuBtn_top").click(function() {
	$('.menu').fadeOut(800);			//清空公告
	$('#menu_top').fadeIn(1200);
	showTop();	
});
$('#menu_top').click(function() {
	$('#menu_top').fadeOut(800);
});
//点击music按钮切换音乐开关
$("#menuBtn_music").click(function() {
	var music = document.getElementById("bgmusic");
	if (musicOn == 1){
		music.pause();
		musicOn = 0;
	}
	else if (musicOn == 0){
		music.play();
		musicOn = 1;
	}
});
//菜单按钮弹出
(function(){
	var ul=$("#navs"),li=$("#navs li"),i=li.length,n=i-1,r=165;
	ul.click(function(){
		if (infoPictureIndex <= 3){
			return;
		}
		$(this).toggleClass('active');
		if($(this).hasClass('active')){
			$("[id^=menuBtn_]").css("opacity",0.5);	//弹出前再设置为0.5
			

			for(var a=0;a<i;a++){ 
				li.eq(a).css({
					'transition-delay':""+(50*a)+"ms",
					'-webkit-transition-delay':""+(50*a)+"ms",
					'-o-transition-delay':""+(50*a)+"ms",
					'transform':"translate("+(r*Math.cos(90/n*a*(Math.PI/180)))+"px,"+(-r*Math.sin(90/n*a*(Math.PI/180)))+"px",
					'-webkit-transform':"translate("+(r*Math.cos(90/n*a*(Math.PI/180)))+"px,"+(-r*Math.sin(90/n*a*(Math.PI/180)))+"px",
					'-o-transform':"translate("+(r*Math.cos(90/n*a*(Math.PI/180)))+"px,"+(-r*Math.sin(90/n*a*(Math.PI/180)))+"px",
					'-ms-transform':"translate("+(r*Math.cos(90/n*a*(Math.PI/180)))+"px,"+(-r*Math.sin(90/n*a*(Math.PI/180)))+"px"
				});
			}
		}else{
			li.removeAttr('style');
		}
	});
})($);



/*************************************页面加载即调用的函数*****************************************/
window.onload = function(){
	// 播放游戏背景音乐	
	var music = document.getElementById("bgmusic");
	music.volume=0.5;
	music.play();
	$("#menu_userName").fadeIn(2500);
}



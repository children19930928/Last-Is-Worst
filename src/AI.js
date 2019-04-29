/*
xScale为横坐标上界，yScale为纵坐标上界
给我一个二维数组GridPicture，GridPicture[i][j]为方块对象。（0<=i<xScale, 0<=j<yScale)
方块对象应具有的属性：
（1）x，y：其中x为id的第一位，y为id的第二位
（2）state:"active"为亮，"unactive"为灭，"asleep"为未随机到。
（3）value:方格的分值，设有6、4、2、0四种等级。若state为"unactive"、"asleep"，则设置value为0

注意：
（1）做决策时需要根据GridPicture操作
（2）决策时未修改GridPicture中方格的value值
*/

// var xScale = 7;
// var yScale = 7;
// var CoreGridPicture = []; //删除孤立方块后得到的方块棋盘
// var TempGridPicture=[]; //傻逼计算机每次尝试后得到的棋盘
// var VIRectNum; //CoreGridPicture中state为"active"且不含孤立点对的方块个数
// var VIRestRectNum; //TempGridPicture中state为"active"的方块个数
// var decision = [];//储存傻逼计算机点击的方块


/************************************************以下为辅助函数************************************************/
//判断div1, div2是否相邻，若相邻则返回1
function adjacent(div1, div2){
	if ((Math.abs(div1.x - div2.x) == 1 && Math.abs(div1.y - div2.y) == 0) 
		|| (Math.abs(div1.x - div2.x) == 0 && Math.abs(div1.y - div2.y) == 1)){
		return 1;
	}
	else
		return 0;
}

//判断div是否为为孤立方格，若孤立则返回1,否则返回0
//传入参数gridType为0：在GridPicture中判断；gridType为1:在TempGridPicture中判断
function isolate(div, gridType){
	//div不亮，则为非孤立方格，返回0
	if (div.state == "unactive"){
		return 0;
	}

	var result = 1;
	var direction = [[0, 1], [0, -1], [1, 0], [-1, 0]];
	for (var i = 0; i < 4; i++)
	{
		var x1 = div.x + direction[i][0];
		var y1 = div.y + direction[i][1];
		if (x1 >= 0 && x1 < xScale && y1 >= 0  && y1 < yScale){
			if (gridType == 0){
				if (GridPicture[x1][y1].state == "active"){
					result = 0;
					break;
				}
			}
			if (gridType == 1){
				if (TempGridPicture[x1][y1].state == "active"){
					result = 0;
					break;
				}
			}
		}	
	}
	return result;
}

//删去GridPicture中的孤立方块对，存储在CoreGridPicture中
function GetNewGridPicture(){
	//preIsolate储存NewGridPicture中的上一个孤立方格
	var preIsolateX, preIsolateY;
	//preIsolateExsit表示NewGridPicture是否存在上一个孤立方格
	var preIsolateExsit = false;
	VIRectNum = 0;

	for (var i = 0; i < xScale; i++){
		CoreGridPicture[i] = [];
		for (var j = 0; j < yScale; j++){
			CoreGridPicture[i][j] = {};
			CoreGridPicture[i][j].x = GridPicture[i][j].x;
			CoreGridPicture[i][j].y = GridPicture[i][j].y;
			CoreGridPicture[i][j].state = GridPicture[i][j].state;
			CoreGridPicture[i][j].value = GridPicture[i][j].value;
			if (GridPicture[i][j].state == "active"){
				if (isolate(GridPicture[i][j], 0)){
					//没有未配对的孤立方格，保存当前孤立方格
					if (preIsolateExsit == false){
						preIsolateX = GridPicture[i][j].x;
						preIsolateY = GridPicture[i][j].y;
						preIsolateExsit = true;
					}
					//有未配对的孤立方格，将当前孤立方格与其配对，在CoreGridPicture中的state属性均设置为unactive
					else{
						CoreGridPicture[preIsolateX][preIsolateY].state = "unactive";
						CoreGridPicture[i][j].state = "unactive";
						preIsolateExsit = false;
					}
				}
				else
					VIRectNum++;
			}

		}
	}
	VIRectNum += preIsolateExsit;
}

//计算所有点击div的策略得分最大值
//只需考虑以下五种情况：需要判断后四种情况的操作合理性
//（1）只点击div；（2）点击div及其左方的方块；（3）点击div及其上方的方块
//（4）点击以div为中心水平放置的三个方块；（5）点击div为中心垂直放置的三个方块
function GetSingleHitMaxValue(div){
	//异常处理：若非active，返回-1
	if (div.state == "unactive" || div.state == "asleep"){	//【】
		return -1;
	}

	var SingleHitMaxValue = div.value;
	var SingleHitValue;
	decision = [];
	decision[0] = div;

	//第二种情况
	if (div.x > 0){
		if (GridPicture[div.x - 1][div.y].state == "active"){
			SingleHitValue = div.value + GridPicture[div.x - 1][div.y].value;
			if (SingleHitMaxValue < SingleHitValue){
				SingleHitMaxValue = SingleHitValue;
				decision = [];
				decision[0] = div;
				decision[1] = GridPicture[div.x - 1][div.y];
			}
		}
	}
	//第三种情况
	if (div.y > 0){
		if (GridPicture[div.x][div.y - 1].state == "active"){
			SingleHitValue = div.value + GridPicture[div.x][div.y - 1].value;
			if (SingleHitMaxValue < SingleHitValue){
				SingleHitMaxValue = SingleHitValue;
				decision = [];
				decision[0] = div;
				decision[1] = GridPicture[div.x][div.y - 1];
			}
		}
	}

	//第四种情况
	if (div.x > 0 && div.x < xScale - 1){
		if (GridPicture[div.x - 1][div.y].state == "active" && GridPicture[div.x + 1][div.y].state == "active"){
			SingleHitValue = div.value + GridPicture[div.x - 1][div.y].value + GridPicture[div.x + 1][div.y].value;
			if (SingleHitMaxValue < SingleHitValue){
				SingleHitMaxValue = SingleHitValue;
				decision = [];
				decision[0] = div;
				decision[1] = GridPicture[div.x - 1][div.y];
				decision[2] = GridPicture[div.x + 1][div.y];
			}	
		}
	}

	//第五种情况
	if (div.y > 0 && div.y < yScale - 1){
		if (GridPicture[div.x][div.y - 1].state == "active" && GridPicture[div.x][div.y + 1].state == "active"){
			SingleHitValue = div.value + GridPicture[div.x][div.y - 1].value + GridPicture[div.x][div.y + 1].value;
			if (SingleHitMaxValue < SingleHitValue){
				SingleHitMaxValue = SingleHitValue;
				decision = [];
				decision[0] = div;
				decision[1] = GridPicture[div.x][div.y - 1];
				decision[2] = GridPicture[div.x][div.y + 1];
			}
		}
	}
	return SingleHitMaxValue;
}

//对RectArray按x坐标升序排序
function SortRectBasedX(RectArray){
	var tempRect;
	for (var i = RectArray.length - 1; i >= 0; i--)
	{
		for (var j = 0; j < i; j++)
		{
			if (RectArray[i].x < RectArray[j].x)
			{
				tempRect = RectArray[i];
				RectArray[i] = RectArray[j];
				RectArray[j] = tempRect;
			}
		}
	}
}

//对RectArray按y坐标升序排序
function SortRectBasedY(RectArray){
	var tempRect;
	for (var i = RectArray.length - 1; i >= 0; i--)
	{
		for (var j = 0; j < i; j++)
		{
			if (RectArray[i].y < RectArray[j].y)
			{
				tempRect = RectArray[i];
				RectArray[i] = RectArray[j];
				RectArray[j] = tempRect;
			}
		}
	}
}


//根据TempGridPicture，判断是否为必胜情形。若为必胜情形，返回1；否则返回0
//若VIRestRectNum不为1或4，不能确定是否必胜，返回0
//若为1，返回1
//若为4，且排布为下列三种情况（*表示方格），返回1；否则返回0；
//		||			||	
//  **  ||   ** **  ||	*
//  **  ||          ||	**
//      ||          ||	 *
function SureToWin(){
	if (VIRestRectNum != 1 && VIRestRectNum != 4){
		return 0;
	}
	if (VIRestRectNum == 1){
		return 1;
	}
	
	var activeRect = [];
	var k = 0;
	var isolateRect = 0;
	var adjacentPair = 0;
	for (var i = 0; i < xScale; i++){
		for (var j = 0; j < yScale; j++){
			if (TempGridPicture[i][j].state == "active"){
				activeRect[k] = TempGridPicture[i][j];
				k++;
			  	if (isolate(TempGridPicture[i][j], 1)){
			  		isolateRect += 1;
			  	}
			}
		}
	}

	for (var i = 0; i < 4; i++){
		for (var j = i + 1; j < 4; j++){
			adjacentPair += adjacent(activeRect[i], activeRect[j]);
		}
	}

	if ((adjacentPair == 2 && isolateRect == 0) || (adjacentPair == 4)){
		return 1;
	}
	else if (adjacentPair == 3){
		//先根据x排序，再按照y排序
		SortRectBasedX(activeRect);
		if (activeRect[0].x == activeRect[1].x && activeRect[2].x == activeRect[3].x && activeRect[1].x != activeRect[2].x)
			return 1;
		SortRectBasedY(activeRect);
		if (activeRect[0].y == activeRect[1].y && activeRect[2].y == activeRect[3].y && activeRect[1].y != activeRect[2].y)
			return 1;
	}
	
	//其他情况，不能确定是否必胜，返回0
	return 0;
}

//根据CoreGridPicture,遍历所有可能操作，单次操作更新TempGridPicture和VIRestRectNum
//单次操作后调用SureToWin判断是否为必胜情形
//单次操作考虑以下五种情况：需要判断后四种情况的操作合理性
//（1）只点击div；（2）点击div及其左方的方块；（3）点击div及其上方的方块
//（4）点击以div为中心水平放置的三个方块；（5）点击div为中心垂直放置的三个方块
function TryAimedAtVictory(){
	var div;

	//初始化TempGridPicture及VIRestRectNum
	VIRestRectNum = 0;
	for (var i = 0; i < xScale; i++){
		TempGridPicture[i] = [];
		for (var j = 0; j < yScale; j++){
			TempGridPicture[i][j] = CoreGridPicture[i][j];
			if (TempGridPicture[i][j].state == "active"){
				VIRestRectNum++;
			}
		}
	}

	//枚举所有可能操作，判断是否必胜
	for (var i = 0; i < xScale; i++){
		for (var j = 0; j < yScale; j++){
			div = TempGridPicture[i][j];
			if (div.state == "unactive" || div.state == "asleep")
				continue;
			
			//第一种情况
			TempGridPicture[div.x][div.y].state = "unactive";
			VIRestRectNum = VIRestRectNum - 1;
			if (SureToWin()){
				decision = [];
				decision[0] = GridPicture[div.x][div.y];
				return;
			}
			VIRestRectNum = VIRestRectNum + 1;


			//第二种情况
			if (div.x > 0){
				if (TempGridPicture[div.x - 1][div.y].state == "active"){
					TempGridPicture[div.x - 1][div.y].state = "unactive";
					VIRestRectNum = VIRestRectNum - 2;
					if (SureToWin()){
						decision = [];
						decision[0] = GridPicture[div.x][div.y];
						decision[1] = GridPicture[div.x - 1][div.y];
						return;
					}
					else{
						TempGridPicture[div.x - 1][div.y].state = "active";
					}
					VIRestRectNum = VIRestRectNum + 2;
				}
			}

			//第三种情况
			if (div.y > 0){
				if (TempGridPicture[div.x][div.y - 1].state == "active"){
					TempGridPicture[div.x][div.y - 1].state = "unactive";
					VIRestRectNum = VIRestRectNum - 2;
					if (SureToWin()){
						decision = [];
						decision[0] = GridPicture[div.x][div.y];
						decision[1] = GridPicture[div.x][div.y - 1];
						return;
					}
					else{
						TempGridPicture[div.x][div.y - 1].state = "active";
					}
					VIRestRectNum = VIRestRectNum + 2;
				}
			}

			//第四种情况
			if (div.x > 0 && div.x < xScale - 1){
				if (TempGridPicture[div.x - 1][div.y].state == "active" && TempGridPicture[div.x + 1][div.y].state == "active"){
					TempGridPicture[div.x - 1][div.y].state = "unactive";
					TempGridPicture[div.x + 1][div.y].state = "unactive";
					VIRestRectNum = VIRestRectNum - 3;
					if (SureToWin()){
						decision = [];
						decision[0] = GridPicture[div.x][div.y];
						decision[1] = GridPicture[div.x - 1][div.y];
						decision[2] = GridPicture[div.x + 1][div.y];
						return;
 					}
					else{
						TempGridPicture[div.x - 1][div.y].state = "active";
						TempGridPicture[div.x + 1][div.y].state = "active";
					}		
					VIRestRectNum = VIRestRectNum + 3;	
				}
			}

			//第五种情况
			if (div.y > 0 && div.y < yScale - 1){
				if (TempGridPicture[div.x][div.y - 1].state == "active" && TempGridPicture[div.x][div.y + 1].state == "active"){
					TempGridPicture[div.x][div.y - 1].state = "unactive";
					TempGridPicture[div.x][div.y + 1].state = "unactive";
					VIRestRectNum = VIRestRectNum - 3;
					if (SureToWin()){
						decision = [];
						decision[0] = GridPicture[div.x][div.y];
						decision[1] = GridPicture[div.x][div.y - 1];
						decision[2] = GridPicture[div.x][div.y + 1];
						return;
 					}
					else{
						TempGridPicture[div.x][div.y - 1].state = "active";
						TempGridPicture[div.x][div.y + 1].state = "active";
					}			
					VIRestRectNum = VIRestRectNum + 3;
				}
			}
			TempGridPicture[div.x][div.y].state = "active";
		}
	}

	//若遍历所有可行操作后不出现必胜情形，调用分数主导的决策
	ScorePriorDecision();
}


/************************************************以下为决策函数************************************************/
//分数主导的决策
function ScorePriorDecision(){
	var goodDiv;
	var divValue;
	var maxDivValue = 0;

	for (var i = 0; i < xScale; i++){
		for (var j = 0; j < yScale; j++){
			divValue = GetSingleHitMaxValue(GridPicture[i][j]);
			if (divValue > maxDivValue){
				maxDivValue = divValue;
				goodDiv = GridPicture[i][j];
			}
		}
	}
	GetSingleHitMaxValue(goodDiv);
	VIRestRectNum -= decision.length;//【】
}

//胜利主导的决策
function VictoryPriorDecision(){
	TryAimedAtVictory();
}

//决策函数
function DecisionMaking(){
	//对孤立点
	GetNewGridPicture();
	if (VIRectNum > 7){
		ScorePriorDecision();
	}
	else{
		VictoryPriorDecision();
	}
}
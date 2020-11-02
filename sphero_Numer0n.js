function setMode(){
    let num = 0;
	mode = ["easy", "normal", "hard"];
    // mode = [num = 0,num = 1,num = 2]
    while (true) {
		P = getOrientation().pitch;
		R = getOrientation().roll;
        Y = getOrientation().yaw;

		if (R >= 30) {
			setMainLed({ r: 255, g: 0, b: 0 });
			num = num + 1;
			if (num > 2) {
				num = num % 3;
			}
			await speak(mode[num]);
		}else if (R <= -30) {
			setMainLed({ r: 0, g: 0, b: 255 });
			num = num - 1;
			if (num < 0) {
				num = 3 - (Math.abs(num) % 3);
			}
			await speak(mode[num]);
		}else if (P > 20 || P < -20){
            setMainLed({ r: 0, g: 0, b: 0 });
		    await speak(String(mode[num]) + "ですね")
			break;
        }
        await delay(0.5);
    }
    return num;
}
function setNumber() {
	a = Math.trunc(Math.random() * 9 + 1);
	return a;
}
function ArrayNum(p){　//これだけ後半部分でも使う。
    let x = new Array(p);
    return x;
}
function NumberNum(q){
    let number = ArrayNum(q);
    //解答の数字
	for (i = 0; i < q; i++) {
		number[i] = setNumber();
    }
    return number;  
}
function JudgeNumber(m){
    var sum1 = 0;
    var sum2 = 0;
    for (j=0; j < m-1; j++){
        for (k = j; k < m; k++){
            sum1 += 1;
            if (num[j] != num[k]){
                sum2 += 1;
            }
        }
    }
    return [sum1, sum2];
}

//　↑　↑　↑　spheroが考える値の決定に必要な関数

//ここからプレイヤーが数を決定する関数
function getNumber(){
    let getNum = 0;
    ansnum = [1,2,3,4,5,6,7,8,9];
    while (true) {
        P = getOrientation().pitch;
        R = getOrientation().roll;
        Y = getOrientation().yaw;

        if (R >= 30) {
            setMainLed({ r: 255, g: 0, b: 0 });
            getNum = getNum + 1;
            if (getNum > 8) {
                getNum = getNum % 9;
            }
            await speak(ansnum[getNum]);
        }else if (R <= -30) {
            setMainLed({ r: 0, g: 0, b: 255 });
            getNum = getNum - 1;
            if (getNum < 0) {
                getNum = 9 - (Math.abs(getNum) % 8);
            }
            await speak(mode[getNum]);
        }else if (P > 20 || P < -20){
            await speak(String(ansnum[getNum]) + "ですね")
            break;
        } 
        await delay(0.5);
    }
    gotNum = ansnum[getNum];
    return gotNum;
}
async function Judge(s){
    var ans1 = 0;
    var ans2 = 0;
    for (i = 0; i < s ;i++){
        if (number[i] == answer[i]){
            ans1 += 1;
        }else if(number[i] !== answer[i]){
            for (j = 0; j < s; j++){
                if (number[i] == ans[j]){
                    ans2 += 1;
                }
            }
        }
    }
    if (ans1 == s){
        JudgeNumber = "True";
    }else{
        JudgeNumber = "False";
        if (ans1 > 0 && ans2 > 0){
            await speak(String(ans1) + "イート、" + String(ans2) + "バイト");
        }else if (ans1>0 && ans2==0){
            await speak(String(ans1) + "イート");     
        }else if (ans2> 0 && ans1== 0){
            await speak(String(ans2) + "バイト");
        }else if (ans1 == 0&& ans2 == 0){
            await speak("入力された数は含まれていません");
        }
    }
}



//StartProgram

async function startProgram() {
	num = setMode();
    mode = num + 2;
    //mode == 2 --> easy
    //mode == 3 --> normal
    //mode == 4 --> hard 
    while (true) {
        num = NumberNum(mode);
        //　↑ mode桁の数値をセット
        // 数字が重複していたらループでやり直す
        sum = JudgeNumber(mode);
        if (sum[0] == sum[1]){
            break;
        }
        await delay(0.01);
    }
	//await speak(String(num)); sphero が考える値
    
    var Judged = "False" ;
    var score = 1;

	while(Judged == "True"){
        let answer = ArrayNum(mode);
        for (x = 0; x < mode; x++){
            answer[x] = getNumber();
        }
        await speak(String(answer) + "で解答します。");
        await Judge(mode);
        score += 1//解答に何回かかかったか
    }
    //ここから成功の場合の処理
    //　↓　↓　↓　↓　↓　↓　↓　↓
    await speak(score);
}


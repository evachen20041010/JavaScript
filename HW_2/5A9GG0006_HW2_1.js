//範圍1~100
for (var i = 1; i <= 100; i++) {
    //是3和5的倍數先做輸出
    if (i % 3 == 0 && i % 5 == 0) {
        console.log("FizzBuzz") //輸出文字後換行
    }
    //是3的倍數
    else if (i % 3 == 0) {
        console.log("Fizz")
    }
    //是5的倍數
    else if (i % 5 == 0) {
        console.log("Buzz")
    }
    //其餘的數字直接輸出
    else {
        console.log(i)
    }
}

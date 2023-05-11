window.onload = function () {
    var item = document.querySelectorAll(".item");
    var it = item[0].querySelectorAll("div")
    var content = document.querySelectorAll(".content");
    var con = content[0].querySelectorAll("div");
    var na1 = document.querySelectorAll('[name="use1"]')
    var na2 = document.querySelectorAll('[name="use2"]')
    var span1 = document.querySelectorAll('.box2 span')
    var span2 = document.querySelectorAll('.box1 span')
    var zc = document.querySelector('[value="註冊"]')
    var dl = document.querySelector('[value="登入"]')

    console.log(span2)
    var userReg = /^[a-zA-Z][a-zA-Z0-9]{3,9}$/
    var telReg = /^[0-9a-zA-Z].{5,14}$/

    for (let i = 0; i < it.length; i++) {
        it[i].onclick = function () {
            for (let j = 0; j < it.length; j++) {
                it[j].className = '';
                con[j].style.display = "none";
            }
            this.className = "active";
            it[i].index = i;
            con[i].style.display = "block";
        }
    }

    var flag = false

    // 封裝
    function cf(trr, srnr, index, str, str1) {
        var a1 = trr.test(srnr)
        if (!a1) {
            index.className = 'error'
            index.innerText = str
            index.style.color = "red"
            return true
        } else {
            index.className = 'cg'
            index.innerText = str1
            index.style.color = "green"
            return false

        }
    }
    // 註冊驗證
    na1[0].oninput = () => cf(userReg, na1[0].value, span1[0], 'x 不符合規範', '√ 通過驗證')

    na1[1].oninput = () => cf(telReg, na1[1].value, span1[1], 'x 不符合規範', '√ 通過驗證')

    var arr = []
    zc.onclick = () => {
        flag = true
        if (na1[0].value === '') {
            span1[0].className = 'error'
            return flag = false
        }
        else if (na1[1].value === '') {
            span1[1].className = 'error'
            return flag = false
        } else {
            if (flag) {
                alert('註冊成功')
            }
        }
    }

    dl.onclick = function () {
        span2[0].innerText = ''
        span2[0].className = ''
        span2[1].innerText = ''
        span2[1].className = ''
        if (na1[0].value != na2[0].value && na1[1].value != na2[1].value) {
            alert('該使用者不存在')
        } else if (na1[0].value != na2[0].value || na1[0].value == '') {
            span2[0].className = 'error'
            span2[0].innerText = '使用者名稱不一致'
        } else if (na1[1].value === '' || na1[1].value != na2[1].value) {
            span2[1].className = 'error'
            span2[1].innerText = '密碼不正確'
        } else {
            if (flag) {
                localStorage["user"] = na1[0].value;
                document.location.href = "index/index.html"
            }
        }
    }
}

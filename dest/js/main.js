//設置cookie
//name:cookie名稱、value:cookie值、deadline:cookie有效時間(單位:小時)
function setCookie(name, value, deadline) {
    var exp = new Date();
    exp.setTime(exp.getTime() + deadline * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}

//讀取cookie
//name:cookie名稱
function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");

    if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}

//删除cookies
function deleteCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null)
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}

$(document).ready(() => {
	let currentDateTime = new Date().getFullYear()
  $('.license').text('Copyright © Berglas ' + currentDateTime + '.')
});

//滾動事件
$(window).scroll(function() {
  var page0 = $('#page0').offset().top;
  var page1 = $('#page1').offset().top;
  var page2 = $('#page2').offset().top;
  var page3 = $('#page3').offset().top;
  var page3 = $('#page4').offset().top;
  var page5 = $('#page5').offset().top;
  if ($(this).scrollTop() >= page0 && $(this).scrollTop() < page1) {
    $('.fixed-box').removeClass('display');
  } else if ($(this).scrollTop() > page1 * 0.9 && $(this).scrollTop() <= page2) {
    $('.fixed-box').addClass('display');
  } else if ($(this).scrollTop() >= page2 && $(this).scrollTop() <= page3) {
    $('.fixed-box').addClass('display');
  } else if ($(this).scrollTop() >= page3 && $(this).scrollTop() <= page4) {
    $('.fixed-box').addClass('display');
  } else if ($(this).scrollTop() >= page4 && $(this).scrollTop() <= page5) {
    $('.fixed-box').addClass('display');
  }
});


//設定錨點
$(function() {
  $('a[href*="#"]:not([href="#"])').click(function() {
    $('html, body').animate({
      scrollTop: $(this.hash).offset().top
    }, 400);
  });
});

$(function() {
  const next = $('#slider-next')[0];
  const prev = $('#slider-prev')[0];
  const element = $('#slider')[0];
  const length = $('#slider > ul > li').length;
  const moveValue =  $('#slider')[0].scrollWidth / length;
  let nextCount = 0;

  function changePrev() {
    nextCount -= 1;
    if (nextCount == -1) {
      nextCount = length - 1;
    }
    element.style.transform = `translateX(${moveValue * nextCount * -1}px)`;
  }
  function changeNext() {
    nextCount += 1;
    if (Math.abs(nextCount) > length - 1) {
      nextCount = 0;
    }
    element.style.transform = `translateX(${moveValue * nextCount * -1}px)`;
  }
  prev.addEventListener('click', changePrev);
  next.addEventListener('click', changeNext);

  $("#slider").swipe({
    threshold: 0,
    swipe:function(event, direction, distance, duration, fingerCount, fingerData, currentDirection) {
        if (direction == 'left') {
          changeNext();
        } else if (direction == 'right') {
          changePrev();
        }
    }
  });
});

$(function() {
    var _this = this;
    this.selected_row = -1;
    this.clearOpenedRows = function () {
      return _this.accordionItems.forEach(function (item) {return item.classList.remove("expanded");});
    };
    this.accordionClickhandler = function (index) {
      var item = _this.accordionItems[index];
      _this.clearOpenedRows();
      if (_this.selected_row !== index) {
        _this.selected_row = index;
        item.classList.add("expanded");
      } else
      {
        _this.selected_row = -1;
      }
    };
    this.accordionItems = Array.from(document.getElementsByClassName("item"));
    this.accordionItems.forEach(function (item, index) {
      item.addEventListener("click", function () {return _this.accordionClickhandler(index);});
    });
});

$(function() {
  $(".menu-list").each(function(e) {
    $(this).append("<div class='menu-icon'><span></span></div>");
    $(this)
      .find(".menu-icon")
      .on("click", function() {
        $(".menu-icon")[e].classList.toggle("active");
        $(".menu-list > ul")[e].classList.toggle("active");
      });
  });
});

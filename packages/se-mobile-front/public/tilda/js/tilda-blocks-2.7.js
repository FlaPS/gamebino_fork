 
function t228_highlight(){
  var url=window.location.href;
  var pathname=window.location.pathname;
  if(url.substr(url.length - 1) == "/"){ url = url.slice(0,-1); }
  if(pathname.substr(pathname.length - 1) == "/"){ pathname = pathname.slice(0,-1); }
  if(pathname.charAt(0) == "/"){ pathname = pathname.slice(1); }
  if(pathname == ""){ pathname = "/"; }
  $(".t228__list_item a[href='"+url+"']").addClass("t-active");
  $(".t228__list_item a[href='"+url+"/']").addClass("t-active");
  $(".t228__list_item a[href='"+pathname+"']").addClass("t-active");
  $(".t228__list_item a[href='/"+pathname+"']").addClass("t-active");
  $(".t228__list_item a[href='"+pathname+"/']").addClass("t-active");
  $(".t228__list_item a[href='/"+pathname+"/']").addClass("t-active");
}

function t228_checkAnchorLinks(recid) {
    if ($(window).width() >= 960) {
        var t228_navLinks = $("#rec" + recid + " .t228__list_item a:not(.tooltipstered)[href*='#']");
        if (t228_navLinks.length > 0) {
            setTimeout(function(){
              t228_catchScroll(t228_navLinks);
            }, 500);
        }
    }
}

function t228_catchScroll(t228_navLinks) {
    var t228_clickedSectionId = null,
        t228_sections = new Array(),
        t228_sectionIdTonavigationLink = [],
        t228_interval = 100,
        t228_lastCall, t228_timeoutId;
    t228_navLinks = $(t228_navLinks.get().reverse());
    t228_navLinks.each(function() {
        var t228_cursection = t228_getSectionByHref($(this));
        if (typeof t228_cursection.attr("id") != "undefined") {
            t228_sections.push(t228_cursection);
        }
        t228_sectionIdTonavigationLink[t228_cursection.attr("id")] = $(this);
    });
		t228_updateSectionsOffsets(t228_sections);
    t228_sections.sort(function(a, b) {
      return b.attr("data-offset-top") - a.attr("data-offset-top");
    });
		$(window).bind('resize', t_throttle(function(){t228_updateSectionsOffsets(t228_sections);}, 200));
		$('.t228').bind('displayChanged',function(){t228_updateSectionsOffsets(t228_sections);});
		setInterval(function(){t228_updateSectionsOffsets(t228_sections);},5000);
    t228_highlightNavLinks(t228_navLinks, t228_sections, t228_sectionIdTonavigationLink, t228_clickedSectionId);

    t228_navLinks.click(function() {
        var t228_clickedSection = t228_getSectionByHref($(this));
        if (!$(this).hasClass("tooltipstered") && typeof t228_clickedSection.attr("id") != "undefined") {
            t228_navLinks.removeClass('t-active');
            $(this).addClass('t-active');
            t228_clickedSectionId = t228_getSectionByHref($(this)).attr("id");
        }
    });
    $(window).scroll(function() {
        var t228_now = new Date().getTime();
        if (t228_lastCall && t228_now < (t228_lastCall + t228_interval)) {
            clearTimeout(t228_timeoutId);
            t228_timeoutId = setTimeout(function() {
                t228_lastCall = t228_now;
                t228_clickedSectionId = t228_highlightNavLinks(t228_navLinks, t228_sections, t228_sectionIdTonavigationLink, t228_clickedSectionId);
            }, t228_interval - (t228_now - t228_lastCall));
        } else {
            t228_lastCall = t228_now;
            t228_clickedSectionId = t228_highlightNavLinks(t228_navLinks, t228_sections, t228_sectionIdTonavigationLink, t228_clickedSectionId);
        }
    });
}


function t228_updateSectionsOffsets(sections){
	$(sections).each(function(){
		var t228_curSection = $(this);
		t228_curSection.attr("data-offset-top",t228_curSection.offset().top);
	});
}


function t228_getSectionByHref(curlink) {
    var t228_curLinkValue = curlink.attr("href").replace(/\s+/g, '');
    if (t228_curLinkValue[0]=='/') { t228_curLinkValue = t228_curLinkValue.substring(1); }
    if (curlink.is('[href*="#rec"]')) {
        return $(".r[id='" + t228_curLinkValue.substring(1) + "']");
    } else {
        return $(".r[data-record-type='215']").has("a[name='" + t228_curLinkValue.substring(1) + "']");
    }
}

function t228_highlightNavLinks(t228_navLinks, t228_sections, t228_sectionIdTonavigationLink, t228_clickedSectionId) {
    var t228_scrollPosition = $(window).scrollTop(),
        t228_valueToReturn = t228_clickedSectionId;
    /*if first section is not at the page top (under first blocks)*/
    if (t228_sections.length != 0 && t228_clickedSectionId == null && t228_sections[t228_sections.length-1].attr("data-offset-top") > (t228_scrollPosition + 300)){
      t228_navLinks.removeClass('t-active');
      return null;
    }

    $(t228_sections).each(function(e) {
        var t228_curSection = $(this),
            t228_sectionTop = t228_curSection.attr("data-offset-top"),
            t228_id = t228_curSection.attr('id'),
            t228_navLink = t228_sectionIdTonavigationLink[t228_id];
        if (((t228_scrollPosition + 300) >= t228_sectionTop) || (t228_sections[0].attr("id") == t228_id && t228_scrollPosition >= $(document).height() - $(window).height())) {
            if (t228_clickedSectionId == null && !t228_navLink.hasClass('t-active')) {
                t228_navLinks.removeClass('t-active');
                t228_navLink.addClass('t-active');
                t228_valueToReturn = null;
            } else {
                if (t228_clickedSectionId != null && t228_id == t228_clickedSectionId) {
                    t228_valueToReturn = null;
                }
            }
            return false;
        }
    });
    return t228_valueToReturn;
}

function t228_setPath(){
}

function t228_setWidth(recid){
  var window_width=$(window).width();
  if(window_width>980){
    $(".t228").each(function() {
      var el=$(this);
      var left_exist=el.find('.t228__leftcontainer').length;
      var left_w=el.find('.t228__leftcontainer').outerWidth(true);
      var max_w=left_w;
      var right_exist=el.find('.t228__rightcontainer').length;
      var right_w=el.find('.t228__rightcontainer').outerWidth(true);
	  var items_align=el.attr('data-menu-items-align');
      if(left_w<right_w)max_w=right_w;
      max_w=Math.ceil(max_w);
      var center_w=0;
      el.find('.t228__centercontainer').find('li').each(function() {
        center_w+=$(this).outerWidth(true);
      });
      var padd_w=40;
      var maincontainer_width=el.find(".t228__maincontainer").outerWidth();
      if(maincontainer_width-max_w*2-padd_w*2>center_w+20){
          //if(left_exist>0 && right_exist>0){
		  if(items_align=="center" || typeof items_align==="undefined"){
            el.find(".t228__leftside").css("min-width",max_w+"px");
            el.find(".t228__rightside").css("min-width",max_w+"px");
            el.find(".t228__list").removeClass("t228__list_hidden");
          }
       }else{
          el.find(".t228__leftside").css("min-width","");
          el.find(".t228__rightside").css("min-width","");  
          
      }
    });
  }
}

function t228_setBg(recid){
  var window_width=$(window).width();
  if(window_width>980){
    $(".t228").each(function() {
      var el=$(this);
      if(el.attr('data-bgcolor-setbyscript')=="yes"){
        var bgcolor=el.attr("data-bgcolor-rgba");
        el.css("background-color",bgcolor);             
      }
      });
      }else{
        $(".t228").each(function() {
          var el=$(this);
          var bgcolor=el.attr("data-bgcolor-hex");
          el.css("background-color",bgcolor);
          el.attr("data-bgcolor-setbyscript","yes");
      });
  }
}

function t228_appearMenu(recid) {
      var window_width=$(window).width();
      if(window_width>980){
           $(".t228").each(function() {
                  var el=$(this);
                  var appearoffset=el.attr("data-appearoffset");
                  if(appearoffset!=""){
                          if(appearoffset.indexOf('vh') > -1){
                              appearoffset = Math.floor((window.innerHeight * (parseInt(appearoffset) / 100)));
                          }

                          appearoffset=parseInt(appearoffset, 10);

                          if ($(window).scrollTop() >= appearoffset) {
                            if(el.css('visibility') == 'hidden'){
                                el.finish();
                                el.css("top","-50px");  
                                el.css("visibility","visible");
                                var topoffset = el.data('top-offset');
                                if (topoffset && parseInt(topoffset) > 0) {
                                    el.animate({"opacity": "1","top": topoffset+"px"}, 200,function() {
                                    });       
                                    
                                } else {
                                    el.animate({"opacity": "1","top": "0px"}, 200,function() {
                                    });       
                                }
                            }
                          }else{
                            el.stop();
                            el.css("visibility","hidden");
							el.css("opacity","0");	
                          }
                  }
           });
      }

}

function t228_changebgopacitymenu(recid) {
  var window_width=$(window).width();
  if(window_width>980){
    $(".t228").each(function() {
      var el=$(this);
      var bgcolor=el.attr("data-bgcolor-rgba");
      var bgcolor_afterscroll=el.attr("data-bgcolor-rgba-afterscroll");
      var bgopacityone=el.attr("data-bgopacity");
      var bgopacitytwo=el.attr("data-bgopacity-two");
      var menushadow=el.attr("data-menushadow");
      if(menushadow=='100'){
        var menushadowvalue=menushadow;
      }else{
        var menushadowvalue='0.'+menushadow;
      }
      if ($(window).scrollTop() > 20) {
        el.css("background-color",bgcolor_afterscroll);
        if(bgopacitytwo=='0' || (typeof menushadow == "undefined" && menushadow == false)){
          el.css("box-shadow","none");
        }else{
          el.css("box-shadow","0px 1px 3px rgba(0,0,0,"+ menushadowvalue +")");
        }
      }else{
        el.css("background-color",bgcolor);
        if(bgopacityone=='0.0' || (typeof menushadow == "undefined" && menushadow == false)){
          el.css("box-shadow","none");
        }else{
          el.css("box-shadow","0px 1px 3px rgba(0,0,0,"+ menushadowvalue +")");
        }
      }
    });
  }
}

function t228_createMobileMenu(recid){
  var window_width=$(window).width(),
      el=$("#rec"+recid),
      menu=el.find(".t228"),
      burger=el.find(".t228__mobile");
  burger.click(function(e){
    menu.fadeToggle(300);
    $(this).toggleClass("t228_opened")
  })
  $(window).bind('resize', t_throttle(function(){
    window_width=$(window).width();
    if(window_width>980){
      menu.fadeIn(0);
    }
  }, 200));
}



 
function t281_initPopup(recid){
  $('#rec'+recid).attr('data-animationappear','off');
  $('#rec'+recid).css('opacity','1');
  var el=$('#rec'+recid).find('.t-popup'),
      hook=el.attr('data-tooltip-hook'),
      analitics=el.attr('data-track-popup');
  if(hook!==''){
    var obj = $('a[href="'+hook+'"]');
    obj.click(function(e){
      t281_showPopup(recid);
      t281_resizePopup(recid);
      e.preventDefault();
      if(window.lazy=='y'){t_lazyload_update();}
      if (analitics > '') {
        Tilda.sendEventToStatistics(analitics, hook);
      }
    });
  }
}

function t281_lockScroll(){
  var body = $("body");
	if (!body.hasClass('t-body_scroll-locked')) {
		var bodyScrollTop = (typeof window.pageYOffset !== 'undefined') ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
		body.addClass('t-body_scroll-locked');
		body.css("top","-"+bodyScrollTop+"px");
    body.attr("data-popup-scrolltop",bodyScrollTop);
	}
}

function t281_unlockScroll(){
  var body = $("body");
	if (body.hasClass('t-body_scroll-locked')) {
    var bodyScrollTop = $("body").attr("data-popup-scrolltop");
		body.removeClass('t-body_scroll-locked');
		body.css("top","");
    body.removeAttr("data-popup-scrolltop")
		window.scrollTo(0, bodyScrollTop);
	}
}

function t281_showPopup(recid){
  var el=$('#rec'+recid),
      popup = el.find('.t-popup');

  popup.css('display', 'block');
  setTimeout(function() {
    popup.find('.t-popup__container').addClass('t-popup__container-animated');
    popup.addClass('t-popup_show');
  }, 50);

  $('body').addClass('t-body_popupshowed t281__body_popupshowed');
  /*fix IOS11 cursor bug + general IOS background scroll*/
  if (/iPhone|iPad|iPod/i.test(navigator.userAgent) && !window.MSStream) {
    setTimeout(function() {
      t281_lockScroll();
    }, 500);
  }
  
  el.find('.t-popup').mousedown(function(e){
    if (e.target == this) { t281_closePopup(); }
  });

  el.find('.t-popup__close').click(function(e){
    t281_closePopup();
  });

  el.find('a[href*=#]').click(function(e){
    var url = $(this).attr('href');
    if (!url || (url.substring(0,7) != '#price:' && url.substring(0,7) != '#order:')) {
      t281_closePopup();
      if (!url || url.substring(0,7) == '#popup:') {
        setTimeout(function() {
          $('body').addClass('t-body_popupshowed');
        }, 300);
      }
    }
  });

  $(document).keydown(function(e) {
    if (e.keyCode == 27) { t281_closePopup(); }
  });
}

function t281_closePopup(){
  $('body').removeClass('t-body_popupshowed t281__body_popupshowed');
  /*fix IOS11 cursor bug + general IOS background scroll*/
  if (/iPhone|iPad|iPod/i.test(navigator.userAgent) && !window.MSStream) {
    t281_unlockScroll();
  }  
  $('.t-popup').removeClass('t-popup_show');
  setTimeout(function() {
    $('.t-popup').not('.t-popup_show').css('display', 'none');
  }, 300);
}

function t281_resizePopup(recid){
  var el = $("#rec"+recid),
      div = el.find(".t-popup__container").height(),
      win = $(window).height() - 120,
      popup = el.find(".t-popup__container");
  if (div > win ) {
    popup.addClass('t-popup__container-static');
  } else {
    popup.removeClass('t-popup__container-static');
  }
}

function t281_sendPopupEventToStatistics(popupname) {
  var virtPage = '/tilda/popup/';
  var virtTitle = 'Popup: ';
  if (popupname.substring(0,7) == '#popup:') {
      popupname = popupname.substring(7);
  }
    
  virtPage += popupname;
  virtTitle += popupname;
  if (window.Tilda && typeof Tilda.sendEventToStatistics == 'function') {
    Tilda.sendEventToStatistics(virtPage, virtTitle, '', 0);
  } else {
    if(ga) {
      if (window.mainTracker != 'tilda') {
        ga('send', {'hitType':'pageview', 'page':virtPage,'title':virtTitle});
      }
    }
  
    if (window.mainMetrika > '' && window[window.mainMetrika]) {
      window[window.mainMetrika].hit(virtPage, {title: virtTitle,referer: window.location.href});
    }
  }
} 
function t347_setHeight(recid){
  var el=$('#rec'+recid);
  var div = el.find(".t347__table");
  var height=div.width() * 0.5625;
  div.height(height);
}

window.t347showvideo = function(recid){
    $(document).ready(function(){
        var el = $('#rec'+recid);
        var videourl = '';

        var youtubeid=$("#rec"+recid+" .t347__video-container").attr('data-content-popup-video-url-youtube');
        if(youtubeid > '') {
            videourl = 'https://www.youtube.com/embed/' + youtubeid;
        }

        $("#rec"+recid+" .t347__video-container").removeClass( "t347__hidden");
        $("#rec"+recid+" .t347__video-carier").html("<iframe id=\"youtubeiframe"+recid+"\" class=\"t347__iframe\" width=\"100%\" height=\"100%\" src=\"" + videourl + "?autoplay=1&rel=0\" frameborder=\"0\" allowfullscreen></iframe>");
    });
}

window.t347hidevideo = function(recid){
    $(document).ready(function(){
        $("#rec"+recid+" .t347__video-container").addClass( "t347__hidden");
        $("#rec"+recid+" .t347__video-carier").html("");
    });
} 
function t395_init(recid){
  var el=$('#rec'+recid);
  el.find('.t395__tab').click(function() {
    el.find('.t395__tab').removeClass('t395__tab_active');
    $(this).addClass('t395__tab_active');
  t395_alltabs_updateContent(recid);
    t395_updateSelect(recid);
    $('.t347').trigger('displayChanged');
    $('.t346').trigger('displayChanged');
    $('.t764, .t506, .t675, .t570, .t774, .t397, .t504, .t498, .t778, .t592, .t477, .t480, .t511, .t552, .t132, .t598, .t599, .t650, .t659, .t351, .t353, .t341, .t404, .t385, .t386, .t409, .t384, .t279, .t349, .t433, .t418, .t268, .t428, .t532, .t601, .t478, .t228, .t229, .t456, .t520, .t615, .t517, .t688, .t744, .t609, .t604, .t670, .t686, .t554, .t230, .t486, .t117, .t422, .t616, .t121, .t801, .t412, .t760, .t827, .t829, .t762, .t826, .t734, .t726, .t799, .t842, .t843, .t849, .t850, .t851, .t856, .t858, .t859, .t860, .t518, .t396, .t728, .t738, .t544, .t780, .t698, .t509, .t431, .t700, .t223, .t539, .t577, .t226, .t754, .t776, .t-feed, .t-store, .t923').trigger('displayChanged');
    setTimeout(function(){
      $('.t351, .t353, .t341, .t404, .t385, .t386, .t409, .t384, .t279, .t349, .t410, .t433, .t418, .t520, .t829, .t396, .t738').trigger('displayChanged');
    },50);
    t395_startUpdateLazyLoad($(this));
    if(window.lazy=='y'){t_lazyload_update();}
  });
  t395_alltabs_updateContent(recid);
  t395_updateContentBySelect(recid);
  var bgcolor=el.css("background-color");
  var bgcolor_target=el.find(".t395__select, .t395__firefoxfix");
  bgcolor_target.css("background", bgcolor);
  $('#rec'+recid + ' .t395__wrapper_mobile .t395__select option').first().attr('selected', true);
}

function t395_alltabs_updateContent(recid){
  var el=$('#rec'+recid);
  el.find(".t395__tab").each(function (i) {
    var rec_ids = $(this).attr('data-tab-rec-ids').split(',');
  rec_ids.forEach(function(rec_id, i, arr) {
    var rec_el=$('#rec'+rec_id);
    rec_el.attr('data-connect-with-tab','yes');
    rec_el.attr('data-animationappear','off');
    rec_el.addClass('t379__off');
  });
  });

  el.find(".t395__tab_active").each(function (i) {
    var rec_ids = $(this).attr('data-tab-rec-ids').split(',');
  rec_ids.forEach(function(rec_id, i, arr) {
    //console.log(rec_id);
    var rec_el=$('#rec'+rec_id);
    rec_el.removeClass('t379__off');
    rec_el.css('opacity','');
  });
  });
}

function t395_updateContentBySelect(recid) {
  var el=$('#rec'+recid);
  el.find(".t395__select").change(function() {
    var select_val = el.find(".t395__select").val();
    var tab_index = el.find(".t395__tab[data-tab-rec-ids='" + select_val + "']");
    tab_index.trigger('click');
  });
}

function t395_updateSelect(recid) {
  var el=$('#rec'+recid);
  var current_tab = el.find(".t395__tab_active").attr('data-tab-rec-ids');
  var el_select=el.find(".t395__select");
  el_select.val(current_tab);
}

function t395_startUpdateLazyLoad($this) {
    var rec_ids = $this.attr('data-tab-rec-ids').split(',');
    rec_ids.forEach(function(rec_id, i, arr) {
	  var rec_el=$('#rec'+rec_id);

      var video = rec_el.find('.t-video-lazyload');
      if (video.length > 0) {
          t395_updateVideoLazyLoad(video);
      }
	});
}

function t395_updateVideoLazyLoad(video) {
    setTimeout(function() {
        video.each(function() {
            var div = $(this);

            if (!div.hasClass('t-video__isload')) {

                var height = div.attr('data-videolazy-height') ? $(this).attr('data-videolazy-height') : '100%';
                if (height.indexOf('vh') != -1) {
                    height = '100%';
                }

                var videoId = div.attr('data-videolazy-id').trim();
                var blockId = div.attr('data-blocklazy-id') || '';
                if (typeof div.attr('data-videolazy-two-id') != 'undefined') {
                  var videoTwoId = '_' + div.attr('data-videolazy-two-id') + '_';
                } else {
                  var videoTwoId = '';
                }

                if (div.attr('data-videolazy-type') == 'youtube') {
                    div.find('iframe').remove();
                    div.prepend('<iframe id="youtubeiframe' + videoTwoId + blockId + '" width="100%" height="' + height + '" src="//www.youtube.com/embed/' + videoId + '?rel=0&fmt=18&html5=1&showinfo=0" frameborder="0" allowfullscreen></iframe>');
                }
            }

            div.addClass('t-video__isload');
        });
    }, 0);
}

 

function t396_init(recid){var data='';var res=t396_detectResolution();t396_initTNobj();t396_switchResolution(res);t396_updateTNobj();t396_artboard_build(data,recid);window.tn_window_width=$(window).width();$( window ).resize(function () {tn_console('>>>> t396: Window on Resize event >>>>');t396_waitForFinalEvent(function(){if($isMobile){var ww=$(window).width();if(ww!=window.tn_window_width){t396_doResize(recid);}}else{t396_doResize(recid);}}, 500, 'resizeruniqueid'+recid);});$(window).on("orientationchange",function(){tn_console('>>>> t396: Orient change event >>>>');t396_waitForFinalEvent(function(){t396_doResize(recid);}, 600, 'orientationuniqueid'+recid);});$( window ).load(function() {var ab=$('#rec'+recid).find('.t396__artboard');t396_allelems__renderView(ab);});var rec = $('#rec' + recid);if (rec.attr('data-connect-with-tab') == 'yes') {rec.find('.t396').bind('displayChanged', function() {var ab = rec.find('.t396__artboard');t396_allelems__renderView(ab);});}}function t396_doResize(recid){var ww=$(window).width();window.tn_window_width=ww;var res=t396_detectResolution();var ab=$('#rec'+recid).find('.t396__artboard');t396_switchResolution(res);t396_updateTNobj();t396_ab__renderView(ab);t396_allelems__renderView(ab);}function t396_detectResolution(){var ww=$(window).width();var res;res=1200;if(ww<1200){res=960;}if(ww<960){res=640;}if(ww<640){res=480;}if(ww<480){res=320;}return(res);}function t396_initTNobj(){tn_console('func: initTNobj');window.tn={};window.tn.canvas_min_sizes = ["320","480","640","960","1200"];window.tn.canvas_max_sizes = ["480","640","960","1200",""];window.tn.ab_fields = ["height","width","bgcolor","bgimg","bgattachment","bgposition","filteropacity","filtercolor","filteropacity2","filtercolor2","height_vh","valign"];}function t396_updateTNobj(){tn_console('func: updateTNobj');if(typeof window.zero_window_width_hook!='undefined' && window.zero_window_width_hook=='allrecords' && $('#allrecords').length){window.tn.window_width = parseInt($('#allrecords').width());}else{window.tn.window_width = parseInt($(window).width());}/* window.tn.window_width = parseInt($(window).width()); */window.tn.window_height = parseInt($(window).height());if(window.tn.curResolution==1200){window.tn.canvas_min_width = 1200;window.tn.canvas_max_width = window.tn.window_width;}if(window.tn.curResolution==960){window.tn.canvas_min_width = 960;window.tn.canvas_max_width = 1200;}if(window.tn.curResolution==640){window.tn.canvas_min_width = 640;window.tn.canvas_max_width = 960;}if(window.tn.curResolution==480){window.tn.canvas_min_width = 480;window.tn.canvas_max_width = 640;}if(window.tn.curResolution==320){window.tn.canvas_min_width = 320;window.tn.canvas_max_width = 480;}window.tn.grid_width = window.tn.canvas_min_width;window.tn.grid_offset_left = parseFloat( (window.tn.window_width-window.tn.grid_width)/2 );}var t396_waitForFinalEvent = (function () {var timers = {};return function (callback, ms, uniqueId) {if (!uniqueId) {uniqueId = "Don't call this twice without a uniqueId";}if (timers[uniqueId]) {clearTimeout (timers[uniqueId]);}timers[uniqueId] = setTimeout(callback, ms);};})();function t396_switchResolution(res,resmax){tn_console('func: switchResolution');if(typeof resmax=='undefined'){if(res==1200)resmax='';if(res==960)resmax=1200;if(res==640)resmax=960;if(res==480)resmax=640;if(res==320)resmax=480;}window.tn.curResolution=res;window.tn.curResolution_max=resmax;}function t396_artboard_build(data,recid){tn_console('func: t396_artboard_build. Recid:'+recid);tn_console(data);/* set style to artboard */var ab=$('#rec'+recid).find('.t396__artboard');t396_ab__renderView(ab);/* create elements */ab.find('.tn-elem').each(function() {var item=$(this);if(item.attr('data-elem-type')=='text'){t396_addText(ab,item);}if(item.attr('data-elem-type')=='image'){t396_addImage(ab,item);}if(item.attr('data-elem-type')=='shape'){t396_addShape(ab,item);}if(item.attr('data-elem-type')=='button'){t396_addButton(ab,item);}if(item.attr('data-elem-type')=='video'){t396_addVideo(ab,item);}if(item.attr('data-elem-type')=='html'){t396_addHtml(ab,item);}if(item.attr('data-elem-type')=='tooltip'){t396_addTooltip(ab,item);}if(item.attr('data-elem-type')=='form'){t396_addForm(ab,item);}if(item.attr('data-elem-type')=='gallery'){t396_addGallery(ab,item);}});$('#rec'+recid).find('.t396__artboard').removeClass('rendering').addClass('rendered');if(ab.attr('data-artboard-ovrflw')=='visible'){$('#allrecords').css('overflow','hidden');}if($isMobile){$('#rec'+recid).append('<style>@media only screen and (min-width:1366px) and (orientation:landscape) and (-webkit-min-device-pixel-ratio:2) {.t396__carrier {background-attachment:scroll!important;}}</style>');}}function t396_ab__renderView(ab){var fields = window.tn.ab_fields;for ( var i = 0; i < fields.length; i++ ) {t396_ab__renderViewOneField(ab,fields[i]);}var ab_min_height=t396_ab__getFieldValue(ab,'height');var ab_max_height=t396_ab__getHeight(ab);var offset_top=0;if(ab_min_height==ab_max_height){offset_top=0;}else{var ab_valign=t396_ab__getFieldValue(ab,'valign');if(ab_valign=='top'){offset_top=0;}else if(ab_valign=='center'){offset_top=parseFloat( (ab_max_height-ab_min_height)/2 ).toFixed(1);}else if(ab_valign=='bottom'){offset_top=parseFloat( (ab_max_height-ab_min_height) ).toFixed(1);}else if(ab_valign=='stretch'){offset_top=0;ab_min_height=ab_max_height;}else{offset_top=0;}}ab.attr('data-artboard-proxy-min-offset-top',offset_top);ab.attr('data-artboard-proxy-min-height',ab_min_height);ab.attr('data-artboard-proxy-max-height',ab_max_height);}function t396_addText(ab,el){tn_console('func: addText');/* add data atributes */var fields_str='top,left,width,container,axisx,axisy,widthunits,leftunits,topunits';var fields=fields_str.split(',');el.attr('data-fields',fields_str);/* render elem view */t396_elem__renderView(el);}function t396_addImage(ab,el){tn_console('func: addImage');/* add data atributes */var fields_str='img,width,filewidth,fileheight,top,left,container,axisx,axisy,widthunits,leftunits,topunits';var fields=fields_str.split(',');el.attr('data-fields',fields_str);/* render elem view */t396_elem__renderView(el);el.find('img').on("load", function() {t396_elem__renderViewOneField(el,'top');if(typeof $(this).attr('src')!='undefined' && $(this).attr('src')!=''){setTimeout( function() { t396_elem__renderViewOneField(el,'top');} , 2000);} }).each(function() {if(this.complete) $(this).load();}); el.find('img').on('tuwidget_done', function(e, file) { t396_elem__renderViewOneField(el,'top');});}function t396_addShape(ab,el){tn_console('func: addShape');/* add data atributes */var fields_str='width,height,top,left,';fields_str+='container,axisx,axisy,widthunits,heightunits,leftunits,topunits';var fields=fields_str.split(',');el.attr('data-fields',fields_str);/* render elem view */t396_elem__renderView(el);}function t396_addButton(ab,el){tn_console('func: addButton');/* add data atributes */var fields_str='top,left,width,height,container,axisx,axisy,caption,leftunits,topunits';var fields=fields_str.split(',');el.attr('data-fields',fields_str);/* render elem view */t396_elem__renderView(el);return(el);}function t396_addVideo(ab,el){tn_console('func: addVideo');/* add data atributes */var fields_str='width,height,top,left,';fields_str+='container,axisx,axisy,widthunits,heightunits,leftunits,topunits';var fields=fields_str.split(',');el.attr('data-fields',fields_str);/* render elem view */t396_elem__renderView(el);var viel=el.find('.tn-atom__videoiframe');var viatel=el.find('.tn-atom');viatel.css('background-color','#000');var vihascover=viatel.attr('data-atom-video-has-cover');if(typeof vihascover=='undefined'){vihascover='';}if(vihascover=='y'){viatel.click(function() {var viifel=viel.find('iframe');if(viifel.length){var foo=viifel.attr('data-original');viifel.attr('src',foo);}viatel.css('background-image','none');viatel.find('.tn-atom__video-play-link').css('display','none');});}var autoplay=t396_elem__getFieldValue(el,'autoplay');var showinfo=t396_elem__getFieldValue(el,'showinfo');var loop=t396_elem__getFieldValue(el,'loop');var mute=t396_elem__getFieldValue(el,'mute');var startsec=t396_elem__getFieldValue(el,'startsec');var endsec=t396_elem__getFieldValue(el,'endsec');var tmode=$('#allrecords').attr('data-tilda-mode');var url='';var viyid=viel.attr('data-youtubeid');if(typeof viyid!='undefined' && viyid!=''){ url='//www.youtube.com/embed/'; url+=viyid+'?rel=0&fmt=18&html5=1'; url+='&showinfo='+(showinfo=='y'?'1':'0'); if(loop=='y'){url+='&loop=1&playlist='+viyid;} if(startsec>0){url+='&start='+startsec;} if(endsec>0){url+='&end='+endsec;} if(mute=='y'){url+='&mute=1';} if(vihascover=='y'){ url+='&autoplay=1'; viel.html('<iframe id="youtubeiframe" width="100%" height="100%" data-original="'+url+'" frameborder="0" allowfullscreen data-flag-inst="y"></iframe>'); }else{ if(typeof tmode!='undefined' && tmode=='edit'){}else{ if(autoplay=='y'){url+='&autoplay=1';} } if(window.lazy=='y'){ viel.html('<iframe id="youtubeiframe" class="t-iframe" width="100%" height="100%" data-original="'+url+'" frameborder="0" allowfullscreen data-flag-inst="lazy"></iframe>'); el.append('<script>lazyload_iframe = new LazyLoad({elements_selector: ".t-iframe"});</script>'); }else{ viel.html('<iframe id="youtubeiframe" width="100%" height="100%" src="'+url+'" frameborder="0" allowfullscreen data-flag-inst="y"></iframe>'); } }}var vivid=viel.attr('data-vimeoid');if(typeof vivid!='undefined' && vivid>0){url='//player.vimeo.com/video/';url+=vivid+'?color=ffffff&badge=0';if(showinfo=='y'){url+='&title=1&byline=1&portrait=1';}else{url+='&title=0&byline=0&portrait=0';}if(loop=='y'){url+='&loop=1';}if(mute=='y'){url+='&muted=1';}if(vihascover=='y'){url+='&autoplay=1';viel.html('<iframe data-original="'+url+'" width="100%" height="100%" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>');}else{if(typeof tmode!='undefined' && tmode=='edit'){}else{if(autoplay=='y'){url+='&autoplay=1';}}if(window.lazy=='y'){viel.html('<iframe class="t-iframe" data-original="'+url+'" width="100%" height="100%" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>');el.append('<script>lazyload_iframe = new LazyLoad({elements_selector: ".t-iframe"});</script>');}else{viel.html('<iframe src="'+url+'" width="100%" height="100%" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>');}}}}function t396_addHtml(ab,el){tn_console('func: addHtml');/* add data atributes */var fields_str='width,height,top,left,';fields_str+='container,axisx,axisy,widthunits,heightunits,leftunits,topunits';var fields=fields_str.split(',');el.attr('data-fields',fields_str);/* render elem view */t396_elem__renderView(el);}function t396_addTooltip(ab, el) {tn_console('func: addTooltip');var fields_str = 'width,height,top,left,';fields_str += 'container,axisx,axisy,widthunits,heightunits,leftunits,topunits,tipposition';var fields = fields_str.split(',');el.attr('data-fields', fields_str);t396_elem__renderView(el);var pinEl = el.find('.tn-atom__pin');var tipEl = el.find('.tn-atom__tip');var tipopen = el.attr('data-field-tipopen-value');if (isMobile || (typeof tipopen!='undefined' && tipopen=='click')) {t396_setUpTooltip_mobile(el,pinEl,tipEl);} else {t396_setUpTooltip_desktop(el,pinEl,tipEl);}setTimeout(function() {$('.tn-atom__tip-img').each(function() {var foo = $(this).attr('data-tipimg-original');if (typeof foo != 'undefined' && foo != '') {$(this).attr('src', foo);}})}, 3000);}function t396_addForm(ab,el){tn_console('func: addForm');/* add data atributes */var fields_str='width,top,left,';fields_str+='inputs,container,axisx,axisy,widthunits,leftunits,topunits';var fields=fields_str.split(',');el.attr('data-fields',fields_str);/* render elem view */t396_elem__renderView(el);}function t396_addGallery(ab,el){tn_console('func: addForm');/* add data atributes */var fields_str='width,height,top,left,';fields_str+='imgs,container,axisx,axisy,widthunits,heightunits,leftunits,topunits';var fields=fields_str.split(',');el.attr('data-fields',fields_str);/* render elem view */t396_elem__renderView(el);}function t396_elem__setFieldValue(el,prop,val,flag_render,flag_updateui,res){if(res=='')res=window.tn.curResolution;if(res<1200 && prop!='zindex'){el.attr('data-field-'+prop+'-res-'+res+'-value',val);}else{el.attr('data-field-'+prop+'-value',val);}if(flag_render=='render')elem__renderViewOneField(el,prop);if(flag_updateui=='updateui')panelSettings__updateUi(el,prop,val);}function t396_elem__getFieldValue(el,prop){var res=window.tn.curResolution;var r;if(res<1200){if(res==960){r=el.attr('data-field-'+prop+'-res-960-value');if(typeof r=='undefined'){r=el.attr('data-field-'+prop+'-value');}}if(res==640){r=el.attr('data-field-'+prop+'-res-640-value');if(typeof r=='undefined'){r=el.attr('data-field-'+prop+'-res-960-value');if(typeof r=='undefined'){r=el.attr('data-field-'+prop+'-value');}}}if(res==480){r=el.attr('data-field-'+prop+'-res-480-value');if(typeof r=='undefined'){r=el.attr('data-field-'+prop+'-res-640-value');if(typeof r=='undefined'){r=el.attr('data-field-'+prop+'-res-960-value');if(typeof r=='undefined'){r=el.attr('data-field-'+prop+'-value');}}}}if(res==320){r=el.attr('data-field-'+prop+'-res-320-value');if(typeof r=='undefined'){r=el.attr('data-field-'+prop+'-res-480-value');if(typeof r=='undefined'){r=el.attr('data-field-'+prop+'-res-640-value');if(typeof r=='undefined'){r=el.attr('data-field-'+prop+'-res-960-value');if(typeof r=='undefined'){r=el.attr('data-field-'+prop+'-value');}}}}}}else{r=el.attr('data-field-'+prop+'-value');}return(r);}function t396_elem__renderView(el){tn_console('func: elem__renderView');var fields=el.attr('data-fields');if(! fields) {return false;}fields = fields.split(',');/* set to element value of every fieldvia css */for ( var i = 0; i < fields.length; i++ ) {t396_elem__renderViewOneField(el,fields[i]);}}function t396_elem__renderViewOneField(el,field){var value=t396_elem__getFieldValue(el,field);if(field=='left'){value = t396_elem__convertPosition__Local__toAbsolute(el,field,value);el.css('left',parseFloat(value).toFixed(1)+'px');}if(field=='top'){value = t396_elem__convertPosition__Local__toAbsolute(el,field,value);el.css('top',parseFloat(value).toFixed(1)+'px');}if(field=='width'){value = t396_elem__getWidth(el,value);el.css('width',parseFloat(value).toFixed(1)+'px');var eltype=el.attr('data-elem-type');if(eltype=='tooltip'){var pinSvgIcon = el.find('.tn-atom__pin-icon');/*add width to svg nearest parent to fix InternerExplorer problem*/if (pinSvgIcon.length > 0) {var pinSize = parseFloat(value).toFixed(1) + 'px';pinSvgIcon.css({'width': pinSize, 'height': pinSize});}el.css('height',parseInt(value).toFixed(1)+'px');}if(eltype=='gallery') {var borderWidth = t396_elem__getFieldValue(el, 'borderwidth');var borderStyle = t396_elem__getFieldValue(el, 'borderstyle');if (borderStyle=='none' || typeof borderStyle=='undefined' || typeof borderWidth=='undefined' || borderWidth=='') borderWidth=0;value = value*1 - borderWidth*2;el.css('width', parseFloat(value).toFixed(1)+'px');el.find('.t-slds__main').css('width', parseFloat(value).toFixed(1)+'px');el.find('.tn-atom__slds-img').css('width', parseFloat(value).toFixed(1)+'px');}}if(field=='height'){var eltype = el.attr('data-elem-type');if (eltype == 'tooltip') {return;}value=t396_elem__getHeight(el,value);el.css('height', parseFloat(value).toFixed(1)+'px');if (eltype === 'gallery') {var borderWidth = t396_elem__getFieldValue(el, 'borderwidth');var borderStyle = t396_elem__getFieldValue(el, 'borderstyle');if (borderStyle=='none' || typeof borderStyle=='undefined' || typeof borderWidth=='undefined' || borderWidth=='') borderWidth=0;value = value*1 - borderWidth*2;el.css('height',parseFloat(value).toFixed(1)+'px');el.find('.tn-atom__slds-img').css('height', parseFloat(value).toFixed(1) + 'px');el.find('.t-slds__main').css('height', parseFloat(value).toFixed(1) + 'px');}}if(field=='container'){t396_elem__renderViewOneField(el,'left');t396_elem__renderViewOneField(el,'top');}if(field=='width' || field=='height' || field=='fontsize' || field=='fontfamily' || field=='letterspacing' || field=='fontweight' || field=='img'){t396_elem__renderViewOneField(el,'left');t396_elem__renderViewOneField(el,'top');}if(field=='inputs'){value=el.find('.tn-atom__inputs-textarea').val();try {t_zeroForms__renderForm(el,value);} catch (err) {}}}function t396_elem__convertPosition__Local__toAbsolute(el,field,value){value = parseInt(value);if(field=='left'){var el_container,offset_left,el_container_width,el_width;var container=t396_elem__getFieldValue(el,'container');if(container=='grid'){el_container = 'grid';offset_left = window.tn.grid_offset_left;el_container_width = window.tn.grid_width;}else{el_container = 'window';offset_left = 0;el_container_width = window.tn.window_width;}/* fluid or not*/var el_leftunits=t396_elem__getFieldValue(el,'leftunits');if(el_leftunits=='%'){value = t396_roundFloat( el_container_width * value/100 );}value = offset_left + value;var el_axisx=t396_elem__getFieldValue(el,'axisx');if(el_axisx=='center'){el_width = t396_elem__getWidth(el);value = el_container_width/2 - el_width/2 + value;}if(el_axisx=='right'){el_width = t396_elem__getWidth(el);value = el_container_width - el_width + value;}}if(field=='top'){var ab=el.parent();var el_container,offset_top,el_container_height,el_height;var container=t396_elem__getFieldValue(el,'container');if(container=='grid'){el_container = 'grid';offset_top = parseFloat( ab.attr('data-artboard-proxy-min-offset-top') );el_container_height = parseFloat( ab.attr('data-artboard-proxy-min-height') );}else{el_container = 'window';offset_top = 0;el_container_height = parseFloat( ab.attr('data-artboard-proxy-max-height') );}/* fluid or not*/var el_topunits=t396_elem__getFieldValue(el,'topunits');if(el_topunits=='%'){value = ( el_container_height * (value/100) );}value = offset_top + value;var el_axisy=t396_elem__getFieldValue(el,'axisy');if(el_axisy=='center'){/* var el_height=parseFloat(el.innerHeight()); */el_height=t396_elem__getHeight(el);value = el_container_height/2 - el_height/2 + value;}if(el_axisy=='bottom'){/* var el_height=parseFloat(el.innerHeight()); */el_height=t396_elem__getHeight(el);value = el_container_height - el_height + value;} }return(value);}function t396_ab__setFieldValue(ab,prop,val,res){/* tn_console('func: ab__setFieldValue '+prop+'='+val);*/if(res=='')res=window.tn.curResolution;if(res<1200){ab.attr('data-artboard-'+prop+'-res-'+res,val);}else{ab.attr('data-artboard-'+prop,val);}}function t396_ab__getFieldValue(ab,prop){var res=window.tn.curResolution;var r;if(res<1200){if(res==960){r=ab.attr('data-artboard-'+prop+'-res-960');if(typeof r=='undefined'){r=ab.attr('data-artboard-'+prop+'');}}if(res==640){r=ab.attr('data-artboard-'+prop+'-res-640');if(typeof r=='undefined'){r=ab.attr('data-artboard-'+prop+'-res-960');if(typeof r=='undefined'){r=ab.attr('data-artboard-'+prop+'');}}}if(res==480){r=ab.attr('data-artboard-'+prop+'-res-480');if(typeof r=='undefined'){r=ab.attr('data-artboard-'+prop+'-res-640');if(typeof r=='undefined'){r=ab.attr('data-artboard-'+prop+'-res-960');if(typeof r=='undefined'){r=ab.attr('data-artboard-'+prop+'');}}}}if(res==320){r=ab.attr('data-artboard-'+prop+'-res-320');if(typeof r=='undefined'){r=ab.attr('data-artboard-'+prop+'-res-480');if(typeof r=='undefined'){r=ab.attr('data-artboard-'+prop+'-res-640');if(typeof r=='undefined'){r=ab.attr('data-artboard-'+prop+'-res-960');if(typeof r=='undefined'){r=ab.attr('data-artboard-'+prop+'');}}}}}}else{r=ab.attr('data-artboard-'+prop);}return(r);}function t396_ab__renderViewOneField(ab,field){var value=t396_ab__getFieldValue(ab,field);}function t396_allelems__renderView(ab){tn_console('func: allelems__renderView: abid:'+ab.attr('data-artboard-recid'));ab.find(".tn-elem").each(function() {t396_elem__renderView($(this));});}function t396_ab__filterUpdate(ab){var filter=ab.find('.t396__filter');var c1=filter.attr('data-filtercolor-rgb');var c2=filter.attr('data-filtercolor2-rgb');var o1=filter.attr('data-filteropacity');var o2=filter.attr('data-filteropacity2');if((typeof c2=='undefined' || c2=='') && (typeof c1!='undefined' && c1!='')){filter.css("background-color", "rgba("+c1+","+o1+")");}else if((typeof c1=='undefined' || c1=='') && (typeof c2!='undefined' && c2!='')){filter.css("background-color", "rgba("+c2+","+o2+")");}else if(typeof c1!='undefined' && typeof c2!='undefined' && c1!='' && c2!=''){filter.css({background: "-webkit-gradient(linear, left top, left bottom, from(rgba("+c1+","+o1+")), to(rgba("+c2+","+o2+")) )" });}else{filter.css("background-color", 'transparent');}}function t396_ab__getHeight(ab, ab_height){if(typeof ab_height=='undefined')ab_height=t396_ab__getFieldValue(ab,'height');ab_height=parseFloat(ab_height);/* get Artboard height (fluid or px) */var ab_height_vh=t396_ab__getFieldValue(ab,'height_vh');if(ab_height_vh!=''){ab_height_vh=parseFloat(ab_height_vh);if(isNaN(ab_height_vh)===false){var ab_height_vh_px=parseFloat( window.tn.window_height * parseFloat(ab_height_vh/100) );if( ab_height < ab_height_vh_px ){ab_height=ab_height_vh_px;}}} return(ab_height);} function t396_hex2rgb(hexStr){/*note: hexStr should be #rrggbb */var hex = parseInt(hexStr.substring(1), 16);var r = (hex & 0xff0000) >> 16;var g = (hex & 0x00ff00) >> 8;var b = hex & 0x0000ff;return [r, g, b];}String.prototype.t396_replaceAll = function(search, replacement) {var target = this;return target.replace(new RegExp(search, 'g'), replacement);};function t396_elem__getWidth(el,value){if(typeof value=='undefined')value=parseFloat( t396_elem__getFieldValue(el,'width') );var el_widthunits=t396_elem__getFieldValue(el,'widthunits');if(el_widthunits=='%'){var el_container=t396_elem__getFieldValue(el,'container');if(el_container=='window'){value=parseFloat( window.tn.window_width * parseFloat( parseInt(value)/100 ) );}else{value=parseFloat( window.tn.grid_width * parseFloat( parseInt(value)/100 ) );}}return(value);}function t396_elem__getHeight(el,value){if(typeof value=='undefined')value=t396_elem__getFieldValue(el,'height');value=parseFloat(value);if(el.attr('data-elem-type')=='shape' || el.attr('data-elem-type')=='video' || el.attr('data-elem-type')=='html' || el.attr('data-elem-type')=='gallery'){var el_heightunits=t396_elem__getFieldValue(el,'heightunits');if(el_heightunits=='%'){var ab=el.parent();var ab_min_height=parseFloat( ab.attr('data-artboard-proxy-min-height') );var ab_max_height=parseFloat( ab.attr('data-artboard-proxy-max-height') );var el_container=t396_elem__getFieldValue(el,'container');if(el_container=='window'){value=parseFloat( ab_max_height * parseFloat( value/100 ) );}else{value=parseFloat( ab_min_height * parseFloat( value/100 ) );}}}else if(el.attr('data-elem-type')=='button'){value = value;}else{value =parseFloat(el.innerHeight());}return(value);}function t396_roundFloat(n){n = Math.round(n * 100) / 100;return(n);}function tn_console(str){if(window.tn_comments==1)console.log(str);}function t396_setUpTooltip_desktop(el, pinEl, tipEl) {var timer;pinEl.mouseover(function() {/*if any other tooltip is waiting its timeout to be hided — hide it*/$('.tn-atom__tip_visible').each(function(){var thisTipEl = $(this).parents('.t396__elem');if (thisTipEl.attr('data-elem-id') != el.attr('data-elem-id')) {t396_hideTooltip(thisTipEl, $(this));}});clearTimeout(timer);if (tipEl.css('display') == 'block') {return;}t396_showTooltip(el, tipEl);});pinEl.mouseout(function() {timer = setTimeout(function() {t396_hideTooltip(el, tipEl);}, 300);})}function t396_setUpTooltip_mobile(el,pinEl,tipEl) {pinEl.on('click', function(e) {if (tipEl.css('display') == 'block' && $(e.target).hasClass("tn-atom__pin")) {t396_hideTooltip(el,tipEl);} else {t396_showTooltip(el,tipEl);}});var id = el.attr("data-elem-id");$(document).click(function(e) {var isInsideTooltip = ($(e.target).hasClass("tn-atom__pin") || $(e.target).parents(".tn-atom__pin").length > 0);if (isInsideTooltip) {var clickedPinId = $(e.target).parents(".t396__elem").attr("data-elem-id");if (clickedPinId == id) {return;}}t396_hideTooltip(el,tipEl);})}function t396_hideTooltip(el, tipEl) {tipEl.css('display', '');tipEl.css({"left": "","transform": "","right": ""});tipEl.removeClass('tn-atom__tip_visible');el.css('z-index', '');}function t396_showTooltip(el, tipEl) {var pos = el.attr("data-field-tipposition-value");if (typeof pos == 'undefined' || pos == '') {pos = 'top';};var elSize = el.height();var elTop = el.offset().top;var elBottom = elTop + elSize;var elLeft = el.offset().left;var elRight = el.offset().left + elSize;var winTop = $(window).scrollTop();var winWidth = $(window).width();var winBottom = winTop + $(window).height();var tipElHeight = tipEl.outerHeight();var tipElWidth = tipEl.outerWidth();var padd=15;if (pos == 'right' || pos == 'left') {var tipElRight = elRight + padd + tipElWidth;var tipElLeft = elLeft - padd - tipElWidth;if ((pos == 'right' && tipElRight > winWidth) || (pos == 'left' && tipElLeft < 0)) {pos = 'top';}}if (pos == 'top' || pos == 'bottom') {var tipElRight = elRight + (tipElWidth / 2 - elSize / 2);var tipElLeft = elLeft - (tipElWidth / 2 - elSize / 2);if (tipElRight > winWidth) {var rightOffset = -(winWidth - elRight - padd);tipEl.css({"left": "auto","transform": "none","right": rightOffset + "px"});}if (tipElLeft < 0) {var leftOffset = -(elLeft - padd);tipEl.css({"left": leftOffset + "px","transform": "none"});}}if (pos == 'top') {var tipElTop = elTop - padd - tipElHeight;if (winTop > tipElTop) {pos = 'bottom';}}if (pos == 'bottom') {var tipElBottom = elBottom + padd + tipElHeight;if (winBottom < tipElBottom) {pos = 'top';}}tipEl.attr('data-tip-pos', pos);tipEl.css('display', 'block');tipEl.addClass('tn-atom__tip_visible');el.css('z-index', '1000');}function t396_hex2rgba(hexStr, opacity){var hex = parseInt(hexStr.substring(1), 16);var r = (hex & 0xff0000) >> 16;var g = (hex & 0x00ff00) >> 8;var b = hex & 0x0000ff;return [r, g, b, parseFloat(opacity)];} 
 
function t451_showMenu(recid){
  var el=$('#rec'+recid);
  $('body').addClass('t451__body_menushowed');
  el.find('.t451m').addClass('t451m__menu_show');
  el.find('.t451m__overlay').addClass('t451m__menu_show');
  el.find('.t451m__overlay, .t451m__close, a[href*=#]').click(function(){
    if ($(this).is(".tooltipstered, .t794__tm-link")) { return; }  
    t451_closeMenu();
  });
  $(document).keydown(function(e) {
    if (e.keyCode == 27) {
      $('body').removeClass('t451__body_menushowed');
      $('.t451m').removeClass('t451m__menu_show');
      $('.t451m__overlay').removeClass('t451m__menu_show');
    }
});
}

function t451_closeMenu(){
  $('body').removeClass('t451__body_menushowed');
  $('.t451m').removeClass('t451m__menu_show');
  $('.t451m__overlay').removeClass('t451m__menu_show');
}

function t451_checkSize(recid){
  var el=$('#rec'+recid).find('.t451m');
  var windowheight = $(window).height() - 80;
  var contentheight = el.find(".t451m__top").height() + el.find(".t451m__rightside").height();
  if (contentheight > windowheight) {
    el.addClass('t451m__overflowed');
    el.find(".t451m__container").css('height', 'auto');
  }
}

function t451_initMenu(recid){
  var el=$('#rec'+recid);
  var obj = el.find('.t451__burger');
  obj.click(function(e){
    t451_closeMenu();
    t451_showMenu(recid);
    t451_checkSize(recid);
    e.preventDefault();
  });
  $('.t451').bind('clickedAnchorInTooltipMenu',function(){
    t451_closeMenu();
  });
  
  if (isMobile) {
    $('#rec'+recid).find('.t-menu__link-item').each(function() {
      var $this = $(this);
      if ($this.hasClass('t451__link-item_submenu')) {
        $this.on('click', function() {
          setTimeout(function() {
            t451_checkSize(recid);
          }, 100);
        });
      }
    });
  }
}

function t451_highlight(){
  var url=window.location.href;
  var pathname=window.location.pathname;
  if(url.substr(url.length - 1) == "/"){ url = url.slice(0,-1); }
  if(pathname.substr(pathname.length - 1) == "/"){ pathname = pathname.slice(0,-1); }
  if(pathname.charAt(0) == "/"){ pathname = pathname.slice(1); }
  if(pathname == ""){ pathname = "/"; }
  $(".t451__list_item a[href='"+url+"']").addClass("t-active");
  $(".t451__list_item a[href='"+url+"/']").addClass("t-active");
  $(".t451__list_item a[href='"+pathname+"']").addClass("t-active");
  $(".t451__list_item a[href='/"+pathname+"']").addClass("t-active");
  $(".t451__list_item a[href='"+pathname+"/']").addClass("t-active");
  $(".t451__list_item a[href='/"+pathname+"/']").addClass("t-active");
}   

function t451_changeBgOpacityMenu(recid) {
  var window_width=$(window).width();
  var record = $("#rec"+recid);
  record.find(".t451__container__bg").each(function() {
        var el=$(this);
        var bgcolor=el.attr("data-bgcolor-rgba");
        var bgcolor_afterscroll=el.attr("data-bgcolor-rgba-afterscroll");
        var bgopacity=el.attr("data-bgopacity");
        var bgopacity_afterscroll=el.attr("data-bgopacity2");
        var menu_shadow=el.attr("data-menu-shadow");
        if ($(window).scrollTop() > 20) {
            el.css("background-color",bgcolor_afterscroll);
            if (bgopacity_afterscroll != "0" && bgopacity_afterscroll != "0.0") {
              el.css('box-shadow',menu_shadow);
            } else {
              el.css('box-shadow','none');
            }
        }else{
            el.css("background-color",bgcolor);
            if (bgopacity != "0" && bgopacity != "0.0") {
              el.css('box-shadow',menu_shadow);
            } else {
              el.css('box-shadow','none');
            }
        }
  });
}

function t451_appearMenu(recid) {
      var window_width=$(window).width();
      var record = $("#rec"+recid);
           record.find(".t451__panel").each(function() {
                  var el=$(this);
                  var appearoffset=el.attr("data-appearoffset");
console.log(appearoffset)
                  if(appearoffset!=""){
                          if(appearoffset.indexOf('vh') > -1){
                              appearoffset = Math.floor((window.innerHeight * (parseInt(appearoffset) / 100)));
                          }

                          appearoffset=parseInt(appearoffset, 10);

                          if ($(window).scrollTop() >= appearoffset) {
                            if(el.hasClass('t451__beforeready')){
                                el.removeClass('t451__beforeready');
                            }
                          }else{
                            el.addClass('t451__beforeready');
                          }
                  }
           });

}

 
function t452_scrollToTop(){
  $('html, body').animate({scrollTop: 0}, 700);								
}	  
function t509_setHeight(recid) {  
  var t509__el=$("#rec"+recid);	
  var t509__image = t509__el.find(".t509__blockimg");
  t509__image.each(function() {
    var t509__width = $(this).attr("data-image-width");
    var t509__height = $(this).attr("data-image-height");	
    var t509__ratio = t509__height/t509__width;
    var t509__padding = t509__ratio*100;    	
    $(this).css("padding-bottom",t509__padding+"%");		
  });
  
  if ($(window).width()>960){
    var t509__textwr = t509__el.find(".t509__textwrapper");
    var t509__deskimg = t509__el.find(".t509__desktopimg");
    t509__textwr.each(function() {    
    $(this).css("height", t509__deskimg.innerHeight());	
    });
  }
}
 
function t585_init(recid){
  var el= $('#rec'+recid),
      toggler = el.find(".t585__header");
  
  toggler.click(function(){
    $(this).toggleClass("t585__opened");
    $(this).next().slideToggle();
    if(window.lazy=='y'){t_lazyload_update();}
  });
}
 
function t694_init(recid){
	t694_setHeight(recid);
	var t694__doResize;
	$(window).resize(function(){
		clearTimeout(t694__doResize);
		t694__doResize = setTimeout(function() {
			t694_setHeight(recid);
		}, 200);
	});
}

function t694_setHeight(recid){
	var t694_el = $('#rec'+recid+' .t694'),
		t694_ratio = t694_el.attr('data-tile-ratio'),
		t694_ratioHeight = t694_el.find('.t694__col').width()*t694_ratio;

	if($(window).width()>=768){
        t694_el.find('.t694__row').each(function() {
            var t694_largestHeight = 0,                
                t694_currow = $(this);

            $('.t694__table', this).each(function(){
                var t694_curCol = $(this),
                    t694_curColHeight = t694_curCol.find(".t694__textwrapper").outerHeight();
                if ($(this).find(".t694__cell").hasClass("t694__button-bottom")){ t694_curColHeight+= t694_curCol.find(".t694__button-container").outerHeight(); }
                if(t694_curColHeight > t694_largestHeight){ t694_largestHeight = t694_curColHeight; }
            });

            if (t694_largestHeight>t694_ratioHeight){
                $('.t694__table',this).css('height', t694_largestHeight);
            } else {
                if ($('.t694__table',this).css('height')!='') {
                  $('.t694__table',this).css('height','');
                }
            }					
        });
	} else {
		t694_el.find('.t694__table').css('height','');
	}
}
 
function t704_onSuccess(t704_form){
	var t704_inputsWrapper = t704_form.find('.t-form__inputsbox');
    var t704_inputsHeight = t704_inputsWrapper.height();
    var t704_inputsOffset = t704_inputsWrapper.offset().top;
    var t704_inputsBottom = t704_inputsHeight + t704_inputsOffset;
	var t704_targetOffset = t704_form.find('.t-form__successbox').offset().top;

    if ($(window).width()>960) {
        var t704_target = t704_targetOffset - 200;
    }	else {
        var t704_target = t704_targetOffset - 100;
    }

    if (t704_targetOffset > $(window).scrollTop() || ($(document).height() - t704_inputsBottom) < ($(window).height() - 100)) {
        t704_inputsWrapper.addClass('t704__inputsbox_hidden');
		setTimeout(function(){
			if ($(window).height() > $('.t-body').height()) {$('.t-tildalabel').animate({ opacity:0 }, 50);}
		}, 300);
    } else {
        $('html, body').animate({ scrollTop: t704_target}, 400);
        setTimeout(function(){t704_inputsWrapper.addClass('t704__inputsbox_hidden');}, 400);
    }

	var successurl = t704_form.data('success-url');
    if(successurl && successurl.length > 0) {
        setTimeout(function(){
            window.location.href= successurl;
        },500);
    }

}
 
function t706_onSuccessCallback(t706_form){
 /*if (typeof localStorage === 'object') {
	try {
	  localStorage.removeItem("tcart");
	} catch (e) {
	  console.log('Your web browser does not support localStorage.');
	}
 }		
 delete window.tcart;
 tcart__loadLocalObj();*/
 $( ".t706__cartwin-products" ).slideUp( 10, function() {	
 });
 $( ".t706__cartwin-bottom" ).slideUp( 10, function() {	
 });
 $( ".t706 .t-form__inputsbox" ).slideUp( 700, function() {	
 });
 /*window.tcart_success='yes';*/
 try {
	/*fix IOS11 cursor bug + general IOS background scroll*/
	tcart__unlockScroll();
 } catch (e) {}
} 
function t764_updateSlider(recid){
  var el=$('#rec'+recid);
  t_slds_SliderWidth(recid);
  sliderWrapper = el.find('.t-slds__items-wrapper');
  sliderWidth = el.find('.t-slds__container').width();
  pos = parseFloat(sliderWrapper.attr('data-slider-pos'));
  sliderWrapper.css({
      transform: 'translate3d(-' + (sliderWidth * pos) + 'px, 0, 0)'
  });
  t_slds_UpdateSliderHeight(recid);
  t_slds_UpdateSliderArrowsHeight(recid);
} 
function t766_init(recid){
  t_sldsInit(recid);

  setTimeout(function(){
    t_prod__init(recid);
    t766_initPopup(recid);
  }, 500);
}


function t766_showPopup(recid){
  var el=$('#rec'+recid),
      popup = el.find('.t-popup'),
      sliderWrapper = el.find('.t-slds__items-wrapper'),
      sliderWidth = el.find('.t-slds__container').width(),
      pos = parseFloat(sliderWrapper.attr('data-slider-pos'));

  popup.css('display', 'block');

  setTimeout(function() {
    popup.find('.t-popup__container').addClass('t-popup__container-animated');
    popup.addClass('t-popup_show');
    t_slds_SliderWidth(recid);
    sliderWrapper = el.find('.t-slds__items-wrapper');
    sliderWidth = el.find('.t-slds__container').width();
    pos = parseFloat(sliderWrapper.attr('data-slider-pos'));
    sliderWrapper.css({
        transform: 'translate3d(-' + (sliderWidth * pos) + 'px, 0, 0)'
    });
    t_slds_UpdateSliderHeight(recid);
    t_slds_UpdateSliderArrowsHeight(recid);
    if(window.lazy=='y'){t_lazyload_update();}
  }, 50);

  $('body').addClass('t-body_popupshowed');

  el.find('.t-popup').mousedown(function(e){
    if (e.target == this) { t766_closePopup(); }
  });

  el.find('.t-popup__close, .t766__close-text').click(function(e){
    t766_closePopup();
  });

  el.find('a[href*=#]').click(function(e){
    var url = $(this).attr('href');
    if (!url || url.substring(0,7) != '#price:') {
      t766_closePopup();
      if (!url || url.substring(0,7) == '#popup:') {
        setTimeout(function() {
          $('body').addClass('t-body_popupshowed');
        }, 300);
      }
    }
  });

  $(document).keydown(function(e) {
    if (e.keyCode == 27) { t766_closePopup(); }
  });
}

function t766_closePopup(){
  $('body').removeClass('t-body_popupshowed');
  $('.t-popup').removeClass('t-popup_show');
  setTimeout(function() {
    $('.t-popup').not('.t-popup_show').css('display', 'none');
  }, 300);
}
/* deprecated */
function t766_sendPopupEventToStatistics(popupname) {
  var virtPage = '/tilda/popup/';
  var virtTitle = 'Popup: ';
  if (popupname.substring(0,7) == '#popup:') {
      popupname = popupname.substring(7);
  }
    
  virtPage += popupname;
  virtTitle += popupname;
  if (window.Tilda && typeof Tilda.sendEventToStatistics == 'function') {
    Tilda.sendEventToStatistics(virtPage, virtTitle, '', 0);
  } else {
    if(ga) {
      if (window.mainTracker != 'tilda') {
        ga('send', {'hitType':'pageview', 'page':virtPage,'title':virtTitle});
      }
    }
  
    if (window.mainMetrika > '' && window[window.mainMetrika]) {
      window[window.mainMetrika].hit(virtPage, {title: virtTitle,referer: window.location.href});
    }
  }
}

function t766_initPopup(recid){
  $('#rec'+recid).attr('data-animationappear','off');
  $('#rec'+recid).css('opacity','1');
  var el=$('#rec'+recid).find('.t-popup'),
      hook=el.attr('data-tooltip-hook'),
      analitics=el.attr('data-track-popup');
  t_sldsInit(recid);
  if(hook!==''){
    var obj = $('a[href="'+hook+'"]');
    obj.click(function(e){
      t766_showPopup(recid);
      e.preventDefault();

      if (analitics > '') {
        var virtTitle = hook;
        if (virtTitle.substring(0,7) == '#popup:') {
            virtTitle = virtTitle.substring(7);
        }
        Tilda.sendEventToStatistics(analitics, virtTitle);
      }
    });
  }
}
 
function t802_insta_init(recid,instauser){
    var projectid=$('#allrecords').attr('data-tilda-project-id');
    t802_insta_loadflow(recid,projectid,instauser);
}

function t802_insta_loadflow(recid,projectid,instauser){
    if (instauser == '') {
        var url = "https://insta.tildacdn.com/fish/0.json";
    } else {
        var url = "https://insta.tildacdn.com/json/project"+projectid+"_"+instauser+".json";
    }

    $.ajax({
      type: "GET",
      url: url,
      dataType : "json",
      success: function(data){
            if(typeof data=='object'){
                t802_insta_draw(recid,data);
            }else{
                console.log('error. insta flow json not object');
                console.log(data);
            }
      },
      error: function(){
          console.log('error load instgram flow');
      },
      timeout: 1000*90
    });       
}

function t802_insta_draw(recid,obj){
	if(typeof obj.photos=='undefined'){return;}
	$.each(obj.photos, function(index, item) {
	    t802_insta_drawItem(recid,obj.username,item);
	});		
}

function t802_insta_drawItem(recid,username,item){
    var emptyEl = $("#rec"+recid).find(".t802__imgwrapper_empty").first();
    if (emptyEl.length > 0) {
        emptyEl.removeClass("t802__imgwrapper_empty");
        emptyEl.append('<div class="t802__bgimg" style="background-image:url('+item.url+')"></div>');
        emptyEl.wrap('<a href="'+item.link+'" target="_blank"></a>');
        
        /*add text and filter for hover*/
        var hoverEl = emptyEl.find(".t802__hover-wrapper");
        if (hoverEl.length > 0 && isMobile == false) {
            var text = t802_insta_cropText(recid,'@'+username+': '+item.text);
            hoverEl.append('<div class="t802__hover-filter"></div>');
            hoverEl.append('<div class="t802__text t-text t-descr_xxs">'+text+'</div>');
        }
    }
}

function t802_insta_cropText(recid,text){
    var colsInLine = $("#rec"+recid).find("[data-cols-in-line]").attr("data-cols-in-line");
    if (colsInLine == 6) {
        var maxLength = 90;
    } else {
        var maxLength = 130;    
    }
    if (text.length > maxLength) {
        text = text.substring(0, maxLength);
        text = text.substring(0, Math.min(maxLength,text.lastIndexOf(" ")));
        text += ' ...';
    }
    return text;
} 
function t825_initPopup(recid) {
  var rec = $('#rec' + recid);
  $('#rec' + recid).attr('data-animationappear', 'off');
  $('#rec' + recid).css('opacity', '1');
  var el = $('#rec' + recid).find('.t825__popup');
  var analitics = el.attr('data-track-popup');
  var hook="TildaSendMessageWidget" + recid;
  var obj = $('#rec' + recid + ' .t825__btn');

  obj.click(function(e) {
    if (obj.hasClass('t825__btn_active')) {
  		t825_closePopup(rec);
  		return;
	}
  obj.addClass('t825__btn_active');
	$('#rec' + recid + ' .t825').addClass('t825_active');
    t825_showPopup(recid);
    e.preventDefault();
    if (analitics > '') {
        Tilda.sendEventToStatistics(analitics, hook);
    }
  });

  if(window.lazy == 'y'){t_lazyload_update();}

  t825_checkPhoneNumber(recid);
}


function t825_showPopup(recid) {
  var el = $('#rec' + recid);
  var popup = el.find('.t825__popup');

  el.find('.t825__btn_wrapper').removeClass('t825__btn_animate');
  el.find('.t825__btn-text').css('display','none');
  if ($(window).width() < 960) { $('body').addClass('t825__body_popupshowed'); }

  popup.css('display', 'block');
  setTimeout(function() {
    popup.addClass('t825__popup_show');
  }, 50);

  el.find('.t825__mobile-icon-close').click(function(e) { t825_closePopup(el); });

  $(document).keydown(function(e) {
    if (e.keyCode == 27) { t825_closePopup(el); }
  });

  if(window.lazy == 'y'){t_lazyload_update();}
}

function t825_closePopup(rec) {
  if ($(window).width() < 960) { $('body').removeClass('t825__body_popupshowed'); }
  rec.find('.t825').removeClass('t825_active');
  rec.find('.t825__btn').removeClass('t825__btn_active');
  rec.find('.t825__popup').removeClass('t825__popup_show');
  setTimeout(function() {
    rec.find('.t825__popup').not('.t825__popup_show').css('display', 'none');
  }, 300);
}


function t825_checkPhoneNumber(recid) {
  var el = $('#rec' + recid);
  var whatsapp = el.find('.t825__whatsapp').attr('data-messenger-whatsapp');
  var telegram = el.find('.t825__telegram').attr('data-messenger-telegram');
  var telegramLink = el.find('.t825__telegram_link').attr('data-messenger-telegram-link');
  var vk = el.find('.t825__vk').attr('data-messenger-vk');
  var skype = el.find('.t825__skype').attr('data-messenger-skype');
  var skypeChat = el.find('.t825__skype_chat').attr('data-messenger-skype-chat');
  var mail = el.find('.t825__mail').attr('data-messenger-mail');
  var viber = el.find('.t825__viber').attr('data-messenger-viber');
  var fb = el.find('.t825__fb').attr('data-messenger-fb');
  var phone = el.find('.t825__phone').attr('data-messenger-phone');

  if (typeof telegramLink != 'undefined') {
      if (telegramLink.search(/http/i) !== -1) {
          el.find('.t825__telegram_link').attr('href', telegramLink);
      } else {
          if (telegramLink.search(/tg/i) !== -1) {
            el.find('.t825__telegram_link').attr('href', telegramLink);
          } else {
            el.find('.t825__telegram_link').attr('href', 'https://'+telegramLink);
          }
      }
  }

  if (typeof whatsapp != 'undefined') {
    el.find('.t825__whatsapp').attr('href', 'https://api.whatsapp.com/send?phone='+whatsapp.replace(/[+?^${}()|[\]\\\s]/g,''));
  }

  el.find('.t825__telegram').attr('href', 'https://t.me/'+telegram);
  el.find('.t825__vk').attr('href', 'https://vk.me/'+vk);

  if (typeof skype != 'undefined') {
    el.find('.t825__skype').attr('href', 'skype:'+skype.replace(/[+?^${}()|[\]\\\s]/g,'')+'?call');
  }

  if (typeof skypeChat != 'undefined') {
    el.find('.t825__skype_chat').attr('href', 'skype:'+skypeChat.replace(/[+?^${}()|[\]\\\s]/g,'')+'?chat');
  }

  if (typeof viber != 'undefined') {
    el.find('.t825__viber').attr('href', 'viber://chat?number=%2B'+viber.replace(/[+?^${}()|[\]\\\s]/g,''));
  }

  el.find('.t825__mail').attr('href', 'mailto:'+mail);

  el.find('.t825__fb').attr('href', 'https://m.me/'+fb);

  if (typeof phone != 'undefined') {
    el.find('.t825__phone').attr('href', 'tel:+'+phone.replace(/[+?^${}()|[\]\\\s]/g,''));
  }
}

function t825_sendPopupEventToStatistics(popupname) {
  var virtPage = '/tilda/popup/';
  var virtTitle = 'Popup: ';
  if (popupname.substring(0,7) == '#popup:') {
    popupname = popupname.substring(7);
  }

  virtPage += popupname;
  virtTitle += popupname;
  if (window.Tilda && typeof Tilda.sendEventToStatistics == 'function') {
    Tilda.sendEventToStatistics(virtPage, virtTitle, '', 0);
  } else {
    if(ga) {
      if (window.mainTracker != 'tilda') {
        ga('send', {'hitType':'pageview', 'page':virtPage,'title':virtTitle});
      }
    }
    if (window.mainMetrika > '' && window[window.mainMetrika]) {
      window[window.mainMetrika].hit(virtPage, {title: virtTitle,referer: window.location.href});
    }
  }
}
 
function t827_init(recid) {
  var rec = $('#rec'+recid);
  var grid = rec.find('.t827__grid');
  var sizer = rec.find('.t827__grid-sizer');
  var item = rec.find('.t827__grid-item');
  var images = rec.find('.t827__grid img');
  var overlay = rec.find('.t827__overlay');
  var startContainerWidth = rec.find('.t827__grid-sizer').width();
  
  t827_reverse(grid, item);

  images.load(function() {
    t827_initMasonry(rec, recid, grid);
    setTimeout(function(){t827_showOverlay(overlay, item);}, 500);
  });

  if (overlay.hasClass('t827__overlay_preview')) {
    setTimeout(function(){
      t827_showOverlay(overlay, item);
    }, 1000);
  }

  t827_initMasonry(rec, recid, grid);

  $(window).bind('resize', function() {
    if (typeof window.noAdaptive!="undefined" && window.noAdaptive==true && $isMobile){return;}
    t827_calcColumnWidth(rec, startContainerWidth, grid, sizer, item);
  });

  $('.t827').bind('displayChanged', function() {
    t827_initMasonry(rec, recid, grid);
    t827_calcColumnWidth(rec, startContainerWidth, grid, sizer, item);
  });

  t827_calcColumnWidth(rec, startContainerWidth, grid, sizer, item);
}


function t827_reverse(grid, item) {
  if (grid.hasClass('t827__grid_reverse')) {
    grid.append(function() {
      return $(this).children().get().reverse();
    });
  }
}


function t827_initMasonry(rec, recid, grid) {
  var $grid = grid;
  var gutterSizerWidth = rec.find('.t827__gutter-sizer').width();
  var gutterElement = rec.find('.t827__gutter-sizer').width() == 40 ? 39 : '#rec' + recid + ' .t827__gutter-sizer';
  $grid.imagesLoaded(function(){
    $grid.masonry({
      itemSelector: '#rec' + recid + ' .t827__grid-item',
      columnWidth: '#rec' + recid + ' .t827__grid-sizer',
      gutter: gutterElement,
      isFitWidth: true
    });
  });
}

function t827_showOverlay(overlay, item) {

  if ($(window).width() >= 1024) {
    overlay.css('display', 'block');
  } else {
    item.click(function() {
      if ($(this).find('.t827__overlay').css('opacity') == '0') {
        overlay.css('opacity', '0');
        $(this).find('.t827__overlay').css('opacity', '1');
      } else {
        $(this).find('.t827__overlay').css('opacity', '0');
      }
    });
  }
}

function t827_calcColumnWidth(rec, startcontainerwidth, grid, sizer, item) {
  var containerWidth = rec.find('.t827__container').width();
  var sizerWidth = rec.find('.t827__grid-sizer').width();
  var itemWidth = rec.find('.t827__grid-item').width();
  var gutterSizerWidth = rec.find('.t827__gutter-sizer').width() == 40 ? 39 : rec.find('.t827__gutter-sizer').width();
  var columnAmount = Math.round(containerWidth / startcontainerwidth);
  var newSizerWidth = ((containerWidth - gutterSizerWidth * (columnAmount - 1)) / columnAmount);

  if (containerWidth >= itemWidth) {
    sizer.css('width', newSizerWidth);
    item.css('width', newSizerWidth);
  } else {
    grid.css('width', '100%');
    sizer.css('width', '100%');
    item.css('width', '100%');
  }
}
 
function t868_setHeight(recid) {
  var rec = $('#rec' + recid);
  var div = rec.find('.t868__video-carier');
  var height = div.width() * 0.5625;
  div.height(height);
  div.parent().height(height);
}


function t868_initPopup(recid) {
  var rec = $('#rec' + recid);
  $('#rec' + recid).attr('data-animationappear', 'off');
  $('#rec' + recid).css('opacity', '1');
  var el = $('#rec' + recid).find('.t-popup');
  var hook = el.attr('data-tooltip-hook');
  var analitics = el.attr('data-track-popup');
  var customCodeHTML = t868__readCustomCode(rec);

  if (hook !== '') {
    var obj = $('a[href="' + hook + '"]');
    obj.click(function(e) {
      t868_showPopup(recid, customCodeHTML);
      t868_resizePopup(recid);
      e.preventDefault();
      if (analitics > '') {
        var virtTitle = hook;
        if (virtTitle.substring(0,7) == '#popup:') {
          virtTitle = virtTitle.substring(7);
        }
        Tilda.sendEventToStatistics(analitics, virtTitle);
      }
    });
  }
}


function t868__readCustomCode(rec) {
  var customCode = rec.find('.t868 .t868__code-wrap').html();
  rec.find('.t868 .t868__code-wrap').remove();
  return customCode;
}


function t868_showPopup(recid, customCodeHTML) {
  var rec = $('#rec' + recid);
  var popup = rec.find('.t-popup');
  var popupContainer = rec.find('.t-popup__container');
  popupContainer.append(customCodeHTML);

  popup.css('display', 'block');
  t868_setHeight(recid);
  setTimeout(function() {
    popup.find('.t-popup__container').addClass('t-popup__container-animated');
    popup.addClass('t-popup_show');
  }, 50);

  $('body').addClass('t-body_popupshowed');

  rec.find('.t-popup').mousedown(function(e) {
    if (e.target == this) {
      t868_closePopup(recid);
    }
  });

  rec.find('.t-popup__close').click(function(e) {
    t868_closePopup(recid);
  });

  rec.find('a[href*=#]').click(function(e) {
    var url = $(this).attr('href');
    if (url.indexOf('#order') != -1) {
        var popupContainer = rec.find('.t-popup__container');
        setTimeout(function() {
            popupContainer.empty();
        }, 600);
    }
    if (!url || url.substring(0,7) != '#price:') {
      t868_closePopup();
      if (!url || url.substring(0,7) == '#popup:') {
        setTimeout(function() {
          $('body').addClass('t-body_popupshowed');
        }, 300);
      }
    }
  });

  $(document).keydown(function(e) {
    if (e.keyCode == 27) { t868_closePopup(recid); }
  });
}


function t868_closePopup(recid) {
  var rec = $('#rec' + recid);
  var popup = rec.find('.t-popup');
  var popupContainer = rec.find('.t-popup__container');

  $('body').removeClass('t-body_popupshowed');
  $('.t-popup').removeClass('t-popup_show');
  popupContainer.empty();

  setTimeout(function() {
    $('.t-popup').not('.t-popup_show').css('display', 'none');
  }, 300);
}


function t868_resizePopup(recid) {
  var rec = $('#rec' + recid);
  var div = rec.find('.t-popup__container').height();
  var win = $(window).height();
  var popup = rec.find('.t-popup__container');
  if (div > win ) {
    popup.addClass('t-popup__container-static');
  } else {
    popup.removeClass('t-popup__container-static');
  }
}


/* deprecated */
function t868_sendPopupEventToStatistics(popupname) {
  var virtPage = '/tilda/popup/';
  var virtTitle = 'Popup: ';
  if (popupname.substring(0,7) == '#popup:') {
    popupname = popupname.substring(7);
  }

  virtPage += popupname;
  virtTitle += popupname;

  if(ga) {
    if (window.mainTracker != 'tilda') {
      ga('send', {'hitType':'pageview', 'page':virtPage, 'title':virtTitle});
    }
  }

  if (window.mainMetrika > '' && window[window.mainMetrika]) {
    window[window.mainMetrika].hit(virtPage, {title: virtTitle,referer: window.location.href});
  }
}

/* 
    Document   : rydan-marquee.js
    Created on : Dec 7, 2013
    Author     : Ryan Consylman
    Description:
        Define JavaScript for the marquee plugin by
        Ryan Consylman, www.rydan.net, available for download
        at http://tools.rydan.net/jquery_marquee.php
*/

(function ($) {
    var RydanMarquee = function () {
        default_settings = {
            elements: {},
            orientation: "vertical",
            speed: 1500,
            gap: 0,
            begin: true,
            loop: true
        },
        default_control = {
            sizes: [],
            total_size: 0,
            num_elements: 0,
            average: 0,
            status: "waiting",
            stopped_elements: 0
        },
        /*
         * Vertical and Horizontal functions are very similar in function,
         * but vertical works off the top, and horizontal works off left
         * position.
         * -Ryan Consylman
         */
        vstart = function(marquee){
            $(marquee).data('marquee').status = 'running';
            var data = $(marquee).data('marquee');
            
            var i = 0;
            $.each(data.elements, function (j, k) {
                $(k).parent().css({
                    "top": i+"px",
                    opacity: 1
                });
                i += data.sizes[j];
                doVertScroll(data, $(k), j);
            });
        },
        doVertScroll = function(data, element, index) {
            var $ele = $(element).parent();
            var top = parseInt($ele.css("top"));
            
            if (top < -data.sizes[index]) {
                top += data.total_size;
                $ele.css("top", top+"px");
            }
            $ele.animate({
                top: (parseInt(top) - data.average)
            }, data.speed, 'linear', function () {
                if(data.status === 'running'){
                    doVertScroll(data, $(element), index);
                }
                else {
                    clearVertElements(data, $(element), index);
                }
            });
        },
        clearVertElements = function(data, element, index){
            var $ele = $(element).parent();
            var top = parseInt($ele.css("top"));
            
            if (top < -data.sizes[index]) {
                $ele.css("opacity", "0");
                data.stopped_elements++;
                if(data.stopped_elements === data.num_elements){
                    data.status = 'waiting';
                    data.stopped_elements = 0;
                }
            }
            else {
                $ele.animate({
                    top: (parseInt(top) - data.average)
                }, data.speed, 'linear', function () {
                    clearVertElements(data, $(element), index);
                });
            }
        },
        hstart = function(marquee){
            $(marquee).data('marquee').status = 'running';
            var data = $(marquee).data('marquee');
    
            var i = 0;
            $.each(data.elements, function (j, k) {
                $(k).parent().css({
                    "left": i+"px",
                    opacity: 1
                });
                i += data.sizes[j];
                doHortScroll(data, $(k), j);
            });
        },
        doHortScroll = function(data, element, index) {
            var $ele = $(element).parent();
            var left = parseInt($ele.css("left"));
            
            if (left < -data.sizes[index]) {
                left += data.total_size;
                $ele.css("left", left+"px");
            }
            $ele.animate({
                left: (parseInt(left) - data.average)
            }, data.speed, 'linear', function () {
                if(data.status === 'running'){
                    doHortScroll(data, $(element), index);
                }
                else {
                    clearHortElements(data, $(element), index);
                }
            });
        },
        clearHortElements = function(data, element, index){
            var $ele = $(element).parent();
            var left = parseInt($ele.css("left"));
            
            if (left < -data.sizes[index]) {
                $ele.css("opacity", "0");
                data.stopped_elements++;
                if(data.stopped_elements === data.num_elements){
                    data.status = 'waiting';
                    data.stopped_elements = 0;
                }
            }
            else {
                $ele.animate({
                    left: (parseInt(left) - data.average)
                }, data.speed, 'linear', function () {
                    clearHortElements(data, $(element), index);
                });
            }
        };
        return {
            init: function (opt) {
                var options = $.extend({}, default_settings, opt||{}); 
                
                //Executed on init for each requested item
                return this.each(function (m, marquee) {
                    if (!$(marquee).data('marqueeID')) {
                        default_control.sizes = [];
                        var control = $.extend({}, default_control, {});

                        var id = 'marquee_' + parseInt(Math.random() * 9999);
                        $(marquee).data('marqueeID', id);
                        $(marquee).attr("rel", id);

                        var marquee_width = $(marquee).width();
                        var marquee_height = $(marquee).height();
                        $(marquee).css({
                            overflow: "hidden",
                            position: "relative"
                        });

                        //Populate necessary elements
                        $.each(options.elements, function(i, element){

                            if(options.orientation === "vertical"){
                                //Set element CSS
                                $(element).css({
                                    display: "block",
                                    margin: "auto"
                                });

                                //Populate items into the marquee
                                $('<div>', { 
                                    class: 'marquee-element',
                                    css: {
                                        width: marquee_width+"px",
                                        opacity: "0",
                                        position: "absolute"
                                    }
                                }).append(element).appendTo(marquee);

                                //Gather height info
                                control.num_elements++;
                                var item_height = $(element).height() + options.gap;
                                control.total_size += item_height;
                                control.sizes.push(item_height);
                            }
                            else {
                                //Set element CSS
                                $(element).css({
                                    display: "inline-block",
                                    margin: "auto",
                                    verticalAlign: "middle"
                                });

                                //Populate items into the marquee
                                $('<div>', { 
                                    class: 'marquee-element',
                                    css: {
                                        lineHeight: marquee_height+"px",
                                        opacity: "0.2",
                                        position: "absolute"
                                    }
                                }).append(element).appendTo(marquee);

                                //Gather width info
                                control.num_elements++;
                                var item_width = $(element).width() + options.gap;
                                control.total_size += item_width;
                                control.sizes.push(item_width);
                            }
                        });
                        control.average = Math.ceil(control.total_size / control.num_elements);

                        options = $.extend({}, options, control);
                        $(marquee).data('marquee', options);

                        if(options.begin){
                            if(options.orientation === "vertical")
                                vstart(marquee);
                            else
                                hstart(marquee);
                        }
                    }
                });
            },
            //Call to stop the marquee
            stop: function(){
                return this.each(function (m, marquee) {
                    if($(marquee).data("marqueeID") && $(marquee).data('marquee').status==='running'){
                        $(marquee).data("marquee").status = "stop called";
                    }
                });
            },
            //Call to start the marquee
            start: function(){
                return this.each(function (m, marquee) {
                    if($(marquee).data("marqueeID") && $(marquee).data('marquee').status==='waiting'){
                        if($(marquee).data('marquee').orientation === "vertical")
                            vstart(marquee);
                        else
                            hstart(marquee);
                    }
                });
            }
        };
    }();
    $.fn.extend({
        RydanMarquee: RydanMarquee.init,
        RydanMarqueeStart: RydanMarquee.start,
        RydanMarqueeStop: RydanMarquee.stop
    });
})(jQuery);

// ==UserScript==
// @name        Wiki Table of Contents
// @namespace   wikitoc
// @description Wiki Table of Contents
// @require     http://code.jquery.com/jquery-1.3.2.min.js
// @include     https://en.wikipedia.org/*
// @include      *wiki*
// @grant
// @version     1
// ==/UserScript==



console.log("script init");


var wikitoc=
{
    init:function(o)
    {
        var toc_height = window.innerHeight.toString() + "px";
        var toc_length = "120px";
        $("#toc").css({"z-index": "9999", height: toc_height, width: toc_length, overflow: 'auto', border: '1px solid black', position: 'fixed', left:'2px', top: '0px' });
    
        
        var div_list=document.getElementsByClassName('mw-headline');
        var content_listing = [];
        var chapters_listing = [];
        var cloned_node;
        
        for (var i=0; i<div_list.length; i++)
        {
            //console.log(div_list[i].outerHTML);
            content_listing.push(div_list[i]);
        }
        
        for (var i=0; i<content_listing.length; i++)
        {
            cloned_node = content_listing[i].cloneNode(true);
            //obj.appendChild(cloned_node);
            var anchor_class = content_listing[i].className;
            var active_class = "";
            
            chapters_listing[i]=[
                        content_listing[i],
                        cloned_node,
                        anchor_class,
                        anchor_class+' '+active_class,
                        100 //scrollspeed
                    ];
                    
            //console.log("adding: " + content_listing[i].outerHTML );
        }
        
        o.chapters_listing = chapters_listing;
        
        for (var i=0; i<chapters_listing.length; i++)
        {
            //console.log("verifying: " + chapters_listing[i][1].outerHTML);
        }
        
        this.addevt(window,'scroll','scroll',o);
        this.scroll(o);
    },
    
    scroll:function(o)
    {
        /** event that gets called when user scrolls.
            Hightlights current chapter in the TOC
        */
        
        var nu = 0;
        for (nu=0,i=0; i<o.chapters_listing.length; i++){
            o.chapters_listing[i][1].className=o.chapters_listing[i][2];
            (this.pos(o.chapters_listing[i][0])[1]-this.wwhs()[3]-this.wwhs()[1]/2)<0?nu=i:null;
          
        }
        if (nu != null) {
            console.log("hit paydirt: chapter is " + o.chapters_listing[nu][0].outerHTML);
            o.chapters_listing[nu][1].className=o.chapters_listing[nu][3];
            
            var current_section = o.chapters_listing[nu][0].getAttribute("id")
            this.update_toc(o, current_section)
        }
    },
    
    update_toc:function(o, current_section)
    {
        //given the name of the current_section, update the toc (table of contents) to highlight this section, and also unhighlight any other highlighted sections
        var toc_table = document.getElementById("toc");
        var toc_table_ul = toc_table.lastElementChild
        
        //Given the <ul> of the TOC, find each <a href> and look for current_section
        var anchor_links = toc_table_ul.getElementsByTagName("a")
        for (var index in anchor_links) 
        {
            try 
            {
                var section_tmp = anchor_links[index].getAttribute("href")
                section_tmp = section_tmp.substring(1) //strip away leading # from a href
                if (section_tmp == current_section)
                {
                    //Found the right section, now <bold> the text of this section
                    
                    var new_element = document.createElement("B");
                    new_element.textContent = anchor_links[index].lastChild.textContent
                    anchor_links[index].lastChild.textContent = ""
                    anchor_links[index].lastChild.appendChild(new_element)
                    
                } else 
                {
                    //Not the  right section, remove any <bold> this section
                    
                    var section_name = anchor_links[index].lastChild.lastChild.textContent
                    anchor_links[index].lastChild.removeChild(anchor_links[index].lastChild.lastChild)
                    anchor_links[index].lastChild.textContent = section_name
                }
            } catch (err)
            {
                //console.log("well, you can't quite handle " + anchor_links[index].innerHTML + " " + err)
            }
        }
    },
    
    wwhs:function()
    {
        /** returns:
                clientWidth
                clientHeight
                scrollLeft
                scrollTop
        */
        if (window.innerHeight) 
            return [window.innerWidth-10,window.innerHeight-10,window.pageXOffset,window.pageYOffset];
        else if (document.documentElement.clientHeight) 
            return [document.documentElement.clientWidth-10,document.documentElement.clientHeight-10,document.documentElement.scrollLeft,document.documentElement.scrollTop];
        
        return [document.body.clientWidth,document.body.clientHeight,document.body.scrollLeft,document.body.scrollTop];
    },
    
    
    addevt:function(o,event_name,function_name,p)
    {
        /*
            Docs for EventTarget.addEventListener:
                target.addEventListener(type, listener[, useCapture]);
                target.addEventListener(type, listener[, useCapture, wantsUntrusted Non-standard]); // Gecko/Mozilla only
            
                    type A string representing the event type to listen for.
                    listener The object that receives a notification when an event of the specified type occurs. This must be an object implementing the EventListener interface, or simply a JavaScript function.
        */
        var oop=this;
        if (o.addEventListener){
            o.addEventListener(event_name,function(e){ return oop[function_name](p,e);}, false);
            //console.log("adding event listener:" + event_name + " function_name:" + function_name + " p:" + p);
        }
        else if (o.attachEvent){
            o.attachEvent('on'+event_name,function(e){ return oop[function_name](p,e); });
            //console.log("adding attach event :" + event_name + " function_name:" + function_name + " p:" + p);
        }
    },
    
    pos:function(obj)
    {
        var rtn=[0,0];
        while(obj)
        {
            rtn[0]+=obj.offsetLeft;
            rtn[1]+=obj.offsetTop;
            obj=obj.offsetParent;
        }
        return rtn;
    }
    
}

wikitoc.init({});

console.log("script exit");